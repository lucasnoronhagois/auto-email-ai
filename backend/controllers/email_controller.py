from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from config.database import get_db
from services.email_service import EmailService
from services.classification_service import ClassificationService
from services.nlp_service import NLPService
from services.ai_service import AIService
from services.file_service import FileService
from services.historico_service import HistoricoService
from schemas.email import EmailCreate, EmailResponse
from schemas.classification import ClassificationCreate, EmailClassificationResponse
from schemas.historico import HistoricoWithDetails
from typing import Optional
import time

router = APIRouter()

@router.post("/upload-text", response_model=EmailClassificationResponse)
async def upload_text_email(
    content: str = Form(...),
    subject: Optional[str] = Form(None),
    sender: Optional[str] = Form(None),
    recipient: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """Processar email a partir de entrada de texto direta"""
    try:
        if not content.strip():
            raise HTTPException(status_code=400, detail="Conteúdo do email é obrigatório")
        
        # Criar registro do email
        email_service = EmailService(db)
        email_data = EmailCreate(
            subject=subject,
            content=content,
            sender=sender,
            recipient=recipient
        )
        email = email_service.create_email(email_data)
        
        # Processar classificação
        result = await process_email_classification(email, db)
        return result
    except Exception as e:
        print(f"Erro no upload-text: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.post("/upload-file", response_model=EmailClassificationResponse)
async def upload_file_email(
    file: UploadFile = File(...),
    subject: Optional[str] = Form(None),
    sender: Optional[str] = Form(None),
    recipient: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """Processar email a partir de arquivo enviado"""
    # Validar arquivo
    file_service = FileService()
    is_valid, message = file_service.validate_file(file.filename, file.size)
    if not is_valid:
        raise HTTPException(status_code=400, detail=message)
    
    # Extrair texto do arquivo
    file_content = await file.read()
    content = file_service.extract_text_from_file(file_content, file.filename)
    
    if not content:
        raise HTTPException(status_code=400, detail="Não foi possível extrair texto do arquivo")
    
    # Criar registro do email
    email_service = EmailService(db)
    email_data = EmailCreate(
        subject=subject,
        content=content,
        sender=sender,
        recipient=recipient,
        file_name=file.filename,
        file_type=file.content_type
    )
    email = email_service.create_email(email_data)
    
    # Processar classificação
    result = await process_email_classification(email, db)
    return result

async def process_email_classification(email, db: Session) -> EmailClassificationResponse:
    """Processar classificação de email usando serviços de IA e NLP"""
    start_time = time.time()
    
    # Inicializar serviços
    nlp_service = NLPService()
    ai_service = AIService(db)  # Passar sessão do banco para usar prompts híbridos
    classification_service = ClassificationService(db)
    historico_service = HistoricoService(db)
    
    # Pré-processar texto com NLP
    features = nlp_service.extract_features(email.content)
    
    # Obter classificação de IA
    ai_result = ai_service.classify_email(email.content)
    
    # Gerar resposta sugerida
    suggested_response = ai_service.generate_response(email.content, ai_result['category'])
    
    # Determinar subcategoria
    subcategory = None
    # Novo sistema: subcategory vem diretamente do resultado
    if ai_result.get('subcategory'):
        subcategory = ai_result['subcategory']
    # Fallback para sistema antigo (compatibilidade)
    elif ai_result['category'] == 'Produtivo' and ai_result.get('primary_topic'):
        subcategory = ai_result['primary_topic']
    elif ai_result['category'] == 'Improdutivo' and ai_result.get('primary_unproductive_category'):
        subcategory = ai_result['primary_unproductive_category']
    
    # Criar registro de classificação
    classification_data = ClassificationCreate(
        email_id=email.id,
        category=ai_result['category'],
        subcategory=subcategory,
        confidence_score=ai_result['confidence'],
        suggested_response=suggested_response,
        processing_time=time.time() - start_time
    )
    classification = classification_service.create_classification(classification_data)
    
    # Registrar no histórico
    historico_service.log_email_created(
        email_id=email.id,
        classification_id=classification.id
    )
    
    return EmailClassificationResponse(
        email={
            "id": email.id,
            "subject": email.subject,
            "content": email.content,
            "sender": email.sender,
            "recipient": email.recipient,
            "file_name": email.file_name,
            "file_type": email.file_type,
            "is_deleted": email.is_deleted,
            "created_at": email.created_at,
            "updated_at": email.updated_at
        },
        classification=classification
    )

@router.get("/emails", response_model=list[EmailResponse])
async def get_emails(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Obter todos os emails processados"""
    email_service = EmailService(db)
    emails = email_service.get_emails(skip=skip, limit=limit)
    return emails

@router.get("/emails/{email_id}", response_model=EmailClassificationResponse)
async def get_email_with_classification(
    email_id: int,
    db: Session = Depends(get_db)
):
    """Obter email com sua classificação"""
    email_service = EmailService(db)
    classification_service = ClassificationService(db)
    
    email = email_service.get_email(email_id)
    if not email:
        raise HTTPException(status_code=404, detail="Email não encontrado")
    
    classification = classification_service.get_classification_by_email(email_id)
    if not classification:
        raise HTTPException(status_code=404, detail="Classificação não encontrada")
    
    return EmailClassificationResponse(
        email={
            "id": email.id,
            "subject": email.subject,
            "content": email.content,
            "sender": email.sender,
            "recipient": email.recipient,
            "file_name": email.file_name,
            "file_type": email.file_type,
            "is_deleted": email.is_deleted,
            "created_at": email.created_at,
            "updated_at": email.updated_at
        },
        classification=classification
    )
