import mongoose, { Schema, Document } from 'mongoose';

export interface IOutfitPoll extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  targetOccasion?: string;
  expiresAt: Date;
  isClosed: boolean;
  totalVotes: number;
  createdAt: Date;
  updatedAt: Date;
}

const OutfitPollSchema = new Schema<IOutfitPoll>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    targetOccasion: { type: String },
    expiresAt: { type: Date, required: true },
    isClosed: { type: Boolean, default: false },
    totalVotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const OutfitPoll = mongoose.model<IOutfitPoll>('OutfitPoll', OutfitPollSchema);
