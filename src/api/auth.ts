import { apiFetch, BASE_URL } from './client';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Credenciales inválidas');
  }
  return res.json();
}

export async function verifyToken(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/api/auth/me');
}
