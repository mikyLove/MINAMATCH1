import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '..', '..', 'server', '.env'), override: true });

const { app } = await import('./app');
const PORT = process.env.V2_PORT || 3004;

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
