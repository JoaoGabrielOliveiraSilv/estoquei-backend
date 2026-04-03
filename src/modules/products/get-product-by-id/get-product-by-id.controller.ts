import type { NextFunction, Request, Response } from 'express';
import { AbstractController } from '../../../shared/base/abstract.controller.js';
import { GetProductByIdService } from './get-product-by-id.service.js';

export class GetProductByIdController extends AbstractController {
  constructor(private readonly getProductByIdService: GetProductByIdService) {
    super();
  }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.dispatch(next, async () => {
      const { id } = req.params as { id: string };
      const product = await this.getProductByIdService.execute(id);
      this.success(res, 200, product.toJSON());
    });
  }
}
