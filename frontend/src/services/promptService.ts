import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface Prompt {
  id: number;
  type: string;
  category: string;
  subcategory: string;
  content: string;
  description: string;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PromptData {
  type: string;
  category: string;
  subcategory: string;
  content: string;
  description: string;
  version: number;
}

interface PromptUpdate {
  type?: string;
  category?: string;
  subcategory?: string;
  content?: string;
  description?: string;
  version?: number;
}

interface PromptType {
  value: string;
  label: string;
}

interface PromptTypes {
  types: PromptType[];
  categories: PromptType[];
  subcategories: PromptType[];
}

export const promptService = {
  // Criar novo prompt
  async createPrompt(promptData: PromptData): Promise<Prompt> {
    const response = await api.post('/prompts/', promptData);
    return response.data;
  },

  // Listar todos os prompts
  async getPrompts(skip: number = 0, limit: number = 100, promptType: string | null = null, category: string | null = null): Promise<Prompt[]> {
    const params: any = { skip, limit };
    if (promptType) params.prompt_type = promptType;
    if (category) params.category = category;
    
    const response = await api.get('/prompts/', { params });
    
    // A API retorna {value: [...], Count: number}, então precisamos acessar response.data.value
    const result = response.data.value || response.data;
    
    return result;
  },

  // Buscar prompt por ID
  async getPrompt(promptId: number): Promise<Prompt> {
    const response = await api.get(`/prompts/${promptId}`);
    return response.data;
  },

  // Atualizar prompt
  async updatePrompt(promptId: number, promptData: PromptUpdate): Promise<Prompt> {
    const response = await api.put(`/prompts/${promptId}`, promptData);
    return response.data;
  },

  // Deletar prompt
  async deletePrompt(promptId: number): Promise<void> {
    const response = await api.delete(`/prompts/${promptId}`);
    return response.data;
  },

  // Contar prompts
  async getPromptCount(): Promise<{ count: number }> {
    const response = await api.get('/prompts/count/total');
    return response.data;
  },

  // Buscar prompt ativo por tipo e categoria
  async getActivePrompt(promptType: string, category: string): Promise<Prompt> {
    const response = await api.get(`/prompts/active/${promptType}/${category}`);
    return response.data;
  },

  // Listar tipos e categorias disponíveis
  async getPromptTypes(): Promise<PromptTypes> {
    const response = await api.get('/prompts/types/list');
    return response.data;
  }
};
