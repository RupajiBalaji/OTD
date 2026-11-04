import { z } from 'zod';

export const stylistChatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message cannot exceed 1000 characters'),
  conversationId: z.string().optional(),
  occasion: z.string().optional(),
  venue: z.string().optional(),
  vibe: z.string().optional(),
  weather: z.string().optional(),
  activeOutfitId: z.string().optional(),
});
