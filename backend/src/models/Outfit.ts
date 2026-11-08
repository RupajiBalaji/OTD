import mongoose, { Schema, Document } from 'mongoose';

export interface IOutfitRationale {
  venueAlignment: string;
  weatherComfort: string;
  paletteHarmony: string;
  wardrobeUtilization?: string;
}

export interface IOutfit extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  items: mongoose.Types.ObjectId[];
  occasion: string;
  venue: string;
  vibe: string;
  weather: string;
  rationale: IOutfitRationale;
  harmonyScore: number;
  aiMatchScore: number;
  isWornToday: boolean;
  isBookmarked: boolean;
  history: string[];
  source?: 'gemini' | 'rules';
  createdAt: Date;
  updatedAt: Date;
}

const OutfitSchema = new Schema<IOutfit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    items: [{ type: Schema.Types.ObjectId, ref: 'WardrobeItem', required: true }],
    occasion: { type: String, default: 'Casual' },
    venue: { type: String, default: '' },
    vibe: { type: String, default: 'Refined' },
    weather: { type: String, default: '' },
    rationale: {
      venueAlignment: { type: String, default: '' },
      weatherComfort: { type: String, default: '' },
      paletteHarmony: { type: String, default: '' },
      wardrobeUtilization: { type: String, default: '' },
    },
    harmonyScore: { type: Number, default: 98.4 },
    aiMatchScore: { type: Number, default: 0.98 },
    isWornToday: { type: Boolean, default: false },
    isBookmarked: { type: Boolean, default: false },
    history: [{ type: String }],
    source: { type: String, enum: ['gemini', 'rules'], default: 'rules' },
  },
  { timestamps: true }
);

OutfitSchema.index({ userId: 1, createdAt: -1 });
OutfitSchema.index({ userId: 1, isBookmarked: 1 });

export const Outfit = mongoose.model<IOutfit>('Outfit', OutfitSchema);
