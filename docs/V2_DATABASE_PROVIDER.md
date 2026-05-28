# MinaMatch V2 — Database Provider (PostgreSQL como fuente única de verdad)

> ⚠️ **Aviso (2026-05-28):** A partir de la Fase 3I, V2 adopta **PostgreSQL como única base activa**. La arquitectura híbrida PostgreSQL/SQLite queda deprecada para V2. SQLite se conserva únicamente como respaldo histórico de V1. Este documento se mantiene como referencia del diseño original.

## Objetivo original

Permitir que MinaMatch V2 funcionara con **PostgreSQL como base principal** y **SQLite como modo offline/demo/fallback**, sin cambiar el código de las rutas Express.

## Estrategia (diseño híbrido — legacy para V2)

Una **capa de abstracción** (`DatabaseProvider`) que expone una interfaz común para todos los repositorios. Las rutas Express V2 nunca llaman directamente a Drizzle o better-sqlite3; siempre lo hacen a través del provider.

```
┌─────────────────────────────────────────────────┐
│                  Express Routes                  │
│  (GET /api/candidates, POST /api/v2/auth, ...)  │
└──────────────────────┬──────────────────────────┘
                       │
               ┌───────▼────────┐
               │   getProvider() │
               │  (singleton)    │
               └───────┬────────┘
                       │
           ┌────────────┬────────────┬────────────┐
           ▼            ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
    │candidates│ │students  │ │users     │ │scenarios │
    │Repo      │ │Repo      │ │Repo      │ │Repo      │
    └──────────┘ └──────────┘ └──────────┘ └──────────┘
           ▲            ▲            ▲            ▲
           │            │            │            │
    ┌──────┴────────────┴────────────┴────────────┴──┐
    │        DatabaseProvider                        │
    │  (interfaz común: ICandidatesRepo,             │
    │   IStudentsRepo, IUsersRepo, IChatRepo,        │
    │   IScenariosRepo)                              │
    └────────────────────────┬───────────────────────┘
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
   ┌────────────┐       ┌───────────┐
   │ PostgreSQL │       │   SQLite  │
   │ (Drizzle)  │       │(better-   │
   │ Producción │       │ sqlite3)  │
   │            │       │ Offline/  │
   │            │       │ Fallback  │
   └────────────┘       └───────────┘
```

## Variable de entorno: `DATABASE_PROVIDER`

| Valor | Comportamiento |
|-------|---------------|
| `postgres` (default) | Usa PostgreSQL via Drizzle ORM |
| `sqlite` | Usa SQLite via better-sqlite3 |

### Determinación automática (fallback)

Si `DATABASE_PROVIDER=postgres` pero PostgreSQL no está disponible (conexión falla), el provider **NO** cambia automáticamente a SQLite (para evitar errores silenciosos en producción).

En desarrollo, si `DATABASE_PROVIDER` no está definido y `DATABASE_URL` no apunta a un PG disponible, se puede forzar `DATABASE_PROVIDER=sqlite`.

## Modos de operación (V2 actual — PostgreSQL-only)

| Modo | DATABASE_PROVIDER | DATABASE_URL | Uso |
|------|-------------------|-------------|-----|
| production | `postgres` (default) | PostgreSQL real | Railway / producción real |
| development | `postgres` (default) | PostgreSQL local | Desarrollo con PG local |
| ~~sqlite~~ | ~~`sqlite`~~ | ~~—~~ | ~~Ya no es fallback activo de V2~~ |

### Legacy: SQLite para V1

SQLite (`data/minamatch.db`) sigue siendo la base de datos de V1. Se conserva para:
- **Referencia**: el pipeline CI aún ejecuta 41 tests SQLite para verificar que V2 no rompe el formato legacy
- **Historia**: los datos de V1 se mantienen accesibles
- **Migración manual**: si se necesita migrar datos de V1 a V2, SQLite es la fuente

## Archivos creados

| Archivo | Propósito |
|---------|-----------|
| `packages/database/src/provider.types.ts` | Interfaces comunes (`ICandidatesRepo`, `IStudentsRepo`, `IUsersRepo`, `IChatRepo`, `IScenariosRepo`, `DatabaseProvider`) |
| `packages/database/src/provider.ts` | Factory `createProvider()` + singleton `getProvider()` |
| `packages/database/src/sqlite/client.ts` | Cliente SQLite (conexión a `data/minamatch.db`) |
| `packages/database/src/sqlite/candidates.repository.ts` | Implementación SQLite de `ICandidatesRepo` |
| `packages/database/src/sqlite/students.repository.ts` | Implementación SQLite de `IStudentsRepo` |
| `packages/database/src/sqlite/users.repository.ts` | Implementación SQLite de `IUsersRepo` |
| `packages/database/src/sqlite/chat.repository.ts` | Implementación SQLite de `IChatRepo` |
| `packages/database/src/sqlite/scenarios.repository.ts` | Implementación SQLite de `IScenariosRepo` |
| `packages/database/src/sqlite/index.ts` | Barrel export |
| `packages/database/src/repositories/candidates.repository.ts` | Implementación PostgreSQL de `ICandidatesRepo` (Drizzle) |
| `packages/database/src/repositories/students.repository.ts` | Implementación PostgreSQL de `IStudentsRepo` (Drizzle) |
| `packages/database/src/repositories/users.repository.ts` | Implementación PostgreSQL de `IUsersRepo` (Drizzle) |
| `packages/database/src/repositories/chat.repository.ts` | Implementación PostgreSQL de `IChatRepo` (Drizzle) |
| `packages/database/src/repositories/scenarios.repository.ts` | Implementación PostgreSQL de `IScenariosRepo` (Drizzle) |

## ¿Por qué mantener SQLite? (a partir de Fase 3I)

1. **Compatibilidad V1**: `data/minamatch.db` contiene los datos históricos de V1
2. **Referencia de migración**: los tests SQLite verifican que el formato no se rompe
3. **No eliminamos código funcional**: el provider híbrido ya existe y funciona; eliminarlo no aporta valor

SQLite **ya no es**:
- ❌ Fallback activo de V2
- ❌ Modo offline para desarrollo V2
- ❌ Fuente de datos para nuevas features de V2

## Tests de integración (V2 actual)

A partir de Fase 3I, **PostgreSQL es la suite principal**. SQLite se mantiene como verificación legacy.

### PostgreSQL (10 tests — prioritarios)
```bash
pnpm --filter @minamatch/backend test:postgres
```
- Se ejecutan en CI con service container PostgreSQL 16
- Verifican la base activa de V2
- Tests estructurales + valores específicos contra el seed
- Requieren: PostgreSQL corriendo + `pnpm db:migrate` + `pnpm db:seed`

### SQLite (41 tests — legacy)
```bash
pnpm --filter @minamatch/backend test:sqlite
```
- Tests contra `data/minamatch.db` (V1 legacy)
- Sin dependencias externas
- Se mantienen para verificar que V2 no rompe el formato V1
- **No bloquean** el desarrollo de nuevas features

### Ambos (validación completa)
```bash
pnpm --filter @minamatch/backend test:all    # 51 tests total (41 SQLite + 10 PostgreSQL)
```

### Cobertura completa

| Suite | Tests | Provider | Prioridad |
|-------|-------|----------|-----------|
| SQLite (5 test files) | 41 | better-sqlite3 | Legacy |
| PostgreSQL (1 test file) | 10 | Drizzle + postgres.js | **Alta** |
| **Total** | **51** | — | — |

> El comando `pnpm test:all` ejecuta ambas suites secuencialmente.
