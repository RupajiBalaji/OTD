import { z } from 'zod';

export const generateOutfitSchema = z.object({
  occasion: z.string().default('Casual Evening'),
  venue: z.string().optional(),
  vibe: z.string().default('Clean Minimalist'),
  weather: z.string().optional(),
  temperature: z.number().optional(),
  avoidedColors: z.array(z.string()).optional(),
  dislikedElements: z.array(z.string()).optional(),
  preferredFit: z.string().optional(),
});

export const modifyOutfitSchema = z.object({
  instruction: z.string().min(1, 'Modification instruction is required'),
});

export const createCustomOutfitSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  itemIds: z.array(z.string()).min(1, 'At least 1 item is required'),
  occasion: z.string().default('casual'),
  vibe: z.string().default('minimalist'),
});
