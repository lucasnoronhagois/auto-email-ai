from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from config.database import get_db
from services.email_service import EmailService
from services.classification_service import ClassificationService
from services.nlp_service import NLPService
from services.ai_service import AIService
from services.file_service import FileService
from schemas.email import EmailCreate, EmailResponse
from schemas.classification import ClassificationCreate, EmailClassificationResponse
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
    """Process email from direct text input"""
    if not content.strip():
        raise HTTPException(status_code=400, detail="Conteúdo do email é obrigatório")
    
    # Create email record
    email_service = EmailService(db)
    email_data = EmailCreate(
        subject=subject,
        content=content,
        sender=sender,
        recipient=recipient
    )
    email = email_service.create_email(email_data)
    
    # Process classification
    result = await process_email_classification(email, db)
    return result

@router.post("/upload-file", response_model=EmailClassificationResponse)
async def upload_file_email(
    file: UploadFile = File(...),
    subject: Optional[str] = Form(None),
    sender: Optional[str] = Form(None),
    recipient: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """Process email from uploaded file"""
    # Validate file
    file_service = FileService()
    is_valid, message = file_service.validate_file(file.filename, file.size)
    if not is_valid:
        raise HTTPException(status_code=400, detail=message)
    
    # Extract text from file
    file_content = await file.read()
    content = file_service.extract_text_from_file(file_content, file.filename)
    
    if not content:
        raise HTTPException(status_code=400, detail="Não foi possível extrair texto do arquivo")
    
    # Create email record
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
    
    # Process classification
    result = await process_email_classification(email, db)
    return result

async def process_email_classification(email, db: Session) -> EmailClassificationResponse:
    """Process email classification using AI and NLP services"""
    start_time = time.time()
    
    # Initialize services
    nlp_service = NLPService()
    ai_service = AIService()
    classification_service = ClassificationService(db)
    
    # Preprocess text with NLP
    features = nlp_service.extract_features(email.content)
    
    # Get AI classification
    ai_result = ai_service.classify_email(email.content)
    
    # Generate suggested response
    suggested_response = ai_service.generate_response(email.content, ai_result['category'])
    
    # Create classification record
    classification_data = ClassificationCreate(
        email_id=email.id,
        category=ai_result['category'],
        confidence_score=ai_result['confidence'],
        suggested_response=suggested_response,
        processing_time=time.time() - start_time
    )
    classification = classification_service.create_classification(classification_data)
    
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
    """Get all processed emails"""
    email_service = EmailService(db)
    emails = email_service.get_emails(skip=skip, limit=limit)
    return emails

@router.get("/emails/{email_id}", response_model=EmailClassificationResponse)
async def get_email_with_classification(
    email_id: int,
    db: Session = Depends(get_db)
):
    """Get email with its classification"""
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
