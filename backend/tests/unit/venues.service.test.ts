import { describe, it, expect } from 'vitest';
import { VenuesService } from '../../src/modules/venues/venues.service';

describe('Venues Intelligence Unit Tests', () => {
  it('should return curated venues on empty query', async () => {
    const venues = await VenuesService.searchVenues('');
    expect(venues.length).toBeGreaterThan(0);
    expect(venues.some((v) => v.name.includes("L'Amore"))).toBe(true);
  });

  it('should find specific venue and provide dress code advice', async () => {
    const results = await VenuesService.searchVenues('Olive');
    expect(results.length).toBeGreaterThan(0);
    const olive = results[0];
    expect(olive.name).toContain('Olive Bistro');
    expect(olive.formality).toBe(3);
    expect(olive.dressCodeAdvice).toBeDefined();
  });

  it('should dynamically classify an unlisted custom venue', async () => {
    const custom = await VenuesService.searchVenues('Sky High Rooftop Bar');
    expect(custom.length).toBeGreaterThan(0);
    const topResult = custom[0];
    expect(topResult.category).toBe('Rooftop Lounge');
    expect(topResult.formality).toBe(3);
  });
});
