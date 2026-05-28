import { eq, sql } from 'drizzle-orm';
import { getDb } from '../client';
import { students, studentSyllabus } from '../schema';

export type StudentRow = typeof students.$inferSelect;
export type StudentInsert = typeof students.$inferInsert;
export type StudentSyllabusRow = typeof studentSyllabus.$inferSelect;
export type StudentSyllabusInsert = typeof studentSyllabus.$inferInsert;

export type StudentWithSyllabus = StudentRow & {
  syllabus: StudentSyllabusRow[];
};

export async function findAll(): Promise<StudentWithSyllabus[]> {
  const db = getDb();
  const rows = await db.select().from(students);
  const result: StudentWithSyllabus[] = [];

  for (const row of rows) {
    const syllabus = await db
      .select()
      .from(studentSyllabus)
      .where(eq(studentSyllabus.studentId, row.id));
    result.push({ ...row, syllabus });
  }

  return result;
}

export async function findById(id: string): Promise<StudentWithSyllabus | undefined> {
  const db = getDb();
  const rows = await db.select().from(students).where(eq(students.id, id));
  if (rows.length === 0) return undefined;

  const row = rows[0]!;
  const syllabus = await db
    .select()
    .from(studentSyllabus)
    .where(eq(studentSyllabus.studentId, row.id));

  return { ...row, syllabus };
}

export async function create(data: StudentInsert): Promise<StudentRow> {
  const db = getDb();
  const rows = await db.insert(students).values(data).returning();
  return rows[0]!;
}

export async function update(id: string, data: Partial<StudentInsert>): Promise<StudentRow | undefined> {
  const db = getDb();
  const rows = await db
    .update(students)
    .set(data)
    .where(eq(students.id, id))
    .returning();
  return rows[0];
}

export async function remove(id: string): Promise<boolean> {
  const db = getDb();
  const rows = await db
    .delete(students)
    .where(eq(students.id, id))
    .returning({ id: students.id });
  return rows.length > 0;
}

export async function count(): Promise<number> {
  const db = getDb();
  const rows = await db
    .select({ count: sql<number>`count(*)` })
    .from(students);
  return Number(rows[0]?.count ?? 0);
}

// Syllabus-specific operations

export async function updateSyllabus(
  studentId: string,
  courseId: string,
  completed: boolean,
): Promise<StudentSyllabusRow | undefined> {
  const db = getDb();
  const rows = await db
    .update(studentSyllabus)
    .set({ completed })
    .where(
      sql`${studentSyllabus.studentId} = ${studentId} AND ${studentSyllabus.courseId} = ${courseId}`,
    )
    .returning();
  return rows[0];
}

export async function getSyllabusByStudent(studentId: string): Promise<StudentSyllabusRow[]> {
  const db = getDb();
  return db
    .select()
    .from(studentSyllabus)
    .where(eq(studentSyllabus.studentId, studentId));
}

export async function recalculateScore(studentId: string): Promise<number> {
  const db = getDb();
  const syllabus = await getSyllabusByStudent(studentId);
  const total = syllabus.length;
  if (total === 0) return 0;

  const completed = syllabus.filter((s) => s.completed).length;
  const score = Math.round((completed / total) * 100 * 10) / 10;

  const status = score === 100 ? 'FINALIZADO' : 'EN_CURSO';
  await db
    .update(students)
    .set({ matchingScore: score, status })
    .where(eq(students.id, studentId));

  return score;
}
