# MinaMatch Puno — Documentación Oficial del Sistema

## 1. INTRODUCCIÓN

### 1.1 Descripción general de la aplicación

**MinaMatch Puno** es una plataforma web orientada a la identificación, evaluación y gestión de talento para operaciones mineras de alta montaña en la región de Puno, Perú. El sistema centraliza información de candidatos, estudiantes en programas semillero, pruebas vocacionales, escenarios situacionales y herramientas de apoyo con inteligencia artificial.

La propuesta de valor del sistema consiste en facilitar decisiones de selección y formación de talento minero mediante criterios técnicos, psicométricos y contextuales. La aplicación permite evaluar perfiles en función de experiencia, habilidades, certificaciones, adaptación a condiciones de altura, compatibilidad social, desempeño en escenarios mineros y resultados de pruebas MinaTalent.

La evolución reciente del repositorio consolidó una arquitectura **MinaMatch V2**, preparada para despliegue público en Railway con PostgreSQL, autenticación mediante JWT y endpoints versionados bajo `/api/v2`. La versión anterior, basada en SQLite, se conserva como referencia legacy de V1.

### 1.2 Objetivos del sistema

El sistema tiene los siguientes objetivos principales:

- **Optimizar la evaluación de talento minero**, integrando datos de candidatos, habilidades, certificaciones y compatibilidad operacional.
- **Apoyar procesos de formación y semilleros**, permitiendo visualizar estudiantes, avance curricular y métricas de preparación.
- **Estandarizar la evaluación psicométrica y vocacional**, mediante la suite MinaTalent y sus pruebas asociadas.
- **Incorporar asistencia inteligente**, a través de flujos de entrevista, análisis de escenarios, matching y chat con integración opcional de Google Gemini.
- **Habilitar acceso público controlado**, permitiendo que usuarios autorizados se registren, inicien sesión y utilicen la plataforma desde cualquier dispositivo.
- **Separar la evolución V2 de la base legacy**, manteniendo V1 como histórico y adoptando PostgreSQL como fuente activa para V2.

## 2. ARQUITECTURA Y TECNOLOGÍAS

### 2.1 Stack tecnológico utilizado

#### Frontend

- **React 19** para construcción de interfaces de usuario.
- **TypeScript** como lenguaje principal tipado.
- **Vite** como herramienta de desarrollo y build.
- **Tailwind CSS 4** para estilos utilitarios.
- **Lucide React** para iconografía.
- **Motion** para animaciones.
- **jsPDF** para generación de reportes PDF.

#### Backend V1 legacy

- **Express 4** sobre Node.js.
- **TypeScript** ejecutado con `tsx`.
- **SQLite** mediante `better-sqlite3`.
- **JWT** con `jsonwebtoken`.
- **bcryptjs** para hashing de contraseñas.
- **Helmet, CORS y express-rate-limit** para controles básicos de seguridad.
- **Google Gemini** mediante `@google/genai` como integración opcional.

#### Backend V2

- **Express** como framework HTTP.
- **TypeScript** como lenguaje de desarrollo.
- **Drizzle ORM** como capa de acceso y modelado de datos.
- **PostgreSQL** como base activa para V2.
- **Pino y pino-http** para logging estructurado.
- **JWT y bcryptjs** para autenticación y seguridad de credenciales.
- **Vitest y Supertest** para pruebas del backend.

#### Base de datos

- **PostgreSQL** se establece como fuente activa para MinaMatch V2.
- **SQLite** se conserva únicamente como mecanismo legacy de V1.
- **Drizzle Kit** se utiliza para migraciones, sincronización de esquema y seed de datos.

#### DevOps y despliegue

- **Docker** como contenedor de aplicación.
- **Railway** como destino de despliegue público.
- **pnpm workspaces** para organizar el monorepo.
- **GitHub Actions** como base de integración continua incorporada en la evolución V2.

### 2.2 Descripción de arquitectura

La arquitectura actual se organiza como un **monorepo por capas**, con separación progresiva entre componentes legacy y componentes V2.

#### Estructura conceptual

- **Capa de presentación**: frontend React ubicado principalmente en `src/`.
- **Capa de cliente API V2**: módulos de consumo HTTP ubicados en `src/lib/api/`.
- **Capa backend V2**: API Express versionada en `packages/backend/`.
- **Capa compartida**: tipos, validadores y constantes en `packages/shared/`.
- **Capa de persistencia**: esquema, migraciones, repositorios y provider en `packages/database/`.
- **Capa legacy V1**: backend histórico en `server/` y SQLite en `data/`.

