import { beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});
