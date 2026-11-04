import mongoose, { Schema, Document } from 'mongoose';

export interface IGroupEvent extends Document {
  title: string;
  description?: string;
  creatorId: mongoose.Types.ObjectId;
  venue?: string;
  scheduledDate: Date;
  themeOrDressCode?: string;
  isPrivate: boolean;
  coverImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GroupEventSchema = new Schema<IGroupEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    venue: { type: String },
    scheduledDate: { type: Date, required: true, index: true },
    themeOrDressCode: { type: String, default: 'Smart Casual' },
    isPrivate: { type: Boolean, default: true },
    coverImageUrl: { type: String },
  },
  { timestamps: true }
);

export const GroupEvent = mongoose.model<IGroupEvent>('GroupEvent', GroupEventSchema);
