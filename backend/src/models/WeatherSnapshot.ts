import mongoose, { Schema, Document } from 'mongoose';

export interface IWeatherSnapshot extends Document {
  city: string;
  country?: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex?: number;
  recommendedFabrics: string[];
  outerwearRequired: boolean;
  capturedAt: Date;
}

const WeatherSnapshotSchema = new Schema<IWeatherSnapshot>(
  {
    city: { type: String, required: true, index: true },
    country: { type: String, default: 'IN' },
    temperature: { type: Number, required: true },
    feelsLike: { type: Number, required: true },
    condition: { type: String, required: true },
    humidity: { type: Number, required: true },
    windSpeed: { type: Number, default: 0 },
    uvIndex: { type: Number },
    recommendedFabrics: [{ type: String }],
    outerwearRequired: { type: Boolean, default: false },
    capturedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

WeatherSnapshotSchema.index({ city: 1, capturedAt: -1 });

export const WeatherSnapshot = mongoose.model<IWeatherSnapshot>('WeatherSnapshot', WeatherSnapshotSchema);
