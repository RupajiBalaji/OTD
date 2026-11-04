import { Readable } from 'stream';
import mongoose from 'mongoose';
import { getGridFSBucket } from '../../config/gridfs';
import { StoredGridFSFile, GridFSUploadOptions } from './gridfs.types';
import { ApiError } from '../../utils/ApiError';

export class GridFSStorageService {
  /**
   * Upload buffer directly to MongoDB GridFS bucket
   */
  public static async uploadBuffer(
    buffer: Buffer,
    options: GridFSUploadOptions
  ): Promise<StoredGridFSFile> {
    const bucket = getGridFSBucket();
    const cleanFilename = options.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uploadStream = bucket.openUploadStream(cleanFilename, {
      metadata: {
        contentType: options.contentType,
        ...(options.metadata || {}),
      },
    });

    return new Promise((resolve, reject) => {
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);

      readableStream
        .pipe(uploadStream)
        .on('error', (err) => reject(new ApiError(500, `GridFS upload failure: ${err.message}`)))
        .on('finish', () => {
          resolve({
            fileId: uploadStream.id.toString(),
            filename: cleanFilename,
            contentType: options.contentType,
            size: buffer.length,
            uploadDate: new Date(),
            url: `/api/v1/wardrobe/images/${uploadStream.id.toString()}`,
          });
        });
    });
  }

  /**
   * Open a download stream for a given file ID
   */
  public static async getFileStream(fileId: string): Promise<{
    stream: NodeJS.ReadableStream;
    filename: string;
    contentType: string;
    length: number;
  }> {
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      throw new ApiError(400, 'Invalid file ID format');
    }

    const bucket = getGridFSBucket();
    const objectId = new mongoose.Types.ObjectId(fileId);

    const files = await bucket.find({ _id: objectId }).toArray();
    if (!files || files.length === 0) {
      throw new ApiError(404, 'Garment image not found in storage');
    }

    const fileMeta = files[0];
    const stream = bucket.openDownloadStream(objectId);

    return {
      stream,
      filename: fileMeta.filename,
      contentType: (fileMeta.metadata as any)?.contentType || (fileMeta as any).contentType || 'image/jpeg',
      length: fileMeta.length,
    };
  }

  /**
   * Delete file from GridFS bucket
   */
  public static async deleteFile(fileId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      throw new ApiError(400, 'Invalid file ID format');
    }

    const bucket = getGridFSBucket();
    const objectId = new mongoose.Types.ObjectId(fileId);
    await bucket.delete(objectId);
  }
}
