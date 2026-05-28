export const V2_BASE_URL: string =
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3004' : '');

export class V2ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'V2ApiError';
  }
}

function getToken(): string | null {
  try {
    return localStorage.getItem('minamatch_token');
  } catch {
    return null;
  }
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export interface V2FetchOptions extends RequestInit {
  timeoutMs?: number;
}

export async function v2Fetch<T>(
  endpoint: string,
  options: V2FetchOptions = {},
): Promise<T> {
  const { timeoutMs = 10_000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${V2_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...(fetchOptions.headers as Record<string, string> | undefined),
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      let body: unknown;
      try {
        body = await res.json();
      } catch {
        body = await res.text().catch(() => null);
      }
      const message =
        typeof body === 'object' && body !== null && 'error' in body
          ? String((body as Record<string, unknown>).error)
          : `V2 API error: ${res.status}`;
      throw new V2ApiError(res.status, message, body);
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return res.json() as Promise<T>;
    }
    return res.text() as unknown as Promise<T>;
  } catch (err) {
    if (err instanceof V2ApiError) throw err;
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new V2ApiError(408, 'Request timeout');
    }
    throw new V2ApiError(0, `Network error: ${err instanceof Error ? err.message : 'unknown'}`);
  } finally {
    clearTimeout(timeoutId);
  }
}

export { getToken, authHeaders };
