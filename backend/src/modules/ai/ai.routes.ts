import { Router } from 'express';
import { AiController } from './ai.controller';
import { authenticateOptional } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { stylistChatSchema } from './ai.validator';

const router = Router();

router.get('/status', AiController.getAiStatus);
router.post('/chat', authenticateOptional, validate(stylistChatSchema), AiController.chatWithStylist);
router.post('/chat/stream', authenticateOptional, validate(stylistChatSchema), AiController.streamStylistChat);
router.get('/conversations', authenticateOptional, AiController.listConversations);
router.get('/conversations/:id/messages', authenticateOptional, AiController.getConversationHistory);

export default router;
