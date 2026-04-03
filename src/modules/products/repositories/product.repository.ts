import type { PrismaClient } from '@prisma/client';
import type { DatabaseClient } from '../../../shared/database/types.js';
import { AbstractRepository } from '../../../shared/base/abstract.repository.js';
import { Product } from '../shared/product.entity.js';
import type { CreateProductDTO, UpdateProductDTO } from '../shared/product.dto.js';

export interface IProductRepository {
  findPaginated(
    params: { page: number; limit: number },
    db?: DatabaseClient,
  ): Promise<{ items: Product[]; total: number }>;
  findById(id: string, db?: DatabaseClient): Promise<Product | null>;
  create(data: CreateProductDTO, db?: DatabaseClient): Promise<Product>;
  update(id: string, data: UpdateProductDTO, db?: DatabaseClient): Promise<Product>;
  delete(id: string, db?: DatabaseClient): Promise<void>;
  setQuantity(id: string, quantity: number, db?: DatabaseClient): Promise<Product>;
}

export class ProductRepository
  extends AbstractRepository<IProductRepository>
  implements IProductRepository
{
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findPaginated(
    params: { page: number; limit: number },
    db?: DatabaseClient,
  ): Promise<{ items: Product[]; total: number }> {
    const client = this.resolveDb(db);
    const skip = (params.page - 1) * params.limit;
    const [rows, total] = await Promise.all([
      client.product.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: params.limit,
      }),
      client.product.count(),
    ]);
    return {
      items: rows.map((row: Parameters<typeof Product.fromPrisma>[0]) => Product.fromPrisma(row)),
      total,
    };
  }

  async findById(id: string, db?: DatabaseClient): Promise<Product | null> {
    const client = this.resolveDb(db);
    const row = await client.product.findUnique({ where: { id } });
    return row === null ? null : Product.fromPrisma(row);
  }

  async create(data: CreateProductDTO, db?: DatabaseClient): Promise<Product> {
    const client = this.resolveDb(db);
    const row = await client.product.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        imageUrl: data.imageUrl ?? null,
        emoji: data.emoji,
        quantity: data.quantity,
        status: data.status,
      },
    });
    return Product.fromPrisma(row);
  }

  async update(id: string, data: UpdateProductDTO, db?: DatabaseClient): Promise<Product> {
    const client = this.resolveDb(db);
    const row = await client.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
        ...(data.emoji !== undefined ? { emoji: data.emoji } : {}),
        ...(data.quantity !== undefined ? { quantity: data.quantity } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
      },
    });
    return Product.fromPrisma(row);
  }

  async delete(id: string, db?: DatabaseClient): Promise<void> {
    const client = this.resolveDb(db);
    await client.product.delete({ where: { id } });
  }

  async setQuantity(id: string, quantity: number, db?: DatabaseClient): Promise<Product> {
    const client = this.resolveDb(db);
    const row = await client.product.update({
      where: { id },
      data: { quantity },
    });
    return Product.fromPrisma(row);
  }
}
