import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVirtualTryOn extends Document {
  userId: Types.ObjectId;
  outfitId?: Types.ObjectId;
  itemIds: Types.ObjectId[];
  status: 'queued' | 'simulating_drape' | 'rendering_3d' | 'completed' | 'failed';
  renderResultUrl: string;
  lightingPreset: string;
  silhouetteFidelity: number;
  fabricDrapeNotes?: string;
  personaType?: 'boy' | 'girl' | 'women' | 'man';
  modelFaceUrl?: string;
  customPhotoUrl?: string;
  skinTone?: string;
  bodyShape?: string;
  height?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VirtualTryOnSchema = new Schema<IVirtualTryOn>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    outfitId: { type: Schema.Types.ObjectId, ref: 'Outfit' },
    itemIds: [{ type: Schema.Types.ObjectId, ref: 'WardrobeItem' }],
    status: {
      type: String,
      enum: ['queued', 'simulating_drape', 'rendering_3d', 'completed', 'failed'],
      default: 'completed',
    },
    renderResultUrl: { type: String, required: true },
    lightingPreset: { type: String, default: 'Editorial Studio' },
    silhouetteFidelity: { type: Number, default: 98.6 },
    fabricDrapeNotes: { type: String },
    personaType: {
      type: String,
      enum: ['boy', 'girl', 'women', 'man'],
      default: 'women',
    },
    modelFaceUrl: { type: String },
    customPhotoUrl: { type: String },
    skinTone: { type: String, default: 'Warm Natural' },
    bodyShape: { type: String, default: 'Athletic' },
    height: { type: String, default: '175 cm' },
  },
  { timestamps: true }
);

export const VirtualTryOn = mongoose.model<IVirtualTryOn>('VirtualTryOn', VirtualTryOnSchema);
