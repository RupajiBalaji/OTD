import { Router } from 'express';
import { EventsController } from './events.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createEventSchema, updateEventSchema } from './events.validator';

const router = Router();

router.use(authenticate);

router.get('/', EventsController.getEvents);
router.post('/', validate(createEventSchema), EventsController.createEvent);
router.patch('/:id', validate(updateEventSchema), EventsController.updateEvent);
router.delete('/:id', EventsController.deleteEvent);

export default router;
