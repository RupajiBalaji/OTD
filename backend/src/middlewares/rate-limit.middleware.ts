import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

/**
 * General API rate limiter for protecting endpoints against DoS and abusive scraping
 */
export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: (env.NODE_ENV === 'test' || env.NODE_ENV === 'development') ? 10000 : env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 429,
      message: 'Too many requests originating from this client, please retry after 15 minutes.',
    },
  },
});

/**
 * Strict rate limiter for authentication routes to prevent credential stuffing and brute force
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (env.NODE_ENV === 'test' || env.NODE_ENV === 'development') ? 10000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 429,
      message: 'Too many authentication attempts. Please try again after 15 minutes.',
    },
  },
});

