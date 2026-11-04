import mongoose, { Schema, Document } from 'mongoose';

export interface IOutfitHistory extends Document {
  userId: mongoose.Types.ObjectId;
  outfitId: mongoose.Types.ObjectId;
  wornDate: Date;
  occasion: string;
  venue?: string;
  userRating?: number;
  notes?: string;
  photoUrl?: string;
  createdAt: Date;
}

const OutfitHistorySchema = new Schema<IOutfitHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    outfitId: { type: Schema.Types.ObjectId, ref: 'Outfit', required: true, index: true },
    wornDate: { type: Date, required: true, default: Date.now, index: true },
    occasion: { type: String, required: true },
    venue: { type: String },
    userRating: { type: Number, min: 1, max: 5 },
    notes: { type: String },
    photoUrl: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

OutfitHistorySchema.index({ userId: 1, wornDate: -1 });

export const OutfitHistory = mongoose.model<IOutfitHistory>('OutfitHistory', OutfitHistorySchema);
