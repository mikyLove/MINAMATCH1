# Seguridad en MinaMatch Puno

## Medidas Implementadas

### Helmet

Cabeceras HTTP de seguridad aplicadas globalmente en `server/index.ts`:

```ts
app.use(helmet());
```

Protege contra:
- XSS (Cross-Site Scripting)
- Clickjacking (X-Frame-Options)
- MIME sniffing (X-Content-Type-Options)
- Referrer leakage
- Otros vectores OWASP Top 10

### CORS

Restringido al origen del frontend:

```ts
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

Solo `localhost:3000` puede hacer peticiones. En producción, el frontend y backend están en el mismo dominio (same-origin), por lo que CORS no es necesario; igualmente se define `CORS_ORIGIN` para compatibilidad.

### Rate Limiting

```ts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 20,                     // 20 intentos
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minuto
  max: 30,               // 30 mensajes
});
```

- **`/api/auth`**: máximo 20 intentos de login cada 15 minutos (previene fuerza bruta).
- **`/api/chat`**: máximo 30 mensajes por minuto (previene abuso del API de Gemini).
- Headers estándar de rate limit incluidos (`RateLimit-*`).

### JWT_SECRET Obligatorio

```ts
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no configurado. Debe definirse en server/.env');
  }
  return secret;
}
```

- Si `JWT_SECRET` no está definido, el servidor lanza un error al arrancar.
- No existe fallback inseguro (se eliminó el `'dev-insecure-fallback'` de fases anteriores).
- Los tokens expiran en 24 horas.

### Guest-Token (Modo Invitado)

El middleware de autenticación soporta un flujo invitado para el PMV: si el header `Authorization` contiene exactamente `"guest-token"`, se asigna un usuario invitado sin verificar JWT. Esto permite explorar la plataforma sin necesidad de login real durante demostraciones.

```ts
if (token === 'guest-token') {
  (req as any).user = { id: 'guest', name: 'Invitado', role: 'guest' };
  return next();
}
```

Este modo está diseñado solo para PMV/demos y debe reemplazarse por autenticación completa en producción real.

### GEMINI_API_KEY por .env

```ts
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
```

- La API key se carga desde `server/.env`.
- Si no hay key, el servidor funciona igual (responde con datos simulados en lugar de llamar a Gemini).

### Validación con Zod

Esquemas tipados que validan la entrada en cada ruta:

| Ruta                    | Esquema               | Validación                          |
|-------------------------|-----------------------|--------------------------------------|
| `POST /api/auth/login`  | `loginSchema`         | email válido + password 6-128 chars  |
| `POST /api/chat`        | `chatMessageSchema`   | mensaje 3-2000 caracteres            |
| `PUT /api/students/:id/syllabus/:courseId` | `syllabusUpdateSchema` | `completed` debe ser booleano     |
| (disponible)            | `candidateSchema`     | campos opcionales con tipos seguros  |

La validación ocurre antes de tocar la base de datos o la IA.

### Limitación de Payload

```ts
app.use(express.json({ limit: '10kb' }));
```

Cuerpos de petición mayores a 10KB son rechazados automáticamente.

### Error Handler Centralizado

```ts
export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
}
```

- Errores conocidos (`AppError`) devuelven el mensaje y código HTTP específico.
- Errores desconocidos devuelven `500` genérico sin leaks de stack traces.

### Sin Secretos Hardcodeados

| Secreto           | De dónde se lee                    | Archivo                  |
|-------------------|-------------------------------------|--------------------------|
| `JWT_SECRET`      | `process.env.JWT_SECRET`           | `server/.env`            |
| `GEMINI_API_KEY`  | `process.env.GEMINI_API_KEY`       | `server/.env`            |
| `CORS_ORIGIN`     | `process.env.CORS_ORIGIN`          | `server/.env`            |
| `PORT`            | `process.env.PORT`                 | `server/.env`            |

Ningún secreto está commitado en el repositorio. `.gitignore` excluye `.env*`.

## Recomendaciones Pendientes

### Alta Prioridad

1. **Rotar API Key de Gemini**: si se configuró `GEMINI_API_KEY` en Railway y antes estuvo en el historial de git, generar una nueva en [Google AI Studio](https://aistudio.google.com/) y actualizarla en las variables de entorno de Railway.

2. **HTTPS**: Railway provee HTTPS automáticamente en el dominio `*.up.railway.app`. Si se usa dominio personalizado, configurar TLS en Railway o Cloudflare.

3. **Hash de contraseñas**: ya implementado con bcryptjs. Verificar que el costo (`saltRounds`) sea al menos 10.

### Media Prioridad

4. **Firma de JWT con RS256**: actualmente usa HS256 (simétrico). Para producción con múltiples servicios, considerar RS256 con un par de llaves.

5. **Refresh tokens**: los tokens JWT expiran en 24h sin renovación automática. Implementar un endpoint `POST /api/auth/refresh` para mejorar UX.

6. **Logging estructurado**: reemplazar `console.error` por un logger (pino, winston) con niveles y formato JSON.

7. **Pruebas de seguridad**: agregar tests que verifiquen que rutas sin token devuelvan 401, que Zod rechace datos inválidos, y que rate limiting funcione.

### Baja Prioridad

8. **CSRF**: como las rutas se consumen desde el frontend (no desde formularios HTML), el riesgo CSRF es bajo con CORS restringido. Si se agregan cookies, implementar doble cookie submit o SameSite.

9. **Content Security Policy (CSP)**: Helmet tiene defaults conservadores. Revisar y ajustar CSP para producción según los assets que cargue la app (Google Fonts, imágenes locales).

10. ** Auditoría de dependencias**: ejecutar `npm audit` periódicamente y mantener las dependencias actualizadas.
