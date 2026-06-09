import { api } from './api';
import { ChatQueryResponse } from '@/types/chat';

export const chatService = {
  queryAI: (message: string, language?: string) =>
    api.post<ChatQueryResponse>('/chat/query', { message, language }),
};
