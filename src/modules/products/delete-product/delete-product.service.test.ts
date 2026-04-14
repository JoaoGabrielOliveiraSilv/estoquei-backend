import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteProductService } from './delete-product.service.js';
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

describe('DeleteProductService', () => {
  let repo: ReturnType<typeof makeProductRepo>;
  let service: DeleteProductService;

  beforeEach(() => {
    repo = makeProductRepo();
    service = new DeleteProductService(repo as unknown as IProductRepository);
  });

  it('deletes the product when found', async () => {
    repo.findById.mockResolvedValue(makeProduct());
    repo.delete.mockResolvedValue(undefined);

    await service.execute('id-1');

    expect(repo.delete).toHaveBeenCalledWith('id-1');
  });

  it('throws NotFoundError when product does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.execute('id-1')).rejects.toThrow(NotFoundError);
  });

  it('does not call delete when product is not found', async () => {
    repo.findById.mockResolvedValue(null);

    await service.execute('id-1').catch(() => {});

    expect(repo.delete).not.toHaveBeenCalled();
  });
});
