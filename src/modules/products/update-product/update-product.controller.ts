import type { NextFunction, Request, Response } from 'express';
import { AbstractController } from '../../../shared/base/abstract.controller.js';
import { UpdateProductService } from './update-product.service.js';
import type { UpdateProductDTO } from '../shared/product.dto.js';

export class UpdateProductController extends AbstractController {
  constructor(private readonly updateProductService: UpdateProductService) {
    super();
  }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.dispatch(next, async () => {
      const { id } = req.params as { id: string };
      const body = req.body as UpdateProductDTO;
      const product = await this.updateProductService.execute(id, body);
      this.success(res, 200, product.toJSON(), 'Product updated');
    });
  }
}
