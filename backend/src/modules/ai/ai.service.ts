import mongoose from 'mongoose';
import { AiMemoryService } from './ai-memory.service';
import { AiOutfitPipelineService } from './outfit-pipeline.service';
import { UnifiedAiClient, AiChatMessage } from '../../integrations/ai/ai.client';
import { STYLIST_SYSTEM_PROMPT, buildStylistContextPrompt } from '../../integrations/ai/ai.prompts';
import { StylistChatRequest, StylistChatResponse } from './ai.types';
import { WardrobeItem } from '../../models/WardrobeItem';
import { Outfit } from '../../models/Outfit';

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

    // 5. Construct grounded prompt with schema instructions
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

    // 6. Generate AI response (via Gemini with structured validation or rules fallback)
    const aiResult = await UnifiedAiClient.generateStylistResponse(messages, {
      temperature: 0.3,
      maxTokens: 2048,
    });

    const structuredReply = aiResult.data;
    const source = aiResult.source;
    const modelUsed = aiResult.modelUsed;

    // 7. Validate every itemId in slotChanges against the user's actual verified wardrobe
    const realWardrobeItems = await WardrobeItem.find({ userId: userObjectId });
    const realItemsMap = new Map(realWardrobeItems.map((item) => [item._id.toString(), item]));

    const validatedSlotChanges = structuredReply.slotChanges.map((change) => {
      if (change.itemId && realItemsMap.has(change.itemId)) {
        const item = realItemsMap.get(change.itemId)!;
        return {
          ...change,
          itemName: item.name,
        };
      }

      // If itemId not provided or hallucinated, attempt fuzzy match by item name
      if (change.itemName) {
        const matched = realWardrobeItems.find(
          (w) =>
            w.name.toLowerCase().includes(change.itemName!.toLowerCase()) ||
            change.itemName!.toLowerCase().includes(w.name.toLowerCase())
        );
        if (matched) {
          return {
            ...change,
            itemId: matched._id.toString(),
            itemName: matched.name,
          };
        }
      }

      // Item not found in user's closet
      const notFoundLabel = change.itemName || change.itemId || 'requested piece';
      structuredReply.reply += `\n\n*(Note: ${notFoundLabel} was not found in your verified closet inventory. Please add it in Closet to equip it.)*`;

      return {
        ...change,
        itemId: undefined,
      };
    });

    // 8. Apply valid slot changes server-side if an active outfit exists
    const activeOutfitId = request.activeOutfitId || (conversation.activeOutfitId ? conversation.activeOutfitId.toString() : undefined);
    if (activeOutfitId && mongoose.Types.ObjectId.isValid(activeOutfitId)) {
      try {
        const activeOutfit = await Outfit.findOne({ _id: activeOutfitId, userId: userObjectId });
        if (activeOutfit && validatedSlotChanges.length > 0) {
          const validReplacementItemIds = validatedSlotChanges
            .map((c) => c.itemId)
            .filter((id): id is string => Boolean(id) && mongoose.Types.ObjectId.isValid(id))
            .map((id) => new mongoose.Types.ObjectId(id));

          if (validReplacementItemIds.length > 0) {
            // Merge with existing items, replacing items in same categories
            const replacementDocs = await WardrobeItem.find({ _id: { $in: validReplacementItemIds } });
            const replacedCategories = new Set(replacementDocs.map((d) => d.category));

            const keptOldItems = (
              await WardrobeItem.find({ _id: { $in: activeOutfit.items } })
            ).filter((d) => !replacedCategories.has(d.category));

            activeOutfit.items = [...keptOldItems.map((d) => d._id as mongoose.Types.ObjectId), ...validReplacementItemIds];
            await activeOutfit.save();
          }
        }
      } catch (err: any) {
        console.warn(`[AiStylistService] Error applying slot changes: ${err.message}`);
      }
    }

    // 9. Synthesize new outfit if user explicitly requested full new outfit
    let recommendedOutfitId: mongoose.Types.ObjectId | undefined = undefined;
    if (structuredReply.intent === 'recommend_new') {
      const generated = await AiOutfitPipelineService.synthesizeFromChatIntent(userId, {
        occasion: request.occasion || conversation.contextOccasion,
        venue: request.venue || conversation.contextVenue,
        vibe: request.vibe || conversation.contextVibe,
        weather: request.weather,
      });
      if (generated) {
        recommendedOutfitId = generated._id as mongoose.Types.ObjectId;
      }
    }

    // 10. Record assistant reply in database
    const assistantMessage = await AiMemoryService.recordMessage({
      conversationId: conversation._id as mongoose.Types.ObjectId,
      userId: userObjectId,
      sender: 'assistant',
      content: structuredReply.reply,
      recommendedOutfitId,
    });

    return {
      conversationId: (conversation._id as mongoose.Types.ObjectId).toString(),
      messageId: (assistantMessage._id as mongoose.Types.ObjectId).toString(),
      reply: structuredReply.reply,
      intent: structuredReply.intent,
      slotChanges: validatedSlotChanges,
      recommendedOutfitId: recommendedOutfitId ? recommendedOutfitId.toString() : undefined,
      source,
      modelUsed,
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
