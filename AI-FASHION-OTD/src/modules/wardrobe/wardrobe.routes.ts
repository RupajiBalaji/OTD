import { Router } from 'express';
import { WardrobeController } from './wardrobe.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createWardrobeItemSchema, updateWardrobeItemSchema } from './wardrobe.validator';

const router = Router();

router.use(authenticate);

router.get('/', WardrobeController.getWardrobe);
router.post('/', validate(createWardrobeItemSchema), WardrobeController.addItem);
router.get('/:id', WardrobeController.getItem);
router.patch('/:id', validate(updateWardrobeItemSchema), WardrobeController.updateItem);
router.delete('/:id', WardrobeController.deleteItem);
router.post('/:id/mark-worn', WardrobeController.markWorn);

export default router;
