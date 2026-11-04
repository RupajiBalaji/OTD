import mongoose, { Schema, Document } from 'mongoose';

export interface IAIMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  suggestedGarmentIds?: mongoose.Types.ObjectId[];
  recommendedOutfitId?: mongoose.Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const AIMessageSchema = new Schema<IAIMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'AIConversation', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sender: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    suggestedGarmentIds: [{ type: Schema.Types.ObjectId, ref: 'WardrobeItem' }],
    recommendedOutfitId: { type: Schema.Types.ObjectId, ref: 'Outfit' },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AIMessageSchema.index({ conversationId: 1, createdAt: 1 });

export const AIMessage = mongoose.model<IAIMessage>('AIMessage', AIMessageSchema);
