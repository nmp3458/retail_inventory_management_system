import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.ts';
import {
  AUTH_COOKIE_NAME,
  getJwtSecret,
  JWT_AUDIENCE,
  JWT_ISSUER
} from '../config/auth.ts';
import { requireAuth } from '../middleware/auth.middleware.ts';

const router = Router();
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/api'
};

router.post('/login', async (req, res) => {
  const email = typeof req.body?.email === 'string'
    ? req.body.email.trim().toLowerCase()
    : '';
  const password = typeof req.body?.password === 'string'
    ? req.body.password
    : '';
  const rememberMe = req.body?.rememberMe === true;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const expiresIn = rememberMe ? '7d' : '8h';
  const token = jwt.sign({}, getJwtSecret(), {
    algorithm: 'HS256',
    audience: JWT_AUDIENCE,
    expiresIn,
    issuer: JWT_ISSUER,
    subject: user.id
  });
  const maxAge = rememberMe
    ? 7 * 24 * 60 * 60 * 1000
    : 8 * 60 * 60 * 1000;

  res.cookie(AUTH_COOKIE_NAME, token, { ...cookieOptions, maxAge });
  return res.status(200).json({
    user: { id: user.id, email: user.email }
  });
});

router.get('/me', requireAuth, async (_req, res) => {
  const user = await User.findById(res.locals.userId).select('email');
  if (!user) {
    res.clearCookie(AUTH_COOKIE_NAME, cookieOptions);
    return res.status(401).json({ message: 'Authentication required' });
  }

  return res.status(200).json({
    user: { id: user.id, email: user.email }
  });
});

router.post('/logout', (_req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, cookieOptions);
  return res.status(204).end();
});

export default router;
