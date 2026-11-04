import { requestApi } from './api.client';

export interface StylistChatPayload {
  message: string;
  conversationId?: string;
  occasion?: string;
  venue?: string;
  vibe?: string;
  weather?: string;
  activeOutfitId?: string;
}

export interface StylistChatResponseData {
  conversationId: string;
  messageId: string;
  reply: string;
  recommendedOutfitId?: string;
  timestamp: string;
}

export const aiApiService = {
  async chatWithStylist(payload: StylistChatPayload, token?: string): Promise<StylistChatResponseData | null> {
    const { data } = await requestApi<StylistChatResponseData>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
      token,
    });
    return data;
  },

  async getConversations(token?: string) {
    const { data } = await requestApi<any[]>('/ai/conversations', { token });
    return data || [];
  },
};
