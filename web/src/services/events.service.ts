import { requestApi } from './api.client';

export interface ScheduledCalendarEvent {
  _id: string;
  title: string;
  venue: string;
  occasion: string;
  vibe: string;
  scheduledDate: string;
  time: string;
  outfitId: any;
  weatherForecast?: string;
  status: 'scheduled' | 'worn' | 'cancelled';
  notes?: string;
}

export const eventsApiService = {
  async fetchEvents(token?: string): Promise<ScheduledCalendarEvent[]> {
    const result = await requestApi<ScheduledCalendarEvent[]>('/events', { token });
    return Array.isArray(result.data) ? result.data : [];
  },

  async createEvent(
    data: {
      title: string;
      venue: string;
      occasion: string;
      vibe?: string;
      scheduledDate: string;
      time?: string;
      outfitId: string;
      weatherForecast?: string;
      notes?: string;
    },
    token?: string
  ): Promise<ScheduledCalendarEvent | null> {
    const result = await requestApi<ScheduledCalendarEvent>('/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      token,
    });
    return result.data;
  },

  async updateEvent(
    id: string,
    updates: Partial<ScheduledCalendarEvent>,
    token?: string
  ): Promise<ScheduledCalendarEvent | null> {
    const result = await requestApi<ScheduledCalendarEvent>(`/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
      token,
    });
    return result.data;
  },

  async deleteEvent(id: string, token?: string): Promise<boolean> {
    const result = await requestApi<null>(`/events/${id}`, {
      method: 'DELETE',
      token,
    });
    return result.status >= 200 && result.status < 300;
  },
};
