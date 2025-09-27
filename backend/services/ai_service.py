import os
from typing import Dict, Optional
import time
from .free_ai_service import FreeAIService

class AIService:
    def __init__(self, db_session=None):
        self.free_ai = FreeAIService(db_session)
        # Sistema focado apenas em serviços gratuitos

    def classify_email(self, email_content: str) -> Dict[str, any]:
        """Classificar email como produtivo ou improdutivo usando serviços de IA disponíveis"""
        
        result = self.free_ai.classify_email_huggingface(email_content)
        return result

    def generate_response(self, email_content: str, category: str) -> str:
        """Gerar uma resposta apropriada baseada na categoria do email"""
        
        return self.free_ai.generate_response(email_content, category)
