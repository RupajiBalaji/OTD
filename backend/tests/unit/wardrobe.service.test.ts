import { describe, it, expect } from 'vitest';
import { createWardrobeItemSchema, updateWardrobeItemSchema } from '../../src/modules/wardrobe/wardrobe.validator';

describe('Wardrobe Validator & Schema Unit Tests', () => {
  it('should validate a valid wardrobe item payload', () => {
    const validData = {
      name: 'Sea Island Cotton Oxford Shirt',
      category: 'tops',
      color: 'French Blue',
      fabric: 'Sea Island Cotton',
      season: 'All Season',
      imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80',
      purchasePrice: 320,
      tags: ['Smart Casual', 'Office'],
    };

    const parsed = createWardrobeItemSchema.parse(validData);
    expect(parsed.name).toBe(validData.name);
    expect(parsed.category).toBe('tops');
    expect(parsed.purchasePrice).toBe(320);
  });

  it('should reject payload missing required imageUrl or invalid category', () => {
    const invalidData = {
      name: 'Vintage Trench Coat',
      category: 'invalid_category_name',
      imageUrl: 'not-a-valid-url',
    };

    expect(() => createWardrobeItemSchema.parse(invalidData)).toThrow();
  });

  it('should validate partial updates using updateWardrobeItemSchema', () => {
    const partialUpdate = {
      purchasePrice: 280,
      color: 'Espresso Brown',
    };

    const parsed = updateWardrobeItemSchema.parse(partialUpdate);
    expect(parsed.purchasePrice).toBe(280);
    expect(parsed.color).toBe('Espresso Brown');
    expect(parsed.name).toBeUndefined();
  });
});
