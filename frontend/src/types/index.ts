export interface ClassificationResult {
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

export interface HistoryItem {
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

export interface PromptItem {
  id: number;
  content: string;
  category: string;
  subcategory: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export type ActiveSection = 'main' | 'history' | 'prompts';
export type UploadType = 'text' | 'file';
export type PromptTab = 'productive' | 'unproductive';
