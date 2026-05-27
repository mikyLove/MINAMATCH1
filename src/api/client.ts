export const BASE_URL = import.meta.env.DEV ? 'http://localhost:3001' : '';

export const DB_KEYS = {
  CANDIDATES: 'minamatch_db_candidates',
  STUDENTS: 'minamatch_db_students',
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  return localStorage.getItem('minamatch_token');
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function apiFetch<T>(endpoint: string, options?: RequestInit, timeoutMs = 8000): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      body: options?.body,
      headers: { ...authHeaders(), ...options?.headers } as Record<string, string>,
      signal: controller.signal,
    });
    if (!res.ok) throw new ApiError(res.status, `API error: ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

// localStorage fallback helpers
export function getLocalData<T>(key: string, initial: T): T {
  const saved = localStorage.getItem(key);
  if (!saved) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(saved);
}

export function setLocalData(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

export { getToken, authHeaders };
