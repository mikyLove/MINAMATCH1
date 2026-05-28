import { v2Fetch } from './client';
import type {
  V2LoginRequest,
  V2LoginResponse,
  V2UserProfile,
} from './types';

export type { V2LoginRequest, V2LoginResponse, V2UserProfile };

export function v2Login(data: V2LoginRequest): Promise<V2LoginResponse> {
  return v2Fetch<V2LoginResponse>('/api/v2/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function v2VerifyToken(): Promise<V2UserProfile> {
  return v2Fetch<V2UserProfile>('/api/v2/auth/me');
}

export interface V2RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export function v2Register(data: V2RegisterRequest): Promise<V2LoginResponse> {
  return v2Fetch<V2LoginResponse>('/api/v2/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
