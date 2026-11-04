import { WardrobeItem, IWardrobeItem } from '../../models/WardrobeItem';
import { ApiError } from '../../utils/ApiError';

export class WardrobeService {
  public static async getUserWardrobe(userId: string, category?: string) {
    const filter: Record<string, unknown> = { userId };
    if (category) {
      filter.category = category;
    }
    return WardrobeItem.find(filter).sort({ createdAt: -1 });
  }

  public static async addItem(userId: string, data: Partial<IWardrobeItem>) {
    const {
      name,
      category,
      subType,
      brand,
      color,
      fabric,
      fit,
      formality,
      icon,
      season,
      imageUrl,
      purchasePrice,
      tags,
    } = data;

    if (!name || !category || !imageUrl) {
      throw new ApiError(400, 'Name, category, and imageUrl are required');
    }

    const defaultIcon =
      icon ||
      (category === 'footwear'
        ? '👞'
        : category === 'bottoms'
        ? '👖'
        : category === 'outerwear'
        ? '🧥'
        : category === 'accessories'
        ? '⌚'
        : '👕');

    return WardrobeItem.create({
      userId,
      name: name.trim(),
      category,
      subType: subType || '',
      brand: brand || 'Curated',
      color: color || '',
      fabric: fabric || '',
      fit: fit || 'Regular',
      formality: formality ?? 3,
      icon: defaultIcon,
      season: season || 'All Season',
      imageUrl,
      purchasePrice: purchasePrice || 0,
      tags: tags || [],
    });
  }

  public static async getItemById(userId: string, itemId: string) {
    const item = await WardrobeItem.findOne({ _id: itemId, userId });
    if (!item) {
      throw new ApiError(404, 'Wardrobe item not found');
    }
    return item;
  }

  public static async updateItem(userId: string, itemId: string, data: Partial<IWardrobeItem>) {
    const allowedFields = [
      'name',
      'category',
      'subType',
      'brand',
      'color',
      'fabric',
      'fit',
      'formality',
      'icon',
      'season',
      'imageUrl',
      'purchasePrice',
      'tags',
    ];

    const safeUpdate: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if ((data as any)[field] !== undefined) {
        safeUpdate[field] = (data as any)[field];
      }
    }

    const item = await WardrobeItem.findOneAndUpdate(
      { _id: itemId, userId },
      { $set: safeUpdate },
      { new: true }
    );
    if (!item) {
      throw new ApiError(404, 'Wardrobe item not found');
    }
    return item;
  }

  public static async deleteItem(userId: string, itemId: string) {
    const item = await WardrobeItem.findOneAndDelete({ _id: itemId, userId });
    if (!item) {
      throw new ApiError(404, 'Wardrobe item not found');
    }
    return item;
  }

  public static async incrementWearCount(userId: string, itemId: string) {
    const item = await WardrobeItem.findOneAndUpdate(
      { _id: itemId, userId },
      { $inc: { timesWorn: 1 }, $set: { lastWorn: new Date() } },
      { new: true }
    );
    if (!item) {
      throw new ApiError(404, 'Wardrobe item not found');
    }
    return item;
  }
}
