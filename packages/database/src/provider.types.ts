// ─── Candidate types ───────────────────────────────────────────
export interface CandidateData {
  id: string;
  name: string;
  title: string;
  institution: string;
  img: string | null;
  expYears: number | null;
  english: string | null;
  languages: string | null;
  matchRating: number | null;
  skills: string | null;
  altitudeFit: number | null;
  socialFit: number | null;
  certified: boolean | null;
  warning: string | null;
  isTop5: boolean | null;
  hasOsha: boolean | null;
  regionalRadar: string | null;
  bio: string | null;
}

export interface InterviewData {
  id: number;
  candidateId: string;
  question: string;
  answer: string;
}

export interface CandidateWithInterviews extends CandidateData {
  interviews: InterviewData[];
}

export interface CandidateInsert {
  id: string;
  name: string;
  title: string;
  institution: string;
  img?: string | null;
  expYears?: number | null;
  english?: string | null;
  languages?: string | null;
  matchRating?: number | null;
  skills?: string | null;
  altitudeFit?: number | null;
  socialFit?: number | null;
  certified?: boolean | null;
  warning?: string | null;
  isTop5?: boolean | null;
  hasOsha?: boolean | null;
  regionalRadar?: string | null;
  bio?: string | null;
}

// ─── Student types ────────────────────────────────────────────
export interface StudentData {
  id: string;
  name: string;
  badge: string | null;
  program: string | null;
  status: string | null;
  verificationHash: string | null;
  matchingScore: number | null;
  retentionMonths: number | null;
  signingBonus: number | null;
  timestamp: string | null;
  validatorNode: string | null;
  avatarUrl: string | null;
}

export interface SyllabusData {
  id: number;
  studentId: string;
  courseId: string;
  courseName: string;
  completed: boolean | null;
}

export interface StudentWithSyllabus extends StudentData {
  syllabus: SyllabusData[];
}

export interface StudentInsert {
  id: string;
  name: string;
  badge?: string | null;
  program?: string | null;
  status?: string | null;
  verificationHash?: string | null;
  matchingScore?: number | null;
  retentionMonths?: number | null;
  signingBonus?: number | null;
  timestamp?: string | null;
  validatorNode?: string | null;
  avatarUrl?: string | null;
}

// ─── User types ────────────────────────────────────────────────
export interface UserData {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string | null;
  avatar: string | null;
  createdAt: string | null;
}

export interface UserInsert {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: string | null;
  avatar?: string | null;
  createdAt?: string | null;
}

// ─── Scenario types ────────────────────────────────────────────
export interface ScenarioOptionImpact {
  calma: number | null;
  seguridad: number | null;
  tiempo: string | null;
  toleranciaFrio: number | null;
  culturalFit: {
    seguridad: number | null;
    etica: number | null;
    innovacion: number | null;
  };
}

export interface ScenarioOptionData {
  id: string;
  text: string;
  description: string | null;
  impact: ScenarioOptionImpact;
}

export interface ScenarioWithOptions {
  id: string;
  stage: string | null;
  stageNum: number | null;
  category: string | null;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  alertText: string | null;
  options: ScenarioOptionData[];
}

// ─── Chat message types ────────────────────────────────────────
export interface ChatMessageData {
  id: number;
  userId: string | null;
  role: string;
  content: string;
  responseSource: string | null;
  createdAt: string | null;
}

export interface ChatMessageInsert {
  userId: string | null;
  role: string;
  content: string;
  responseSource?: string | null;
}

// ─── Repository interfaces ──────────────────────────────────────

export interface ICandidatesRepo {
  findAll(): Promise<CandidateWithInterviews[]>;
  findById(id: string): Promise<CandidateWithInterviews | undefined>;
  create(data: CandidateInsert): Promise<CandidateData>;
  update(id: string, data: Partial<CandidateInsert>): Promise<CandidateData | undefined>;
  remove(id: string): Promise<boolean>;
  count(): Promise<number>;
}

export interface IStudentsRepo {
  findAll(): Promise<StudentWithSyllabus[]>;
  findById(id: string): Promise<StudentWithSyllabus | undefined>;
  create(data: StudentInsert): Promise<StudentData>;
  update(id: string, data: Partial<StudentInsert>): Promise<StudentData | undefined>;
  remove(id: string): Promise<boolean>;
  count(): Promise<number>;
  updateSyllabus(studentId: string, courseId: string, completed: boolean): Promise<SyllabusData | undefined>;
  getSyllabusByStudent(studentId: string): Promise<SyllabusData[]>;
  recalculateScore(studentId: string): Promise<number>;
}

export interface IUsersRepo {
  findByEmail(email: string): Promise<UserData | undefined>;
  findById(id: string): Promise<UserData | undefined>;
  create(data: UserInsert): Promise<UserData>;
  update(id: string, data: Partial<UserInsert>): Promise<UserData | undefined>;
  remove(id: string): Promise<boolean>;
  count(): Promise<number>;
}

export interface IScenariosRepo {
  findAll(): Promise<ScenarioWithOptions[]>;
  findById(id: string): Promise<ScenarioWithOptions | undefined>;
}

export interface IChatRepo {
  findHistory(userId: string, limit?: number): Promise<ChatMessageData[]>;
  addMessage(data: ChatMessageInsert): Promise<ChatMessageData>;
  deleteOld(userId: string, ttlMinutes?: number): Promise<number>;
  clearHistory(userId: string): Promise<number>;
  count(): Promise<number>;
}

// ─── Provider interface ─────────────────────────────────────────

export type DatabaseProviderKind = 'postgres' | 'sqlite';

export interface DatabaseProvider {
  kind: DatabaseProviderKind;
  candidates: ICandidatesRepo;
  students: IStudentsRepo;
  users: IUsersRepo;
  chat: IChatRepo;
  scenarios: IScenariosRepo;
}
