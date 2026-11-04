import { Router } from 'express';
import { AiController } from './ai.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { stylistChatSchema } from './ai.validator';

const router = Router();

router.use(authenticate);

router.post('/chat', validate(stylistChatSchema), AiController.chatWithStylist);
router.get('/conversations', AiController.listConversations);
router.get('/conversations/:id/messages', AiController.getConversationHistory);

export default router;
