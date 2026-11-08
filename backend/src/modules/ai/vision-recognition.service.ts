import { env, getGeminiApiKeys } from '../../config/env';
import { GarmentVisionOutputSchema, GarmentVisionOutput } from '../../integrations/ai/ai.schemas';

export interface DetectedGarmentAttributes extends GarmentVisionOutput {
  source: 'gemini' | 'rules';
}

export class VisionRecognitionService {
  /**
   * Performs multimodal garment intelligence analysis on clothing imagery
   */
  public static async analyzeGarment(input: {
    imageUrl?: string;
    fileName?: string;
    mimeType?: string;
    buffer?: Buffer;
  }): Promise<DetectedGarmentAttributes> {
    const keys = getGeminiApiKeys();

    if (input.buffer && keys.length > 0 && (env.AI_PROVIDER === 'auto' || env.AI_PROVIDER === 'gemini')) {
      try {
        const geminiResult = await this.analyzeWithGeminiVision(input.buffer, input.mimeType);
        if (geminiResult) {
          return {
            ...geminiResult,
            source: 'gemini',
          };
        }
      } catch (err: any) {
        console.warn(`[VisionRecognition] Gemini Vision API error: ${err.message}. Gracefully falling back to rules.`);
      }
    }

    // Rules fallback (honest: marks fields as uncertain for user confirmation, no fake 99% confidence)
    return this.fallbackRulesExtraction(input.fileName || input.imageUrl);
  }

