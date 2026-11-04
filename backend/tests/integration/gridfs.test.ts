import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PassThrough, Readable } from 'stream';
import mongoose from 'mongoose';
import { validateGarmentImage } from '../../src/utils/file-validation';
import { GridFSStorageService } from '../../src/integrations/storage/gridfs.service';
import * as gridfsConfig from '../../src/config/gridfs';

describe('Image & Storage Validation Unit Tests', () => {
  it('should accept valid JPEG, PNG, and WEBP image uploads', () => {
    const validJpg = { mimetype: 'image/jpeg', size: 1024 * 1024 * 2 };
    const validPng = { mimetype: 'image/png', size: 1024 * 1024 * 4 };
    const validWebp = { mimetype: 'image/webp', size: 1024 * 512 };

    expect(validateGarmentImage(validJpg).isValid).toBe(true);
    expect(validateGarmentImage(validPng).isValid).toBe(true);
    expect(validateGarmentImage(validWebp).isValid).toBe(true);
  });

  it('should reject unsupported file types like pdf or executables', () => {
    const pdfFile = { mimetype: 'application/pdf', size: 1024 * 1024 };
    const result = validateGarmentImage(pdfFile);

    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Unsupported image format');
  });

  it('should reject files exceeding the 10MB limit', () => {
    const hugeFile = { mimetype: 'image/png', size: 1024 * 1024 * 15 };
    const result = validateGarmentImage(hugeFile);

    expect(result.isValid).toBe(false);
    expect(result.error).toContain('exceeds maximum allowed threshold');
  });
});

describe('GridFSStorageService Operations', () => {
  const fakeObjectId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should reject invalid ObjectID strings with 400 ApiError', async () => {
    await expect(GridFSStorageService.getFileStream('invalid-id-123')).rejects.toThrow('Invalid file ID format');
    await expect(GridFSStorageService.deleteFile('invalid-id-123')).rejects.toThrow('Invalid file ID format');
  });

  it('should upload buffer to GridFS and return stored metadata', async () => {
    const fakeUploadStream = new PassThrough() as any;
    fakeUploadStream.id = fakeObjectId;

    const mockBucket = {
      openUploadStream: vi.fn().mockImplementation(() => {
        setTimeout(() => fakeUploadStream.emit('finish'), 10);
        return fakeUploadStream;
      }),
    };

    vi.spyOn(gridfsConfig, 'getGridFSBucket').mockReturnValue(mockBucket as any);

    const testBuffer = Buffer.from('fake-image-bytes');
    const result = await GridFSStorageService.uploadBuffer(testBuffer, {
      filename: 'test garment!@#.jpg',
      contentType: 'image/jpeg',
      userId: 'user123',
    });

    expect(result.fileId).toBe(fakeObjectId.toString());
    expect(result.filename).toBe('test_garment___.jpg');
    expect(result.contentType).toBe('image/jpeg');
    expect(result.size).toBe(testBuffer.length);
    expect(result.url).toBe(`/api/v1/wardrobe/images/${fakeObjectId.toString()}`);
  });

  it('should throw 404 when getFileStream does not find file', async () => {
    const mockBucket = {
      find: vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
      }),
    };

    vi.spyOn(gridfsConfig, 'getGridFSBucket').mockReturnValue(mockBucket as any);

    await expect(GridFSStorageService.getFileStream(fakeObjectId.toString())).rejects.toThrow(
      'Garment image not found in storage'
    );
  });

  it('should return download stream and metadata for existing file', async () => {
    const mockReadableStream = new Readable({
      read() {
        this.push('file-chunk');
        this.push(null);
      },
    });

    const mockBucket = {
      find: vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue([
          {
            _id: fakeObjectId,
            filename: 'cashmere_knit.jpg',
            length: 1024,
            metadata: { contentType: 'image/jpeg' },
          },
        ]),
      }),
      openDownloadStream: vi.fn().mockReturnValue(mockReadableStream),
    };

    vi.spyOn(gridfsConfig, 'getGridFSBucket').mockReturnValue(mockBucket as any);

    const result = await GridFSStorageService.getFileStream(fakeObjectId.toString());
    expect(result.filename).toBe('cashmere_knit.jpg');
    expect(result.contentType).toBe('image/jpeg');
    expect(result.length).toBe(1024);
    expect(result.stream).toBeDefined();
  });

  it('should call bucket.delete when deleting a valid file', async () => {
    const deleteSpy = vi.fn().mockResolvedValue(undefined);
    const mockBucket = {
      delete: deleteSpy,
    };

    vi.spyOn(gridfsConfig, 'getGridFSBucket').mockReturnValue(mockBucket as any);

    await GridFSStorageService.deleteFile(fakeObjectId.toString());
    expect(deleteSpy).toHaveBeenCalledWith(expect.any(mongoose.Types.ObjectId));
  });
});
