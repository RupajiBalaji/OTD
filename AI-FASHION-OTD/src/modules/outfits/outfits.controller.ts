import { Request, Response } from 'express';
import { OutfitsService } from './outfits.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export class OutfitsController {
  public static getDailyRecommendations = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const outfits = await OutfitsService.getDailyRecommendations(userId);
    res.status(200).json(new ApiResponse(200, outfits, 'Daily outfits recommendations fetched'));
  });

  public static generateOutfit = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const outfit = await OutfitsService.generateOutfit(userId, req.body);
    res.status(201).json(new ApiResponse(201, outfit, 'New outfit synthesized by AI'));
  });

  public static logAsWorn = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const outfit = await OutfitsService.logAsWorn(userId, req.params.id as string);
    res.status(200).json(new ApiResponse(200, outfit, 'Outfit recorded as worn today'));
  });

  public static toggleBookmark = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const outfit = await OutfitsService.toggleBookmark(userId, req.params.id as string);
    res.status(200).json(new ApiResponse(200, outfit, 'Outfit bookmark status updated'));
  });
}
