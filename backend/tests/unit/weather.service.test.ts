import { describe, it, expect } from 'vitest';
import { WeatherService } from '../../src/modules/weather/weather.service';
import { getWeatherQuerySchema } from '../../src/modules/weather/weather.validator';

describe('Weather Service & Validator Unit Tests', () => {
  it('should validate valid coordinate queries', () => {
    const validQuery = { lat: '17.385', lon: '78.4867', city: 'Hyderabad' };
    const parsed = getWeatherQuerySchema.parse(validQuery);
    expect(parsed.lat).toBeCloseTo(17.385);
    expect(parsed.lon).toBeCloseTo(78.4867);
    expect(parsed.city).toBe('Hyderabad');
  });

  it('should reject out-of-bounds coordinates', () => {
    const invalidQuery = { lat: '95.0', lon: '200.0' };
    expect(() => getWeatherQuerySchema.parse(invalidQuery)).toThrow();
  });

  it('should return structured weather telemetry with thermal comfort summary', async () => {
    const telemetry = await WeatherService.getWeather(17.385, 78.4867, 'Hyderabad');
    expect(telemetry).toBeDefined();
    expect(typeof telemetry.temperature).toBe('number');
    expect(typeof telemetry.condition).toBe('string');
    expect(telemetry.summary).toContain('°C');
  });
});
