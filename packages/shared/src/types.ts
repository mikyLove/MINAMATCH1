export interface Candidate {
  id: string;
  name: string;
  title: string;
  institution: string;
  img: string;
  expYears: number;
  english: string;
  languages: string[];
  matchRating: number;
  skills: string[];
  altitudeFit: number;
  certified: boolean;
  warning?: string;
  isTop5: boolean;
  hasOsha: boolean;
  regionalRadar?: string;
  socialFit?: number;
  bio?: string;
  aiInterviewTranscript?: {
    question: string;
    answer: string;
  }[];
}

export interface Student {
  id: string;
  name: string;
  badge: string;
  program: string;
  status: 'FINALIZADO' | 'EN_CURSO';
  syllabus: {
    id: string;
    course: string;
    completed: boolean;
  }[];
  verificationHash: string;
  matchingScore: number;
  retentionMonths: number;
  signingBonus: number;
  timestamp: string;
  validatorNode: string;
  avatarUrl: string;
}

export interface ScenarioOption {
  id: string;
  text: string;
  description: string;
  impact: {
    calma: number;
    seguridad: number;
    tiempo: string;
    toleranciaFrio: number;
    culturalFit: {
      seguridad: number;
      etica: number;
      innovacion: number;
    };
  };
}

export interface Scenario {
  id: string;
  stage: string;
  stageNum: number;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  alertText: string;
  options: ScenarioOption[];
}

export interface VocQuestionOption {
  id: string;
  text: string;
  scores: Record<string, number>;
}

export interface VocQuestion {
  id: string;
  question: string;
  dimension: string;
  icon: string;
  options: VocQuestionOption[];
}

export interface VocProfile {
  id: string;
  name: string;
  title: string;
  description: string;
  skills: string[];
  dailyTasks: string[];
  demandLevel: string;
  color: string;
}
