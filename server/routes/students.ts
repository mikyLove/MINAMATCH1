import { Router } from 'express';
import { getDb } from '../db';
import { syllabusUpdateSchema } from '@minamatch/shared';

const router = Router();

router.get('/', (_req, res) => {
  const db = getDb();
  const students = db.prepare('SELECT * FROM students').all() as any[];
  const enriched = students.map((s) => {
    const syllabus = db.prepare('SELECT id, course_id as cid, course_name as course, completed FROM student_syllabus WHERE student_id = ?').all(s.id);
    return {
      id: s.id,
      name: s.name,
      badge: s.badge,
      program: s.program,
      status: s.status,
      verificationHash: s.verification_hash,
      matchingScore: s.matching_score,
      retentionMonths: s.retention_months,
      signingBonus: s.signing_bonus,
      timestamp: s.timestamp,
      validatorNode: s.validator_node,
      avatarUrl: s.avatar_url,
      syllabus: syllabus.map((item: any) => ({
        id: item.cid,
        course: item.course,
        completed: Boolean(item.completed),
      })),
    };
  });
  res.json(enriched);
});

router.put('/:id/syllabus/:courseId', (req, res) => {
  const parsed = syllabusUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues?.[0]?.message || 'Datos inválidos' });
  }

  const db = getDb();
  const { id, courseId } = req.params;
  const { completed } = parsed.data;
  db.prepare('UPDATE student_syllabus SET completed = ? WHERE student_id = ? AND course_id = ?').run(completed ? 1 : 0, id, courseId);
  const allCourses = db.prepare('SELECT * FROM student_syllabus WHERE student_id = ?').all(id) as any[];
  const completedCount = allCourses.filter((c: any) => c.completed).length;
  const score = Number(((completedCount / allCourses.length) * 100).toFixed(1));
  const status = completedCount === allCourses.length ? 'FINALIZADO' : 'EN_CURSO';
  db.prepare('UPDATE students SET matching_score = ?, status = ? WHERE id = ?').run(score, status, id);
  res.json({ score, status, completed: Boolean(completed) });
});

export default router;
