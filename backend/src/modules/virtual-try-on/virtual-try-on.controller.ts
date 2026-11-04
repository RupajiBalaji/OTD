import { Request, Response } from 'express';
import { VirtualTryOnService } from './virtual-try-on.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export class VirtualTryOnController {
  public static getAvatar = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const avatar = await VirtualTryOnService.getAvatar(userId);
    res.status(200).json(new ApiResponse(200, avatar, 'User 3D avatar profile'));
  });

  public static updateAvatar = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const avatar = await VirtualTryOnService.updateAvatar(userId, req.body);
    res.status(200).json(new ApiResponse(200, avatar, 'User 3D avatar updated'));
  });

  public static synthesizeTryOn = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const tryOn = await VirtualTryOnService.synthesizeTryOn(userId, req.body);
    res.status(201).json(new ApiResponse(201, tryOn, 'Virtual Try-On 3D drape rendered successfully'));
  });

  public static getHistory = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const history = await VirtualTryOnService.getTryOnHistory(userId);
    res.status(200).json(new ApiResponse(200, history, 'Virtual Try-On rendering history'));
  });
}
