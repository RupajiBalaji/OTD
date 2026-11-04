import { describe, it, expect } from 'vitest';
import { generateOutfitSchema, modifyOutfitSchema } from '../../src/modules/outfits/outfits.validator';

describe('Outfit Selection Engine Schema & Validation Tests', () => {
  it('should validate complete outfit generation criteria', () => {
    const validCriteria = {
      occasion: 'Black Tie Gala',
      venue: 'Metropolitan Opera House, NYC',
      vibe: 'Formal Architectural',
      weather: '18°C Crisp Autumn',
      temperature: 18,
      avoidedColors: ['Neon Green', 'Hot Pink'],
      dislikedElements: ['Skinny Fits', 'Polyester'],
      preferredFit: 'Tailored Structured',
    };

    const parsed = generateOutfitSchema.parse(validCriteria);
    expect(parsed.occasion).toBe('Black Tie Gala');
    expect(parsed.venue).toBe('Metropolitan Opera House, NYC');
    expect(parsed.temperature).toBe(18);
    expect(parsed.avoidedColors).toContain('Neon Green');
    expect(parsed.dislikedElements).toContain('Skinny Fits');
  });

  it('should apply luxury default fallbacks when optional fields are omitted', () => {
    const minimalCriteria = {};
    const parsed = generateOutfitSchema.parse(minimalCriteria);

    expect(parsed.occasion).toBe('Casual Evening');
    expect(parsed.vibe).toBe('Clean Minimalist');
    expect(parsed.venue).toBeUndefined();
    expect(parsed.avoidedColors).toBeUndefined();
  });

  it('should validate conversational modifier instructions', () => {
    const validModification = {
      instruction: 'Swap the dress shoes for minimalist white sneakers and ease the trousers',
    };
    const parsed = modifyOutfitSchema.parse(validModification);
    expect(parsed.instruction).toBe(validModification.instruction);

    const emptyModification = { instruction: '' };
    expect(() => modifyOutfitSchema.parse(emptyModification)).toThrow();
  });
});
