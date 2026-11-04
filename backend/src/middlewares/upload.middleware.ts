import multer from 'multer';
import { Request } from 'express';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new ApiError(
        400,
        `Invalid file type '${file.mimetype}'. Only JPEG, PNG, and WebP images are permitted.`
      )
    );
  }
};

export const uploadGarmentImageMiddleware = multer({
  storage,
  limits: {
    fileSize: env.UPLOAD_MAX_SIZE_MB * 1024 * 1024,
  },
  fileFilter,
});
