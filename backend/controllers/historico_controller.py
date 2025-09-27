from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..config.database import get_db
from ..services.historico_service import HistoricoService
from ..schemas.historico import HistoricoWithDetails
from typing import List

router = APIRouter()

@router.get("/historico", response_model=List[HistoricoWithDetails])
async def get_historico(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Busca histórico de emails classificados"""
    historico_service = HistoricoService(db)
    return historico_service.get_historico_with_details(limit=limit, skip=skip)

@router.get("/historico/count")
async def get_historico_count(db: Session = Depends(get_db)):
    """Conta total de registros no histórico"""
    historico_service = HistoricoService(db)
    return {"count": historico_service.get_historico_count()}
