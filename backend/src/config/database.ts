import mongoose from 'mongoose';
import { env } from './env';

let mongodInstance: any = null;

export const connectDatabase = async (): Promise<void> => {
  // If no external MONGO_URI is set or pointing to localhost in production
  if (env.NODE_ENV === 'production' && (!env.MONGO_URI || env.MONGO_URI.includes('localhost') || env.MONGO_URI.includes('127.0.0.1'))) {
    console.warn(`[Database] Notice: MONGO_URI is set to "${env.MONGO_URI}".`);
    console.warn('[Database] In production on Render, please configure your MongoDB Atlas URI in the Render Dashboard under Environment.');
  }

  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
    return;
  } catch (error: any) {
    console.warn(`[Database] Could not connect to MongoDB at ${env.MONGO_URI}: ${error.message || error}`);
  }

  // Only use MongoMemoryServer in local development or test environments, NEVER in production on cloud containers
  if (env.NODE_ENV !== 'production') {
    try {
      console.log('[Database] Initializing in-memory MongoDB instance for local development...');
      if (process.platform === 'win32') {
        process.env.MONGOMS_DOWNLOAD_DIR = process.env.MONGOMS_DOWNLOAD_DIR || 'D:\\.mongodb-binaries';
      }
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'ai_fashion_otd',
        },
      });
      const uri = mongodInstance.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[Database] In-memory MongoDB connected successfully at ${uri}`);
    } catch (memError) {
      console.warn('[Database] In-memory fallback unavailable:', memError);
      console.warn('[Database] Server will remain operational for documentation, health check, and client simulation.');
    }
  } else {
    console.warn('[Database] Running in production mode without active database connection.');
    console.warn('[Database] Server remains operational to serve health checks (/health) and API documentation (/api-docs).');
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch (err) {
    console.error('[Database] Disconnect error:', err);
  }
};
