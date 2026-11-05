import { requestApi } from './api.client';

export interface ApiVirtualTryOn {
  _id: string;
  jobId: string;
  outfitId?: string;
  itemIds: any[];
  status: 'queued' | 'compositing' | 'rendering' | 'completed' | 'fallback_to_layered' | 'failed';
  progress: number;
  renderResultUrl?: string;
  lightingPreset: string;
  silhouetteFidelity: number;
  fabricDrapeNotes?: string;
  personaType?: 'boy' | 'girl' | 'women' | 'man';
  modelFaceUrl?: string;
  customPhotoUrl?: string;
  skinTone?: string;
  bodyShape?: string;
  height?: string;
  fallbackToLayered?: boolean;
  fallbackReason?: string;
  isMinorProtected?: boolean;
  source: 'gemini' | 'rules';
  createdAt: string;
}

export interface ApiAvatar {
  _id: string;
  height: string;
  skinTone: string;
  hair: string;
  bodyProportions: {
    shoulderWidth: string;
    chest: string;
    waist: string;
    inseam: string;
  };
  pose: string;
  ambientLighting: string;
}

export const tryOnApiService = {
  async getAvatar(token?: string): Promise<ApiAvatar | null> {
    const result = await requestApi<ApiAvatar>('/virtual-try-on/avatar', { token });
    return result.data;
  },

  async updateAvatar(data: Partial<ApiAvatar>, token?: string): Promise<ApiAvatar | null> {
    const result = await requestApi<ApiAvatar>('/virtual-try-on/avatar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      token,
    });
    return result.data;
  },

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

  async getJobStatus(jobId: string, token?: string): Promise<ApiVirtualTryOn | null> {
    const result = await requestApi<ApiVirtualTryOn>(`/virtual-try-on/jobs/${jobId}`, { token });
    return result.data;
  },

  async fetchHistory(token?: string): Promise<ApiVirtualTryOn[]> {
    const result = await requestApi<ApiVirtualTryOn[]>('/virtual-try-on/history', { token });
    return Array.isArray(result.data) ? result.data : [];
  },
};
