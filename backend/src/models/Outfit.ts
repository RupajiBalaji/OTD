import mongoose, { Schema, Document } from 'mongoose';

export interface IOutfit extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  items: mongoose.Types.ObjectId[];
  occasion: string;
  vibe: string;
  aiMatchScore: number;
  weatherFitReason: string;
  isWornToday: boolean;
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OutfitSchema = new Schema<IOutfit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    items: [{ type: Schema.Types.ObjectId, ref: 'WardrobeItem', required: true }],
    occasion: { type: String, default: 'casual' },
    vibe: { type: String, default: 'minimalist' },
    aiMatchScore: { type: Number, default: 0.95 },
    weatherFitReason: { type: String, default: '' },
    isWornToday: { type: Boolean, default: false },
    isBookmarked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Outfit = mongoose.model<IOutfit>('Outfit', OutfitSchema);
