import { Request, Response } from 'express';
import { AiStylistService } from './ai.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { stylistChatSchema } from './ai.validator';
import { ApiError } from '../../utils/ApiError';

export class AiController {
  /**
   * POST /api/v1/ai/chat
   */
  public static chatWithStylist = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const validation = stylistChatSchema.safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(400, validation.error.issues[0].message);
    }

    const result = await AiStylistService.chat(userId, validation.data);
    res.status(200).json(new ApiResponse(200, result, 'Stylist response generated'));
  });

  /**
   * GET /api/v1/ai/conversations
   */
  public static listConversations = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const conversations = await AiStylistService.listUserConversations(userId);
    res.status(200).json(new ApiResponse(200, conversations, 'Conversations fetched'));
  });

  /**
   * GET /api/v1/ai/conversations/:id/messages
   */
  public static getConversationHistory = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const history = await AiStylistService.getConversationMessages(userId, id);
    res.status(200).json(new ApiResponse(200, history, 'Conversation history fetched'));
  });
}
