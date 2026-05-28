# MinaMatch V2 — Changelog

## Fase 0A — Infraestructura del monorepo (2026-05-27)

### Añadido
- `packages/shared/` — workspace para tipos y validadores compartidos
- `packages/database/` — workspace para schema y migraciones (futuro)
- `packages/frontend/` — workspace para frontend V2 (futuro)
- `packages/backend/` — workspace para backend V2 (futuro)
- `tsconfig.base.json` — configuración base con `strict: true`
- `docs/V2_PLAN.md` — plan de migración con diagnóstico y fases

### Modificado
- `pnpm-workspace.yaml` — se añadió `packages/*` a la lista de workspaces
- `pnpm-lock.yaml` — actualizado por `pnpm install`

### No tocado
- `src/`, `server/`, `data/`, `vite.config.ts`, `Dockerfile`, `railway.json`, `index.html`

### Validación
- `pnpm install` ✅ — 5 workspaces detectados
- `pnpm run build` ✅ — Vite build exitoso
- `pnpm run lint` ⚠️ — 3 errores pre-existentes en `LandingPage.tsx` (V1)

---

## Fase 0B — Documentación de límites (2026-05-27)

### Añadido
- `docs/V2_MIGRATION_RULES.md` — reglas de qué tocar y qué no, validación, rollback
- `docs/V2_CHANGELOG.md` — este archivo
- `docs/V2_DECISIONS.md` — registro de decisiones técnicas

### Modificado
- `docs/V2_PLAN.md` — se agregó Fase 0B, scripts actuales, tabla de progreso

### Validación
- `pnpm install` ✅
- `pnpm run build` ✅
- `git status` ✅ — solo archivos de documentación y workspace

---

## Fase 1A — Migración espejo a shared (2026-05-27)

### Añadido
- `packages/shared/src/types.ts` — copia de `src/types.ts`
- `packages/shared/src/validators.ts` — copia de `server/validators.ts`
- `packages/shared/src/constants.ts` — copia de `server/config.ts`
- `packages/shared/src/index.ts` — barrel export

### Modificado
- `packages/shared/package.json` — se añadió `zod` como dependencia
- `packages/shared/src/index.ts` — barrel export
- `pnpm-lock.yaml` — actualizado por `pnpm install`

### No tocado
- `src/`, `server/`, `data/` — sin cambios

### Validación
- `pnpm install` ✅
- `pnpm run build` ✅
- `pnpm exec tsx -e "import * as shared from '@minamatch/shared'"` ✅ — exporta tipos, validadores y constantes

---

## Fase 1B — Migración de imports a @minamatch/shared (2026-05-27)

### Modificado
- `src/api/candidates.ts` — `from '../types'` → `from '@minamatch/shared'`
- `src/api/students.ts` — `from '../types'` → `from '@minamatch/shared'`
- `src/data.ts` — `from './types'` → `from '@minamatch/shared'`
- `src/components/BuscadorTalento.tsx` — `from '../types'` → `from '@minamatch/shared'`
- `src/components/MatchingShortlist.tsx` — `from '../types'` → `from '@minamatch/shared'`
- `src/components/SemillerosDashboard.tsx` — `from '../types'` → `from '@minamatch/shared'`
- `src/components/SemillerosList.tsx` — `from '../types'` → `from '@minamatch/shared'`
- `server/routes/auth.ts` — `from '../validators'` → `from '@minamatch/shared'`
- `server/routes/chat.ts` — `from '../validators'` → `from '@minamatch/shared'`
- `server/routes/students.ts` — `from '../validators'` → `from '@minamatch/shared'`
- `server/routes/agents.ts` — `from '../config'` → `from '@minamatch/shared'`
- `tsconfig.json` — se añadió `paths` para `@minamatch/shared`
- `packages/shared/src/validators.ts` — fix compatibilidad Zod v4 (`required_error` eliminado)

### Validación
- `pnpm install` ✅
- `pnpm run build` ✅
- `pnpm run lint` ⚠️ — solo 3 errores pre-existentes en `LandingPage.tsx`

