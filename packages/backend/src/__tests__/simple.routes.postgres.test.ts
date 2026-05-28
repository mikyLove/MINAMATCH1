import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import net from 'net';
import { app } from '../app';

let pgAvailable = false;

function checkPgPort(): Promise<boolean> {
  const url = process.env.DATABASE_URL || '';
  const match = url.match(/:(\d+)\//);
  const port = match ? parseInt(match[1]!, 10) : 5432;
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000);
    socket.on('connect', () => { socket.destroy(); resolve(true); });
    socket.on('error', () => { socket.destroy(); resolve(false); });
    socket.on('timeout', () => { socket.destroy(); resolve(false); });
    socket.connect(port, '127.0.0.1');
  });
}

beforeAll(async () => {
  pgAvailable = await checkPgPort();
}, 5000);

function itPg(name: string, fn: () => Promise<void>) {
  it(name, async () => {
    if (!pgAvailable) return;
    await fn();
  });
}

describe('V2 Simple Routes (PostgreSQL)', () => {
  itPg('GET /api/v2/health returns 200 with ok status', async () => {
    const res = await request(app).get('/api/v2/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.version).toBe('v2');
  });

  describe('GET /api/candidates', () => {
    itPg('returns array of 6 candidates with enriched fields', async () => {
      const res = await request(app).get('/api/candidates');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(6);
      const c = res.body[0];
      expect(c).toHaveProperty('id');
      expect(c).toHaveProperty('name');
      expect(c).toHaveProperty('languages');
      expect(Array.isArray(c.languages)).toBe(true);
      expect(c.languages.length).toBeGreaterThan(0);
      expect(c).toHaveProperty('skills');
      expect(Array.isArray(c.skills)).toBe(true);
      expect(c.skills.length).toBeGreaterThan(0);
      expect(c).toHaveProperty('certified');
      expect(typeof c.certified).toBe('boolean');
      expect(c).toHaveProperty('isTop5');
      expect(typeof c.isTop5).toBe('boolean');
      expect(c).toHaveProperty('hasOsha');
      expect(typeof c.hasOsha).toBe('boolean');
      expect(c).toHaveProperty('aiInterviewTranscript');
      expect(Array.isArray(c.aiInterviewTranscript)).toBe(true);
      if (c.aiInterviewTranscript.length > 0) {
        expect(c.aiInterviewTranscript[0]).toHaveProperty('question');
        expect(c.aiInterviewTranscript[0]).toHaveProperty('answer');
      }
      expect(c).toHaveProperty('exp_years');
      expect(c.is_top5).toBeTypeOf('number');
      expect(c.has_osha).toBeTypeOf('number');
    });

    itPg('candidate #1 Marco Quispe has expected values', async () => {
      const res = await request(app).get('/api/candidates');
      const c = res.body.find((x: any) => x.id === '1');
      expect(c).toBeDefined();
      expect(c.name).toBe('Marco Quispe');
      expect(c.title).toBe('Geólogo Senior');
      expect(c.institution).toBe('UNA Puno');
      expect(c.languages).toEqual(['Español', 'Inglés C1', 'Quechua básico']);
      expect(c.skills).toEqual(['Geomecánica', 'Planeamiento', 'Relaciones Comunitarias']);
      expect(c.certified).toBe(true);
      expect(c.isTop5).toBe(true);
      expect(c.hasOsha).toBe(false);
      expect(c.exp_years).toBe(8);
      expect(c.match_rating).toBe(92);
    });
  });

  describe('GET /api/candidates/:id', () => {
    itPg('returns candidate #1 with interviews', async () => {
      const res = await request(app).get('/api/candidates/1');
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Marco Quispe');
      expect(res.body).toHaveProperty('aiInterviewTranscript');
      expect(res.body.aiInterviewTranscript.length).toBeGreaterThan(0);
      expect(res.body.aiInterviewTranscript[0].question).toBeDefined();
    });

    itPg('returns 404 for nonexistent candidate', async () => {
      const res = await request(app).get('/api/candidates/nonexistent');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Candidate not found');
    });
  });

  describe('GET /api/students', () => {
    itPg('returns array of 2 students with syllabus', async () => {
      const res = await request(app).get('/api/students');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      const s = res.body[0];
      expect(s).toHaveProperty('id');
      expect(s).toHaveProperty('name');
      expect(s).toHaveProperty('badge');
      expect(s).toHaveProperty('program');
      expect(s).toHaveProperty('status');
      expect(s).toHaveProperty('syllabus');
      expect(Array.isArray(s.syllabus)).toBe(true);
      expect(s.syllabus.length).toBeGreaterThan(0);
      const syl = s.syllabus[0];
      expect(syl).toHaveProperty('id');
      expect(syl).toHaveProperty('course');
      expect(syl).toHaveProperty('completed');
      expect(typeof syl.completed).toBe('boolean');
    });

    itPg('student-1 Juan Pérez has expected values', async () => {
      const res = await request(app).get('/api/students');
      const s = res.body.find((x: any) => x.id === 'student-1');
      expect(s).toBeDefined();
      expect(s.name).toBe('Juan Pérez');
      expect(s.badge).toBe('Beca Minsur');
      expect(s.status).toBe('FINALIZADO');
      expect(s.matchingScore).toBe(98.4);
      expect(s.syllabus).toHaveLength(4);
      expect(s.syllabus[0].course).toBe('Seguridad Subterránea');
    });
  });

  describe('GET /api/scenarios', () => {
    itPg('returns array of 5 scenarios with nested options and culturalFit', async () => {
      const res = await request(app).get('/api/scenarios');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(5);
      const s = res.body[0];
      expect(s).toHaveProperty('id');
      expect(s).toHaveProperty('stage');
      expect(s).toHaveProperty('stageNum');
      expect(s).toHaveProperty('category');
      expect(s).toHaveProperty('title');
      expect(s).toHaveProperty('description');
      expect(s).toHaveProperty('imageUrl');
      expect(s).toHaveProperty('alertText');
      expect(s).toHaveProperty('options');
      expect(Array.isArray(s.options)).toBe(true);
      expect(s.options).toHaveLength(2);
      const opt = s.options[0];
      expect(opt).toHaveProperty('id');
      expect(opt).toHaveProperty('text');
      expect(opt).toHaveProperty('description');
      expect(opt).toHaveProperty('impact');
      expect(opt.impact).toHaveProperty('calma');
      expect(opt.impact).toHaveProperty('seguridad');
      expect(opt.impact).toHaveProperty('tiempo');
      expect(opt.impact).toHaveProperty('toleranciaFrio');
      expect(opt.impact).toHaveProperty('culturalFit');
      expect(opt.impact.culturalFit).toHaveProperty('seguridad');
      expect(opt.impact.culturalFit).toHaveProperty('etica');
      expect(opt.impact.culturalFit).toHaveProperty('innovacion');
      expect(typeof opt.impact.culturalFit.seguridad).toBe('number');
      expect(typeof opt.impact.culturalFit.etica).toBe('number');
      expect(typeof opt.impact.culturalFit.innovacion).toBe('number');
    });

    itPg('scenario-1 has correct option impacts', async () => {
      const res = await request(app).get('/api/scenarios');
      const s = res.body.find((x: any) => x.id === 'scenario-1');
      expect(s).toBeDefined();
      expect(s.stage).toBe('ETAPA 1/5');
      expect(s.category).toBe('RECONOCIMIENTO');
      const opt1 = s.options.find((x: any) => x.id === 'opt1_1');
      expect(opt1).toBeDefined();
      expect(opt1.text).toContain('Suspender labor');
      expect(opt1.impact.calma).toBe(8.5);
      expect(opt1.impact.seguridad).toBe(10);
      expect(opt1.impact.culturalFit.seguridad).toBe(98);
      expect(opt1.impact.culturalFit.etica).toBe(90);
      expect(opt1.impact.culturalFit.innovacion).toBe(70);
    });
  });
});
