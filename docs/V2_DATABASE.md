# MinaMatch V2 — Database Layer

## Stack

- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) v0.45+
- **Driver**: [postgres.js](https://github.com/porsager/postgres) v3.4+
- **Database**: PostgreSQL 16 (local dev via Docker Compose)
- **Migration tool**: Drizzle Kit

## Schema

Defined in `packages/database/src/schema.ts`. Mirrors the V1 SQLite schema:

| V1 SQLite | V2 PostgreSQL | Notes |
|-----------|--------------|-------|
| candidates | candidates | Column names converted to snake_case in DB |
| candidate_interviews | candidate_interviews | FK → candidates |
| students | students | — |
| student_syllabus | student_syllabus | FK → students |
| scenarios | scenarios | — |
| scenario_options | scenario_options | FK → scenarios |
| users | users | Unique index on email |
| chat_messages | chat_messages | FK → users |

All tables use `text` primary keys (except auto-increment `serial` for child tables).

## Scripts

From the root `package.json`:

| Script | Description |
|--------|-------------|
| `pnpm run db:generate` | Generate SQL migration from schema changes |
| `pnpm run db:migrate` | Apply pending migrations |
| `pnpm run db:push` | Push schema directly (dev only) |
| `pnpm run db:seed` | Seed database with development data |
| `pnpm run db:studio` | Launch Drizzle Studio GUI |

## Local Setup

1. Start PostgreSQL:
   ```bash
   docker compose up -d
   ```

2. Copy env vars:
   ```bash
   cp .env.example .env
   ```

3. Push schema:
   ```bash
   pnpm run db:push
   ```

4. Seed data:
   ```bash
   pnpm run db:seed
   ```

## Migration Rules

- Do not modify `server/db.ts` (V1 SQLite) until V2 backend is ready.
- All new queries against V2 must use Drizzle query builder, not raw SQL.
- Migration files go in `packages/database/migrations/`.
