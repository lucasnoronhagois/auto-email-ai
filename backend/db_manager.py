#!/usr/bin/env python3
"""
Gerenciador de banco de dados
"""

import sys
import os
from datetime import datetime
from sqlalchemy import text

# Adiciona o diretório backend ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config.database import engine, create_tables, drop_tables, SessionLocal
from models.email import Email
from models.classification import Classification
from models.prompt import Prompt
from models.template import Template
from models.historico import Historico

def init_database():
    """Inicializa o banco de dados criando todas as tabelas"""
   #  print("Inicializando banco de dados...")
    try:
        create_tables()
       # print("Banco de dados inicializado com sucesso!")
        return True
    except Exception as e:
       # print(f"Erro ao inicializar banco de dados: {e}")
        return False

def reset_database():
    """Reseta o banco de dados (remove e recria todas as tabelas)"""
    # print("Resetando banco de dados...")
    try:
        drop_tables()
        create_tables()
        # print("Banco de dados resetado com sucesso!")
        return True
    except Exception as e:
        # print(f" Erro ao resetar banco de dados: {e}")
        return False

def check_database_connection():
    """Verifica se a conexão com o banco de dados está funcionando"""
    # print("Verificando conexão com banco de dados...")
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            # print("Conexão com banco de dados estabelecida!")
            return True
    except Exception as e:
        # print(f" Erro na conexão com banco de dados: {e}")
        return False

def show_database_info():
    """Mostra informações sobre o banco de dados"""
    # print("Informações do banco de dados:")
    # print(f"   URL: {engine.url}")
    # print(f"   Driver: {engine.url.drivername}")
    
    try:
        with engine.connect() as connection:
            if "sqlite" in str(engine.url):
                result = connection.execute(text("SELECT name FROM sqlite_master WHERE type='table'"))
                tables = [row[0] for row in result]
            elif "postgresql" in str(engine.url):
                result = connection.execute(text("SELECT tablename FROM pg_tables WHERE schemaname='public'"))
                tables = [row[0] for row in result]
            else:
                tables = ["Informação não disponível"]
            
            #   print(f"   Tabelas existentes: {', '.join(tables) if tables else 'Nenhuma'}")
    except Exception as e:
        # print(f"   Erro ao obter informações: {e}")
        pass

def create_sample_data():
    """Cria dados de exemplo para teste"""
    # print("📝 Criando dados de exemplo...")
    try:
        db = SessionLocal()
        
        # Email de exemplo
        sample_email = Email(
            subject="Reunião de equipe - Próxima semana",
            content="Olá equipe, gostaria de agendar uma reunião para discutir os próximos passos do projeto. Por favor, confirmem sua disponibilidade.",
            sender="gerente@empresa.com",
            recipient="equipe@empresa.com",
            file_name="email_exemplo.txt",
            file_type="txt"
        )
        
        db.add(sample_email)
        db.commit()
        db.refresh(sample_email)
        
        # Classificação de exemplo
        sample_classification = Classification(
            email_id=sample_email.id,
            category="Produtivo",
            confidence_score=0.95,
            suggested_response="Obrigado pelo convite. Estou disponível na terça-feira às 14h.",
            processing_time=1.2
        )
        
        db.add(sample_classification)
        db.commit()
        
        # print("Dados de exemplo criados com sucesso!")
        return True
        
    except Exception as e:
        # print(f" Erro ao criar dados de exemplo: {e}")
        return False
    finally:
        db.close()

def seed_prompts_templates():
    """Popula as tabelas de prompts e templates com dados iniciais"""
    # print("Populando prompts e templates...")
    try:
        from seed_prompts_templates import main as seed_main
        seed_main()
        # print("Prompts e templates populados com sucesso!")
        return True
    except Exception as e:
        # print(f" Erro ao popular prompts e templates: {e}")
        return False

def main():
    """Função principal do gerenciador de banco de dados"""
    if len(sys.argv) < 2:
        print("""
Gerenciador de Banco de Dados

Uso: python db_manager.py <comando>

Comandos disponíveis:
  init        - Inicializa o banco de dados (cria tabelas)
  reset       - Reseta o banco de dados (remove e recria tabelas)
  check       - Verifica conexão com banco de dados
  info        - Mostra informações do banco de dados
  sample      - Cria dados de exemplo
  seed        - Popula prompts e templates
  help        - Mostra esta ajuda

Exemplos:
  python db_manager.py init
  python db_manager.py check
  python db_manager.py sample
  python db_manager.py seed
        """)
        return
    
    command = sys.argv[1].lower()
    
    if command == "init":
        init_database()
    elif command == "reset":
        confirm = input("Tem certeza que deseja resetar o banco de dados? (y/N): ")
        if confirm.lower() in ['y', 'yes', 'sim']:
            reset_database()
        else:
            print(" Operação cancelada.")
    elif command == "check":
        check_database_connection()
    elif command == "info":
        show_database_info()
    elif command == "sample":
        create_sample_data()
    elif command == "seed":
        seed_prompts_templates()
    elif command == "help":
        main()
    else:
        print(f" Comando '{command}' não reconhecido.")
        print("Use 'python db_manager.py help' para ver os comandos disponíveis.")

if __name__ == "__main__":
    main()
