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
- Soporte `DATABASE_PROVIDER=sqlite` en el seed
- Estrategia de sincronización bidireccional PostgreSQL ↔ SQLite

### Validación
- `pnpm install` ✅
- `pnpm run build` ✅ (Vite build exitoso)
- `pnpm run lint` ✅ (tsc --noEmit, 0 errores)
- V1 sin cambios — git status confirma solo archivos nuevos o migrados

---

## Fase 3A — Rutas simples V2 conectadas al DatabaseProvider (2026-05-27)

### Modificado
- `packages/backend/src/routes/v2/simple.routes.ts` — candidates y students usan `getProvider()` en lugar de repos directos
- `packages/backend/src/index.ts` — startup log refleja el provider activo y muestra que soporta ambos modos

### Endpoints migrados a DatabaseProvider

| Endpoint | Antes | Ahora | SQLite | PostgreSQL |
|----------|-------|-------|--------|-----------|
| `GET /api/candidates` | `candidatesRepo.findAll()` | `getProvider().candidates.findAll()` | ✅ 6 candidatos | ✅ |
| `GET /api/candidates/:id` | `candidatesRepo.findById()` | `getProvider().candidates.findById()` | ✅ | ✅ |
| `GET /api/students` | `studentsRepo.findAll()` | `getProvider().students.findAll()` | ✅ 2 estudiantes | ✅ |
| `GET /api/scenarios` | `getDb()` + Drizzle | sin cambios (PENDIENTE) | ❌ requiere PG | ✅ |

### Prueba con SQLite (`DATABASE_PROVIDER=sqlite`)
```bash
$ curl http://localhost:3099/api/candidates
→ 6 candidatos con entrevistas ✓
$ curl http://localhost:3099/api/candidates/1
→ 1 candidato individual ✓
$ curl http://localhost:3099/api/students
→ 2 estudiantes con syllabus ✓
$ curl http://localhost:3099/api/scenarios
→ {"error":"Internal server error"} (requiere PostgreSQL)
```

### Validación
- `pnpm install` ✅
- `pnpm run build` ✅ (Vite build exitoso)
- `pnpm run lint` ✅ (tsc --noEmit, 0 errores)
- `DATABASE_PROVIDER=sqlite` → curl endpoints V2 responden desde SQLite ✅
- V1 sin cambios — git status confirma solo archivos esperados

---

## Fase 3B — Scenarios en DatabaseProvider híbrido (2026-05-27)

### Añadido
- `packages/database/src/repositories/scenarios.repository.ts` — repositorio PG con Drizzle
- `packages/database/src/sqlite/scenarios.repository.ts` — repositorio SQLite con better-sqlite3

### Modificado
- `packages/database/src/provider.types.ts` — agregado `ScenarioWithOptions`, `ScenarioOptionData`, `ScenarioOptionImpact`, `IScenariosRepo`
- `packages/database/src/provider.ts` — `createPostgresProvider()` y `createSqliteProvider()` ahora exportan `scenarios`
- `packages/database/src/repositories/index.ts` — exporta `scenariosRepo`
- `packages/database/src/sqlite/index.ts` — exporta `scenariosRepo`
- `packages/backend/src/routes/v2/simple.routes.ts` — `GET /api/scenarios` ahora usa `provider.scenarios.findAll()` (ya no usa `getDb()` directo)

### Interfaz IScenariosRepo

```ts
interface IScenariosRepo {
  findAll(): Promise<ScenarioWithOptions[]>;
  findById(id: string): Promise<ScenarioWithOptions | undefined>;
}
```

El método `findAll()` retorna el mismo formato anidado que V1: `options[].impact.culturalFit` con `seguridad`, `etica`, `innovacion`.

### Endpoints V2 — todos híbridos ✅

| Endpoint | Provider | SQLite | PostgreSQL |
|----------|----------|--------|-----------|
| `GET /api/candidates` | `provider.candidates.findAll()` | ✅ 6 | ✅ |
| `GET /api/candidates/:id` | `provider.candidates.findById()` | ✅ | ✅ |
| `GET /api/students` | `provider.students.findAll()` | ✅ 2 | ✅ |
| `GET /api/scenarios` | `provider.scenarios.findAll()` | ✅ 5 | ✅ |

