import { Router } from 'express';
import { eq, asc } from 'drizzle-orm';
import { candidatesRepo, studentsRepo, getDb, scenarios, scenarioOptions } from '@minamatch/database';

const router: Router = Router();

// GET /api/candidates — lista completa con entrevistas (igual que V1)
router.get('/candidates', async (_req, res) => {
  try {
    const rows = await candidatesRepo.findAll();
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
      // Compatibilidad V1: duplicar con snake_case
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
    console.error('[V2] GET /candidates error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/candidates/:id — candidato individual con entrevistas (igual que V1)
router.get('/candidates/:id', async (req, res) => {
  try {
    const row = await candidatesRepo.findById(req.params.id);
    if (!row) {
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
    console.error('[V2] GET /candidates/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/students — lista completa con syllabus (igual que V1)
router.get('/students', async (_req, res) => {
  try {
    const rows = await studentsRepo.findAll();
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
    console.error('[V2] GET /students error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/scenarios — lista completa con opciones (igual que V1)
router.get('/scenarios', async (_req, res) => {
  try {
    const db = getDb();
    const scenarioRows = await db
      .select()
      .from(scenarios)
      .orderBy(asc(scenarios.stageNum));

    const enriched = [];
    for (const s of scenarioRows) {
      const optionRows = await db
        .select()
        .from(scenarioOptions)
        .where(eq(scenarioOptions.scenarioId, s.id));

      enriched.push({
        id: s.id,
        stage: s.stage,
        stageNum: s.stageNum,
        category: s.category,
        title: s.title,
        description: s.description,
        imageUrl: s.imageUrl,
        alertText: s.alertText,
        options: optionRows.map((o) => ({
          id: o.id,
          text: o.text,
          description: o.description,
          impact: {
            calma: o.calma,
            seguridad: o.seguridad,
            tiempo: o.tiempo,
            toleranciaFrio: o.toleranciaFrio,
            culturalFit: {
              seguridad: o.culturalFitSeguridad,
              etica: o.culturalFitEtica,
              innovacion: o.culturalFitInnovacion,
            },
          },
        })),
      });
    }
    res.json(enriched);
  } catch (err) {
    console.error('[V2] GET /scenarios error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
