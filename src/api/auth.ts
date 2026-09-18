import { apiClient } from './client';
import { AuthResponse, User } from '../types';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return res.data;
  },

  demoLogin: async (): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/demo-login');
    return res.data;
  },

  register: async (data: { email: string; password: string; name: string; role?: string }): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const res = await apiClient.get<{ success: boolean; user: User }>('/auth/me');
    return res.data;
  },
};
