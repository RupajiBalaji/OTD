import { Request, Response } from 'express';
import { VenuesService } from './venues.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export class VenuesController {
  public static searchVenues = asyncHandler(async (req: Request, res: Response) => {
    const q = (req.query.q as string) || (req.query.query as string) || '';
    const venues = await VenuesService.searchVenues(q);
    res.status(200).json(new ApiResponse(200, venues, 'Venue intelligence results'));
  });
}
