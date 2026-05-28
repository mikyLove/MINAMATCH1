import { getSqliteDb } from './client';
import type {
  StudentData,
  StudentWithSyllabus,
  StudentInsert,
  SyllabusData,
  IStudentsRepo,
} from '../provider.types';

function rowToStudent(row: Record<string, unknown>): StudentData {
  return {
    id: row.id as string,
    name: row.name as string,
    badge: (row.badge as string) ?? null,
    program: (row.program as string) ?? null,
    status: (row.status as string) ?? null,
    verificationHash: (row.verification_hash as string) ?? null,
    matchingScore: (row.matching_score as number) ?? null,
    retentionMonths: (row.retention_months as number) ?? null,
    signingBonus: (row.signing_bonus as number) ?? null,
    timestamp: (row.timestamp as string) ?? null,
    validatorNode: (row.validator_node as string) ?? null,
    avatarUrl: (row.avatar_url as string) ?? null,
  };
}

function rowToSyllabus(row: Record<string, unknown>): SyllabusData {
  return {
    id: row.id as number,
    studentId: row.student_id as string,
    courseId: row.course_id as string,
    courseName: row.course_name as string,
    completed: Boolean(row.completed),
  };
}

export async function findAll(): Promise<StudentWithSyllabus[]> {
  const db = getSqliteDb();
  const rows = db.prepare('SELECT * FROM students').all() as Record<string, unknown>[];
  const result: StudentWithSyllabus[] = [];

  for (const row of rows) {
    const studentId = row.id as string;
    const syllabus = db
      .prepare('SELECT * FROM student_syllabus WHERE student_id = ?')
      .all(studentId) as Record<string, unknown>[];
    result.push({ ...rowToStudent(row), syllabus: syllabus.map(rowToSyllabus) });
  }

  return result;
}

export async function findById(id: string): Promise<StudentWithSyllabus | undefined> {
  const db = getSqliteDb();
  const row = db.prepare('SELECT * FROM students WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!row) return undefined;

  const syllabus = db
    .prepare('SELECT * FROM student_syllabus WHERE student_id = ?')
    .all(id) as Record<string, unknown>[];

  return { ...rowToStudent(row), syllabus: syllabus.map(rowToSyllabus) };
}

export async function create(data: StudentInsert): Promise<StudentData> {
  const db = getSqliteDb();
  const stmt = db.prepare(`
    INSERT INTO students (id, name, badge, program, status, verification_hash, matching_score, retention_months, signing_bonus, timestamp, validator_node, avatar_url)
    VALUES (@id, @name, @badge, @program, @status, @verification_hash, @matching_score, @retention_months, @signing_bonus, @timestamp, @validator_node, @avatar_url)
  `);
  stmt.run({
    id: data.id,
    name: data.name,
    badge: data.badge ?? null,
    program: data.program ?? null,
    status: data.status ?? 'EN_CURSO',
    verification_hash: data.verificationHash ?? null,
    matching_score: data.matchingScore ?? null,
    retention_months: data.retentionMonths ?? null,
    signing_bonus: data.signingBonus ?? null,
    timestamp: data.timestamp ?? null,
    validator_node: data.validatorNode ?? null,
    avatar_url: data.avatarUrl ?? null,
  });
  return rowToStudent(db.prepare('SELECT * FROM students WHERE id = ?').get(data.id) as Record<string, unknown>);
}

export async function update(id: string, data: Partial<StudentInsert>): Promise<StudentData | undefined> {
  const db = getSqliteDb();
  const existing = db.prepare('SELECT * FROM students WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!existing) return undefined;

  const merged = { ...existing, ...data };
  const stmt = db.prepare(`
    UPDATE students SET name=@name, badge=@badge, program=@program, status=@status, verification_hash=@verification_hash, matching_score=@matching_score, retention_months=@retention_months, signing_bonus=@signing_bonus, timestamp=@timestamp, validator_node=@validator_node, avatar_url=@avatar_url WHERE id=@id
  `);
  stmt.run(merged);
  return rowToStudent(db.prepare('SELECT * FROM students WHERE id = ?').get(id) as Record<string, unknown>);
}

export async function remove(id: string): Promise<boolean> {
  const db = getSqliteDb();
  const result = db.prepare('DELETE FROM students WHERE id = ?').run(id);
  return result.changes > 0;
}

export async function count(): Promise<number> {
  const db = getSqliteDb();
  const row = db.prepare('SELECT COUNT(*) as cnt FROM students').get() as { cnt: number };
  return row.cnt;
}

export async function updateSyllabus(
  studentId: string,
  courseId: string,
  completed: boolean,
): Promise<SyllabusData | undefined> {
  const db = getSqliteDb();
  db.prepare('UPDATE student_syllabus SET completed = ? WHERE student_id = ? AND course_id = ?').run(
    completed ? 1 : 0,
    studentId,
    courseId,
  );
  const row = db
    .prepare('SELECT * FROM student_syllabus WHERE student_id = ? AND course_id = ?')
    .get(studentId, courseId) as Record<string, unknown> | undefined;
  return row ? rowToSyllabus(row) : undefined;
}

export async function getSyllabusByStudent(studentId: string): Promise<SyllabusData[]> {
  const db = getSqliteDb();
  const rows = db
    .prepare('SELECT * FROM student_syllabus WHERE student_id = ?')
    .all(studentId) as Record<string, unknown>[];
  return rows.map(rowToSyllabus);
}

export async function recalculateScore(studentId: string): Promise<number> {
  const syllabus = await getSyllabusByStudent(studentId);
  const total = syllabus.length;
  if (total === 0) return 0;

  const completedCount = syllabus.filter((s) => s.completed).length;
  const score = Math.round((completedCount / total) * 100 * 10) / 10;

  const status = score === 100 ? 'FINALIZADO' : 'EN_CURSO';
  const db = getSqliteDb();
  db.prepare('UPDATE students SET matching_score = ?, status = ? WHERE id = ?').run(score, status, studentId);

  return score;
}
