import { Router } from 'express';
import { VirtualTryOnController } from './virtual-try-on.controller';
import { authenticateOptional } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { generateTryOnSchema } from './virtual-try-on.validator';

const router = Router();

router.use(authenticateOptional);

router.get('/avatar', VirtualTryOnController.getAvatar);
router.put('/avatar', VirtualTryOnController.updateAvatar);
router.post('/generate', validate(generateTryOnSchema), VirtualTryOnController.synthesizeTryOn);
router.get('/jobs/:id', VirtualTryOnController.getJobStatus);
router.get('/history', VirtualTryOnController.getHistory);

export default router;
