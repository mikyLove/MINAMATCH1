import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app';

describe('V2 Auth Routes', () => {
  describe('POST /api/v2/auth/login', () => {
    it('returns 200 with token and user for valid credentials', async () => {
      const res = await request(app)
        .post('/api/v2/auth/login')
        .send({ email: 'admin@minamatch.pe', password: 'admin123' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe('admin@minamatch.pe');
      expect(res.body.user.name).toBe('Admin MinaMatch');
      expect(res.body.user.role).toBe('admin');
    });

    it('returns 401 for invalid password', async () => {
      const res = await request(app)
        .post('/api/v2/auth/login')
        .send({ email: 'admin@minamatch.pe', password: 'wrongpass' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Credenciales inválidas');
    });

    it('returns 401 for nonexistent email', async () => {
      const res = await request(app)
        .post('/api/v2/auth/login')
        .send({ email: 'noexiste@test.com', password: 'admin123' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Credenciales inválidas');
    });

    it('returns 400 for invalid body', async () => {
      const res = await request(app)
        .post('/api/v2/auth/login')
        .send({ email: 'not-an-email', password: '' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v2/auth/me', () => {
    it('returns user profile with valid token', async () => {
      const login = await request(app)
        .post('/api/v2/auth/login')
        .send({ email: 'admin@minamatch.pe', password: 'admin123' });
      const token = login.body.token;

      const res = await request(app)
        .get('/api/v2/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.email).toBe('admin@minamatch.pe');
      expect(res.body.name).toBe('Admin MinaMatch');
      expect(res.body.role).toBe('admin');
    });

    it('returns guest profile for guest-token', async () => {
      const res = await request(app)
        .get('/api/v2/auth/me')
        .set('Authorization', 'Bearer guest-token');
      expect(res.status).toBe(200);
      expect(res.body.role).toBe('guest');
      expect(res.body.name).toBe('Invitado MinaMatch');
    });

    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/v2/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Token requerido');
    });

    it('returns 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/v2/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Token inválido o expirado');
    });
  });
});
