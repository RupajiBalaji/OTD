import { Router } from 'express';
import { ShoppingController } from './shopping.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/gaps', ShoppingController.getGaps);

export default router;
