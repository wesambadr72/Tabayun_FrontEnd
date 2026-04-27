import { api } from './api';
import { AuthResponse, RegisterResponse, User } from '@/types/auth';

export const authService = {
  login: async (formData: FormData): Promise<AuthResponse> => {
    // For OAuth2 password flow, we use URLSearchParams
    const params = new URLSearchParams();
    
    // Ensure email is sent as username (FastAPI OAuth2 requirement)
    const email = formData.get('email');
    const username = formData.get('username');
    const password = formData.get('password');

    if (email) params.append('username', email as string);
    else if (username) params.append('username', username as string);
    
    if (password) params.append('password', password as string);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'خطأ في تسجيل الدخول. يرجى التأكد من البريد الإلكتروني وكلمة المرور.');
    }

    return response.json();
  },

  register: async (userData: any): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>('/auth/register', userData);
  },

  checkEmail: async (email: string): Promise<{ available: boolean }> => {
    return api.get<{ available: boolean }>(`/auth/check-email?email=${encodeURIComponent(email)}`);
  },

  forgotPassword: async (email: string): Promise<any> => {
    return api.post('/auth/forgot-password', { email });
  },

  getMe: async (): Promise<User> => {
    const user = await api.get<User>('/auth/me');
    authService.setUser(user);
    return user;
  },

  updateProfile: async (data: any): Promise<User> => {
    const user = await api.put<User>('/auth/profile', data);
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
