import mongoose from 'mongoose';
import { env } from './env';

let mongodInstance: any = null;

export const connectDatabase = async (): Promise<void> => {
  try {
    // Attempt standard connection first with 2.5s timeout
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database] Standard MongoDB connection to ${env.MONGO_URI} unavailable.`);
    console.log('[Database] Initializing high-speed in-memory MongoDB instance for local execution...');

    try {
      // Ensure zero storage on C: drive; all developer tools and caches must live on D: drive
      process.env.MONGOMS_DOWNLOAD_DIR = process.env.MONGOMS_DOWNLOAD_DIR || 'D:\\.mongodb-binaries';
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
      console.warn('[Database] Standard MongoDB and in-memory fallback both unavailable:', memError);
      console.warn('[Database] Server will remain operational for documentation, health check, and client simulation.');
    }
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
