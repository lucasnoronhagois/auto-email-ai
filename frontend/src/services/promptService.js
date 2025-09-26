import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const promptService = {
  // Criar novo prompt
  async createPrompt(promptData) {
    const response = await api.post('/prompts/', promptData);
    return response.data;
  },

  // Listar todos os prompts
  async getPrompts(skip = 0, limit = 100, promptType = null, category = null) {
    const params = { skip, limit };
    if (promptType) params.prompt_type = promptType;
    if (category) params.category = category;
    
    const response = await api.get('/prompts/', { params });
    return response.data;
  },

  // Buscar prompt por ID
  async getPrompt(promptId) {
    const response = await api.get(`/prompts/${promptId}`);
    return response.data;
  },

  // Atualizar prompt
  async updatePrompt(promptId, promptData) {
    const response = await api.put(`/prompts/${promptId}`, promptData);
    return response.data;
  },

  // Deletar prompt
  async deletePrompt(promptId) {
    const response = await api.delete(`/prompts/${promptId}`);
    return response.data;
  },

  // Contar prompts
  async getPromptCount() {
    const response = await api.get('/prompts/count/total');
    return response.data;
  },

  // Buscar prompt ativo por tipo e categoria
  async getActivePrompt(promptType, category) {
    const response = await api.get(`/prompts/active/${promptType}/${category}`);
    return response.data;
  },

  // Listar tipos e categorias disponíveis
  async getPromptTypes() {
    const response = await api.get('/prompts/types/list');
    return response.data;
  }
};
