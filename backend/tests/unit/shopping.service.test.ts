import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShoppingService } from '../../src/modules/shopping/shopping.service';
import { WardrobeItem } from '../../src/models/WardrobeItem';
import { WardrobeGap } from '../../src/models/WardrobeGap';

vi.mock('../../src/models/WardrobeItem');
vi.mock('../../src/models/WardrobeGap');

describe('ShoppingService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should detect gaps when wardrobe is missing outerwear, loafers, pleated trousers, and fine knits', async () => {
    vi.mocked(WardrobeItem.find).mockResolvedValue([
      { category: 'tops', fabric: 'cotton', name: 'Crewneck Tee' } as any,
      { category: 'bottoms', formality: 1, name: 'Denim Jeans' } as any,
      { category: 'footwear', name: 'Sneakers' } as any,
    ]);

    vi.mocked(WardrobeGap.findOne).mockResolvedValue(null);
    vi.mocked(WardrobeGap.create).mockResolvedValue({} as any);

    const gaps = await ShoppingService.analyzeGaps('user_test_123');
    expect(gaps.length).toBe(4);
    expect(gaps.map((g) => g.category)).toEqual(['outerwear', 'footwear', 'bottoms', 'tops']);
    expect(WardrobeGap.create).toHaveBeenCalledTimes(4);
  });

  it('should not suggest gaps when closet already contains requisite quiet luxury pieces', async () => {
    vi.mocked(WardrobeItem.find).mockResolvedValue([
      { category: 'outerwear', name: 'Linen Blazer' } as any,
      { category: 'footwear', name: 'Belgian Loafers', subType: 'loafer' } as any,
      { category: 'bottoms', formality: 4, name: 'Forward-Pleat Trousers' } as any,
      { category: 'tops', fabric: 'silk-cashmere', name: 'Fine Knit Turtleneck' } as any,
    ]);

    vi.mocked(WardrobeGap.findOne).mockResolvedValue(null);

    const gaps = await ShoppingService.analyzeGaps('user_test_123');
    expect(gaps.length).toBe(0);
    expect(WardrobeGap.create).not.toHaveBeenCalled();
  });
});
