import { z } from 'zod';

export const loginBodySchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type LoginBodyDTO = z.infer<typeof loginBodySchema>;
