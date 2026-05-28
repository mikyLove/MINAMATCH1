import { Router } from 'express';
import { getProvider } from '@minamatch/database';

const router: Router = Router();

router.get('/candidates', async (req, res) => {
  try {
    const provider = await getProvider();
    const rows = await provider.candidates.findAll();
    const enriched = rows.map((c) => ({
      ...c,
      languages: JSON.parse(c.languages || '[]'),
      skills: JSON.parse(c.skills || '[]'),
      certified: Boolean(c.certified),
      isTop5: Boolean(c.isTop5),
      hasOsha: Boolean(c.hasOsha),
      aiInterviewTranscript: c.interviews.map((i) => ({
        question: i.question,
        answer: i.answer,
      })),
      exp_years: c.expYears,
      match_rating: c.matchRating,
      altitude_fit: c.altitudeFit,
      regional_radar: c.regionalRadar,
      social_fit: c.socialFit,
      is_top5: c.isTop5 ? 1 : 0,
      has_osha: c.hasOsha ? 1 : 0,
    }));
    res.json(enriched);
  } catch (err) {
    req.log?.error({ err }, 'GET /candidates error');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/candidates/:id', async (req, res) => {
  try {
    const provider = await getProvider();
    const row = await provider.candidates.findById(req.params.id);
    if (!row) {
      req.log?.warn({ candidateId: req.params.id }, 'Candidate not found');
      return res.status(404).json({ error: 'Candidate not found' });
    }
    const result = {
      ...row,
      languages: JSON.parse(row.languages || '[]'),
      skills: JSON.parse(row.skills || '[]'),
      certified: Boolean(row.certified),
      isTop5: Boolean(row.isTop5),
      hasOsha: Boolean(row.hasOsha),
      aiInterviewTranscript: row.interviews.map((i) => ({
        question: i.question,
        answer: i.answer,
      })),
      exp_years: row.expYears,
      match_rating: row.matchRating,
      altitude_fit: row.altitudeFit,
      regional_radar: row.regionalRadar,
      social_fit: row.socialFit,
      is_top5: row.isTop5 ? 1 : 0,
      has_osha: row.hasOsha ? 1 : 0,
    };
    res.json(result);
  } catch (err) {
    req.log?.error({ err, candidateId: req.params.id }, 'GET /candidates/:id error');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/students', async (req, res) => {
  try {
    const provider = await getProvider();
    const rows = await provider.students.findAll();
    const enriched = rows.map((s) => ({
      id: s.id,
      name: s.name,
      badge: s.badge,
      program: s.program,
      status: s.status,
      verificationHash: s.verificationHash,
      matchingScore: s.matchingScore,
      retentionMonths: s.retentionMonths,
      signingBonus: s.signingBonus,
      timestamp: s.timestamp,
      validatorNode: s.validatorNode,
      avatarUrl: s.avatarUrl,
      syllabus: s.syllabus.map((item) => ({
        id: item.courseId,
        course: item.courseName,
        completed: Boolean(item.completed),
      })),
    }));
    res.json(enriched);
  } catch (err) {
    req.log?.error({ err }, 'GET /students error');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/scenarios', async (req, res) => {
  try {
    const provider = await getProvider();
    const rows = await provider.scenarios.findAll();
    res.json(rows);
  } catch (err) {
    req.log?.error({ err }, 'GET /scenarios error');
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
