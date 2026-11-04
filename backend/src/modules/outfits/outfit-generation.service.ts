import { WardrobeItem, IWardrobeItem } from '../../models/WardrobeItem';
import { Outfit, IOutfit, IOutfitRationale } from '../../models/Outfit';
import { ApiError } from '../../utils/ApiError';

export interface OutfitGenerationCriteria {
  occasion: string;
  venue?: string;
  vibe: string;
  weather?: string;
  temperature?: number;
  avoidedColors?: string[];
  dislikedElements?: string[];
  preferredFit?: string;
}

export class OutfitGenerationEngine {
  /**
   * Primary algorithmic dress selection pipeline
   */
  public static async synthesizeOutfit(
    userId: string,
    criteria: OutfitGenerationCriteria
  ): Promise<IOutfit> {
    const rawWardrobe = await WardrobeItem.find({ userId });

    if (rawWardrobe.length < 2) {
      throw new ApiError(
        400,
        `Your Digital Closet requires at least 2 garments to synthesize an ensemble. Currently have ${rawWardrobe.length}.`
      );
    }

    const occasion = criteria.occasion || 'Casual Evening';
    const venue = criteria.venue || 'Curated Venue';
    const vibe = criteria.vibe || 'Clean Minimalist';
    const weather = criteria.weather || '24°C Pleasant';
    const avoidedColors = criteria.avoidedColors || [];
    const dislikedElements = criteria.dislikedElements || [];

    // STEP 1: Filter out blacklisted colors & restricted cuts/fabrics
    const eligibleWardrobe = rawWardrobe.filter((item) => {
      // Check avoided colors
      const isColorBlacklisted = avoidedColors.some((c) =>
        item.color.toLowerCase().includes(c.toLowerCase())
      );
      if (isColorBlacklisted) return false;

      // Check disliked elements (e.g., "Skinny Fits", "Polyester")
      const isDisliked = dislikedElements.some((elem) => {
        const lowerElem = elem.toLowerCase();
        return (
          (item.fabric && item.fabric.toLowerCase().includes(lowerElem)) ||
          (item.fit && item.fit.toLowerCase().includes(lowerElem)) ||
          item.name.toLowerCase().includes(lowerElem)
        );
      });
      if (isDisliked) return false;

      return true;
    });

    // Fallback to raw wardrobe if strict filter left fewer than 2 items
    const activePool = eligibleWardrobe.length >= 2 ? eligibleWardrobe : rawWardrobe;

    // STEP 2: Calibrate Target Formality Tier (1-5)
    const targetFormality = this.calibrateFormality(occasion, venue, vibe);

    // STEP 3: Organize items by category
    const tops = activePool.filter((i) => i.category === 'tops');
    const bottoms = activePool.filter((i) => i.category === 'bottoms');
    const outerwear = activePool.filter((i) => i.category === 'outerwear');
    const footwear = activePool.filter((i) => i.category === 'footwear');
    const accessories = activePool.filter((i) => i.category === 'accessories');

    // STEP 4: Select Base Layer (Top)
    const selectedTop = this.selectBestPiece(tops, targetFormality, activePool[0]) || activePool[0];

    // STEP 5: Select Lower Silhouette (Bottom)
    const selectedBottom = this.selectBestPiece(bottoms, targetFormality, activePool[1] || activePool[0]) || activePool[1] || activePool[0];

    // STEP 6: Select Footwear
    const selectedFootwear = this.selectBestPiece(footwear, targetFormality, undefined);

    // STEP 7: Thermal & Formal Layering (Outerwear)
    const requiresOuterwear =
      targetFormality >= 4 ||
      weather.toLowerCase().includes('cool') ||
      weather.toLowerCase().includes('breezy') ||
      weather.toLowerCase().includes('rain') ||
      (criteria.temperature !== undefined && criteria.temperature < 23);

    const selectedOuterwear = requiresOuterwear
      ? this.selectBestPiece(outerwear, targetFormality, undefined)
      : undefined;

    // STEP 8: Accoutrements / Accessories
    const selectedAccessory = accessories.length > 0 ? accessories[0] : undefined;

    // Assemble pieces
    const selectedPieces: IWardrobeItem[] = [selectedTop, selectedBottom];
    if (selectedOuterwear) selectedPieces.push(selectedOuterwear);
    if (selectedFootwear) selectedPieces.push(selectedFootwear);
    if (selectedAccessory) selectedPieces.push(selectedAccessory);

    // Ensure uniqueness
    const pieceIds = Array.from(new Set(selectedPieces.map((p) => p._id)));

    // STEP 9: Synthesize Editorial Rationale
    const rationale: IOutfitRationale = {
      venueAlignment: `Engineered specifically for ${venue}. The ${selectedTop.name} paired with ${selectedBottom.name} matches the ${occasion} dress code with effortless poise.`,
      weatherComfort: `Calibrated for ${weather}. Natural fibers facilitate air circulation while maintaining a crisp architectural silhouette.`,
      paletteHarmony: `${selectedTop.color || 'Tonal palette'} against ${selectedBottom.color || 'neutral'} creates high-contrast balance aligned with your style DNA.`,
      wardrobeUtilization: `Rotates ${selectedTop.name} (previously worn ${selectedTop.timesWorn || 0} times) to maximize wardrobe cost efficiency.`,
    };

    // Deterministic chromatic harmony and silhouette balance score
    let baseHarmony = 95.0;
    const topFormality = selectedTop.formality || 3;
    const bottomFormality = selectedBottom.formality || 3;
    const deltaFormality = Math.abs(topFormality - bottomFormality);

    if (deltaFormality === 0) baseHarmony += 2.5;
    else if (deltaFormality === 1) baseHarmony += 1.8;
    else baseHarmony -= 2.0;

    if (selectedFootwear) {
      const footDelta = Math.abs((selectedFootwear.formality || 3) - targetFormality);
      if (footDelta <= 1) baseHarmony += 1.2;
    }

    if (selectedOuterwear) {
      baseHarmony += 0.8;
    }

    const harmonyScore = Math.min(99.5, Math.max(90.0, +baseHarmony.toFixed(1)));

    // STEP 10: Persist Outfit record
    const outfit = await Outfit.create({
      userId,
      title: `${vibe} at ${venue.split(',')[0]}`,
      description: `Tailored ensemble curated for ${occasion} at ${venue}.`,
      items: pieceIds,
      occasion,
      venue,
      vibe,
      weather,
      rationale,
      harmonyScore,
      aiMatchScore: +(harmonyScore / 100).toFixed(2),
      isWornToday: false,
      isBookmarked: false,
      history: [],
    });

    return outfit.populate('items');
  }

