import { requestApi } from './api.client';

export interface ApiOutfitRationale {
  venueAlignment?: string;
  weatherComfort?: string;
  paletteHarmony?: string;
  wardrobeUtilization?: string;
}

export interface ApiOutfit {
  _id: string;
  title: string;
  description?: string;
  items: Array<{
    _id: string;
    name: string;
    category: string;
    color: string;
    fabric?: string;
    imageUrl?: string;
    timesWorn?: number;
    purchasePrice?: number;
    costPerWear?: number;
    fit?: string;
    brand?: string;
  }>;
  occasion: string;
  venue?: string;
  vibe?: string;
  weather?: string;
  rationale?: ApiOutfitRationale;
  harmonyScore?: number;
  aiMatchScore?: number;
  isWornToday?: boolean;
  isBookmarked?: boolean;
  history?: string[];
  createdAt?: string;
}

export interface GenerateOutfitPayload {
  occasion: string;
  venue?: string;
  vibe: string;
  weather?: string;
  temperature?: number;
  avoidedColors?: string[];
  dislikedElements?: string[];
  preferredFit?: string;
}

export const outfitsApiService = {
  async getDailyRecommendations(token?: string): Promise<ApiOutfit[]> {
    const result = await requestApi<ApiOutfit[]>('/outfits/daily', { token });
    return Array.isArray(result.data) ? result.data : [];
  },

  async generateOutfit(payload: GenerateOutfitPayload, token?: string): Promise<ApiOutfit | null> {
    const result = await requestApi<ApiOutfit>('/outfits/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      token,
    });
    return result.data;
  },

  async modifyOutfit(outfitId: string, instruction: string, token?: string): Promise<ApiOutfit | null> {
    const result = await requestApi<ApiOutfit>(`/outfits/${outfitId}/modify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instruction }),
      token,
    });
    return result.data;
  },

  async logAsWorn(outfitId: string, token?: string): Promise<ApiOutfit | null> {
    const result = await requestApi<ApiOutfit>(`/outfits/${outfitId}/wear`, {
      method: 'POST',
      token,
    });
    return result.data;
  },

  async toggleBookmark(outfitId: string, token?: string): Promise<ApiOutfit | null> {
    const result = await requestApi<ApiOutfit>(`/outfits/${outfitId}/bookmark`, {
      method: 'POST',
      token,
    });
    return result.data;
  },

  async getSavedOutfits(token?: string): Promise<ApiOutfit[]> {
    const result = await requestApi<ApiOutfit[]>('/outfits/saved', { token });
    return Array.isArray(result.data) ? result.data : [];
  },
};
