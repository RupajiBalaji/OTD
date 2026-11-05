import { Request, Response } from 'express';
import { VirtualTryOnService } from './virtual-try-on.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export class VirtualTryOnController {
  public static getAvatar = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const avatar = await VirtualTryOnService.getAvatar(userId);
    res.status(200).json(new ApiResponse(200, avatar, 'User avatar profile'));
  });

  public static updateAvatar = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const avatar = await VirtualTryOnService.updateAvatar(userId, req.body);
    res.status(200).json(new ApiResponse(200, avatar, 'User avatar updated'));
  });

  /**
   * POST /api/v1/virtual-try-on/generate
   * Returns HTTP 202 with jobId
   */
  public static synthesizeTryOn = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const job = await VirtualTryOnService.createTryOnJob(userId, req.body);
    res.status(202).json(new ApiResponse(202, job, 'Virtual Try-On job queued'));
  });

  /**
   * GET /api/v1/virtual-try-on/jobs/:id
   * Job polling endpoint
   */
  public static getJobStatus = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const jobId = req.params.id as string;
    const job = await VirtualTryOnService.getTryOnJob(userId, jobId);
    res.status(200).json(new ApiResponse(200, job, 'Try-on job status'));
  });

  public static getHistory = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const history = await VirtualTryOnService.getTryOnHistory(userId);
    res.status(200).json(new ApiResponse(200, history, 'Virtual Try-On history'));
  });
}
