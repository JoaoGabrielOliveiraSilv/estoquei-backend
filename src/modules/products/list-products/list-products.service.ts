import { AbstractService } from '../../../shared/base/abstract.service.js';
import type { IProductRepository } from '../repositories/product.repository.js';
import { Product } from '../shared/product.entity.js';
import type { ListProductsQueryDTO } from '../shared/product.dto.js';

export type ListProductsResult = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export class ListProductsService extends AbstractService<[ListProductsQueryDTO], ListProductsResult> {
  constructor(private readonly productRepository: IProductRepository) {
    super();
  }

  override async execute(query: ListProductsQueryDTO): Promise<ListProductsResult> {
    const { page, limit } = query;
    const { items, total } = await this.productRepository.findPaginated({ page, limit });
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
    const hasPreviousPage = page > 1;
    const hasNextPage = totalPages > 0 && page < totalPages;
    return { items, total, page, limit, totalPages, hasNextPage, hasPreviousPage };
  }
}
