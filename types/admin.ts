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
