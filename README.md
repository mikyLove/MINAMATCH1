# MinaMatch Puno

Plataforma de matching de talento minero para operaciones de gran altitud (+4500 msnm) en Puno, Perú.

**Estado del deploy**: ✅ **En producción — Railway** (`/api/health` OK, `/api/ready` OK, JWT funcional)

## Arquitectura

Cliente-servidor con React + Vite (frontend) y Express + SQLite (backend). El frontend se comunica con el backend vía REST API. La autenticación usa JWT.

```
Browser → React (Vite) → HTTP (localhost:3001 / Railway) → Express → SQLite
                                                                      → Gemini API
```

## Stack Tecnológico

| Capa         | Tecnología                          |
|--------------|-------------------------------------|
| Frontend     | React 19, TypeScript, Vite, Tailwind 4, Lucide React, Motion |
| Backend      | Express 4, TypeScript, tsx (runtime) |
| Base de Datos| SQLite (better-sqlite3)             |
| IA           | Google Gemini (`@google/genai`)     |
| Autenticación| JWT (jsonwebtoken), bcryptjs        |
| Validación   | Zod 4                               |
| Seguridad    | Helmet, CORS, express-rate-limit    |
| PDF          | jsPDF (reportes de resultados)      |
| Contenedor   | Docker + Railway                    |

## Estructura de Carpetas

```
├── src/                          # Frontend React
│   ├── api/                      #  Capa de API (client, auth, candidates, chat, students)
│   │   ├── client.ts             #  apiFetch wrapper, localStorage helpers
│   │   ├── auth.ts               #  loginRequest, verifyToken
│   │   ├── candidates.ts         #  fetchCandidates
│   │   ├── chat.ts               #  sendMessageStream, fetchHistory
│   │   ├── students.ts           #  fetchStudents, toggleSyllabus
│   │   └── index.ts              #  Barrel exports
│   ├── components/               #  Componentes React
│   │   ├── LandingPage.tsx       #  Landing page corporativa
│   │   ├── Login.tsx             #  Formulario de inicio de sesión
│   │   ├── Header.tsx            #  Encabezado de la app
│   │   ├── BottomNav.tsx         #  Navegación inferior tipo tabs
│   │   ├── Toast.tsx             #  Sistema de notificaciones toast
│   │   ├── ErrorBoundary.jsx     #  Captura de errores React
│   │   ├── BuscadorTalento.tsx   #  Buscador de talento minero
│   │   ├── ChatBot.tsx           #  Chat IA con streaming
│   │   ├── MatchingShortlist.tsx #  Lista corta de matching
│   │   ├── SemillerosDashboard.tsx # Dashboard semilleros
│   │   ├── SemillerosList.tsx    #  Lista de estudiantes
│   │   └── ScenarioAssessment.tsx # Evaluación de escenarios
│   ├── minatalent/               #  Suite de tests MinaTalent
│   │   ├── MinaTalentApp.tsx     #  App principal de tests
│   │   ├── MinaTalentLanding.tsx #  Landing de la suite
│   │   ├── BigFiveTest.tsx       #  Test Big Five (personalidad)
│   │   ├── DiscTest.tsx          #  Test DISC
│   │   ├── HoganTest.tsx         #  Test Hogan
│   │   ├── WonderlicTest.tsx     #  Test Wonderlic (cognitivo)
│   │   ├── IntegridadTest.tsx    #  Test de integridad
│   │   ├── FitSocialRadar.tsx    #  Radar de ajuste social
│   │   ├── FitSocialTest.tsx     #  Test de ajuste social
│   │   ├── ResultDashboard.tsx   #  Dashboard de resultados
│   │   ├── PdfReport.ts          #  Generación de PDF (jsPDF)
│   │   ├── questions.ts          #  Banco de preguntas
│   │   └── scoring.ts            #  Lógica de puntuación
│   ├── AuthContext.tsx           #  Estado global de autenticación
│   ├── ThemeContext.tsx          #  Contexto de tema claro/oscuro
│   ├── types.ts                  #  Interfaces TypeScript
│   ├── data.ts                   #  Mock data (fallback offline)
│   └── App.tsx                   #  Entry point principal
├── server/                       # Backend Express
│   ├── routes/                   #  Rutas Express
│   │   ├── auth.ts               #  POST /api/auth/login, GET /api/auth/me
│   │   ├── agents.ts             #  POST /api/agents/interview, /evaluate-scenario, /matching
│   │   ├── chat.ts               #  POST /api/chat (streaming), GET|DELETE /api/chat/history
│   │   ├── candidates.ts         #  GET /api/candidates, GET /api/candidates/:id
│   │   ├── students.ts           #  GET /api/students, PUT /api/students/:id/syllabus/:courseId
│   │   └── scenarios.ts          #  GET /api/scenarios
│   ├── services/
│   │   └── gemini.ts             #  Cliente GoogleGenAI compartido, modelos
│   ├── authMiddleware.ts         #  JWT verification + guest-token support
│   ├── db.ts                     #  SQLite init + schema + seed data
│   ├── validators.ts             #  Esquemas Zod
│   ├── errorHandler.ts           #  AppError + middleware Express
│   ├── config.ts                 #  Constantes (AI_CONFIG)
│   └── index.ts                  #  Entry point Express (incluye health/ready)
├── docs/                         # Documentación técnica
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOY.md
│   └── SECURITY.md
├── Dockerfile                    # Build para Railway
├── railway.json                  # Config Railway (Dockerfile, healthcheck)
├── .env.example                  # Variables de entorno
└── package.json                  # Dependencias unificadas
```

