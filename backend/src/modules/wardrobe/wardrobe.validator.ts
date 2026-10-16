import { z } from 'zod';

export const createWardrobeItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  category: z.enum(['tops', 'bottoms', 'outerwear', 'footwear', 'accessories', 'onePiece']),
  color: z.string().optional(),
  fabric: z.string().optional(),
  season: z.string().optional(),
  imageUrl: z.string().url('Valid image URL is required'),
  purchasePrice: z.number().min(0).default(0),
  tags: z.array(z.string()).optional(),
});

export const updateWardrobeItemSchema = createWardrobeItemSchema.partial();
