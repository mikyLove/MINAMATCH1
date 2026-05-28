import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  serial,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const candidates = pgTable('candidates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  institution: text('institution').notNull(),
  img: text('img'),
  expYears: integer('exp_years').default(0),
  english: text('english').default(''),
  languages: text('languages').default('[]'),
  matchRating: real('match_rating').default(0),
  skills: text('skills').default('[]'),
  altitudeFit: real('altitude_fit').default(0),
  socialFit: real('social_fit').default(0),
  certified: boolean('certified').default(false),
  warning: text('warning'),
  isTop5: boolean('is_top5').default(false),
  hasOsha: boolean('has_osha').default(false),
  regionalRadar: text('regional_radar'),
  bio: text('bio'),
});

export const candidateInterviews = pgTable('candidate_interviews', {
  id: serial('id').primaryKey(),
  candidateId: text('candidate_id')
    .notNull()
    .references(() => candidates.id),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
});

export const students = pgTable('students', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  badge: text('badge'),
  program: text('program'),
  status: text('status').default('EN_CURSO'),
  verificationHash: text('verification_hash'),
  matchingScore: real('matching_score').default(0),
  retentionMonths: integer('retention_months').default(0),
  signingBonus: real('signing_bonus').default(0),
  timestamp: text('timestamp'),
  validatorNode: text('validator_node'),
  avatarUrl: text('avatar_url'),
});

export const studentSyllabus = pgTable('student_syllabus', {
  id: serial('id').primaryKey(),
  studentId: text('student_id')
    .notNull()
    .references(() => students.id),
  courseId: text('course_id').notNull(),
  courseName: text('course_name').notNull(),
  completed: boolean('completed').default(false),
});

export const scenarios = pgTable('scenarios', {
  id: text('id').primaryKey(),
  stage: text('stage'),
  stageNum: integer('stage_num'),
  category: text('category'),
  title: text('title'),
  description: text('description'),
  imageUrl: text('image_url'),
  alertText: text('alert_text'),
});

export const scenarioOptions = pgTable('scenario_options', {
  id: text('id').primaryKey(),
  scenarioId: text('scenario_id')
    .notNull()
    .references(() => scenarios.id),
  text: text('text').notNull(),
  description: text('description'),
  calma: real('calma').default(0),
  seguridad: real('seguridad').default(0),
  tiempo: text('tiempo'),
  toleranciaFrio: real('tolerancia_frio').default(0),
  culturalFitSeguridad: real('cultural_fit_seguridad').default(0),
  culturalFitEtica: real('cultural_fit_etica').default(0),
  culturalFitInnovacion: real('cultural_fit_innovacion').default(0),
});

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
    role: text('role').default('user'),
    avatar: text('avatar'),
    createdAt: text('created_at').default("datetime('now')"),
  },
  (table) => ({
    emailIdx: uniqueIndex('email_idx').on(table.email),
  }),
);

export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  role: text('role').notNull(),
  content: text('content').notNull(),
  responseSource: text('response_source'),
  createdAt: text('created_at').default("datetime('now')"),
});
