import re
from typing import List, Dict

class NLPService:
    def __init__(self):
        # Palavras de parada em português (simplificado)
        self.stop_words = {
            'a', 'ao', 'aos', 'aquela', 'aquelas', 'aquele', 'aqueles', 'aquilo', 'as', 'até', 'com', 'como', 'da', 'das', 'do', 'dos', 'e', 'ela', 'elas', 'ele', 'eles', 'em', 'entre', 'era', 'eram', 'essa', 'essas', 'esse', 'esses', 'esta', 'estamos', 'estas', 'estava', 'estavam', 'este', 'esteja', 'estejam', 'estejamos', 'estes', 'esteve', 'estive', 'estivemos', 'estiver', 'estivera', 'estiveram', 'estiverem', 'estivermos', 'estivesse', 'estivessem', 'estivéramos', 'estivéssemos', 'estou', 'está', 'estão', 'eu', 'foi', 'fomos', 'for', 'fora', 'foram', 'forem', 'formos', 'fosse', 'fossem', 'fui', 'fôramos', 'fôssemos', 'haja', 'hajam', 'hajamos', 'havemos', 'havia', 'hei', 'houve', 'houvemos', 'houver', 'houvera', 'houveram', 'houverei', 'houverem', 'houveremos', 'houveria', 'houveriam', 'houveríamos', 'houverá', 'houverão', 'houveríamos', 'houvesse', 'houvessem', 'houvéramos', 'houvéssemos', 'há', 'hão', 'isso', 'isto', 'já', 'lhe', 'lhes', 'mais', 'mas', 'me', 'mesmo', 'meu', 'meus', 'minha', 'minhas', 'muito', 'na', 'nas', 'nem', 'no', 'nos', 'nossa', 'nossas', 'nosso', 'nossos', 'num', 'numa', 'não', 'nós', 'o', 'os', 'ou', 'para', 'pela', 'pelas', 'pelo', 'pelos', 'por', 'qual', 'quando', 'que', 'quem', 'se', 'seja', 'sejam', 'sejamos', 'sem', 'ser', 'seria', 'seriam', 'será', 'serão', 'seríamos', 'seu', 'seus', 'só', 'sua', 'suas', 'são', 'são', 'só', 'também', 'te', 'tem', 'temos', 'tenha', 'tenham', 'tenhamos', 'tenho', 'ter', 'terei', 'teremos', 'teria', 'teriam', 'terá', 'terão', 'teríamos', 'teve', 'tinha', 'tinham', 'tive', 'tivemos', 'tiver', 'tivera', 'tiveram', 'tiverem', 'tivermos', 'tivesse', 'tivessem', 'tivéramos', 'tivéssemos', 'tu', 'tua', 'tuas', 'tém', 'tínhamos', 'um', 'uma', 'você', 'vocês', 'vos', 'à', 'às', 'éramos'
        }

    def preprocess_text(self, text: str) -> str:
        """Preprocess text for classification"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and numbers
        text = re.sub(r'[^a-zA-Záàâãéèêíìîóòôõúùûç\s]', ' ', text)
        
        # Remove extra whitespaces
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text

    def tokenize_and_clean(self, text: str) -> List[str]:
        """Tokenize text and remove stop words"""
        if not text:
            return []
        
        # Simple tokenization
        tokens = re.findall(r'\b\w+\b', text.lower())
        
        # Remove stop words and short words
        cleaned_tokens = [
            token 
            for token in tokens 
            if token not in self.stop_words and len(token) > 2
        ]
        
        return cleaned_tokens

    def extract_features(self, text: str) -> Dict[str, any]:
        """Extract features from text for classification"""
        processed_text = self.preprocess_text(text)
        tokens = self.tokenize_and_clean(processed_text)
        
        features = {
            'word_count': len(tokens),
            'unique_words': len(set(tokens)),
            'avg_word_length': sum(len(word) for word in tokens) / len(tokens) if tokens else 0,
            'processed_text': ' '.join(tokens)
        }
        
        return features


    def is_productive_content(self, text: str) -> Dict[str, any]:
        """Determine if content is productive based on keywords and patterns"""
        processed_text = self.preprocess_text(text)
        
        # Keywords that indicate productive content
        productive_keywords = [
            'reunião', 'projeto', 'trabalho', 'negócio', 'cliente', 'venda', 'proposta',
            'contrato', 'entrega', 'prazo', 'objetivo', 'meta', 'resultado', 'relatório',
            'apresentação', 'desenvolvimento', 'implementação', 'solução', 'produto',
            'serviço', 'marketing', 'vendas', 'financeiro', 'orçamento', 'planejamento'
        ]
        
        # Keywords that indicate unproductive content
        unproductive_keywords = [
            'spam', 'promoção', 'desconto', 'oferta', 'loteria', 'sorteio', 'gratuito',
            'urgente', 'limitado', 'exclusivo', 'não perca', 'última chance',
            'clique aqui', 'saiba mais', 'cadastre-se', 'inscreva-se'
        ]
        
        productive_count = sum(1 for keyword in productive_keywords if keyword in processed_text)
        unproductive_count = sum(1 for keyword in unproductive_keywords if keyword in processed_text)
        
        # Calculate confidence score
        total_keywords = productive_count + unproductive_count
        if total_keywords == 0:
            confidence = 0.5
            category = "Produtivo"  # Default to productive if no keywords found
        else:
            confidence = abs(productive_count - unproductive_count) / total_keywords
            category = "Produtivo" if productive_count > unproductive_count else "Improdutivo"
        
        return {
            'category': category,
            'confidence': confidence,
            'productive_score': productive_count,
            'unproductive_score': unproductive_count
        }
