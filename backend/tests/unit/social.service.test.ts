import { describe, it, expect } from 'vitest';
import { createShareSchema, createCommentSchema } from '../../src/modules/social/social.validator';

describe('Social Lookbook Validator Unit Tests', () => {
  it('should validate complete outfit share payload', () => {
    const valid = {
      outfitId: '64f1a2b3c4d5e6f7a8b9c0d1',
      caption: 'Evening architectural silhouette at Olive Bistro',
      venue: 'Olive Bistro',
      occasion: 'Weekend Social',
      tags: ['Quiet Luxury', 'Monochrome'],
    };

    const parsed = createShareSchema.parse(valid);
    expect(parsed.caption).toBe(valid.caption);
    expect(parsed.tags).toContain('Quiet Luxury');
  });

  it('should validate comment text', () => {
    const valid = { text: 'The drape of that overcoat against the trousers is immaculate.' };
    const parsed = createCommentSchema.parse(valid);
    expect(parsed.text).toBe(valid.text);

    expect(() => createCommentSchema.parse({ text: '' })).toThrow();
  });
});
