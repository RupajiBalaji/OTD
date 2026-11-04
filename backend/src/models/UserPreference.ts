import mongoose, { Schema, Document } from 'mongoose';

export interface IUserPreference extends Document {
  userId: mongoose.Types.ObjectId;
  preferredFits: string[];
  favoritePalettes: string[];
  avoidedColors: string[];
  dislikedFabrics: string[];
  maxDailyFormality: number;
  autoWeatherSync: boolean;
  editorialNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserPreferenceSchema = new Schema<IUserPreference>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    preferredFits: [{ type: String }],
    favoritePalettes: [{ type: String }],
    avoidedColors: [{ type: String }],
    dislikedFabrics: [{ type: String }],
    maxDailyFormality: { type: Number, default: 5 },
    autoWeatherSync: { type: Boolean, default: true },
    editorialNotifications: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const UserPreference = mongoose.model<IUserPreference>('UserPreference', UserPreferenceSchema);
