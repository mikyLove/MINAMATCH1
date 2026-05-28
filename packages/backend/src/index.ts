import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import simpleRoutes from './routes/v2/simple.routes';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });

const app = express();
const PORT = process.env.V2_PORT || 3004;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10kb' }));

// Montar rutas V2 con repositorios tipados
app.use('/api', simpleRoutes);

// Health check V2
app.get('/api/v2/health', (_req, res) => {
  res.json({ status: 'ok', version: 'v2', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[V2] MinaMatch API running on http://localhost:${PORT}`);
  console.log(`[V2] Database: PostgreSQL (Drizzle ORM)`);
  console.log(`[V2] Endpoints:`);
  console.log(`  GET /api/candidates`);
  console.log(`  GET /api/candidates/:id`);
  console.log(`  GET /api/students`);
  console.log(`  GET /api/scenarios`);
});
