# Arquitectura de MinaMatch Puno

## Diagrama de Flujo

```
                         ┌──────────────────────────────────────┐
                         │           Navegador (Browser)        │
                         │                                      │
                         │  React 19 + Vite + Tailwind 4        │
                         │  localhost:3000                       │
                         └──────────┬───────────────────────────┘
                                    │
                          HTTP REST │ (JSON / Streaming)
                          JWT Bearer│
                          timeout: 8s
                                    ▼
               ┌─────────────────────────────────────────────────────┐
               │              Express Server (localhost:3001)        │
               │                                                     │
               │  Helmet → CORS → JSON Parser → Rate Limiters       │
               │                                                     │
               │  ┌───────────┐  ┌──────────────┐  ┌─────────────┐  │
               │  │ authRoutes│  │  chatRoutes  │  │ agentRoutes  │  │
               │  │ POST login│  │  POST /chat  │  │ /interview   │  │
               │  │ GET /me   │  │  GET /history│  │ /matching    │  │
               │  └─────┬─────┘  │  DEL /history│  │ /scenario    │  │
               │        │        └──────┬───────┘  └──────┬───────┘  │
               │  ┌─────┴─────┐  ┌──────┴───────┐  ┌──────┴───────┐ │
               │  │candidates │  │  students    │  │  scenarios   │ │
               │  │ GET /     │  │  GET /       │  │  GET /       │ │
               │  │ GET /:id  │  │  PUT syllabus│  │              │ │
               │  └───────────┘  └──────────────┘  └──────────────┘ │
               │                                                     │
               │  Error Handler (centralizado)                       │
               └──────┬──────────────────┬──────────────────────────┘
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
              └─────────────┘
```

## Capas

### 1. Frontend (React + Vite) — `src/`

**Responsabilidad**: UI, estado, interacción con el usuario.

- **`src/api/`**: capa de comunicación con el backend. Cada módulo (`auth.ts`, `candidates.ts`, etc.) expone funciones async que llaman a `apiFetch()` (definido en `client.ts`). Si el backend no responde, caen a `localStorage` como fallback.
- **`src/components/`**: componentes React organizados por funcionalidad (candidatos, chat, escenarios, estudiantes, etc.).
- **`src/data/`**: datos mock (fallback offline).
- **`src/types/`**: interfaces TypeScript compartidas.

### 2. Backend (Express) — `server/`

**Responsabilidad**: servir datos, autenticar, orquestar IA.

- **`server/index.ts`**: entry point. Configura middleware global (helmet, CORS, rate limiters, JSON parser), monta rutas, conecta SQLite, inicia el servidor.
- **`server/routes/`**: handlers Express. Cada archivo es un `Router` independiente. Validan entrada con Zod, interactúan con SQLite y/o Gemini, devuelven JSON.
- **`server/services/gemini.ts`**: cliente compartido de Google Generative AI. Expone `evaluationModel` (para agentes) y `createChatModel()` (fábrica para chat con system prompt variable).
- **`server/authMiddleware.ts`**: verifica JWT en cada petición protegida. Soporta `guest-token` para flujo invitado.
- **`server/validators.ts`**: esquemas Zod para validación de entrada en rutas.
- **`server/errorHandler.ts`**: clase `AppError` + middleware Express que captura errores, responde con JSON y evita leaks de stack traces.
- **`server/db.ts`**: inicializa SQLite con todas las tablas y datos semilla.

### 3. Base de Datos (SQLite)

**Responsabilidad**: persistencia local, sin servidor externo.

Archivo `server/minamatch.db` (se crea automáticamente). Tablas:
- `users` — credenciales y perfiles
- `candidates` — talento minero
- `candidate_interviews` — transcripciones de entrevistas IA
- `students` — semilleros y becas
- `student_syllabus` — cursos completados
- `scenarios` / `scenario_options` — pruebas vocacionales
- `chat_messages` — historial de chat (volátil, se limpia cada 10 min)

### 4. Inteligencia Artificial (Google Gemini)

**Responsabilidad**: generar respuestas de chat, evaluar entrevistas, analizar matching, evaluar escenarios.

- Modelo: `gemini-2.0-flash`
- Temperatura: 0.2 (evaluaciones objetivas) / 0.4 (chat conversacional)
- Sin API key: el servidor funciona con respuestas simuladas (fallback offline).

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
