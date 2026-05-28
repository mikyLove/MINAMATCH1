import { v2Fetch } from './client';
import type { V2Candidate } from './types';

export type { V2Candidate };

export function v2FetchCandidates(): Promise<V2Candidate[]> {
  return v2Fetch<V2Candidate[]>('/api/candidates');
}

export function v2FetchCandidate(id: string): Promise<V2Candidate> {
  return v2Fetch<V2Candidate>(`/api/candidates/${encodeURIComponent(id)}`);
}
