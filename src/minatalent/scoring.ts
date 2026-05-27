export interface DiscScores {
  D: number; I: number; S: number; C: number;
}

export interface WonderlicResult {
  correct: number;
  total: number;
  percentage: number;
  level: 'Bajo' | 'Promedio' | 'Bueno' | 'Excelente';
  percentile: number;
}

export interface BigFiveScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface IntegrityScore {
  honesty: number;
  ethics: number;
  riskPrevention: number;
  compliance: number;
  overall: number;
  level: 'Alto' | 'Moderado' | 'Bajo';
  alerts: string[];
}

export interface HoganScores {
  leadership: number;
  prudence: number;
  resilience: number;
  sociability: number;
  learning: number;
}

export interface FitSocialScore {
  comunidad: number;
  cultura: number;
  conflictos: number;
  sostenibilidad: number;
  overall: number;
}

export interface GlobalScore {
  psicologico: number;
  cognitivo: number;
  conductual: number;
  seguridad: number;
  adaptacionMinera: number;
  social: number;
  overall: number;
}

export interface MiningProfileMatch {
  profileId: string;
  name: string;
  score: number;
  compatibility: number;
}

export type MiningProfileId = 'geologo' | 'hse' | 'operaciones' | 'metalurgista' | 'mecanico' | 'geomecanico' | 'ambiental' | 'topografo';

export const miningProfileWeights: Record<MiningProfileId, {
  disc: Partial<DiscScores>;
  bigfive: Partial<BigFiveScores>;
  hogan: Partial<HoganScores>;
  minIntegrity: number;
  minCognitivo: number;
}> = {
  geologo: {
    disc: { C: 0.35, I: 0.25, D: 0.25, S: 0.15 },
    bigfive: { openness: 0.9, conscientiousness: 0.8, extraversion: 0.3, agreeableness: 0.5, neuroticism: 0.3 },
    hogan: { learning: 0.9, prudence: 0.7, resilience: 0.6, sociability: 0.3, leadership: 0.4 },
    minIntegrity: 70, minCognitivo: 60,
  },
  hse: {
    disc: { C: 0.45, S: 0.25, D: 0.2, I: 0.1 },
    bigfive: { conscientiousness: 0.9, neuroticism: 0.2, agreeableness: 0.7, extraversion: 0.4, openness: 0.6 },
    hogan: { prudence: 0.95, resilience: 0.7, leadership: 0.5, sociability: 0.4, learning: 0.6 },
    minIntegrity: 85, minCognitivo: 55,
  },
  operaciones: {
    disc: { D: 0.4, S: 0.25, C: 0.2, I: 0.15 },
    bigfive: { extraversion: 0.7, conscientiousness: 0.7, neuroticism: 0.3, agreeableness: 0.5, openness: 0.5 },
    hogan: { leadership: 0.85, resilience: 0.8, prudence: 0.6, sociability: 0.6, learning: 0.5 },
    minIntegrity: 65, minCognitivo: 50,
  },
  metalurgista: {
    disc: { C: 0.4, S: 0.25, D: 0.2, I: 0.15 },
    bigfive: { conscientiousness: 0.85, openness: 0.7, neuroticism: 0.25, agreeableness: 0.5, extraversion: 0.3 },
    hogan: { learning: 0.85, prudence: 0.75, resilience: 0.5, sociability: 0.3, leadership: 0.4 },
    minIntegrity: 70, minCognitivo: 65,
  },
  mecanico: {
    disc: { C: 0.35, S: 0.3, D: 0.2, I: 0.15 },
    bigfive: { conscientiousness: 0.8, neuroticism: 0.2, agreeableness: 0.5, extraversion: 0.3, openness: 0.6 },
    hogan: { prudence: 0.7, resilience: 0.7, learning: 0.7, sociability: 0.3, leadership: 0.3 },
    minIntegrity: 60, minCognitivo: 45,
  },
  geomecanico: {
    disc: { C: 0.45, D: 0.25, S: 0.2, I: 0.1 },
    bigfive: { conscientiousness: 0.9, openness: 0.7, neuroticism: 0.2, agreeableness: 0.4, extraversion: 0.2 },
    hogan: { prudence: 0.85, learning: 0.8, resilience: 0.6, sociability: 0.2, leadership: 0.4 },
    minIntegrity: 75, minCognitivo: 65,
  },
  ambiental: {
    disc: { S: 0.35, C: 0.3, I: 0.2, D: 0.15 },
    bigfive: { agreeableness: 0.85, openness: 0.75, conscientiousness: 0.7, neuroticism: 0.2, extraversion: 0.5 },
    hogan: { sociability: 0.8, prudence: 0.7, resilience: 0.6, learning: 0.6, leadership: 0.3 },
    minIntegrity: 80, minCognitivo: 55,
  },
  topografo: {
    disc: { C: 0.4, S: 0.3, D: 0.15, I: 0.15 },
    bigfive: { conscientiousness: 0.85, neuroticism: 0.2, agreeableness: 0.5, extraversion: 0.3, openness: 0.5 },
    hogan: { prudence: 0.85, learning: 0.6, resilience: 0.5, sociability: 0.3, leadership: 0.3 },
    minIntegrity: 65, minCognitivo: 55,
  },
};

