import { z } from 'zod';

export const listMovementsQuerySchema = z.object({
  productId: z.string().uuid().optional(),
});

export type ListMovementsQueryDTO = z.infer<typeof listMovementsQuerySchema>;

export const createMovementSchema = z.object({
  productId: z.string().uuid(),
  type: z.enum(['inbound', 'outbound']),
  quantity: z.coerce.number().int().positive(),
  counterPartyName: z.string().min(1).max(255),
  date: z.string().min(1).max(64),
});

export type CreateMovementDTO = z.infer<typeof createMovementSchema>;
