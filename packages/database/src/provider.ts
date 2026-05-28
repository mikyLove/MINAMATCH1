import type { DatabaseProvider, DatabaseProviderKind } from './provider.types';

let provider: DatabaseProvider | null = null;

export async function getProvider(): Promise<DatabaseProvider> {
  if (!provider) {
    provider = await createProvider();
  }
  return provider;
}

export async function createProvider(kind?: DatabaseProviderKind): Promise<DatabaseProvider> {
  const resolvedKind = kind ?? resolveProviderKind();
  console.log(`[DB Provider] Selected: ${resolvedKind}`);

  switch (resolvedKind) {
    case 'postgres':
      return createPostgresProvider();
    case 'sqlite':
      return createSqliteProvider();
    default:
      throw new Error(`Unknown DATABASE_PROVIDER: ${resolvedKind}`);
  }
}

function resolveProviderKind(): DatabaseProviderKind {
  const env = process.env.DATABASE_PROVIDER?.toLowerCase().trim();

  if (env === 'postgres' || env === 'sqlite') {
    return env;
  }

  // Auto-detect: si hay DATABASE_URL con postgres://, usar PostgreSQL
  const url = process.env.DATABASE_URL;
  if (url && url.startsWith('postgres://')) {
    return 'postgres';
  }

  // Default: SQLite (offline/demo/fallback)
  return 'sqlite';
}

async function createPostgresProvider(): Promise<DatabaseProvider> {
  const { getDb } = await import('./client');
  // Lazy init: la conexión real se abre al primer query (getDb())
  // Si falla, el error se propaga al primer uso
  try { getDb(); } catch { /* conexión se abrirá bajo demanda */ }
  const candidatesRepo = await import('./repositories/candidates.repository');
  const studentsRepo = await import('./repositories/students.repository');
  const usersRepo = await import('./repositories/users.repository');
  const chatRepo = await import('./repositories/chat.repository');
  const scenariosRepo = await import('./repositories/scenarios.repository');

  return {
    kind: 'postgres',
    candidates: candidatesRepo,
    students: studentsRepo,
    users: usersRepo,
    chat: chatRepo,
    scenarios: scenariosRepo,
  };
}

async function createSqliteProvider(): Promise<DatabaseProvider> {
  const sqlite = await import('./sqlite');

  return {
    kind: 'sqlite',
    candidates: sqlite.candidatesRepo,
    students: sqlite.studentsRepo,
    users: sqlite.usersRepo,
    chat: sqlite.chatRepo,
    scenarios: sqlite.scenariosRepo,
  };
}

export function resetProvider(): void {
  provider = null;
}
