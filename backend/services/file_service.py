import PyPDF2
from typing import Optional
import os
import tempfile

class FileService:
    def __init__(self):
        self.supported_formats = ['.txt', '.pdf']

    def extract_text_from_file(self, file_content: bytes, filename: str) -> Optional[str]:
        """Extract text from uploaded file"""
        try:
            file_extension = os.path.splitext(filename)[1].lower()
            
            if file_extension == '.txt':
                return file_content.decode('utf-8')
            
            elif file_extension == '.pdf':
                return self._extract_from_pdf(file_content)
            
            else:
                # Unsupported format
                return None
                
        except Exception as e:
            print(f"Error extracting text from file: {e}")
            return None

    def _extract_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF using PyPDF2"""
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
                temp_file.write(file_content)
                temp_file_path = temp_file.name
            
            text = ""
            with open(temp_file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            
            os.unlink(temp_file_path)
            return text.strip()
            
        except Exception as e:
            print(f"Error extracting PDF text: {e}")
            return ""


    def validate_file(self, filename: str, file_size: int) -> tuple[bool, str]:
        """Validate uploaded file"""
        # Check file extension
        file_extension = os.path.splitext(filename)[1].lower()
        if file_extension not in self.supported_formats:
            return False, f"Formato não suportado. Use: {', '.join(self.supported_formats)}"
        
        # Check file size (max 10MB)
        max_size = 10 * 1024 * 1024  # 10MB
        if file_size > max_size:
            return False, "Arquivo muito grande. Tamanho máximo: 10MB"
        
        return True, "Arquivo válido"
