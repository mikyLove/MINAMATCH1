import { v2Fetch } from './client';
import type {
  V2AgentInterviewRequest,
  V2AgentInterviewResponse,
  V2AgentEvaluateScenarioRequest,
  V2AgentEvaluateScenarioResponse,
  V2AgentMatchingRequest,
  V2AgentMatchingResponse,
} from './types';

export type {
  V2AgentInterviewRequest,
  V2AgentInterviewResponse,
  V2AgentEvaluateScenarioRequest,
  V2AgentEvaluateScenarioResponse,
  V2AgentMatchingRequest,
  V2AgentMatchingResponse,
};

export function v2Interview(data: V2AgentInterviewRequest): Promise<V2AgentInterviewResponse> {
  return v2Fetch<V2AgentInterviewResponse>('/api/v2/agents/interview', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function v2EvaluateScenario(
  data: V2AgentEvaluateScenarioRequest,
): Promise<V2AgentEvaluateScenarioResponse> {
  return v2Fetch<V2AgentEvaluateScenarioResponse>('/api/v2/agents/evaluate-scenario', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function v2Matching(data: V2AgentMatchingRequest): Promise<V2AgentMatchingResponse> {
  return v2Fetch<V2AgentMatchingResponse>('/api/v2/agents/matching', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
