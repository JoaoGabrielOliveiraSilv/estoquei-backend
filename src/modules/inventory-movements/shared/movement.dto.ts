import { z } from 'zod';

export const movementsProductIdParamSchema = z.object({
  productId: z.string().uuid(),
});

export const createMovementBodySchema = z.object({
  type: z.enum(['inbound', 'outbound']),
  quantity: z.coerce.number().int().positive(),
  counterPartyName: z.string().min(1).max(255),
  date: z.string().min(1).max(64),
});

export type CreateMovementBodyDTO = z.infer<typeof createMovementBodySchema>;

export type CreateMovementDTO = CreateMovementBodyDTO & { productId: string };
