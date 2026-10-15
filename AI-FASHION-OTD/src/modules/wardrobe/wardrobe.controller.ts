import { Request, Response } from 'express';
import { WardrobeService } from './wardrobe.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export class WardrobeController {
  public static getWardrobe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const category = req.query.category as string | undefined;
    const items = await WardrobeService.getUserWardrobe(userId, category);
    res.status(200).json(new ApiResponse(200, items, 'Wardrobe items fetched successfully'));
  });

  public static addItem = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const item = await WardrobeService.addItem(userId, req.body);
    res.status(201).json(new ApiResponse(201, item, 'Garment added to wardrobe'));
  });

  public static getItem = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const item = await WardrobeService.getItemById(userId, req.params.id as string);
    res.status(200).json(new ApiResponse(200, item, 'Wardrobe item details'));
  });

  public static updateItem = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const item = await WardrobeService.updateItem(userId, req.params.id as string, req.body);
    res.status(200).json(new ApiResponse(200, item, 'Wardrobe item updated'));
  });

  public static deleteItem = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    await WardrobeService.deleteItem(userId, req.params.id as string);
    res.status(200).json(new ApiResponse(200, null, 'Wardrobe item deleted'));
  });

  public static markWorn = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const item = await WardrobeService.incrementWearCount(userId, req.params.id as string);
    res.status(200).json(new ApiResponse(200, item, 'Garment marked as worn today'));
  });
}
