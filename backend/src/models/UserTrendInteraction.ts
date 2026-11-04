import mongoose, { Schema, Document } from 'mongoose';

export interface IUserTrendInteraction extends Document {
  userId: mongoose.Types.ObjectId;
  trendId: mongoose.Types.ObjectId;
  interactionType: 'viewed' | 'saved' | 'adopted' | 'dismissed';
  notes?: string;
  createdAt: Date;
}

const UserTrendInteractionSchema = new Schema<IUserTrendInteraction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    trendId: { type: Schema.Types.ObjectId, ref: 'FashionTrend', required: true, index: true },
    interactionType: {
      type: String,
      enum: ['viewed', 'saved', 'adopted', 'dismissed'],
      default: 'viewed',
    },
    notes: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

UserTrendInteractionSchema.index({ userId: 1, trendId: 1, interactionType: 1 });

export const UserTrendInteraction = mongoose.model<IUserTrendInteraction>(
  'UserTrendInteraction',
  UserTrendInteractionSchema
);
