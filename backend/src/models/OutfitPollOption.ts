import mongoose, { Schema, Document } from 'mongoose';

export interface IOutfitPollOption extends Document {
  pollId: mongoose.Types.ObjectId;
  outfitId: mongoose.Types.ObjectId;
  title: string;
  votesCount: number;
  imageUrl?: string;
  createdAt: Date;
}

const OutfitPollOptionSchema = new Schema<IOutfitPollOption>(
  {
    pollId: { type: Schema.Types.ObjectId, ref: 'OutfitPoll', required: true, index: true },
    outfitId: { type: Schema.Types.ObjectId, ref: 'Outfit', required: true },
    title: { type: String, required: true },
    votesCount: { type: Number, default: 0 },
    imageUrl: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const OutfitPollOption = mongoose.model<IOutfitPollOption>('OutfitPollOption', OutfitPollOptionSchema);
