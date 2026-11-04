import { requestApi } from './api.client';

export interface ApiVenueIntelligence {
  id: string;
  name: string;
  address: string;
  category: string;
  formality: 1 | 2 | 3 | 4 | 5;
  recommendedVibe: string;
  dressCodeAdvice: string;
  tags: string[];
}

export const venueApiService = {
  async searchVenues(query: string = ''): Promise<ApiVenueIntelligence[]> {
    const q = encodeURIComponent(query.trim());
    const result = await requestApi<ApiVenueIntelligence[]>(`/venues/search?q=${q}`);
    return Array.isArray(result.data) ? result.data : [];
  },
};
