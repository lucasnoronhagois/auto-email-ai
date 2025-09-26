"""
Classificação de contexto simplificada sem dependências de IA externa
"""

import re
from typing import Dict, List

class SimpleContextClassification:
    def __init__(self):
        # Padrões de contexto mais inteligentes
        self.context_patterns = {
            'meetings': [
                r'agendar\s+reunião', r'marcar\s+encontro', r'horário\s+disponível',
                r'conferência', r'apresentação', r'workshop', r'treinamento',
                r'compromisso', r'appointment', r'schedule'
            ],
            'projects': [
                r'desenvolver\s+projeto', r'cronograma\s+do\s+projeto', r'fase\s+do\s+projeto',
                r'entrega\s+do\s+projeto', r'status\s+do\s+projeto', r'projeto\s+de\s+desenvolvimento',
                r'projeto\s+web', r'projeto\s+de\s+sistema'
            ],
            'sales_business': [
                r'orçamento\s+para', r'proposta\s+comercial', r'negociação',
                r'fechar\s+negócio', r'oportunidade\s+de\s+venda', r'cliente\s+potencial',
                r'contrato\s+comercial', r'venda\s+de\s+produto'
            ],
            'financial': [
                r'orçamento\s+financeiro', r'relatório\s+financeiro', r'pagamento\s+de',
                r'investimento\s+em', r'análise\s+financeira', r'contabilidade',
                r'fatura\s+de', r'cobrança\s+de'
            ],
            'hr_recruitment': [
                r'contratação\s+de', r'vaga\s+para', r'entrevista\s+com',
                r'candidato\s+para', r'seleção\s+de', r'funcionário\s+novo',
                r'equipe\s+de\s+desenvolvimento'
            ],
            'technology': [
                r'sistema\s+de', r'software\s+para', r'aplicação\s+web',
                r'integração\s+de', r'atualização\s+do\s+sistema', r'manutenção\s+de',
                r'tecnologia\s+para'
            ],
            'strategy_planning': [
                r'estratégia\s+de', r'planejamento\s+estratégico', r'marketing\s+para',
                r'crescimento\s+da\s+empresa', r'expansão\s+do\s+negócio',
                r'objetivo\s+estratégico'
            ],
            'urgent_important': [
                r'urgente', r'asap', r'prioridade\s+alta', r'emergência',
                r'crítico', r'imediato', r'importante\s+urgente'
            ]
        }
        
        # Padrões improdutivos
        self.unproductive_patterns = {
            'spam_promotions': [
                r'promoção\s+especial', r'oferta\s+limitada', r'desconto\s+exclusivo',
                r'não\s+perca', r'última\s+chance', r'gratuito\s+agora',
                r'inscreva-se\s+agora', r'clique\s+aqui'
            ],
            'personal_greetings': [
                r'feliz\s+natal', r'feliz\s+ano\s+novo', r'parabéns\s+pelo',
                r'aniversário', r'casamento', r'festa\s+de', r'férias'
            ],
            'scams_fraud': [
                r'você\s+ganhou', r'loteria', r'prêmio\s+de', r'bitcoin\s+gratuito',
                r'investimento\s+rápido', r'dinheiro\s+fácil', r'cura\s+milagrosa'
            ]
        }

    def classify_with_context(self, email_content: str) -> Dict[str, any]:
        """Classifica email usando análise de contexto por padrões"""
        content_lower = email_content.lower()
        
        # Detectar padrões produtivos
        productive_matches = self._detect_patterns(content_lower, self.context_patterns)
        
        # Detectar padrões improdutivos
        unproductive_matches = self._detect_patterns(content_lower, self.unproductive_patterns)
        
        # Determinar categoria e subcategoria
        if unproductive_matches:
            # Se encontrou padrões improdutivos, classificar como improdutivo
            subcategory = unproductive_matches[0]['category']
            category = "Improdutivo"
            confidence = 0.8
        elif productive_matches:
            # Se encontrou padrões produtivos, classificar como produtivo
            subcategory = productive_matches[0]['category']
            category = "Produtivo"
            confidence = 0.8
        else:
            # Fallback: análise por palavras-chave simples
            return self._fallback_keyword_analysis(content_lower)
        
        return {
            'category': category,
            'confidence': confidence,
            'processing_time': 0.05,
            'method': 'context_pattern_analysis',
            'subcategory': subcategory,
            'detected_patterns': productive_matches + unproductive_matches
        }

    def _detect_patterns(self, content: str, patterns_dict: Dict[str, List[str]]) -> List[Dict]:
        """Detecta padrões no conteúdo"""
        matches = []
        
        for category, patterns in patterns_dict.items():
            for pattern in patterns:
                if re.search(pattern, content, re.IGNORECASE):
                    matches.append({
                        'category': category,
                        'pattern': pattern,
                        'match': True
                    })
                    break  # Se encontrou um padrão da categoria, não precisa verificar outros
        
        return matches

    def _fallback_keyword_analysis(self, content: str) -> Dict[str, any]:
        """Análise de fallback por palavras-chave"""
        # Palavras-chave simples para fallback
        productive_words = ['projeto', 'reunião', 'negócio', 'cliente', 'venda', 'orçamento']
        unproductive_words = ['spam', 'promoção', 'oferta', 'gratuito']
        
        productive_count = sum(1 for word in productive_words if word in content)
        unproductive_count = sum(1 for word in unproductive_words if word in content)
        
        if productive_count > unproductive_count:
            return {
                'category': "Produtivo",
                'confidence': 0.6,
                'processing_time': 0.02,
                'method': 'fallback_keyword_analysis',
                'subcategory': 'projects'  # Default
            }
        else:
            return {
                'category': "Improdutivo",
                'confidence': 0.6,
                'processing_time': 0.02,
                'method': 'fallback_keyword_analysis',
                'subcategory': 'spam_promotions'  # Default
            }
