import axios from 'axios';
import { 
  SecretCreateRequest, 
  SecretCreateResponse, 
  SecretViewResponse, 
  SecretValidateResponse,
  ApiError 
} from '../types';

const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Network error. Please check your connection.');
  }
);

export const secretAPI = {
  createSecret: async (data: SecretCreateRequest): Promise<SecretCreateResponse> => {
    const response = await api.post('/secrets/create', data);
    return response.data;
  },

  viewSecret: async (id: string, password?: string, token?: string): Promise<SecretViewResponse> => {
    const response = await api.post(`/secrets/view/${id}`, { password, token });
    return response.data;
  },

  validateSecret: async (id: string): Promise<SecretValidateResponse> => {
    const response = await api.get(`/secrets/validate/${id}`);
    return response.data;
  },

  getStats: async (): Promise<any> => {
    const response = await api.get('/secrets/stats');
    return response.data;
  },
};