import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

vi.mock('../../env.js', () => ({
  env: { JWT_SECRET: 'test-secret' },
}));

import { authMiddleware } from './auth.js';

const JWT_SECRET = 'test-secret';

function makeReq(overrides: Partial<{ headers: Record<string, string> }> = {}): Request {
  return { headers: {}, ...overrides } as unknown as Request;
}

const res = {} as Response;

describe('authMiddleware', () => {
  let next: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    next = vi.fn();
  });

  it('calls next with UnauthorizedError when Authorization header is missing', () => {
    authMiddleware(makeReq(), res, next as NextFunction);

    expect(next).toHaveBeenCalledOnce();
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(401);
  });

  it('calls next with UnauthorizedError when header does not start with Bearer', () => {
    authMiddleware(makeReq({ headers: { authorization: 'Basic abc' } }), res, next as NextFunction);

    expect(next).toHaveBeenCalledOnce();
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(401);
  });

  it('calls next with UnauthorizedError when token is empty', () => {
    authMiddleware(makeReq({ headers: { authorization: 'Bearer ' } }), res, next as NextFunction);

    expect(next).toHaveBeenCalledOnce();
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(401);
  });

  it('calls next with UnauthorizedError when token is invalid', () => {
    authMiddleware(makeReq({ headers: { authorization: 'Bearer not.a.valid.token' } }), res, next as NextFunction);

    expect(next).toHaveBeenCalledOnce();
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(401);
  });

  it('sets req.user.id and calls next without error when token is valid', () => {
    const token = jwt.sign({ sub: 'user-123' }, JWT_SECRET);
    const req = makeReq({ headers: { authorization: `Bearer ${token}` } }) as Request & { user?: { id: string } };

    authMiddleware(req, res, next as NextFunction);

    expect(next).toHaveBeenCalledWith();
    expect(req.user?.id).toBe('user-123');
  });

  it('calls next with UnauthorizedError when token has no sub claim', () => {
    const token = jwt.sign({ data: 'no-sub' }, JWT_SECRET);

    authMiddleware(makeReq({ headers: { authorization: `Bearer ${token}` } }), res, next as NextFunction);

    expect(next).toHaveBeenCalledOnce();
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(401);
  });

  it('calls next with UnauthorizedError when token is expired', () => {
    const token = jwt.sign({ sub: 'user-123' }, JWT_SECRET, { expiresIn: -1 });

    authMiddleware(makeReq({ headers: { authorization: `Bearer ${token}` } }), res, next as NextFunction);

    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(401);
  });
});
