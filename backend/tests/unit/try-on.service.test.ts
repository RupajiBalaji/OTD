import { describe, it, expect } from 'vitest';
import { generateTryOnSchema } from '../../src/modules/virtual-try-on/virtual-try-on.validator';

describe('Virtual Try-On Validator Unit Tests', () => {
  it('should validate virtual try-on payload with lighting preset and pose', () => {
    const valid = {
      outfitId: '64f1a2b3c4d5e6f7a8b9c0d1',
      lightingPreset: 'Candlelight Dinner' as const,
      pose: 'three_quarter' as const,
    };

    const parsed = generateTryOnSchema.parse(valid);
    expect(parsed.lightingPreset).toBe('Candlelight Dinner');
    expect(parsed.pose).toBe('three_quarter');
  });

  it('should accept itemIds array for custom piece try-on', () => {
    const valid = {
      itemIds: ['64f1a2b3c4d5e6f7a8b9c0d1', '64f1a2b3c4d5e6f7a8b9c0d2'],
      lightingPreset: 'Editorial Studio' as const,
    };

    const parsed = generateTryOnSchema.parse(valid);
    expect(parsed.itemIds?.length).toBe(2);
  });
});
