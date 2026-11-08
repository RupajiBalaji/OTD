import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { connectDatabase } from './config/database';
import { corsOptions } from './config/cors';
import { swaggerSpec } from './config/swagger';
import { apiRateLimiter, authRateLimiter } from './middlewares/rate-limit.middleware';
import { notFoundHandler } from './middlewares/not-found.middleware';
import { errorHandler } from './middlewares/error.middleware';

import authRoutes from './modules/auth/auth.routes';
import wardrobeRoutes from './modules/wardrobe/wardrobe.routes';
import outfitsRoutes from './modules/outfits/outfits.routes';
import intelligenceRoutes from './modules/wardrobe-intelligence/wardrobe-intelligence.routes';
import profileRoutes from './modules/profile/profile.routes';
import weatherRoutes from './modules/weather/weather.routes';
import venuesRoutes from './modules/venues/venues.routes';
import eventsRoutes from './modules/events/events.routes';
import virtualTryOnRoutes from './modules/virtual-try-on/virtual-try-on.routes';
import socialRoutes from './modules/social/social.routes';
import shoppingRoutes from './modules/shopping/shopping.routes';
import aiRoutes from './modules/ai/ai.routes';

const app: Application = express();

// Security and utility middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Interactive OpenAPI / Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Apply general API rate limiter to all api routes
app.use(env.API_PREFIX, apiRateLimiter);

// Mount domain routes
app.use(`${env.API_PREFIX}/auth`, authRateLimiter, authRoutes);
app.use(`${env.API_PREFIX}/profile`, profileRoutes);
app.use(`${env.API_PREFIX}/wardrobe`, wardrobeRoutes);
app.use(`${env.API_PREFIX}/outfits`, outfitsRoutes);
app.use(`${env.API_PREFIX}/intelligence`, intelligenceRoutes);
app.use(`${env.API_PREFIX}/weather`, weatherRoutes);
app.use(`${env.API_PREFIX}/venues`, venuesRoutes);
app.use(`${env.API_PREFIX}/events`, eventsRoutes);
app.use(`${env.API_PREFIX}/virtual-try-on`, virtualTryOnRoutes);
app.use(`${env.API_PREFIX}/social`, socialRoutes);
app.use(`${env.API_PREFIX}/shopping`, shoppingRoutes);
app.use(`${env.API_PREFIX}/ai`, aiRoutes);

// Fallthrough 404 & Global error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Server startup
const startServer = async () => {
  try {
    app.listen(env.PORT, '0.0.0.0', () => {
      console.log(`[Server] AI Fashion Companion REST API running on http://0.0.0.0:${env.PORT}`);
      console.log(`[Server] Environment: ${env.NODE_ENV}`);
      console.log(`[Server] API Prefix: ${env.API_PREFIX}`);
    });

    if (env.NODE_ENV !== 'test') {
      await connectDatabase().catch((dbErr) => {
        console.warn('[Database] Startup database connection warning:', dbErr);
      });
    }
  } catch (err) {
    console.error('[Server] Failed to launch server:', err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
