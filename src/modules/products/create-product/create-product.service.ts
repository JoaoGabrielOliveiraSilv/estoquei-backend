import { AbstractService } from '../../../shared/base/abstract.service.js';
import type { IProductRepository } from '../repositories/product.repository.js';
import { Product } from '../shared/product.entity.js';
import type { CreateProductDTO } from '../shared/product.dto.js';

export class CreateProductService extends AbstractService<[CreateProductDTO], Product> {
  constructor(private readonly productRepository: IProductRepository) {
    super();
  }

  override async execute(data: CreateProductDTO): Promise<Product> {
    return this.productRepository.create(data);
  }
}
