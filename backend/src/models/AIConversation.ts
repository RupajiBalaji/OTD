import mongoose, { Schema, Document } from 'mongoose';

export interface IAIConversation extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  contextOccasion?: string;
  contextVenue?: string;
  contextVibe?: string;
  activeOutfitId?: mongoose.Types.ObjectId;
  lastMessageAt: Date;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AIConversationSchema = new Schema<IAIConversation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'Haute Styling Session', trim: true },
    contextOccasion: { type: String },
    contextVenue: { type: String },
    contextVibe: { type: String },
    activeOutfitId: { type: Schema.Types.ObjectId, ref: 'Outfit' },
    lastMessageAt: { type: Date, default: Date.now },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AIConversation = mongoose.model<IAIConversation>('AIConversation', AIConversationSchema);
