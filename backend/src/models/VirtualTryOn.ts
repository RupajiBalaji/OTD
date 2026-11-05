import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVirtualTryOn extends Document {
  jobId: string;
  userId: Types.ObjectId;
  outfitId?: Types.ObjectId;
  itemIds: Types.ObjectId[];
  status: 'queued' | 'compositing' | 'rendering' | 'completed' | 'fallback_to_layered' | 'failed';
  progress: number;
  renderResultUrl?: string;
  lightingPreset: string;
  silhouetteFidelity: number;
  fabricDrapeNotes?: string;
  personaType?: 'boy' | 'girl' | 'women' | 'man';
  modelFaceUrl?: string;
  customPhotoUrl?: string;
  skinTone?: string;
  bodyShape?: string;
  height?: string;
  cacheKey?: string;
  fallbackToLayered: boolean;
  fallbackReason?: string;
  isMinorProtected: boolean;
  source: 'gemini' | 'rules';
  createdAt: Date;
  updatedAt: Date;
}

const VirtualTryOnSchema = new Schema<IVirtualTryOn>(
  {
    jobId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    outfitId: { type: Schema.Types.ObjectId, ref: 'Outfit' },
    itemIds: [{ type: Schema.Types.ObjectId, ref: 'WardrobeItem' }],
    status: {
      type: String,
      enum: ['queued', 'compositing', 'rendering', 'completed', 'fallback_to_layered', 'failed'],
      default: 'queued',
    },
    progress: { type: Number, default: 0 },
    renderResultUrl: { type: String },
    lightingPreset: { type: String, default: 'Editorial Studio' },
    silhouetteFidelity: { type: Number, default: 94.0 },
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
    cacheKey: { type: String, index: true },
    fallbackToLayered: { type: Boolean, default: false },
    fallbackReason: { type: String },
    isMinorProtected: { type: Boolean, default: false },
    source: { type: String, enum: ['gemini', 'rules'], default: 'rules' },
  },
  { timestamps: true }
);

export const VirtualTryOn = mongoose.model<IVirtualTryOn>('VirtualTryOn', VirtualTryOnSchema);
