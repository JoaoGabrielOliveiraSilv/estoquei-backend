import { AbstractService } from '../../../shared/base/abstract.service.js';
import { NotFoundError } from '../../../shared/errors/application.errors.js';
import type { IProductRepository } from '../repositories/product.repository.js';
import { Product } from '../shared/product.entity.js';
import type { UpdateProductDTO } from '../shared/product.dto.js';

export class UpdateProductService extends AbstractService<[string, UpdateProductDTO], Product> {
  constructor(private readonly productRepository: IProductRepository) {
    super();
  }

  override async execute(id: string, data: UpdateProductDTO): Promise<Product> {
    const existing = await this.productRepository.findById(id);
    if (existing === null) {
      throw new NotFoundError('Product not found');
    }
    return this.productRepository.update(id, data);
  }
}
