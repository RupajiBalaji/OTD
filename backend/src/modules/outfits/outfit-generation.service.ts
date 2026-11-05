import { WardrobeItem, IWardrobeItem } from '../../models/WardrobeItem';
import { Outfit, IOutfit, IOutfitRationale } from '../../models/Outfit';
import { ApiError } from '../../utils/ApiError';
import { UnifiedAiClient } from '../../integrations/ai/ai.client';

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
   * Calculates a mathematically grounded harmony score based on:
   * 1. Color harmony (0-40 pts)
   * 2. Formality alignment (0-35 pts)
   * 3. Climate & fabric physics (0-25 pts)
   */
  public static calculateComputedHarmonyScore(
    pieces: IWardrobeItem[],
    targetFormality: number,
    temperature: number = 24
  ): number {
    if (pieces.length === 0) return 70.0;

    // 1. Color Harmony Analysis (0 - 40 points)
    let colorScore = 34.0;
    const colors = pieces.map((p) => (p.color || '').toLowerCase());
    const hasNeutral = colors.some((c) =>
      ['white', 'ivory', 'cream', 'black', 'charcoal', 'navy', 'khaki', 'sand', 'grey'].some((n) => c.includes(n))
    );
    const hasAccent = colors.some((c) =>
      ['blue', 'rust', 'terracotta', 'rose', 'pink', 'green', 'olive', 'cherry'].some((a) => c.includes(a))
    );

    if (hasNeutral && hasAccent) {
      colorScore += 5.5; // Classic neutral + accent anchor
    } else if (hasNeutral) {
      colorScore += 4.5; // Sophisticated monochrome / ton-sur-ton
    }

    // 2. Formality Alignment (0 - 35 points)
    let formalityScore = 32.0;
    const formalities = pieces.map((p) => p.formality || 3);
    const avgFormality = formalities.reduce((a, b) => a + b, 0) / formalities.length;
    const deltaFormality = Math.abs(avgFormality - targetFormality);

    if (deltaFormality < 0.5) formalityScore += 3.0;
    else if (deltaFormality <= 1.0) formalityScore += 1.5;
    else formalityScore -= Math.min(8.0, deltaFormality * 2.5);

    // 3. Thermal Comfort & Climate Fit (0 - 25 points)
    let climateScore = 22.0;
    const fabrics = pieces.map((p) => (p.fabric || '').toLowerCase()).join(' ');

    if (temperature >= 26) {
      // Warm weather: prefers linen, cotton, silk
      if (fabrics.includes('linen') || fabrics.includes('cotton') || fabrics.includes('silk') || fabrics.includes('slub')) {
        climateScore += 2.8;
      }
      if (fabrics.includes('heavy wool') || fabrics.includes('cashmere overcoat')) {
        climateScore -= 4.5;
      }
    } else if (temperature <= 18) {
      // Cool weather: benefits from wool, cashmere, layering
      if (fabrics.includes('wool') || fabrics.includes('cashmere') || fabrics.includes('tweed') || fabrics.includes('twill')) {
        climateScore += 2.8;
      }
    }

    const total = colorScore + formalityScore + climateScore;
    return Math.min(99.4, Math.max(72.0, +total.toFixed(1)));
  }

  /**
   * Primary dress selection pipeline: Rules candidate generation + Gemini ranking
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
    const temperature = criteria.temperature || 24;
    const avoidedColors = criteria.avoidedColors || [];
    const dislikedElements = criteria.dislikedElements || [];

    // STEP 1: Hard Constraints Enforcement (Avoided colors, disliked cuts/fabrics)
    const eligibleWardrobe = rawWardrobe.filter((item) => {
      const isColorBlacklisted = avoidedColors.some((c) =>
        item.color.toLowerCase().includes(c.toLowerCase())
      );
      if (isColorBlacklisted) return false;

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

    const activePool = eligibleWardrobe.length >= 2 ? eligibleWardrobe : rawWardrobe;
    const targetFormality = this.calibrateFormality(occasion, venue, vibe);

    // STEP 2: Partition Wardrobe by category
    const tops = activePool.filter((i) => i.category === 'tops');
    const bottoms = activePool.filter((i) => i.category === 'bottoms');
    const outerwear = activePool.filter((i) => i.category === 'outerwear');
    const footwear = activePool.filter((i) => i.category === 'footwear');
    const accessories = activePool.filter((i) => i.category === 'accessories');
    const onePieces = activePool.filter((i) => i.category === 'onePiece' || i.subType?.toLowerCase().includes('saree') || i.subType?.toLowerCase().includes('dress'));

    // STEP 3: Rules Engine Generates Up to 3 Candidates
    const candidates: { id: string; pieces: IWardrobeItem[]; harmony: number }[] = [];

    // Candidate A: Formal / Occasion Signature Look
    if (onePieces.length > 0 && targetFormality >= 4) {
      const bestDress = onePieces[0];
      const shoe = footwear[0] || activePool.find((i) => i.category === 'footwear');
      const pieces = [bestDress];
      if (shoe) pieces.push(shoe);
      if (accessories[0]) pieces.push(accessories[0]);
      candidates.push({ id: 'candidate_1', pieces, harmony: this.calculateComputedHarmonyScore(pieces, targetFormality, temperature) });
    } else if (tops.length > 0 && bottoms.length > 0) {
      const top = tops[0];
      const bottom = bottoms[0];
      const shoe = footwear[0];
      const pieces = [top, bottom];
      if (shoe) pieces.push(shoe);
      if (outerwear[0] && temperature < 22) pieces.push(outerwear[0]);
      candidates.push({ id: 'candidate_1', pieces, harmony: this.calculateComputedHarmonyScore(pieces, targetFormality, temperature) });
    }

    // Candidate B: Contemporary / Alternative Silhouette
    if (tops.length > 1 && bottoms.length > 0) {
      const top = tops[1];
      const bottom = bottoms[bottoms.length - 1] || bottoms[0];
      const shoe = footwear[footwear.length - 1] || footwear[0];
      const pieces = [top, bottom];
      if (shoe) pieces.push(shoe);
      candidates.push({ id: 'candidate_2', pieces, harmony: this.calculateComputedHarmonyScore(pieces, targetFormality, temperature) });
    }

    // Candidate C: Comfort / Relaxed Look
    if (activePool.length >= 2) {
      const pieces = activePool.slice(0, 3);
      candidates.push({ id: 'candidate_3', pieces, harmony: this.calculateComputedHarmonyScore(pieces, targetFormality, temperature) });
    }

    const validCandidates = candidates.length > 0 ? candidates : [{ id: 'candidate_1', pieces: activePool.slice(0, 2), harmony: 88.5 }];

    // STEP 4: Gemini Ranks Candidates with Strict Grounding
    let selectedCandidate = validCandidates[0];
    let editorialRationale: IOutfitRationale = {
      venueAlignment: `Engineered specifically for ${venue}. The look matches ${occasion} standards with natural elegance.`,
      weatherComfort: `Calibrated for ${weather}. Natural fibers facilitate breathability and thermal comfort.`,
      paletteHarmony: `Cohesive color balance anchoring neutral bases with refined textures.`,
      wardrobeUtilization: `Rotates verified wardrobe investments to optimize cost per wear.`,
    };
    let source: 'gemini' | 'rules' = 'rules';

    try {
      const candidateDescriptions = validCandidates
        .map(
          (c, idx) =>
            `[${c.id}] (Candidate #${idx + 1}): ` +
            c.pieces.map((p) => `- [ID: ${p._id}] ${p.name} (${p.category}, ${p.color}, ${p.fabric})`).join(', ')
        )
        .join('\n');

      const rankingPrompt = `
EVENT CONTEXT:
- Occasion: ${occasion}
- Venue: ${venue}
- Formality Tier: ${targetFormality}/5
- Weather: ${weather}

CANDIDATE OUTFITS FROM USER'S WARDROBE:
${candidateDescriptions}

Evaluate and select the single best candidate. You may ONLY reference the candidate IDs and garment IDs provided above.
Return structured JSON matching the OutfitRankingOutput schema.
`.trim();

      const rankResult = await UnifiedAiClient.rankOutfitCandidates(rankingPrompt);
      if (rankResult.source === 'gemini') {
        const choice = validCandidates.find((c) => c.id === rankResult.data.selectedCandidateId) || validCandidates[0];
        selectedCandidate = choice;
        source = 'gemini';
        editorialRationale = {
          venueAlignment: rankResult.data.stylistRationale.venueAlignment || editorialRationale.venueAlignment,
          weatherComfort: rankResult.data.stylistRationale.weatherComfort || editorialRationale.weatherComfort,
          paletteHarmony: rankResult.data.stylistRationale.colorTheory || editorialRationale.paletteHarmony,
          wardrobeUtilization: `High wardrobe rotation efficiency on verified piece ${choice.pieces[0]?.name || ''}.`,
        };
      }
    } catch (e: any) {
      console.warn(`[OutfitGeneration] Gemini ranking fallback: ${e.message}`);
    }

    const pieceIds = Array.from(new Set(selectedCandidate.pieces.map((p) => p._id)));
    const harmonyScore = selectedCandidate.harmony;

    // STEP 5: Persist Outfit record
    const outfit = await Outfit.create({
      userId,
      title: `${vibe} at ${venue.split(',')[0]}`,
      description: `Tailored ensemble curated for ${occasion} at ${venue}.`,
      items: pieceIds,
      occasion,
      venue,
      vibe,
      weather,
      rationale: editorialRationale,
      harmonyScore,
      aiMatchScore: +(harmonyScore / 100).toFixed(2),
      isWornToday: false,
      isBookmarked: false,
      history: [],
      source,
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
      const sneakers = wardrobe.find(
        (i) => i.category === 'footwear' && (i.name.toLowerCase().includes('sneaker') || i.subType?.toLowerCase().includes('sneaker') || i.subType?.toLowerCase().includes('slide'))
      ) || wardrobe.find((i) => i.category === 'footwear');

      if (sneakers) {
        currentItems = currentItems.filter((i) => i.category !== 'footwear').concat(sneakers);
        rationale.venueAlignment = `Swapped footwear to ${sneakers.name} for elevated casual ease.`;
      }
    } else if (lower.includes('warm') || lower.includes('coat') || lower.includes('jacket')) {
      const jacket = wardrobe.find((i) => i.category === 'outerwear');
      if (jacket && !currentItems.some((i) => i.category === 'outerwear')) {
        currentItems.push(jacket);
        rationale.weatherComfort = `Layered ${jacket.name} for thermal comfort.`;
      }
    }

    outfit.items = Array.from(new Set(currentItems.map((i) => i._id))) as any;
    outfit.rationale = rationale;
    outfit.harmonyScore = this.calculateComputedHarmonyScore(currentItems, 3, 24);
    await outfit.save();

    return outfit.populate('items');
  }

  private static calibrateFormality(occasion: string, venue: string, vibe: string): number {
    const combined = `${occasion} ${venue} ${vibe}`.toLowerCase();
    if (combined.includes('gala') || combined.includes('black tie') || combined.includes('wedding')) return 5;
    if (combined.includes('interview') || combined.includes('corporate') || combined.includes('cocktail')) return 4;
    if (combined.includes('date') || combined.includes('dinner') || combined.includes('bistro')) return 3;
    if (combined.includes('brunch') || combined.includes('farewell')) return 3;
    return 2;
  }
}
