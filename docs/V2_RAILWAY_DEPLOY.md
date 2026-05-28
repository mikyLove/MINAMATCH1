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

2) Build / Start (recomendación)
Railway usa `railway.json` que indica `builder: DOCKERFILE` y `dockerfilePath: Dockerfile`.
- Usar el `Dockerfile` del repo es válido (construye todo el monorepo y corre `pnpm start` por defecto).
- Sin embargo, el `Dockerfile` por defecto ejecuta `pnpm start` (V1 server: `server/index.ts`). Para exponer V2 en el nuevo servicio tienes dos opciones:

  Opción A (recomendada, sin tocar Dockerfile):
  - En Railway, en la sección "Start Command" del servicio, overridear el comando con:

    ```bash
    pnpm --filter @minamatch/backend exec tsx src/index.ts
    ```

    Esto arranca el backend V2 (`packages/backend/src/index.ts`) en el contenedor.

  Opción B (si prefieres imagen dedicada V2):
  - Crear un `Dockerfile.v2` que establezca `CMD ["pnpm", "--filter", "@minamatch/backend", "exec", "tsx", "src/index.ts"]` y usarlo en `railway.json` o en la configuración del servicio.

3) Comandos exactos para Railway (build & run)
- Build: Railway construirá la imagen según `Dockerfile` (no debes cambiarlo necesariamente).
- Start (override en Railway):

  ```bash
  pnpm --filter @minamatch/backend exec tsx src/index.ts
  ```

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
- `railway.json` tiene `healthcheckPath: /api/health` por defecto; para V2 puedes usar `/api/v2/health` o mantener `/api/health` si tu Dockerfile/entry expone ambos.
- Para validar manualmente (after migration & start):

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
- Configurar Start Command (override): `pnpm --filter @minamatch/backend exec tsx src/index.ts`.
- Iniciar el servicio y observar logs.
- Validar `GET /api/v2/health` y `GET /api/v2/ready`.

9) Observaciones y límites
- No modificar la instancia V1 en Railway; crear un servicio independiente.
- Asegúrate que `JWT_SECRET` sea distinto al de dev y lo guardes de forma segura.
- Si deseas que Railway haga builds estáticos del frontend y lo sirva desde el mismo contenedor, el `Dockerfile` actual ya ejecuta `pnpm run build` (Vite). Asegúrate que el backend V2 sirva `dist` en producción; en `packages/backend/src/index.ts` hay lógica para servir assets si `NODE_ENV=production`.

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
