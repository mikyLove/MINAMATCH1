# Diagramas PlantUML — MinaMatch

Diagramas de arquitectura para la primera versión del sistema MinaMatch Puno.

## Requisitos

- [PlantUML](https://plantuml.com/) (CLI o plugin)
- Java Runtime (JRE)

## Generar PNG

```bash
# Todos los diagramas
plantuml *.puml

# Un diagrama específico
plantuml login.puml
```

## Diagramas

| Archivo               | Descripción                                   |
|-----------------------|-----------------------------------------------|
| `login.puml`          | Flujo lógico del login JWT                    |
| `arquitectura.puml`   | Arquitectura cliente-servidor completa        |
| `api-flow.puml`       | Consumo de APIs y fallback offline            |
| `sequence-login.puml` | Secuencia temporal del login                  |
| `deployment.puml`     | Despliegue Railway + Docker + SQLite          |
| `state-auth.puml`     | Máquina de estados de autenticación JWT       |

## Basado en la arquitectura real

- **Frontend:** React 19 + Vite + TypeScript
- **Backend:** Express 4 + TypeScript (tsx)
- **Base de datos:** SQLite (better-sqlite3)
- **Auth:** JWT (jsonwebtoken + bcryptjs) + guest-token
- **IA:** Google Gemini (gemini-2.0-flash), deshabilitado sin API key
- **Despliegue:** Railway (Dockerfile + pnpm)
- **Healthchecks:** `/api/health` (liveness), `/api/ready` (readiness)
