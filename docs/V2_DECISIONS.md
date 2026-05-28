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

---

### DEC-006: PostgreSQL como fuente única de verdad para V2 (2026-05-28)

**Contexto**: V2 se construyó inicialmente con una arquitectura híbrida PostgreSQL/SQLite mediante el `DatabaseProvider`. Tras completar las fases 0-3, se decide que mantener dos motores de base de datos para V2 añade complejidad innecesaria sin beneficio real para el despliegue en producción.

**Alternativas consideradas**:
1. Mantener el híbrido — más código, más tests, más configuraciones que mantener
2. Eliminar SQLite completamente ahora — riesgo alto, el código híbrido funciona y no estorba
3. Congelar el híbrido y priorizar PostgreSQL — **seleccionada**

**Decisión**: A partir de ahora, V2 usa **PostgreSQL como única base activa**. SQLite se congela como:
- Respaldo histórico de V1 (data/minamatch.db)
- Referencia legacy (tests SQLite se mantienen pero no bloquean)
- No recibe nuevas features ni optimizaciones
- No es fallback activo de V2

**Consecuencia**:
- Nuevas features se prueban solo contra PostgreSQL (tests postgres son la prioridad)
- Tests SQLite se ejecutan en CI como verificación de que V1 sigue intacto
- El provider híbrido no se elimina (código funcional que no estorba)
- Roadmap se simplifica: una base, un schema, un provider
