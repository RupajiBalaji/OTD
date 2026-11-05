import mongoose from 'mongoose';
import { WardrobeItem } from '../../models/WardrobeItem';
import { Profile } from '../../models/Profile';
import { OutfitGenerationEngine } from '../outfits/outfit-generation.service';
import { IOutfit } from '../../models/Outfit';

const DEFAULT_CURATED_WARDROBE = [
  { id: 'item_c1', name: 'Double-Breasted Cashmere Blazer', category: 'outerwear', color: 'Charcoal Melange', fabric: 'Cashmere Wool', formality: 4 },
  { id: 'item_c2', name: 'Crisp Sea Island Poplin Shirt', category: 'tops', color: 'Optical White', fabric: '100% Egyptian Cotton', formality: 3 },
  { id: 'item_c3', name: 'Pleated Extended-Tab Trousers', category: 'bottoms', color: 'Deep Espresso', fabric: 'Super 130s Wool Gabardine', formality: 4 },
  { id: 'item_c4', name: 'Hand-Patinated Leather Chelsea Boots', category: 'footwear', color: 'Tobacco Patina', fabric: 'Venezia Leather', formality: 3 },
  { id: 'item_c5', name: 'Hand-Woven Silk Georgette Saree', category: 'tops', color: 'Rose Pink Ombre', fabric: 'Silk Georgette', formality: 5 },
  { id: 'item_c6', name: 'Structured Sweetheart Neckline Blouse', category: 'tops', color: 'Soft Ivory', fabric: 'Raw Mulberry Silk', formality: 5 },
  { id: 'item_c7', name: 'Pure Organza Mirror-Work Dupatta', category: 'accessories', color: 'Silver Metallic', fabric: 'Tissue Organza', formality: 4 },
  { id: 'item_c8', name: 'Italian Suede Penny Loafers', category: 'footwear', color: 'Warm Sand', fabric: 'Calfskin Suede', formality: 2 },
  { id: 'item_c9', name: 'Relaxed Organic Cotton Knit', category: 'tops', color: 'Sage Heather', fabric: 'Organic Cotton', formality: 1 },
  { id: 'item_c10', name: 'Selvedge Indigo Tapered Denim', category: 'bottoms', color: 'Midnight Indigo', fabric: 'Japanese Selvedge Denim', formality: 2 },
];

export class AiOutfitPipelineService {
  /**
   * Retrieves verified digital wardrobe items formatted for AI prompt grounding
   */
  public static async getGroundingWardrobe(userId: string) {
    let items: any[] = [];
    try {
      items = await WardrobeItem.find({
        userId: new mongoose.Types.ObjectId(userId),
      }).lean();
    } catch {
      // Ignore cast errors for guest/mock users
    }

    if (items.length > 0) {
      return items.map((item) => ({
        id: item._id.toString(),
        name: item.name,
        category: item.category,
        color: item.color,
        fabric: item.fabric,
        formality: item.formality,
      }));
    }

    return DEFAULT_CURATED_WARDROBE;
  }

  /**
   * Retrieves user styling preferences for prompt grounding
   */
  public static async getUserStylingProfile(userId: string) {
    let profile: any = null;
    try {
      profile = await Profile.findOne({
        userId: new mongoose.Types.ObjectId(userId),
      }).lean();
    } catch {
      // Ignore cast errors for guest/mock users
    }

    return {
      name: profile?.name || 'Curator',
      bodyShape: profile?.bodyShape || 'Athletic',
      stylePersonas: profile?.stylePersonas || ['Clean Minimalist', 'Old Money Luxury'],
      preferredFit: profile?.preferredFit || 'Tailored / Regular',
      palettePreferences: profile?.palettePreferences || ['Neutral Earth Tones', 'Monochrome'],
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
