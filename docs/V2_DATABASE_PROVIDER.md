# MinaMatch V2 — Database Provider (Híbrido PostgreSQL/SQLite)

## Objetivo

Permitir que MinaMatch V2 funcione con **PostgreSQL como base principal** y **SQLite como modo offline/demo/fallback**, sin cambiar el código de las rutas Express.

## Estrategia

Una **capa de abstracción** (`DatabaseProvider`) que expone una interfaz común para todos los repositorios. Las rutas Express V2 nunca llaman directamente a Drizzle o better-sqlite3; siempre lo hacen a través del provider.

```
┌─────────────────────────────────────────────────┐
│                  Express Routes                  │
│  (GET /api/candidates, POST /api/v2/auth, ...)  │
└──────────────────────┬──────────────────────────┘
                       │
               ┌───────▼────────┐
               │   getProvider() │
               │  (singleton)    │
               └───────┬────────┘
                       │
           ┌────────────┬────────────┬────────────┐
           ▼            ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
    │candidates│ │students  │ │users     │ │scenarios │
    │Repo      │ │Repo      │ │Repo      │ │Repo      │
    └──────────┘ └──────────┘ └──────────┘ └──────────┘
           ▲            ▲            ▲            ▲
           │            │            │            │
    ┌──────┴────────────┴────────────┴────────────┴──┐
    │        DatabaseProvider                        │
    │  (interfaz común: ICandidatesRepo,             │
    │   IStudentsRepo, IUsersRepo, IChatRepo,        │
    │   IScenariosRepo)                              │
    └────────────────────────┬───────────────────────┘
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
   ┌────────────┐       ┌───────────┐
   │ PostgreSQL │       │   SQLite  │
   │ (Drizzle)  │       │(better-   │
   │ Producción │       │ sqlite3)  │
   │            │       │ Offline/  │
   │            │       │ Fallback  │
   └────────────┘       └───────────┘
```

## Variable de entorno: `DATABASE_PROVIDER`

| Valor | Comportamiento |
|-------|---------------|
| `postgres` (default) | Usa PostgreSQL via Drizzle ORM |
| `sqlite` | Usa SQLite via better-sqlite3 |

### Determinación automática (fallback)

Si `DATABASE_PROVIDER=postgres` pero PostgreSQL no está disponible (conexión falla), el provider **NO** cambia automáticamente a SQLite (para evitar errores silenciosos en producción).

En desarrollo, si `DATABASE_PROVIDER` no está definido y `DATABASE_URL` no apunta a un PG disponible, se puede forzar `DATABASE_PROVIDER=sqlite`.

## Modos de operación

| Modo | DATABASE_PROVIDER | DATABASE_URL | Uso |
|------|-------------------|-------------|-----|
| production | `postgres` | PostgreSQL real | Railway / producción real |
| development-full | `postgres` | PostgreSQL local | Desarrollo con PG local |
| development-offline | `sqlite` | — | Desarrollo sin PostgreSQL |
| demo-local | `sqlite` | — | Demostraciones locales |
| fallback | `sqlite` | — | Cuando PG no está disponible |

## Archivos creados

| Archivo | Propósito |
|---------|-----------|
| `packages/database/src/provider.types.ts` | Interfaces comunes (`ICandidatesRepo`, `IStudentsRepo`, `IUsersRepo`, `IChatRepo`, `IScenariosRepo`, `DatabaseProvider`) |
| `packages/database/src/provider.ts` | Factory `createProvider()` + singleton `getProvider()` |
| `packages/database/src/sqlite/client.ts` | Cliente SQLite (conexión a `data/minamatch.db`) |
| `packages/database/src/sqlite/candidates.repository.ts` | Implementación SQLite de `ICandidatesRepo` |
| `packages/database/src/sqlite/students.repository.ts` | Implementación SQLite de `IStudentsRepo` |
| `packages/database/src/sqlite/users.repository.ts` | Implementación SQLite de `IUsersRepo` |
| `packages/database/src/sqlite/chat.repository.ts` | Implementación SQLite de `IChatRepo` |
| `packages/database/src/sqlite/scenarios.repository.ts` | Implementación SQLite de `IScenariosRepo` |
| `packages/database/src/sqlite/index.ts` | Barrel export |
| `packages/database/src/repositories/candidates.repository.ts` | Implementación PostgreSQL de `ICandidatesRepo` (Drizzle) |
| `packages/database/src/repositories/students.repository.ts` | Implementación PostgreSQL de `IStudentsRepo` (Drizzle) |
| `packages/database/src/repositories/users.repository.ts` | Implementación PostgreSQL de `IUsersRepo` (Drizzle) |
| `packages/database/src/repositories/chat.repository.ts` | Implementación PostgreSQL de `IChatRepo` (Drizzle) |
| `packages/database/src/repositories/scenarios.repository.ts` | Implementación PostgreSQL de `IScenariosRepo` (Drizzle) |

## ¿Por qué mantener SQLite?

1. **Offline local**: desarrolladores pueden trabajar sin PostgreSQL
2. **Demostraciones rápidas**: zero setup para mostrar la app
3. **Fallback**: si PostgreSQL se cae, SQLite mantiene la app funcional
4. **Compatibilidad V1**: el archivo `data/minamatch.db` de V1 se reutiliza

## Tests de integración

El provider se valida con dos suites de tests independientes:

### SQLite (6 tests)
```bash
pnpm --filter @minamatch/backend test:sqlite
```
- Tests estructurales contra `data/minamatch.db`
- Sin dependencias externas
- Verifica: tipos boolean, arrays parseados (languages, skills), nested `culturalFit`, snake_case compat

### PostgreSQL (9 tests, opcionales)
```bash
DATABASE_URL="postgres://minamatch:minamatch_dev@localhost:5432/minamatch_v2" \
  pnpm --filter @minamatch/backend test:postgres
```
- Tests estructurales + valores específicos contra PostgreSQL
- Requiere: `docker compose up -d` + `pnpm db:migrate` + `pnpm db:seed`
- Skip automático si PostgreSQL no está disponible (TCP connect al puerto 5432)
- Verifica: mismos tipos, booleans, arrays, nested `culturalFit`, y valores exactos del seed

### Ambos
```bash
pnpm --filter @minamatch/backend test:all    # 49 tests total (40 SQLite + 9 PostgreSQL)
```

### Cobertura completa

| Test file | Tests | Endpoints cubiertos |
|-----------|-------|---------------------|
| `simple.routes.test.ts` | 6 | `GET /api/candidates`, `/candidates/:id`, `/students`, `/scenarios`, `/health` (estructural) |
| `auth.routes.test.ts` | 7 | `POST /api/v2/auth/login` (token, 401, 400), `GET /api/v2/auth/me` (token, guest, sin token, inválido) |
| `chat.routes.test.ts` | 8 | `POST /api/v2/chat/message` (fallback, prohibidas, cortas, guest), `GET /history`, `DELETE /history` |
| `agents.routes.test.ts` | 9 | `POST /api/v2/agents/interview` (éxito, 404, 400, 401), `/evaluate-scenario` (éxito, 404, 404), `/matching` (éxito, 400) |
| `simple.routes.postgres.test.ts` | 9 | PG opcionales: estructural + valores específicos para candidates, students, scenarios |

## Pendiente

- Estrategia de sincronización entre PostgreSQL y SQLite
- Logger estructurado (Pino)
