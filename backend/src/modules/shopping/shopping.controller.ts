import { Request, Response } from 'express';
import { ShoppingService } from './shopping.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export class ShoppingController {
  public static getGaps = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const recommendations = await ShoppingService.analyzeGaps(userId);
    res.status(200).json(new ApiResponse(200, recommendations, 'Wardrobe gap & investment recommendations'));
  });
}
