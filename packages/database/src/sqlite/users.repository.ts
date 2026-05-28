import { getSqliteDb } from './client';
import type { UserData, UserInsert, IUsersRepo } from '../provider.types';

function rowToUser(row: Record<string, unknown>): UserData {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    password: row.password as string,
    role: (row.role as string) ?? null,
    avatar: (row.avatar as string) ?? null,
    createdAt: (row.created_at as string) ?? null,
  };
}

export async function findByEmail(email: string): Promise<UserData | undefined> {
  const db = getSqliteDb();
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as Record<string, unknown> | undefined;
  return row ? rowToUser(row) : undefined;
}

export async function findById(id: string): Promise<UserData | undefined> {
  const db = getSqliteDb();
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? rowToUser(row) : undefined;
}

export async function create(data: UserInsert): Promise<UserData> {
  const db = getSqliteDb();
  const stmt = db.prepare(`
    INSERT INTO users (id, name, email, password, role, avatar, created_at)
    VALUES (@id, @name, @email, @password, @role, @avatar, @created_at)
  `);
  stmt.run({
    id: data.id,
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role ?? 'user',
    avatar: data.avatar ?? null,
    created_at: data.createdAt ?? new Date().toISOString(),
  });
  return rowToUser(db.prepare('SELECT * FROM users WHERE id = ?').get(data.id) as Record<string, unknown>);
}

export async function update(id: string, data: Partial<UserInsert>): Promise<UserData | undefined> {
  const db = getSqliteDb();
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!existing) return undefined;

  const merged = { ...existing, ...data };
  const stmt = db.prepare(`
    UPDATE users SET name=@name, email=@email, password=@password, role=@role, avatar=@avatar WHERE id=@id
  `);
  stmt.run(merged);
  return rowToUser(db.prepare('SELECT * FROM users WHERE id = ?').get(id) as Record<string, unknown>);
}

export async function remove(id: string): Promise<boolean> {
  const db = getSqliteDb();
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);
  return result.changes > 0;
}

export async function count(): Promise<number> {
  const db = getSqliteDb();
  const row = db.prepare('SELECT COUNT(*) as cnt FROM users').get() as { cnt: number };
  return row.cnt;
}
