export interface ChatSource {
  id: number;
  country?: string | null;
  title: string;
  url?: string | null;
  similarity?: number | null;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'bot';
  content: string;
  source?: string;
  sources?: ChatSource[];
  timestamp?: string;
}

export interface ChatQueryResponse {
  response: string;
  source?: string | null;
  sources?: ChatSource[];
}
