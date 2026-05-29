# MinaMatch V2 — Bitácora completa del proceso

Fecha de corte: 2026-05-29.

Este documento consolida el trabajo realizado para llevar MinaMatch desde la app V1 desplegada con SQLite hacia una V2 pública con PostgreSQL, registro de usuarios, login JWT y despliegue Railway preparado para demo docente.

## 1. Estado observado en GitHub

Revisión realizada en GitHub público `https://github.com/mikyLove/MINAMATCH1` el 2026-05-29:

- El repositorio es público y pertenece a `mikyLove/MINAMATCH1`.
- La rama por defecto visible en GitHub es `main`.
- GitHub muestra `main` con 12 commits y documentación todavía centrada en V1: Railway con `/api/health`, `/api/ready`, Express + SQLite.
- GitHub muestra una rama activa `version-2`, actualizada el 2026-05-29.
- GitHub muestra `version-2` con 42 commits y con la migración V2 presente: `.github/workflows`, `packages/`, `docker-compose.yml`, `tsconfig.base.json`, `docs/V2_*`, backend V2 y configuración Railway V2.
- En GitHub, el commit más reciente visible de `version-2` es `568bc5b Fase 5D: configurar Railway para arrancar backend V2`.
- En este checkout local, la rama actual es `work` y el último commit local es `8d74317 Fase 5D: configurar Railway para arrancar backend V2 (usar PostgreSQL y health /api/v2/health)`.
- Conclusión: GitHub ya tiene rama `version-2`; `main` conserva V1, y V2 vive en la rama dedicada `version-2`.

## 2. Punto de partida: MinaMatch V1

V1 era una app cliente-servidor en el root del repo:

- Frontend React + Vite en `src/`.
- Backend Express en `server/`.
- Base de datos SQLite en `data/` mediante `better-sqlite3`.
- Deploy Railway orientado a `server/index.ts`.
- Healthchecks V1: `GET /api/health` y `GET /api/ready`.
- Autenticación JWT con credenciales persistidas en SQLite.

V1 se mantuvo como referencia legacy. La regla de migración fue no destruir V1 mientras V2 se construía en paralelo.

## 3. Objetivo funcional de V2

El objetivo final acordado para V2 es que el docente pueda abrir una URL pública desde cualquier dispositivo y:

1. Registrarse con nombre, email y contraseña.
2. Iniciar sesión.
3. Entrar a la plataforma MinaMatch.
4. Refrescar la página y conservar sesión mediante JWT en `localStorage`.
5. Hacer logout y volver a iniciar sesión con el usuario creado.
6. Persistir usuarios y datos en PostgreSQL, no en SQLite.

## 4. Decisión de arquitectura V2

La migración evolucionó hacia un monorepo con pnpm workspaces:

- `packages/shared`: tipos, validadores y constantes compartidas.
- `packages/database`: schema Drizzle, migraciones, repositorios y provider de datos.
- `packages/backend`: backend Express V2 con API versionada.
- `packages/frontend`: espacio reservado para frontend V2 futuro.
- `src/lib/api`: cliente API V2 usado por el frontend actual mientras se completa la migración.

La decisión clave fue que V2 usa PostgreSQL como fuente activa de datos. SQLite queda congelado como legacy V1 y no debe recibir nuevas funcionalidades V2.

## 5. Línea de tiempo del trabajo realizado

### Fase 0A — Infraestructura del monorepo

- Se preparó `pnpm-workspace.yaml` para incluir `packages/*`.
- Se crearon paquetes base `shared`, `database`, `backend` y `frontend`.
- Se agregó `tsconfig.base.json` para configuración TypeScript compartida.
- Se inició documentación V2 en `docs/V2_PLAN.md`.

### Fase 0B — Reglas y decisiones

- Se documentaron reglas de migración en `docs/V2_MIGRATION_RULES.md`.
- Se creó `docs/V2_CHANGELOG.md` como bitácora incremental.
- Se creó `docs/V2_DECISIONS.md` para decisiones técnicas.

### Fase 1 — Shared package

- Se migraron tipos compartidos a `packages/shared`.
- Se movieron validadores Zod y constantes comunes.
- V1 y V2 pudieron importar desde `@minamatch/shared`.

### Fase 2 — Database package

