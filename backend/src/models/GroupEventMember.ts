import mongoose, { Schema, Document } from 'mongoose';

export interface IGroupEventMember extends Document {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: 'host' | 'co-host' | 'attendee';
  status: 'invited' | 'confirmed' | 'declined';
  selectedOutfitId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GroupEventMemberSchema = new Schema<IGroupEventMember>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'GroupEvent', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, enum: ['host', 'co-host', 'attendee'], default: 'attendee' },
    status: { type: String, enum: ['invited', 'confirmed', 'declined'], default: 'invited' },
    selectedOutfitId: { type: Schema.Types.ObjectId, ref: 'Outfit' },
  },
  { timestamps: true }
);

GroupEventMemberSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export const GroupEventMember = mongoose.model<IGroupEventMember>(
  'GroupEventMember',
  GroupEventMemberSchema
);
