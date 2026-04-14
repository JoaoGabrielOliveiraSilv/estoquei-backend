import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetProductByIdService } from './get-product-by-id.service.js';
import { Product } from '../shared/product.entity.js';
import { NotFoundError } from '../../../shared/errors/application.errors.js';
import type { IProductRepository } from '../repositories/product.repository.js';

const now = new Date();

function makeProduct(): Product {
  return new Product('id-1', 'Widget', null, null, '📦', 10, 'normal', now, now);
}

function makeProductRepo() {
  return {
    findPaginated: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    setQuantity: vi.fn(),
  };
}

describe('GetProductByIdService', () => {
  let repo: ReturnType<typeof makeProductRepo>;
  let service: GetProductByIdService;

  beforeEach(() => {
    repo = makeProductRepo();
    service = new GetProductByIdService(repo as unknown as IProductRepository);
  });

  it('returns the product when found', async () => {
    const product = makeProduct();
    repo.findById.mockResolvedValue(product);

    const result = await service.execute('id-1');

    expect(result).toBe(product);
    expect(repo.findById).toHaveBeenCalledWith('id-1');
  });

  it('throws NotFoundError when product does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.execute('id-1')).rejects.toThrow(NotFoundError);
    await expect(service.execute('id-1')).rejects.toThrow('Product not found');
  });
});
