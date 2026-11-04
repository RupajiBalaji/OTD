import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  venue: z.string().min(1, 'Venue is required'),
  occasion: z.string().min(1, 'Occasion is required'),
  vibe: z.string().optional().default('Clean Minimalist'),
  scheduledDate: z.string().or(z.date()),
  time: z.string().optional().default('8:00 PM'),
  outfitId: z.string().optional(),
  weatherForecast: z.string().optional(),
  notes: z.string().optional(),
});

export const updateEventSchema = z.object({
  title: z.string().optional(),
  venue: z.string().optional(),
  occasion: z.string().optional(),
  vibe: z.string().optional(),
  scheduledDate: z.string().or(z.date()).optional(),
  time: z.string().optional(),
  weatherForecast: z.string().optional(),
  status: z.enum(['scheduled', 'worn', 'cancelled']).optional(),
  notes: z.string().optional(),
});
