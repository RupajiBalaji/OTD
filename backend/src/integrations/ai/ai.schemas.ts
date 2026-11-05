import { z } from 'zod';

export const SlotChangeSchema = z.object({
  slot: z.enum(['tops', 'bottoms', 'outerwear', 'footwear', 'accessories', 'onePiece']),
  itemId: z.string().optional(),
  itemName: z.string().optional(),
  action: z.enum(['replace', 'add', 'remove']).default('replace'),
  rationale: z.string().optional(),
});

export const StylistStructuredReplySchema = z.object({
  reply: z.string().default("I have analyzed your digital closet and calibrated your look for optimal poise, color harmony, and comfort."),
  intent: z.enum(['advice', 'modify_outfit', 'recommend_new', 'general_fashion', 'clarification']).default('advice'),
  slotChanges: z.array(SlotChangeSchema).default([]),
});

export type SlotChange = z.infer<typeof SlotChangeSchema>;
export type StylistStructuredReply = z.infer<typeof StylistStructuredReplySchema>;

export const GarmentVisionOutputSchema = z.object({
  name: z.string(),
  category: z.enum(['tops', 'bottoms', 'outerwear', 'footwear', 'accessories', 'onePiece']),
  subType: z.string().default('Garment'),
  color: z.string(),
  fabric: z.string(),
  fit: z.enum(['Slim', 'Regular', 'Relaxed / Tailored']).default('Regular'),
  formality: z.number().int().min(1).max(5).default(3),
  season: z.array(z.string()).default(['All Season']),
  suggestedPrice: z.number().default(150),
  confidence: z.number().min(0).max(1).default(0.85),
  fieldConfidence: z.object({
    name: z.number().min(0).max(1).default(0.9),
    category: z.number().min(0).max(1).default(0.95),
    color: z.number().min(0).max(1).default(0.9),
    fabric: z.number().min(0).max(1).default(0.8),
    formality: z.number().min(0).max(1).default(0.85),
  }).default({
    name: 0.9,
    category: 0.95,
    color: 0.9,
    fabric: 0.8,
    formality: 0.85,
  }),
  uncertainFields: z.array(z.string()).default([]),
  summary: z.string().default('Digitized luxury garment.'),
});

export type GarmentVisionOutput = z.infer<typeof GarmentVisionOutputSchema>;

export const OutfitRankingOutputSchema = z.object({
  rankedCandidateIndex: z.number().int().min(0).default(0),
  selectedCandidateId: z.string().default('candidate_1'),
  stylistRationale: z.object({
    colorTheory: z.string().default('Balanced tonal color harmony.'),
    silhouette: z.string().default('Proportional silhouette balance.'),
    fabricPhysics: z.string().default('Breathable natural fibers.'),
    venueAlignment: z.string().default('Aligned with occasion standards.'),
    weatherComfort: z.string().default('Calibrated for ambient comfort.'),
    overallCritique: z.string().default('Sophisticated curation.'),
  }).default({
    colorTheory: 'Balanced tonal color harmony.',
    silhouette: 'Proportional silhouette balance.',
    fabricPhysics: 'Breathable natural fibers.',
    venueAlignment: 'Aligned with occasion standards.',
    weatherComfort: 'Calibrated for ambient comfort.',
    overallCritique: 'Sophisticated curation.',
  }),
  computedHarmonyDelta: z.number().default(0),
});

export type OutfitRankingOutput = z.infer<typeof OutfitRankingOutputSchema>;
