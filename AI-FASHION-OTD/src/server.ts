import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
import { connectDatabase } from './config/database';
import { notFoundHandler } from './middlewares/not-found.middleware';
import { errorHandler } from './middlewares/error.middleware';

import authRoutes from './modules/auth/auth.routes';
import wardrobeRoutes from './modules/wardrobe/wardrobe.routes';
import outfitsRoutes from './modules/outfits/outfits.routes';
import intelligenceRoutes from './modules/wardrobe-intelligence/wardrobe-intelligence.routes';

const app: Application = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Mount domain routes
app.use(`${env.API_PREFIX}/auth`, authRoutes);
app.use(`${env.API_PREFIX}/wardrobe`, wardrobeRoutes);
app.use(`${env.API_PREFIX}/outfits`, outfitsRoutes);
app.use(`${env.API_PREFIX}/intelligence`, intelligenceRoutes);

// Fallthrough 404 & Global error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Server startup
const startServer = async () => {
  try {
    if (env.NODE_ENV !== 'test') {
      await connectDatabase();
    }
    app.listen(env.PORT, () => {
      console.log(`[Server] AI Fashion Companion REST API running on http://localhost:${env.PORT}`);
      console.log(`[Server] Environment: ${env.NODE_ENV}`);
      console.log(`[Server] API Prefix: ${env.API_PREFIX}`);
    });
  } catch (err) {
    console.error('[Server] Failed to launch server:', err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
