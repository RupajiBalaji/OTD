import { env, getGeminiApiKeys } from '../../config/env';
import { STYLIST_SYSTEM_PROMPT } from './ai.prompts';
import {
  StylistStructuredReplySchema,
  StylistStructuredReply,
  OutfitRankingOutputSchema,
  OutfitRankingOutput,
} from './ai.schemas';

export interface AiChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiGenerateOptions {
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  responseSchema?: any;
  enableInTest?: boolean;
}

export interface AiResponseWithSource<T> {
  data: T;
  source: 'gemini' | 'rules';
  modelUsed?: string;
}

// In-memory daily usage cap tracker per user
const userDailyUsage = new Map<string, { count: number; date: string }>();
const MAX_DAILY_AI_REQUESTS_PER_USER = 100;

export class UnifiedAiClient {
  private static activeKeyIndex = 0;

  /**
   * Checks and increments per-user daily rate limit
   */
  public static checkUserDailyCap(userId: string): { allowed: boolean; remaining: number } {
    const today = new Date().toISOString().slice(0, 10);
    const userStats = userDailyUsage.get(userId);

    if (!userStats || userStats.date !== today) {
      userDailyUsage.set(userId, { count: 1, date: today });
      return { allowed: true, remaining: MAX_DAILY_AI_REQUESTS_PER_USER - 1 };
    }

    if (userStats.count >= MAX_DAILY_AI_REQUESTS_PER_USER) {
      return { allowed: false, remaining: 0 };
    }

    userStats.count += 1;
    return { allowed: true, remaining: MAX_DAILY_AI_REQUESTS_PER_USER - userStats.count };
  }

  /**
   * Generates a conversational response from the active AI provider with structured JSON validation
   */
  public static async generateStylistResponse(
    messages: AiChatMessage[],
    options: AiGenerateOptions = {}
  ): Promise<AiResponseWithSource<StylistStructuredReply>> {
    if (env.NODE_ENV === 'test' && !options.enableInTest) {
      return {
        data: this.fallbackAlgorithmicReply(messages),
        source: 'rules',
        modelUsed: 'deterministic-rules-engine',
      };
    }

    const provider = env.AI_PROVIDER;
    const keys = getGeminiApiKeys();

    if ((provider === 'auto' || provider === 'gemini') && keys.length > 0) {
      try {
        const geminiResult = await this.callGeminiStructured<StylistStructuredReply>(
          messages,
          StylistStructuredReplySchema,
          options
        );
        return {
          data: geminiResult,
          source: 'gemini',
          modelUsed: env.GEMINI_MODEL,
        };
      } catch (err: any) {
        console.warn(`[AIClient] Gemini text failure (${err.message}). Live styling unavailable, switching to rules engine.`);
        return {
          data: this.fallbackAlgorithmicReply(messages),
          source: 'rules',
          modelUsed: 'deterministic-rules-engine',
        };
      }
    }

    return {
      data: this.fallbackAlgorithmicReply(messages),
      source: 'rules',
      modelUsed: 'deterministic-rules-engine',
    };
  }

  /**
   * Ranks outfit candidates with Gemini, returning structured rationale
   */
  public static async rankOutfitCandidates(
    prompt: string,
    options: AiGenerateOptions = {}
  ): Promise<AiResponseWithSource<OutfitRankingOutput>> {
    const keys = getGeminiApiKeys();
    if ((env.AI_PROVIDER === 'auto' || env.AI_PROVIDER === 'gemini') && keys.length > 0) {
      try {
        const result = await this.callGeminiStructured<OutfitRankingOutput>(
          [
            { role: 'system', content: 'You are the OTD Haute Couture Director. Rank candidate looks strictly referencing provided candidate IDs.' },
            { role: 'user', content: prompt },
          ],
          OutfitRankingOutputSchema,
          options
        );
        return {
          data: result,
          source: 'gemini',
          modelUsed: env.GEMINI_MODEL,
        };
      } catch (err: any) {
        console.warn(`[AIClient] Gemini outfit ranking failure (${err.message}). Falling back to rules.`);
      }
    }

    // Rules-based ranking fallback
    return {
      data: {
        rankedCandidateIndex: 0,
        selectedCandidateId: 'candidate_0',
        stylistRationale: {
          colorTheory: 'Classic tonal balance utilizing foundational neutrals and balanced value contrast.',
          silhouette: 'Proportional balance between structured tailoring and fluid drape.',
          fabricPhysics: 'Breathable natural fibers optimized for thermal comfort.',
          venueAlignment: 'Precision-aligned with the formality tier and venue environment.',
          weatherComfort: 'Calibrated for ambient climate and temperature ease.',
          overallCritique: 'An immaculate curation balancing comfort, poise, and wardrobe rotation.',
        },
        computedHarmonyDelta: 0,
      },
      source: 'rules',
      modelUsed: 'deterministic-rules-engine',
    };
  }