#### Monorepo V2

La estructura V2 se implementa mediante `pnpm-workspace.yaml`, que incluye el paquete raíz y `packages/*`. Esta organización permite evolucionar backend, database, tipos compartidos y frontend futuro sin perder compatibilidad con la aplicación actual.

#### API versionada

La API V2 expone endpoints bajo `/api/v2`, principalmente:

- `GET /api/v2/health`
- `GET /api/v2/ready`
- `POST /api/v2/auth/register`
- `POST /api/v2/auth/login`
- `GET /api/v2/auth/me`
- `POST /api/v2/chat/message`
- `GET /api/v2/chat/history`
- `DELETE /api/v2/chat/history`
- `POST /api/v2/agents/interview`
- `POST /api/v2/agents/evaluate-scenario`
- `POST /api/v2/agents/matching`

Adicionalmente, algunas rutas de lectura de candidatos, estudiantes y escenarios se mantienen bajo `/api` para compatibilidad durante la transición.

#### Despliegue Railway V2

El despliegue V2 se corrigió para que Railway ejecute el backend V2 y no el backend V1. El comando efectivo de producción es:

```bash
pnpm start
```

Ese comando resuelve a:

```bash
NODE_ENV=production pnpm --filter @minamatch/backend exec tsx src/index.ts
```

El healthcheck de Railway debe apuntar a:

```text
/api/v2/health
```

El backend V2 prioriza `process.env.PORT`, luego `V2_PORT` y finalmente `3004`, lo que permite adaptarse al puerto inyectado por Railway.

## 3. FUNCIONALIDADES PRINCIPALES Y MÓDULOS

### 3.1 Autenticación y gestión de sesión

El sistema permite autenticación mediante JWT. En V2 se incorporó registro público con persistencia en PostgreSQL.

Funciones principales:

- Registro de usuario mediante `POST /api/v2/auth/register`.
- Login mediante `POST /api/v2/auth/login`.
- Verificación de sesión mediante `GET /api/v2/auth/me`.
- Persistencia del token en `localStorage` bajo la clave `minamatch_token`.
- Hashing de contraseñas con bcrypt.
- Asignación de rol por defecto `user` para nuevos registros.

### 3.2 Buscador y matching de talento

El módulo de talento permite consultar candidatos y analizar su compatibilidad con operaciones mineras.

Capacidades principales:

- Visualización de candidatos.
- Evaluación por experiencia, habilidades y certificaciones.
- Identificación de candidatos destacados.
- Compatibilidad con altura y contexto social.
- Ranking y shortlist de perfiles.
- Soporte para matching asistido por IA.

### 3.3 Semilleros y seguimiento formativo

El módulo de semilleros permite gestionar perfiles de estudiantes o participantes en formación minera.

Capacidades principales:

- Listado de estudiantes.
- Visualización de avance curricular.
- Seguimiento de sílabos o cursos.
- Métricas de preparación y potencial.
- Soporte para evaluación de compatibilidad con perfiles mineros.

### 3.4 MinaTalent — Suite de evaluación vocacional

MinaTalent integra pruebas psicométricas y vocacionales para evaluar la adecuación de candidatos al contexto minero.

Pruebas incluidas:

- **Big Five**: evaluación de personalidad por cinco factores.
- **DISC**: estilos de comportamiento.
- **Hogan**: riesgos de liderazgo y derailers.
- **Wonderlic**: razonamiento y capacidad cognitiva.
- **Integridad**: ética y confiabilidad.
- **Fit Social**: compatibilidad social y cultural.
- **Escenarios situacionales**: juicio aplicado a casos mineros.

El sistema consolida resultados en dashboards y permite generar reportes PDF.

### 3.5 Escenarios situacionales

El módulo de escenarios permite evaluar la toma de decisiones ante situaciones operativas simuladas.

Capacidades principales:

- Presentación de escenarios mineros.
- Selección de respuestas por parte del usuario.
- Evaluación asistida por reglas o IA.
- Retroalimentación asociada a la decisión tomada.

### 3.6 Chat y agentes de IA

El sistema incluye capacidades de asistencia con IA para apoyar entrevistas, matching y análisis de escenarios.

Capacidades principales:

- Chat con historial.
- Respuestas asistidas por Google Gemini cuando `GEMINI_API_KEY` está configurado.
- Fallback a respuestas simuladas cuando Gemini no está disponible.
- Agente de entrevista.
- Agente de evaluación de escenarios.
- Agente de matching de candidatos.

### 3.7 Healthcheck, readiness y observabilidad

V2 incorpora endpoints de monitoreo operativos:

