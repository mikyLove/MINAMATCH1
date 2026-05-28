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