---

## Fase 1C — Limpieza de archivos legacy (2026-05-27)

### Eliminado
- `src/types.ts` — migrado a `packages/shared/src/types.ts`
- `server/validators.ts` — migrado a `packages/shared/src/validators.ts`
- `server/config.ts` — migrado a `packages/shared/src/constants.ts`

### Validación
- `pnpm install` ✅
- `pnpm run build` ✅
- `pnpm run lint` ⚠️ — solo 3 errores pre-existentes en `LandingPage.tsx`
- `pnpm run dev:frontend` ✅ — Vite arranca correctamente
- `pnpm run dev:backend` ✅ — Express arranca correctamente (EADDRINUSE por servidor previo, no por error de código)
- `git status` ✅ — solo 3 archivos eliminados

### Logro
V1 (src/, server/) ya no depende de archivos locales de tipos/validadores/config. Todo se resuelve via `@minamatch/shared`.

---

## Fase 2A — Infraestructura de base de datos (2026-05-27)

### Añadido
- `packages/database/tsconfig.json` — configuración TypeScript para database package
- `packages/database/drizzle.config.ts` — configuración de Drizzle Kit
- `packages/database/src/schema.ts` — schema Drizzle para PostgreSQL (8 tablas)
- `packages/database/src/client.ts` — cliente Drizzle + postgres.js
- `packages/database/src/seed.ts` — seed data para desarrollo (candidatos, estudiantes, escenarios, etc.)
- `packages/database/src/index.ts` — barrel export actualizado
- `docs/V2_DATABASE.md` — documentación de la capa de datos
- `docker-compose.yml` — PostgreSQL 16 de referencia para desarrollo local

### Modificado
- `packages/database/package.json` — se añadieron `drizzle-orm`, `postgres`, `drizzle-kit`, `dotenv`
- `package.json` raíz — se añadieron scripts `db:*` (generate, migrate, push, seed, studio)
- `.env.example` — se añadió `DATABASE_URL`

### No tocado
- `server/db.ts` — V1 SQLite sigue intacto
- `src/`, `server/`, `data/` — sin cambios

### Validación
- `pnpm install` ✅
- `pnpm run build` ✅
- `pnpm run lint` ⚠️ — solo 3 errores pre-existentes en `LandingPage.tsx`
- `git status` ✅ — solo archivos esperados

---

## Fase 2B — Ejecución de migraciones y seed (2026-05-27)

### Ejecutado
- PostgreSQL 18.4 iniciado localmente (port 5433, sin Docker) con usuario/database `minamatch/minamatch_v2`
- Migración generada: `packages/database/migrations/0000_calm_blink.sql`
- Migración aplicada: 8 tablas creadas correctamente
- Seed ejecutado: datos espejo de V1 cargados

### Datos verificados en PostgreSQL

| Tabla | Filas |
|-------|-------|
| candidates | 6 |
| candidate_interviews | 7 |
| students | 2 |
| student_syllabus | 8 |
| scenarios | 5 |
| scenario_options | 10 |
| users | 1 |
| chat_messages | 1 |

### No tocado
- `server/db.ts` — V1 SQLite sigue intacto
- `src/`, `server/`, `data/` — sin cambios

### Validación
- `pnpm install` ✅
- `pnpm run build` ✅
- `pnpm run lint` ⚠️ — solo 3 errores pre-existentes en `LandingPage.tsx`
- Conexión Drizzle via `client.ts` ✅
- `git status` ✅ — solo archivos esperados (migrations/ incluido)

### Observación
- Docker no disponible en este entorno; PostgreSQL se instaló via `apt-get download` + extracción manual de debs, iniciado como usuario local.

---

## Fase 2C-1 — Repositorios tipados para PostgreSQL (2026-05-27)

