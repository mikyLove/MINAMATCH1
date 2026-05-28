import { getSqliteDb } from './client';
import type { ScenarioWithOptions } from '../provider.types';

function loadOptions(db: ReturnType<typeof getSqliteDb>, scenarioId: string) {
  const rows = db
    .prepare('SELECT * FROM scenario_options WHERE scenario_id = ?')
    .all(scenarioId) as Record<string, unknown>[];
  return rows.map((o) => ({
    id: o.id as string,
    text: o.text as string,
    description: (o.description as string) ?? null,
    impact: {
      calma: (o.calma as number) ?? null,
      seguridad: (o.seguridad as number) ?? null,
      tiempo: (o.tiempo as string) ?? null,
      toleranciaFrio: (o.tolerancia_frio as number) ?? null,
      culturalFit: {
        seguridad: (o.cultural_fit_seguridad as number) ?? null,
        etica: (o.cultural_fit_etica as number) ?? null,
        innovacion: (o.cultural_fit_innovacion as number) ?? null,
      },
    },
  }));
}

export async function findAll(): Promise<ScenarioWithOptions[]> {
  const db = getSqliteDb();
  const scenarioRows = db
    .prepare('SELECT * FROM scenarios ORDER BY stage_num ASC')
    .all() as Record<string, unknown>[];

  const result: ScenarioWithOptions[] = [];
  for (const s of scenarioRows) {
    result.push({
      id: s.id as string,
      stage: (s.stage as string) ?? null,
      stageNum: (s.stage_num as number) ?? null,
      category: (s.category as string) ?? null,
      title: (s.title as string) ?? null,
      description: (s.description as string) ?? null,
      imageUrl: (s.image_url as string) ?? null,
      alertText: (s.alert_text as string) ?? null,
      options: loadOptions(db, s.id as string),
    });
  }
  return result;
}

export async function findById(id: string): Promise<ScenarioWithOptions | undefined> {
  const db = getSqliteDb();
  const s = db.prepare('SELECT * FROM scenarios WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!s) return undefined;
  return {
    id: s.id as string,
    stage: (s.stage as string) ?? null,
    stageNum: (s.stage_num as number) ?? null,
    category: (s.category as string) ?? null,
    title: (s.title as string) ?? null,
    description: (s.description as string) ?? null,
    imageUrl: (s.image_url as string) ?? null,
    alertText: (s.alert_text as string) ?? null,
    options: loadOptions(db, s.id as string),
  };
}
