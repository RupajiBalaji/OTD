import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEvent extends Document {
  userId: Types.ObjectId;
  title: string;
  venue: string;
  occasion: string;
  vibe: string;
  scheduledDate: Date;
  time: string;
  outfitId?: Types.ObjectId;
  weatherForecast?: string;
  status: 'scheduled' | 'worn' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    venue: { type: String, required: true },
    occasion: { type: String, required: true },
    vibe: { type: String, default: 'Clean Minimalist' },
    scheduledDate: { type: Date, required: true, index: true },
    time: { type: String, default: '8:00 PM' },
    outfitId: { type: Schema.Types.ObjectId, ref: 'Outfit', required: false },
    weatherForecast: { type: String, default: '24°C Pleasant' },
    status: {
      type: String,
      enum: ['scheduled', 'worn', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>('Event', EventSchema);
