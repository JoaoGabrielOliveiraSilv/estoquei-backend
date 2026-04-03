import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ZodError } from 'zod';
import { AppError } from './AppError.js';
import { HttpError } from './HttpError.js';

function formatZodMessage(err: ZodError): string {
  const first = err.issues[0];
  if (first === undefined) {
    return 'Validation failed';
  }
  const path = first.path.length > 0 ? first.path.join('.') : 'request';
  return `${path}: ${first.message}`;
}

export function resolveToHttpError(err: unknown): HttpError {
  if (err instanceof AppError) {
    return err.toHttpError();
  }

  if (err instanceof ZodError) {
    return new HttpError(422, formatZodMessage(err), false);
  }

  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2025':
        return new HttpError(404, 'Resource not found', false);
      case 'P2002':
        return new HttpError(409, 'Resource already exists', false);
      case 'P2003':
        return new HttpError(400, 'Invalid reference', false);
      default:
        return new HttpError(500, 'Internal server error', true);
    }
  }

  return new HttpError(500, 'Internal server error', true);
}
