import { AbstractService } from '../../../shared/base/abstract.service.js';
import type { IProductRepository } from '../repositories/product.repository.js';
import { Product } from '../shared/product.entity.js';

export class ListProductsService extends AbstractService<[], Product[]> {
  constructor(private readonly productRepository: IProductRepository) {
    super();
  }

  override async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
