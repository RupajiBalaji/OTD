import { Router } from 'express';
import { WeatherController } from './weather.controller';

const router = Router();

router.get('/', WeatherController.getWeather);

export default router;
