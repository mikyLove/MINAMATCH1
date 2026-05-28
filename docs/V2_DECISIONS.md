# MinaMatch V2 — Decisiones Técnicas

## Formato

Cada decisión registra: contexto, alternativa considerada, decisión tomada y consecuencia.

---

### DEC-001: Monorepo con pnpm workspaces

**Contexto**: V1 tiene frontend y backend en un solo package.json sin separación. Necesitamos preparar V2 sin romper V1.

**Alternativas**:
1. Repositorio separado para V2 — pierde historia compartida y aumenta complejidad
2. Monorepo con Nx/Turborepo — sobreingeniería para el tamaño actual

**Decisión**: Usar pnpm workspaces con `packages/*`. El root sigue siendo V1; los nuevos workspaces son V2.

**Consecuencia**: `pnpm install -w` para dependencias del root, `pnpm --filter` para packages. Zero configuración extra.

---

### DEC-002: strict: true desde el inicio

**Contexto**: V1 usa TypeScript sin modo estricto. Para V2 queremos máxima seguridad de tipos.

**Decisión**: `tsconfig.base.json` con `strict: true` y `noUncheckedIndexedAccess: true`. Cada package extiende de esta base.

**Consecuencia**: Más tipos explícitos, menos bugs de `undefined`. Puede requerir más anotaciones al migrar código.

---

### DEC-003: docs/ como documentación V2

**Contexto**: V1 tiene `docs/` con ARCHITECTURE.md, API.md, DEPLOY.md, SECURITY.md.

**Decisión**: Reutilizar `docs/` para toda la documentación V2. Los archivos V1 existentes no se modifican; los nuevos siguen prefijo `V2_`.

**Consecuencia**: Un solo lugar para toda la documentación del proyecto. Fácil de encontrar.

---

### DEC-004: packages vacíos con package.json mínimo

**Contexto**: Necesitamos que pnpm reconozca los workspaces pero el código V2 aún no existe.

**Decisión**: Cada package tiene `package.json` con `"private": true`, `"type": "module"`, y `exports` que apuntan a `./src/index.ts` (archivo vacío por ahora).

**Consecuencia**: Los imports desde `@minamatch/*` serán válidos desde el momento en que se creen los archivos. No hay que modificar package.json después.

---

### DEC-005: src-v2/ y diagramas-v2/ se quedan como están

**Contexto**: Existen directorios `src-v2/` y `diagramas-v2/` vacíos de intentos anteriores.

**Decisión**: No tocarlos. Todo el código V2 nuevo va en `packages/`. Estos directorios se eliminarán al final de la migración si quedan vacíos.

**Consecuencia**: Evitamos confusión entre `src-v2/` y `packages/frontend/`.
