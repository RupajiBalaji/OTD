import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { JwtUtil } from '../utils/jwt';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication token missing or invalid'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = JwtUtil.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired access token'));
  }
};

export const authenticateOptional = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = { userId: '000000000000000000000001', email: 'guest@otd.luxury', role: 'user' };
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = JwtUtil.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    req.user = { userId: '000000000000000000000001', email: 'guest@otd.luxury', role: 'user' };
    next();
  }
};
