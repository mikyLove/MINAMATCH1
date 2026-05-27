import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getDb } from './db';
import { errorHandler } from './errorHandler';
import { isAiAvailable } from './services/gemini';
import { getJwtSecret } from './authMiddleware';
import authRoutes from './routes/auth';
import agentRoutes from './routes/agents';
import chatRoutes from './routes/chat';
import candidatesRoutes from './routes/candidates';
import studentsRoutes from './routes/students';
import scenariosRoutes from './routes/scenarios';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(helmet());
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10kb' }));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Demasiados intentos. Intenta de nuevo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Demasiados mensajes. Intenta de nuevo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

getDb();

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/chat', chatLimiter, chatRoutes);
app.use('/api/candidates', candidatesRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/scenarios', scenariosRoutes);

app.get('/api/health', (_req, res) => {
  try {
    getDb().prepare('SELECT 1').get();
  } catch {
    return res.status(500).json({ status: 'error', error: 'Database connection failed' });
  }

  let appVersion = '0.0.0';
  try {
    const pkgPath = path.join(__dirname, '..', 'package.json');
    appVersion = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')).version || appVersion;
  } catch {
    // version no crítica
  }

  const mem = process.memoryUsage();

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    version: appVersion,
    services: {
      database: 'ok',
      gemini: isAiAvailable ? 'ok' : 'disabled',
    },
    memory: {
      rssMb: Math.round(mem.rss / 1024 / 1024),
      heapMb: Math.round(mem.heapUsed / 1024 / 1024),
    },
  });
});

app.get('/api/ready', (_req, res) => {
  const checks: { service: string; ok: boolean }[] = [];

  try {
    getDb().prepare('SELECT 1').get();
    checks.push({ service: 'database', ok: true });
  } catch {
    checks.push({ service: 'database', ok: false });
  }

  try {
    getJwtSecret();
    checks.push({ service: 'auth', ok: true });
  } catch {
    checks.push({ service: 'auth', ok: false });
  }

  const allCritical = checks.every(c => c.ok);
  if (!allCritical) {
    const failed = checks.filter(c => !c.ok).map(c => c.service);
    return res.status(503).json({
      ready: false,
      error: `Servicios no disponibles: ${failed.join(', ')}`,
    });
  }

  res.json({
    ready: true,
    services: {
      database: 'ok',
      auth: 'ok',
      gemini: isAiAvailable ? 'ok' : 'disabled',
    },
  });
});

app.use((req, _res, next) => {
  if (req.path.startsWith('/api')) {
    return _res.status(404).json({ error: 'Endpoint no encontrado' });
  }
  next();
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`MinaMatch API running on http://localhost:${PORT}`);
  console.log(`Database: SQLite`);
});
