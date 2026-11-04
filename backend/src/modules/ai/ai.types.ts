import { Types } from 'mongoose';

export interface StylistChatRequest {
  message: string;
  conversationId?: string;
  occasion?: string;
  venue?: string;
  vibe?: string;
  weather?: string;
  activeOutfitId?: string;
}

export interface StylistChatResponse {
  conversationId: string;
  messageId: string;
  reply: string;
  suggestedGarmentIds?: string[];
  recommendedOutfitId?: string;
  timestamp: string;
}

export interface ConversationSummary {
  id: string;
  title: string;
  lastMessageAt: Date;
  contextOccasion?: string;
  contextVenue?: string;
  contextVibe?: string;
  messageCount: number;
}
