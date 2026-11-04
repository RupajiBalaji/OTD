import mongoose from 'mongoose';
import { WardrobeItem } from '../../models/WardrobeItem';
import { Profile } from '../../models/Profile';
import { OutfitGenerationEngine } from '../outfits/outfit-generation.service';
import { IOutfit } from '../../models/Outfit';

export class AiOutfitPipelineService {
  /**
   * Retrieves verified digital wardrobe items formatted for AI prompt grounding
   */
  public static async getGroundingWardrobe(userId: string) {
    const items = await WardrobeItem.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();

    return items.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      category: item.category,
      color: item.color,
      fabric: item.fabric,
      formality: item.formality,
    }));
  }

  /**
   * Retrieves user styling preferences for prompt grounding
   */
  public static async getUserStylingProfile(userId: string) {
    const profile = await Profile.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();

    return {
      name: profile?.name || 'Curator',
      bodyShape: profile?.bodyShape || 'Athletic',
      stylePersonas: profile?.stylePersonas || ['Clean Minimalist'],
      preferredFit: profile?.preferredFit || 'Tailored / Regular',
      palettePreferences: profile?.palettePreferences || ['Neutral Earth Tones'],
      avoidedColors: profile?.avoidedColors || [],
    };
  }

  /**
   * Triggers outfit synthesis based on conversational intent
   */
  public static async synthesizeFromChatIntent(
    userId: string,
    criteria: {
      occasion?: string;
      venue?: string;
      vibe?: string;
      weather?: string;
    }
  ): Promise<IOutfit | null> {
    try {
      return await OutfitGenerationEngine.synthesizeOutfit(userId, {
        occasion: criteria.occasion || 'Evening Curation',
        venue: criteria.venue,
        vibe: criteria.vibe || 'Clean Minimalist',
        weather: criteria.weather,
      });
    } catch (err: any) {
      console.warn(`[AiOutfitPipeline] Synthesize intent fallback: ${err.message}`);
      return null;
    }
  }
}
