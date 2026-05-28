# Arquitectura de MinaMatch Puno

## Diagrama de Flujo

```
                         ┌──────────────────────────────────────────────┐
                         │              Navegador (Browser)             │
                         │                                              │
                         │  React 19 + Vite + Tailwind 4                │
                         │  localhost:3000 / Railway                    │
                         └──────────────┬───────────────────────────────┘
                                        │
                               HTTP REST │ (JSON / Streaming)
                               JWT Bearer│
                               timeout: 8s
                                        ▼
               ┌─────────────────────────────────────────────────────────────┐
               │                  Express Server (port 3001)                 │
               │                                                             │
               │  Helmet → CORS → JSON Parser (10kb) → Rate Limiters        │
               │                                                             │
               │  ┌───────────┐  ┌──────────────┐  ┌─────────────┐          │
               │  │ authRoutes│  │  chatRoutes  │  │ agentRoutes  │          │
               │  │ POST login│  │  POST /chat  │  │ /interview   │          │
               │  │ GET /me   │  │  GET /history│  │ /matching    │          │
               │  │           │  │  DEL /history│  │ /scenario    │          │
               │  └─────┬─────┘  └──────┬───────┘  └──────┬───────┘          │
               │        │               │                 │                  │
               │  ┌─────┴─────┐  ┌──────┴───────┐  ┌──────┴───────┐         │
               │  │candidates │  │  students    │  │  scenarios   │         │
               │  │ GET /     │  │  GET /       │  │  GET /       │         │
               │  │ GET /:id  │  │  PUT syllabus│  │              │         │
               │  └───────────┘  └──────────────┘  └──────────────┘         │
               │                                                             │
               │  ┌──────────────────────────────────────────────────────┐   │
               │  │  Health / Readiness (inline en index.ts)             │   │
               │  │  GET /api/health → liveness (DB, memoria, uptime)   │   │
               │  │  GET /api/ready  → readiness (DB, auth, gemini)     │   │
               │  └──────────────────────────────────────────────────────┘   │
               │                                                             │
               │  Error Handler (centralizado)                               │
               │  SPA fallback (NODE_ENV=production)                         │
               └──────┬──────────────────┬──────────────────────────────────┘
                      │                  │
                      ▼                  ▼
              ┌─────────────┐   ┌─────────────────┐
              │   SQLite    │   │   Google Gemini  │
              │ (better-    │   │  (gemini-2.0-    │
              │  sqlite3)   │   │   flash)         │
              │             │   │                  │
              │ candidates  │   │  Chat streaming  │
              │ students    │   │  Evaluaciones    │
              │ users       │   │  Matching        │
              │ chat_msgs   │   │  Escenarios      │
              │ scenarios   │   └──────────────────┘
              │ interviews  │
              │ scenario_   │
              │   options   │
              └─────────────┘
```

## Capas

### 1. Frontend (React + Vite) — `src/`

**Responsabilidad**: UI, estado, interacción con el usuario.

- **`src/api/`**: capa de comunicación con el backend. Cada módulo (`auth.ts`, `candidates.ts`, etc.) expone funciones async que llaman a `apiFetch()` (definido en `client.ts`). Si el backend no responde, caen a `localStorage` como fallback.
- **`src/components/`**: componentes React organizados por funcionalidad (candidatos, chat, escenarios, estudiantes, MatchingShortlist, BuscadorTalento, LandingPage, etc.).
- **`src/minatalent/`**: suite completa de evaluación psicotécnica MinaTalent (Big Five, DISC, Hogan, Wonderlic, Integridad, Fit Social) con generación de PDF.
- **`src/AuthContext.tsx`**: estado global de autenticación (JWT + guest-token).
- **`src/ThemeContext.tsx`**: contexto de tema claro/oscuro.
- **`src/data.ts`**: datos mock (fallback offline).
- **`src/types.ts`**: interfaces TypeScript compartidas.

### 2. Backend (Express) — `server/`

**Responsabilidad**: servir datos, autenticar, orquestar IA.

- **`server/index.ts`**: entry point. Configura middleware global (helmet, CORS, rate limiters, JSON parser), monta rutas, conecta SQLite, inicia el servidor. Incluye inline handlers para `GET /api/health` (liveness) y `GET /api/ready` (readiness). En producción, sirve el frontend compilado (`dist/`) con SPA fallback.
- **`server/routes/`**: handlers Express. Cada archivo es un `Router` independiente. Validan entrada con Zod, interactúan con SQLite y/o Gemini, devuelven JSON.
- **`server/services/gemini.ts`**: cliente compartido de Google Generative AI. Expone `evaluationModel` (para agentes) y `createChatModel()` (fábrica para chat con system prompt variable).
- **`server/authMiddleware.ts`**: verifica JWT en cada petición protegida. Soporta `guest-token` para flujo invitado.
- **`server/validators.ts`**: esquemas Zod para validación de entrada en rutas.
- **`server/errorHandler.ts`**: clase `AppError` + middleware Express que captura errores, responde con JSON y evita leaks de stack traces.
- **`server/db.ts`**: inicializa SQLite con todas las tablas y datos semilla (6 candidatos con entrevistas, 2 estudiantes con sílabos, 5 escenarios vocacionales con opciones, 1 chat de bienvenida).

