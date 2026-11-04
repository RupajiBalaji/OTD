import { Request, Response } from 'express';
import { EventsService } from './events.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export class EventsController {
  public static getEvents = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const events = await EventsService.getUserEvents(userId);
    res.status(200).json(new ApiResponse(200, events, 'User scheduled calendar events'));
  });

  public static createEvent = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const event = await EventsService.createEvent(userId, req.body);
    res.status(201).json(new ApiResponse(201, event, 'Look scheduled in calendar successfully'));
  });

  public static updateEvent = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const event = await EventsService.updateEvent(userId, req.params.id as string, req.body);
    res.status(200).json(new ApiResponse(200, event, 'Calendar event updated'));
  });

  public static deleteEvent = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    await EventsService.deleteEvent(userId, req.params.id as string);
    res.status(200).json(new ApiResponse(200, null, 'Calendar event deleted'));
  });
}
