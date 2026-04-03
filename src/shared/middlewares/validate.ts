import type { NextFunction, Request, Response } from 'express';
import type { ZodError, ZodSchema } from 'zod';
import { UnprocessableEntityError } from '../errors/application.errors.js';

function formatZodMessage(error: ZodError): string {
  const first = error.issues[0];
  if (first === undefined) {
    return 'Validation failed';
  }
  const path = first.path.length > 0 ? first.path.join('.') : 'request';
  return `${path}: ${first.message}`;
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(new UnprocessableEntityError(formatZodMessage(result.error)));
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      next(new UnprocessableEntityError(formatZodMessage(result.error)));
      return;
    }
    Object.assign(req.query, result.data);
    next();
  };
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      next(new UnprocessableEntityError(formatZodMessage(result.error)));
      return;
    }
    Object.assign(req.params, result.data);
    next();
  };
}