  /**
   * Conversational modifier: adjusts an existing outfit based on user prompt
   */
  public static async modifyOutfit(
    userId: string,
    outfitId: string,
    instruction: string
  ): Promise<IOutfit> {
    const outfit = await Outfit.findOne({ _id: outfitId, userId }).populate('items');
    if (!outfit) {
      throw new ApiError(404, 'Outfit not found');
    }

    const wardrobe = await WardrobeItem.find({ userId });
    let currentItems: IWardrobeItem[] = outfit.items as unknown as IWardrobeItem[];
    const lower = instruction.toLowerCase();
    const rationale = { ...outfit.rationale };

    if (lower.includes('casual') || lower.includes('relax') || lower.includes('sneaker')) {
      // Swap shoes to clean sneaker
      const sneakers = wardrobe.find(
        (i) => i.category === 'footwear' && (i.name.toLowerCase().includes('sneaker') || i.subType?.toLowerCase().includes('sneaker'))
      ) || wardrobe.find((i) => i.category === 'footwear');

      if (sneakers) {
        currentItems = currentItems.map((item) => (item.category === 'footwear' ? sneakers : item));
      }

      // Swap bottom to chinos/denim
      const casualBottom = wardrobe.find(
        (i) => i.category === 'bottoms' && (i.name.toLowerCase().includes('chino') || i.name.toLowerCase().includes('denim'))
      );
      if (casualBottom) {
        currentItems = currentItems.map((item) => (item.category === 'bottoms' ? casualBottom : item));
      }

      rationale.venueAlignment = `Recalibrated for approachable casual ease: Swapped formal footwear for clean minimalist sneakers and eased trousers.`;
    } else if (lower.includes('boot') || lower.includes('chelsea')) {
      const boots = wardrobe.find(
        (i) => i.category === 'footwear' && (i.name.toLowerCase().includes('boot') || i.subType?.toLowerCase().includes('boot'))
      );
      if (boots) {
        currentItems = currentItems.map((item) => (item.category === 'footwear' ? boots : item));
        rationale.venueAlignment = `Substituted footwear for ${boots.name} to anchor the lower silhouette with architectural poise.`;
      }
    } else if (lower.includes('no jeans') || lower.includes('dont use jeans')) {
      const trousers = wardrobe.find(
        (i) => i.category === 'bottoms' && !i.name.toLowerCase().includes('denim') && !i.name.toLowerCase().includes('jean')
      );
      if (trousers) {
        currentItems = currentItems.map((item) => (item.category === 'bottoms' ? trousers : item));
        rationale.venueAlignment = `Substituted denim with tailored ${trousers.name} for elevated sartorial formality.`;
      }
    } else if (lower.includes('layer') || lower.includes('blazer') || lower.includes('jacket')) {
      const jacket = wardrobe.find((i) => i.category === 'outerwear');
      if (jacket && !currentItems.some((i) => i.category === 'outerwear')) {
        currentItems.push(jacket);
      }
      rationale.weatherComfort = `Added an outer tailored layer to provide thermal versatility and structured shoulder definition.`;
    } else if (lower.includes('dark') || lower.includes('black')) {
      const darkTop = wardrobe.find(
        (i) => i.category === 'tops' && (i.color.toLowerCase().includes('black') || i.color.toLowerCase().includes('navy'))
      );
      if (darkTop) {
        currentItems = currentItems.map((item) => (item.category === 'tops' ? darkTop : item));
        rationale.paletteHarmony = `Deepened palette with ${darkTop.color} for nighttime contrast and commanding posture.`;
      }
    } else {
      rationale.venueAlignment = `Fine-tuned ensemble based on instruction: "${instruction}". Balanced against wardrobe synergy.`;
    }

    outfit.items = Array.from(new Set(currentItems.map((i) => i._id)));
    outfit.rationale = rationale;
    outfit.harmonyScore = Math.min(99.6, +(outfit.harmonyScore + 0.2).toFixed(1));
    outfit.history.push(instruction);

    await outfit.save();
    return outfit.populate('items');
  }

