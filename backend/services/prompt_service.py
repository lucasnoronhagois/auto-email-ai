from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..models.prompt import Prompt, PromptType, PromptCategory
from ..schemas.prompt import PromptCreate, PromptUpdate
from typing import List, Optional

class PromptService:
    def __init__(self, db: Session):
        self.db = db

    def create_prompt(self, prompt_data: PromptCreate) -> Prompt:
        """Cria um novo prompt"""
        db_prompt = Prompt(**prompt_data.model_dump())
        self.db.add(db_prompt)
        self.db.commit()
        self.db.refresh(db_prompt)
        return db_prompt

    def get_prompt(self, prompt_id: int) -> Optional[Prompt]:
        """Busca um prompt por ID"""
        return self.db.query(Prompt).filter(
            Prompt.id == prompt_id,
            Prompt.is_active == True
        ).first()

    def get_prompts(self, skip: int = 0, limit: int = 100) -> List[Prompt]:
        """Lista todos os prompts ativos"""
        return self.db.query(Prompt).filter(
            Prompt.is_active == True
        ).order_by(desc(Prompt.created_at)).offset(skip).limit(limit).all()

    def get_prompts_by_type(self, prompt_type: PromptType) -> List[Prompt]:
        """Busca prompts por tipo"""
        return self.db.query(Prompt).filter(
            Prompt.type == prompt_type,
            Prompt.is_active == True
        ).order_by(desc(Prompt.created_at)).all()

    def get_prompts_by_category(self, category: PromptCategory) -> List[Prompt]:
        """Busca prompts por categoria"""
        return self.db.query(Prompt).filter(
            Prompt.category == category,
            Prompt.is_active == True
        ).order_by(desc(Prompt.created_at)).all()

    def update_prompt(self, prompt_id: int, prompt_data: PromptUpdate) -> Optional[Prompt]:
        """Atualiza um prompt existente"""
        db_prompt = self.get_prompt(prompt_id)
        if not db_prompt:
            return None
        
        # Atualiza apenas os campos fornecidos
        update_data = prompt_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_prompt, field, value)
        
        self.db.commit()
        self.db.refresh(db_prompt)
        return db_prompt

    def delete_prompt(self, prompt_id: int) -> bool:
        """Soft delete de um prompt (marca como inativo)"""
        db_prompt = self.get_prompt(prompt_id)
        if not db_prompt:
            return False
        
        db_prompt.is_active = False
        self.db.commit()
        return True

    def get_prompt_count(self) -> int:
        """Conta total de prompts ativos"""
        return self.db.query(Prompt).filter(
            Prompt.is_active == True
        ).count()

    def get_active_prompt_by_type_and_category(self, prompt_type: PromptType, category: PromptCategory) -> Optional[Prompt]:
        """Busca o prompt ativo mais recente por tipo e categoria"""
        return self.db.query(Prompt).filter(
            Prompt.type == prompt_type,
            Prompt.category == category,
            Prompt.is_active == True
        ).order_by(desc(Prompt.created_at)).first()
