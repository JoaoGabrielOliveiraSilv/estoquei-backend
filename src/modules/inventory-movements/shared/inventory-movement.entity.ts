import type { InventoryMovement as PrismaInventoryMovement } from '@prisma/client';

export type MovementType = 'inbound' | 'outbound';

export class InventoryMovement {
  constructor(
    public readonly id: number,
    public readonly productId: string,
    public readonly type: MovementType,
    public readonly quantity: number,
    public readonly counterPartyName: string,
    public readonly date: string,
    public readonly createdAt: Date,
  ) {}

  static fromPrisma(row: PrismaInventoryMovement): InventoryMovement {
    return new InventoryMovement(
      row.id,
      row.productId,
      row.type as MovementType,
      row.quantity,
      row.counterPartyName,
      row.date,
      row.createdAt,
    );
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      productId: this.productId,
      type: this.type,
      quantity: this.quantity,
      counterPartyName: this.counterPartyName,
      date: this.date,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