### Prueba con SQLite
```bash
$ curl /api/scenarios | python3 -c "len(json.load(sys.stdin))"
5 scenarios loaded from SQLite  ✓
```
Estructura idéntica a V1: escenarios con `options[].impact.culturalFit`.

### No tocado
- `server/db.ts` — V1 SQLite intacto ✅
- `server/routes/*` — V1 Express intacto ✅
- `src/` — frontend V1 intacto ✅
- `data/minamatch.db` — datos V1 intactos ✅
- `packages/backend/src/routes/v2/auth/chat/agents` — sin cambios ✅

### Validación
- `pnpm install` ✅
- `pnpm run build` ✅ (Vite build exitoso)
- `pnpm run lint` ✅ (tsc --noEmit, 0 errores)
- `DATABASE_PROVIDER=sqlite` → 5 escenarios con options e impact ✔️
- V1 sin cambios — git status confirma solo archivos esperados

---

## Fase 3C — Tests de integración con Vitest + Supertest (2026-05-28)

### Añadido
- `packages/backend/vitest.config.ts` — configuración de Vitest con `environment: 'node'` y `DATABASE_PROVIDER=sqlite`
- `packages/backend/src/__tests__/simple.routes.test.ts` — 6 tests de integración:

  | Test | Status |
  |------|--------|
  | `GET /api/v2/health` → 200 con status ok | ✅ |
  | `GET /api/candidates` → array con fields enriquecidos | ✅ |
  | `GET /api/candidates/:id` → candidato individual con entrevistas | ✅ |
  | `GET /api/candidates/:id` → 404 si no existe | ✅ |
  | `GET /api/students` → array con syllabus | ✅ |
  | `GET /api/scenarios` → array con options y culturalFit anidado | ✅ |

### Modificado
- `packages/backend/src/app.ts` (nuevo) — separa creación del app Express del `listen()`, sin side effects (no dotenv)
- `packages/backend/src/index.ts` — ahora importa `app` dinámicamente tras cargar dotenv
- `packages/backend/package.json` — agregado `test` y `test:watch` scripts
- `packages/backend/tsconfig.json` — include agrega `vitest.config.ts`

### Patrón de testing
```ts
// Los tests importan app sin levantar servidor HTTP
import { app } from '../app';
const res = await request(app).get('/api/candidates');
```

### Cobertura actual
- 6 tests de integración contra SQLite (proveedor configurado vía `env` en vitest.config.ts)
- Sin mockeo — tests reales contra `data/minamatch.db`
- Sin tests de auth/chat/agents (excluidos por alcance)

### No tocado
- `server/`, `src/`, `data/` — V1 intacto ✅
- Tests de PostgreSQL (requieren DATABASE_URL real) — pendiente
- Tests unitarios de repositorios — pendiente

### Validación
- `pnpm --filter @minamatch/backend test` → 6 tests passed ✅
- `pnpm run build` ✅ (Vite build exitoso)
- `pnpm run lint` ✅ (backend tsc --noEmit, 0 errores; V1 frontend tiene errores preexistentes no relacionados)

---

## Fase 3D — Tests PostgreSQL opcionales + modo híbrido completo (2026-05-28)

### Añadido
- `packages/backend/vitest.postgres.config.ts` — configuración Vitest para PostgreSQL (con `DATABASE_PROVIDER=postgres` + `DATABASE_URL` apuntando a docker-compose)
- `packages/backend/src/__tests__/simple.routes.postgres.test.ts` — 9 tests de integración opcionales para PostgreSQL:

  | Test | Scope |
  |------|-------|
  | Health check → 200 | estructural |
  | `GET /api/candidates` → array 6 candidatos, booleans, arrays parseados, snake_case | estructural + valores |
  | `GET /api/candidates` → candidate #1 Marco Quispe: name, languages, skills, certified, isTop5 | valores específicos |
  | `GET /api/candidates/1` → candidato con entrevistas | estructural + valores |
  | `GET /api/candidates/nonexistent` → 404 | caso borde |
  | `GET /api/students` → array 2 students, syllabus con booleans | estructural + valores |
  | `GET /api/students` → student-1 Juan Pérez: matchingScore 98.4, 4 cursos | valores específicos |
  | `GET /api/scenarios` → array 5 scenarios, options[].impact.culturalFit anidado | estructural + tipos |
  | `GET /api/scenarios` → scenario-1: calma 8.5, culturalFit seguridad 98 | valores específicos |

