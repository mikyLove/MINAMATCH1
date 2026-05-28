import { Router, Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { AI_CONFIG } from '@minamatch/shared';
import { candidatesRepo, getDb, scenarios, scenarioOptions } from '@minamatch/database';
import { authMiddleware } from '../../middleware/auth.middleware';
import { evaluationModel } from '../../services/gemini';

const router: Router = Router();

router.use(authMiddleware);

// POST /api/v2/agents/interview — evaluar respuesta de entrevista
router.post('/interview', async (req: Request, res: Response) => {
  try {
    const { candidateId, question, answer } = req.body;
    if (!candidateId || !question || !answer) {
      return res.status(400).json({ error: 'candidateId, question and answer are required' });
    }

    const cleanQuestion = question.trim();
    const cleanAnswer = answer.trim();

    if (cleanQuestion.length < AI_CONFIG.MIN_LENGTH || cleanAnswer.length < AI_CONFIG.MIN_LENGTH) {
      return res.status(400).json({ error: 'La pregunta o la respuesta son demasiado cortas.' });
    }

    if (cleanQuestion.length > AI_CONFIG.MAX_LENGTH || cleanAnswer.length > AI_CONFIG.MAX_LENGTH) {
      return res.status(400).json({ error: 'El contenido excede el límite permitido de caracteres.' });
    }

    const candidate = await candidatesRepo.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    let evaluation: string;

    if (evaluationModel) {
      const prompt = `Actúa como un reclutador técnico senior especializado en minería subterránea en los Andes peruanos.
Evalúa de forma crítica y objetiva la siguiente respuesta.
Criterios de evaluación:
- Conocimiento de seguridad (D.S. 024-2016-EM).
- Experiencia técnica real demostrada.
- Adaptabilidad cultural y física (Puno).
Formatéalo de forma profesional con viñetas.

### EJEMPLOS DE REFERENCIA PARA CALIFICACIÓN:

Ejemplo 1 (Puntuación 95 - EXCELENTE):
Pregunta: "¿Cómo procedería ante una alerta de vibración?"
Respuesta: "Priorizo la evacuación inmediata hacia zonas seguras según el plan de contingencia. Notifico a geomecánica para evaluación estructural y no autorizo el reingreso hasta tener el informe técnico de seguridad."
Justificación: Prioridad absoluta en vida humana y cumplimiento estricto de protocolos.

Ejemplo 2 (Puntuación 30 - DEFICIENTE):
Pregunta: "¿Cómo procedería ante una alerta de vibración?"
Respuesta: "Terminaría de cargar el mineral para no afectar el ciclo del turno y luego saldría a ver si es algo grave, probablemente sea una voladura cercana."
Justificación: Pone la producción por encima de la vida y asume riesgos sin base técnica.

Candidato: ${candidate.name}
Cargo: ${candidate.title}
Experiencia: ${candidate.expYears} años
Habilidades: ${candidate.skills}
Altitud Apta: ${candidate.altitudeFit} msnm
Aptitud Social: ${candidate.socialFit}/100

Pregunta: ${cleanQuestion}
Respuesta: ${cleanAnswer}

Proporciona:
1. Evaluación de la respuesta (0-100)
2. Fortalezas demostradas
3. Áreas de mejora
4. Recomendación para contratación`;

      const result = await evaluationModel.generateContent(prompt);
      evaluation = result.text || 'No se pudo generar evaluación.';
    } else {
      const skills = typeof candidate.skills === 'string' ? candidate.skills : JSON.stringify(candidate.skills);
      evaluation = `Evaluación simulada para ${candidate.name}:\n\n` +
        `Puntuación: 85/100\n` +
        `Fortalezas: Experiencia comprobada en ${skills}, excelente adaptación a altitud.\n` +
        `Recomendación: Perfil apto para operaciones mineras en Puno.`;
    }

    res.json({ evaluation, candidate: { id: candidate.id, name: candidate.name, title: candidate.title } });
  } catch (error) {
    console.error('[V2] Interview agent error:', error);
    res.status(500).json({ error: 'Error evaluating interview' });
  }
});

// POST /api/v2/agents/evaluate-scenario — evaluar decisión en escenario
router.post('/evaluate-scenario', async (req: Request, res: Response) => {
  try {
    const { scenarioId, optionId } = req.body;
    if (!scenarioId || !optionId) {
      return res.status(400).json({ error: 'scenarioId and optionId are required' });
    }

    const db = getDb();
    const [scenarioRow] = await db.select().from(scenarios).where(eq(scenarios.id, scenarioId)).limit(1);
    const [optionRow] = await db.select().from(scenarioOptions).where(eq(scenarioOptions.id, optionId)).limit(1);

    if (!scenarioRow || !optionRow) {
      return res.status(404).json({ error: 'Scenario or option not found' });
    }

    let feedback: string;

    if (evaluationModel) {
      const prompt = `Evalúa la decisión del operador minero en este escenario de seguridad:

Escenario: ${scenarioRow.title}
Categoría: ${scenarioRow.category}
Descripción: ${scenarioRow.description}

Decisión tomada: ${optionRow.text}
Impacto - Calma: ${optionRow.calma}/10, Seguridad: ${optionRow.seguridad}/10, Tiempo: ${optionRow.tiempo}

### MARCO DE REFERENCIA:
- Una decisión de 10/10 en seguridad SIEMPRE prioriza la paralización de la labor ante riesgos no controlados (gases, desprendimientos).
- Una decisión aceptable (7-8/10) busca mitigar el riesgo con ingeniería (ventilación auxiliar, bombas) sin exponer al personal.
- Una decisión deficiente (<5/10) es aquella que "normaliza" el riesgo o improvisa soluciones no estandarizadas.

### EJEMPLO DE FEEDBACK ESPERADO:
"La decisión de evacuar es técnicamente correcta según el estándar de seguridad minera, aunque el tiempo de respuesta de 42 min podría optimizarse mediante el uso de refugios mineros más cercanos..."

---

Proporciona feedback técnico sobre esta decisión en el contexto de minería subterránea peruana.`;

      const result = await evaluationModel.generateContent(prompt);
      feedback = result.text || 'No se pudo generar feedback.';
    } else {
      const seguridad = optionRow.seguridad ?? 5;
      const safetyLevel = seguridad >= 8 ? 'Alta' : seguridad >= 5 ? 'Media' : 'Baja';
      feedback = `Decisión evaluada: "${optionRow.text}"\n\n` +
        `Nivel de Seguridad: ${safetyLevel} (${seguridad}/10)\n` +
        `Impacto en Calma: ${optionRow.calma}/10\n` +
        `Tiempo de Respuesta: ${optionRow.tiempo}\n\n` +
        `${seguridad >= 8 ? 'Excelente decisión priorizando la seguridad del personal.' : seguridad >= 5 ? 'Decisión aceptable pero con oportunidades de mejora en protocolos de seguridad.' : 'Esta decisión implica riesgos significativos. Revisar protocolos de seguridad minera.'}`;
    }

    res.json({ feedback, scenario: { id: scenarioRow.id, title: scenarioRow.title }, option: { id: optionRow.id, text: optionRow.text } });
  } catch (error) {
    console.error('[V2] Scenario agent error:', error);
    res.status(500).json({ error: 'Error evaluating scenario' });
  }
});

// POST /api/v2/agents/matching — análisis de matching de talento
router.post('/matching', async (req: Request, res: Response) => {
  try {
    const { requirements } = req.body;
    if (!requirements) {
      return res.status(400).json({ error: 'requirements are required' });
    }

    const reqString = typeof requirements === 'string' ? requirements : JSON.stringify(requirements);
    if (reqString.length > AI_CONFIG.MAX_LENGTH) {
      return res.status(400).json({ error: 'Los requerimientos exceden el límite permitido de caracteres.' });
    }

    const allCandidates = await candidatesRepo.findAll();

    let analysis: string;

    if (evaluationModel) {
      const prompt = `Como agente de matching minero, analiza estos candidatos contra los requerimientos:

Requerimientos: ${JSON.stringify(requirements)}

### CRITERIO DE MATCHING (EJEMPLOS):
1. MATCH IDEAL: Ingeniero con +5 años en Puno, aptitud física verificada a +4500 msnm y habilidades técnicas exactas (ej. Ventsim para ventilación).
2. MATCH PARCIAL: Profesional con gran capacidad técnica pero sin experiencia en altura o sin validación de adaptación barométrica.
3. NO APTO: Candidatos que omiten certificaciones de seguridad críticas (OSHA) o con bajo puntaje en Aptitud Social (riesgo de conflicto comunitario).

Candidatos disponibles:
${allCandidates.map((c: any) => `- ${c.name}: ${c.title}, ${c.expYears} exp, match: ${c.matchRating}%, altitud: ${c.altitudeFit}msnm, social_fit: ${c.socialFit}%`).join('\n')}

Proporciona:
1. Top 3 candidatos recomendados
2. Justificación técnica de cada recomendación
3. Candidatos no recomendados y por qué`;

      const result = await evaluationModel.generateContent(prompt);
      analysis = result.text || 'No se pudo generar análisis.';
    } else {
      const sorted = [...allCandidates].sort((a, b) => (b.matchRating ?? 0) - (a.matchRating ?? 0));
      const top3 = sorted.slice(0, 3);
      analysis = `Análisis de Matching - ${allCandidates.length} candidatos evaluados\n\n` +
        `Top 3 Recomendados:\n` +
        top3.map((c, i) => `${i + 1}. ${c.name} - ${c.title} (${c.matchRating}% match)\n   Skills: ${c.skills}, Altitud: ${c.altitudeFit}msnm`).join('\n\n') +
        `\n\nBasado en experiencia técnica, certificaciones y adaptación a altitud.`;
    }

    res.json({ analysis, totalCandidates: allCandidates.length });
  } catch (error) {
    console.error('[V2] Matching agent error:', error);
    res.status(500).json({ error: 'Error in matching analysis' });
  }
});

export default router;
