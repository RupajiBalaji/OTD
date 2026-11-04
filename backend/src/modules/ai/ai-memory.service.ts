import mongoose from 'mongoose';
import { AIConversation, IAIConversation } from '../../models/AIConversation';
import { AIMessage, IAIMessage } from '../../models/AIMessage';
import { ApiError } from '../../utils/ApiError';

export class AiMemoryService {
  /**
   * Retrieves or creates a conversation session for the user
   */
  public static async getOrCreateConversation(
    userId: string,
    conversationId?: string,
    initialContext?: {
      occasion?: string;
      venue?: string;
      vibe?: string;
      activeOutfitId?: string;
    }
  ): Promise<IAIConversation> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
      const existing = await AIConversation.findOne({
        _id: new mongoose.Types.ObjectId(conversationId),
        userId: userObjectId,
      });
      if (existing) {
        if (initialContext) {
          if (initialContext.occasion) existing.contextOccasion = initialContext.occasion;
          if (initialContext.venue) existing.contextVenue = initialContext.venue;
          if (initialContext.vibe) existing.contextVibe = initialContext.vibe;
          if (initialContext.activeOutfitId && mongoose.Types.ObjectId.isValid(initialContext.activeOutfitId)) {
            existing.activeOutfitId = new mongoose.Types.ObjectId(initialContext.activeOutfitId);
          }
          await existing.save();
        }
        return existing;
      }
    }

    // Create fresh conversation
    return await AIConversation.create({
      userId: userObjectId,
      title: initialContext?.venue ? `Styling for ${initialContext.venue}` : 'Haute Styling Session',
      contextOccasion: initialContext?.occasion,
      contextVenue: initialContext?.venue,
      contextVibe: initialContext?.vibe,
      activeOutfitId:
        initialContext?.activeOutfitId && mongoose.Types.ObjectId.isValid(initialContext.activeOutfitId)
          ? new mongoose.Types.ObjectId(initialContext.activeOutfitId)
          : undefined,
      lastMessageAt: new Date(),
    });
  }

  /**
   * Saves a message to conversation history
   */
  public static async recordMessage(params: {
    conversationId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    sender: 'user' | 'assistant' | 'system';
    content: string;
    suggestedGarmentIds?: mongoose.Types.ObjectId[];
    recommendedOutfitId?: mongoose.Types.ObjectId;
  }): Promise<IAIMessage> {
    const message = await AIMessage.create({
      conversationId: params.conversationId,
      userId: params.userId,
      sender: params.sender,
      content: params.content,
      suggestedGarmentIds: params.suggestedGarmentIds,
      recommendedOutfitId: params.recommendedOutfitId,
    });

    await AIConversation.findByIdAndUpdate(params.conversationId, {
      lastMessageAt: new Date(),
    });

    return message;
  }

  /**
   * Fetches the recent context window messages (capped to last 15 to prevent token bloat)
   */
  public static async getRecentContextMessages(
    conversationId: mongoose.Types.ObjectId,
    limit: number = 15
  ): Promise<IAIMessage[]> {
    return await AIMessage.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .then((docs) => docs.reverse());
  }

  /**
   * Lists all active styling conversations for the user
   */
  public static async getUserConversations(userId: string): Promise<IAIConversation[]> {
    return await AIConversation.find({
      userId: new mongoose.Types.ObjectId(userId),
      isArchived: false,
    }).sort({ lastMessageAt: -1 });
  }
}
