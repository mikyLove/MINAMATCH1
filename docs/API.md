# API de MinaMatch Puno

Base URL (desarrollo): `http://localhost:3001`
Base URL (producción): `https://minamatch.up.railway.app`

## Autenticación

### `POST /api/auth/login`

Inicia sesión y devuelve un token JWT.

```
Request:
  Content-Type: application/json

  { "email": "admin@minamatch.pe", "password": "admin123" }

Response 200:
  {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "1",
      "name": "Admin MinaMatch",
      "email": "admin@minamatch.pe",
      "role": "admin",
      "avatar": null
    }
  }

Response 400 (validación):
  { "error": "Email inválido" }

Response 401 (credenciales incorrectas):
  { "error": "Credenciales inválidas" }

Auth: No requerida
Rate limit: 20 intentos cada 15 minutos
```

### `GET /api/auth/me`

Devuelve el perfil del usuario autenticado.

```
Headers:
  Authorization: Bearer <token>

Response 200:
  {
    "id": "1",
    "name": "Admin MinaMatch",
    "email": "admin@minamatch.pe",
    "role": "admin",
    "avatar": null
  }

Response 401:
  { "error": "Token requerido" }
  { "error": "Token inválido o expirado" }

Auth: JWT requerido
```

## Chat IA

### `POST /api/chat`

Envía un mensaje al chat IA. La respuesta es **streaming** (text/plain).

```
Request:
  Content-Type: application/json

  { "message": "¿Qué candidatos tienes?" }

Response 200: text/plain (streaming)
  "Puedo ayudarte a buscar candidatos mineros..."

Response 400 (validación):
  { "error": "Mensaje demasiado corto" }

Response 400 (contenido prohibido):
  { "error": "El mensaje contiene términos no permitidos por la política de seguridad." }

Auth: JWT requerido
Rate limit: 30 mensajes por minuto
```

### `GET /api/chat/history`

Devuelve el historial de mensajes del usuario autenticado.

```
Headers:
  Authorization: Bearer <token>

Response 200:
  [
    { "role": "user", "content": "Hola", "created_at": "2025-01-01T12:00:00.000Z" },
    { "role": "assistant", "content": "¿En qué puedo ayudarte?", "created_at": "2025-01-01T12:00:01.000Z" }
  ]

Auth: JWT requerido
```

### `DELETE /api/chat/history`

Elimina todo el historial de chat del usuario.

```
Headers:
  Authorization: Bearer <token>

Response 200:
  { "success": true }

Auth: JWT requerido
```

## Candidatos

### `GET /api/candidates`

Lista todos los candidatos mineros.

```
Response 200:
  [
    {
      "id": "1",
      "name": "Carlos Mamani Quispe",
      "title": "Ingeniero de Minas",
      "institution": "UNA Puno",
      "expYears": 8,
      "skills": ["geomecánica", "ventilación", "seguridad"],
      "certified": true,
      "isTop5": true,
      "matchRating": 92,
      "altitudeFit": 4800,
      "socialFit": 85,
      "languages": ["Español", "Quechua"],
      "hasOsha": true,
      "aiInterviewTranscript": [...]
    }
  ]

Auth: No requerida
```

### `GET /api/candidates/:id`

Detalle de un candidato específico.

```
Response 200:
  { ... (mismo formato que el listado) }

Response 404:
  { "error": "Candidate not found" }

Auth: No requerida
```

## Agentes IA

### `POST /api/agents/interview`

Evalúa una respuesta de entrevista para un candidato.

```
Request:
  Content-Type: application/json

  {
    "candidateId": "1",
    "question": "¿Cómo procedería ante una alerta de vibración?",
    "answer": "Evacuaría inmediatamente..."
  }

Response 200:
  {
    "evaluation": "Puntuación: 85/100\nFortalezas:...",
    "candidate": { "id": "1", "name": "Carlos Mamani", "title": "Ingeniero de Minas" }
  }

Response 400:
  { "error": "candidateId, question and answer are required" }

Auth: JWT requerido
```

### `POST /api/agents/evaluate-scenario`

Evalúa una decisión en un escenario de seguridad.