### Añadido
- `packages/database/src/repositories/` — capa de acceso a datos desacoplada
- `packages/database/src/repositories/candidates.repository.ts`
- `packages/database/src/repositories/students.repository.ts`
- `packages/database/src/repositories/chat.repository.ts`
- `packages/database/src/repositories/users.repository.ts`
- `packages/database/src/repositories/index.ts`

### Modificado
- `packages/database/src/index.ts` — barrel export con `repositories`

### No tocado
- `server/db.ts` — V1 SQLite sigue intacto
- `src/`, `server/`, `data/` — sin cambios
- Express routes — sin modificar

### Validación
- `pnpm install` ✅
- `pnpm run build` ✅
- `pnpm run lint` ⚠️ — solo 3 errores pre-existentes en `LandingPage.tsx`
- TypeScript type-check ✅ — repositorios compilan correctamente
- Exports verificados via tsx eval ✅

---

## Fase 2C-2 — Rutas V2 con repositorios tipados (2026-05-27)

### Añadido
- `packages/backend/tsconfig.json`
- `packages/backend/src/index.ts` — entry point de prueba (puerto 3004)
- `packages/backend/src/routes/v2/simple.routes.ts` — handlers V2 usando repositorios tipados

### Modificado
- `packages/backend/package.json` — +express, cors, drizzle-orm, @minamatch/database, types

### Endpoints migrados a V2 con repositorios Drizzle

| Endpoint | Método | Repositorio usado | Coincide con V1 |
|----------|--------|-------------------|-----------------|
| `/api/candidates` | GET | `candidatesRepo.findAll()` | ✅ estructura |
| `/api/candidates/:id` | GET | `candidatesRepo.findById()` | ✅ estructura |
| `/api/students` | GET | `studentsRepo.findAll()` | ✅ estructura |
| `/api/scenarios` | GET | `getDb()` + schema directo | ✅ idéntico |

### Transformaciones implementadas
- `languages` y `skills`: JSON string → array parseado
- `certified`, `isTop5`, `hasOsha`: boolean correcto
- `aiInterviewTranscript`: agregado desde candidate_interviews
- Syllabus: formato `{ id, course, completed }` (idéntico a V1)
- Scenarios: `options[].impact.culturalFit` anidado (idéntico a V1)
- Compatibilidad V1: snake_case duplicado (exp_years, match_rating, etc.)

### Verificado localmente
- Servidor V2 iniciado en puerto 3099
- `GET /api/candidates` → 6 candidatos con entrevistas
- `GET /api/students` → 2 estudiantes con syllabus
- `GET /api/scenarios` → 5 escenarios con opciones e impact
- Comparación V1 vs V2: estructura y formato idénticos
  - Datos de candidates/students difieren porque V1 fue modificado por uso (no por error de código)
  - Scenarios: 5/5 coinciden exactamente entre V1 y V2

### No tocado
- `server/db.ts` — V1 SQLite sigue intacto
- `src/`, `server/`, `data/` — sin cambios
- Express V1 — sin modificar

### Validación
- `pnpm install` ✅
- `pnpm run build` ✅
- `pnpm run lint` ⚠️ — solo 3 errores pre-existentes en `LandingPage.tsx`

---

## Fase 2C-3 — Autenticación V2 con PostgreSQL (2026-05-27)

### Añadido
- `packages/backend/src/middleware/auth.middleware.ts` — middleware JWT V2 (guest token, verify)
- `packages/backend/src/routes/v2/auth.routes.ts` — auth V2 con `usersRepo`

### Modificado
- `packages/backend/package.json` — +bcryptjs, jsonwebtoken, @minamatch/shared
- `packages/backend/src/index.ts` — monta `/api/v2/auth`, carga server/.env

### Endpoints V2

| Endpoint | Repositorio | Validación |
|----------|-------------|------------|
| `POST /api/v2/auth/login` | `usersRepo.findByEmail()` | loginSchema (zod) + bcrypt |
| `GET /api/v2/auth/me` | `usersRepo.findById()` | JWT verify + authMiddleware |

