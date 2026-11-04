import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISocialLike extends Document {
  userId: Types.ObjectId;
  shareId: Types.ObjectId;
  createdAt: Date;
}

const SocialLikeSchema = new Schema<ISocialLike>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shareId: { type: Schema.Types.ObjectId, ref: 'OutfitShare', required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

SocialLikeSchema.index({ userId: 1, shareId: 1 }, { unique: true });

export const SocialLike = mongoose.model<ISocialLike>('SocialLike', SocialLikeSchema);
