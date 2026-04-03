import type { Product as PrismaProduct } from '@prisma/client';

export type ProductStatus = 'normal' | 'warning' | 'danger';

export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly imageUrl: string | null,
    public readonly emoji: string,
    public readonly quantity: number,
    public readonly status: ProductStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(row: PrismaProduct): Product {
    return new Product(
      row.id,
      row.name,
      row.description,
      row.imageUrl,
      row.emoji,
      row.quantity,
      row.status as ProductStatus,
      row.createdAt,
      row.updatedAt,
    );
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      imageUrl: this.imageUrl,
      emoji: this.emoji,
      quantity: this.quantity,
      status: this.status,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
