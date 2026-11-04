import { requestApi } from './api.client';

export interface WardrobeGapItem {
  id: string;
  category: string;
  name: string;
  brand: string;
  reason: string;
  urgency: 'High' | 'Medium' | 'Low';
  estimatedPrice: number;
  imageUrl: string;
  affiliateUrl: string;
}

export const shoppingApiService = {
  async fetchWardrobeGaps(token?: string): Promise<WardrobeGapItem[]> {
    const result = await requestApi<WardrobeGapItem[]>('/shopping/gaps', { token });
    return Array.isArray(result.data) ? result.data : [];
  },
};
