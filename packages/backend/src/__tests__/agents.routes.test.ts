import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app';

async function getToken(): Promise<string> {
  const res = await request(app)
    .post('/api/v2/auth/login')
    .send({ email: 'admin@minamatch.pe', password: 'admin123' });
  return res.body.token;
}

describe('V2 Agents Routes', () => {
  describe('POST /api/v2/agents/interview', () => {
    it('returns evaluation for valid candidate and QA', async () => {
      const token = await getToken();
      const res = await request(app)
        .post('/api/v2/agents/interview')
        .set('Authorization', `Bearer ${token}`)
        .send({
          candidateId: '1',
          question: '¿Cómo procedería ante una alerta de vibración?',
          answer: 'Priorizo la evacuación inmediata hacia zonas seguras.',
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('evaluation');
      expect(res.body).toHaveProperty('candidate');
      expect(res.body.candidate.id).toBe('1');
      expect(res.body.candidate.name).toBe('Marco Quispe');
      expect(res.body.evaluation).toContain('Puntuación');
    });

    it('returns 404 for nonexistent candidate', async () => {
      const token = await getToken();
      const res = await request(app)
        .post('/api/v2/agents/interview')
        .set('Authorization', `Bearer ${token}`)
        .send({
          candidateId: 'nonexistent',
          question: '¿Test?',
          answer: 'Test answer.',
        });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Candidate not found');
    });

    it('returns 400 for missing fields', async () => {
      const token = await getToken();
      const res = await request(app)
        .post('/api/v2/agents/interview')
        .set('Authorization', `Bearer ${token}`)
        .send({ candidateId: '1' });
      expect(res.status).toBe(400);
    });

    it('returns 401 without token', async () => {
      const res = await request(app)
        .post('/api/v2/agents/interview')
        .send({ candidateId: '1', question: 'Q?', answer: 'A.' });
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v2/agents/evaluate-scenario', () => {
    it('returns feedback for valid scenario and option', async () => {
      const token = await getToken();
      const res = await request(app)
        .post('/api/v2/agents/evaluate-scenario')
        .set('Authorization', `Bearer ${token}`)
        .send({ scenarioId: 'scenario-1', optionId: 'opt1_1' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('feedback');
      expect(res.body).toHaveProperty('scenario');
      expect(res.body.scenario.id).toBe('scenario-1');
      expect(res.body.feedback).toContain('Decisión');
    });

    it('returns 404 for nonexistent scenario', async () => {
      const token = await getToken();
      const res = await request(app)
        .post('/api/v2/agents/evaluate-scenario')
        .set('Authorization', `Bearer ${token}`)
        .send({ scenarioId: 'nonexistent', optionId: 'opt1_1' });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Scenario not found');
    });

    it('returns 404 for nonexistent option', async () => {
      const token = await getToken();
      const res = await request(app)
        .post('/api/v2/agents/evaluate-scenario')
        .set('Authorization', `Bearer ${token}`)
        .send({ scenarioId: 'scenario-1', optionId: 'nonexistent' });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Option not found');
    });
  });

  describe('POST /api/v2/agents/matching', () => {
    it('returns analysis with 6 candidates', async () => {
      const token = await getToken();
      const res = await request(app)
        .post('/api/v2/agents/matching')
        .set('Authorization', `Bearer ${token}`)
        .send({ requirements: 'buscar geólogo senior' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('analysis');
      expect(res.body).toHaveProperty('totalCandidates');
      expect(res.body.totalCandidates).toBe(6);
    });

    it('returns 400 for missing requirements', async () => {
      const token = await getToken();
      const res = await request(app)
        .post('/api/v2/agents/matching')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('requirements are required');
    });
  });
});
