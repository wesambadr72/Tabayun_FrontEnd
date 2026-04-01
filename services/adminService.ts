import { api } from './api';
import { AdminStats, BroadcastNotification, AdminActivityLog } from '@/types/admin';
import { Law } from '@/types/law';

export const adminService = {
  getStats: () => api.get<AdminStats>('/admin/stats'),

  addLaw: (lawData: Partial<Law>) => 
    api.post<Law>('/admin/laws', lawData),

  broadcastNotification: (notification: BroadcastNotification) => 
    api.post<{ message: string }>('/admin/notifications', notification),

  getActivityLogs: () => 
    api.get<AdminActivityLog[]>('/admin/activity-logs'),
};
