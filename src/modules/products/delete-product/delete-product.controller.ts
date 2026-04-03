import type { NextFunction, Request, Response } from 'express';
import { AbstractController } from '../../../shared/base/abstract.controller.js';
import { DeleteProductService } from './delete-product.service.js';

export class DeleteProductController extends AbstractController {
  constructor(private readonly deleteProductService: DeleteProductService) {
    super();
  }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.dispatch(next, async () => {
      const { id } = req.params as { id: string };
      await this.deleteProductService.execute(id);
      this.success(res, 200, null, 'Product deleted');
    });
  }
}
