import { v2Fetch } from './client';
import type { V2Scenario } from './types';

export type { V2Scenario };

export function v2FetchScenarios(): Promise<V2Scenario[]> {
  return v2Fetch<V2Scenario[]>('/api/scenarios');
}
