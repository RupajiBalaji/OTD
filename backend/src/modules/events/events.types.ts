export interface CreateEventDto {
  title: string;
  venue: string;
  occasion: string;
  vibe?: string;
  scheduledDate: string | Date;
  time?: string;
  outfitId?: string;
  weatherForecast?: string;
  notes?: string;
}

export interface UpdateEventDto {
  title?: string;
  venue?: string;
  occasion?: string;
  vibe?: string;
  scheduledDate?: string | Date;
  time?: string;
  weatherForecast?: string;
  status?: 'scheduled' | 'worn' | 'cancelled';
  notes?: string;
}
