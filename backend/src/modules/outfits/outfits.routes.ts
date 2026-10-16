import { Router } from 'express';
import { OutfitsController } from './outfits.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { generateOutfitSchema } from './outfits.validator';

const router = Router();

router.use(authenticate);

router.get('/daily', OutfitsController.getDailyRecommendations);
router.post('/generate', validate(generateOutfitSchema), OutfitsController.generateOutfit);
router.post('/:id/wear', OutfitsController.logAsWorn);
router.post('/:id/bookmark', OutfitsController.toggleBookmark);

export default router;
