import { Request, Response } from 'express';
import { ProfileService } from './profile.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export class ProfileController {
  public static getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const profile = await ProfileService.getProfile(userId);
    res.status(200).json(new ApiResponse(200, profile, 'User profile fetched successfully'));
  });

  public static updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const updated = await ProfileService.updateProfile(userId, req.body);
    res.status(200).json(new ApiResponse(200, updated, 'User profile updated successfully'));
  });
}