### 3. Base de Datos (SQLite)

**Responsabilidad**: persistencia local, sin servidor externo.

Archivo `data/minamatch.db` (se crea automáticamente). Tablas:
- `users` — credenciales y perfiles
- `candidates` — talento minero (con match_rating, altitude_fit, social_fit)
- `candidate_interviews` — transcripciones de entrevistas IA
- `students` — semilleros y becas
- `student_syllabus` — cursos completados
- `scenarios` / `scenario_options` — pruebas vocacionales con impactos multidimensionales
- `chat_messages` — historial de chat (volátil, se limpia cada 10 min)

### 4. Inteligencia Artificial (Google Gemini)

**Responsabilidad**: generar respuestas de chat, evaluar entrevistas, analizar matching, evaluar escenarios.

- Modelo: `gemini-2.0-flash`
- Temperatura: 0.2 (evaluaciones objetivas) / 0.4 (chat conversacional)
- Sin API key: el servidor funciona con respuestas simuladas (fallback offline), reportado como `"disabled"` en health/ready.

### 5. MinaTalent Assessment Suite

**Responsabilidad**: evaluación psicotécnica offline de candidatos, generación de reportes.

- **7 tests independientes**: Big Five, DISC, Hogan, Wonderlic, Integridad, Fit Social, Escenarios
- **Scoring**: `src/minatalent/scoring.ts` — lógica de puntuación y normalización por test
- **Preguntas**: `src/minatalent/questions.ts` — banco de preguntas por test
- **Dashboard**: `ResultDashboard.tsx` — consolidación visual de todas las puntuaciones
- **PDF**: `PdfReport.ts` — exportación a PDF con jsPDF

## Fases Realizadas

### Fase 1: Conexión Frontend-Backend

- Montar `server/routes/chat.ts` en Express (antes estaba huérfana).
- Cambiar `BASE_URL` de `'LOCAL_DB'` a `'http://localhost:3001'`.
- Crear `apiFetch<T>()` con JWT headers + timeout + fallback a localStorage.
- `AuthContext.login()`: intenta servidor primero, fallback a credenciales hardcoded.

### Fase 2: Refactor por Capas

- Extraer `src/api/client.ts` (fetch wrapper, ApiError, helpers).
- Modularizar `src/api/auth.ts`, `candidates.ts`, `students.ts`, `chat.ts`.
- Barrel export en `src/api/index.ts` (backward compatible con imports existentes).
- Extraer rutas Express inline de `server/index.ts` a `server/routes/`.
- Extraer `server/services/gemini.ts` (modelos compartidos, fin del código Gemini duplicado).

### Fase 3: Seguridad y Validación

- Instalar `helmet`, `express-rate-limit`, `zod`.
- Crear `server/validators.ts` con esquemas para login, chat, syllabus, candidatos.
- Crear `server/errorHandler.ts` (AppError + middleware).
- Eliminar fallback inseguro de `JWT_SECRET` en `authMiddleware.ts`.
- Aplicar validación Zod en routes: `auth.ts`, `chat.ts`, `students.ts`.
- Agregar `helmet()`, CORS restringido, rate limiting y error handler en `server/index.ts`.
- Actualizar `.env.example` con todas las variables.

### Fase 4: MinaTalent Assessment Suite

- Implementar batería completa de tests psicotécnicos: Big Five, DISC, Hogan, Wonderlic, Integridad, Fit Social.
- Crear `MinaTalentLanding.tsx` como punto de entrada de la suite.
- Implementar `ResultDashboard.tsx` con consolidación visual de puntuaciones.
- Crear `PdfReport.ts` con generación de PDF exportable vía jsPDF.
- Implementar `FitSocialRadar.tsx` con visualización de radar de ajuste social.
- Banco de preguntas (`questions.ts`) y lógica de scoring (`scoring.ts`) para cada test.

### Fase 5: Healthchecks y Readiness

- Implementar `GET /api/health` (liveness): verifica conexión a DB, reporta memoria, uptime, versión, estado de Gemini.
- Implementar `GET /api/ready` (readiness): verifica DB y JWT_SECRET como servicios críticos, Gemini como informativo.
- Servicios críticos (DB + auth) determinan si la app está ready (200 vs 503).
- Integrar healthcheck en `railway.json` para reinicio automático en fallo.

### Fase 6: Deploy en Railway

- Crear `Dockerfile` con `node:20-slim`, soporte para módulos nativos (python3, gcc, g++), pnpm.
- Configurar `railway.json` con builder Dockerfile, healthcheck en `/api/health`, restart on failure.
- En producción, Express sirve `dist/` estático + SPA fallback para React Router.
- Configurar variables de entorno: `JWT_SECRET` (obligatorio), `GEMINI_API_KEY` (opcional).
- Verificar deploy: healthchecks funcionales, DB operativa, JWT funcionando, Gemini disabled (esperado).
