import { WardrobeItem, IWardrobeItem } from '../../models/WardrobeItem';
import { ApiError } from '../../utils/ApiError';

export class WardrobeService {
  public static async getUserWardrobe(userId: string, category?: string) {
    const filter: any = { userId };
    if (category) {
      filter.category = category;
    }
    return WardrobeItem.find(filter).sort({ createdAt: -1 });
  }

  public static async addItem(userId: string, data: any) {
    return WardrobeItem.create({ ...data, userId });
  }

  public static async getItemById(userId: string, itemId: string) {
    const item = await WardrobeItem.findOne({ _id: itemId, userId });
    if (!item) {
      throw new ApiError(404, 'Wardrobe item not found');
    }
    return item;
  }

  public static async updateItem(userId: string, itemId: string, data: any) {
    const item = await WardrobeItem.findOneAndUpdate({ _id: itemId, userId }, { $set: data }, { new: true });
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
      { $inc: { timesWorn: 1 } },
      { new: true }
    );
    if (!item) {
      throw new ApiError(404, 'Wardrobe item not found');
    }
    return item;
  }
}
