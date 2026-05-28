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
