import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateProductService } from './update-product.service.js';
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

describe('UpdateProductService', () => {
  let repo: ReturnType<typeof makeProductRepo>;
  let service: UpdateProductService;

  beforeEach(() => {
    repo = makeProductRepo();
    service = new UpdateProductService(repo as unknown as IProductRepository);
  });

  it('returns the updated product', async () => {
    const existing = makeProduct();
    const updated = new Product('id-1', 'Updated Widget', null, null, '🔧', 10, 'normal', now, now);
    repo.findById.mockResolvedValue(existing);
    repo.update.mockResolvedValue(updated);

    const result = await service.execute('id-1', { name: 'Updated Widget', emoji: '🔧' });

    expect(result).toBe(updated);
    expect(repo.update).toHaveBeenCalledWith('id-1', { name: 'Updated Widget', emoji: '🔧' });
  });

  it('throws NotFoundError when product does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.execute('id-1', { name: 'X' })).rejects.toThrow(NotFoundError);
  });

  it('does not call update when product is not found', async () => {
    repo.findById.mockResolvedValue(null);

    await service.execute('id-1', { name: 'X' }).catch(() => {});

    expect(repo.update).not.toHaveBeenCalled();
  });
});
