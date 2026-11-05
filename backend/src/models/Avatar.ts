import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAvatar extends Document {
  userId: Types.ObjectId;
  height: string;
  bodyProportions: {
    shoulderWidth: string;
    chest: string;
    waist: string;
    inseam: string;
  };
  skinTone: string;
  hair: string;
  baseImageUrl?: string;
  avatarVersion: number;
  pose: 'frontal' | 'three_quarter' | 'profile' | 'dynamic_walking';
  meshModelUrl?: string;
  ambientLighting: 'Golden Hour' | 'Candlelight Dinner' | 'Editorial Studio' | 'Natural Daylight';
  createdAt: Date;
  updatedAt: Date;
}

const AvatarSchema = new Schema<IAvatar>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    height: { type: String, default: '180 cm' },
    bodyProportions: {
      shoulderWidth: { type: String, default: '48 cm' },
      chest: { type: String, default: '102 cm' },
      waist: { type: String, default: '82 cm' },
      inseam: { type: String, default: '84 cm' },
    },
    skinTone: { type: String, default: 'Warm Neutral' },
    hair: { type: String, default: 'Classic Dark Espresso' },
    baseImageUrl: { type: String },
    avatarVersion: { type: Number, default: 1 },
    pose: {
      type: String,
      enum: ['frontal', 'three_quarter', 'profile', 'dynamic_walking'],
      default: 'three_quarter',
    },
    meshModelUrl: { type: String },
    ambientLighting: {
      type: String,
      enum: ['Golden Hour', 'Candlelight Dinner', 'Editorial Studio', 'Natural Daylight'],
      default: 'Editorial Studio',
    },
  },
  { timestamps: true }
);

export const Avatar = mongoose.model<IAvatar>('Avatar', AvatarSchema);