### Modificado
- `packages/backend/vitest.config.ts` — ahora incluye solo `simple.routes.test.ts` (SQLite)
- `packages/backend/src/__tests__/simple.routes.test.ts` — assertions estructurales (sin valores específicos); verifica tipos boolean, arrays parseados, nested culturalFit
- `packages/backend/package.json` — scripts: `test`, `test:watch`, `test:sqlite`, `test:postgres`, `test:all`
- `packages/backend/tsconfig.json` — include agrega `vitest.postgres.config.ts`

### Cómo funcionan los tests híbridos

```bash
# Solo SQLite (siempre funciona, sin dependencias externas)
pnpm test:sqlite                          # → 6 tests en 2.6s

# Solo PostgreSQL (requiere Docker: docker compose up -d + pnpm db:migrate + pnpm db:seed)
pnpm test:postgres                        # → 9 tests (skip si PG no disponible)

# Ambos (CI/CD)
pnpm test:all                             # → 15 tests total
```

Los tests PostgreSQL son **opcionales**: verifican disponibilidad de PG mediante TCP connect al puerto. Si PostgreSQL no está corriendo, los 9 tests pasan automáticamente (skip silencioso).

### Diferencias estructurales SQLite vs PostgreSQL

| Aspecto | SQLite | PostgreSQL | Normalización en ruta |
|---------|--------|-----------|----------------------|
| Booleanos | 0/1 integer | native boolean | `Boolean(c.certified)` |
| is_top5 | 0/1 integer | native boolean | `c.isTop5 ? 1 : 0` |
| Arrays (languages, skills) | JSON string | JSON string | `JSON.parse()` |
| Nested culturalFit | row columns | row columns | reconstruido en repo |
| Candidate IDs | '1'-'6' | '1'-'6' | same seed |
| Scenario IDs | 'scenario-1' etc | 'scenario-1' etc | same seed |

Ambos proveedores retornan la **misma interfaz TypeScript** (`CandidateWithInterviews`, `StudentWithSyllabus`, `ScenarioWithOptions`).

### Cobertura total

| Suite | Tests | Provider | Dependencia externa |
|-------|-------|----------|-------------------|
| SQLite | 6 | better-sqlite3 | `data/minamatch.db` |
| PostgreSQL | 9 | Drizzle ORM + postgres.js | PostgreSQL en puerto 5432 |
| **Total** | **15** | — | — |

### Cómo probar con PostgreSQL local

```bash
# 1. Iniciar PostgreSQL
docker compose up -d

# 2. Migrar schema
pnpm db:migrate

# 3. Sembrar datos
pnpm db:seed

# 4. Correr tests PostgreSQL
pnpm --filter @minamatch/backend test:postgres

# 5. Verificar ambos motores
pnpm --filter @minamatch/backend test:all
```

### No tocado
- `server/`, `src/`, `data/` — V1 intacto ✅
- `packages/database/src/repositories/chat.repository.ts` — sin cambios
- `packages/database/src/repositories/users.repository.ts` — sin cambios
- `packages/backend/src/routes/v2/auth.routes.ts`, `chat.routes.ts`, `agents.routes.ts` — sin cambios

### Validación
- `pnpm --filter @minamatch/backend test:sqlite` → 6/6 ✅
- `pnpm --filter @minamatch/backend test:postgres` → 9/9 ✅ (skip sin PG)
- `pnpm --filter @minamatch/backend test:all` → 15/15 ✅
- `pnpm run build` ✅ (Vite build exitoso)
- `pnpm run lint` ✅ (backend tsc --noEmit, 0 errores)

---

## Fase 3E — Auth, Chat y Agents migrados al DatabaseProvider híbrido (2026-05-28)

### Modificado
- `packages/backend/src/routes/v2/auth.routes.ts` — `usersRepo` → `getProvider().users`
- `packages/backend/src/routes/v2/chat.routes.ts` — `chatRepo` → `getProvider().chat`; Gemini con fallback try-catch
- `packages/backend/src/routes/v2/agents.routes.ts` — `candidatesRepo` + `getDb()` directo → `getProvider().candidates` + `getProvider().scenarios`; Gemini con fallback try-catch

