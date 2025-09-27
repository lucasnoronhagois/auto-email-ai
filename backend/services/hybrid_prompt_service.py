"""
Serviço híbrido de prompts: banco de dados + arquivos locais
Prioridade: Banco > Arquivos Locais > Genérico
"""

from sqlalchemy.orm import Session
from typing import Dict, Optional, List
from ..models.prompt import Prompt, PromptType, PromptCategory
from ..data.prompts import PRODUCTIVE_PROMPTS, UNPRODUCTIVE_PROMPTS
import time

class HybridPromptService:
    def __init__(self, db: Session):
        self.db = db
        self._cache = {}
        self._cache_timeout = 300  # 5 minutos
        self._last_cache_update = 0

    def get_prompt(self, category: str, prompt_type: str = "generation") -> str:
        """
        Busca prompt com prioridade: banco > cache > arquivos locais > genérico
        
        Args:
            category: Categoria do prompt (ex: 'meetings', 'spam_promotions')
            prompt_type: Tipo do prompt (ex: 'generation', 'classification')
        """
        # Limpar cache se expirou
        if time.time() - self._last_cache_update > self._cache_timeout:
            self._clear_cache()
        
        # Chave do cache
        cache_key = f"{category}_{prompt_type}"
        
        # 1. Tentar cache primeiro
        if cache_key in self._cache:
            return self._cache[cache_key]
        
        # 2. Tentar banco de dados (PRIORIDADE)
        db_prompt = self._get_prompt_from_db(category, prompt_type)
        if db_prompt:
            self._cache[cache_key] = db_prompt
            return db_prompt
        
        # 3. Fallback para arquivos locais
        local_prompt = self._get_prompt_from_files(category, prompt_type)
        if local_prompt:
            self._cache[cache_key] = local_prompt
            return local_prompt
        
        # 4. Prompt genérico como último recurso
        generic_prompt = self._get_generic_prompt(prompt_type)
        self._cache[cache_key] = generic_prompt
        return generic_prompt

    def _get_prompt_from_db(self, category: str, prompt_type: str) -> Optional[str]:
        """Busca prompt no banco de dados"""
        try:
            # Mapear string para enum
            category_enum = self._map_category_to_enum(category)
            type_enum = self._map_type_to_enum(prompt_type)
            
            if not category_enum or not type_enum:
                return None
            
            prompt = self.db.query(Prompt).filter(
                Prompt.category == category_enum,
                Prompt.type == type_enum,
                Prompt.is_active == True
            ).order_by(Prompt.created_at.desc()).first()
            
            return prompt.content if prompt else None
            
        except Exception as e:
            print(f"Erro ao buscar prompt no banco: {e}")
            return None

    def _get_prompt_from_files(self, category: str, prompt_type: str) -> Optional[str]:
        """Busca prompt nos arquivos locais"""
        try:
            if prompt_type == "generation":
                # Prompts de geração
                if category in PRODUCTIVE_PROMPTS:
                    return PRODUCTIVE_PROMPTS[category]
                elif category in UNPRODUCTIVE_PROMPTS:
                    return UNPRODUCTIVE_PROMPTS[category]
            
            return None
            
        except Exception as e:
            print(f"Erro ao buscar prompt nos arquivos: {e}")
            return None

    def _get_generic_prompt(self, prompt_type: str) -> str:
        """Prompt genérico como último recurso"""
        if prompt_type == "generation":
            return """
            Você é um assistente corporativo respondendo emails. 
            Gere uma resposta profissional no idioma do email seguindo estas diretrizes:
            - Use tom corporativo formal
            - Seja educado e profissional
            - Mencione que a empresa analisará a solicitação
            - Use assinatura de departamento apropriado
            - Seja conciso, mas completo
            - Email recebido: {email_content}
            
            Resposta:"""
        
        return "Classifique este email como Produtivo ou Improdutivo."

    def _map_category_to_enum(self, category: str) -> Optional[PromptCategory]:
        """Mapeia string para enum PromptCategory"""
        # Mapear para categorias principais (PRODUCTIVE/UNPRODUCTIVE)
        productive_categories = [
            'meetings', 'projects', 'sales_business', 'financial',
            'hr_recruitment', 'technology', 'strategy_planning', 'urgent_important'
        ]
        
        unproductive_categories = [
            'spam_promotions', 'personal_greetings', 'scams_fraud',
            'adult_content', 'social_media'
        ]
        
        if category in productive_categories:
            return PromptCategory.PRODUCTIVE
        elif category in unproductive_categories:
            return PromptCategory.UNPRODUCTIVE
        else:
            return PromptCategory.GENERAL

    def _map_type_to_enum(self, prompt_type: str) -> Optional[PromptType]:
        """Mapeia string para enum PromptType"""
        mapping = {
            'generation': PromptType.RESPONSE_GENERATION,
            'classification': PromptType.CLASSIFICATION
        }
        return mapping.get(prompt_type)

    def _clear_cache(self):
        """Limpa o cache"""
        self._cache.clear()
        self._last_cache_update = time.time()

    def invalidate_cache(self):
        """Invalida o cache (chamado quando prompts são atualizados)"""
        self._clear_cache()

    def get_prompt_source(self, category: str, prompt_type: str = "generation") -> str:
        """
        Retorna a fonte do prompt (database, files, generic)
        """
        # Verificar banco
        if self._get_prompt_from_db(category, prompt_type):
            return "database"
        
        # Verificar arquivos
        if self._get_prompt_from_files(category, prompt_type):
            return "files"
        
        return "generic"
