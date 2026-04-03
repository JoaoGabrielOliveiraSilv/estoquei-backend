import { AbstractService } from '../../../shared/base/abstract.service.js';
import { NotFoundError } from '../../../shared/errors/application.errors.js';
import type { IProductRepository } from '../../products/repositories/product.repository.js';
import type { IInventoryMovementRepository } from '../repositories/inventory-movement.repository.js';
import { InventoryMovement } from '../shared/inventory-movement.entity.js';

export class ListMovementsService extends AbstractService<[string], InventoryMovement[]> {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly inventoryMovementRepository: IInventoryMovementRepository,
  ) {
    super();
  }

  override async execute(productId: string): Promise<InventoryMovement[]> {
    const product = await this.productRepository.findById(productId);
    if (product === null) {
      throw new NotFoundError('Product not found');
    }
    return this.inventoryMovementRepository.findAll({ productId });
  }
}
