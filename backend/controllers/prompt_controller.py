from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from services.prompt_service import PromptService
from schemas.prompt import PromptCreate, PromptUpdate, PromptResponse
from models.prompt import PromptType, PromptCategory, PromptSubcategory
from typing import List, Optional

router = APIRouter()

@router.post("/", response_model=PromptResponse)
async def create_prompt(
    prompt_data: PromptCreate,
    db: Session = Depends(get_db)
):
    """Cria um novo prompt"""
    prompt_service = PromptService(db)
    try:
        prompt = prompt_service.create_prompt(prompt_data)
        return prompt
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao criar prompt: {str(e)}")

@router.get("/", response_model=List[PromptResponse])
async def get_prompts(
    skip: int = 0,
    limit: int = 100,
    prompt_type: Optional[PromptType] = None,
    category: Optional[PromptCategory] = None,
    db: Session = Depends(get_db)
):
    """Lista prompts com filtros opcionais"""
    prompt_service = PromptService(db)
    
    if prompt_type and category:
        prompts = prompt_service.get_prompts_by_type(prompt_type)
        prompts = [p for p in prompts if p.category == category]
    elif prompt_type:
        prompts = prompt_service.get_prompts_by_type(prompt_type)
    elif category:
        prompts = prompt_service.get_prompts_by_category(category)
    else:
        prompts = prompt_service.get_prompts(skip=skip, limit=limit)
    
    return prompts

@router.get("/{prompt_id}", response_model=PromptResponse)
async def get_prompt(
    prompt_id: int,
    db: Session = Depends(get_db)
):
    """Busca um prompt específico por ID"""
    prompt_service = PromptService(db)
    prompt = prompt_service.get_prompt(prompt_id)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt não encontrado")
    return prompt

@router.put("/{prompt_id}", response_model=PromptResponse)
async def update_prompt(
    prompt_id: int,
    prompt_data: PromptUpdate,
    db: Session = Depends(get_db)
):
    """Atualiza um prompt existente"""
    prompt_service = PromptService(db)
    prompt = prompt_service.update_prompt(prompt_id, prompt_data)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt não encontrado")
    return prompt

@router.delete("/{prompt_id}")
async def delete_prompt(
    prompt_id: int,
    db: Session = Depends(get_db)
):
    """Remove um prompt (soft delete)"""
    prompt_service = PromptService(db)
    success = prompt_service.delete_prompt(prompt_id)
    if not success:
        raise HTTPException(status_code=404, detail="Prompt não encontrado")
    return {"message": "Prompt removido com sucesso"}

@router.get("/count/total")
async def get_prompt_count(db: Session = Depends(get_db)):
    """Conta total de prompts ativos"""
    prompt_service = PromptService(db)
    return {"count": prompt_service.get_prompt_count()}

@router.get("/active/{prompt_type}/{category}", response_model=PromptResponse)
async def get_active_prompt(
    prompt_type: PromptType,
    category: PromptCategory,
    db: Session = Depends(get_db)
):
    """Busca o prompt ativo mais recente por tipo e categoria"""
    prompt_service = PromptService(db)
    prompt = prompt_service.get_active_prompt_by_type_and_category(prompt_type, category)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt não encontrado para o tipo e categoria especificados")
    return prompt

@router.get("/types/list")
async def get_prompt_types():
    """Lista todos os tipos de prompt disponíveis"""
    return {
        "types": [{"value": t.value, "label": t.value.replace("_", " ").title()} for t in PromptType],
        "categories": [{"value": c.value, "label": c.value.replace("_", " ").title()} for c in PromptCategory],
        "subcategories": [{"value": s.value, "label": s.value.replace("_", " ").title()} for s in PromptSubcategory]
    }
