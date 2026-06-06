import { api } from './api';
import { AdminStats, BroadcastNotification, AdminActivityLog, SystemConfig, UserAdmin } from '@/types/admin';
import { Law } from '@/types/law';

export const adminService = {
  // Stats
  getStats: () => api.get<AdminStats>('/admin/stats'),

  // Laws Management
  getLaws: (skip = 0, limit = 10, search?: string) => 
    api.get<Law[]>(`/admin/laws?skip=${skip}&limit=${limit}${search ? `&search=${search}` : ''}`),
  
  getLawById: (id: number) => 
    api.get<Law>(`/admin/laws/${id}`),

  addLaw: (lawData: Partial<Law>) => 
    api.post<Law>('/admin/laws', lawData),

  updateLaw: (id: number, lawData: Partial<Law>) => 
    api.put<Law>(`/admin/laws/${id}`, lawData),

  deleteLaw: (id: number) => 
    api.delete<{ message: string }>(`/admin/laws/${id}`),

  bulkDeleteLaws: (ids: number[]) => 
    api.post<{ message: string }>('/admin/laws/bulk-delete', ids),

  // Users Management
  getUsers: (skip = 0, limit = 10, search?: string) => 
    api.get<UserAdmin[]>(`/admin/users?skip=${skip}&limit=${limit}${search ? `&search=${search}` : ''}`),

  updateUserRole: (userId: number, role: string) => 
    api.put<{ message: string }>(`/admin/users/${userId}/role?new_role=${role}`, {}),

  deleteUser: (userId: number) => 
    api.delete<{ message: string }>(`/admin/users/${userId}`),

  bulkDeleteUsers: (userIds: number[]) => 
    api.post<{ message: string }>('/admin/users/bulk-delete', userIds),

  // System Configuration (AI Prompts)
  getConfigs: () => 
    api.get<SystemConfig[]>('/admin/configs'),

  updateConfig: (key: string, value: string, description: string = "") => 
    api.post<SystemConfig>(`/admin/config?key=${key}&value=${encodeURIComponent(value)}&description=${encodeURIComponent(description)}`, {}),

  seedConfigs: () => 
    api.post<{ message: string }>('/admin/seed-configs', {}),

  // Notifications
  getNotifications: (skip = 0, limit = 50) => 
    api.get<any[]>(`/admin/notifications?skip=${skip}&limit=${limit}`),

  deleteNotification: (id: number) => 
    api.delete<{ message: string }>(`/admin/notifications/${id}`),

  bulkDeleteNotifications: (ids: number[]) => 
    api.post<{ message: string }>('/admin/notifications/bulk-delete', ids),

  sendNotification: (notification: { title: string, content: string, target_user_ids?: number[] | null }) => 
    api.post<{ message: string }>('/admin/notifications', notification),

  // Activity Logs
  getActivityLogs: (skip = 0, limit = 50) => 
    api.get<AdminActivityLog[]>(`/admin/logs?skip=${skip}&limit=${limit}`),
};
