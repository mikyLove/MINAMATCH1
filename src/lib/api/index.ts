export { v2Fetch, V2_BASE_URL, V2ApiError } from './client';
export type { V2FetchOptions } from './client';

export {
  v2Login,
  v2VerifyToken,
} from './auth';
export type {
  V2LoginRequest,
  V2LoginResponse,
  V2UserProfile,
} from './auth';

export {
  v2FetchCandidates,
  v2FetchCandidate,
} from './candidates';
export type { V2Candidate } from './candidates';

export { v2FetchStudents } from './students';
export type { V2Student } from './students';
export { v2ToggleSyllabus } from './students';

export { v2FetchScenarios } from './scenarios';
export type { V2Scenario } from './scenarios';

export {
  v2FetchChatHistory,
  v2ClearChatHistory,
  v2SendChatMessage,
} from './chat';
export type { V2ChatMessage } from './chat';

export {
  v2Interview,
  v2EvaluateScenario,
  v2Matching,
} from './agents';
export type {
  V2AgentInterviewRequest,
  V2AgentInterviewResponse,
  V2AgentEvaluateScenarioRequest,
  V2AgentEvaluateScenarioResponse,
  V2AgentMatchingRequest,
  V2AgentMatchingResponse,
} from './agents';

export { v2Health, v2Ready } from './health';
export type { V2HealthStatus, V2ReadyStatus } from './health';

export type {
  V2StudentSyllabus,
  V2ScenarioOptionImpact,
  V2ScenarioOption,
  V2ChatMessage as V2ChatMessageType,
  V2EmptyResponse,
} from './types';
