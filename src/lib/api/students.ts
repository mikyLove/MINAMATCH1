import { v2Fetch } from './client';
import type { V2Student } from './types';

export type { V2Student };

export function v2FetchStudents(): Promise<V2Student[]> {
  return v2Fetch<V2Student[]>('/api/students');
}