- Se preparó Drizzle ORM para PostgreSQL.
- Se creó schema PostgreSQL para candidatos, entrevistas, estudiantes, syllabus, escenarios, opciones, usuarios y mensajes de chat.
- Se generaron migraciones y seed data.
- Se crearon repositorios tipados para candidatos, estudiantes, chat, usuarios y escenarios.
- Se agregó `docker-compose.yml` para PostgreSQL local.

### Fase 2C — Repositorios y provider

- Se conectaron rutas y servicios a repositorios tipados.
- Se creó un `DatabaseProvider` para desacoplar backend de la base de datos.
- Inicialmente existió soporte híbrido PostgreSQL/SQLite, pero después se decidió congelar SQLite como legacy.

### Fase 3 — Backend Express V2

- Se creó `packages/backend` con Express.
- Se versionó la API bajo `/api/v2` para auth, chat, agentes, health y ready.
- Se conectaron rutas simples para candidatos, estudiantes y escenarios.
- Se agregó logging estructurado con Pino.
- Se agregaron healthchecks V2: `GET /api/v2/health` y `GET /api/v2/ready`.
- Se agregó CI con GitHub Actions.
- Se validaron tests SQLite legacy y tests PostgreSQL.

### Fase 3I — PostgreSQL como fuente única V2

- Se definió que V2 usa PostgreSQL como base activa.
- SQLite se mantiene como respaldo histórico de V1.
- Las variables esperadas para V2 son `DATABASE_PROVIDER=postgres` y `DATABASE_URL` apuntando a PostgreSQL.

### Fase 4A — Cliente API V2

- Se creó `src/lib/api/client.ts` como wrapper fetch V2.
- Se agregaron clientes V2 para auth, candidates, students, scenarios, chat, agents y health.
- Se incorporó `VITE_API_URL` para desarrollo o frontend separado.
- En producción, el cliente V2 puede usar same-origin si frontend y backend están en el mismo servicio.

### Fase 4B — Autenticación frontend V2

- `AuthContext.tsx` se migró a `v2Login`, `v2VerifyToken` y luego `v2Register`.
- El token JWT se guarda como `minamatch_token` en `localStorage`.
- Al refrescar la página, el frontend verifica el token con `GET /api/v2/auth/me`.

### Fase 4C — Pantallas React hacia API V2

- Se migraron componentes principales a clientes V2 donde correspondía.
- Algunas pantallas legacy pueden seguir usando `src/api/client.ts` mientras termina la migración.
- La prioridad de esta etapa fue mantener demo funcional sin refactors grandes.

### Fase 4D / 4E — Validación frontend y backend

- Se validó build frontend.
- Se validó lint TypeScript.
- Se validaron endpoints V2 y registro/login en el backend.
- Se confirmó que la sesión JWT funciona con refresh, logout y login posterior.

### Fase 5 — Registro público y PostgreSQL

- Se agregó `POST /api/v2/auth/register`.
- El registro valida `name`, `email` y `password`.
- El backend evita emails duplicados.
- La contraseña se hashea con bcrypt.
- El rol por defecto es `user`.
- El endpoint devuelve JWT y usuario.
- `POST /api/v2/auth/login` valida credenciales con bcrypt.
- `GET /api/v2/auth/me` devuelve el perfil autenticado usando el JWT.

### Fase 5B — Documentar deploy Railway V2

- Se documentó cómo crear servicio Railway para V2.
- Se listaron variables de entorno necesarias.
- Se documentaron migraciones Drizzle y seed en producción.
- Se aclaró que V1 no debe sobrescribirse hasta validar V2.

### Fase 5C — Preparar V2 pública

- Se documentó el flujo local V2 con PostgreSQL.
- Se aclaró uso de `.env` raíz para V2.
- Se documentó `VITE_API_URL` solo si frontend/backend están separados.
- Se confirmó por código y documentación que registro/login/me funcionan con PostgreSQL y JWT.

### Fase 5D — Corregir Railway para arrancar V2

Railway estaba desplegando V1, no V2. La evidencia fue:

- El start ejecutaba `NODE_ENV=production tsx server/index.ts`.
- Los logs mostraban `Database: SQLite`.
- El healthcheck apuntaba a `/api/health`.

Corrección realizada:

