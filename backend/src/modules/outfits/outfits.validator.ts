import { z } from 'zod';

export const generateOutfitSchema = z.object({
  occasion: z.string().default('casual'),
  vibe: z.string().default('minimalist'),
  temperature: z.number().optional(),
  weatherSummary: z.string().optional(),
});

export const createCustomOutfitSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  itemIds: z.array(z.string()).min(1, 'At least 1 item is required'),
  occasion: z.string().default('casual'),
  vibe: z.string().default('minimalist'),
});
