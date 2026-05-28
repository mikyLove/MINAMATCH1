import { v2Fetch, V2_BASE_URL, getToken } from './client';
import type { V2ChatMessage, V2EmptyResponse } from './types';

export type { V2ChatMessage };

export function v2FetchChatHistory(): Promise<V2ChatMessage[]> {
  return v2Fetch<V2ChatMessage[]>('/api/v2/chat/history');
}

export function v2ClearChatHistory(): Promise<V2EmptyResponse> {
  return v2Fetch<V2EmptyResponse>('/api/v2/chat/history', { method: 'DELETE' });
}

export function v2SendChatMessage(
  message: string,
  onChunk?: (text: string) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    fetch(`${V2_BASE_URL}/api/v2/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    })
      .then(async (res) => {
        clearTimeout(timeoutId);

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          reject(new Error(
            typeof body === 'object' && body && 'error' in body
              ? String((body as Record<string, unknown>).error)
              : `Chat error: ${res.status}`,
          ));
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          resolve('');
          return;
        }

        const decoder = new TextDecoder();
        let full = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          full += chunk;
          onChunk?.(chunk);
        }

        resolve(full);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        if (err instanceof DOMException && err.name === 'AbortError') {
          reject(new Error('Chat request timeout'));
        } else {
          reject(err);
        }
      });
  });
}
