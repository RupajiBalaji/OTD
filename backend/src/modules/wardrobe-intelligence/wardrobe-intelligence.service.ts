import mongoose from 'mongoose';
import { WardrobeItem } from '../../models/WardrobeItem';
import { WardrobeGap } from '../../models/WardrobeGap';

export class WardrobeIntelligenceService {
  public static async getClosetAnalytics(userId: string) {
    const items = await WardrobeItem.find({ userId });
    const totalItems = items.length;

    const totalClosetValue = items.reduce((acc, item) => acc + (item.purchasePrice || 0), 0);
    const totalWears = items.reduce((acc, item) => acc + (item.timesWorn || 0), 0);
    const averageCostPerWear = totalWears > 0 ? +(totalClosetValue / totalWears).toFixed(2) : totalClosetValue;

    // Active utilization: percentage of items worn at least once
    const activeItems = items.filter((item) => (item.timesWorn || 0) > 0).length;
    const activeUtilizationPercent = totalItems > 0 ? +((activeItems / totalItems) * 100).toFixed(1) : 0;

    // Fetch or generate wardrobe gaps
    let gaps = await WardrobeGap.find({ userId, isResolved: false });
    if (gaps.length === 0 && totalItems > 0) {
      // Analyze missing categories
      const categories = new Set(items.map((i) => i.category));
      const newGaps = [];

      if (!categories.has('outerwear')) {
        newGaps.push({
          userId: new mongoose.Types.ObjectId(userId),
          title: 'Camel Double-Breasted Trench Coat',
          reason: 'Essential weather barrier missing for 12°C - 18°C transitional autumn/spring days.',
          urgency: 'High' as const,
          recommendedCategory: 'outerwear',
        });
      }

      if (!categories.has('footwear')) {
        newGaps.push({
          userId: new mongoose.Types.ObjectId(userId),
          title: 'Minimalist Clean White Leather Sneaker',
          reason: 'Foundation piece required to bridge tailored trousers with casual ensembles.',
          urgency: 'Medium' as const,
          recommendedCategory: 'footwear',
        });
      }

      if (newGaps.length > 0) {
        gaps = await WardrobeGap.insertMany(newGaps);
      }
    }

    return {
      totalItems,
      totalClosetValue,
      averageCostPerWear,
      activeUtilizationPercent,
      detectedGaps: gaps,
    };
  }
}
