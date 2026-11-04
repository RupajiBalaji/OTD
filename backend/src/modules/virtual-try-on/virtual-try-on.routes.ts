import { Router } from 'express';
import { VirtualTryOnController } from './virtual-try-on.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { generateTryOnSchema } from './virtual-try-on.validator';

const router = Router();

router.use(authenticate);

router.get('/avatar', VirtualTryOnController.getAvatar);
router.put('/avatar', VirtualTryOnController.updateAvatar);
router.post('/generate', validate(generateTryOnSchema), VirtualTryOnController.synthesizeTryOn);
router.get('/history', VirtualTryOnController.getHistory);

export default router;
