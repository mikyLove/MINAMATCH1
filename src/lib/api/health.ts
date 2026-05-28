import { v2Fetch } from './client';
import type { V2HealthStatus, V2ReadyStatus } from './types';

export type { V2HealthStatus, V2ReadyStatus };

export function v2Health(): Promise<V2HealthStatus> {
  return v2Fetch<V2HealthStatus>('/api/v2/health');
}

export function v2Ready(): Promise<V2ReadyStatus> {
  return v2Fetch<V2ReadyStatus>('/api/v2/ready');
}
