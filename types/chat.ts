export interface ChatMessage {
  id?: string;
  role: 'user' | 'bot';
  content: string;
  source?: string;
  timestamp?: string;
}

export interface ChatQueryResponse {
  response: string;
  source: string;
}
