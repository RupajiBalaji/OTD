import mongoose, { mongo } from 'mongoose';

let bucket: mongo.GridFSBucket | null = null;

export const getGridFSBucket = (): mongo.GridFSBucket => {
  if (bucket) {
    return bucket;
  }

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Cannot initialize GridFSBucket: Mongoose connection not ready');
  }

  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: 'wardrobe_images',
  });

  return bucket;
};

export const resetGridFSBucket = (): void => {
  bucket = null;
};
