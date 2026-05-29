import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { httpLogger } from './logger';
import simpleRoutes from './routes/v2/simple.routes';
import authRoutes from './routes/v2/auth.routes';
import chatRoutes from './routes/v2/chat.routes';
import agentsRoutes from './routes/v2/agents.routes';
import healthRoutes from './routes/v2/health.routes';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10kb' }));
app.use(httpLogger);

app.use('/api', simpleRoutes);
app.use('/api/v2/auth', authRoutes);
app.use('/api/v2/chat', chatRoutes);
app.use('/api/v2/agents', agentsRoutes);
app.use('/api/v2', healthRoutes);

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint no encontrado' });
  }
  next();
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', '..', '..', 'dist');
  if (fs.existsSync(path.join(distPath, 'index.html'))) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

export { app };