export function calculateDisc(discAnswers: Record<string, { most: number; least: number }>): DiscScores {
  const scores: DiscScores = { D: 0, I: 0, S: 0, C: 0 };
  const dimensions: (keyof DiscScores)[] = ['D', 'I', 'S', 'C'];
  Object.values(discAnswers).forEach(a => {
    if (a.most !== -1) scores[dimensions[a.most]]++;
    if (a.least !== -1) scores[dimensions[a.least]]--;
  });
  const max = Math.max(...Object.values(scores), 1);
  return Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, Math.round(((v + 12) / 24) * 100)])) as unknown as DiscScores;
}

export function calculateWonderlic(correctCount: number): WonderlicResult {
  const total = 30;
  const percentage = Math.round((correctCount / total) * 100);
  let level: WonderlicResult['level'];
  let percentile: number;
  if (correctCount >= 27) { level = 'Excelente'; percentile = 95; }
  else if (correctCount >= 22) { level = 'Bueno'; percentile = 75; }
  else if (correctCount >= 15) { level = 'Promedio'; percentile = 50; }
  else { level = 'Bajo'; percentile = 20; }
  return { correct: correctCount, total, percentage, level, percentile };
}

export function calculateBigFive(answers: Record<number, number>): BigFiveScores {
  const dimQuestions: Record<string, { id: number; dir: string }[]> = { openness: [], conscientiousness: [], extraversion: [], agreeableness: [], neuroticism: [] };
  const bfQuestions = [
    { id: 1, dim: 'conscientiousness', dir: 'pos' }, { id: 2, dim: 'neuroticism', dir: 'neg' },
    { id: 3, dim: 'extraversion', dir: 'pos' }, { id: 4, dim: 'openness', dir: 'pos' },
    { id: 5, dim: 'agreeableness', dir: 'pos' }, { id: 6, dim: 'conscientiousness', dir: 'pos' },
    { id: 7, dim: 'neuroticism', dir: 'pos' }, { id: 8, dim: 'extraversion', dir: 'neg' },
    { id: 9, dim: 'openness', dir: 'pos' }, { id: 10, dim: 'agreeableness', dir: 'pos' },
    { id: 11, dim: 'conscientiousness', dir: 'pos' }, { id: 12, dim: 'neuroticism', dir: 'pos' },
    { id: 13, dim: 'extraversion', dir: 'pos' }, { id: 14, dim: 'openness', dir: 'neg' },
    { id: 15, dim: 'agreeableness', dir: 'pos' }, { id: 16, dim: 'conscientiousness', dir: 'pos' },
    { id: 17, dim: 'neuroticism', dir: 'pos' }, { id: 18, dim: 'extraversion', dir: 'pos' },
    { id: 19, dim: 'openness', dir: 'pos' }, { id: 20, dim: 'agreeableness', dir: 'pos' },
    { id: 21, dim: 'conscientiousness', dir: 'pos' }, { id: 22, dim: 'neuroticism', dir: 'neg' },
    { id: 23, dim: 'extraversion', dir: 'neg' }, { id: 24, dim: 'openness', dir: 'pos' },
    { id: 25, dim: 'agreeableness', dir: 'pos' },
  ];
  const dims = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
  const raw: Record<string, number[]> = {};
  dims.forEach(d => raw[d] = []);
  bfQuestions.forEach(q => {
    const val = answers[q.id];
    if (val === undefined) return;
    const adjusted = q.dir === 'neg' ? 6 - val : val;
    raw[q.dim].push(adjusted);
  });
  const result: Record<string, number> = {};
  dims.forEach(d => {
    const vals = raw[d];
    result[d] = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 20) : 50;
  });
  return result as unknown as BigFiveScores;
}

