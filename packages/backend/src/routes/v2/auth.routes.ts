import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginSchema } from '@minamatch/shared';
import { getProvider } from '@minamatch/database';
import { getJwtSecret, authMiddleware, AuthRequest } from '../../middleware/auth.middleware';

const router: Router = Router();

// POST /api/v2/auth/login — autenticación con DatabaseProvider híbrido
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
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      getJwtSecret(),
      { expiresIn: '24h' },
    );

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
    console.error('[V2] POST /auth/login error:', err);
    res.status(503).json({ error: 'Servicio de autenticación no disponible' });
  }
});

// GET /api/v2/auth/me — perfil del usuario autenticado
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (req.user.role === 'guest') {
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
    console.error('[V2] GET /auth/me error:', err);
    res.status(503).json({ error: 'Servicio de autenticación no disponible' });
  }
});

export default router;
