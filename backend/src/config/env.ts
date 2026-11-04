import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z
  .object({
    PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    API_PREFIX: z.string().default('/api/v1'),
    MONGO_URI: z.string().default('mongodb://localhost:27017/ai_fashion_otd'),
    JWT_ACCESS_SECRET: z.string().default('default_jwt_access_secret_key_fashion_otd'),
    JWT_REFRESH_SECRET: z.string().default('default_jwt_refresh_secret_key_fashion_otd'),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    CORS_ORIGIN: z.string().default('http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173'),
    RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform((val) => parseInt(val, 10)),
    RATE_LIMIT_MAX: z.string().default('100').transform((val) => parseInt(val, 10)),
    UPLOAD_MAX_SIZE_MB: z.string().default('10').transform((val) => parseInt(val, 10)),
    GEMINI_API_KEY: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    AI_PROVIDER: z.enum(['gemini', 'openai', 'algorithmic']).default('algorithmic'),
  })
  .refine(
    (data) => {
      if (data.NODE_ENV === 'production') {
        const isDefaultAccess = data.JWT_ACCESS_SECRET === 'default_jwt_access_secret_key_fashion_otd';
        const isDefaultRefresh = data.JWT_REFRESH_SECRET === 'default_jwt_refresh_secret_key_fashion_otd';
        if (isDefaultAccess || isDefaultRefresh) {
          return false;
        }
      }
      return true;
    },
    {
      message: 'In production mode, JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be explicitly provided and not use default keys.',
      path: ['JWT_ACCESS_SECRET'],
    }
  );

export const env = envSchema.parse(process.env);