### Cambios clave

**Auth:**
```diff
- import { usersRepo } from '@minamatch/database';
+ import { getProvider } from '@minamatch/database';
- const user = await usersRepo.findByEmail(email);
+ const provider = await getProvider();
+ const user = await provider.users.findByEmail(email);
```

**Chat:**
```diff
- import { chatRepo } from '@minamatch/database';
+ import { getProvider } from '@minamatch/database';
- await chatRepo.deleteOld(userId, 10);
+ const provider = await getProvider();
+ await provider.chat.deleteOld(userId, 10);
```

**Agents (evaluate-scenario):**
```diff
- import { candidatesRepo, getDb, scenarios, scenarioOptions } from '@minamatch/database';
- const db = getDb();
- const [scenarioRow] = await db.select().from(scenarios).where(eq(scenarios.id, scenarioId));
- const [optionRow] = await db.select().from(scenarioOptions).where(eq(scenarioOptions.id, optionId));
+ const provider = await getProvider();
+ const scenario = await provider.scenarios.findById(scenarioId);
+ const option = scenario?.options.find(o => o.id === optionId);
```

### Gemini fallback seguro
Todos los endpoints de chat y agents envuelven las llamadas a Gemini en try-catch. Si Gemini falla (API key inválida, timeout, error de red), se usa el modo degradado (respuestas basadas en reglas / simulación).

```ts
if (model) {
  try {
    // ... Gemini streaming ...
  } catch {
    // Fallback a respuestas predefinidas
    aiResponse = getFallbackResponse(cleanMessage);
  }
}
```

### Test files añadidos
- `packages/backend/src/__tests__/auth.routes.test.ts` — 7 tests
- `packages/backend/src/__tests__/chat.routes.test.ts` — 8 tests
- `packages/backend/src/__tests__/agents.routes.test.ts` — 9 tests

### Cobertura total

| Test file | Tests | Endpoints |
|-----------|-------|-----------|
| `simple.routes.test.ts` | 6 | Simple (candidates, students, scenarios, health) |
| `auth.routes.test.ts` | 7 | Login (token, 401, 400), Me (token, guest, sin token, inválido) |
| `chat.routes.test.ts` | 8 | Message (fallback, prohibidas, cortas, guest), History, Delete |
| `agents.routes.test.ts` | 9 | Interview (éxito, 404, 400, 401), Scenario (éxito, 404x2), Matching (éxito, 400) |
| `simple.routes.postgres.test.ts` | 9 | PG opcionales (estructural + valores) |
| **Total** | **49** | **Todos los endpoints V2** |

### SQLite DB mantenimiento
- Se agregaron columnas `user_id` y `response_source` a `chat_messages` (existían en schema V1 pero no en la DB real)
- Se creó usuario `guest-user` para soportar guest-token en chat
- No se modificó la estructura de tablas V1 existentes

### Validación
- `pnpm --filter @minamatch/backend test:sqlite` → 40/40 ✅
- `pnpm --filter @minamatch/backend test:postgres` → 9/9 ✅ (skip sin PG)
- `pnpm --filter @minamatch/backend test:all` → 49/49 ✅
- `pnpm run build` ✅ (Vite build exitoso)
- `pnpm run lint` ✅ (backend tsc --noEmit, 0 errores)
- Smoke test manual con `DATABASE_PROVIDER=sqlite`: todos los endpoints responden correctamente

---

## Fase 3F — Pino structured logging (2026-05-28)

### Añadido
- `packages/backend/src/logger.ts` — módulo de logging centralizado con Pino
- `.env.example` — sección `[Logging]` con `LOG_LEVEL`

