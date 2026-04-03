import type { NextFunction, Request, Response } from 'express';
import { resolveToHttpError } from '../errors/resolveToHttpError.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const http = resolveToHttpError(err);

  if (http.logAsInternal) {
    console.error(err);
  }

  res.status(http.statusCode).json({
    error: http.message,
    statusCode: http.statusCode,
  });
}
