import mongoose, { Schema, Document } from 'mongoose';

export interface IFashionTrend extends Document {
  title: string;
  season: string;
  category: string;
  description: string;
  keyAesthetics: string[];
  recommendedFabrics: string[];
  trendingColors: string[];
  popularityScore: number;
  heroImageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FashionTrendSchema = new Schema<IFashionTrend>(
  {
    title: { type: String, required: true, trim: true, index: true },
    season: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    keyAesthetics: [{ type: String }],
    recommendedFabrics: [{ type: String }],
    trendingColors: [{ type: String }],
    popularityScore: { type: Number, default: 85, min: 0, max: 100 },
    heroImageUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const FashionTrend = mongoose.model<IFashionTrend>('FashionTrend', FashionTrendSchema);
