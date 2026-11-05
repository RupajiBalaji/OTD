import { Request, Response } from 'express';
import { AiStylistService } from './ai.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { stylistChatSchema } from './ai.validator';
import { ApiError } from '../../utils/ApiError';
import { UnifiedAiClient } from '../../integrations/ai/ai.client';

export class AiController {
  /**
   * GET /api/v1/ai/status
   * Live health check of text and image models
   */
  public static getAiStatus = asyncHandler(async (_req: Request, res: Response) => {
    const status = await UnifiedAiClient.checkAiHealth();
    res.status(200).json(new ApiResponse(200, status, 'AI Gateway status telemetry'));
  });

  /**
   * POST /api/v1/ai/chat
   */
  public static chatWithStylist = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const rateCheck = UnifiedAiClient.checkUserDailyCap(userId);
    if (!rateCheck.allowed) {
      throw new ApiError(429, 'Daily AI request limit reached. Please try again tomorrow.');
    }

    const validation = stylistChatSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ApiError(400, validation.error.issues[0].message);
    }

    const result = await AiStylistService.chat(userId, validation.data);
    res.status(200).json(new ApiResponse(200, result, 'Stylist response generated'));
  });

  /**
   * POST /api/v1/ai/chat/stream
   * Server-Sent Events (SSE) streaming endpoint
   */
  public static streamStylistChat = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const rateCheck = UnifiedAiClient.checkUserDailyCap(userId);
    if (!rateCheck.allowed) {
      throw new ApiError(429, 'Daily AI request limit reached. Please try again tomorrow.');
    }

    const validation = stylistChatSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ApiError(400, validation.error.issues[0].message);
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const result = await AiStylistService.chat(userId, validation.data);

    // Stream the reply in natural word tokens
    const words = result.reply.split(' ');
    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? '' : ' ') + words[i];
      res.write(`data: ${JSON.stringify({ type: 'token', token: chunk })}\n\n`);
      // Tiny throttle for smooth streaming illusion
      await new Promise((r) => setTimeout(r, 20));
    }

    // Stream completion payload
    res.write(`data: ${JSON.stringify({ type: 'done', response: result })}\n\n`);
    res.end();
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
