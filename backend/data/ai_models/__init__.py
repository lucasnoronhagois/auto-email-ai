"""
Configurações de modelos de IA organizados por provedor
"""

from .huggingface_models import HUGGINGFACE_GENERATION_MODELS
from .ollama_models import OLLAMA_MODELS

__all__ = ['HUGGINGFACE_GENERATION_MODELS', 'OLLAMA_MODELS']
