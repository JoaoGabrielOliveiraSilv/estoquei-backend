import { describe, it, expect } from 'vitest';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { resolveToHttpError } from './resolveToHttpError.js';
import { NotFoundError, BadRequestError, UnauthorizedError } from './application.errors.js';

function makePrismaError(code: string): PrismaClientKnownRequestError {
  return new PrismaClientKnownRequestError('DB error', { code, clientVersion: '6.5.0' });
}

describe('resolveToHttpError', () => {
  describe('AppError subclasses', () => {
    it('maps NotFoundError to 404', () => {
      const result = resolveToHttpError(new NotFoundError('not found'));
      expect(result.statusCode).toBe(404);
      expect(result.message).toBe('not found');
      expect(result.logAsInternal).toBe(false);
    });

    it('maps BadRequestError to 400', () => {
      const result = resolveToHttpError(new BadRequestError('bad input'));
      expect(result.statusCode).toBe(400);
    });

    it('maps UnauthorizedError to 401', () => {
      const result = resolveToHttpError(new UnauthorizedError('unauthorized'));
      expect(result.statusCode).toBe(401);
    });
  });

  describe('ZodError', () => {
    it('maps ZodError to 422 with field path in message', () => {
      const zodErr = ZodError.create([
        { code: 'too_small', minimum: 1, type: 'string', inclusive: true, message: 'Too small', path: ['name'] },
      ]);

      const result = resolveToHttpError(zodErr);

      expect(result.statusCode).toBe(422);
      expect(result.message).toContain('name');
      expect(result.logAsInternal).toBe(false);
    });
  });

  describe('PrismaClientKnownRequestError', () => {
    it('maps P2025 (not found) to 404', () => {
      const result = resolveToHttpError(makePrismaError('P2025'));
      expect(result.statusCode).toBe(404);
      expect(result.logAsInternal).toBe(false);
    });

    it('maps P2002 (unique constraint) to 409', () => {
      const result = resolveToHttpError(makePrismaError('P2002'));
      expect(result.statusCode).toBe(409);
    });

    it('maps P2003 (foreign key) to 400', () => {
      const result = resolveToHttpError(makePrismaError('P2003'));
      expect(result.statusCode).toBe(400);
    });

    it('maps unknown Prisma error code to 500 and marks for logging', () => {
      const result = resolveToHttpError(makePrismaError('P9999'));
      expect(result.statusCode).toBe(500);
      expect(result.logAsInternal).toBe(true);
    });
  });

  describe('unknown errors', () => {
    it('maps a plain Error to 500 and marks for logging', () => {
      const result = resolveToHttpError(new Error('boom'));
      expect(result.statusCode).toBe(500);
      expect(result.logAsInternal).toBe(true);
    });

    it('maps a non-Error value to 500', () => {
      const result = resolveToHttpError('string error');
      expect(result.statusCode).toBe(500);
    });
  });
});
