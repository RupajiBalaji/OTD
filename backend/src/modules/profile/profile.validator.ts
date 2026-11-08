import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  height: z.string().optional(),
  bodyShape: z.string().optional(),
  skinTone: z.string().optional(),
  stylingPath: z.enum(['Women', 'Men', 'Personalize']).optional(),
  weight: z.string().optional(),
  stylePersonas: z.array(z.string()).optional(),
  preferredFit: z.string().optional(),
  palettePreferences: z.array(z.string()).optional(),
  avoidedColors: z.array(z.string()).optional(),
  dislikedElements: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional(),
  skinToneHex: z.string().optional(),
  hairStyle: z.string().optional(),
  hairColor: z.string().optional(),
  hairColorHex: z.string().optional(),
  avatarVersion: z.number().optional(),
  avatarCustomization: z.record(z.string(), z.any()).optional(),
});

