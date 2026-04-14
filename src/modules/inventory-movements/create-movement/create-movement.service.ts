import type { PrismaClient } from '@prisma/client';
import { AbstractService } from '../../../shared/base/abstract.service.js';
import { BadRequestError, NotFoundError } from '../../../shared/errors/application.errors.js';
import type { IProductRepository } from '../../products/repositories/product.repository.js';
import type { IInventoryMovementRepository } from '../repositories/inventory-movement.repository.js';
import { InventoryMovement } from '../shared/inventory-movement.entity.js';
import type { CreateMovementDTO } from '../shared/movement.dto.js';
import { getProductStatusByQuantity } from '../utils/get-product-status-by-quantity.js';
import { calculateNextQuantityByMovement } from '../utils/calculate-next-quantity-by-movement.js';

export class CreateMovementService extends AbstractService<[CreateMovementDTO], InventoryMovement> {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly inventoryMovementRepository: IInventoryMovementRepository,
    private readonly prisma: PrismaClient,
  ) {
    super();
  }

  override async execute(data: CreateMovementDTO): Promise<InventoryMovement> {
    return this.prisma.$transaction(async (tx) => {
      const product = await this.productRepository.findById(data.productId, tx);
      if (product === null) {
        throw new NotFoundError('Product not found');
      }

      if (data.type === 'outbound' && product.quantity < data.quantity) {
        throw new BadRequestError('Insufficient stock for outbound movement');
      }

      const nextQuantity = calculateNextQuantityByMovement(product.quantity, {
        type: data.type,
        quantity: data.quantity,
      });

      await this.productRepository.setQuantity(product.id, {
        quantity: nextQuantity,
        status: getProductStatusByQuantity(nextQuantity),
      }, tx);

      return this.inventoryMovementRepository.create(data, tx);
    });
  }
}
