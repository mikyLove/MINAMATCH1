import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginSchema } from '@minamatch/shared';
import { getProvider } from '@minamatch/database';
import { getJwtSecret, authMiddleware, AuthRequest } from '../../middleware/auth.middleware';
import { z } from 'zod';

const router: Router = Router();

const registerSchema = z.object({
  name: z.string().min(2, 'Nombre demasiado corto').max(255),
  email: z.string().email('Email inválido').max(255),
  password: z.string().min(6, 'Mínimo 6 caracteres').max(128),
});

router.post('/login', async (req, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues?.[0]?.message || 'Datos inválidos';
      return res.status(400).json({ error: msg });
    }

    const { email, password } = parsed.data;
    const provider = await getProvider();
    const user = await provider.users.findByEmail(email);

    if (!user) {
      req.log?.warn({ email }, 'Login failed — user not found');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      req.log?.warn({ email }, 'Login failed — wrong password');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      getJwtSecret(),
      { expiresIn: '24h' },
    );

    req.log?.info({ userId: user.id, role: user.role }, 'Login successful');

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    req.log?.error({ err }, 'POST /auth/login error');
    res.status(503).json({ error: 'Servicio de autenticación no disponible' });
  }
});

router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (req.user.role === 'guest') {
      req.log?.info({ role: 'guest' }, 'Guest /auth/me');
      return res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: null,
      });
    }

    const provider = await getProvider();
    const user = await provider.users.findById(req.user.id);
    if (!user) {
      req.log?.warn({ userId: req.user.id }, 'User not found in /auth/me');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (err) {
    req.log?.error({ err }, 'GET /auth/me error');
    res.status(503).json({ error: 'Servicio de autenticación no disponible' });
  }
});

router.post('/register', async (req, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.issues?.[0]?.message || 'Datos inválidos';
      return res.status(400).json({ error: msg });
    }

    const { name, email, password } = parsed.data;
    const provider = await getProvider();
    const existing = await provider.users.findByEmail(email);
    if (existing) {
      req.log?.warn({ email }, 'Register failed — email exists');
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const id = (globalThis as any).crypto?.randomUUID?.() || String(Date.now());

    const created = await provider.users.create({
      id,
      name,
      email,
      password: passwordHash,
      role: 'user',
    });

    const token = jwt.sign(
      { id: created.id, email: created.email, name: created.name, role: created.role },
      getJwtSecret(),
      { expiresIn: '24h' },
    );

    res.status(201).json({
      token,
      user: {
        id: created.id,
        name: created.name,
        email: created.email,
        role: created.role,
        avatar: created.avatar || null,
      },
    });
  } catch (err) {
    req.log?.error({ err }, 'POST /auth/register error');
    res.status(503).json({ error: 'Servicio de autenticación no disponible' });
  }
});

export default router;
