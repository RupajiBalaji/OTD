import { ObjectId } from 'mongodb';

export interface StoredGridFSFile {
  fileId: string;
  filename: string;
  contentType: string;
  size: number;
  uploadDate: Date;
  url: string;
}

export interface GridFSUploadOptions {
  filename: string;
  contentType: string;
  metadata?: Record<string, unknown>;
}
