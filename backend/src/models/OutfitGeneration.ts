import mongoose, { Schema, Document } from 'mongoose';

export interface IOutfitGeneration extends Document {
  userId: mongoose.Types.ObjectId;
  criteria: {
    occasion: string;
    venue?: string;
    vibe: string;
    weather?: string;
    temperature?: number;
    avoidedColors?: string[];
    dislikedElements?: string[];
    preferredFit?: string;
  };
  generatedOutfitId?: mongoose.Types.ObjectId;
  candidatePiecesCount: number;
  engineExecutionMs: number;
  modelUsed: string;
  createdAt: Date;
}

const OutfitGenerationSchema = new Schema<IOutfitGeneration>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    criteria: {
      occasion: { type: String, required: true },
      venue: { type: String },
      vibe: { type: String, required: true },
      weather: { type: String },
      temperature: { type: Number },
      avoidedColors: [{ type: String }],
      dislikedElements: [{ type: String }],
      preferredFit: { type: String },
    },
    generatedOutfitId: { type: Schema.Types.ObjectId, ref: 'Outfit' },
    candidatePiecesCount: { type: Number, default: 0 },
    engineExecutionMs: { type: Number, default: 0 },
    modelUsed: { type: String, default: 'OTD-Chromatic-v1' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const OutfitGeneration = mongoose.model<IOutfitGeneration>('OutfitGeneration', OutfitGenerationSchema);
