import mongoose, { Schema, Document } from 'mongoose';

export type GarmentCategory = 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories' | 'onePiece';

export interface IWardrobeItem extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: GarmentCategory;
  subType?: string;
  brand?: string;
  color: string;
  fabric: string;
  fit?: 'Slim' | 'Regular' | 'Relaxed / Tailored';
  formality?: 1 | 2 | 3 | 4 | 5;
  season: string;
  imageUrl: string;
  icon?: string;
  timesWorn: number;
  lastWorn?: Date;
  purchasePrice: number;
  costPerWear: number | null;
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
    subType: { type: String, default: '' },
    brand: { type: String, default: 'Curated' },
    color: { type: String, default: '' },
    fabric: { type: String, default: '' },
    fit: { type: String, default: 'Regular' },
    formality: { type: Number, min: 1, max: 5, default: 3 },
    icon: { type: String, default: '👔' },
    season: { type: String, default: 'All Season' },
    imageUrl: { type: String, required: true },
    timesWorn: { type: Number, default: 0 },
    lastWorn: { type: Date },
    purchasePrice: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

WardrobeItemSchema.index({ userId: 1, category: 1 });
WardrobeItemSchema.index({ userId: 1, createdAt: -1 });

WardrobeItemSchema.virtual('costPerWear').get(function () {
  return this.timesWorn === 0 ? null : +(this.purchasePrice / this.timesWorn).toFixed(2);
});

export const WardrobeItem = mongoose.model<IWardrobeItem>('WardrobeItem', WardrobeItemSchema);
