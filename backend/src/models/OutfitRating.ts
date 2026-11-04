import mongoose, { Schema, Document } from 'mongoose';

export interface IOutfitRating extends Document {
  userId: mongoose.Types.ObjectId;
  outfitId: mongoose.Types.ObjectId;
  score: number; // 1 to 5 stars
  feedback?: string;
  comfortRating?: number;
  confidenceRating?: number;
  createdAt: Date;
}

const OutfitRatingSchema = new Schema<IOutfitRating>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    outfitId: { type: Schema.Types.ObjectId, ref: 'Outfit', required: true, index: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, trim: true },
    comfortRating: { type: Number, min: 1, max: 5 },
    confidenceRating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

OutfitRatingSchema.index({ userId: 1, outfitId: 1 }, { unique: true });

export const OutfitRating = mongoose.model<IOutfitRating>('OutfitRating', OutfitRatingSchema);
