import { requestApi } from './api.client';

export interface ApiUserProfile {
  _id?: string;
  name: string;
  height: string;
  bodyShape: string;
  skinTone?: string;
  stylePersonas: string[];
  preferredFit: string;
  palettePreferences: string[];
  avoidedColors: string[];
  dislikedElements: string[];
  goals: string[];
}

export const profileApiService = {
  async getProfile(token?: string): Promise<ApiUserProfile | null> {
    const result = await requestApi<ApiUserProfile>('/profile', { token });
    return result.data;
  },

  async updateProfile(profile: Partial<ApiUserProfile>, token?: string): Promise<ApiUserProfile | null> {
    const result = await requestApi<ApiUserProfile>('/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
      token,
    });
    return result.data;
  },
};
