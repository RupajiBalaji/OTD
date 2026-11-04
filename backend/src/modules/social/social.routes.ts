import { Router } from 'express';
import { SocialController } from './social.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createShareSchema, createCommentSchema } from './social.validator';

const router = Router();

// Public feed viewing (optional auth to show like status)
router.get('/feed', SocialController.getFeed);
router.get('/:id/comments', SocialController.getComments);

// Protected social interactions
router.use(authenticate);

router.post('/share', validate(createShareSchema), SocialController.shareOutfit);
router.post('/:id/like', SocialController.toggleLike);
router.post('/:id/comment', validate(createCommentSchema), SocialController.addComment);

export default router;
