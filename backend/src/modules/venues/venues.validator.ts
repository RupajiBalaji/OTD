import { z } from 'zod';

export const venueSearchQuerySchema = z.object({
  q: z.string().optional(),
});
