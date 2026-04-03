import type { NextFunction, Request, Response } from 'express';
import { AbstractController } from '../../../shared/base/abstract.controller.js';
import { ListMovementsService } from './list-movements.service.js';
import type { ListMovementsQueryDTO } from '../shared/movement.dto.js';

export class ListMovementsController extends AbstractController {
  constructor(private readonly listMovementsService: ListMovementsService) {
    super();
  }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.dispatch(next, async () => {
      const query = req.query as unknown as ListMovementsQueryDTO;
      const filter: { productId?: string } =
        query.productId === undefined ? {} : { productId: query.productId };

      const movements = await this.listMovementsService.execute(filter);
      this.success(
        res,
        200,
        movements.map((m) => m.toJSON()),
      );
    });
  }
}
