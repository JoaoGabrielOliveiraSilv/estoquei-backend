import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { errorHandler } from './errorHandler.js';
import { NotFoundError, BadRequestError } from '../errors/application.errors.js';

function makeRes() {
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  return { status, json, _status: status, _json: json } as unknown as Response & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
  };
}

const req = {} as Request;
const next = vi.fn() as unknown as NextFunction;

describe('errorHandler', () => {
  let res: ReturnType<typeof makeRes>;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    res = makeRes();
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns the correct status code and message for an AppError', () => {
    errorHandler(new NotFoundError('Product not found'), req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.status(404).json).toHaveBeenCalledWith({
      error: 'Product not found',
      statusCode: 404,
    });
  });

  it('returns 400 for a BadRequestError', () => {
    errorHandler(new BadRequestError('Bad input'), req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 500 for an unknown error', () => {
    errorHandler(new Error('boom'), req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('logs unknown errors to console.error', () => {
    const err = new Error('unexpected');

    errorHandler(err, req, res, next);

    expect(consoleSpy).toHaveBeenCalledWith(err);
  });

  it('does not log AppErrors to console.error', () => {
    errorHandler(new NotFoundError('not found'), req, res, next);

    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
