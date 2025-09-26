import json
import os
import random
from typing import Dict, Optional
import time
from data.keywords import BUSINESS_TOPICS, UNPRODUCTIVE_CATEGORIES
from data.prompts import PRODUCTIVE_PROMPTS, UNPRODUCTIVE_PROMPTS
from data.templates import (
    PRODUCTIVE_TEMPLATES, GENERIC_PRODUCTIVE_TEMPLATES,
    UNPRODUCTIVE_TEMPLATES, GENERIC_UNPRODUCTIVE_TEMPLATES
)
from data.ai_models import HUGGINGFACE_GENERATION_MODELS
from .simple_context_classification import SimpleContextClassification
from .hybrid_prompt_service import HybridPromptService

class FreeAIService:
    def __init__(self, db_session=None):
        # Sistema com análise de contexto inteligente
        self.context_classifier = SimpleContextClassification()
        self.prompt_service = HybridPromptService(db_session) if db_session else None
        pass

    def classify_email_huggingface(self, email_content: str) -> Dict[str, any]:
        """Classify email using context analysis with fallback to keywords"""
        # Usar análise de contexto por padrões
        context_result = self.context_classifier.classify_with_context(email_content)
        if context_result and context_result.get('method') != 'fallback_keyword_analysis':
            return context_result
        
        # Fallback para classificação por palavras-chave tradicional
        return self._keyword_classification(email_content, time.time())

    # Métodos removidos - usando apenas classificação inteligente por palavras-chave

    # Método de geração com Hugging Face removido - usando apenas templates

    # Método do Ollama removido - usando apenas Hugging Face e análise de contexto

    def _keyword_classification(self, email_content: str, start_time: float) -> Dict[str, any]:
        """Enhanced keyword-based classification"""
        content_lower = email_content.lower()
        
        # Lista unificada para classificação geral
        productive_keywords = []
        for topic_keywords in BUSINESS_TOPICS.values():
            productive_keywords.extend(topic_keywords)
        
        # Lista unificada para classificação geral
        unproductive_keywords = []
        for category_keywords in UNPRODUCTIVE_CATEGORIES.values():
            unproductive_keywords.extend(category_keywords)
        
        # Detectar tópicos específicos (produtivos)
        detected_topics = []
        for topic, keywords in BUSINESS_TOPICS.items():
            topic_matches = sum(1 for keyword in keywords if keyword in content_lower)
            if topic_matches > 0:
                detected_topics.append({
                    'topic': topic,
                    'matches': topic_matches,
                    'keywords_found': [kw for kw in keywords if kw in content_lower]
                })
        
        # Detectar categorias improdutivas
        detected_unproductive_categories = []
        for category, keywords in UNPRODUCTIVE_CATEGORIES.items():
            category_matches = sum(1 for keyword in keywords if keyword in content_lower)
            if category_matches > 0:
                detected_unproductive_categories.append({
                    'category': category,
                    'matches': category_matches,
                    'keywords_found': [kw for kw in keywords if kw in content_lower]
                })
        
        # Count keyword matches
        productive_count = sum(1 for keyword in productive_keywords if keyword in content_lower)
        unproductive_count = sum(1 for keyword in unproductive_keywords if keyword in content_lower)
        
        # Análise adicional de contexto para determinar importância empresarial
        has_business_context = any(word in content_lower for word in ['@', 'empresa', 'company', 'business', 'corp', 'ltd'])
        has_urgent_indicators = any(word in content_lower for word in ['urgente', 'urgent', 'asap', 'imediato', 'immediate', 'prioridade', 'priority'])
        has_professional_tone = any(word in content_lower for word in ['prezado', 'dear', 'sr', 'sra', 'senhor', 'senhora', 'att', 'atenciosamente'])
        has_meeting_indicators = any(word in content_lower for word in ['reunião', 'meeting', 'agenda', 'schedule', 'horário', 'time'])
        has_project_indicators = any(word in content_lower for word in ['projeto', 'project', 'tarefa', 'task', 'deadline', 'prazo'])
        
        # Indicadores de spam/promoção
        has_exclamation = content_lower.count('!') > 3
        has_caps = sum(1 for c in email_content if c.isupper()) > len(email_content) * 0.3
        has_links = 'http' in content_lower or 'www.' in content_lower
        is_short = len(email_content.split()) < 10
        has_spam_indicators = any(word in content_lower for word in ['clique aqui', 'click here', 'não perca', 'última chance'])
        
        # Calcular score baseado na importância empresarial
        business_importance_score = productive_count + (2 if has_business_context else 0) + (2 if has_urgent_indicators else 0) + (1 if has_professional_tone else 0) + (2 if has_meeting_indicators else 0) + (2 if has_project_indicators else 0)
        
        spam_score = unproductive_count + (2 if has_exclamation else 0) + (2 if has_caps else 0) + (1 if has_links else 0) + (3 if has_spam_indicators else 0)
        
        # Determinar classificação baseada na importância para empresa
        if business_importance_score > spam_score:
            category = "Produtivo"
            confidence = min(0.90, 0.6 + (business_importance_score * 0.03))  # Reduzido para evitar > 100%
        else:
            category = "Improdutivo"
            confidence = min(0.90, 0.6 + (spam_score * 0.03))  # Reduzido para evitar > 100%
        
        # Ajustar confiança baseado na qualidade do conteúdo
        if is_short:
            confidence *= 0.8
        elif has_business_context and has_professional_tone:
            confidence = min(0.95, confidence * 1.1)  # Aumentar confiança para emails profissionais, mas limitar a 95%
        
        # Garantir que a confiança nunca passe de 100% (1.0)
        confidence = min(1.0, confidence)
        
        processing_time = time.time() - start_time
        
        return {
            'category': category,
            'confidence': confidence,
            'processing_time': processing_time,
            'method': 'intelligent_business_classification',
            'business_importance_score': business_importance_score,
            'spam_score': spam_score,
            'detected_topics': detected_topics,
            'primary_topic': detected_topics[0]['topic'] if detected_topics else None,
            'detected_unproductive_categories': detected_unproductive_categories,
            'primary_unproductive_category': detected_unproductive_categories[0]['category'] if detected_unproductive_categories else None
        }

    def generate_response(self, email_content: str, category: str) -> str:
        """Generate response using template-based approach"""
        if category == "Produtivo":
            return self._generate_productive_response(email_content)
        else:
            return self._generate_unproductive_response(email_content)

    def _generate_productive_response(self, email_content: str) -> str:
        """Generate professional response for productive emails based on detected topics"""
        
        # Detectar tópicos para resposta específica
        content_lower = email_content.lower()
        
        # Detectar tópico principal e gerar resposta
        for topic, keywords in BUSINESS_TOPICS.items():
            if any(keyword in content_lower for keyword in keywords):
                # Usar serviço híbrido para buscar prompt (banco > arquivos > genérico)
                if self.prompt_service:
                    prompt_template = self.prompt_service.get_prompt(topic, "generation")
                else:
                    # Fallback para arquivos locais se não houver serviço híbrido
                    prompt_template = PRODUCTIVE_PROMPTS.get(topic, "")
                
                # Tentar usar IA primeiro (se disponível)
                ai_response = self._generate_with_ai(prompt_template, email_content)
                if ai_response:
                    return ai_response
                
                # Fallback para templates
                if topic in PRODUCTIVE_TEMPLATES:
                    responses = PRODUCTIVE_TEMPLATES[topic]
                    return random.choice(responses)
        
        # Templates corporativos genéricos
        return random.choice(GENERIC_PRODUCTIVE_TEMPLATES)

    def _generate_with_ai(self, prompt_template: str, email_content: str) -> str:
        """Generate response using free AI services (Hugging Face or Ollama)"""
        try:
            # Formatar prompt com o conteúdo do email
            formatted_prompt = prompt_template.format(email_content=email_content)
            
            # Tentar Hugging Face primeiro (gratuito)
            hf_response = self._try_huggingface_generation(formatted_prompt)
            if hf_response:
                return hf_response
            
            # Ollama removido - usando apenas Hugging Face
            
            # Se nenhuma IA gratuita estiver disponível, retorna None para usar fallback
            return None
            
        except Exception as e:
            print(f"Free AI generation error: {e}")
            return None

    # Método OpenAI removido - usando apenas serviços gratuitos

    def _try_huggingface_generation(self, prompt: str) -> str:
        """Try to generate response using Hugging Face free models"""
        try:
            # Verificar se temos token
            hf_token = os.getenv("HF_TOKEN")
            if not hf_token:
                return None
            
            # Import dinâmico para evitar erros de linter
            try:
                from openai import OpenAI  # type: ignore
            except ImportError:
                print("❌ Biblioteca 'openai' não instalada")
                return None
                
            client = OpenAI(
                base_url="https://router.huggingface.co/v1",
                api_key=hf_token
            )
            
            # Tentar diferentes modelos até encontrar um que funcione
            for model in HUGGINGFACE_GENERATION_MODELS:
                try:
                    response = client.chat.completions.create(
                        model=model,
                        messages=[{"role": "user", "content": prompt}],
                        max_tokens=500,  # Balanceado para evitar rate limits
                        temperature=0.7
                    )
                    
                    result = response.choices[0].message.content.strip()
                    # print(f"✅ Resposta gerada com sucesso usando modelo: {model}")  # Log reduzido
                    return result
                    
                except Exception as e:
                    error_msg = str(e).lower()
                    if "rate limit" in error_msg or "429" in error_msg:
                        # print(f"⚠️ Rate limit atingido para {model}. Tentando com menos tokens...")  # Log reduzido
                        # Tentar com menos tokens em caso de rate limit
                        try:
                            response = client.chat.completions.create(
                                model=model,
                                messages=[{"role": "user", "content": prompt}],
                                max_tokens=200,  # Fallback para menos tokens
                                temperature=0.7
                            )
                            result = response.choices[0].message.content.strip()
                            # print(f"✅ Resposta gerada com sucesso (fallback) usando modelo: {model}")  # Log reduzido
                            return result
                        except Exception as fallback_error:
                            print(f"❌ Fallback também falhou para {model}: {fallback_error}")
                    else:
                        print(f"❌ Modelo {model} falhou: {e}")
                    continue
            
            # Se nenhum modelo funcionar
            print("❌ Todos os modelos de geração do Hugging Face falharam")
            return None
            
        except Exception as e:
            print(f"Hugging Face generation failed: {e}")
            return None


    def _generate_unproductive_response(self, email_content: str) -> str:
        """Generate polite but firm corporate response for unproductive emails based on detected categories"""
        
        # Detectar categoria improdutiva específica
        content_lower = email_content.lower()
        
        # Detectar categoria principal e gerar resposta específica
        for category, keywords in UNPRODUCTIVE_CATEGORIES.items():
            if any(keyword in content_lower for keyword in keywords):
                # Usar serviço híbrido para buscar prompt (banco > arquivos > genérico)
                if self.prompt_service:
                    prompt_template = self.prompt_service.get_prompt(category, "generation")
                else:
                    # Fallback para arquivos locais se não houver serviço híbrido
                    prompt_template = UNPRODUCTIVE_PROMPTS.get(category, "")
                
                # Tentar usar IA primeiro (se disponível)
                ai_response = self._generate_with_ai(prompt_template, email_content)
                if ai_response:
                    return ai_response
                
                # Fallback para templates específicos
                if category in UNPRODUCTIVE_TEMPLATES:
                    templates = UNPRODUCTIVE_TEMPLATES[category]
                    return random.choice(templates)
        
        # Templates genéricos para emails improdutivos não categorizados
        return random.choice(GENERIC_UNPRODUCTIVE_TEMPLATES)
