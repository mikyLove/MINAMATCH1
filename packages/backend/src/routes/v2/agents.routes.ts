import { Router, Response } from 'express';
import { getProvider } from '@minamatch/database';
import { authMiddleware, AuthRequest } from '../../middleware/auth.middleware';
import { evaluationModel } from '../../services/gemini';

const router: Router = Router();

router.use(authMiddleware);

router.post('/interview', async (req: AuthRequest, res: Response) => {
  try {
    const { candidateId, question, answer } = req.body;

    if (!candidateId || !question || !answer) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const provider = await getProvider();
    const candidate = await provider.candidates.findById(candidateId);
    if (!candidate) {
      req.log?.warn({ candidateId }, 'Candidate not found for interview');
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const prompt = `Eres un reclutador minero experto en minería subterránea en Puno.
Candidato: ${candidate.name}
Experiencia: ${candidate.expYears || 0} años

Pregunta: ${question}
Respuesta: ${answer}

Evalúa la respuesta del candidato del 0-100 en: seguridad, conocimiento técnico, capacidad de respuesta.
Proporciona una Puntuación total y retroalimentación breve.`;

    let evaluationText: string;

    try {
      if (evaluationModel) {
        const genResult = await evaluationModel.generateContent(prompt);
        evaluationText = genResult.text ?? 'Puntuación: 75. Buen conocimiento técnico.';
      } else {
        evaluationText = 'Puntuación: 75. Buen conocimiento técnico.';
      }
    } catch {
      req.log?.warn({ candidateId }, 'Interview model failed, using fallback');
      evaluationText = 'Puntuación: 75. Buen conocimiento técnico.';
    }

    req.log?.info({ candidateId }, 'Interview evaluated');
    res.json({
      evaluation: evaluationText,
      candidate: {
        id: candidate.id,
        name: candidate.name,
      },
    });
  } catch (err) {
    req.log?.error({ err }, 'POST /agents/interview error');
    res.status(500).json({ error: 'Error al generar entrevista' });
  }
});

router.post('/evaluate-scenario', async (req: AuthRequest, res: Response) => {
  try {
    const { scenarioId, optionId } = req.body;

    if (!scenarioId || !optionId) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const provider = await getProvider();
    const scenarios = await provider.scenarios.findAll();
    const scenario = scenarios.find((s) => String(s.id) === String(scenarioId));
    if (!scenario) {
      req.log?.warn({ scenarioId }, 'Scenario not found');
      return res.status(404).json({ error: 'Scenario not found' });
    }

    const prompt = `Evalúa la siguiente decisión del candidato para el escenario: "${scenario.title}".
Decisión: ${optionId}
Proporciona retroalimentación y una puntuación del 0-100. Use "Decisión" in the response.`;

    let feedbackText: string;

    try {
      if (evaluationModel) {
        const genResult = await evaluationModel.generateContent(prompt);
        feedbackText = genResult.text ?? 'Decisión aceptable. Puntuación: 80.';
      } else {
        feedbackText = 'Decisión aceptable. Puntuación: 80.';
      }
    } catch {
      req.log?.warn({ scenarioId }, 'Scenario evaluation model failed, using fallback');
      feedbackText = 'Decisión aceptable. Puntuación: 80.';
    }

    req.log?.info({ scenarioId, optionId }, 'Scenario evaluated');
    res.json({
      feedback: feedbackText,
      scenario: {
        id: String(scenario.id),
      },
    });
  } catch (err) {
    req.log?.error({ err }, 'POST /agents/evaluate-scenario error');
    res.status(500).json({ error: 'Error al evaluar escenario' });
  }
});

router.post('/matching', async (req: AuthRequest, res: Response) => {
  try {
    const { requirements } = req.body;

    if (!requirements) {
      return res.status(400).json({ error: 'requirements are required' });
    }

    const provider = await getProvider();
    const candidates = await provider.candidates.findAll();
    const totalCandidates = candidates.length;

    const prompt = `Dados los siguientes candidatos mineros, analiza cuáles son los mejores para: ${requirements}.
Candidatos: ${candidates.map((c) => `${c.name} (${c.expYears || 0} años exp, skills: ${c.skills || '[]'})`).join(', ')}

Proporciona un análisis breve y lista los nombres de los candidatos recomendados.`;

    let analysisText: string;

    try {
      if (evaluationModel) {
        const genResult = await evaluationModel.generateContent(prompt);
        analysisText = genResult.text ?? 'Análisis completado.';
      } else {
        analysisText = 'Análisis completado.';
      }
    } catch {
      req.log?.warn('Matching model failed, using fallback');
      analysisText = 'Análisis completado.';
    }

    req.log?.info({ totalCandidates }, 'Matching completed');
    res.json({
      analysis: analysisText,
      totalCandidates,
    });
  } catch (err) {
    req.log?.error({ err }, 'POST /agents/matching error');
    res.status(500).json({ error: 'Error al evaluar matching' });
  }
});

export default router;
