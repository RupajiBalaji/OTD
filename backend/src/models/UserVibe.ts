import mongoose, { Schema, Document } from 'mongoose';

export interface IUserVibe extends Document {
  userId: mongoose.Types.ObjectId;
  vibeName: string;
  intensity: number; // 1 to 10
  associatedAesthetics: string[];
  isCustom: boolean;
  timesSelected: number;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserVibeSchema = new Schema<IUserVibe>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    vibeName: { type: String, required: true, trim: true },
    intensity: { type: Number, default: 5, min: 1, max: 10 },
    associatedAesthetics: [{ type: String }],
    isCustom: { type: Boolean, default: false },
    timesSelected: { type: Number, default: 1 },
    lastUsedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserVibeSchema.index({ userId: 1, vibeName: 1 });

export const UserVibe = mongoose.model<IUserVibe>('UserVibe', UserVibeSchema);