export function calculateIntegrity(answers: Record<number, number>): IntegrityScore {
  const catQuestions: Record<string, number[]> = { honesty: [], ethics: [], risk: [], compliance: [] };
  const catMap: Record<number, string> = {
    1: 'honesty', 2: 'honesty', 3: 'ethics', 4: 'risk', 5: 'ethics', 6: 'risk', 7: 'honesty',
    8: 'compliance', 9: 'risk', 10: 'honesty', 11: 'ethics', 12: 'compliance', 13: 'risk',
    14: 'ethics', 15: 'honesty', 16: 'compliance', 17: 'ethics', 18: 'ethics', 19: 'risk', 20: 'compliance',
  };
  const positiveMap: Record<number, boolean> = {
    1: true, 2: false, 3: true, 4: false, 5: true, 6: false, 7: false,
    8: true, 9: false, 10: false, 11: false, 12: true, 13: false,
    14: false, 15: false, 16: true, 17: false, 18: true, 19: false, 20: true,
  };
  const alerts: string[] = [];
  Object.entries(answers).forEach(([qId, val]) => {
    const id = parseInt(qId);
    const cat = catMap[id];
    const isPositive = positiveMap[id];
    if (cat) {
      const score = isPositive ? val : (val === 0 ? 4 : val === 1 ? 2 : 0);
      if (!catQuestions[cat]) catQuestions[cat] = [];
      catQuestions[cat].push(score);
    }
  });
  const calc = (vals: number[]) => vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 4)) * 100) : 0;
  const honesty = calc(catQuestions.honesty);
  const ethics = calc(catQuestions.ethics);
  const riskPrevention = calc(catQuestions.risk);
  const compliance = calc(catQuestions.compliance);
  const overall = Math.round((honesty + ethics + riskPrevention + compliance) / 4);
  const level: IntegrityScore['level'] = overall >= 80 ? 'Alto' : overall >= 55 ? 'Moderado' : 'Bajo';
  if (riskPrevention < 50) alerts.push('Alta tolerancia a riesgos operacionales');
  if (honesty < 50) alerts.push('Posibles riesgos de integridad y honestidad');
  if (ethics < 50) alerts.push('Debilidad en principios éticos profesionales');
  if (compliance < 50) alerts.push('Baja adherencia a normas y procedimientos');
  return { honesty, ethics, riskPrevention, compliance, overall, level, alerts };
}

export function calculateHogan(answers: Record<number, number>): HoganScores {
  const dimQuestions: Record<string, number[]> = { leadership: [], prudence: [], resilience: [], sociability: [], learning: [] };
  const dimMap: Record<number, string> = {
    1: 'leadership', 2: 'prudence', 3: 'resilience', 4: 'sociability', 5: 'learning',
    6: 'leadership', 7: 'prudence', 8: 'resilience', 9: 'sociability', 10: 'learning',
    11: 'leadership', 12: 'prudence', 13: 'resilience', 14: 'sociability', 15: 'learning',
    16: 'leadership', 17: 'prudence', 18: 'resilience', 19: 'sociability', 20: 'learning',
  };
  Object.entries(answers).forEach(([qId, val]) => {
    const dim = dimMap[parseInt(qId)];
    if (dim) dimQuestions[dim].push((val / 4) * 100);
  });
  const result: Record<string, number> = {};
  Object.entries(dimQuestions).forEach(([dim, vals]) => {
    result[dim] = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 50;
  });
  return result as unknown as HoganScores;
}

export function calculateFitSocial(answers: Record<number, number>): FitSocialScore {
  const dimQuestions: Record<string, number[]> = { comunidad: [], cultura: [], conflictos: [], sostenibilidad: [] };
  const dimMap: Record<number, string> = {
    1: 'comunidad', 5: 'comunidad', 9: 'comunidad',
    2: 'cultura', 8: 'cultura',
    3: 'conflictos', 7: 'conflictos', 10: 'conflictos',
    4: 'sostenibilidad', 6: 'sostenibilidad'
  };
  const negativeIds = [3, 6, 10];

  Object.entries(answers).forEach(([qId, val]) => {
    const id = parseInt(qId);
    const dim = dimMap[id];
    if (dim) {
      const adjusted = negativeIds.includes(id) ? 4 - val : val;
      dimQuestions[dim].push((adjusted / 4) * 100);
    }
  });

  const result: Record<string, number> = {};
  Object.entries(dimQuestions).forEach(([dim, vals]) => {
    result[dim] = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 50;
  });

  const overall = Math.round((result.comunidad + result.cultura + result.conflictos + result.sostenibilidad) / 4);
  return { ...result, overall } as unknown as FitSocialScore;
}

