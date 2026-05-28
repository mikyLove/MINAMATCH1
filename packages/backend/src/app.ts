import express from 'express';
import cors from 'cors';
import { httpLogger } from './logger';
import simpleRoutes from './routes/v2/simple.routes';
import authRoutes from './routes/v2/auth.routes';
import chatRoutes from './routes/v2/chat.routes';
import agentsRoutes from './routes/v2/agents.routes';
import healthRoutes from './routes/v2/health.routes';

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

export { app };