  /**
   * Internal structured Gemini call with x-goog-api-key header and failover only on 429/401/403
   */
  private static async callGeminiStructured<T>(
    messages: AiChatMessage[],
    schema: any,
    options: AiGenerateOptions
  ): Promise<T> {
    const keys = getGeminiApiKeys();
    if (keys.length === 0) {
      throw new Error('No Gemini API keys configured');
    }

    const model = env.GEMINI_MODEL || 'gemini-3.5-flash';
    const timeoutMs = options.timeoutMs ?? 30000;
    const systemInstruction = messages.find((m) => m.role === 'system')?.content || STYLIST_SYSTEM_PROMPT;

    const contents = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    let lastError: Error | null = null;

    // Failover loop across keys
    for (let attempt = 0; attempt < keys.length; attempt++) {
      const currentIdx = (this.activeKeyIndex + attempt) % keys.length;
      const keyLabel = `key #${currentIdx + 1}`;
      const activeKey = keys[currentIdx];

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        const res = await fetch(url, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': activeKey,
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents,
            generationConfig: {
              temperature: options.temperature ?? 0.3,
              maxOutputTokens: options.maxTokens ?? 2048,
              responseMimeType: 'application/json',
              thinkingConfig: { thinkingBudget: 0 },
            },
          }),
        }).finally(() => clearTimeout(timer));

        if (!res.ok) {
          const status = res.status;
          const errText = await res.text();

          // Failover on 429 (rate/quota), 503 (high demand spike), or 401/403 (auth)
          if (status === 429 || status === 401 || status === 403 || status === 503) {
            console.warn(`[AIClient] Gemini ${keyLabel} returned HTTP ${status}. Failing over to next key...`);
            lastError = new Error(`Gemini ${keyLabel} error ${status}: ${errText.slice(0, 150)}`);
            continue;
          }

          throw new Error(`Gemini ${keyLabel} non-retryable error ${status}: ${errText.slice(0, 150)}`);
        }

        const json: any = await res.json();
        const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
          throw new Error('Gemini returned empty candidate text');
        }

        const parsed = JSON.parse(rawText);
        if (parsed && !parsed.reply && (parsed.message || parsed.response || parsed.advice)) {
          parsed.reply = parsed.message || parsed.response || parsed.advice;
        }
        const validated = schema.parse(parsed);

        // Keep this key index as active
        this.activeKeyIndex = currentIdx;
        return validated as T;
      } catch (err: any) {
        lastError = err;
        if (err.name === 'AbortError') {
          console.warn(`[AIClient] Request timed out after ${timeoutMs}ms on ${keyLabel}`);
        }
      }
    }

    throw lastError || new Error('All Gemini API attempts failed');
  }

  /**
   * Live health check for GET /api/v1/ai/status
   */
  public static async checkAiHealth(): Promise<{
    textModel: { model: string; available: boolean; latencyMs?: number; error?: string };
    imageModel: { model: string; available: boolean; reason?: string };
    activeProvider: string;
    keysConfigured: number;
  }> {
    const keys = getGeminiApiKeys();
    const textModel = env.GEMINI_MODEL || 'gemini-3.5-flash';
    const imageModel = env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';

    let textAvailable = false;
    let latencyMs: number | undefined;
    let textError: string | undefined;

    if (keys.length > 0) {
      const start = Date.now();
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${textModel}:generateContent`, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': keys[this.activeKeyIndex % keys.length],
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Ping' }] }],
            generationConfig: { maxOutputTokens: 2, thinkingConfig: { thinkingBudget: 0 } },
          }),
        }).finally(() => clearTimeout(timeout));

        latencyMs = Date.now() - start;
        textAvailable = res.ok;
        if (!res.ok) {
          textError = `HTTP ${res.status}`;
        }
      } catch (e: any) {
        textError = e.message;
      }
    }

    // Check image model availability
    let imageAvailable = false;
    let imageReason: string | undefined;
    if (keys.length > 0) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${imageModel}:generateContent`, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': keys[this.activeKeyIndex % keys.length],
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'status-check' }] }],
          }),
        }).finally(() => clearTimeout(timeout));

        if (res.ok) {
          imageAvailable = true;
        } else if (res.status === 429) {
          imageReason = 'Quota limit reached (free tier requires billing upgrade for image generation; using crisp Layered Avatar fallback)';
        } else {
          imageReason = `HTTP ${res.status}: Image generation unavailable`;
        }
      } catch (e: any) {
        imageReason = e.message;
      }
    }

    return {
      textModel: {
        model: textModel,
        available: textAvailable,
        latencyMs,
        error: textError,
      },
      imageModel: {
        model: imageModel,
        available: imageAvailable,
        reason: imageReason,
      },
      activeProvider: textAvailable ? 'gemini' : 'rules',
      keysConfigured: keys.length,
    };
  }

  /**
   * Deterministic Algorithmic Fashion Stylist Fallback Engine
   */
  private static fallbackAlgorithmicReply(messages: AiChatMessage[]): StylistStructuredReply {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    const lower = lastUserMessage.toLowerCase();

    if (lower.includes('casual') || lower.includes('sneaker')) {
      return {
        reply: "I've recalibrated your look for elevated casual ease. I've selected clean low-profile luxury sneakers and paired them with relaxed-cut trousers, preserving tailored poise while dialing back formal tension.",
        intent: 'modify_outfit',
        slotChanges: [{ slot: 'footwear', action: 'replace', rationale: 'Swapped for low-profile sneakers for relaxed poise' }],
      };
    }
    if (lower.includes('boot') || lower.includes('chelsea')) {
      return {
        reply: "Substituted your footwear for hand-glazed Chelsea boots. The vertical ankle profile anchors the trousers with architectural structure, ideal for evening temperature transitions.",
        intent: 'modify_outfit',
        slotChanges: [{ slot: 'footwear', action: 'replace', rationale: 'Hand-glazed Chelsea boots for architectural ankle structure' }],
      };
    }
    if (lower.includes('warm') || lower.includes('cold') || lower.includes('coat') || lower.includes('jacket')) {
      return {
        reply: "Layered in an unstructured tailored overcoat from your wardrobe. The double-faced wool construction provides thermal insulation without disrupting your silhouette's natural shoulder drape.",
        intent: 'modify_outfit',
        slotChanges: [{ slot: 'outerwear', action: 'add', rationale: 'Double-faced wool overcoat for thermal comfort' }],
      };
    }
    if (lower.includes('formal') || lower.includes('suit') || lower.includes('black tie')) {
      return {
        reply: "Elevated your ensemble to Sartorial Tier 4. Clean monochrome base lines paired with structured shoulders and high-twist wool trousers ensure immaculate presence for formal settings.",
        intent: 'modify_outfit',
        slotChanges: [{ slot: 'tops', action: 'replace', rationale: 'Structured tailoring for formal presence' }],
      };
    }

    return {
      reply: "I've evaluated your digital wardrobe against the destination context. Each piece has been curated to maintain chromatic balance, optimal thermal comfort, and effortless sartorial confidence.",
      intent: 'advice',
      slotChanges: [],
    };
  }
}
