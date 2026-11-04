import { CorsOptions } from 'cors';
import { env } from './env';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server or non-browser requests (e.g., Postman, mobile, curl)
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = env.CORS_ORIGIN === '*'
      ? ['*']
      : env.CORS_ORIGIN.split(',').map((o) => o.trim());

    // If wildcard is configured, reflect the requesting origin to ensure compliance with credentials: true
    if (allowedOrigins.includes('*')) {
      return callback(null, origin);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // In development and test environments, permit all localhost / loopback ports automatically
    if (env.NODE_ENV !== 'production') {
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (isLocalhost) {
        return callback(null, true);
      }
    }

    return callback(new Error(`Origin ${origin} is not permitted by CORS policy`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400,
};
