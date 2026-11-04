import { GridFSStorageService } from '../../integrations/storage/gridfs.service';
import { StoredGridFSFile } from '../../integrations/storage/gridfs.types';
import { ApiError } from '../../utils/ApiError';

export class WardrobeImageService {
  public static async uploadGarmentPhoto(
    userId: string,
    file?: Express.Multer.File
  ): Promise<StoredGridFSFile> {
    if (!file) {
      throw new ApiError(400, 'No image file uploaded');
    }

    return GridFSStorageService.uploadBuffer(file.buffer, {
      filename: `${userId}_${Date.now()}_${file.originalname}`,
      contentType: file.mimetype,
      metadata: {
        userId,
        originalName: file.originalname,
        uploadedAt: new Date(),
      },
    });
  }

  public static async getGarmentPhotoStream(fileId: string) {
    return GridFSStorageService.getFileStream(fileId);
  }

  public static async deleteGarmentPhoto(fileId: string) {
    return GridFSStorageService.deleteFile(fileId);
  }
}
