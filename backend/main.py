import sys
import os

# Adiciona o diretório atual ao Python path para resolver imports
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.database import engine, Base, create_tables
from controllers.email_controller import router as email_router
from controllers.historico_controller import router as historico_router
from controllers.prompt_controller import router as prompt_router

# Create database tables on startup
create_tables()

app = FastAPI(
    title="Auto Email Classification API",
    description="API para classificação automática de emails como Produtivo ou Improdutivo",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique o domínio do Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(email_router, prefix="/api/emails", tags=["emails"])
app.include_router(historico_router, prefix="/api", tags=["historico"])
app.include_router(prompt_router, prefix="/api/prompts", tags=["prompts"])

@app.get("/")
async def root():
    return {
        "message": "Email Classification API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
