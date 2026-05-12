export interface AdminStats {
  total_laws: number;
  total_users: number;
  total_categories: number;
  active_users?: number;
}

export interface BroadcastNotification {
  title: string;
  content: string;
}

export interface AdminActivityLog {
  id: number;
  admin_id: number;
  action: string;
  target_type: string;
  target_id: number;
  created_at: string;
}

export interface SystemConfig {
  key: string;
  value: string;
  description: string;
}

export interface UserAdmin {
  id: number;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  is_active: boolean;
  is_verified: boolean;
  country: string;
  created_at: string;
}
