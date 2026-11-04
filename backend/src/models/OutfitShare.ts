import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOutfitShare extends Document {
  userId: Types.ObjectId;
  outfitId?: Types.ObjectId;
  caption: string;
  venue?: string;
  occasion?: string;
  likesCount: number;
  commentsCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const OutfitShareSchema = new Schema<IOutfitShare>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    outfitId: { type: Schema.Types.ObjectId, ref: 'Outfit', required: false },
    caption: { type: String, required: true },
    venue: { type: String },
    occasion: { type: String },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const OutfitShare = mongoose.model<IOutfitShare>('OutfitShare', OutfitShareSchema);
