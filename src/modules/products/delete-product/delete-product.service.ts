import { AbstractService } from '../../../shared/base/abstract.service.js';
import { NotFoundError } from '../../../shared/errors/application.errors.js';
import type { IProductRepository } from '../repositories/product.repository.js';

export class DeleteProductService extends AbstractService<[string], void> {
  constructor(private readonly productRepository: IProductRepository) {
    super();
  }

  override async execute(id: string): Promise<void> {
    const existing = await this.productRepository.findById(id);
    if (existing === null) {
      throw new NotFoundError('Product not found');
    }
    await this.productRepository.delete(id);
  }
}
