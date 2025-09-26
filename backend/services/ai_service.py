import os
from typing import Dict, Optional
import time
from .free_ai_service import FreeAIService

class AIService:
    def __init__(self, db_session=None):
        self.free_ai = FreeAIService(db_session)
        # Sistema focado apenas em serviços gratuitos

    def classify_email(self, email_content: str) -> Dict[str, any]:
        """Classify email as productive or unproductive using available AI services"""
        # Usar novo sistema de classificação (contexto + fallback para palavras-chave)
        result = self.free_ai.classify_email_huggingface(email_content)
        return result

    # Método OpenAI removido - usando apenas classificação inteligente

    def generate_response(self, email_content: str, category: str) -> str:
        """Generate an appropriate response based on email category"""
        # Usar apenas templates (sempre funcionam)
        return self.free_ai.generate_response(email_content, category)

    # Método de fallback removido - usando apenas classificação inteligente

    # Método de fallback response removido - usando apenas templates
