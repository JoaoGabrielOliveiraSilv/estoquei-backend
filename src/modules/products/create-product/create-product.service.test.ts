import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateProductService } from './create-product.service.js';
import { Product } from '../shared/product.entity.js';
import type { IProductRepository } from '../repositories/product.repository.js';

const now = new Date();

function makeProduct(): Product {
  return new Product('id-1', 'Widget', null, null, '📦', 0, 'danger', now, now);
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

describe('CreateProductService', () => {
  let repo: ReturnType<typeof makeProductRepo>;
  let service: CreateProductService;

  beforeEach(() => {
    repo = makeProductRepo();
    service = new CreateProductService(repo as unknown as IProductRepository);
  });

  it('calls repository.create with quantity 0 and status danger', async () => {
    const product = makeProduct();
    repo.create.mockResolvedValue(product);

    await service.execute({ name: 'Widget', emoji: '📦' });

    expect(repo.create).toHaveBeenCalledWith({
      name: 'Widget',
      emoji: '📦',
      quantity: 0,
      status: 'danger',
    });
  });

  it('returns the created product', async () => {
    const product = makeProduct();
    repo.create.mockResolvedValue(product);

    const result = await service.execute({ name: 'Widget', emoji: '📦' });

    expect(result).toBe(product);
  });
});
