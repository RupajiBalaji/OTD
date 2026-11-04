import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISocialComment extends Document {
  userId: Types.ObjectId;
  shareId: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const SocialCommentSchema = new Schema<ISocialComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shareId: { type: Schema.Types.ObjectId, ref: 'OutfitShare', required: true, index: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const SocialComment = mongoose.model<ISocialComment>('SocialComment', SocialCommentSchema);
