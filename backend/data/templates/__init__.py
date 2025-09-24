"""
Templates de fallback para respostas automáticas
Organizados por categoria e tipo de email
"""

from .productive_templates import PRODUCTIVE_TEMPLATES, GENERIC_PRODUCTIVE_TEMPLATES
from .unproductive_templates import UNPRODUCTIVE_TEMPLATES, GENERIC_UNPRODUCTIVE_TEMPLATES

__all__ = [
    'PRODUCTIVE_TEMPLATES', 
    'GENERIC_PRODUCTIVE_TEMPLATES',
    'UNPRODUCTIVE_TEMPLATES', 
    'GENERIC_UNPRODUCTIVE_TEMPLATES'
]
