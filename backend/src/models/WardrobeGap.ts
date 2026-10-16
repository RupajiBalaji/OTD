import mongoose, { Schema, Document } from 'mongoose';

export interface IWardrobeGap extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  reason: string;
  urgency: 'High' | 'Medium' | 'Low';
  recommendedCategory: string;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WardrobeGapSchema = new Schema<IWardrobeGap>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    reason: { type: String, required: true },
    urgency: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    recommendedCategory: { type: String, required: true },
    isResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const WardrobeGap = mongoose.model<IWardrobeGap>('WardrobeGap', WardrobeGapSchema);
