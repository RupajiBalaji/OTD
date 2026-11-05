import { Types } from 'mongoose';
import { SlotChange } from '../../integrations/ai/ai.schemas';

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
  intent: string;
  slotChanges: SlotChange[];
  suggestedGarmentIds?: string[];
  recommendedOutfitId?: string;
  source: 'gemini' | 'rules';
  modelUsed?: string;
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
