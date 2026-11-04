import { Router } from 'express';
import { WardrobeController } from './wardrobe.controller';
import { WardrobeImageController } from './wardrobe-image.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { uploadGarmentImageMiddleware } from '../../middlewares/upload.middleware';
import { createWardrobeItemSchema, updateWardrobeItemSchema } from './wardrobe.validator';

const router = Router();

// Public media stream for rendered <img> tags with high-performance caching
router.get('/images/:id', WardrobeImageController.getImage);

// Authenticated wardrobe actions
router.use(authenticate);

router.get('/', WardrobeController.getWardrobe);
router.post('/', validate(createWardrobeItemSchema), WardrobeController.addItem);
router.post(
  '/upload-image',
  uploadGarmentImageMiddleware.single('image'),
  WardrobeImageController.uploadImage
);
router.post('/analyze-image', WardrobeController.analyzeGarment);
router.get('/:id', WardrobeController.getItem);
router.patch('/:id', validate(updateWardrobeItemSchema), WardrobeController.updateItem);
router.delete('/:id', WardrobeController.deleteItem);
router.post('/:id/mark-worn', WardrobeController.markWorn);

export default router;
