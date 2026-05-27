import { Router, Response } from 'express';
import { getDb } from '../db';
import { authMiddleware } from '../authMiddleware';
import { AuthRequest } from '../authMiddleware';
import { createChatModel } from '../services/gemini';
import { chatMessageSchema } from '../validators';

const router = Router();

router.use(authMiddleware);

const PROHIBITED_KEYWORDS = ['script', 'hack', 'ofensivo', 'insulto', 'ataque', 'spam'];

const SYSTEM_PROMPT = `Eres un asistente experto en minería peruana para la plataforma MinaMatch Puno. 
Ayudas con:
- Evaluación de candidatos mineros
- Escenarios de seguridad subterránea
- Semilleros y becas mineras
- Matching de talento para alta montaña (+4500 msnm)
- Relaciones comunitarias y Licencia Social (Aptitud Social)
- Geomecánica, ventilación, HSE, operaciones mineras

Sé conciso, técnico y profesional. Responde en español.
Si no tienes la información específica, usa tu conocimiento general sobre minería peruana.`;

const model = createChatModel(SYSTEM_PROMPT);

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const parsed = chatMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues?.[0]?.message || 'Mensaje inválido' });
    }

    const cleanMessage = parsed.data.message.trim();
    const userId = req.user?.id;

    if (PROHIBITED_KEYWORDS.some(keyword => cleanMessage.toLowerCase().includes(keyword.toLowerCase()))) {
      return res.status(400).json({ error: 'El mensaje contiene términos no permitidos por la política de seguridad.' });
    }

    const db = getDb();

    // Chat Temporal: Borrar mensajes del usuario con antigüedad mayor a 10 minutos
    // Esto garantiza que el historial no sature la base de datos y sea volátil
    db.prepare("DELETE FROM chat_messages WHERE user_id = ? AND created_at < datetime('now', '-10 minutes')").run(userId);

    // Recuperamos el historial del usuario para dar contexto a la IA
    const dbHistory = db.prepare('SELECT role, content FROM chat_messages WHERE user_id = ? ORDER BY id ASC').all(userId) as { role: string; content: string }[];

    // Guardamos el mensaje del usuario
    db.prepare('INSERT INTO chat_messages (user_id, role, content) VALUES (?, ?, ?)').run(userId, 'user', cleanMessage);

    let aiResponse: string;
    let source: 'model' | 'fallback' = 'fallback';

    if (model) {
      const chatSession = model.startChat({
        history: dbHistory.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
      });

      const result = await chatSession.sendMessageStream(cleanMessage);
      aiResponse = '';

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        aiResponse += chunkText;
        res.write(chunkText);
      }
      source = 'model';
      if (!aiResponse) aiResponse = 'Lo siento, no pude generar una respuesta.';
    } else {
      aiResponse = getFallbackResponse(cleanMessage);
      source = 'fallback';
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.write(aiResponse);
    }

    // Guardamos la respuesta de la IA vinculada al usuario
    db.prepare('INSERT INTO chat_messages (user_id, role, content, response_source) VALUES (?, ?, ?, ?)').run(userId, 'assistant', aiResponse, source);
    res.end();
  } catch (error) {
    console.error('Chat error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error processing chat message' });
    } else {
      res.end();
    }
  }
});

router.get('/history', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user?.id;
  const history = db.prepare('SELECT role, content, created_at FROM chat_messages WHERE user_id = ? ORDER BY id ASC').all(userId);
  res.json(history);
});

router.delete('/history', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user?.id;
  db.prepare('DELETE FROM chat_messages WHERE user_id = ?').run(userId);
  db.prepare(`INSERT INTO chat_messages (user_id, role, content) VALUES (?, 'assistant', ?)`).run(userId, 'Historial eliminado. ¿En qué puedo ayudarte?');
  res.json({ success: true });
});

function getFallbackResponse(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes('candidato') || msg.includes('talento') || msg.includes('buscar')) {
    return 'Puedo ayudarte a buscar candidatos mineros. Filtros disponibles:\n- Top 5% promoción\n- UNA Puno verificados\n- Idiomas (Quechua/Inglés)\n- Altitud (msnm)\n- Aptitud Social (Licencia Social)\nUsa el Buscador de Talentos en la sección correspondiente.';
  }
  if (msg.includes('social') || msg.includes('comunidad') || msg.includes('licencia')) {
    return 'El módulo de Aptitud Social evalúa 4 dimensiones críticas para Puno: Relación con la Comunidad, Conciencia Cultural (Quechua/Aimara), Gestión de Conflictos y Sostenibilidad. Un puntaje >70% asegura una mejor integración con el entorno social de la unidad minera.';
  }
  if (msg.includes('escenario') || msg.includes('seguridad') || msg.includes('evaluación') || msg.includes('vocacional')) {
    return 'La Prueba Vocacional MinaTalent evalúa tu respuesta a escenarios críticos de minería subterránea. Cada decisión impacta en: Calma, Seguridad, Tiempo y Adaptabilidad térmica. ¡Completa los 5 escenarios para obtener tu perfil!';
  }
  if (msg.includes('semillero') || msg.includes('estudiante') || msg.includes('beca') || msg.includes('syllabus')) {
    return 'El programa Semilleros Puno v4.2 ofrece becas Minsur con 4 cursos de especialización: Seguridad Subterránea, Gestión Ambiental, Operaciones de Tajo Abierto y Ética. Al completar el syllabus, se habilita el contrato digital en blockchain.';
  }
  if (msg.includes('match') || msg.includes('altura') || msg.includes('altitud') || msg.includes('msnm')) {
    return 'El sistema de Matching evalúa la aptitud del candidato para trabajar a gran altitud. El filtro ajustable de 3500 a 5000 msnm permite encontrar personal certificado en cámara de hipoxia. Contamos con 6 candidatos evaluados actualmente.';
  }
  if (msg.includes('geomecánica') || msg.includes('ventilación') || msg.includes('hse') || msg.includes('seguridad minera')) {
    return 'MinaMatch tiene especialistas en:\n- Geomecánica: Modelamiento estructural, estabilidad de taludes\n- Ventilación: Diseño de redes, Ventsim, balance térmico\n- HSE: OSHA, rescate minero, control de pérdidas\n- Operaciones: Planeamiento, costos, LHD';
  }

  return 'Soy el asistente IA de MinaMatch Puno. Puedo ayudarte con:\n\n🔍 Búsqueda de talento minero\n🏔️ Evaluación vocacional de escenarios\n📚 Seguimiento de semilleros y becas\n📊 Matching por altitud\n\n¿Sobre qué tema te gustaría consultar?';
}

export default router;