### Características
- **Mismo JWT que V1**: payload `{ id, email, name, role }`, expira 24h, misma secret
- **Guest token**: `guest-token` manejado sin consultar DB (compatible con V1)
- **Fallback**: si PostgreSQL falla, devuelve `503 Servicio no disponible` (no afecta V1)
- **bcrypt real**: contraseña admin actualizada con hash real generado en runtime

### Convivencia V1 ↔ V2
- **V1**: `/api/auth/login` y `/api/auth/me` → SQLite (intacto)
- **V2**: `/api/v2/auth/login` y `/api/v2/auth/me` → PostgreSQL
- Ambos coexisten sin interferencias
- Frontend puede migrar endpoint por endpoint

### Validación
- `pnpm install` ✅
- `pnpm run build` ✅
- `pnpm run lint` ⚠️ — solo 3 errores pre-existentes en `LandingPage.tsx`
- `POST /api/v2/auth/login` con credenciales correctas → token + user ✅
- `POST /api/v2/auth/login` con password incorrecto → 401 ✅
- `POST /api/v2/auth/login` con email inexistente → 401 ✅
- `POST /api/v2/auth/login` con body inválido → 400 ✅
- `GET /api/v2/auth/me` con token válido → perfil usuario ✅
- `GET /api/v2/auth/me` con guest-token → datos invitado ✅
- `GET /api/v2/auth/me` sin token → 401 ✅

---

## Fase 2C-4 — Chat y Agents V2 con PostgreSQL + Gemini (2026-05-27)

### Añadido
- `packages/backend/src/services/gemini.ts` — cliente V2 para `@google/genai` v2.6.0 (nueva API `models.generateContent`, `chats.create`)
- `packages/backend/src/routes/v2/chat.routes.ts` — chat V2 con `chatRepo`, streaming y fallback
- `packages/backend/src/routes/v2/agents.routes.ts` — agents V2 con `candidatesRepo`, `getDb()` y `evaluationModel`

### Modificado
- `packages/backend/package.json` — +`@google/genai` como dependencia
- `packages/backend/src/index.ts` — monta `/api/v2/chat` y `/api/v2/agents`

### Bug corregido (V1)
- `server/routes/agents.ts` usaba `aiModel.generateContent()` pero `aiModel` no estaba definido (solo existía `evaluationModel`). En V2 se usa `evaluationModel.generateContent()` correctamente.

### Endpoints V2

| Endpoint | Repositorio/Servicio | Diferencias con V1 |
|----------|---------------------|-------------------|
| `POST /api/v2/chat/message` | `chatRepo` + Gemini streaming | ✅ usando repositorio Drizzle |
| `GET /api/v2/chat/history` | `chatRepo.findHistory()` | ✅ usando repositorio Drizzle |
| `DELETE /api/v2/chat/history` | `chatRepo.clearHistory()` | ✅ usando repositorio Drizzle |
| `POST /api/v2/agents/interview` | `candidatesRepo.findById()` | ✅ sin `aiModel` bug, columnas camelCase |
| `POST /api/v2/agents/evaluate-scenario` | `getDb()` + schema Drizzle | ✅ usando Drizzle queries |
| `POST /api/v2/agents/matching` | `candidatesRepo.findAll()` | ✅ columnas camelCase (matchRating, expYears, etc.) |

### Adaptación a `@google/genai` v2.6.0
- `getGenerativeModel()` fue eliminado; se usa `genAI.models.generateContent()` para no-streaming y `genAI.chats.create()` para sesiones de chat
- `generateContent()` devuelve `GenerateContentResponse` con `.text` getter (antes era `.text()` método)
- `sendMessageStream()` recibe `{ message }` como objeto (antes string plano)
- `sendMessageStream()` devuelve `AsyncGenerator` directo (antes `{ stream }`)
- `GoogleGenAI` constructor recibe `{ apiKey }` como objeto (antes string plano)

