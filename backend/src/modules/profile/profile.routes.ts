import { Router } from 'express';
import { ProfileController } from './profile.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { updateProfileSchema } from './profile.validator';

const router = Router();

router.use(authenticate);

router.get('/', ProfileController.getProfile);
router.put('/', validate(updateProfileSchema), ProfileController.updateProfile);

export default router;
