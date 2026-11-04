import { Request, Response } from 'express';
import { SocialService } from './social.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export class SocialController {
  public static getFeed = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const feed = await SocialService.getFeed(userId);
    res.status(200).json(new ApiResponse(200, feed, 'Community inspiration feed'));
  });

  public static shareOutfit = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const share = await SocialService.shareOutfit(userId, req.body);
    res.status(201).json(new ApiResponse(201, share, 'Outfit published to community lookbook'));
  });

  public static toggleLike = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await SocialService.toggleLike(userId, req.params.id as string);
    res.status(200).json(new ApiResponse(200, result, 'Like status updated'));
  });

  public static addComment = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const comment = await SocialService.addComment(userId, req.params.id as string, req.body.text);
    res.status(201).json(new ApiResponse(201, comment, 'Comment added to look'));
  });

  public static getComments = asyncHandler(async (req: Request, res: Response) => {
    const comments = await SocialService.getComments(req.params.id as string);
    res.status(200).json(new ApiResponse(200, comments, 'Outfit comments'));
  });
}
