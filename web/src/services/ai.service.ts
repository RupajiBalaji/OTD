import { requestApi } from './api.client';

export interface StylistSlotChange {
  slot: 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories' | 'onePiece';
  itemId?: string;
  itemName?: string;
  action: 'replace' | 'add' | 'remove';
  rationale?: string;
}

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
  intent: string;
  slotChanges: StylistSlotChange[];
  recommendedOutfitId?: string;
  source: 'gemini' | 'rules';
  modelUsed?: string;
  timestamp: string;
}

export interface AiGatewayStatus {
  textModel: {
    model: string;
    available: boolean;
    latencyMs?: number;
    error?: string;
  };
  imageModel: {
    model: string;
    available: boolean;
    reason?: string;
  };
  activeProvider: string;
  keysConfigured: number;
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

  async getAiStatus(): Promise<AiGatewayStatus | null> {
    const { data } = await requestApi<AiGatewayStatus>('/ai/status');
    return data;
  },

  async getConversations(token?: string) {
    const { data } = await requestApi<any[]>('/ai/conversations', { token });
    return data || [];
  },
};
