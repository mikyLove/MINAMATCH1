import { Router } from 'express';
import { getProvider } from '@minamatch/database';
import { isAiAvailable } from '../../services/gemini';

const router = Router();

const startTime = Date.now();
const APP_VERSION = 'v2';

function getUptime(): number {
  return Math.floor((Date.now() - startTime) / 1000);
}

function getMemoryUsage() {
  const mem = process.memoryUsage();
  return {
    rss: Math.round(mem.rss / 1024 / 1024 * 100) / 100,
    heapTotal: Math.round(mem.heapTotal / 1024 / 1024 * 100) / 100,
    heapUsed: Math.round(mem.heapUsed / 1024 / 1024 * 100) / 100,
  };
}

async function resolveProvider() {
  let providerKind = 'unknown';
  try {
    const provider = await getProvider();
    providerKind = provider.kind;
  } catch {
    providerKind = 'unknown';
  }
  return providerKind;
}

async function probeDatabase(): Promise<{ provider: string; dbStatus: 'connected' | 'disconnected' | 'error' }> {
  try {
    const provider = await getProvider();
    const rows = await provider.candidates.findAll();
    if (!Array.isArray(rows)) {
      return { provider: provider.kind, dbStatus: 'error' };
    }
    return { provider: provider.kind, dbStatus: 'connected' };
  } catch {
    const kind = await resolveProvider();
    return { provider: kind, dbStatus: 'disconnected' };
  }
}

function buildPayload(overrides: Record<string, unknown> = {}) {
  return {
    status: 'ok',
    version: APP_VERSION,
    gemini: isAiAvailable ? 'ok' : 'disabled',
    uptime: getUptime(),
    environment: process.env.NODE_ENV || 'development',
    logging: true,
    pid: process.pid,
    memory: getMemoryUsage(),
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

router.get('/health', async (_req, res) => {
  const db = await probeDatabase();
  res.json(buildPayload({
    provider: db.provider,
    dbStatus: db.dbStatus,
  }));
});

router.get('/ready', async (_req, res) => {
  try {
    const db = await probeDatabase();
    if (db.dbStatus !== 'connected') {
      throw new Error(`Database ${db.provider} is not connected`);
    }
    res.json(buildPayload({
      provider: db.provider,
      dbStatus: db.dbStatus,
    }));
  } catch {
    const provider = await resolveProvider();
    res.status(503).json({
      status: 'error',
      version: APP_VERSION,
      provider,
      dbStatus: 'disconnected',
      gemini: isAiAvailable ? 'ok' : 'disabled',
      uptime: getUptime(),
      environment: process.env.NODE_ENV || 'development',
      logging: true,
      pid: process.pid,
      error: 'Database not ready',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
