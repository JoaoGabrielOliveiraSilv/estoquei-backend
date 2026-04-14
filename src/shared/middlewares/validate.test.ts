import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateBody, validateParams, validateQuery } from './validate.js';
import { UnprocessableEntityError } from '../errors/application.errors.js';

const schema = z.object({ name: z.string().min(1) });

function makeNext(): ReturnType<typeof vi.fn> {
  return vi.fn();
}

describe('validateBody', () => {
  const middleware = validateBody(schema);

  it('parses valid body and calls next without error', () => {
    const req = { body: { name: 'Widget' } } as Request;
    const next = makeNext();

    middleware(req, {} as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ name: 'Widget' });
  });

  it('calls next with UnprocessableEntityError on invalid body', () => {
    const req = { body: { name: '' } } as Request;
    const next = makeNext();

    middleware(req, {} as Response, next as NextFunction);

    expect(next).toHaveBeenCalledOnce();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(UnprocessableEntityError);
    expect(err.statusCode).toBe(422);
  });

  it('calls next with UnprocessableEntityError when required field is missing', () => {
    const req = { body: {} } as Request;
    const next = makeNext();

    middleware(req, {} as Response, next as NextFunction);

    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(UnprocessableEntityError);
  });
});

describe('validateQuery', () => {
  const middleware = validateQuery(schema);

  it('parses valid query and calls next without error', () => {
    const req = { query: { name: 'Widget' } } as unknown as Request;
    const next = makeNext();

    middleware(req, {} as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith();
    expect(req.query).toMatchObject({ name: 'Widget' });
  });

  it('calls next with UnprocessableEntityError on invalid query', () => {
    const req = { query: {} } as unknown as Request;
    const next = makeNext();

    middleware(req, {} as Response, next as NextFunction);

    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(UnprocessableEntityError);
  });
});

describe('validateParams', () => {
  const middleware = validateParams(schema);

  it('parses valid params and calls next without error', () => {
    const req = { params: { name: 'Widget' } } as unknown as Request;
    const next = makeNext();

    middleware(req, {} as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith();
    expect(req.params).toMatchObject({ name: 'Widget' });
  });

  it('calls next with UnprocessableEntityError on invalid params', () => {
    const req = { params: {} } as unknown as Request;
    const next = makeNext();

    middleware(req, {} as Response, next as NextFunction);

    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(UnprocessableEntityError);
  });
});