## Variables de Entorno

Crear `server/.env` (el backend lo carga desde su propio directorio):

```env
PORT=3001
GEMINI_API_KEY="tu_api_key_de_gemini"
JWT_SECRET="secreto_para_firmar_tokens"
CORS_ORIGIN="http://localhost:3000"
```

## Notas para V2 (local y Railway)

- Local (desarrollo V2): crear `server/.env.local` o exportar variables antes de arrancar el backend V2:

```env
DATABASE_PROVIDER=postgres
DATABASE_URL=postgres://<user>:<pass>@127.0.0.1:5433/minamatch_v2
JWT_SECRET="secreto_local_v2"
V2_PORT=3004
GEMINI_API_KEY="tu_api_key_de_gemini"
```

- Railway (producción V2): configurar variables en el servicio Railway para la nueva instancia V2. Variables mínimas:

```text
DATABASE_PROVIDER=postgres
DATABASE_URL=<railway-postgres-connection-string>
JWT_SECRET=<secreto_produccion>
NODE_ENV=production
VITE_API_URL=https://<tu-dominio>.railway.app
GEMINI_API_KEY=<opcional_si_usas_gemini>
```

No sobrescribas la aplicación V1 en Railway hasta confirmar — crea un servicio separado para V2 o una rama de despliegue independiente.

El frontend usa `src/api/client.ts` con `BASE_URL` fijo en `http://localhost:3001`.

## Comandos de Ejecución

```bash
npm install          # Instalar dependencias (frontend + backend)
npm run dev          # Frontend + backend simultáneamente (concurrently)
npm run dev:frontend # Solo frontend (Vite en puerto 3000)
npm run dev:backend  # Solo backend (Express en puerto 3001)
npm run build        # Build frontend para producción
npm start            # Producción: Express sirve API + dist/
npm run lint         # TypeScript type check (tsc --noEmit)
```

## Endpoints Principales

| Método | Ruta                    | Auth     | Descripción                     |
|--------|-------------------------|----------|---------------------------------|
| POST   | `/api/auth/login`       | No       | Iniciar sesión, devuelve JWT    |
| GET    | `/api/auth/me`          | JWT      | Perfil del usuario autenticado  |
| POST   | `/api/chat`             | JWT      | Enviar mensaje al chat IA (streaming) |
| GET    | `/api/chat/history`     | JWT      | Historial de chat               |
| DELETE | `/api/chat/history`     | JWT      | Limpiar historial               |
| GET    | `/api/candidates`       | No       | Listar candidatos               |
| GET    | `/api/candidates/:id`   | No       | Detalle de candidato            |
| POST   | `/api/agents/interview` | JWT      | Evaluar respuesta de entrevista |
| POST   | `/api/agents/evaluate-scenario` | JWT | Evaluar decisión de escenario   |
| POST   | `/api/agents/matching`  | JWT      | Matching de candidatos          |
| GET    | `/api/students`         | No       | Listar estudiantes/semilleros   |
| PUT    | `/api/students/:id/syllabus/:courseId` | No | Actualizar progreso de curso |
| GET    | `/api/scenarios`        | No       | Listar escenarios vocacionales  |
| GET    | `/api/health`           | No       | **Liveness** — estado del servidor, DB, memoria, uptime |
| GET    | `/api/ready`            | No       | **Readiness** — servicios críticos listos (DB, auth) |