- `GET /api/v2/health`: confirma que el servicio está vivo.
- `GET /api/v2/ready`: valida disponibilidad de servicios críticos, especialmente base de datos.

El backend V2 utiliza logging estructurado con Pino para facilitar observabilidad en producción.

## 4. REQUISITOS E INSTALACIÓN

### 4.1 Requisitos del sistema

Para ejecutar el proyecto localmente se requiere:

- Node.js compatible con el entorno del proyecto.
- pnpm 9 o superior.
- Docker y Docker Compose para levantar PostgreSQL local.
- PostgreSQL si se desea usar una base externa sin Docker.
- Git para control de versiones.
- Variables de entorno configuradas según el modo de ejecución.

### 4.2 Instalación local V2 recomendada

1. Clonar el repositorio y ubicarse en la rama V2 correspondiente.

```bash
git clone https://github.com/mikyLove/MINAMATCH1.git
cd MINAMATCH1
git switch version-2
```

2. Instalar dependencias.

```bash
pnpm install
```

3. Crear archivo `.env` en la raíz del repositorio.

```env
DATABASE_PROVIDER=postgres
DATABASE_URL=postgres://minamatch:minamatch_dev@localhost:5432/minamatch_v2
JWT_SECRET=secreto_local_v2
V2_PORT=3004
LOG_LEVEL=debug
VITE_API_URL=http://localhost:3004
GEMINI_API_KEY=opcional
```

4. Levantar PostgreSQL local.

```bash
docker compose up -d
```

5. Aplicar esquema y seed de base de datos.

```bash
pnpm run db:push
pnpm run db:seed
```

6. Iniciar backend V2.

```bash
pnpm --filter @minamatch/backend exec tsx src/index.ts
```

7. Iniciar frontend.

```bash
pnpm run dev:frontend
```

8. Validar healthchecks.

```bash
curl http://localhost:3004/api/v2/health
curl http://localhost:3004/api/v2/ready
```

### 4.3 Despliegue Railway V2

Para despliegue público se debe crear o configurar un servicio Railway apuntando a la rama `version-2`.

Variables mínimas requeridas:

```text
DATABASE_PROVIDER=postgres
DATABASE_URL=<URL PostgreSQL Railway>
JWT_SECRET=<secreto_seguro>
NODE_ENV=production
LOG_LEVEL=info
GEMINI_API_KEY=<opcional>
VITE_API_URL=<solo_si_frontend_y_backend_estan_separados>
```

El servicio Railway debe usar el `Dockerfile` del repositorio. El comando de inicio efectivo será `pnpm start`, que arranca el backend V2.

El healthcheck debe ser:

```text
/api/v2/health
```

Validaciones posteriores al despliegue:

```bash
curl https://<dominio-railway>/api/v2/health
curl https://<dominio-railway>/api/v2/ready
```

Luego se debe validar el flujo funcional desde navegador:

- Crear una cuenta nueva.
- Iniciar sesión.
- Entrar a la plataforma.
- Refrescar la página.
- Confirmar persistencia de sesión.
- Cerrar sesión.
- Volver a iniciar sesión con el mismo usuario.

## 5. HISTORIAL DE CAMBIOS Y EVOLUCIÓN COMPORTAMENTAL

### 5.1 Estado del repositorio y ramas

La revisión del repositorio y de GitHub muestra una separación clara entre V1 y V2:

- **`main`**: rama por defecto visible en GitHub, asociada a la versión histórica V1.
- **`version-2`**: rama activa observada en GitHub con la migración V2.
- **`work`**: rama local de trabajo observada en el entorno actual, con commits recientes de V2.

GitHub muestra `main` como rama default y `version-2` como rama activa actualizada el 29 de mayo de 2026. La rama `main` conserva documentación y estructura orientadas a V1, mientras `version-2` contiene el monorepo, paquetes V2, configuración PostgreSQL, documentación de migración y ajustes Railway.

### 5.2 Evolución técnica por fases

#### Fase 0 — Preparación del monorepo

Se creó una base de monorepo con pnpm workspaces, separando responsabilidades futuras en paquetes `shared`, `database`, `backend` y `frontend`. También se formalizaron reglas de migración, decisiones técnicas y bitácora de cambios.

#### Fase 1 — Consolidación de tipos y validadores

Se migraron tipos, validadores y constantes compartidas hacia `packages/shared`, reduciendo duplicidad entre frontend y backend.

#### Fase 2 — Capa de datos PostgreSQL

