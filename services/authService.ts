import { api } from './api';
import { AuthResponse, RegisterResponse } from '@/types/auth';

export const authService = {
  login: async (formData: FormData): Promise<AuthResponse> => {
    // For OAuth2 password flow, we use URLSearchParams or FormData
    const body = new URLSearchParams();
    formData.forEach((value, key) => body.append(key, value.toString()));

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    return response.json();
  },

  register: async (userData: any): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>('/auth/register', userData);
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }
};