- `pnpm start` ahora arranca `packages/backend/src/index.ts`.
- El backend V2 prioriza `process.env.PORT`, luego `V2_PORT`, luego `3004`.
- `railway.json` usa `/api/v2/health`.
- El `Dockerfile` expone `8080`.
- El backend V2 sirve `dist/` en producción si existe `dist/index.html`.
- El log esperado debe decir `MinaMatch V2 API started`, no `Database: SQLite`.

## 6. Estado actual local

- Rama local actual observada: `work`.
- Último commit local observado: `8d74317 Fase 5D: configurar Railway para arrancar backend V2 (usar PostgreSQL y health /api/v2/health)`.
- El working tree estaba limpio antes de crear esta documentación.
- `origin` no estaba configurado en este checkout al iniciar esta revisión.

## 7. Estado actual GitHub

- `main` sigue existiendo como rama default y representa la app V1 histórica.
- `version-2` existe en GitHub como rama activa.
- `version-2` contiene 42 commits visibles en GitHub.
- El último commit remoto visible de `version-2` es `568bc5b Fase 5D: configurar Railway para arrancar backend V2`.
- No hay PRs abiertos visibles públicamente en el repositorio al momento de la revisión.

## 8. Deploy Railway esperado para V2

Railway debe apuntar a la rama `version-2` y usar el `Dockerfile` del repo.

Comando final efectivo:

```bash
pnpm start
```

Ese comando resuelve a:

```bash
NODE_ENV=production pnpm --filter @minamatch/backend exec tsx src/index.ts
```

Healthcheck final:

```text
/api/v2/health
```

Variables mínimas Railway V2:

```text
DATABASE_PROVIDER=postgres
DATABASE_URL=<URL PostgreSQL Railway>
JWT_SECRET=<secreto_seguro>
NODE_ENV=production
LOG_LEVEL=info
GEMINI_API_KEY=<opcional>
VITE_API_URL=<solo_si_frontend_y_backend_estan_separados>
```

## 9. Endpoints públicos que debe validar la demo

```text
GET  /api/v2/health
GET  /api/v2/ready
POST /api/v2/auth/register
POST /api/v2/auth/login
GET  /api/v2/auth/me
```

Flujo demo:

1. Abrir la URL pública Railway.
2. Crear cuenta nueva.
3. Entrar a la plataforma.
4. Refrescar página.
5. Confirmar que el JWT mantiene sesión.
6. Hacer logout.
7. Loguearse con el mismo usuario.
8. Confirmar en PostgreSQL que el usuario quedó persistido.

## 10. Comandos de validación usados durante el proceso

Comandos recurrentes:

```bash
git status --short --branch
git log --oneline --decorate -10
pnpm run lint
pnpm run build
pnpm --filter @minamatch/backend test
curl http://localhost:3004/api/v2/health
curl http://localhost:3004/api/v2/ready
```

Resultado de la última revisión local de documentación:

- `pnpm run lint` pasó.
- `pnpm run build` pasó con advertencia normal de chunks grandes de Vite.
- `pnpm --filter @minamatch/backend test` no pudo ejecutarse porque en este entorno faltaba `vitest` dentro del workspace backend.

## 11. Riesgos y próximos pasos

Riesgos abiertos:

- La rama local actual puede llamarse `work` aunque GitHub ya tenga `version-2`.
- El hash local de Fase 5D puede no coincidir con el hash remoto si se recreó el commit o se subió desde otro entorno.
- Railway debe seleccionar explícitamente `version-2`, no `main`.
- Si Railway toma `main`, volverá a desplegar V1 con SQLite.
- Si faltan `DATABASE_PROVIDER=postgres` o `DATABASE_URL`, V2 puede no conectar a PostgreSQL como se espera.

Próximos pasos recomendados:

1. Confirmar en Railway que el servicio está conectado a `version-2`.
2. Confirmar variables PostgreSQL en Railway.
3. Ejecutar migraciones Drizzle contra Railway PostgreSQL.
4. Hacer redeploy.
5. Revisar logs: debe aparecer `MinaMatch V2 API started`.
6. Validar `/api/v2/health` y `/api/v2/ready`.
7. Probar registro/login desde un dispositivo externo.
8. Solo después de validar V2, decidir si se mergea `version-2` a `main`.
