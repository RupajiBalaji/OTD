import { WardrobeGap, IWardrobeGap } from '../../models/WardrobeGap';
import { WardrobeItem } from '../../models/WardrobeItem';
import { ShoppingRecommendationDto } from './shopping.types';
import { env, getGeminiApiKeys } from '../../config/env';

export class ShoppingService {
  public static async analyzeGaps(userId: string): Promise<ShoppingRecommendationDto[]> {
    const closet = await WardrobeItem.find({ userId });

    const categories = {
      tops: closet.filter((i) => i.category === 'tops'),
      bottoms: closet.filter((i) => i.category === 'bottoms'),
      outerwear: closet.filter((i) => i.category === 'outerwear'),
      footwear: closet.filter((i) => i.category === 'footwear'),
      accessories: closet.filter((i) => i.category === 'accessories'),
    };

    const recommendations: ShoppingRecommendationDto[] = [];

    // Gap 1: Outerwear
    if (categories.outerwear.length === 0) {
      recommendations.push({
        id: 'gap_outerwear_1',
        category: 'outerwear',
        name: 'Unstructured Wool Hopsack Blazer',
        brand: 'Cesare Attolini',
        reason: 'Your closet lacks a versatile mid-tier tailoring layer for cool evenings and smart occasions.',
        urgency: 'High',
        estimatedPrice: 890,
        imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80',
        affiliateUrl: 'https://www.mrporter.com/en-us/mens/search/hopsack-blazer',
      });
    }

    // Gap 2: Footwear
    const hasLoafer = categories.footwear.some(
      (f) => f.name.toLowerCase().includes('loafer') || f.subType?.toLowerCase().includes('loafer')
    );
    if (!hasLoafer) {
      recommendations.push({
        id: 'gap_footwear_1',
        category: 'footwear',
        name: 'Belgian Chocolate Suede Loafers',
        brand: 'Baudoin & Lange',
        reason: 'Essential quiet luxury anchor for transitioning effortlessly between relaxed dining and smart social venues.',
        urgency: 'High',
        estimatedPrice: 460,
        imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=500&q=80',
        affiliateUrl: 'https://baudoinlange.com/collections/mens-sagan-classic-loafers',
      });
    }

    // Gap 3: Tailored Bottoms
    const hasPleated = categories.bottoms.some(
      (b) => (b.formality && b.formality >= 4) || b.name.toLowerCase().includes('pleat')
    );
    if (!hasPleated) {
      recommendations.push({
        id: 'gap_bottoms_1',
        category: 'bottoms',
        name: 'High-Rise Forward-Pleat Wool Trousers',
        brand: 'Savile Row Bespoke',
        reason: 'Elevates your lower silhouette without requiring full suiting.',
        urgency: 'Medium',
        estimatedPrice: 420,
        imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&q=80',
        affiliateUrl: 'https://www.mrporter.com/en-us/mens/clothing/trousers',
      });
    }

    // Gap 4: Silk / Fine Knit Top
    const hasFineKnit = categories.tops.some(
      (t) => t.fabric?.toLowerCase().includes('cashmere') || t.fabric?.toLowerCase().includes('silk')
    );
    if (!hasFineKnit) {
      recommendations.push({
        id: 'gap_tops_1',
        category: 'tops',
        name: 'Seamless Silk-Cashmere High Neck',
        brand: 'Brunello Cucinelli',
        reason: 'Provides textural warmth and understated elegance beneath casual outerwear.',
        urgency: 'Medium',
        estimatedPrice: 480,
        imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80',
        affiliateUrl: 'https://shop.brunellocucinelli.com/en-us/men/knitwear',
      });
    }

    // Optional Gemini-written bespoke explanations
    const keys = getGeminiApiKeys();
    if (keys.length > 0 && recommendations.length > 0 && (env.AI_PROVIDER === 'auto' || env.AI_PROVIDER === 'gemini')) {
      try {
        const prompt = `
For each missing wardrobe piece, write an articulate, 1-sentence luxury stylist reason explaining why it elevates this user's wardrobe:
${recommendations.map((r, i) => `${i + 1}. ${r.name} (${r.category})`).join('\n')}

Return a JSON array of strings: ["reason 1", "reason 2", ...]
`.trim();

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL || 'gemini-3.5-flash'}:generateContent`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(url, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': keys[0],
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 0 } },
          }),
        }).finally(() => clearTimeout(timeout));

        if (res.ok) {
          const data: any = await res.json();
          const reasons = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]');
          if (Array.isArray(reasons)) {
            reasons.forEach((geminiReason, idx) => {
              if (recommendations[idx] && typeof geminiReason === 'string') {
                recommendations[idx].reason = geminiReason;
              }
            });
          }
        }
      } catch (err: any) {
        // Keep rules reasons
      }
    }

    // Sync into WardrobeGap model
    for (const rec of recommendations) {
      const exists = await WardrobeGap.findOne({ userId, title: rec.name });
      if (!exists) {
        await WardrobeGap.create({
          userId,
          title: rec.name,
          reason: rec.reason,
          urgency: rec.urgency,
          recommendedCategory: rec.category,
          isResolved: false,
        });
      }
    }

    return recommendations;
  }
}
