import { eq, sql } from 'drizzle-orm';
import { getDb } from '../client';
import { candidates, candidateInterviews } from '../schema';
import type { Candidate, CandidateInterview } from '../schema';

export type CandidateRow = typeof candidates.$inferSelect;
export type CandidateInsert = typeof candidates.$inferInsert;
export type CandidateInterviewRow = typeof candidateInterviews.$inferSelect;
export type CandidateInterviewInsert = typeof candidateInterviews.$inferInsert;

export type CandidateWithInterviews = CandidateRow & {
  interviews: CandidateInterviewRow[];
};

export async function findAll(): Promise<CandidateWithInterviews[]> {
  const db = getDb();
  const rows = await db.select().from(candidates);
  const result: CandidateWithInterviews[] = [];

  for (const row of rows) {
    const interviews = await db
      .select()
      .from(candidateInterviews)
      .where(eq(candidateInterviews.candidateId, row.id));
    result.push({ ...row, interviews });
  }

  return result;
}

export async function findById(id: string): Promise<CandidateWithInterviews | undefined> {
  const db = getDb();
  const rows = await db.select().from(candidates).where(eq(candidates.id, id));
  if (rows.length === 0) return undefined;

  const row = rows[0]!;
  const interviews = await db
    .select()
    .from(candidateInterviews)
    .where(eq(candidateInterviews.candidateId, row.id));

  return { ...row, interviews };
}

export async function create(data: CandidateInsert): Promise<CandidateRow> {
  const db = getDb();
  const rows = await db.insert(candidates).values(data).returning();
  return rows[0]!;
}

export async function update(id: string, data: Partial<CandidateInsert>): Promise<CandidateRow | undefined> {
  const db = getDb();
  const rows = await db
    .update(candidates)
    .set(data)
    .where(eq(candidates.id, id))
    .returning();
  return rows[0];
}

export async function remove(id: string): Promise<boolean> {
  const db = getDb();
  const rows = await db
    .delete(candidates)
    .where(eq(candidates.id, id))
    .returning({ id: candidates.id });
  return rows.length > 0;
}

export async function count(): Promise<number> {
  const db = getDb();
  const rows = await db
    .select({ count: sql<number>`count(*)` })
    .from(candidates);
  return Number(rows[0]?.count ?? 0);
}
