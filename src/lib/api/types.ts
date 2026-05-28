export interface V2Candidate {
  id: string;
  name: string;
  title: string;
  institution: string;
  img: string | null;
  expYears: number | null;
  english: string | null;
  languages: string[];
  matchRating: number | null;
  skills: string[];
  altitudeFit: number | null;
  socialFit: number | null;
  certified: boolean;
  warning: string | null;
  isTop5: boolean;
  hasOsha: boolean;
  regionalRadar: string | null;
  bio: string | null;
  aiInterviewTranscript: { question: string; answer: string }[];
  /** snake_case legacy compat */
  exp_years: number | null;
  match_rating: number | null;
  altitude_fit: number | null;
  social_fit: number | null;
  is_top5: number;
  has_osha: number;
}

export interface V2StudentSyllabus {
  id: string;
  course: string;
  completed: boolean;
}

export interface V2Student {
  id: string;
  name: string;
  badge: string;
  program: string;
  status: string;
  verificationHash: string;
  matchingScore: number;
  retentionMonths: number;
  signingBonus: number;
  timestamp: string;
  validatorNode: string;
  avatarUrl: string;
  syllabus: V2StudentSyllabus[];
}

export interface V2ScenarioOptionImpact {
  calma: number;
  seguridad: number;
  tiempo: number;
  toleranciaFrio: number;
  culturalFit: {
    seguridad: number;
    etica: number;
    innovacion: number;
  };
}

export interface V2ScenarioOption {
  id: number;
  text: string;
  description: string;
  impact: V2ScenarioOptionImpact;
}

export interface V2Scenario {
  id: number;
  stage: string;
  stageNum: number;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  alertText: string;
  options: V2ScenarioOption[];
}

export interface V2LoginRequest {
  email: string;
  password: string;
}

export interface V2LoginResponse {
  token: string;
  user: V2UserProfile;
}

export interface V2UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}

export interface V2ChatMessage {
  id: number;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  responseSource: string | null;
  createdAt: string;
}

export interface V2ChatMessageRequest {
  message: string;
}

export interface V2AgentInterviewRequest {
  candidateId: string;
  question: string;
  answer: string;
}

export interface V2AgentInterviewResponse {
  evaluation: string;
  candidate: { id: string; name: string };
}

export interface V2AgentEvaluateScenarioRequest {
  scenarioId: string;
  optionId: string;
}

export interface V2AgentEvaluateScenarioResponse {
  feedback: string;
  scenario: { id: string };
}

export interface V2AgentMatchingRequest {
  requirements: string;
}

export interface V2AgentMatchingResponse {
  analysis: string;
  totalCandidates: number;
}

export interface V2HealthStatus {
  status: 'ok';
  version: string;
  provider: 'postgres' | 'sqlite' | 'unknown';
  dbStatus: 'connected' | 'disconnected' | 'error';
  gemini: 'ok' | 'disabled';
  uptime: number;
  environment: string;
  logging: boolean;
  pid: number;
  memory: { rss: number; heapTotal: number; heapUsed: number };
  timestamp: string;
}

export interface V2ReadyStatus {
  status: 'ok' | 'error';
  version: string;
  provider?: 'postgres' | 'sqlite' | 'unknown';
  dbStatus: 'connected' | 'disconnected' | 'error';
  gemini: 'ok' | 'disabled';
  uptime: number;
  environment: string;
  logging: boolean;
  pid: number;
  error?: string;
  timestamp: string;
}

export interface V2EmptyResponse {
  success: boolean;
}
