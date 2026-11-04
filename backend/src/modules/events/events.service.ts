import { Event, IEvent } from '../../models/Event';
import { Outfit } from '../../models/Outfit';
import { ApiError } from '../../utils/ApiError';
import { CreateEventDto, UpdateEventDto } from './events.types';

export class EventsService {
  public static async getUserEvents(userId: string): Promise<IEvent[]> {
    return Event.find({ userId })
      .populate({
        path: 'outfitId',
        populate: { path: 'items' },
      })
      .sort({ scheduledDate: 1 });
  }

  public static async createEvent(userId: string, data: CreateEventDto): Promise<IEvent> {
    let validatedOutfitId: any = undefined;
    if (data.outfitId) {
      try {
        const outfit = await Outfit.findOne({ _id: data.outfitId, userId });
        if (outfit) {
          validatedOutfitId = outfit._id;
        }
      } catch {
        // Not a valid mongoose ObjectId or ephemeral outfit id, proceed without blocking
      }
    }

    const event = await Event.create({
      userId,
      title: data.title,
      venue: data.venue,
      occasion: data.occasion,
      vibe: data.vibe || 'Clean Minimalist',
      scheduledDate: new Date(data.scheduledDate),
      time: data.time || '8:00 PM',
      outfitId: validatedOutfitId,
      weatherForecast: data.weatherForecast || '24°C Pleasant',
      notes: data.notes,
      status: 'scheduled',
    });

    if (validatedOutfitId) {
      await event.populate({
        path: 'outfitId',
        populate: { path: 'items' },
      });
    }

    return event;
  }

  public static async updateEvent(userId: string, eventId: string, data: UpdateEventDto): Promise<IEvent> {
    const event = await Event.findOne({ _id: eventId, userId });
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (data.scheduledDate) {
      event.scheduledDate = new Date(data.scheduledDate);
    }
    if (data.title) event.title = data.title;
    if (data.venue) event.venue = data.venue;
    if (data.occasion) event.occasion = data.occasion;
    if (data.vibe) event.vibe = data.vibe;
    if (data.time) event.time = data.time;
    if (data.weatherForecast) event.weatherForecast = data.weatherForecast;
    if (data.status) event.status = data.status;
    if (data.notes !== undefined) event.notes = data.notes;

    await event.save();
    return event.populate({
      path: 'outfitId',
      populate: { path: 'items' },
    });
  }

  public static async deleteEvent(userId: string, eventId: string): Promise<void> {
    const event = await Event.findOneAndDelete({ _id: eventId, userId });
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }
  }
}
