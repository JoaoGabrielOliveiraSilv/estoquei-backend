import type { NextFunction, Request, Response } from 'express';
import { AbstractController } from '../../../shared/base/abstract.controller.js';
import { ListMovementsService } from './list-movements.service.js';

export class ListMovementsController extends AbstractController {
  constructor(private readonly listMovementsService: ListMovementsService) {
    super();
  }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.dispatch(next, async () => {
      const { productId } = req.params as { productId: string };
      const movements = await this.listMovementsService.execute(productId);
      this.success(
        res,
        200,
        movements.map((m) => m.toJSON()),
      );
    });
  }
}
