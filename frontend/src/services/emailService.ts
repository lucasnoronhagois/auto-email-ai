import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface EmailData {
  content: string;
  subject?: string;
  sender?: string;
  recipient?: string;
}

interface EmailMetadata {
  subject?: string;
  sender?: string;
  recipient?: string;
}

interface ClassificationResult {
  email: {
    id: number;
    subject: string;
    content: string;
    sender: string;
    recipient: string;
    file_name: string;
    file_type: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
  };
  classification: {
    id: number;
    email_id: number;
    category: string;
    subcategory: string;
    confidence_score: number;
    suggested_response: string;
    processing_time: number;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
  };
}

interface HistoricoItem {
  id: number;
  email_id: number;
  classification_id: number;
  email_subject: string;
  email_sender: string;
  email_content: string;
  classification_category: string;
  classification_confidence: number;
  classification_suggested_response: string;
  created_at: string;
}

export const emailService = {
  async uploadTextEmail(emailData: EmailData): Promise<ClassificationResult> {
    const formData = new FormData();
    formData.append('content', emailData.content);
    if (emailData.subject) formData.append('subject', emailData.subject);
    if (emailData.sender) formData.append('sender', emailData.sender);
    if (emailData.recipient) formData.append('recipient', emailData.recipient);

    const response = await api.post('/emails/upload-text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async uploadFileEmail(file: File, metadata: EmailMetadata = {}): Promise<ClassificationResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata.subject) formData.append('subject', metadata.subject);
    if (metadata.sender) formData.append('sender', metadata.sender);
    if (metadata.recipient) formData.append('recipient', metadata.recipient);

    const response = await api.post('/emails/upload-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getEmails(skip: number = 0, limit: number = 100): Promise<any[]> {
    const response = await api.get('/emails', {
      params: { skip, limit },
    });
    return response.data;
  },

  async getHistorico(skip: number = 0, limit: number = 100): Promise<HistoricoItem[]> {
    const response = await api.get('/historico', {
      params: { skip, limit },
    });
    return response.data;
  },

  async getEmailWithClassification(emailId: number): Promise<ClassificationResult> {
    const response = await api.get(`/emails/${emailId}`);
    return response.data;
  },
};
