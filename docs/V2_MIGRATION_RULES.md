# MinaMatch V2 — Reglas de Migración

## Principio fundamental

V1 (src/, server/, data/) debe seguir funcionando inalterada durante todo el desarrollo de V2. **Si V1 se rompe, se detiene la migración hasta restaurarla.**

## Zonas

### 🟢 Zona verde — se puede modificar sin restricciones
- `packages/*` — nuevo código V2
- `docs/*` — documentación
- `tsconfig.base.json` — configuración base compartida
- `pnpm-workspace.yaml` — workspaces del monorepo

### 🟡 Zona amarilla — modificar solo si es estrictamente necesario
- `package.json` raíz — añadir scripts, pero no cambiar los existentes
- `tsconfig.json` raíz — extender de `tsconfig.base.json` si no rompe V1
- `pnpm-lock.yaml` — se actualiza automáticamente con `pnpm install`

### 🔴 Zona roja — NO TOCAR
- `src/*` — frontend V1
- `server/*` — backend V1
- `data/*` — base de datos SQLite
- `vite.config.ts` — configuración de build V1
- `Dockerfile` — deploy V1
- `railway.json` — configuración Railway V1
- `.vercel/*` — deploy Vercel V1
- `index.html` — entry point HTML V1
- `dist/`, `out/`, `node_modules/` — artefactos de build
- `diagramas/` — diagramas V1
- `src-v2/`, `diagramas-v2/` — reservados para migración futura

## Cómo validar cada fase

Después de cada cambio:

```bash
pnpm install          # 1. Sin errores de resolución de workspaces
pnpm run build        # 2. Vite build exitoso (frontend V1)
pnpm run lint         # 3. tsc --noEmit sin errores NUEVOS
git status            # 4. Solo archivos esperados modificados
```

Si alguna validación falla:

```bash
git diff              # Ver exactamente qué cambió
git restore <archivo> # Revertir archivo problemático
```

Los errores de lint pre-existentes de V1 en `LandingPage.tsx` (líneas 223, 259, 886) se ignoran — no fueron causados por V2.

## Cómo hacer rollback

```bash
# Revertir todo a último commit
git restore .

# Revertir archivos específicos
git restore docs/V2_PLAN.md
git restore pnpm-workspace.yaml

# Descartar cambios no staged
git checkout -- <archivo>

# Si ya se hizo commit
git revert HEAD
```

## Reglas de estilo para código V2

- TypeScript strict mode (`strict: true`)
- Preferir `type` sobre `interface` para tipos compartidos
- Zod schemas en archivos `.schema.ts`
- Tests junto al código: `*.test.ts` / `*.spec.ts`
- Sin default exports
- Imports con ruta completa desde `@minamatch/*`