export function calculateGlobal(disc: DiscScores, wonderlic: WonderlicResult, bigfive: BigFiveScores, integrity: IntegrityScore, hogan: HoganScores, fitSocial: FitSocialScore): GlobalScore {
  const psicologico = Math.round((bigfive.conscientiousness * 0.3 + bigfive.neuroticism * 0.2 + (100 - bigfive.neuroticism) * 0.2 + disc.D * 0.1 + disc.I * 0.1 + disc.S * 0.1 + disc.C * 0.1) / 1.0);
  const cognitivo = wonderlic.percentage;
  const conductual = Math.round((hogan.leadership * 0.25 + hogan.prudence * 0.25 + hogan.resilience * 0.2 + hogan.sociability * 0.15 + hogan.learning * 0.15));
  const seguridad = Math.round((integrity.overall * 0.5 + bigfive.conscientiousness * 0.2 + disc.C * 0.15 + hogan.prudence * 0.15));
  const adaptacionMinera = Math.round((disc.S * 0.2 + bigfive.neuroticism * 0.15 + hogan.resilience * 0.2 + integrity.overall * 0.15 + disc.D * 0.1 + disc.C * 0.1 + bigfive.openness * 0.1));
  const social = fitSocial.overall;
  const overall = Math.round((psicologico * 0.2 + cognitivo * 0.1 + conductual * 0.15 + seguridad * 0.2 + adaptacionMinera * 0.15 + social * 0.2));
  return { psicologico, cognitivo, conductual, seguridad, adaptacionMinera, social, overall };
}

export function calculateProfileMatches(disc: DiscScores, bigfive: BigFiveScores, hogan: HoganScores, integrity: IntegrityScore, cognitivo: number): MiningProfileMatch[] {
  const profileNames: Record<MiningProfileId, string> = {
    geologo: 'Geólogo de Mina', hse: 'Ingeniero HSE', operaciones: 'Supervisor de Operaciones',
    metalurgista: 'Metalurgista / Procesos', mecanico: 'Mecánico de Equipos',
    geomecanico: 'Geomecánico', ambiental: 'Ambiental / RRCC', topografo: 'Topógrafo de Mina',
  };
  const normalize = (v: number, min: number, max: number) => Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));

  return (Object.entries(miningProfileWeights) as [MiningProfileId, typeof miningProfileWeights[typeof miningProfileWeights extends Record<infer K, infer V> ? K : never]][]).map(([id, w]) => {
    let score = 0; let totalWeight = 0;
    const dims: (keyof DiscScores)[] = ['D', 'I', 'S', 'C'];
    dims.forEach(d => { if (w.disc[d] !== undefined) { score += normalize(disc[d], 0, 100) * (w.disc[d] ?? 0); totalWeight += w.disc[d] ?? 0; } });
    const bfDims: (keyof BigFiveScores)[] = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    bfDims.forEach(d => { if (w.bigfive[d] !== undefined) { score += normalize(bigfive[d], 0, 100) * (w.bigfive[d] ?? 0); totalWeight += w.bigfive[d] ?? 0; } });
    const hDims: (keyof HoganScores)[] = ['leadership', 'prudence', 'resilience', 'sociability', 'learning'];
    hDims.forEach(d => { if (w.hogan[d] !== undefined) { score += normalize(hogan[d], 0, 100) * (w.hogan[d] ?? 0); totalWeight += w.hogan[d] ?? 0; } });
    const compatibility = totalWeight > 0 ? Math.min(100, Math.round(score / totalWeight)) : 50;
    const penalty = (integrity.overall < w.minIntegrity ? 15 : 0) + (cognitivo < w.minCognitivo ? 10 : 0);
    return { profileId: id, name: profileNames[id], score: compatibility, compatibility: Math.max(0, compatibility - penalty) };
  }).sort((a, b) => b.compatibility - a.compatibility);
}
