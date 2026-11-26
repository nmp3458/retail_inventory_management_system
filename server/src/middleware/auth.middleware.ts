import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  AUTH_COOKIE_NAME,
  getJwtSecret,
  JWT_AUDIENCE,
  JWT_ISSUER
} from '../config/auth.ts';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  let payload: string | jwt.JwtPayload;
  try {
    payload = jwt.verify(token, getJwtSecret(), {
      algorithms: ['HS256'],
      audience: JWT_AUDIENCE,
      issuer: JWT_ISSUER
    });
  } catch {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  if (typeof payload === 'string' || typeof payload.sub !== 'string') {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  res.locals.userId = payload.sub;
  next();
}
