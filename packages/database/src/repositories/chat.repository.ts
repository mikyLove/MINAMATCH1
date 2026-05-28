import { eq, asc, sql } from 'drizzle-orm';
import { getDb } from '../client';
import { chatMessages } from '../schema';

export type ChatMessageRow = typeof chatMessages.$inferSelect;
export type ChatMessageInsert = typeof chatMessages.$inferInsert;

export async function findHistory(
  userId: string,
  limit?: number,
): Promise<ChatMessageRow[]> {
  const db = getDb();
  const query = db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, userId))
    .orderBy(asc(chatMessages.id));

  if (limit !== undefined) {
    return query.limit(limit);
  }
  return query;
}

export async function addMessage(data: ChatMessageInsert): Promise<ChatMessageRow> {
  const db = getDb();
  const rows = await db.insert(chatMessages).values(data).returning();
  return rows[0]!;
}

export async function deleteOld(
  userId: string,
  ttlMinutes: number = 10,
): Promise<number> {
  const db = getDb();
  const rows = await db
    .delete(chatMessages)
    .where(
      sql`${chatMessages.userId} = ${userId} AND ${chatMessages.createdAt} < datetime('now', ${`-${ttlMinutes} minutes`})`,
    )
    .returning({ id: chatMessages.id });
  return rows.length;
}

export async function clearHistory(userId: string): Promise<number> {
  const db = getDb();
  const rows = await db
    .delete(chatMessages)
    .where(eq(chatMessages.userId, userId))
    .returning({ id: chatMessages.id });
  return rows.length;
}

export async function count(): Promise<number> {
  const db = getDb();
  const rows = await db
    .select({ count: sql<number>`count(*)` })
    .from(chatMessages);
  return Number(rows[0]?.count ?? 0);
}
