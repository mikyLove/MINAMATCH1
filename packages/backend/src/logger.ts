import pino from 'pino';
import pinoHttp from 'pino-http';

const isDev = process.env.NODE_ENV !== 'production';

const level = process.env.LOG_LEVEL || (isDev ? 'debug' : 'info');

const transport = isDev
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:HH:MM:ss.l',
        ignore: 'pid,hostname',
      },
    }
  : undefined;

export const logger = pino({
  level,
  transport,
  timestamp: pino.stdTimeFunctions.isoTime,
});

export const httpLogger = pinoHttp({
  logger,
  autoLogging: {
    ignore: (req) => (req.url ?? '') === '/api/v2/health',
  },
});

export function createContextLogger(context: string): pino.Logger {
  return logger.child({ context });
}

export function setupErrorHandlers(log: pino.Logger = logger): void {
  process.on('uncaughtException', (error) => {
    log.fatal({ err: error }, 'Uncaught exception — shutting down');
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    log.fatal({ err: reason }, 'Unhandled rejection — shutting down');
    process.exit(1);
  });
}

