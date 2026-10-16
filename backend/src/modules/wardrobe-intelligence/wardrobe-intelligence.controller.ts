import { Request, Response } from 'express';
import { WardrobeIntelligenceService } from './wardrobe-intelligence.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export class WardrobeIntelligenceController {
  public static getAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const analytics = await WardrobeIntelligenceService.getClosetAnalytics(userId);
    res.status(200).json(new ApiResponse(200, analytics, 'Closet intelligence analytics computed'));
  });
}