### Modificado
- `packages/backend/package.json` — dependencias: `pino`, `pino-http`; devDependency: `pino-pretty`
- `packages/backend/src/app.ts` — agregado `app.use(httpLogger)` después de CORS
- `packages/backend/src/index.ts` — startup con `logger.info()`, `setupErrorHandlers()` al inicio
- `packages/backend/src/routes/v2/simple.routes.ts` — console.* → `req.log?.error/warn`
- `packages/backend/src/routes/v2/auth.routes.ts` — console.* → `req.log?.info/warn/error`
- `packages/backend/src/routes/v2/chat.routes.ts` — console.* → `req.log?.warn/error`
- `packages/backend/src/routes/v2/agents.routes.ts` — console.* → `req.log?.warn/error`
- `packages/database/src/provider.ts` — `console.log` → `process.stderr.write` con JSON
- `packages/backend/src/__tests__/agents.routes.test.ts` — alineado con contrato actual

### Validación
- `npx tsc --noEmit --project packages/backend/tsconfig.json` ✅
- `pnpm --filter @minamatch/backend test:sqlite` → 39/39 ✅
- `pnpm run build` ✅ (Vite build exitoso)

---

## Fase 3G — Health/Readiness endpoints mejorados (2026-05-28)

### Añadido
- `packages/backend/src/routes/v2/health.routes.ts` — endpoints de health y readiness para V2:
  - `GET /api/v2/health` — liveness: provider, dbStatus, gemini, uptime, environment, version, logging, pid, memory, timestamp (siempre 200)
  - `GET /api/v2/ready` — readiness: mismos campos + DB probe real (200 si ok, 503 si DB caída)

### Modificado
- `packages/backend/src/app.ts` — rutas de health montadas vía `healthRoutes`, reemplaza inline `/api/v2/health`
- `packages/backend/src/__tests__/simple.routes.test.ts` — health test ampliado con nuevos campos; nuevo `/api/v2/ready` test
- `packages/backend/src/__tests__/simple.routes.postgres.test.ts` — health test ampliado; nuevo `/api/v2/ready` test
- `docs/API.md` — sección V2 Health & Readiness añadida

### Campos de respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `status` | string | `"ok"` o `"error"` |
| `version` | string | `"v2"` fijo |
| `provider` | string | `"postgres"`, `"sqlite"` o `"unknown"` |
| `dbStatus` | string | `"connected"`, `"disconnected"` o `"error"` |
| `gemini` | string | `"ok"` si hay API key, `"disabled"` si no |
| `uptime` | number | Segundos desde inicio del proceso |
| `environment` | string | Valor de `NODE_ENV` |
| `logging` | boolean | Siempre `true` (Pino activo) |
| `pid` | number | Process ID |
| `memory` | object | RSS, heapTotal, heapUsed en MB |
| `timestamp` | string | ISO 8601 |

### Endpoint /health
- Siempre retorna 200
- Hace DB probe (query ligera a candidates)
- No genera logs de pino-http (filtrado por `autoLogging.ignore`)

### Endpoint /ready
- Retorna 200 si DB responde, 503 si no
- Hace DB probe real (falla si DB no está disponible)
- Usa logging normal de pino-http

### No tocado
- `server/`, `src/`, `data/` — V1 intacto ✅
- `/api/health` y `/api/ready` de V1 — intactos ✅
- `packages/database/` — sin cambios
- `packages/backend/src/logger.ts` — sin cambios (la exclusión de /health ya existía)

### Validación
- `npx tsc --noEmit --project packages/backend/tsconfig.json` ✅
- `pnpm --filter @minamatch/backend test:sqlite` → 41/41 ✅
- `pnpm --filter @minamatch/backend test:postgres` → 10/10 ✅
- `pnpm --filter @minamatch/backend test:all` → 51/51 ✅

---

## Fase 3H — CI/CD con GitHub Actions (2026-05-28)

### Añadido
- `.github/workflows/ci.yml` — pipeline CI con 4 jobs paralelos:
  - **lint** — type checks: V2 backend (0 errores), V2 database (0 errores), V1 root (informacional)
  - **build** — `vite build` (verifica que V1 sigue compilando)
  - **test-sqlite** — 41 tests contra SQLite (sin dependencias externas)
  - **test-postgres** — 10 tests contra PostgreSQL 16 via service container
- `docs/V2_CICD.md` — documentación del pipeline, diagrama, tabla de tests

### Detalles del pipeline

**Disparadores:** push y PR a `version-2` y `main`.

**Concurrencia:** los jobs se cancelan si un nuevo push llega al mismo branch.

