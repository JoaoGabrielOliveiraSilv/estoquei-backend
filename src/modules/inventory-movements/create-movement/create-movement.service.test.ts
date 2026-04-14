import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import { CreateMovementService } from './create-movement.service.js';
import { Product } from '../../products/shared/product.entity.js';
import { InventoryMovement } from '../shared/inventory-movement.entity.js';
import { BadRequestError, NotFoundError } from '../../../shared/errors/application.errors.js';
import type { IProductRepository } from '../../products/repositories/product.repository.js';
import type { IInventoryMovementRepository } from '../repositories/inventory-movement.repository.js';

const now = new Date();

function makeProduct(quantity = 50): Product {
  return new Product('prod-1', 'Widget', null, null, '📦', quantity, 'normal', now, now);
}

function makeMovement(): InventoryMovement {
  return new InventoryMovement(1, 'prod-1', 'inbound', 10, 'Supplier', '2024-06-01', now);
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

function makePrisma(productRepo: ReturnType<typeof makeProductRepo>, movementRepo: ReturnType<typeof makeMovementRepo>) {
  return {
    $transaction: vi.fn().mockImplementation(
      (fn: (tx: unknown) => Promise<unknown>) => fn({}),
    ),
  };
}

describe('CreateMovementService', () => {
  let productRepo: ReturnType<typeof makeProductRepo>;
  let movementRepo: ReturnType<typeof makeMovementRepo>;
  let mockPrisma: ReturnType<typeof makePrisma>;
  let service: CreateMovementService;

  beforeEach(() => {
    productRepo = makeProductRepo();
    movementRepo = makeMovementRepo();
    mockPrisma = makePrisma(productRepo, movementRepo);
    service = new CreateMovementService(
      productRepo as unknown as IProductRepository,
      movementRepo as unknown as IInventoryMovementRepository,
      mockPrisma as unknown as PrismaClient,
    );
  });

  it('creates the movement and returns it', async () => {
    const product = makeProduct(50);
    const movement = makeMovement();
    productRepo.findById.mockResolvedValue(product);
    productRepo.setQuantity.mockResolvedValue(product);
    movementRepo.create.mockResolvedValue(movement);

    const result = await service.execute({
      productId: 'prod-1',
      type: 'inbound',
      quantity: 10,
      counterPartyName: 'Supplier',
      date: '2024-06-01',
    });

    expect(result).toBe(movement);
  });

  it('throws NotFoundError when product does not exist', async () => {
    productRepo.findById.mockResolvedValue(null);

    await expect(
      service.execute({ productId: 'prod-1', type: 'inbound', quantity: 10, counterPartyName: 'X', date: '2024-06-01' }),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws BadRequestError when outbound exceeds available stock', async () => {
    productRepo.findById.mockResolvedValue(makeProduct(5));

    await expect(
      service.execute({ productId: 'prod-1', type: 'outbound', quantity: 10, counterPartyName: 'X', date: '2024-06-01' }),
    ).rejects.toThrow(BadRequestError);
    await expect(
      service.execute({ productId: 'prod-1', type: 'outbound', quantity: 10, counterPartyName: 'X', date: '2024-06-01' }),
    ).rejects.toThrow('Insufficient stock');
  });

  it('updates product quantity and status after movement', async () => {
    const product = makeProduct(50);
    productRepo.findById.mockResolvedValue(product);
    productRepo.setQuantity.mockResolvedValue(product);
    movementRepo.create.mockResolvedValue(makeMovement());

    await service.execute({
      productId: 'prod-1',
      type: 'inbound',
      quantity: 10,
      counterPartyName: 'Supplier',
      date: '2024-06-01',
    });

    expect(productRepo.setQuantity).toHaveBeenCalledWith(
      'prod-1',
      { quantity: 60, status: 'normal' },
      {},
    );
  });

  it('allows outbound when stock is exactly equal to movement quantity', async () => {
    const product = makeProduct(10);
    productRepo.findById.mockResolvedValue(product);
    productRepo.setQuantity.mockResolvedValue(product);
    movementRepo.create.mockResolvedValue(makeMovement());

    await service.execute({
      productId: 'prod-1',
      type: 'outbound',
      quantity: 10,
      counterPartyName: 'Client',
      date: '2024-06-01',
    });

    expect(productRepo.setQuantity).toHaveBeenCalledWith(
      'prod-1',
      { quantity: 0, status: 'danger' },
      {},
    );
  });
});
