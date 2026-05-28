import { eq, asc } from 'drizzle-orm';
import { getDb } from '../client';
import { scenarios, scenarioOptions } from '../schema';
import type { ScenarioWithOptions } from '../provider.types';

async function loadOptions(db: ReturnType<typeof getDb>, scenarioId: string) {
  const rows = await db
    .select()
    .from(scenarioOptions)
    .where(eq(scenarioOptions.scenarioId, scenarioId));
  return rows.map((o) => ({
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
  }));
}

export async function findAll(): Promise<ScenarioWithOptions[]> {
  const db = getDb();
  const scenarioRows = await db
    .select()
    .from(scenarios)
    .orderBy(asc(scenarios.stageNum));

  const result: ScenarioWithOptions[] = [];
  for (const s of scenarioRows) {
    result.push({
      id: s.id,
      stage: s.stage,
      stageNum: s.stageNum,
      category: s.category,
      title: s.title,
      description: s.description,
      imageUrl: s.imageUrl,
      alertText: s.alertText,
      options: await loadOptions(db, s.id),
    });
  }
  return result;
}

export async function findById(id: string): Promise<ScenarioWithOptions | undefined> {
  const db = getDb();
  const rows = await db.select().from(scenarios).where(eq(scenarios.id, id));
  if (rows.length === 0) return undefined;
  const s = rows[0]!;
  return {
    id: s.id,
    stage: s.stage,
    stageNum: s.stageNum,
    category: s.category,
    title: s.title,
    description: s.description,
    imageUrl: s.imageUrl,
    alertText: s.alertText,
    options: await loadOptions(db, s.id),
  };
}
