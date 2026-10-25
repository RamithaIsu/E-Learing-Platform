import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  MONGODB_URI: z
    .string({ error: 'MONGODB_URI is required' })
    .regex(/^mongodb(\+srv)?:\/\//, 'MONGODB_URI must be a MongoDB connection string'),
  // Comma-separated list of browser origins allowed by CORS.
  CLIENT_ORIGIN: z
    .string({ error: 'CLIENT_ORIGIN is required' })
    .transform((value) => value.split(',').map((origin) => origin.trim())),
});

/** Validates environment variables once at startup and stops the process if any are invalid. */
export function loadEnv(source = process.env) {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    console.error(`Invalid environment configuration:\n${z.prettifyError(result.error)}`);
    process.exit(1);
  }
  return Object.freeze(result.data);
}
