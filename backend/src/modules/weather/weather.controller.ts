import { Request, Response } from 'express';
import { WeatherService } from './weather.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export class WeatherController {
  public static getWeather = asyncHandler(async (req: Request, res: Response) => {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : undefined;
    const city = (req.query.city as string) || 'Local';

    const telemetry = await WeatherService.getWeather(lat, lon, city);
    res.status(200).json(new ApiResponse(200, telemetry, 'Current weather telemetry'));
  });
}
