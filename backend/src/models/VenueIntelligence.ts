import mongoose, { Schema, Document } from 'mongoose';

export interface IVenueIntelligence extends Document {
  venueId: mongoose.Types.ObjectId;
  dressCodeRules: string[];
  historicalFormalityRatings: number[];
  crowdProfiles: string[];
  lightingProfile: 'Candlelight' | 'Natural Light' | 'Studio Dim' | 'Bright Daytime' | 'Halogen Boardroom';
  acousticProfile: string;
  recommendedGarmentCategories: string[];
  createdAt: Date;
  updatedAt: Date;
}

const VenueIntelligenceSchema = new Schema<IVenueIntelligence>(
  {
    venueId: { type: Schema.Types.ObjectId, ref: 'Venue', required: true, index: true },
    dressCodeRules: [{ type: String }],
    historicalFormalityRatings: [{ type: Number }],
    crowdProfiles: [{ type: String }],
    lightingProfile: {
      type: String,
      enum: ['Candlelight', 'Natural Light', 'Studio Dim', 'Bright Daytime', 'Halogen Boardroom'],
      default: 'Studio Dim',
    },
    acousticProfile: { type: String, default: 'Low background murmur' },
    recommendedGarmentCategories: [{ type: String }],
  },
  { timestamps: true }
);

export const VenueIntelligenceModel = mongoose.model<IVenueIntelligence>('VenueIntelligence', VenueIntelligenceSchema);
