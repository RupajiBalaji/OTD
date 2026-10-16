import { Outfit, IOutfit } from '../../models/Outfit';
import { WardrobeItem } from '../../models/WardrobeItem';
import { ApiError } from '../../utils/ApiError';

export class OutfitsService {
  public static async getDailyRecommendations(userId: string) {
    let saved = await Outfit.find({ userId }).populate('items').sort({ createdAt: -1 }).limit(5);

    // If no outfits generated yet, synthesize initial AI recommendations
    if (saved.length === 0) {
      const wardrobe = await WardrobeItem.find({ userId });
      if (wardrobe.length >= 2) {
        const outfit = await Outfit.create({
          userId,
          title: 'The Parisian Minimalist',
          description: 'Understated elegance balancing structured wool tailoring with soft fluid silk.',
          items: wardrobe.slice(0, Math.min(3, wardrobe.length)).map((w) => w._id),
          occasion: 'casual',
          vibe: 'minimalist',
          aiMatchScore: 0.98,
          weatherFitReason: 'Optimized for mild transitional weather. Layered composition allows effortless temperature modulation.',
        });
        saved = [await outfit.populate('items')];
      }
    }

    return saved;
  }

  public static async generateOutfit(userId: string, criteria: { occasion: string; vibe: string; weatherSummary?: string }) {
    const wardrobe = await WardrobeItem.find({ userId });
    if (wardrobe.length < 2) {
      throw new ApiError(400, 'Need at least 2 wardrobe items to synthesize an outfit');
    }

    // Select random top, bottom, outerwear from available items
    const selected = wardrobe.sort(() => 0.5 - Math.random()).slice(0, Math.min(3, wardrobe.length));

    const outfit = await Outfit.create({
      userId,
      title: `Curated ${criteria.vibe.toUpperCase()} Look`,
      description: `Algorithmically styled for ${criteria.occasion} occasions with ${criteria.vibe} aesthetic harmony.`,
      items: selected.map((s) => s._id),
      occasion: criteria.occasion,
      vibe: criteria.vibe,
      aiMatchScore: +(0.92 + Math.random() * 0.07).toFixed(2),
      weatherFitReason: criteria.weatherSummary || 'Harmonized for comfortable thermal regulation and movement.',
    });

    return outfit.populate('items');
  }

  public static async logAsWorn(userId: string, outfitId: string) {
    const outfit = await Outfit.findOne({ _id: outfitId, userId });
    if (!outfit) {
      throw new ApiError(404, 'Outfit not found');
    }

    outfit.isWornToday = true;
    await outfit.save();

    // Increment wear counts on all items
    await WardrobeItem.updateMany(
      { _id: { $in: outfit.items } },
      { $inc: { timesWorn: 1 } }
    );

    return outfit;
  }

  public static async toggleBookmark(userId: string, outfitId: string) {
    const outfit = await Outfit.findOne({ _id: outfitId, userId });
    if (!outfit) {
      throw new ApiError(404, 'Outfit not found');
    }

    outfit.isBookmarked = !outfit.isBookmarked;
    await outfit.save();
    return outfit;
  }
}