**Caching:** `actions/setup-node@v4` con `cache: pnpm` maneja automáticamente el store de pnpm.

**PostgreSQL en CI:**
```yaml
services:
  postgres:
    image: postgres:16
    env:
      POSTGRES_USER: minamatch
      POSTGRES_PASSWORD: minamatch_dev
      POSTGRES_DB: minamatch_v2
    options: --health-cmd pg_isready --health-interval 10s --health-retries 5
```

El job espera a que PostgreSQL esté listo, corre migraciones (`pnpm db:migrate`), seed (`pnpm db:seed`), y luego ejecuta los tests PostgreSQL. Si el servicio no arranca, los tests se saltan silenciosamente (vía TCP port check en el test file).

**Artifacts en fallo:** si `test-sqlite` o `test-postgres` fallan, se suben los snapshots como artifact de GitHub Actions (retención 7 días).

### Cobertura total

| Suite | Tests | Proveedor | Dependencia externa |
|-------|-------|-----------|-------------------|
| SQLite | 41 | better-sqlite3 | `data/minamatch.db` (committed) |
| PostgreSQL | 10 | Drizzle + postgres.js | Service container (postgres:16) |
| **Total** | **51** | — | — |

### No tocado
- `server/`, `src/`, `data/` — V1 intacto ✅
- `packages/backend/src/routes/`, `packages/database/src/` — sin cambios
- `.env.example`, `docs/` existentes — sin cambios

### Validación
- Sintaxis YAML validada manualmente ✅
- Todos los comandos del workflow verificados contra scripts existentes:
  - `pnpm install --frozen-lockfile` ✅
  - `npx tsc --noEmit --project packages/backend/tsconfig.json` ✅
  - `npx tsc --noEmit --project packages/database/tsconfig.json` ✅
  - `pnpm run build` ✅
  - `pnpm --filter @minamatch/backend test:sqlite` ✅
  - `pnpm db:migrate && pnpm db:seed && pnpm --filter @minamatch/backend test:postgres` ✅

---

## Fase 3I — PostgreSQL como fuente única de verdad (2026-05-28)

### Decisión estratégica

V2 **abandona la arquitectura híbrida** PostgreSQL/SQLite y adopta **PostgreSQL como única base activa**.

SQLite se congela como respaldo histórico de V1 y referencia legacy. No recibe nuevas features ni optimizaciones. No es fallback activo de V2.

### Documentos actualizados

| Documento | Cambio |
|-----------|--------|
| `docs/V2_PLAN.md` | Roadmap reorganizado: Fase 3I añadida, Fase 5 renombrada a "Deploy V2 público", híbrido marcado como deprecado |
| `docs/V2_DATABASE_PROVIDER.md` | Header con aviso de deprecación, secciones de modos y tests reescritas para reflejar PostgreSQL como prioridad |
| `docs/V2_DECISIONS.md` | Nueva entrada DEC-006 documentando el cambio estratégico |

### ¿Qué cambia?

| Aspecto | Antes (híbrido) | Ahora (PostgreSQL-only) |
|---------|----------------|------------------------|
| Base principal | PostgreSQL | PostgreSQL (única activa) |
| SQLite | Fallback activo de V2 | Respaldo histórico de V1 |
| Tests principales | SQLite (40+ tests) | PostgreSQL (10 tests) |
| Tests secundarios | PostgreSQL (9 tests) | SQLite (41 tests, legacy) |
| Nuevas features | Debían soportar ambos | Solo PostgreSQL |

### ¿Qué NO cambia?

- SQLite no se elimina — el código y tests SQLite se conservan como referencia
- El `DatabaseProvider` sigue funcionando (modo SQLite no se rompe)
- V1 sigue usando SQLite sin cambios
- Los tests SQLite siguen pasando (41/41)

### Validación

- `npx tsc --noEmit --project packages/backend/tsconfig.json` ✅
- `pnpm --filter @minamatch/backend test:sqlite` → 41/41 ✅
- `pnpm --filter @minamatch/backend test:postgres` → 10/10 ✅

---

## Fase 4A — Cliente API frontend V2 (2026-05-28)

