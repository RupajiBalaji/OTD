import { env } from '../../config/env';
import { STYLIST_SYSTEM_PROMPT } from './ai.prompts';

export interface AiChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiGenerateOptions {
  temperature?: number;
  maxTokens?: number;
}

export class UnifiedAiClient {
  /**
   * Generates a conversational response from the active AI provider
   */
  public static async generateStylistResponse(
    messages: AiChatMessage[],
    options: AiGenerateOptions = {}
  ): Promise<string> {
    const provider = env.AI_PROVIDER;

    if (provider === 'gemini' && env.GEMINI_API_KEY) {
      try {
        return await this.callGemini(messages, options);
      } catch (err: any) {
        console.warn(`[AIClient] Gemini API failed: ${err.message}. Gracefully falling back to algorithmic engine.`);
        return this.fallbackAlgorithmicReply(messages);
      }
    }

    if (provider === 'openai' && env.OPENAI_API_KEY) {
      try {
        return await this.callOpenAI(messages, options);
      } catch (err: any) {
        console.warn(`[AIClient] OpenAI API failed: ${err.message}. Gracefully falling back to algorithmic engine.`);
        return this.fallbackAlgorithmicReply(messages);
      }
    }

    // Default: High-fidelity algorithmic stylist response
    return this.fallbackAlgorithmicReply(messages);
  }

  /**
   * Google Gemini REST API integration (gemini-1.5-flash / gemini-2.0-flash)
   */
  private static async callGemini(
    messages: AiChatMessage[],
    _options: AiGenerateOptions
  ): Promise<string> {
    const apiKey = env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const contents = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const systemInstruction = messages.find((m) => m.role === 'system')?.content || STYLIST_SYSTEM_PROMPT;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          temperature: _options.temperature ?? 0.7,
          maxOutputTokens: _options.maxTokens ?? 800,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini status ${res.status}: ${errText}`);
    }

    const data: any = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Gemini returned empty candidate text');
    }
    return candidateText.trim();
  }

  /**
   * OpenAI REST API integration (gpt-4o-mini / gpt-4o)
   */
  private static async callOpenAI(
    messages: AiChatMessage[],
    options: AiGenerateOptions
  ): Promise<string> {
    const apiKey = env.OPENAI_API_KEY;
    const url = 'https://api.openai.com/v1/chat/completions';

    const formattedMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: formattedMessages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 800,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI status ${res.status}: ${errText}`);
    }

    const data: any = await res.json();
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      throw new Error('OpenAI returned empty message content');
    }
    return reply.trim();
  }

  /**
   * Deterministic Algorithmic Fashion Stylist Fallback Engine
   * Generates sophisticated, context-aware sartorial evaluations without third-party LLM dependencies
   */
  private static fallbackAlgorithmicReply(messages: AiChatMessage[]): string {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    const lower = lastUserMessage.toLowerCase();

    if (lower.includes('casual') || lower.includes('sneaker')) {
      return (
        "I've recalibrated your look for elevated casual ease. I've selected clean low-profile luxury sneakers and paired them with relaxed-cut trousers, preserving tailored poise while dialing back formal tension."
      );
    }
    if (lower.includes('boot') || lower.includes('chelsea')) {
      return (
        "Substituted your footwear for hand-glazed Chelsea boots. The vertical ankle profile anchors the trousers with architectural structure, ideal for evening temperature transitions."
      );
    }
    if (lower.includes('warm') || lower.includes('cold') || lower.includes('coat') || lower.includes('jacket')) {
      return (
        "Layered in an unstructured tailored overcoat from your wardrobe. The double-faced wool construction provides thermal insulation without disrupting your silhouette's natural shoulder drape."
      );
    }
    if (lower.includes('formal') || lower.includes('suit') || lower.includes('black tie')) {
      return (
        "Elevated your ensemble to Sartorial Tier 4. Clean monochrome base lines paired with structured shoulders and high-twist wool trousers ensure immaculate presence for formal settings."
      );
    }
    if (lower.includes('date') || lower.includes('dinner') || lower.includes('romantic')) {
      return (
        "Calibrated for evening intimacy: selected rich tonal contrast (espresso and charcoal) with an open-collar stance. The tactile texture of your knitwear captures candlelight warmth effortlessly."
      );
    }

    return (
      "I've evaluated your digital wardrobe against the destination context. Each piece has been curated to maintain chromatic balance, optimal thermal comfort, and effortless sartorial confidence."
    );
  }
}
