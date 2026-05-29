import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger, setupErrorHandlers } from './logger';

setupErrorHandlers(logger);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '..', '..', 'server', '.env'), override: true });

const { app } = await import('./app');
const PORT = process.env.PORT || process.env.V2_PORT || 3004;

app.listen(PORT, () => {
  const providerKind = process.env.DATABASE_PROVIDER || 'auto';
  const resolvedDb = process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite';

  logger.info({
    port: PORT,
    provider: providerKind,
    resolvedDb,
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
  }, 'MinaMatch V2 API started');

  logger.info('Endpoints:');
  logger.info('  GET /api/candidates');
  logger.info('  GET /api/candidates/:id');
  logger.info('  GET /api/students');
  logger.info('  GET /api/scenarios');
  logger.info('  GET /api/v2/health');
  logger.info('  GET /api/v2/ready');
  logger.info('  POST /api/v2/auth/login');
  logger.info('  GET /api/v2/auth/me');
  logger.info('  POST /api/v2/auth/register');
  logger.info('  POST /api/v2/chat/message');
  logger.info('  GET /api/v2/chat/history');
  logger.info('  DELETE /api/v2/chat/history');
  logger.info('  POST /api/v2/agents/interview');
  logger.info('  POST /api/v2/agents/evaluate-scenario');
  logger.info('  POST /api/v2/agents/matching');
});
