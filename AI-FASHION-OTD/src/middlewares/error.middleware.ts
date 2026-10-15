import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  if (!(err instanceof ApiError)) {
    // Mongoose duplicate key error
    if (err.code === 11000) {
      statusCode = 409;
      message = 'Duplicate field value entered';
    }
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
