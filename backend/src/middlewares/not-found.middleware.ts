import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  next(new ApiError(404, `Cannot find route: ${req.method} ${req.originalUrl}`));
};
