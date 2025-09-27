from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Configuração do banco de dados
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./autou.db")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Debug: mostrar a DATABASE_URL (sem senha)
if DATABASE_URL:
    # Mascarar a senha para debug
    masked_url = DATABASE_URL
    if "@" in DATABASE_URL and ":" in DATABASE_URL:
        parts = DATABASE_URL.split("@")
        if len(parts) == 2:
            user_pass = parts[0].split("//")[-1]
            if ":" in user_pass:
                user = user_pass.split(":")[0]
                masked_url = DATABASE_URL.replace(user_pass, f"{user}:***")
    print(f"Database URL: {masked_url}")
    
    # Se a URL contém localhost, tentar usar variáveis individuais do Railway
    if "localhost" in DATABASE_URL:
        print("Detectado localhost na DATABASE_URL, tentando usar variáveis individuais")
        # Railway fornece variáveis individuais para PostgreSQL
        pg_host = os.getenv("PGHOST")
        pg_port = os.getenv("PGPORT", "5432")
        pg_user = os.getenv("PGUSER")
        pg_password = os.getenv("PGPASSWORD")
        pg_database = os.getenv("PGDATABASE")
        
        if all([pg_host, pg_user, pg_password, pg_database]):
            DATABASE_URL = f"postgresql://{pg_user}:{pg_password}@{pg_host}:{pg_port}/{pg_database}"
            print(f"Usando variáveis individuais: postgresql://{pg_user}:***@{pg_host}:{pg_port}/{pg_database}")
        else:
            print("Variáveis individuais não encontradas")
            print("Verificando outras variáveis do Railway...")
            
            # Tentar usar variáveis específicas do Railway
            railway_db_url = os.getenv("RAILWAY_DATABASE_URL")
            if railway_db_url:
                DATABASE_URL = railway_db_url
                print(f"Usando RAILWAY_DATABASE_URL: {railway_db_url[:50]}...")
            else:
                # Se não encontrar variáveis específicas, tentar substituir localhost
                # Railway pode usar um host interno diferente
                if "localhost" in DATABASE_URL:
                    # Tentar substituir localhost por um host que funcione no Railway
                    # Railway geralmente usa um host interno como o nome do serviço
                    service_name = os.getenv("RAILWAY_SERVICE_NAME", "postgres")
                    corrected_url = DATABASE_URL.replace("localhost", service_name)
                    DATABASE_URL = corrected_url
                    print(f"Tentando corrigir localhost para {service_name}: {corrected_url[:50]}...")
                else:
                    print("Mantendo DATABASE_URL original")
else:
    print("DATABASE_URL não encontrada, usando SQLite")
    DATABASE_URL = "sqlite:///./autou.db"

# Configurações específicas para cada tipo de banco
if "sqlite" in DATABASE_URL:
    # SQLite para desenvolvimento local
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False},
        echo=False  # Desabilitado para reduzir logs
    )
elif "postgresql" in DATABASE_URL:
    # PostgreSQL para Docker e produção
    engine = create_engine(
        DATABASE_URL,
        echo=False,  # Desabilitado para reduzir logs
        pool_pre_ping=True,
        pool_recycle=300
    )
else:
    # Fallback para SQLite
    engine = create_engine(
        "sqlite:///./autou.db",
        connect_args={"check_same_thread": False},
        echo=False  # Desabilitado para reduzir logs
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency para obter sessão do banco de dados"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Cria todas as tabelas no banco de dados"""
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas com sucesso!")

def drop_tables():
    """Remove todas as tabelas do banco de dados"""
    Base.metadata.drop_all(bind=engine)
    print("Tabelas removidas com sucesso!")
