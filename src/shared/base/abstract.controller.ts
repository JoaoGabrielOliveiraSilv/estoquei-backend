import type { NextFunction, Response } from 'express';

export abstract class AbstractController {
  protected constructor() {}

  protected success<T>(res: Response, statusCode: number, data: T, message?: string): void {
    if (message !== undefined) {
      res.status(statusCode).json({ data, message });
      return;
    }
    res.status(statusCode).json({ data });
  }

  protected async dispatch(next: NextFunction, action: () => Promise<void>): Promise<void> {
    try {
      await action();
    } catch (err) {
      next(err);
    }
  }
}
