import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../env.js';
import { UnauthorizedError } from '../errors/application.errors.js';

interface JwtPayload {
  sub: string;
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (header === undefined || !header.startsWith('Bearer ')) {
    next(new UnauthorizedError('Missing or invalid Authorization header'));
    return;
  }

  const token = header.slice('Bearer '.length).trim();
  if (token.length === 0) {
    next(new UnauthorizedError('Missing token'));
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    if (typeof decoded.sub !== 'string' || decoded.sub.length === 0) {
      next(new UnauthorizedError('Invalid token payload'));
      return;
    }
    req.user = { id: decoded.sub };
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}
