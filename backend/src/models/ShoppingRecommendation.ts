import mongoose, { Schema, Document } from 'mongoose';

export interface IShoppingRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  gapId?: mongoose.Types.ObjectId;
  title: string;
  category: string;
  brand: string;
  price: number;
  currency: string;
  retailerUrl: string;
  imageUrl?: string;
  reason: string;
  affinityScore: number;
  isPurchased: boolean;
  createdAt: Date;
}

const ShoppingRecommendationSchema = new Schema<IShoppingRecommendation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    gapId: { type: Schema.Types.ObjectId, ref: 'WardrobeGap' },
    title: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    retailerUrl: { type: String, required: true },
    imageUrl: { type: String },
    reason: { type: String, required: true },
    affinityScore: { type: Number, default: 95 },
    isPurchased: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ShoppingRecommendation = mongoose.model<IShoppingRecommendation>(
  'ShoppingRecommendation',
  ShoppingRecommendationSchema
);
