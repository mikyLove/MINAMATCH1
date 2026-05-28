import { eq, sql } from 'drizzle-orm';
import { getDb } from '../client';
import { users } from '../schema';

export type UserRow = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export async function findByEmail(
  email: string,
): Promise<UserRow | undefined> {
  const db = getDb();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  return rows[0];
}

export async function findById(id: string): Promise<UserRow | undefined> {
  const db = getDb();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, id));
  return rows[0];
}

export async function create(data: UserInsert): Promise<UserRow> {
  const db = getDb();
  const rows = await db.insert(users).values(data).returning();
  return rows[0]!;
}

export async function update(
  id: string,
  data: Partial<UserInsert>,
): Promise<UserRow | undefined> {
  const db = getDb();
  const rows = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  return rows[0];
}

export async function remove(id: string): Promise<boolean> {
  const db = getDb();
  const rows = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({ id: users.id });
  return rows.length > 0;
}

export async function count(): Promise<number> {
  const db = getDb();
  const rows = await db
    .select({ count: sql<number>`count(*)` })
    .from(users);
  return Number(rows[0]?.count ?? 0);
}
