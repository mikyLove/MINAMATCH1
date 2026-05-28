import { getSqliteDb } from './client';
import type {
  CandidateData,
  CandidateWithInterviews,
  CandidateInsert,
  InterviewData,
  ICandidatesRepo,
} from '../provider.types';

function rowToCandidate(row: Record<string, unknown>): CandidateData {
  return {
    id: row.id as string,
    name: row.name as string,
    title: row.title as string,
    institution: row.institution as string,
    img: (row.img as string) ?? null,
    expYears: (row.exp_years as number) ?? null,
    english: (row.english as string) ?? null,
    languages: (row.languages as string) ?? '[]',
    matchRating: (row.match_rating as number) ?? null,
    skills: (row.skills as string) ?? '[]',
    altitudeFit: (row.altitude_fit as number) ?? null,
    socialFit: (row.social_fit as number) ?? null,
    certified: Boolean(row.certified),
    warning: (row.warning as string) ?? null,
    isTop5: Boolean(row.is_top5),
    hasOsha: Boolean(row.has_osha),
    regionalRadar: (row.regional_radar as string) ?? null,
    bio: (row.bio as string) ?? null,
  };
}

function rowToInterview(row: Record<string, unknown>): InterviewData {
  return {
    id: row.id as number,
    candidateId: row.candidate_id as string,
    question: row.question as string,
    answer: row.answer as string,
  };
}

export async function findAll(): Promise<CandidateWithInterviews[]> {
  const db = getSqliteDb();
  const rows = db.prepare('SELECT * FROM candidates').all() as Record<string, unknown>[];
  const result: CandidateWithInterviews[] = [];

  for (const row of rows) {
    const candidateId = row.id as string;
    const interviews = db
      .prepare('SELECT * FROM candidate_interviews WHERE candidate_id = ?')
      .all(candidateId) as Record<string, unknown>[];
    result.push({ ...rowToCandidate(row), interviews: interviews.map(rowToInterview) });
  }

  return result;
}

export async function findById(id: string): Promise<CandidateWithInterviews | undefined> {
  const db = getSqliteDb();
  const row = db.prepare('SELECT * FROM candidates WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!row) return undefined;

  const interviews = db
    .prepare('SELECT * FROM candidate_interviews WHERE candidate_id = ?')
    .all(id) as Record<string, unknown>[];

  return { ...rowToCandidate(row), interviews: interviews.map(rowToInterview) };
}

export async function create(data: CandidateInsert): Promise<CandidateData> {
  const db = getSqliteDb();
  const stmt = db.prepare(`
    INSERT INTO candidates (id, name, title, institution, img, exp_years, english, languages, match_rating, skills, altitude_fit, social_fit, certified, warning, is_top5, has_osha, regional_radar, bio)
    VALUES (@id, @name, @title, @institution, @img, @exp_years, @english, @languages, @match_rating, @skills, @altitude_fit, @social_fit, @certified, @warning, @is_top5, @has_osha, @regional_radar, @bio)
  `);
  stmt.run({
    id: data.id,
    name: data.name,
    title: data.title,
    institution: data.institution,
    img: data.img ?? null,
    exp_years: data.expYears ?? null,
    english: data.english ?? null,
    languages: data.languages ?? '[]',
    match_rating: data.matchRating ?? null,
    skills: data.skills ?? '[]',
    altitude_fit: data.altitudeFit ?? null,
    social_fit: data.socialFit ?? null,
    certified: data.certified ? 1 : 0,
    warning: data.warning ?? null,
    is_top5: data.isTop5 ? 1 : 0,
    has_osha: data.hasOsha ? 1 : 0,
    regional_radar: data.regionalRadar ?? null,
    bio: data.bio ?? null,
  });
  return rowToCandidate(db.prepare('SELECT * FROM candidates WHERE id = ?').get(data.id) as Record<string, unknown>);
}

export async function update(id: string, data: Partial<CandidateInsert>): Promise<CandidateData | undefined> {
  const db = getSqliteDb();
  const existing = db.prepare('SELECT * FROM candidates WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!existing) return undefined;

  const merged = { ...existing, ...data };
  const stmt = db.prepare(`
    UPDATE candidates SET name=@name, title=@title, institution=@institution, img=@img, exp_years=@exp_years, english=@english, languages=@languages, match_rating=@match_rating, skills=@skills, altitude_fit=@altitude_fit, social_fit=@social_fit, certified=@certified, warning=@warning, is_top5=@is_top5, has_osha=@has_osha, regional_radar=@regional_radar, bio=@bio WHERE id=@id
  `);
  stmt.run(merged);
  return rowToCandidate(db.prepare('SELECT * FROM candidates WHERE id = ?').get(id) as Record<string, unknown>);
}

export async function remove(id: string): Promise<boolean> {
  const db = getSqliteDb();
  const result = db.prepare('DELETE FROM candidates WHERE id = ?').run(id);
  return result.changes > 0;
}

export async function count(): Promise<number> {
  const db = getSqliteDb();
  const row = db.prepare('SELECT COUNT(*) as cnt FROM candidates').get() as { cnt: number };
  return row.cnt;
}
