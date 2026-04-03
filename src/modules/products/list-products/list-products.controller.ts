import type { NextFunction, Request, Response } from 'express';
import { AbstractController } from '../../../shared/base/abstract.controller.js';
import type { ListProductsQueryDTO } from '../shared/product.dto.js';
import { ListProductsService } from './list-products.service.js';

export class ListProductsController extends AbstractController {
  constructor(private readonly listProductsService: ListProductsService) {
    super();
  }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.dispatch(next, async () => {
      const query = req.query as unknown as ListProductsQueryDTO;
      const result = await this.listProductsService.execute(query);
      this.success(res, 200, {
        items: result.items.map((p) => p.toJSON()),
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
      });
    });
  }
}