## MinaTalent — Suite de Evaluación Vocacional

La **batería MinaTalent** es un conjunto de 7 pruebas psicotécnicas para evaluar la compatibilidad de candidatos con operaciones mineras de alta montaña:

| Test                     | Mide                              |
|--------------------------|-----------------------------------|
| **Big Five**             | Personalidad (5 factores)         |
| **DISC**                 | Estilo de comportamiento          |
| **Hogan**                | Riesgos de liderazgo y derailers  |
| **Wonderlic**            | Capacidad cognitiva y resolución  |
| **Integridad**           | Ética y confiabilidad             |
| **Fit Social**           | Compatibilidad cultural minera    |
| **Escenarios**           | Juicio situacional en minería     |

Cada test genera una puntuación que se consolida en un **dashboard de resultados** y se puede exportar como **PDF** (`jsPDF`).

## Flujo de Autenticación JWT

1. El frontend envía `POST /api/auth/login` con `{ email, password }`.
2. El backend verifica credenciales con bcrypt contra SQLite.
3. Si son válidas, firma un JWT con `JWT_SECRET` (expira en 24h) y lo devuelve.
4. El frontend guarda el token en `localStorage('minamatch_token')`.
5. Cada petición autenticada incluye `Authorization: Bearer <token>`.
6. `authMiddleware.ts` verifica el token en cada ruta protegida.
7. También existe un modo `guest-token` para el flujo de invitado (PMV): si el token es exactamente `"guest-token"`, se asigna un usuario invitado sin verificar JWT.

## Modo Offline del Frontend

Si el backend no está disponible, el frontend cae a datos locales en `localStorage`:

- **Candidatos**: `fetchCandidates()` → si `apiFetch` falla, usa `getLocalData('minamatch_db_candidates', mockCandidates)`.
- **Estudiantes**: `fetchStudents()` igual, con fallback a `mockStudents`.
- **Syllabus**: `toggleSyllabus()` muta `localStorage` directamente si el servidor no responde.
- **Auth**: `AuthContext.login()` intenta `POST /api/auth/login` primero; si falla, usa credenciales hardcoded locales.
- **Chat**: requiere el backend para streaming; sin conexión se muestra error.

## Despliegue

```bash
npm run build   # Compila el frontend para producción
npm start       # Arranca Express sirviendo API + frontend build
```

Para desplegar en Railway, ver [`docs/DEPLOY.md`](docs/DEPLOY.md).

### Verificación del Deploy en Producción

Endpoints de healthcheck funcionando en Railway:

```bash
# Liveness — servidor vivo
GET /api/health
# → { "status": "ok", "services": { "database": "ok", "gemini": "disabled" }, ... }

# Readiness — servicios críticos listos
GET /api/ready
# → { "ready": true, "services": { "database": "ok", "auth": "ok", "gemini": "disabled" } }
```

`gemini: "disabled"` es normal si no se configuró `GEMINI_API_KEY`; el servidor funciona igual con respuestas simuladas.

## Seguridad Implementada

- **Helmet**: cabeceras HTTP seguras (X-Content-Type-Options, CSP, etc.).
- **CORS**: restringido a `CORS_ORIGIN` (default `http://localhost:3000`; en producción same-origin).
- **Rate Limiting**: 20 peticiones/15min en `/api/auth`, 30 peticiones/min en `/api/chat`.
- **JWT_SECRET obligatorio**: si no está definido, el servidor lanza error al arrancar.
- **Validación Zod**: esquemas tipados para login, chat, syllabus y candidatos.
- **Limitación de payload**: `express.json({ limit: '10kb' })`.
- **Error handler centralizado**: `AppError` + middleware que evita leaks de stack traces.
- **Sin secretos hardcodeados**: todas las claves vienen de variables de entorno.
- **Guest-token**: modo invitado para PMV sin exposición de JWT real.
