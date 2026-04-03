import type { NextFunction, Request, Response } from 'express';
import { AbstractController } from '../../../shared/base/abstract.controller.js';
import { ListProductsService } from './list-products.service.js';

export class ListProductsController extends AbstractController {
  constructor(private readonly listProductsService: ListProductsService) {
    super();
  }

  async handle(_req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.dispatch(next, async () => {
      const products = await this.listProductsService.execute();
      this.success(
        res,
        200,
        products.map((p) => p.toJSON()),
      );
    });
  }
}
