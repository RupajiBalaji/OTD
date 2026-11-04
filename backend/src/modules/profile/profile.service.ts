import { Profile, IProfile } from '../../models/Profile';
import { User } from '../../models/User';
import { UserProfileDto } from './profile.types';

export class ProfileService {
  public static async getProfile(userId: string): Promise<IProfile> {
    let profile = await Profile.findOne({ userId });

    if (!profile) {
      const user = await User.findById(userId);
      profile = await Profile.create({
        userId,
        name: user?.name || 'Curator',
      });
    }

    return profile;
  }

  public static async updateProfile(userId: string, data: UserProfileDto): Promise<IProfile> {
    let profile = await Profile.findOne({ userId });

    const allowedFields: Array<keyof UserProfileDto> = [
      'name',
      'height',
      'bodyShape',
      'skinTone',
      'stylePersonas',
      'preferredFit',
      'palettePreferences',
      'avoidedColors',
      'dislikedElements',
      'goals',
    ];

    const sanitizedData: Partial<UserProfileDto> = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        (sanitizedData as any)[key] = data[key];
      }
    }

    if (!profile) {
      const user = await User.findById(userId);
      profile = await Profile.create({
        userId,
        name: sanitizedData.name || user?.name || 'Curator',
        ...sanitizedData,
      });
      return profile;
    }

    Object.assign(profile, sanitizedData);
    await profile.save();

    // If name was updated, synchronize with User model as well
    if (sanitizedData.name) {
      await User.findByIdAndUpdate(userId, { name: sanitizedData.name.trim() });
    }

    return profile;
  }
}
