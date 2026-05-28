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

## Fases

### Fase 0 — Infraestructura del monorepo (en progreso)
- [x] Crear `packages/` con subdirectorios: `shared/`, `database/`, `frontend/`, `backend/`
- [x] Actualizar `pnpm-workspace.yaml` para incluir `packages/*`
- [x] Crear `tsconfig.base.json` con `strict: true`
- [ ] Confirmar que V1 sigue funcionando (install, build, lint)
- [ ] Documentar el plan en `docs/V2_PLAN.md`

### Fase 1 — shared: tipos y validadores compartidos
- Migrar interfaces de `src/types.ts` a `packages/shared/src/`
- Migrar esquemas Zod de `server/validators.ts` a `packages/shared/src/`
- Migrar constantes de `server/config.ts` a `packages/shared/src/`
- Los packages V1 importarán desde `@minamatch/shared`

### Fase 2 — database: capa de datos
- Configurar Drizzle ORM + PostgreSQL
- Migrar schema de `server/db.ts` a migraciones Drizzle
- Crear seed data para desarrollo
- Migrar consultas a repositorios tipados

### Fase 3 — backend: Express V2
- Nuevo servidor Express en `packages/backend/`
- API versionada (`/api/v2/...`)
- Logger estructurado (Pino)
- Autenticación JWT con refresh tokens
- Tests de integración con Vitest + Supertest
- Runtime: tsx

### Fase 4 — frontend: React V2
- Dividir componentes monolíticos en partes más pequeñas
- Sistema de diseño con componentes base atómicos
- React Router en lugar de tabs manuales
- TanStack Query para data fetching
- Estados de carga/error/vacío consistentes
- Tests con Vitest + Testing Library + Playwright

### Fase 5 — CI/CD + Deploy
- GitHub Actions: lint → typecheck → test → build
- Deploy a Railway (o alternativa) con PostgreSQL
- Healthchecks mejorados

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Romper V1 mientras se desarrolla V2 | No modificar `src/`, `server/` ni `data/` durante las fases iniciales |
| Dependencias duplicadas entre root y packages | Usar pnpm workspaces para hoistear dependencias compartidas |
| Migración larga sin entregas visibles | Dividir en fases pequeñas con validación después de cada una |
| Conflictos en Railway al deployar V2 | V2 se deploya en entorno separado; Railway V1 no se toca |
| Cambios en tipos compartidos rompen frontend/backend | Versionar tipos en `@minamatch/shared` y migrar de a uno |

## Orden recomendado

1. ~~Fase 0~~ ← **estamos aquí**
2. Fase 1 (shared) —移ir tipos y validadores
3. Fase 2 (database) — preparar base de datos
4. Fase 3 (backend) — nuevo backend
5. Fase 4 (frontend) — nuevo frontend
6. Fase 5 (CI/CD) — integrar y deployar

Cada fase debe completarse y verificarse con `pnpm run build` y `pnpm run lint` antes de pasar a la siguiente.
