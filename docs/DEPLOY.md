# Despliegue en Railway

## Requisitos

- Cuenta en [Railway](https://railway.app/) (GitHub login)
- Repositorio de MinaMatch en GitHub

## Paso a Paso

### 1. Preparar el repositorio

Asegúrate de que los siguientes archivos estén commiteados:

- `railway.json` — configuración de build y start
- `package.json` — con scripts `build` y `start`
- `server/index.ts` — sirve el frontend build en producción
- `.env.example` — referencia de variables de entorno

### 2. Conectar el repositorio en Railway

1. Inicia sesión en [Railway](https://railway.app/).
2. Haz clic en **New Project** → **Deploy from GitHub repo**.
3. Selecciona el repositorio de MinaMatch.
4. Railway detectará automáticamente la configuración en `railway.json`.

### 3. Configurar variables de entorno

En el dashboard de Railway, ve a tu proyecto → **Variables** y agrega:

| Variable          | Descripción                                      |
|-------------------|--------------------------------------------------|
| `JWT_SECRET`      | Secreto para firmar tokens JWT (generar uno seguro) |
| `GEMINI_API_KEY`  | API key de Google Gemini (opcional, sin ella funciona offline) |
| `NODE_ENV`        | `production` (Railway lo setea automáticamente)  |

Railway asigna automáticamente `PORT` y expone la URL pública como `RAILWAY_PUBLIC_DOMAIN`.

No es necesario configurar `CORS_ORIGIN` porque en producción el frontend y backend están en el mismo dominio (same-origin).

### 4. Hacer deploy

Railway despliega automáticamente con cada push a la rama conectada.

Para deploy manual:
1. En el dashboard, ve a **Deployments**.
2. Haz clic en **Trigger Deploy**.
3. Railway ejecutará: `npm install` → `npm run build` → `npm start`.

### 5. Verificar

Una vez desplegado, Railway muestra una URL tipo `https://minamatch.up.railway.app`.

Verifica los endpoints:

```bash
# Healthcheck (liveness)
curl https://minamatch.up.railway.app/api/health

# Readiness check
curl https://minamatch.up.railway.app/api/ready

# La app misma
curl https://minamatch.up.railway.app/
```

## Cómo funciona el despliegue

| Fase                | Comando                      | Qué hace                          |
|---------------------|------------------------------|-----------------------------------|
| Install             | `npm install`                | Instala dependencias              |
| Build               | `npm run build`              | Compila el frontend → `dist/`     |
| Start               | `npm start`                  | Arranca Express con `NODE_ENV=production` |

En producción, Express sirve tres cosas:
1. **API REST** — rutas bajo `/api/*`
2. **Frontend estático** — archivos en `dist/` (CSS, JS compilados)
3. **SPA fallback** — cualquier ruta no-API sirve `index.html` para que React maneje el routing

## Variables de Entorno en Producción

| Variable          | ¿Obligatoria? | Default      | Notas                                    |
|-------------------|---------------|--------------|------------------------------------------|
| `PORT`            | No            | `3001`       | Railway asigna automáticamente           |
| `JWT_SECRET`      | **Sí**        | —            | Sin esto el servidor no arranca          |
| `GEMINI_API_KEY`  | No            | —            | Sin key → respuestas simuladas offline   |
| `NODE_ENV`        | No            | `development`| Railway setea `production` automáticamente |

## Dominio Personalizado (opcional)

1. En el dashboard, ve a **Settings** → **Domains**.
2. Agrega un dominio personalizado.
3. Configura el registro CNAME en tu DNS apuntando a `railway.app`.

## Actualizar el despliegue

Cada push a la rama principal (main/master) dispara un nuevo deploy automático.

Para despliegues manuales desde tu máquina local:

```bash
# Usar Railway CLI
npm i -g @railway/cli
railway login
railway up
```
