import mongoose, { Schema, Document } from 'mongoose';

export interface IWardrobeUsage extends Document {
  userId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  wornDate: Date;
  outfitId?: mongoose.Types.ObjectId;
  weatherCondition?: string;
  temperature?: number;
  durationHours?: number;
  createdAt: Date;
}

const WardrobeUsageSchema = new Schema<IWardrobeUsage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    itemId: { type: Schema.Types.ObjectId, ref: 'WardrobeItem', required: true, index: true },
    wornDate: { type: Date, required: true, default: Date.now },
    outfitId: { type: Schema.Types.ObjectId, ref: 'Outfit' },
    weatherCondition: { type: String },
    temperature: { type: Number },
    durationHours: { type: Number, default: 8 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

WardrobeUsageSchema.index({ userId: 1, itemId: 1, wornDate: -1 });

export const WardrobeUsage = mongoose.model<IWardrobeUsage>('WardrobeUsage', WardrobeUsageSchema);
