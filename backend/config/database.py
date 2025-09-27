from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Configuração do banco de dados
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./autou.db")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Se a URL contém localhost, tentar usar variáveis individuais do Railway
if "localhost" in DATABASE_URL:
    # Railway fornece variáveis individuais para PostgreSQL
    pg_host = os.getenv("PGHOST")
    pg_port = os.getenv("PGPORT", "5432")
    pg_user = os.getenv("PGUSER")
    pg_password = os.getenv("PGPASSWORD")
    pg_database = os.getenv("PGDATABASE")
    
    if all([pg_host, pg_user, pg_password, pg_database]):
        DATABASE_URL = f"postgresql://{pg_user}:{pg_password}@{pg_host}:{pg_port}/{pg_database}"
    else:
        # Tentar usar variáveis específicas do Railway
        railway_db_url = os.getenv("RAILWAY_DATABASE_URL")
        if railway_db_url:
            DATABASE_URL = railway_db_url

# Configurações específicas para cada tipo de banco
if "sqlite" in DATABASE_URL:
    # SQLite para desenvolvimento local
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False},
        echo=False
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
        echo=False
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

def drop_tables():
    """Remove todas as tabelas do banco de dados"""
    Base.metadata.drop_all(bind=engine)
