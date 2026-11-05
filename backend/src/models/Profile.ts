import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProfile extends Document {
  userId: Types.ObjectId;
  name?: string;
  height?: string;
  bodyShape?: string;
  skinTone?: string;
  stylingPath?: 'Women' | 'Men' | 'Personalize';
  weight?: string;
  stylePersonas: string[];
  preferredFit?: string;
  palettePreferences: string[];
  avoidedColors: string[];
  dislikedElements: string[];
  goals: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    name: { type: String, default: 'Curator' },
    height: { type: String, default: `5'11" (180 cm)` },
    bodyShape: { type: String, default: 'Athletic / V-Taper' },
    skinTone: { type: String, default: 'Warm Undertone' },
    stylingPath: { type: String, enum: ['Women', 'Men', 'Personalize'], default: 'Personalize' },
    weight: { type: String },
    stylePersonas: {
      type: [String],
      default: ['Old Money Heritage', 'Clean Minimalist'],
    },
    preferredFit: { type: String, default: 'Tailored / Regular' },
    palettePreferences: {
      type: [String],
      default: ['Espresso & Earth', 'Ivory & Cream', 'Charcoal & Navy'],
    },
    avoidedColors: {
      type: [String],
      default: ['Neon Green', 'Hot Pink', 'Loud Yellow'],
    },
    dislikedElements: {
      type: [String],
      default: ['Skinny Fits', 'Polyester Blends', 'Heavy Branding'],
    },
    goals: {
      type: [String],
      default: ['Daily Outfits', 'Using Existing Wardrobe'],
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
