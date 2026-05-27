import { Router } from 'express';
import { getDb } from '../db';

const router = Router();

router.get('/', (_req, res) => {
  const db = getDb();
  const candidates = db.prepare('SELECT * FROM candidates').all() as any[];
  const enriched = candidates.map((c) => {
    const interviews = db.prepare('SELECT question, answer FROM candidate_interviews WHERE candidate_id = ?').all(c.id);
    return {
      ...c,
      languages: JSON.parse(c.languages || '[]'),
      skills: JSON.parse(c.skills || '[]'),
      certified: Boolean(c.certified),
      isTop5: Boolean(c.is_top5),
      hasOsha: Boolean(c.has_osha),
      aiInterviewTranscript: interviews,
      expYears: c.exp_years,
      matchRating: c.match_rating,
      altitudeFit: c.altitude_fit,
      regionalRadar: c.regional_radar,
      socialFit: c.social_fit,
    };
  });
  res.json(enriched);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const candidate = db.prepare('SELECT * FROM candidates WHERE id = ?').get(req.params.id) as any;
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
  const interviews = db.prepare('SELECT question, answer FROM candidate_interviews WHERE candidate_id = ?').all(candidate.id);
  res.json({
    ...candidate,
    languages: JSON.parse(candidate.languages || '[]'),
    skills: JSON.parse(candidate.skills || '[]'),
    certified: Boolean(candidate.certified),
    isTop5: Boolean(candidate.is_top5),
    hasOsha: Boolean(candidate.has_osha),
    aiInterviewTranscript: interviews,
    expYears: candidate.exp_years,
    matchRating: candidate.match_rating,
    altitudeFit: candidate.altitude_fit,
    regionalRadar: candidate.regional_radar,
    socialFit: candidate.social_fit,
  });
});

export default router;
