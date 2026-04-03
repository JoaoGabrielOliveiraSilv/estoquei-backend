import { z } from 'zod';

export const productStatusSchema = z.enum(['normal', 'warning', 'danger']);

const optionalUrlOrEmpty = z
  .union([z.string().url(), z.literal('')])
  .optional()
  .nullable()
  .transform((v) => (v === '' || v === undefined ? null : v));

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional().nullable(),
  imageUrl: optionalUrlOrEmpty,
  emoji: z.string().min(1).max(16),
  quantity: z.coerce.number().int().min(0).optional().default(0),
  status: productStatusSchema.optional().default('normal'),
});

export type CreateProductDTO = z.infer<typeof createProductSchema>;

export const updateProductSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().max(2000).optional().nullable(),
    imageUrl: optionalUrlOrEmpty,
    emoji: z.string().min(1).max(16).optional(),
    quantity: z.coerce.number().int().min(0).optional(),
    status: productStatusSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export type UpdateProductDTO = z.infer<typeof updateProductSchema>;

export const productIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type ListProductsQueryDTO = z.infer<typeof listProductsQuerySchema>;
