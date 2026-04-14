import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListMovementsService } from './list-movements.service.js';
import { Product } from '../../products/shared/product.entity.js';
import { InventoryMovement } from '../shared/inventory-movement.entity.js';
import { NotFoundError } from '../../../shared/errors/application.errors.js';
import type { IProductRepository } from '../../products/repositories/product.repository.js';
import type { IInventoryMovementRepository } from '../repositories/inventory-movement.repository.js';

const now = new Date();

function makeProduct(): Product {
  return new Product('prod-1', 'Widget', null, null, '📦', 10, 'normal', now, now);
}

function makeMovement(id: number): InventoryMovement {
  return new InventoryMovement(id, 'prod-1', 'inbound', 10, 'Supplier', '2024-06-01', now);
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

function makeMovementRepo() {
  return {
    findAll: vi.fn(),
    create: vi.fn(),
  };
}

describe('ListMovementsService', () => {
  let productRepo: ReturnType<typeof makeProductRepo>;
  let movementRepo: ReturnType<typeof makeMovementRepo>;
  let service: ListMovementsService;

  beforeEach(() => {
    productRepo = makeProductRepo();
    movementRepo = makeMovementRepo();
    service = new ListMovementsService(
      productRepo as unknown as IProductRepository,
      movementRepo as unknown as IInventoryMovementRepository,
    );
  });

  it('returns movements for the product', async () => {
    const movements = [makeMovement(1), makeMovement(2)];
    productRepo.findById.mockResolvedValue(makeProduct());
    movementRepo.findAll.mockResolvedValue(movements);

    const result = await service.execute('prod-1');

    expect(result).toBe(movements);
    expect(movementRepo.findAll).toHaveBeenCalledWith({ productId: 'prod-1' });
  });

  it('throws NotFoundError when product does not exist', async () => {
    productRepo.findById.mockResolvedValue(null);

    await expect(service.execute('prod-1')).rejects.toThrow(NotFoundError);
  });

  it('does not query movements when product is not found', async () => {
    productRepo.findById.mockResolvedValue(null);

    await service.execute('prod-1').catch(() => {});

    expect(movementRepo.findAll).not.toHaveBeenCalled();
  });
});
