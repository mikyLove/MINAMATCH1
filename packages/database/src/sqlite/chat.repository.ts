import { getSqliteDb } from './client';
import type { ChatMessageData, ChatMessageInsert, IChatRepo } from '../provider.types';

function rowToMessage(row: Record<string, unknown>): ChatMessageData {
  return {
    id: row.id as number,
    userId: (row.user_id as string) ?? null,
    role: row.role as string,
    content: row.content as string,
    responseSource: (row.response_source as string) ?? null,
    createdAt: (row.created_at as string) ?? null,
  };
}

export async function findHistory(userId: string, limit?: number): Promise<ChatMessageData[]> {
  const db = getSqliteDb();
  const query = limit
    ? 'SELECT * FROM chat_messages WHERE user_id = ? ORDER BY id ASC LIMIT ?'
    : 'SELECT * FROM chat_messages WHERE user_id = ? ORDER BY id ASC';
  const params = limit ? [userId, limit] : [userId];
  const rows = db.prepare(query).all(...params) as Record<string, unknown>[];
  return rows.map(rowToMessage);
}

export async function addMessage(data: ChatMessageInsert): Promise<ChatMessageData> {
  const db = getSqliteDb();
  const stmt = db.prepare(`
    INSERT INTO chat_messages (user_id, role, content, response_source)
    VALUES (@user_id, @role, @content, @response_source)
  `);
  stmt.run({
    user_id: data.userId,
    role: data.role,
    content: data.content,
    response_source: data.responseSource ?? null,
  });
  const row = db.prepare('SELECT * FROM chat_messages WHERE id = last_insert_rowid()').get() as Record<string, unknown>;
  return rowToMessage(row);
}

export async function deleteOld(userId: string, ttlMinutes: number = 10): Promise<number> {
  const db = getSqliteDb();
  const result = db
    .prepare(
      "DELETE FROM chat_messages WHERE user_id = ? AND created_at < datetime('now', ?)",
    )
    .run(userId, `-${ttlMinutes} minutes`);
  return result.changes;
}

export async function clearHistory(userId: string): Promise<number> {
  const db = getSqliteDb();
  const result = db.prepare('DELETE FROM chat_messages WHERE user_id = ?').run(userId);
  return result.changes;
}

export async function count(): Promise<number> {
  const db = getSqliteDb();
  const row = db.prepare('SELECT COUNT(*) as cnt FROM chat_messages').get() as { cnt: number };
  return row.cnt;
}
