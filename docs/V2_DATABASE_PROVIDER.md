# MinaMatch V2 — Database Provider (Híbrido PostgreSQL/SQLite)

## Objetivo

Permitir que MinaMatch V2 funcione con **PostgreSQL como base principal** y **SQLite como modo offline/demo/fallback**, sin cambiar el código de las rutas Express.

## Estrategia

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
          ┌────────────┼────────────┐
          ▼            ▼            ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │candidates│ │students  │ │users     │
   │Repo      │ │Repo      │ │Repo      │
   └──────────┘ └──────────┘ └──────────┘
          ▲            ▲            ▲
          │            │            │
   ┌──────┴────────────┴────────────┴──┐
   │        DatabaseProvider           │
   │  (interfaz común: ICandidatesRepo,│
   │   IStudentsRepo, IUsersRepo,      │
   │   IChatRepo)                      │
   └────────────────┬──────────────────┘
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

## Modos de operación

| Modo | DATABASE_PROVIDER | DATABASE_URL | Uso |
|------|-------------------|-------------|-----|
| production | `postgres` | PostgreSQL real | Railway / producción real |
| development-full | `postgres` | PostgreSQL local | Desarrollo con PG local |
| development-offline | `sqlite` | — | Desarrollo sin PostgreSQL |
| demo-local | `sqlite` | — | Demostraciones locales |
| fallback | `sqlite` | — | Cuando PG no está disponible |

## Archivos creados

| Archivo | Propósito |
|---------|-----------|
| `packages/database/src/provider.types.ts` | Interfaces comunes (`ICandidatesRepo`, `IStudentsRepo`, `IUsersRepo`, `IChatRepo`, `DatabaseProvider`) |
| `packages/database/src/provider.ts` | Factory `createProvider()` + singleton `getProvider()` |
| `packages/database/src/sqlite/client.ts` | Cliente SQLite (conexión a `data/minamatch.db`) |
| `packages/database/src/sqlite/candidates.repository.ts` | Implementación SQLite de `ICandidatesRepo` |
| `packages/database/src/sqlite/students.repository.ts` | Implementación SQLite de `IStudentsRepo` |
| `packages/database/src/sqlite/users.repository.ts` | Implementación SQLite de `IUsersRepo` |
| `packages/database/src/sqlite/chat.repository.ts` | Implementación SQLite de `IChatRepo` |
| `packages/database/src/sqlite/index.ts` | Barrel export |

## ¿Por qué mantener SQLite?

1. **Offline local**: desarrolladores pueden trabajar sin PostgreSQL
2. **Demostraciones rápidas**: zero setup para mostrar la app
3. **Fallback**: si PostgreSQL se cae, SQLite mantiene la app funcional
4. **Compatibilidad V1**: el archivo `data/minamatch.db` de V1 se reutiliza

## Pendiente para Fase 2D o posterior

- Conectar las rutas Express V2 al provider (actualmente usan `chatRepo`, `candidatesRepo` directamente)
- Migrar las rutas V2 para usar `getProvider().candidates.findAll()` en lugar de `candidatesRepo.findAll()`
- Estrategia de sincronización entre PostgreSQL y SQLite
