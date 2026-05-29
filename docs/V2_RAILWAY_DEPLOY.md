# MinaMatch V2 — Railway Deploy Guide

Objetivo: desplegar MinaMatch V2 como un servicio separado en Railway usando PostgreSQL, sin tocar la instacia V1 ya en Railway.

Resumen rápido
- Crear un nuevo servicio en Railway apuntando a la rama `version-2` del repositorio.
- Añadir un plugin PostgreSQL (Railway Postgres) y obtener la connection string `DATABASE_URL`.
- Configurar variables de entorno del servicio según la sección "Variables Railway mínimas".
- Ejecutar migraciones Drizzle y (opcional) `db:seed` como one-off jobs antes de arrancar la app.
- Configurar el comando de inicio para servir el backend V2.

1) Preparar el repositorio (ya en `version-2`)
- Asegúrate de que la rama `version-2` esté empujada a `origin`.
- Railway debe conectar al repo y seleccionar la rama `version-2`.

2) Build / Start (configuración actual del repo)
Railway usa `railway.json` con `builder: DOCKERFILE` y `dockerfilePath: Dockerfile`.

Corrección Fase 5D:
- Antes, `Dockerfile` ejecutaba `pnpm start` y el script raíz `start` apuntaba a `NODE_ENV=production tsx server/index.ts`; por eso Railway arrancaba V1, mostraba `Database: SQLite` y exponía `/api/health`.
- Ahora, el script raíz `start` arranca V2 con `packages/backend/src/index.ts`.
- `railway.json` usa el healthcheck V2: `/api/v2/health`.

Comando final que Railway ejecuta desde el Dockerfile:

```bash
pnpm start
```

Ese comando resuelve a:

```bash
NODE_ENV=production pnpm --filter @minamatch/backend exec tsx src/index.ts
```

El backend V2 escucha en `process.env.PORT || process.env.V2_PORT || 3004`. En Railway debe usar el `PORT` inyectado por la plataforma (normalmente `8080` dentro del contenedor), por lo que no es necesario fijar `V2_PORT` en producción.

3) Endpoints públicos V2 esperados
Con el arranque anterior, el servicio público debe responder en:

```text
GET  /api/v2/health
GET  /api/v2/ready
POST /api/v2/auth/register
POST /api/v2/auth/login
GET  /api/v2/auth/me
```

El backend V2 también puede servir el `dist/` de Vite en producción desde el mismo contenedor si el build generó `dist/index.html`; esto permite usar una sola URL pública para frontend + API.

4) Migraciones Drizzle (one-off)
- Antes de arrancar la app en producción, ejecutar migraciones en la base de datos de Railway (one-off job):

  ```bash
  pnpm db:migrate
  ```

  o explícito (si prefieres filtrar):

  ```bash
  pnpm --filter @minamatch/backend exec -- pnpm db:migrate
  ```

- Comando `db:migrate` usa `packages/database/drizzle.config.ts` y requiere `DATABASE_URL` en env.
- Si necesitas seed inicial (opcional):

  ```bash
  pnpm db:seed
  ```

5) Validación / Healthcheck
- `railway.json` debe mantener `healthcheckPath: /api/v2/health` para confirmar que arrancó V2, no V1.
- Para validar manualmente después de migrar y arrancar:

  ```bash
  curl -sS https://<tu-dominio>.railway.app/api/v2/health | jq .
  curl -sS https://<tu-dominio>.railway.app/api/v2/ready | jq .
  ```

6) Probar registro/login público
- Registro (POST):

  ```bash
  curl -sS -X POST https://<tu-dominio>.railway.app/api/v2/auth/register \
    -H 'Content-Type: application/json' \
    -d '{"name":"Prueba","email":"prueba+railway@example.com","password":"pass1234"}' | jq .
  ```

- Login (POST):

  ```bash
  curl -sS -X POST https://<tu-dominio>.railway.app/api/v2/auth/login \
    -H 'Content-Type: application/json' \
    -d '{"email":"prueba+railway@example.com","password":"pass1234"}' | jq .
  ```

- Obtener perfil (GET /me):

  ```bash
  TOK=<token_obtenido>
  curl -sS -H "Authorization: Bearer $TOK" https://<tu-dominio>.railway.app/api/v2/auth/me | jq .
  ```

7) Variables Railway mínimas (añadir en el panel de Environment variables)
- `DATABASE_PROVIDER=postgres`
- `DATABASE_URL=<railway-postgres-connection-string>`
- `JWT_SECRET=<secreto_seguro_produccion>`
- `NODE_ENV=production`
- `LOG_LEVEL=info`
- `GEMINI_API_KEY=<opcional_si_usas_gemini>`
- `VITE_API_URL=<opcional_si frontend compilado y servido por distinto dominio>`

Nota: preferir same-origin (servir frontend y backend juntos) evita necesidad de `VITE_API_URL`.

8) Puesta en marcha (sugerencia de pasos en Railway)
- Crear nuevo servicio → Conectar repo → seleccionar rama `version-2`.
- Agregar plugin PostgreSQL y esperar la base de datos provisionada.
- Añadir las variables de entorno (poner `DATABASE_URL` obtenido).
- Ejecutar one-off: `pnpm db:migrate` y `pnpm db:seed` (si quieres datos de ejemplo).
- No necesitas override de Start Command si Railway usa el `Dockerfile` y este repo actualizado: `pnpm start` ya arranca V2.
- Iniciar el servicio y observar logs; debe aparecer `MinaMatch V2 API started`, no `Database: SQLite`.
- Validar `GET /api/v2/health` y `GET /api/v2/ready`.

9) Observaciones y límites
- No modificar la instancia V1 en Railway; crear un servicio independiente.
- Asegúrate que `JWT_SECRET` sea distinto al de dev y lo guardes de forma segura.
- Railway compila el frontend con `pnpm run build` en el `Dockerfile`; el backend V2 sirve `dist/` en producción desde `packages/backend/src/app.ts` cuando existe `dist/index.html`.

10) Comandos de validación (local)
- Lint:
  ```bash
  pnpm run lint
  ```
- Build frontend:
  ```bash
  pnpm run build
  ```
- Backend tests:
  ```bash
  pnpm --filter @minamatch/backend run test:all
  ```
- Health / Ready locales:
  ```bash
  curl -sS http://127.0.0.1:3004/api/v2/health | jq .
  curl -sS http://127.0.0.1:3004/api/v2/ready | jq .
  ```

---

Guía corta lista para pegar en Railway como "README" del servicio.
