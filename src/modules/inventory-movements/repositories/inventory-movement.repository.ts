import type { Prisma, PrismaClient } from '@prisma/client';
import type { DatabaseClient } from '../../../shared/database/types.js';
import { AbstractRepository } from '../../../shared/base/abstract.repository.js';
import { InventoryMovement } from '../shared/inventory-movement.entity.js';
import type { CreateMovementDTO } from '../shared/movement.dto.js';

export interface IInventoryMovementRepository {
  findAll(filter: { productId?: string }, db?: DatabaseClient): Promise<InventoryMovement[]>;
  create(data: CreateMovementDTO, db?: DatabaseClient): Promise<InventoryMovement>;
}

export class InventoryMovementRepository
  extends AbstractRepository<IInventoryMovementRepository>
  implements IInventoryMovementRepository
{
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findAll(filter: { productId?: string }, db?: DatabaseClient): Promise<InventoryMovement[]> {
    const client = this.resolveDb(db);
    const where: Prisma.InventoryMovementWhereInput =
      filter.productId === undefined ? {} : { productId: filter.productId };

    const rows = await client.inventoryMovement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => InventoryMovement.fromPrisma(row));
  }

  async create(data: CreateMovementDTO, db?: DatabaseClient): Promise<InventoryMovement> {
    const client = this.resolveDb(db);
    const row = await client.inventoryMovement.create({
      data: {
        productId: data.productId,
        type: data.type,
        quantity: data.quantity,
        counterPartyName: data.counterPartyName,
        date: data.date,
      },
    });
    return InventoryMovement.fromPrisma(row);
  }
}
