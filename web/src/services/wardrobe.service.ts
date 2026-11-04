import { requestApi, API_BASE_URL } from './api.client';

export interface ApiWardrobeItem {
  id: string;
  name: string;
  category: 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories';
  subType?: string;
  brand?: string;
  color?: string;
  fabric?: string;
  fit?: 'Slim' | 'Regular' | 'Relaxed / Tailored';
  formality?: 1 | 2 | 3 | 4 | 5;
  icon?: string;
  season?: string;
  imageUrl: string;
  timesWorn: number;
  purchasePrice: number;
  costPerWear?: number;
  tags?: string[];
}

export const wardrobeApiService = {
  async fetchItems(token?: string): Promise<ApiWardrobeItem[]> {
    const result = await requestApi<any>('/wardrobe', { token });
    if (!result.data) return [];
    return Array.isArray(result.data) ? result.data : (result.data?.items || []);
  },

  async uploadImage(file: File, token?: string): Promise<{ url: string; fileId: string } | null> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const headers: Record<string, string> = { Accept: 'application/json' };
      const authToken =
        token ||
        (typeof localStorage !== 'undefined' ? localStorage.getItem('otd_access_token') : null);
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

      const res = await fetch(`${API_BASE_URL}/wardrobe/upload-image`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!res.ok) {
        console.warn('[Upload Image Error]', res.status, res.statusText);
        return null;
      }
      const json = await res.json();
      const relativeUrl = json.data?.url;
      const origin = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
      const fullUrl = relativeUrl?.startsWith('http') ? relativeUrl : `${origin}${relativeUrl}`;

      return {
        url: fullUrl,
        fileId: json.data?.fileId,
      };
    } catch (err) {
      console.warn('[Upload Image Exception]', err);
      return null;
    }
  },

  async createItem(item: Partial<ApiWardrobeItem>, token?: string): Promise<ApiWardrobeItem | null> {
    const result = await requestApi<ApiWardrobeItem>('/wardrobe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
      token,
    });
    return result.data;
  },

  async deleteItem(id: string, token?: string): Promise<boolean> {
    const result = await requestApi<null>(`/wardrobe/${id}`, {
      method: 'DELETE',
      token,
    });
    return result.status >= 200 && result.status < 300;
  },

  async analyzeImage(
    payload: { imageUrl?: string; fileName?: string; mimeType?: string },
    token?: string
  ): Promise<any | null> {
    const result = await requestApi<any>('/wardrobe/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      token,
    });
    return result.data;
  },
};