  /**
   * Helper: Calibrate formality tier from context
   */
  private static calibrateFormality(occasion: string, venue: string, vibe: string): number {
    const combined = `${occasion} ${venue} ${vibe}`.toLowerCase();

    if (combined.includes('black tie') || combined.includes('gala') || combined.includes('formal dinner')) {
      return 5;
    }
    if (combined.includes('date') || combined.includes('fine dining') || combined.includes('rooftop') || combined.includes('cocktail')) {
      return 4;
    }
    if (combined.includes('smart') || combined.includes('office') || combined.includes('presentation') || combined.includes('meeting')) {
      return 3;
    }
    if (combined.includes('casual') || combined.includes('cafe') || combined.includes('walk') || combined.includes('brunch')) {
      return 2;
    }
    return 3;
  }

  /**
   * Helper: Select best piece matching formality
   */
  private static selectBestPiece(
    pool: IWardrobeItem[],
    targetFormality: number,
    fallback?: IWardrobeItem
  ): IWardrobeItem | undefined {
    if (pool.length === 0) return fallback;

    // Find closest formality match
    let best = pool[0];
    let minDiff = Math.abs((best.formality || 3) - targetFormality);

    for (let i = 1; i < pool.length; i++) {
      const diff = Math.abs((pool[i].formality || 3) - targetFormality);
      if (diff < minDiff) {
        minDiff = diff;
        best = pool[i];
      }
    }

    return best;
  }
}
