import { describe, it, expect } from 'vitest';
import { createEventSchema, updateEventSchema } from '../../src/modules/events/events.validator';

describe('Calendar & Events Validator Unit Tests', () => {
  it('should validate complete event payload', () => {
    const validData = {
      title: 'Dinner Date at L’Amore',
      venue: "L'Amore Ristorante, Jubilee Hills",
      occasion: 'Fine Dining Date',
      vibe: 'Sartorial Minimalist',
      scheduledDate: '2026-11-15T20:00:00.000Z',
      time: '8:00 PM',
      outfitId: '64f1a2b3c4d5e6f7a8b9c0d1',
      weatherForecast: '22°C Evening Breeze',
      notes: 'Terrace table reserved under Julian',
    };

    const parsed = createEventSchema.parse(validData);
    expect(parsed.title).toBe(validData.title);
    expect(parsed.venue).toContain("L'Amore");
    expect(parsed.time).toBe('8:00 PM');
  });

  it('should reject missing required title or outfitId', () => {
    const invalid = {
      venue: 'Olive Bistro',
      occasion: 'Brunch',
    };

    expect(() => createEventSchema.parse(invalid)).toThrow();
  });

  it('should validate status updates', () => {
    const update = { status: 'worn' as const };
    const parsed = updateEventSchema.parse(update);
    expect(parsed.status).toBe('worn');
  });
});
