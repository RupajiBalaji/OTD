import { describe, it, expect } from 'vitest';
import { updateProfileSchema } from '../../src/modules/profile/profile.validator';

describe('Profile Validator & Schema Unit Tests', () => {
  it('should validate full user profile input', () => {
    const validProfile = {
      name: 'Julian Vane',
      height: `6'0" (183 cm)`,
      bodyShape: 'Athletic / V-Taper',
      skinTone: 'Warm Olive',
      stylePersonas: ['Old Money Heritage', 'Clean Minimalist'],
      preferredFit: 'Tailored / Regular',
      palettePreferences: ['Espresso & Earth', 'Ivory & Cream'],
      avoidedColors: ['Neon Green', 'Hot Pink', 'Loud Yellow'],
      dislikedElements: ['Skinny Fits', 'Polyester Blends'],
      goals: ['Daily Outfits', 'Using Existing Wardrobe'],
    };

    const parsed = updateProfileSchema.parse(validProfile);
    expect(parsed.name).toBe('Julian Vane');
    expect(parsed.skinTone).toBe('Warm Olive');
    expect(parsed.avoidedColors).toContain('Neon Green');
    expect(parsed.dislikedElements).toContain('Skinny Fits');
  });

  it('should accept partial profile updates', () => {
    const partial = {
      preferredFit: 'Relaxed / Oversized',
      avoidedColors: ['Hot Pink'],
    };

    const parsed = updateProfileSchema.parse(partial);
    expect(parsed.preferredFit).toBe('Relaxed / Oversized');
    expect(parsed.avoidedColors).toEqual(['Hot Pink']);
    expect(parsed.height).toBeUndefined();
  });
});
