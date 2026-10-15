import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = (error as any).issues || (error as any).errors || [];
        const details = issues.map((err: any) => ({
          field: (err.path || []).join('.'),
          message: err.message,
        }));
        return next(new ApiError(400, 'Validation failed', details));
      }
      next(error);
    }
  };
};