Se implementó `packages/database` con Drizzle ORM, schema PostgreSQL, migraciones, seed data y repositorios tipados. Esta fase sentó la base para abandonar SQLite como fuente activa en V2.

#### Fase 3 — Backend V2

Se implementó un backend Express V2 con endpoints versionados, logging estructurado, healthchecks, readiness y rutas conectadas al provider de datos. Se incorporaron pruebas de integración y CI.

#### Fase 3I — Decisión PostgreSQL

Se definió que PostgreSQL es la fuente única de verdad para V2. SQLite quedó congelado como legacy de V1, evitando que nuevas funcionalidades dependan de la base histórica.

#### Fase 4 — Cliente API V2 y migración frontend

Se creó una capa `src/lib/api` para consumir la API V2 desde el frontend. La autenticación fue migrada a V2 mediante `v2Login`, `v2Register` y `v2VerifyToken`. El token se mantiene en `localStorage` y se verifica al refrescar la página.

#### Fase 5 — Registro público y demo Railway

Se incorporó registro público V2 con PostgreSQL, hashing de contraseñas, rol por defecto y devolución de JWT. Se preparó documentación de despliegue Railway y se corrigió el runtime para que Railway arranque V2 y no V1.

### 5.3 Cambios recientes más relevantes

Los cambios recientes del historial de Git reflejan las siguientes mejoras:

- Migración del frontend a clientes API V2.
- Migración de autenticación frontend a endpoints V2.
- Definición de PostgreSQL como base activa de V2.
- Healthchecks y readiness V2.
- Logging estructurado con Pino.
- Tests híbridos y pruebas PostgreSQL.
- Registro público con contraseña hasheada y JWT.
- Configuración Railway para backend V2.
- Cambio del healthcheck Railway a `/api/v2/health`.
- Exposición del puerto `8080` en Docker para entorno Railway.
- Serving de `dist/` desde backend V2 en producción.
- Documentación integral del proceso V2 y de la operación pública.

### 5.4 Cambio comportamental del despliegue

Antes de la corrección de Fase 5D, Railway arrancaba el backend V1 con SQLite. La evidencia operativa era:

- El comando de inicio ejecutaba `server/index.ts`.
- El log mostraba `Database: SQLite`.
- El healthcheck apuntaba a `/api/health`.

Después de la corrección:

- Railway ejecuta `pnpm start`.
- `pnpm start` arranca `packages/backend/src/index.ts`.
- El servicio escucha en el puerto inyectado por Railway.
- El healthcheck usa `/api/v2/health`.
- La base esperada es PostgreSQL mediante `DATABASE_PROVIDER=postgres` y `DATABASE_URL`.
- El log esperado indica `MinaMatch V2 API started`.

## 6. CONCLUSIONES Y MANTENIMIENTO

### 6.1 Conclusiones

MinaMatch Puno evolucionó desde una aplicación V1 funcional basada en SQLite hacia una plataforma V2 más robusta, modular y preparada para operación pública. La adopción de PostgreSQL, API versionada, monorepo, logging estructurado y despliegue Railway orientado a V2 mejora la mantenibilidad y la capacidad de crecimiento del sistema.

La plataforma queda preparada para una demo docente pública en la que se puede registrar un usuario, iniciar sesión, validar persistencia de JWT, consultar módulos principales y operar con una base PostgreSQL externa.

### 6.2 Consideraciones para mantenimiento

Para futuros desarrolladores o administradores se recomienda:

- Mantener V1 como referencia legacy y evitar nuevas funcionalidades sobre SQLite.
- Ejecutar nuevas evoluciones sobre la rama `version-2` o una rama derivada controlada.
- Validar que Railway apunte a `version-2` y no a `main` cuando se quiera desplegar V2.
- Confirmar que `DATABASE_PROVIDER=postgres` y `DATABASE_URL` estén configurados antes de desplegar.
- Ejecutar migraciones Drizzle antes de usar una base nueva.
- Mantener `JWT_SECRET` seguro y distinto entre desarrollo y producción.
- No exponer secretos en documentación, commits o variables públicas.
- Ejecutar validaciones antes de cada despliegue:

```bash
pnpm run lint
pnpm run build
pnpm --filter @minamatch/backend test
```

- Validar endpoints públicos después de cada deploy:

```bash
curl https://<dominio-railway>/api/v2/health
curl https://<dominio-railway>/api/v2/ready
```

- Revisar logs de Railway para confirmar que el servicio arrancó como V2.
- Monitorear el crecimiento de módulos React y planificar refactors graduales si los componentes aumentan complejidad.
- Mantener actualizada esta documentación con cada fase relevante de evolución.
