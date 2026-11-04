import mongoose, { Schema, Document } from 'mongoose';

export interface IOutfitPollVote extends Document {
  pollId: mongoose.Types.ObjectId;
  optionId: mongoose.Types.ObjectId;
  voterId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const OutfitPollVoteSchema = new Schema<IOutfitPollVote>(
  {
    pollId: { type: Schema.Types.ObjectId, ref: 'OutfitPoll', required: true, index: true },
    optionId: { type: Schema.Types.ObjectId, ref: 'OutfitPollOption', required: true },
    voterId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

OutfitPollVoteSchema.index({ pollId: 1, voterId: 1 }, { unique: true });

export const OutfitPollVote = mongoose.model<IOutfitPollVote>('OutfitPollVote', OutfitPollVoteSchema);
