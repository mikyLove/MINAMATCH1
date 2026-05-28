# MinaMatch V2 — Plan de Migración

## Diagnóstico de V1

| Problema | Impacto | Prioridad |
|---|---|---|
| Monolito frontend + backend en un solo package.json | Difícil escalar y mantener | Alta |
| Sin tests (cero dependencias de testing) | Riesgo alto de regresiones | Alta |
| SQLite en producción | No escala, sin migraciones, sin concurrencia | Alta |
| Guest-token como modo auth | Inseguro, no profesional | Alta |
| Componentes monolíticos (LandingPage 992 líneas, MatchingShortlist 651) | Difícil mantener y reutilizar | Media |
| Sin CI/CD (solo Railway deploy) | Sin calidad garantizada | Alta |
| Sin versionado de API | Breaking changes afectan a clientes | Media |
| URLs hardcodeadas en frontend | Frágil en distintos entornos | Media |
| Sin sistema de diseño | Inconsistencias UI | Media |
| Backend sin logging estructurado | Difícil debuggear en producción | Media |
| Bug en `agents.ts`: referencia a `aiModel` inexistente | Error runtime si Gemini está configurado | Alta |

## Scripts actuales (package.json raíz)

| Script | Comando | Propósito |
|---|---|---|
| `dev` | `concurrently "vite --port=3000" "tsx server/index.ts"` | Frontend + backend simultáneo |
| `dev:frontend` | `vite --port=3000 --host=0.0.0.0` | Solo frontend |
| `dev:backend` | `tsx server/index.ts` | Solo backend |
| `build` | `vite build` | Build frontend para producción |
| `start` | `NODE_ENV=production tsx server/index.ts` | Producción: API + dist/ |
| `preview` | `vite preview` | Preview del build |
| `clean` | `rm -rf dist server.js` | Limpiar artefactos |
| `lint` | `tsc --noEmit` | Type check |

> Nota: `pnpm install` y `pnpm run build` se usan como validación en cada fase.
> `pnpm run lint` tiene 3 errores pre-existentes en `LandingPage.tsx` (líneas 223, 259, 886) que no fueron causados por V2.

## Fases

### Fase 0A — Infraestructura del monorepo ✅
- [x] Crear `packages/` con subdirectorios: `shared/`, `database/`, `frontend/`, `backend/`
- [x] Actualizar `pnpm-workspace.yaml` para incluir `packages/*`
- [x] Crear `tsconfig.base.json` con `strict: true`
- [x] Crear `docs/V2_PLAN.md`
- [x] Validar: install, build, lint, git status

### Fase 0B — Documentación de límites ✅
- [x] Crear `docs/V2_MIGRATION_RULES.md` — reglas de qué tocar y qué no
- [x] Crear `docs/V2_CHANGELOG.md` — registro de avances
- [x] Crear `docs/V2_DECISIONS.md` — decisiones técnicas documentadas
- [x] Actualizar `docs/V2_PLAN.md` — agregar Fase 0B, scripts, progreso
- [x] Validar: install, build, git status

### Fase 1 — shared: tipos y validadores compartidos
- Migrar interfaces de `src/types.ts` a `packages/shared/src/`
- Migrar esquemas Zod de `server/validators.ts` a `packages/shared/src/`
- Migrar constantes de `server/config.ts` a `packages/shared/src/`
- Los packages V1 importarán desde `@minamatch/shared`

### Fase 2 — database: capa de datos ✅
- [x] Configurar Drizzle ORM + PostgreSQL
- [x] Migrar schema de `server/db.ts` a migraciones Drizzle
- [x] Crear seed data para desarrollo
- [x] Migrar consultas a repositorios tipados
- [x] Arquitectura híbrida PostgreSQL/SQLite (DatabaseProvider)
- [x] Interfaces comunes (`ICandidatesRepo`, `IStudentsRepo`, `IUsersRepo`, `IChatRepo`, `IScenariosRepo`)
- [x] Express V2 conectado al provider (todas las rutas)

### Fase 3 — backend: Express V2 ✅
- [x] Nuevo servidor Express en `packages/backend/`
- [x] API versionada (`/api/v2/...`)
- [ ] Logger estructurado (Pino) — pendiente
- [x] Autenticación JWT funcionando
- [x] Todas las rutas conectadas al DatabaseProvider:
  - `GET /api/candidates`, `/api/candidates/:id`
  - `GET /api/students`
  - `GET /api/scenarios`
  - `POST /api/v2/auth/login`, `GET /api/v2/auth/me`
  - `POST /api/v2/chat/message`, `GET /api/v2/chat/history`, `DELETE /api/v2/chat/history`
  - `POST /api/v2/agents/interview`, `/evaluate-scenario`, `/matching`
- [x] Modo híbrido PostgreSQL / SQLite según `DATABASE_PROVIDER`
- [x] Gemini opcional con fallback a respuestas simuladas
- [x] Tests de integración (40 SQLite + 9 PostgreSQL = 49 tests)
- [x] Runtime: tsx

### Fase 4 — frontend: React V2 ❌
- [ ] Dividir componentes monolíticos en partes más pequeñas
- [ ] Sistema de diseño con componentes base atómicos
- [ ] React Router en lugar de tabs manuales
- [ ] TanStack Query para data fetching
- [ ] Estados de carga/error/vacío consistentes
- [ ] Tests con Vitest + Testing Library + Playwright

### Fase 5 — CI/CD + Deploy ❌
- [ ] GitHub Actions: lint → typecheck → test → build
- [ ] Deploy a Railway (o alternativa) con PostgreSQL
- [ ] Healthchecks mejorados

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Romper V1 mientras se desarrolla V2 | No modificar `src/`, `server/` ni `data/` durante las fases iniciales |
| Dependencias duplicadas entre root y packages | Usar pnpm workspaces para hoistear dependencias compartidas |
| Migración larga sin entregas visibles | Dividir en fases pequeñas con validación después de cada una |
| Conflictos en Railway al deployar V2 | V2 se deploya en entorno separado; Railway V1 no se toca |
| Cambios en tipos compartidos rompen frontend/backend | Versionar tipos en `@minamatch/shared` y migrar de a uno |

## Orden recomendado

1. ~~Fase 0A — Infraestructura del monorepo~~
2. ~~Fase 0B — Documentación de límites~~
3. ~~Fase 1 (shared) — tipos y validadores~~
4. ~~Fase 2 (database) — capa de datos~~
5. ~~Fase 3 (backend) — nuevo backend~~ ← **completada** (incluye Fase 3F: Pino logging, Fase 3G: Health/Readiness)
6. Fase 4 (frontend) — nuevo frontend ← **siguiente**
7. Fase 5 (CI/CD) — integrar y deployar

Cada fase debe completarse y verificarse con `pnpm run build` y `pnpm run lint` antes de pasar a la siguiente.
