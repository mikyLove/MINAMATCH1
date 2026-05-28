import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app';

describe('V2 Simple Routes', () => {
  describe('GET /api/v2/health', () => {
    it('returns 200 with ok status', async () => {
      const res = await request(app).get('/api/v2/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.version).toBe('v2');
    });
  });

  describe('GET /api/candidates', () => {
    it('returns array of candidates with enriched fields', async () => {
      const res = await request(app).get('/api/candidates');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      const c = res.body[0];
      expect(c).toHaveProperty('id');
      expect(c).toHaveProperty('name');
      expect(c).toHaveProperty('languages');
      expect(Array.isArray(c.languages)).toBe(true);
      expect(c).toHaveProperty('skills');
      expect(Array.isArray(c.skills)).toBe(true);
      expect(c).toHaveProperty('aiInterviewTranscript');
      expect(Array.isArray(c.aiInterviewTranscript)).toBe(true);
      expect(c).toHaveProperty('exp_years');
      expect(c).toHaveProperty('is_top5');
    });
  });

  describe('GET /api/candidates/:id', () => {
    it('returns a single candidate with interviews', async () => {
      const res = await request(app).get('/api/candidates/1');
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Marco Quispe');
      expect(res.body).toHaveProperty('aiInterviewTranscript');
    });

    it('returns 404 for nonexistent candidate', async () => {
      const res = await request(app).get('/api/candidates/nonexistent');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Candidate not found');
    });
  });

  describe('GET /api/students', () => {
    it('returns array of students with syllabus', async () => {
      const res = await request(app).get('/api/students');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      const s = res.body[0];
      expect(s).toHaveProperty('id');
      expect(s).toHaveProperty('name');
      expect(s).toHaveProperty('syllabus');
      expect(Array.isArray(s.syllabus)).toBe(true);
    });
  });

  describe('GET /api/scenarios', () => {
    it('returns array of scenarios with options and culturalFit', async () => {
      const res = await request(app).get('/api/scenarios');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      const s = res.body[0];
      expect(s).toHaveProperty('id');
      expect(s).toHaveProperty('stage');
      expect(s).toHaveProperty('category');
      expect(s).toHaveProperty('title');
      expect(s).toHaveProperty('options');
      expect(Array.isArray(s.options)).toBe(true);
      expect(s.options.length).toBeGreaterThan(0);
      const opt = s.options[0];
      expect(opt).toHaveProperty('id');
      expect(opt).toHaveProperty('text');
      expect(opt).toHaveProperty('impact');
      expect(opt.impact).toHaveProperty('culturalFit');
      expect(opt.impact.culturalFit).toHaveProperty('seguridad');
      expect(opt.impact.culturalFit).toHaveProperty('etica');
      expect(opt.impact.culturalFit).toHaveProperty('innovacion');
    });
  });
});
