import { Candidate } from '../types';
import { mockCandidates } from '../data';
import { apiFetch, getLocalData, DB_KEYS } from './client';

export async function fetchCandidates(): Promise<Candidate[]> {
  try {
    return await apiFetch<Candidate[]>('/api/candidates');
  } catch {
    return getLocalData(DB_KEYS.CANDIDATES, mockCandidates);
  }
}
