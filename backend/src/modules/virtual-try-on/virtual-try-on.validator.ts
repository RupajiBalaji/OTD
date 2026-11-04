import { z } from 'zod';

export const generateTryOnSchema = z.object({
  outfitId: z.string().optional(),
  itemIds: z.array(z.string()).optional(),
  lightingPreset: z.enum(['Golden Hour', 'Candlelight Dinner', 'Editorial Studio', 'Natural Daylight']).optional(),
  pose: z.enum(['frontal', 'three_quarter', 'profile', 'dynamic_walking']).optional(),
  personaType: z.enum(['boy', 'girl', 'women', 'man']).optional(),
  customPhotoUrl: z.string().optional(),
  skinTone: z.string().optional(),
  bodyShape: z.string().optional(),
  height: z.string().optional(),
});