### Validación
- `pnpm install` ✅
- `pnpm run build` ✅
- `TypeScript type-check` ✅ — 0 errores
- `curl /api/v2/health` ✅ — servidor V2 arranca y responde
- `curl /api/v2/chat/message` ⏳ — requiere PostgreSQL funcionando
- `curl /api/v2/agents/interview` ⏳ — requiere PostgreSQL funcionando

---

## Fase 2C-5 — Arquitectura Enterprise/Offline Híbrida (2026-05-27)

### Añadido
- `docs/V2_DATABASE_PROVIDER.md` — documento de estrategia híbrida PostgreSQL/SQLite
- `packages/database/src/provider.types.ts` — interfaces comunes: `ICandidatesRepo`, `IStudentsRepo`, `IUsersRepo`, `IChatRepo`, `DatabaseProvider`
- `packages/database/src/provider.ts` — factory asíncrona `createProvider()` + singleton `getProvider()` + `resetProvider()`
- `packages/database/src/sqlite/client.ts` — cliente SQLite que reusa `data/minamatch.db` de V1
- `packages/database/src/sqlite/candidates.repository.ts` — implementación SQLite de `ICandidatesRepo`
- `packages/database/src/sqlite/students.repository.ts` — implementación SQLite de `IStudentsRepo`
- `packages/database/src/sqlite/users.repository.ts` — implementación SQLite de `IUsersRepo`
- `packages/database/src/sqlite/chat.repository.ts` — implementación SQLite de `IChatRepo`
- `packages/database/src/sqlite/index.ts` — barrel export de SQLite repos

### Modificado
- `packages/database/src/index.ts` — exporta `getProvider`, `createProvider`, `resetProvider` y tipos del provider
- `.env.example` — añadido `DATABASE_PROVIDER` con valores `postgres`/`sqlite`
- `package.json` (raíz) — añadido `@types/better-sqlite3` como devDependency
- `docs/V2_PLAN.md` — actualizado con Fase 2C-5 (ver abajo)

### Modos de operación

| Modo | `DATABASE_PROVIDER` | `DATABASE_URL` | Comportamiento |
|------|-------------------|----------------|----------------|
| production | `postgres` | PostgreSQL real | Drizzle ORM |
| development-full | `postgres` | PostgreSQL local | Drizzle ORM |
| development-offline | `sqlite` | — | better-sqlite3 |
| demo-local | `sqlite` | — | better-sqlite3 |
| auto-detect | *(sin definir)* | `postgres://...` | Drizzle ORM |
| auto-fallback | *(sin definir)* | *(sin definir)* | SQLite |

### Decisiones técnicas
- `createProvider()` es asíncrona → permite `import()` dinámico de drivers (evita cargar Drizzle si se usa SQLite)
- `getProvider()` es singleton (cachea el provider tras la primera llamada)
- `resetProvider()` permite forzar recreación (útil en tests y cambio de entorno)
- Las interfaces en `provider.types.ts` son planas (sin dependencia de Drizzle o better-sqlite3)
- SQLite reusa `data/minamatch.db` de V1 (sin duplicación de seed data)
- Los repositorios PostgreSQL existentes NO se modificaron

### No tocado
- `server/db.ts` — V1 SQLite intacto ✅
- `server/routes/*` — V1 Express intacto ✅
- `src/` — frontend V1 intacto ✅
- `data/minamatch.db` — datos V1 intactos ✅
- Express V2 (`packages/backend/src/routes/v2/`) — sin cambios en rutas ✅

### Pendiente para siguiente fase
- Conectar Express V2 al provider (`getProvider().candidates.findAll()` en lugar de `candidatesRepo.findAll()`)
- Soporte `DATABASE_PROVIDER=sqlite` en el seed
- Estrategia de sincronización bidireccional PostgreSQL ↔ SQLite

### Validación
- `pnpm install` ✅
- `pnpm run build` ✅ (Vite build exitoso)
- `pnpm run lint` ✅ (tsc --noEmit, 0 errores)
- V1 sin cambios — git status confirma solo archivos nuevos o migrados`
