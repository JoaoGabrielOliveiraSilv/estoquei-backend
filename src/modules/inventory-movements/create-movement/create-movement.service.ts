import type { PrismaClient } from '@prisma/client';
import { AbstractService } from '../../../shared/base/abstract.service.js';
import { BadRequestError, NotFoundError } from '../../../shared/errors/application.errors.js';
import type { IProductRepository } from '../../products/repositories/product.repository.js';
import type { IInventoryMovementRepository } from '../repositories/inventory-movement.repository.js';
import { InventoryMovement } from '../shared/inventory-movement.entity.js';
import type { CreateMovementDTO } from '../shared/movement.dto.js';

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

      const nextQuantity =
        data.type === 'inbound' ? product.quantity + data.quantity : product.quantity - data.quantity;

      await this.productRepository.setQuantity(product.id, nextQuantity, tx);

      return this.inventoryMovementRepository.create(data, tx);
    });
  }
}
