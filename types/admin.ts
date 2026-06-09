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
  user_id?: number | null;
  admin_id?: number | null;
  admin_name?: string;
  action: string;
  table_name?: string;
  record_id?: number | null;
  target_type?: string;
  target_id?: number;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
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
  name?: string;
  full_name?: string;
  role: 'admin' | 'user';
  is_active: boolean;
  is_verified: boolean;
  country: string;
  created_at: string;
}
