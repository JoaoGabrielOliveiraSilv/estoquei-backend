import { AbstractService } from '../../../shared/base/abstract.service.js';
import { NotFoundError } from '../../../shared/errors/application.errors.js';
import type { IProductRepository } from '../repositories/product.repository.js';
import { Product } from '../shared/product.entity.js';

export class GetProductByIdService extends AbstractService<[string], Product> {
  constructor(private readonly productRepository: IProductRepository) {
    super();
  }

  override async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (product === null) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }
}
