import mongoose from 'mongoose';
import { AiMemoryService } from './ai-memory.service';
import { AiOutfitPipelineService } from './outfit-pipeline.service';
import { UnifiedAiClient, AiChatMessage } from '../../integrations/ai/ai.client';
import { STYLIST_SYSTEM_PROMPT, buildStylistContextPrompt } from '../../integrations/ai/ai.prompts';
import { StylistChatRequest, StylistChatResponse } from './ai.types';

export class AiStylistService {
  /**
   * Primary conversational stylist endpoint
   */
  public static async chat(
    userId: string,
    request: StylistChatRequest
  ): Promise<StylistChatResponse> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Fetch or initialize conversation
    const conversation = await AiMemoryService.getOrCreateConversation(
      userId,
      request.conversationId,
      {
        occasion: request.occasion,
        venue: request.venue,
        vibe: request.vibe,
        activeOutfitId: request.activeOutfitId,
      }
    );

    // 2. Record user query in conversation memory
    await AiMemoryService.recordMessage({
      conversationId: conversation._id as mongoose.Types.ObjectId,
      userId: userObjectId,
      sender: 'user',
      content: request.message,
    });

    // 3. Fetch user grounding data (profile + verified digital closet)
    const [profile, wardrobe] = await Promise.all([
      AiOutfitPipelineService.getUserStylingProfile(userId),
      AiOutfitPipelineService.getGroundingWardrobe(userId),
    ]);

    // 4. Fetch recent conversation history for memory continuity
    const history = await AiMemoryService.getRecentContextMessages(
      conversation._id as mongoose.Types.ObjectId,
      10
    );

    // 5. Construct grounded prompt
    const contextPrompt = buildStylistContextPrompt({
      profile,
      wardrobeSummary: wardrobe,
      occasion: request.occasion || conversation.contextOccasion,
      venue: request.venue || conversation.contextVenue,
      weather: request.weather,
      userPrompt: request.message,
    });

    const messages: AiChatMessage[] = [
      { role: 'system', content: STYLIST_SYSTEM_PROMPT },
      ...history.slice(0, -1).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.content,
      })),
      { role: 'user', content: contextPrompt },
    ];

    // 6. Generate AI response (via Gemini, OpenAI, or algorithmic fallback)
    const replyText = await UnifiedAiClient.generateStylistResponse(messages, {
      temperature: 0.7,
      maxTokens: 600,
    });

    // 7. Check if user prompt requests outfit generation/modification
    let recommendedOutfitId: mongoose.Types.ObjectId | undefined = undefined;
    const lower = request.message.toLowerCase();
    if (
      lower.includes('outfit') ||
      lower.includes('suggest') ||
      lower.includes('wear') ||
      lower.includes('style me') ||
      lower.includes('generate')
    ) {
      const generatedOutfit = await AiOutfitPipelineService.synthesizeFromChatIntent(userId, {
        occasion: request.occasion || conversation.contextOccasion,
        venue: request.venue || conversation.contextVenue,
        vibe: request.vibe || conversation.contextVibe,
        weather: request.weather,
      });
      if (generatedOutfit) {
        recommendedOutfitId = generatedOutfit._id as mongoose.Types.ObjectId;
      }
    }

    // 8. Record assistant reply in database
    const assistantMessage = await AiMemoryService.recordMessage({
      conversationId: conversation._id as mongoose.Types.ObjectId,
      userId: userObjectId,
      sender: 'assistant',
      content: replyText,
      recommendedOutfitId,
    });

    return {
      conversationId: (conversation._id as mongoose.Types.ObjectId).toString(),
      messageId: (assistantMessage._id as mongoose.Types.ObjectId).toString(),
      reply: replyText,
      recommendedOutfitId: recommendedOutfitId ? recommendedOutfitId.toString() : undefined,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Fetches full history for an existing conversation
   */
  public static async getConversationMessages(userId: string, conversationId: string) {
    const conversation = await AiMemoryService.getOrCreateConversation(userId, conversationId);
    const messages = await AiMemoryService.getRecentContextMessages(
      conversation._id as mongoose.Types.ObjectId,
      50
    );
    return {
      conversation,
      messages,
    };
  }

  /**
   * Lists all past styling sessions
   */
  public static async listUserConversations(userId: string) {
    return await AiMemoryService.getUserConversations(userId);
  }
}
