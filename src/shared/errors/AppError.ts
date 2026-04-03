import { HttpError } from './HttpError.js';

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toHttpError(): HttpError {
    return new HttpError(this.statusCode, this.message, false);
  }
}
