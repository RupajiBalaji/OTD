import { Router } from 'express';
import { VenuesController } from './venues.controller';

const router = Router();

router.get('/search', VenuesController.searchVenues);

export default router;
