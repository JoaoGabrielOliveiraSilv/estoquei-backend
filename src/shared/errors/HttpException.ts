import { AppError } from './AppError.js';

export class HttpException extends AppError {
  constructor(message: string, statusCode = 400) {
    super(message, statusCode);
    this.name = 'HttpException';
    Object.setPrototypeOf(this, HttpException.prototype);
  }
}
