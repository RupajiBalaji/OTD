import { Router } from 'express';
import { WardrobeIntelligenceController } from './wardrobe-intelligence.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/analytics', WardrobeIntelligenceController.getAnalytics);

export default router;
