import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const emailService = {
  async uploadTextEmail(emailData) {
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

  async uploadFileEmail(file, metadata = {}) {
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

  async getEmails(skip = 0, limit = 100) {
    const response = await api.get('/emails', {
      params: { skip, limit },
    });
    return response.data;
  },

  async getHistorico(skip = 0, limit = 100) {
    const response = await api.get('/historico', {
      params: { skip, limit },
    });
    return response.data;
  },

  async getEmailWithClassification(emailId) {
    const response = await api.get(`/emails/${emailId}`);
    return response.data;
  },
};