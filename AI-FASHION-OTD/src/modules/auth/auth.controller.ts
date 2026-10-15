import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export class AuthController {
  public static register = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);
    res.status(201).json(new ApiResponse(201, result, 'User registered successfully'));
  });

  public static login = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    res.status(200).json(new ApiResponse(200, result, 'Login successful'));
  });

  public static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.refreshToken(req.body.refreshToken);
    res.status(200).json(new ApiResponse(200, result, 'Tokens refreshed successfully'));
  });

  public static logout = asyncHandler(async (req: Request, res: Response) => {
    if (req.body.refreshToken) {
      await AuthService.logout(req.body.refreshToken);
    }
    res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
  });
}
