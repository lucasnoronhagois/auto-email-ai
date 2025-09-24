"""
Palavras-chave organizadas por categorias para classificação de emails
Separadas em tópicos produtivos e categorias improdutivas
"""

from .business_keywords import BUSINESS_TOPICS
from .unproductive_keywords import UNPRODUCTIVE_CATEGORIES

__all__ = ['BUSINESS_TOPICS', 'UNPRODUCTIVE_CATEGORIES']