  /**
   * Multimodal garment digitization via Google Gemini Vision
   */
  private static async analyzeWithGeminiVision(
    buffer: Buffer,
    mimeType: string = 'image/jpeg'
  ): Promise<GarmentVisionOutput | null> {
    const keys = getGeminiApiKeys();
    if (keys.length === 0) return null;

    const base64Data = buffer.toString('base64');
    const model = env.GEMINI_VISION_MODEL || env.GEMINI_MODEL || 'gemini-3.5-flash';

    const prompt = `
Analyze this clothing image for a digital luxury wardrobe indexing system.
Extract and return a single valid JSON object with the following fields:
- name: A sophisticated product title (e.g., "Charcoal Double-Breasted Wool Blazer", "Sea Island Cotton Oxford Shirt").
- category: Exactly one of ["tops", "bottoms", "outerwear", "footwear", "accessories", "onePiece"].
- subType: Specific garment subcategory (e.g., "Knit Rollneck", "Pleated Trousers", "Chelsea Boots", "Trench Coat").
- color: Primary color and undertone (e.g., "French Blue", "Espresso Brown", "Ivory Cream", "Deep Indigo").
- fabric: Estimated fabric composition (e.g., "Super 130s Merino Wool", "Washed Linen", "Silk-Cashmere", "Selvedge Denim").
- fit: Exactly one of ["Slim", "Regular", "Relaxed / Tailored"].
- formality: An integer from 1 to 5 (1 = Casual/Street, 2 = Smart Casual, 3 = Elevated Date, 4 = Sartorial Tailored, 5 = Black-Tie Formal).
- season: Array of applicable seasons, subset of ["Spring", "Summer", "Autumn", "Winter", "All Season"].
- suggestedPrice: Estimated luxury retail value in USD (e.g. 250, 480).
- confidence: True overall assessment confidence between 0.60 and 0.98.
- fieldConfidence: Object with { name, category, color, fabric, formality }, each between 0.50 and 0.99 reflecting certainty based on visual clarity.
- uncertainFields: Array of field names (e.g. ["fabric", "color"]) if visual evidence is partially ambiguous or obscured.
- summary: A 1-2 sentence sartorial description of the piece, its weave texture, and pairing suitability.
`.trim();

    for (let i = 0; i < keys.length; i++) {
      const activeKey = keys[i];
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 25000);

        const res = await fetch(url, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': activeKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    inlineData: {
                      mimeType: mimeType || 'image/jpeg',
                      data: base64Data,
                    },
                  },
                  { text: prompt },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.1,
              thinkingConfig: { thinkingBudget: 0 },
            },
          }),
        }).finally(() => clearTimeout(timeout));

        if (!res.ok) {
          if (res.status === 429 || res.status === 401 || res.status === 403) {
            console.warn(`[VisionRecognition] Key #${i + 1} returned ${res.status}. Trying next key...`);
            continue;
          }
          throw new Error(`Gemini Vision HTTP ${res.status}`);
        }

        const data: any = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) continue;

        const parsed = JSON.parse(text);
        const priceNum =
          typeof parsed.suggestedPrice === 'number'
            ? parsed.suggestedPrice
            : parseFloat(String(parsed.suggestedPrice || '').replace(/[^0-9.]/g, '')) || 180;

        // Auto-populate uncertainFields if any fieldConfidence < 0.75
        const uncertainFields: string[] = Array.isArray(parsed.uncertainFields) ? [...parsed.uncertainFields] : [];
        const fc = parsed.fieldConfidence || {};
        ['name', 'category', 'color', 'fabric', 'formality'].forEach((f) => {
          if (typeof fc[f] === 'number' && fc[f] < 0.75 && !uncertainFields.includes(f)) {
            uncertainFields.push(f);
          }
        });

        const validated = GarmentVisionOutputSchema.parse({
          ...parsed,
          suggestedPrice: priceNum,
          uncertainFields,
        });

        return validated;
      } catch (err: any) {
        console.warn(`[VisionRecognition] Error on key #${i + 1}: ${err.message}`);
      }
    }

    return null;
  }

  /**
   * Transparent rules-based extraction when vision AI is unconfigured or image is not parsed
   * Explicitly marks uncertain fields so the user verifies them rather than guessing silently.
   */
  private static fallbackRulesExtraction(rawHint?: string): DetectedGarmentAttributes {
    const hint = (rawHint || '').toLowerCase();

    let category: 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories' | 'onePiece' = 'tops';
    let subType = 'Curated Garment';
    let name = 'Unclassified Garment';
    let color = 'Neutral';
    let fabric = 'Cotton Blend';
    let formality = 3;
    let confidence = 0.70;

    if (hint.includes('shoe') || hint.includes('boot') || hint.includes('sneaker') || hint.includes('heel') || hint.includes('slide')) {
      category = 'footwear';
      if (hint.includes('sneaker')) {
        subType = 'Clean Sneaker';
        formality = 2;
        confidence = 0.92;
      } else if (hint.includes('boot')) {
        subType = 'Boots';
        formality = 3;
      } else if (hint.includes('heel')) {
        subType = 'Heels';
        formality = 4;
      } else if (hint.includes('slide')) {
        subType = 'Slides';
        formality = 1;
      } else {
        subType = 'Shoes';
      }
      name = `Curated ${subType}`;
      fabric = 'Leather / Knit';
    } else if (hint.includes('pant') || hint.includes('jean') || hint.includes('trouser') || hint.includes('cargo') || hint.includes('pleat')) {
      category = 'bottoms';
      if (hint.includes('pleat')) {
        subType = 'Pleated Trousers';
        fabric = 'Merino Wool';
        formality = 4;
      } else if (hint.includes('jean')) {
        subType = 'Denim Jeans';
        fabric = 'Cotton Denim';
        formality = 2;
      } else if (hint.includes('cargo')) {
        subType = 'Cargo Pants';
        fabric = 'Cotton Twill';
        formality = 1;
      } else {
        subType = 'Trousers';
        fabric = 'Cotton Twill';
      }
      name = `Tailored ${subType}`;
    } else if (hint.includes('coat') || hint.includes('blazer') || hint.includes('jacket')) {
      category = 'outerwear';
      subType = hint.includes('blazer') ? 'Tailored Blazer' : 'Overcoat';
      name = `Bespoke ${subType}`;
      fabric = 'Wool Blend';
      formality = 4;
    } else if (hint.includes('saree') || hint.includes('dress') || hint.includes('gown')) {
      category = 'onePiece';
      subType = hint.includes('saree') ? 'Silk Saree' : 'Celebration Dress';
      name = `Atelier ${subType}`;
      fabric = 'Silk Georgette';
      formality = 5;
    }

    if (hint.includes('cashmere')) {
      fabric = hint.includes('silk') ? 'Silk-Cashmere' : 'Cashmere';
      category = 'tops';
    } else if (hint.includes('linen')) {
      fabric = 'Washed Linen';
    } else if (hint.includes('silk') && category !== 'onePiece') {
      fabric = 'Silk Crepe';
    } else if (hint.includes('wool') && !fabric.includes('Wool')) {
      fabric = 'Fine Wool';
    }

    if (hint.includes('cream')) {
      color = 'Cream';
    } else if (hint.includes('charcoal')) {
      color = 'Charcoal';
    } else if (hint.includes('white')) {
      color = 'White';
    } else if (hint.includes('black')) {
      color = 'Black';
    } else if (hint.includes('blue') || hint.includes('indigo')) {
      color = 'Indigo Blue';
    }

    return {
      name,
      category,
      subType,
      color,
      fabric,
      fit: 'Regular',
      formality,
      season: ['All Season'],
      suggestedPrice: 150,
      confidence,
      fieldConfidence: {
        name: 0.70,
        category: 0.85,
        color: color !== 'Neutral' ? 0.85 : 0.50,
        fabric: fabric !== 'Cotton Blend' ? 0.80 : 0.50,
        formality: 0.75,
      },
      uncertainFields: color === 'Neutral' || fabric === 'Cotton Blend' ? ['color', 'fabric'] : [],
      summary: 'Automated rules template. Please confirm color, fabric, and formality before saving.',
      source: 'rules',
    };
  }
}
