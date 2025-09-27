#!/usr/bin/env python3
"""
Script para popular as tabelas de prompts e templates com dados iniciais
"""

import sys
import os
from datetime import datetime

# Adiciona o diretório backend ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config.database import SessionLocal, create_tables
from models.prompt import Prompt, PromptType, PromptCategory, PromptSubcategory
from models.template import Template, TemplateType, TemplateCategory
from data.prompts import PRODUCTIVE_PROMPTS, UNPRODUCTIVE_PROMPTS
from data.templates import PRODUCTIVE_TEMPLATES, UNPRODUCTIVE_TEMPLATES, GENERIC_UNPRODUCTIVE_TEMPLATES

def seed_prompts():
    """Popular tabela de prompts com dados existentes"""
    db = SessionLocal()
    
    try:
        # Verificar se já existem prompts
        existing_prompts = db.query(Prompt).count()
        if existing_prompts > 0:
            print(f"Já existem {existing_prompts} prompts na base de dados")
            return
        
        print("Populando tabela de prompts...")
        
        # Mapeamento de tópicos para subcategorias produtivas
        productive_topic_mapping = {
            'meetings': PromptSubcategory.MEETINGS,
            'projects': PromptSubcategory.PROJECTS,
            'sales_business': PromptSubcategory.SALES_BUSINESS,
            'customer_service': PromptSubcategory.CUSTOMER_SERVICE,
            'collaboration': PromptSubcategory.COLLABORATION,
            'training': PromptSubcategory.TRAINING,
            'reporting': PromptSubcategory.REPORTING,
            'financial': PromptSubcategory.FINANCIAL,
            'hr_recruitment': PromptSubcategory.HR_RECRUITMENT,
            'technology': PromptSubcategory.TECHNOLOGY,
            'strategy_planning': PromptSubcategory.STRATEGY_PLANNING,
            'urgent_important': PromptSubcategory.URGENT_IMPORTANT
        }
        
        # Prompts de classificação produtiva
        for topic, prompt in PRODUCTIVE_PROMPTS.items():
            subcategory = productive_topic_mapping.get(topic, PromptSubcategory.GENERAL)
            db_prompt = Prompt(
                type=PromptType.CLASSIFICATION,
                category=PromptCategory.PRODUCTIVE,
                subcategory=subcategory,
                content=prompt,
                description=f"Prompt de classificação para tópico: {topic}",
                is_active=True
            )
            db.add(db_prompt)
        
        # Mapeamento de categorias para subcategorias improdutivas
        unproductive_category_mapping = {
            'spam_promotions': PromptSubcategory.PROMOTIONS,
            'personal_greetings': PromptSubcategory.PERSONAL,
            'social_media': PromptSubcategory.SOCIAL_MEDIA,
            'entertainment': PromptSubcategory.ENTERTAINMENT,
            'advertisements': PromptSubcategory.ADVERTISEMENTS
        }
        
        # Prompts de classificação improdutiva
        for category, prompt in UNPRODUCTIVE_PROMPTS.items():
            subcategory = unproductive_category_mapping.get(category, PromptSubcategory.SPAM)
            db_prompt = Prompt(
                type=PromptType.CLASSIFICATION,
                category=PromptCategory.UNPRODUCTIVE,
                subcategory=subcategory,
                content=prompt,
                description=f"Prompt de classificação para categoria: {category}",
                is_active=True
            )
            db.add(db_prompt)
        
        # Prompts de geração de resposta produtiva
        productive_response_prompt = """
        Você é um assistente corporativo especializado em responder emails profissionais.
        Baseado no seguinte email produtivo, gere uma resposta profissional e adequada:
        
        Email: {email_content}
        
        A resposta deve ser:
        - Profissional e cortês
        - Direta e objetiva
        - Adequada ao contexto empresarial
        - Em português brasileiro
        """
        
        db_prompt = Prompt(
            type=PromptType.RESPONSE_GENERATION,
            category=PromptCategory.PRODUCTIVE,
            subcategory=PromptSubcategory.CUSTOMER_SERVICE,
            content=productive_response_prompt,
            description="Prompt para geração de respostas produtivas",
            is_active=True
        )
        db.add(db_prompt)
        
        # Prompts de geração de resposta improdutiva
        unproductive_response_prompt = """
        Você é um assistente corporativo especializado em responder emails improdutivos.
        Baseado no seguinte email improdutivo (spam/promoção), gere uma resposta educada mas firme:
        
        Email: {email_content}
        
        A resposta deve ser:
        - Educada mas firme
        - Indicar que não há interesse
        - Sugerir remoção da lista
        - Em português brasileiro
        """
        
        db_prompt = Prompt(
            type=PromptType.RESPONSE_GENERATION,
            category=PromptCategory.UNPRODUCTIVE,
            subcategory=PromptSubcategory.SPAM,
            content=unproductive_response_prompt,
            description="Prompt para geração de respostas improdutivas",
            is_active=True
        )
        db.add(db_prompt)
        
        db.commit()
        print("Prompts populados com sucesso!")
        
    except Exception as e:
        print(f" Erro ao popular prompts: {e}")
        db.rollback()
    finally:
        db.close()

def seed_templates():
    """Popular tabela de templates com dados existentes"""
    db = SessionLocal()
    
    try:
        # Verificar se já existem templates
        existing_templates = db.query(Template).count()
        if existing_templates > 0:
            print(f"Já existem {existing_templates} templates na base de dados")
            return
        
        print("Populando tabela de templates...")
        
        # Templates produtivos
        for topic, templates in PRODUCTIVE_TEMPLATES.items():
            for template in templates:
                db_template = Template(
                    type=TemplateType.RESPONSE,
                    category=TemplateCategory.PRODUCTIVE,
                    content=template,
                    description=f"Template produtivo para tópico: {topic}",
                    is_active=True
                )
                db.add(db_template)
        
        # Templates improdutivos
        for category, templates in UNPRODUCTIVE_TEMPLATES.items():
            for template in templates:
                db_template = Template(
                    type=TemplateType.RESPONSE,
                    category=TemplateCategory.UNPRODUCTIVE,
                    content=template,
                    description=f"Template improdutivo para categoria: {category}",
                    is_active=True
                )
                db.add(db_template)
        
        # Templates genéricos improdutivos
        for template in GENERIC_UNPRODUCTIVE_TEMPLATES:
            db_template = Template(
                type=TemplateType.RESPONSE,
                category=TemplateCategory.UNPRODUCTIVE,
                content=template,
                description="Template genérico improdutivo",
                is_active=True
            )
            db.add(db_template)
        
        db.commit()
        print("Templates populados com sucesso!")
        
    except Exception as e:
        print(f" Erro ao popular templates: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """Função principal"""
    print("Iniciando população de prompts e templates...")
    
    # Criar tabelas se não existirem
    create_tables()
    
    # Popular prompts
    seed_prompts()
    
    # Popular templates
    seed_templates()
    
    print("População concluída com sucesso!")

if __name__ == "__main__":
    main()
