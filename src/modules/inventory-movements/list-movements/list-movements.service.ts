import { AbstractService } from '../../../shared/base/abstract.service.js';
import type { IInventoryMovementRepository } from '../repositories/inventory-movement.repository.js';
import { InventoryMovement } from '../shared/inventory-movement.entity.js';

export class ListMovementsService extends AbstractService<
  [{ productId?: string }],
  InventoryMovement[]
> {
  constructor(private readonly inventoryMovementRepository: IInventoryMovementRepository) {
    super();
  }

  override async execute(filter: { productId?: string }): Promise<InventoryMovement[]> {
    return this.inventoryMovementRepository.findAll(filter);
  }
}
