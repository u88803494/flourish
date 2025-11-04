import { z } from 'zod';

// Zod schema for environment variables
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(6888),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  SUPABASE_JWT_SECRET: z.string().min(32, 'SUPABASE_JWT_SECRET must be at least 32 characters'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://localhost:3100'),
});

// Type inference from Zod schema
export type Env = z.infer<typeof envSchema>;

// Validation function that throws helpful error messages
export function validate(config: Record<string, unknown>): Env {
  try {
    return envSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((e) => {
        const path = e.path.join('.');
        return `${path}: ${e.message}`;
      });
      throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
    }
    throw error;
  }
}
