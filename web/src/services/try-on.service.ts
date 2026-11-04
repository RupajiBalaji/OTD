import { requestApi } from './api.client';

export interface ApiVirtualTryOn {
  _id: string;
  outfitId?: string;
  itemIds: any[];
  status: 'queued' | 'simulating_drape' | 'rendering_3d' | 'completed' | 'failed';
  renderResultUrl: string;
  lightingPreset: string;
  silhouetteFidelity: number;
  fabricDrapeNotes?: string;
  personaType?: 'boy' | 'girl' | 'women' | 'man';
  modelFaceUrl?: string;
  customPhotoUrl?: string;
  skinTone?: string;
  bodyShape?: string;
  height?: string;
  createdAt: string;
}

export const tryOnApiService = {
  async synthesizeTryOn(
    dto: {
      outfitId?: string;
      itemIds?: string[];
      lightingPreset?: string;
      pose?: string;
      personaType?: 'boy' | 'girl' | 'women' | 'man';
      customPhotoUrl?: string;
      skinTone?: string;
      bodyShape?: string;
      height?: string;
    },
    token?: string
  ): Promise<ApiVirtualTryOn | null> {
    const result = await requestApi<ApiVirtualTryOn>('/virtual-try-on/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
      token,
    });
    return result.data;
  },

  async fetchHistory(token?: string): Promise<ApiVirtualTryOn[]> {
    const result = await requestApi<ApiVirtualTryOn[]>('/virtual-try-on/history', { token });
    return Array.isArray(result.data) ? result.data : [];
  },
};