```
Request:
  Content-Type: application/json

  {
    "scenarioId": "1",
    "optionId": "3"
  }

Response 200:
  {
    "feedback": "Decisión evaluada:...",
    "scenario": { "id": "1", "title": "..." },
    "option": { "id": "3", "text": "..." }
  }

Response 400:
  { "error": "scenarioId and optionId are required" }

Response 404:
  { "error": "Scenario or option not found" }

Auth: JWT requerido
```

### `POST /api/agents/matching`

Analiza candidatos contra requerimientos.

```
Request:
  Content-Type: application/json

  {
    "requirements": "Busco un ingeniero con experiencia en ventilación y geomecánica"
  }

Response 200:
  {
    "analysis": "Análisis de Matching - ...",
    "totalCandidates": 6
  }

Response 400:
  { "error": "requirements are required" }

Auth: JWT requerido
```

## Estudiantes / Semilleros

### `GET /api/students`

Lista todos los estudiantes del programa Semilleros Puno.

```
Response 200:
  [
    {
      "id": "1",
      "name": "María Huanca",
      "badge": "Becaria Minsur",
      "program": "Semilleros Puno v4.2",
      "status": "EN_CURSO",
      "matchingScore": 75,
      "syllabus": [
        { "id": "SS-01", "course": "Seguridad Subterránea", "completed": true },
        { "id": "GA-02", "course": "Gestión Ambiental", "completed": false }
      ]
    }
  ]

Auth: No requerida
```

### `PUT /api/students/:id/syllabus/:courseId`

Actualiza el progreso de un curso del syllabus.

```
Request:
  Content-Type: application/json

  { "completed": true }

Response 200:
  { "score": 75, "status": "EN_CURSO", "completed": true }

Response 400:
  { "error": "completed es requerido" }

Auth: No requerida
```

## Escenarios Vocacionales

### `GET /api/scenarios`

Lista los escenarios de la prueba vocacional MinaTalent.

```
Response 200:
  [
    {
      "id": 1,
      "stage": "Vibración",
      "stageNum": 1,
      "category": "geomecánica",
      "title": "Alarma por vibración en interior mina",
      "description": "...",
      "options": [
        {
          "id": 1,
          "text": "Evacuar de inmediato",
          "impact": { "calma": 8, "seguridad": 10, "tiempo": 3, ... }
        }
      ]
    }
  ]

Auth: No requerida
```

## Health & Readiness

### `GET /api/health`

Healthcheck de **liveness**: indica que el servidor Express está vivo. Verifica conexión a base de datos y reporta servicios adjuntos.

```
Response 200:
  {
    "status": "ok",
    "timestamp": "2025-01-01T12:00:00.000Z",
    "uptime": 12345,
    "environment": "development",
    "version": "0.0.0",
    "services": {
      "database": "ok",
      "gemini": "ok"
    },
    "memory": {
      "rssMb": 45,
      "heapMb": 28
    }
  }

Response 500 (base de datos caída):
  { "status": "error", "error": "Database connection failed" }

Auth: No requerida

Notas:
- `services.gemini` retorna `"ok"` si hay API key configurada, `"disabled"` si no.
- `uptime` en segundos desde que arrancó el servidor.
- `environment` se lee de `NODE_ENV`, default `"development"`; en Railway es `"production"`.
- `version` se lee del `package.json` del proyecto.
- `memory` muestra RSS y heap usados en MB (información básica, no expone secretos).
```

### `GET /api/ready`

Healthcheck de **readiness**: indica que el servidor está listo para recibir tráfico real. Verifica SQLite, `JWT_SECRET` configurado, y reporta Gemini. Este endpoint se usa en Railway para determinar si el contenedor puede recibir tráfico.

```
Response 200:
  {
    "ready": true,
    "services": {
      "database": "ok",
      "auth": "ok",
      "gemini": "disabled"
    }
  }

Response 503 (servicio crítico no disponible):
  { "ready": false, "error": "Servicios no disponibles: database, auth" }

Auth: No requerida

Notas:
- Servicios críticos: database, auth. Si alguno falla → 503 (Railway corta el tráfico al contenedor).
- Gemini es informativo; si falta API key retorna `"disabled"` sin bloquear.
- No expone secretos: solo dice si auth está disponible o no.
```
