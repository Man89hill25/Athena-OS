export interface DocItem {
  id: string;
  file: string;
  number: number;
  title: string;
  category: string;
  snippet: string;
  content: string;
}

export interface DocCategory {
  name: string;
  count: number;
  icon?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
