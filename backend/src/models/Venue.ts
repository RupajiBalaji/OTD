import mongoose, { Schema, Document } from 'mongoose';

export interface IVenue extends Document {
  name: string;
  category: string;
  address: string;
  city: string;
  formality: 1 | 2 | 3 | 4 | 5;
  recommendedVibe: string;
  dressCodeAdvice: string;
  ambience: string;
  isIndoor: boolean;
  tags: string[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VenueSchema = new Schema<IVenue>(
  {
    name: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    formality: { type: Number, min: 1, max: 5, default: 3 },
    recommendedVibe: { type: String, default: 'Smart Casual' },
    dressCodeAdvice: { type: String, default: 'Refined contemporary attire.' },
    ambience: { type: String, default: 'Upscale' },
    isIndoor: { type: Boolean, default: true },
    tags: [{ type: String }],
    imageUrl: { type: String },
  },
  { timestamps: true }
);

VenueSchema.index({ name: 'text', address: 'text', tags: 'text' });

export const Venue = mongoose.model<IVenue>('Venue', VenueSchema);
