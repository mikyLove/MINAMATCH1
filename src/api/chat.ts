import { apiFetch, getToken, BASE_URL } from './client';

export interface ChatMessage {
  role: string;
  content: string;
  created_at?: string;
}

export async function fetchHistory(): Promise<ChatMessage[]> {
  return apiFetch<ChatMessage[]>('/api/chat/history');
}

export async function clearHistory(): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>('/api/chat/history', { method: 'DELETE' });
}

export function getChatHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function sendMessageStream(message: string): Promise<Response> {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: getChatHeaders(),
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error del servidor');
  }
  return res;
}
