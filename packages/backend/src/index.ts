import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import simpleRoutes from './routes/v2/simple.routes';
import authRoutes from './routes/v2/auth.routes';
import chatRoutes from './routes/v2/chat.routes';
import agentsRoutes from './routes/v2/agents.routes';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '..', '..', 'server', '.env'), override: true });

const app = express();
const PORT = process.env.V2_PORT || 3004;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10kb' }));

// Rutas V2 con repositorios tipados (PostgreSQL o SQLite según DATABASE_PROVIDER)
app.use('/api', simpleRoutes);
app.use('/api/v2/auth', authRoutes);
app.use('/api/v2/chat', chatRoutes);
app.use('/api/v2/agents', agentsRoutes);

// Health check V2
app.get('/api/v2/health', (_req, res) => {
  res.json({ status: 'ok', version: 'v2', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[V2] MinaMatch API running on http://localhost:${PORT}`);
  console.log(`[V2] Database Provider: ${process.env.DATABASE_PROVIDER || 'auto'} (${process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite'} — cambia con DATABASE_PROVIDER)`);
  console.log(`[V2] Endpoints:`);
  console.log(`  GET /api/candidates`);
  console.log(`  GET /api/candidates/:id`);
  console.log(`  GET /api/students`);
  console.log(`  GET /api/scenarios`);
  console.log(`  POST /api/v2/auth/login`);
  console.log(`  GET /api/v2/auth/me`);
  console.log(`  POST /api/v2/chat/message`);
  console.log(`  GET /api/v2/chat/history`);
  console.log(`  DELETE /api/v2/chat/history`);
  console.log(`  POST /api/v2/agents/interview`);
  console.log(`  POST /api/v2/agents/evaluate-scenario`);
  console.log(`  POST /api/v2/agents/matching`);
});
