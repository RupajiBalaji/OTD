import { z } from 'zod';

export const createShareSchema = z.object({
  outfitId: z.string().optional(),
  caption: z.string().min(1, 'Caption is required'),
  venue: z.string().optional(),
  occasion: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const createCommentSchema = z.object({
  text: z.string().min(1, 'Comment text cannot be empty'),
});
