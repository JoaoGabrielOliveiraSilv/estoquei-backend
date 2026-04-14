import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListProductsService } from './list-products.service.js';
import { Product } from '../shared/product.entity.js';
import type { IProductRepository } from '../repositories/product.repository.js';

const now = new Date();

function makeProduct(id: string): Product {
  return new Product(id, 'Product', null, null, '📦', 10, 'normal', now, now);
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

describe('ListProductsService', () => {
  let repo: ReturnType<typeof makeProductRepo>;
  let service: ListProductsService;

  beforeEach(() => {
    repo = makeProductRepo();
    service = new ListProductsService(repo as unknown as IProductRepository);
  });

  it('returns items and pagination metadata', async () => {
    const items = [makeProduct('1'), makeProduct('2')];
    repo.findPaginated.mockResolvedValue({ items, total: 2 });

    const result = await service.execute({ page: 1, limit: 20 });

    expect(result.items).toBe(items);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it('calculates totalPages correctly', async () => {
    repo.findPaginated.mockResolvedValue({ items: [], total: 45 });

    const result = await service.execute({ page: 1, limit: 20 });

    expect(result.totalPages).toBe(3);
  });

  it('returns totalPages 0 when there are no items', async () => {
    repo.findPaginated.mockResolvedValue({ items: [], total: 0 });

    const result = await service.execute({ page: 1, limit: 20 });

    expect(result.totalPages).toBe(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
  });

  it('sets hasPreviousPage false on first page', async () => {
    repo.findPaginated.mockResolvedValue({ items: [], total: 50 });

    const result = await service.execute({ page: 1, limit: 20 });

    expect(result.hasPreviousPage).toBe(false);
  });

  it('sets hasPreviousPage true after first page', async () => {
    repo.findPaginated.mockResolvedValue({ items: [], total: 50 });

    const result = await service.execute({ page: 2, limit: 20 });

    expect(result.hasPreviousPage).toBe(true);
  });

  it('sets hasNextPage true when more pages exist', async () => {
    repo.findPaginated.mockResolvedValue({ items: [], total: 50 });

    const result = await service.execute({ page: 1, limit: 20 });

    expect(result.hasNextPage).toBe(true);
  });

  it('sets hasNextPage false on last page', async () => {
    repo.findPaginated.mockResolvedValue({ items: [], total: 40 });

    const result = await service.execute({ page: 2, limit: 20 });

    expect(result.hasNextPage).toBe(false);
  });
});
