import { Outfit, IOutfit } from '../../models/Outfit';
import { WardrobeItem } from '../../models/WardrobeItem';
import { ApiError } from '../../utils/ApiError';
import { OutfitGenerationEngine, OutfitGenerationCriteria } from './outfit-generation.service';

export class OutfitsService {
  public static async getDailyRecommendations(userId: string) {
    let saved = await Outfit.find({ userId }).populate('items').sort({ createdAt: -1 }).limit(10);

    // If no outfits generated yet, synthesize initial AI recommendation from closet
    if (saved.length === 0) {
      const wardrobe = await WardrobeItem.find({ userId });
      if (wardrobe.length >= 2) {
        const initialOutfit = await OutfitGenerationEngine.synthesizeOutfit(userId, {
          occasion: 'Evening Social',
          venue: 'Olive Bistro, Jubilee Hills',
          vibe: 'Clean Minimalist',
          weather: '26°C Breezy',
        });
        saved = [initialOutfit as any];
      }
    }

    return saved;
  }

  public static async generateOutfit(userId: string, criteria: OutfitGenerationCriteria) {
    return OutfitGenerationEngine.synthesizeOutfit(userId, criteria);
  }

  public static async modifyOutfit(userId: string, outfitId: string, instruction: string) {
    return OutfitGenerationEngine.modifyOutfit(userId, outfitId, instruction);
  }

  public static async getSavedOutfits(userId: string) {
    return Outfit.find({ userId, isBookmarked: true }).populate('items').sort({ updatedAt: -1 });
  }

  public static async logAsWorn(userId: string, outfitId: string) {
    const outfit = await Outfit.findOne({ _id: outfitId, userId });
    if (!outfit) {
      throw new ApiError(404, 'Outfit not found');
    }

    outfit.isWornToday = true;
    await outfit.save();

    // Increment wear counts on all items and update lastWorn timestamp
    await WardrobeItem.updateMany(
      { _id: { $in: outfit.items } },
      {
        $inc: { timesWorn: 1 },
        $set: { lastWorn: new Date() },
      }
    );

    return outfit.populate('items');
  }

  public static async toggleBookmark(userId: string, outfitId: string) {
    const outfit = await Outfit.findOne({ _id: outfitId, userId });
    if (!outfit) {
      throw new ApiError(404, 'Outfit not found');
    }

    outfit.isBookmarked = !outfit.isBookmarked;
    await outfit.save();
    return outfit.populate('items');
  }
}
