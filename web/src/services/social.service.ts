import { requestApi } from './api.client';

export interface CommunityOutfitPost {
  _id: string;
  userId: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };
  outfitId: any;
  caption: string;
  venue?: string;
  occasion?: string;
  likesCount: number;
  commentsCount: number;
  tags: string[];
  isLiked?: boolean;
  createdAt: string;
}

export const socialApiService = {
  async fetchFeed(token?: string): Promise<CommunityOutfitPost[]> {
    const result = await requestApi<CommunityOutfitPost[]>('/social/feed', { token });
    return Array.isArray(result.data) ? result.data : [];
  },

  async shareOutfit(
    dto: {
      outfitId: string;
      caption: string;
      venue?: string;
      occasion?: string;
      tags?: string[];
    },
    token?: string
  ): Promise<CommunityOutfitPost | null> {
    const result = await requestApi<CommunityOutfitPost>('/social/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
      token,
    });
    return result.data;
  },

  async toggleLike(postId: string, token?: string): Promise<{ liked: boolean; likesCount: number } | null> {
    const result = await requestApi<{ liked: boolean; likesCount: number }>(`/social/${postId}/like`, {
      method: 'POST',
      token,
    });
    return result.data;
  },
};