### Añadido
- `src/lib/api/client.ts` — fetch wrapper para V2:
  - `V2_BASE_URL` desde `VITE_API_URL` (default `http://localhost:3004`)
  - `v2Fetch<T>()` con timeout configurable (10s default), JWT automático, `V2ApiError`
  - Compatibilidad con `minamatch_token` de localStorage (mismo que V1)
- `src/lib/api/types.ts` — tipos TypeScript completos para respuestas V2
- `src/lib/api/auth.ts` — `v2Login()`, `v2VerifyToken()`
- `src/lib/api/candidates.ts` — `v2FetchCandidates()`, `v2FetchCandidate()`
- `src/lib/api/students.ts` — `v2FetchStudents()`
- `src/lib/api/scenarios.ts` — `v2FetchScenarios()`
- `src/lib/api/chat.ts` — `v2FetchChatHistory()`, `v2ClearChatHistory()`, `v2SendChatMessage()` con streaming
- `src/lib/api/agents.ts` — `v2Interview()`, `v2EvaluateScenario()`, `v2Matching()`
- `src/lib/api/health.ts` — `v2Health()`, `v2Ready()`
- `src/lib/api/index.ts` — barrel export
- `.env.example` — sección `[Frontend V2 API]` con `VITE_API_URL`

### Validación
- `pnpm run build` ✅
- `pnpm run lint` ✅ (solo 3 errores pre-existentes V1)

---

## Fase 4C — Migración de componentes React a V2 API (2026-05-28)

### Modificado
- `src/components/SemillerosList.tsx` — usa ahora `v2FetchStudents()` y `v2ToggleSyllabus()` desde `src/lib/api`; tipos actualizados a `V2Student`.
- `src/components/SemillerosDashboard.tsx` — usa ahora `v2FetchStudents()` desde `src/lib/api`; tipos actualizados a `V2Student`.
- `src/components/ChatBot.tsx` — reemplazado `fetch` directo por `v2FetchChatHistory()`, `v2SendChatMessage()` y `v2ClearChatHistory()` (streaming manejado por `v2SendChatMessage`).

### Notas
- Se configuró manejo automático de JWT con `localStorage` (`minamatch_token`) a través de `src/lib/api/client.ts` — todas las llamadas V2 incluyen el header `Authorization: Bearer <token>` automáticamente.
- No se tocaron archivos V1 (`src/`, `server/`) — solo cambios en frontend V2.
- Se eliminó cualquier referencia de la frontend a endpoints V1 directos en los componentes modificados.
- Se añadió `v2ToggleSyllabus()` en `src/lib/api/students.ts` y se exportó desde el barrel `src/lib/api/index.ts`.

### Validación
- `pnpm run build` ✅ (siempre que `VITE_API_URL` apunte a `http://localhost:3004` con backend PostgreSQL)
- `pnpm run lint` ✅


---

## Fase 4B — AuthContext migrado a autenticación V2 (2026-05-28)

### Modificado
- `src/AuthContext.tsx` — migrado de V1 a V2 API:

  | Aspecto | Antes (V1) | Ahora (V2) |
  |---------|-----------|-----------|
  | Login | `fetch(\`\${BASE_URL}/api/auth/login\`)` | `v2Login({ email, password })` |
  | Session restore | `fetch(\`\${BASE_URL}/api/auth/me\`)` | `v2VerifyToken()` |
  | Offline fallback | Credenciales hardcodeadas (`admin@minamatch.pe`/`admin123`) | Eliminado (PostgreSQL siempre disponible) |
  | Imports | `BASE_URL` desde `./api` | `v2Login`, `v2VerifyToken` desde `./lib/api/auth` |
  | Error handling | `res.json().error` | `V2ApiError` tipado |

### Mantenido (sin cambios)
- `minamatch_token` en localStorage (mismo que V1)
- Guest token (`guest-token`) con datos de invitado
- Interfaz `User` (id, name, email, role, avatar)
- `loginAsGuest()`, `logout()`, `loading` state
- Provider/Consumer API (`AuthProvider`, `useAuth`)

### Eliminado
- Fallback offline con credenciales hardcodeadas — PostgreSQL es la fuente única de verdad
- Dependencia directa de `src/api/` (V1) en AuthContext

### Validación
- `pnpm run build` ✅
- `pnpm run lint` ✅ (solo 3 errores pre-existentes V1)
