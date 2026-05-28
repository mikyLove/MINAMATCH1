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
- [x] ~~Arquitectura híbrida PostgreSQL/SQLite (DatabaseProvider)~~ — deprecado para V2
- [x] Interfaces comunes (`ICandidatesRepo`, `IStudentsRepo`, `IUsersRepo`, `IChatRepo`, `IScenariosRepo`)
- [x] Express V2 conectado al provider (todas las rutas)

### Fase 3 — backend: Express V2 ✅
- [x] Nuevo servidor Express en `packages/backend/`
- [x] API versionada (`/api/v2/...`)
- [x] Logger estructurado (Pino)
- [x] Autenticación JWT funcionando
- [x] Todas las rutas conectadas al DatabaseProvider:
  - `GET /api/candidates`, `/api/candidates/:id`
  - `GET /api/students`
  - `GET /api/scenarios`
  - `POST /api/v2/auth/login`, `GET /api/v2/auth/me`
  - `POST /api/v2/chat/message`, `GET /api/v2/chat/history`, `DELETE /api/v2/chat/history`
  - `POST /api/v2/agents/interview`, `/evaluate-scenario`, `/matching`
- [x] Health/Readiness endpoints mejorados (`/api/v2/health`, `/api/v2/ready`)
- [x] CI/CD con GitHub Actions
- [x] ~~Modo híbrido PostgreSQL/SQLite~~ — deprecado, V2 usa PostgreSQL exclusivamente
- [x] Gemini opcional con fallback a respuestas simuladas
- [x] Tests de integración (41 SQLite legacy + 10 PostgreSQL = 51 tests)
- [x] Runtime: tsx

### Fase 3I — PostgreSQL como fuente única de verdad ✅
- [x] Decisión: V2 migra a PostgreSQL como única base activa
- [x] SQLite queda como respaldo histórico de V1 solamente
- [x] Tests PostgreSQL son la prioridad (10 tests)
- [x] Tests SQLite mantenidos como legacy (41 tests, no bloqueantes)
- [x] Provider híbrido no recibe nuevas mejoras
- [x] Documentación actualizada (DB_PROVIDER, DECISIONS, PLAN, CHANGELOG)

### Fase 4 — frontend: React V2 ❌
- [ ] Dividir componentes monolíticos en partes más pequeñas
- [ ] Sistema de diseño con componentes base atómicos
- [ ] React Router en lugar de tabs manuales
- [ ] TanStack Query para data fetching
- [ ] Estados de carga/error/vacío consistentes
- [ ] Tests con Vitest + Testing Library + Playwright

### Fase 5 — Deploy V2 público ❌
- [ ] Preparar entorno Railway con PostgreSQL
- [ ] Migrar V2 a producción
- [ ] CI/CD pipeline completo con deploy automático
- [ ] Healthchecks + monitoreo
- [ ] Corte final de V1 (una vez V2 estable en producción)

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Romper V1 mientras se desarrolla V2 | No modificar `src/`, `server/` ni `data/` durante las fases iniciales |
| Dependencias duplicadas entre root y packages | Usar pnpm workspaces para hoistear dependencias compartidas |
| Migración larga sin entregas visibles | Dividir en fases pequeñas con validación después de cada una |
| Conflictos en Railway al deployar V2 | V2 se deploya en entorno separado; Railway V1 no se toca |
| Cambios en tipos compartidos rompen frontend/backend | Versionar tipos en `@minamatch/shared` y migrar de a uno |

## Cambio estratégico (Fase 3I — 2026-05-28)

A partir de la Fase 3I, V2 **abandona la arquitectura híbrida** PostgreSQL/SQLite y adopta **PostgreSQL como única base activa**. Este cambio responde a:

- **Simplicidad**: una base de datos, un schema, un provider
- **Rendimiento**: PostgreSQL nativo supera a SQLite en concurrencia y escalabilidad
- **Producción**: Railway despliega con PostgreSQL, no SQLite
- **Mantenibilidad**: menos código, menos tests, menos configuraciones

### ¿Qué cambia?
| Aspecto | Antes (híbrido) | Ahora (PostgreSQL-only) |
|---------|----------------|------------------------|
| Base principal | PostgreSQL | PostgreSQL |
| SQLite | Fallback activo de V2 | Solo respaldo histórico de V1 |
| Tests principales | SQLite (40 tests) | PostgreSQL (10 tests) |
| Tests secundarios | PostgreSQL (9 tests) | SQLite (41 tests, legacy) |
| Provider | Provider híbrido | Provider con PostgreSQL por defecto |
| Nuevas features | Debían soportar ambos | Solo PostgreSQL |

### ¿Qué NO cambia?
- SQLite no se elimina — el código y los tests SQLite se conservan como referencia legacy
- El `DatabaseProvider` sigue funcionando (el modo SQLite no se rompe)
- V1 sigue usando SQLite sin cambios
- Los tests SQLite siguen pasando (41/41)

## Orden recomendado

1. ~~Fase 0A — Infraestructura del monorepo~~
2. ~~Fase 0B — Documentación de límites~~
3. ~~Fase 1 (shared) — tipos y validadores~~
4. ~~Fase 2 (database) — capa de datos~~
5. ~~Fase 3 (backend) — nuevo backend~~ ← **completada** (incluye F3F: Pino, F3G: Health, F3H: CI/CD)
6. ~~Fase 3I — PostgreSQL como fuente única de verdad~~ ← **completada**
7. Fase 4 (frontend) — nuevo frontend V2 ← **siguiente**
8. Fase 5 (deploy) — deploy V2 público con PostgreSQL ← **pendiente**

Cada fase debe completarse y verificarse con `pnpm run build` y `pnpm run lint` antes de pasar a la siguiente.
