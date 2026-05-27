import { Router } from 'express';
import { getDb } from '../db';

const router = Router();

router.get('/', (_req, res) => {
  const db = getDb();
  const scenarios = db.prepare('SELECT * FROM scenarios ORDER BY stage_num ASC').all() as any[];
  const enriched = scenarios.map((s) => {
    const options = db.prepare('SELECT * FROM scenario_options WHERE scenario_id = ?').all(s.id) as any[];
    return {
      id: s.id,
      stage: s.stage,
      stageNum: s.stage_num,
      category: s.category,
      title: s.title,
      description: s.description,
      imageUrl: s.image_url,
      alertText: s.alert_text,
      options: options.map((o) => ({
        id: o.id,
        text: o.text,
        description: o.description,
        impact: {
          calma: o.calma,
          seguridad: o.seguridad,
          tiempo: o.tiempo,
          toleranciaFrio: o.tolerancia_frio,
          culturalFit: {
            seguridad: o.cultural_fit_seguridad,
            etica: o.cultural_fit_etica,
            innovacion: o.cultural_fit_innovacion,
          },
        },
      })),
    };
  });
  res.json(enriched);
});

export default router;
