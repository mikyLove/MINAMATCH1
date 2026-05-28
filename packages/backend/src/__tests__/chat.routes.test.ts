import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app';

async function getToken(): Promise<string> {
  const res = await request(app)
    .post('/api/v2/auth/login')
    .send({ email: 'admin@minamatch.pe', password: 'admin123' });
  return res.body.token;
}

describe('V2 Chat Routes', () => {
  describe('POST /api/v2/chat/message', () => {
    it('returns fallback response for a mining question', async () => {
      const token = await getToken();
      const res = await request(app)
        .post('/api/v2/chat/message')
        .set('Authorization', `Bearer ${token}`)
        .send({ message: '¿Qué candidatos hay disponibles?' });
      expect(res.status).toBe(200);
      expect(res.text).toContain('candidatos');
    });

    it('returns 400 for prohibited keywords', async () => {
      const token = await getToken();
      const res = await request(app)
        .post('/api/v2/chat/message')
        .set('Authorization', `Bearer ${token}`)
        .send({ message: 'Este es un hack peligroso' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('no permitidos');
    });

    it('returns 400 for too-short message', async () => {
      const token = await getToken();
      const res = await request(app)
        .post('/api/v2/chat/message')
        .set('Authorization', `Bearer ${token}`)
        .send({ message: 'ab' });
      expect(res.status).toBe(400);
    });

    it('returns 401 without token', async () => {
      const res = await request(app)
        .post('/api/v2/chat/message')
        .send({ message: 'Hola' });
      expect(res.status).toBe(401);
    });

    it('works with guest token', async () => {
      const res = await request(app)
        .post('/api/v2/chat/message')
        .set('Authorization', 'Bearer guest-token')
        .send({ message: '¿Qué candidatos hay?' });
      expect(res.status).toBe(200);
      expect(res.text).toContain('candidatos');
    });
  });

  describe('GET /api/v2/chat/history', () => {
    it('returns message history', async () => {
      const token = await getToken();
      const res = await request(app)
        .get('/api/v2/chat/history')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/v2/chat/history');
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/v2/chat/history', () => {
    it('clears history and confirms', async () => {
      const token = await getToken();
      const res = await request(app)
        .delete('/api/v2/chat/history')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
