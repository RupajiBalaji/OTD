import mongoose, { Schema, Document } from 'mongoose';

export type GarmentCategory = 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories' | 'onePiece';

export interface IWardrobeItem extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: GarmentCategory;
  color: string;
  fabric: string;
  season: string;
  imageUrl: string;
  timesWorn: number;
  purchasePrice: number;
  costPerWear: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const WardrobeItemSchema = new Schema<IWardrobeItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['tops', 'bottoms', 'outerwear', 'footwear', 'accessories', 'onePiece'],
      required: true,
      index: true,
    },
    color: { type: String, default: '' },
    fabric: { type: String, default: '' },
    season: { type: String, default: 'All Season' },
    imageUrl: { type: String, required: true },
    timesWorn: { type: Number, default: 0 },
    purchasePrice: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

WardrobeItemSchema.virtual('costPerWear').get(function () {
  return this.timesWorn === 0 ? this.purchasePrice : this.purchasePrice / this.timesWorn;
});

export const WardrobeItem = mongoose.model<IWardrobeItem>('WardrobeItem', WardrobeItemSchema);
