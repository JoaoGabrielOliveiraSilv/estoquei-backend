import { AppError } from './AppError.js';

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'BadRequestError';
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string) {
    super(message, 422);
    this.name = 'UnprocessableEntityError';
    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
