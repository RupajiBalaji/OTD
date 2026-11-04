import mongoose, { Schema, Document } from 'mongoose';

export interface IShareRecipient extends Document {
  shareId: mongoose.Types.ObjectId;
  recipientEmail?: string;
  recipientUserId?: mongoose.Types.ObjectId;
  accessLevel: 'view' | 'vote' | 'comment';
  hasViewed: boolean;
  viewedAt?: Date;
  createdAt: Date;
}

const ShareRecipientSchema = new Schema<IShareRecipient>(
  {
    shareId: { type: Schema.Types.ObjectId, ref: 'OutfitShare', required: true, index: true },
    recipientEmail: { type: String, lowercase: true, trim: true },
    recipientUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    accessLevel: { type: String, enum: ['view', 'vote', 'comment'], default: 'view' },
    hasViewed: { type: Boolean, default: false },
    viewedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ShareRecipient = mongoose.model<IShareRecipient>('ShareRecipient', ShareRecipientSchema);
