import type { NextFunction, Request, Response } from 'express';
import { AbstractController } from '../../../shared/base/abstract.controller.js';
import { CreateProductService } from './create-product.service.js';
import type { CreateProductDTO } from '../shared/product.dto.js';

export class CreateProductController extends AbstractController {
  constructor(private readonly createProductService: CreateProductService) {
    super();
  }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.dispatch(next, async () => {
      const body = req.body as CreateProductDTO;
      const product = await this.createProductService.execute(body);
      this.success(res, 201, product.toJSON(), 'Product created');
    });
  }
}
