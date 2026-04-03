import type { PrismaClient } from '@prisma/client';
import type { DatabaseClient } from '../database/types.js';

export abstract class AbstractRepository<_ModuleContract extends object> {
  protected constructor(protected readonly prisma: PrismaClient) {}

  protected resolveDb(override?: DatabaseClient): DatabaseClient {
    return override ?? this.prisma;
  }
}
