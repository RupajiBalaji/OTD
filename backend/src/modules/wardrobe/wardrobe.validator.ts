import { z } from 'zod';

export const createWardrobeItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  category: z.enum(['tops', 'bottoms', 'outerwear', 'footwear', 'accessories', 'onePiece']),
  subType: z.string().optional(),
  brand: z.string().optional(),
  color: z.string().optional(),
  fabric: z.string().optional(),
  fit: z.enum(['Slim', 'Regular', 'Relaxed / Tailored']).optional(),
  formality: z.number().min(1).max(5).optional(),
  season: z.string().optional(),
  imageUrl: z.string().min(1, 'Valid image URL or path is required'),
  purchasePrice: z.number().min(0).default(0),
  tags: z.array(z.string()).optional(),
  icon: z.string().optional(),
});

export const updateWardrobeItemSchema = createWardrobeItemSchema.partial();
