from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.database import engine, Base
from controllers.email_controller import router as email_router
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Auto Email Classification API",
    description="API para classificação automática de emails como Produtivo ou Improdutivo",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(email_router, prefix="/api/emails", tags=["emails"])

@app.get("/")
async def root():
    return {
        "message": "AutoU Email Classification API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
