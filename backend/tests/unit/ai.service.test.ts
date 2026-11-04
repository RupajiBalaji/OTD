import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnifiedAiClient } from '../../src/integrations/ai/ai.client';
import { buildStylistContextPrompt, STYLIST_SYSTEM_PROMPT } from '../../src/integrations/ai/ai.prompts';

describe('AI Stylist Prompts & Grounding Unit Tests', () => {
  it('should generate properly grounded context prompts with inventory and profile', () => {
    const prompt = buildStylistContextPrompt({
      profile: {
        name: 'Mustafa',
        bodyShape: 'Athletic / V-Taper',
        stylePersonas: ['Old Money', 'Minimalist'],
        preferredFit: 'Tailored',
        palettePreferences: ['Ivory', 'Charcoal'],
        avoidedColors: ['Neon Green'],
      },
      wardrobeSummary: [
        {
          id: 'item-1',
          name: 'Silk-Cashmere High Neck',
          category: 'tops',
          color: 'Ivory Cream',
          fabric: 'Silk-Cashmere',
          formality: 3,
        },
        {
          id: 'item-2',
          name: 'Forward-Pleat Wool Trousers',
          category: 'bottoms',
          color: 'Flint Charcoal',
          fabric: 'Super 130s Wool',
          formality: 4,
        },
      ],
      occasion: 'Date Night',
      venue: "L'Amore Rooftop",
      weather: '22°C Clear',
      userPrompt: 'Suggest an outfit for tonight',
    });

    expect(prompt).toContain('Mustafa');
    expect(prompt).toContain('Old Money, Minimalist');
    expect(prompt).toContain('Silk-Cashmere High Neck');
    expect(prompt).toContain('Forward-Pleat Wool Trousers');
    expect(prompt).toContain("L'Amore Rooftop");
    expect(STYLIST_SYSTEM_PROMPT).toContain('STRICT INVENTORY GROUNDING');
  });

  it('should return context-aware algorithmic responses when external LLM is not configured', async () => {
    const casualReply = await UnifiedAiClient.generateStylistResponse([
      { role: 'user', content: 'Can we make this more casual with sneakers?' },
    ]);
    expect(casualReply.toLowerCase()).toContain('casual');
    expect(casualReply.toLowerCase()).toContain('sneakers');

    const formalReply = await UnifiedAiClient.generateStylistResponse([
      { role: 'user', content: 'Elevate this for a formal black tie gala' },
    ]);
    expect(formalReply.toLowerCase()).toContain('sartorial');
    expect(formalReply.toLowerCase()).toContain('trousers');

    const dateReply = await UnifiedAiClient.generateStylistResponse([
      { role: 'user', content: 'What about a romantic dinner date look?' },
    ]);
    expect(dateReply.toLowerCase()).toContain('evening');
    expect(dateReply.toLowerCase()).toContain('contrast');
  });
});
