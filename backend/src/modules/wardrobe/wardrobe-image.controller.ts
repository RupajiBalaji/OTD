import { Request, Response } from 'express';
import { WardrobeImageService } from './wardrobe-image.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export class WardrobeImageController {
  public static uploadImage = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await WardrobeImageService.uploadGarmentPhoto(userId, req.file);

    res.status(201).json(new ApiResponse(201, result, 'Garment image uploaded successfully'));
  });

  public static getImage = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { stream, contentType, length } = await WardrobeImageService.getGarmentPhotoStream(id as string);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', length);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    stream.pipe(res);
  });
}
