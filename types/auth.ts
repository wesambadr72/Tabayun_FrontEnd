export interface User {
  id: number;
  email: string;
  full_name: string;
  country: string;
  language: string;
  is_admin?: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  full_name: string;
  country: string;
  language: string;
}
