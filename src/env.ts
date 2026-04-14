import { config } from 'dotenv';
import { z } from 'zod';

config({ override: true });

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  LOGIN_USERNAME: z.string().min(1, 'LOGIN_USERNAME is required'),
  LOGIN_PASSWORD: z.string().min(1, 'LOGIN_PASSWORD is required'),
  PORT: z.coerce.number().int().positive().default(3333),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const message = parsed.error.flatten().fieldErrors;
  console.error('Invalid environment variables:', message);
  process.exit(1);
}

export const env: Env = parsed.data;
