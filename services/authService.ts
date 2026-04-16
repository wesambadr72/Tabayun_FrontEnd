import { api } from './api';
import { AuthResponse, RegisterResponse, User } from '@/types/auth';

export const authService = {
  login: async (formData: FormData): Promise<AuthResponse> => {
    // For OAuth2 password flow, we use URLSearchParams or FormData
    const body = new URLSearchParams(formData as any);

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

  getMe: async (): Promise<User> => {
    const user = await api.get<User>('/auth/me');
    authService.setUser(user);
    return user;
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
  },

  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  setUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
};
