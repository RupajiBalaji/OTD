import { WeatherTelemetry } from './weather.types';

export class WeatherService {
  /**
   * Fetches real-time weather from Open-Meteo API using latitude and longitude
   */
  public static async getWeather(
    lat: number = 17.385,
    lon: number = 78.4867,
    city: string = 'Local'
  ): Promise<WeatherTelemetry> {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;
      
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const data = (await res.json()) as any;
        const current = data.current;

        const condition = this.mapWmoCode(current.weather_code);
        const temp = Math.round(current.temperature_2m);
        const apparent = Math.round(current.apparent_temperature);
        const humidity = Math.round(current.relative_humidity_2m);
        const wind = Math.round(current.wind_speed_10m);

        let climateModifier = condition;
        if (wind > 15) climateModifier += ' · Breezy';
        if (humidity > 70) climateModifier += ' · High Humidity';

        return {
          temperature: temp,
          apparentTemperature: apparent,
          humidity,
          weatherCode: current.weather_code,
          condition,
          isDay: Boolean(current.is_day),
          windSpeed: wind,
          summary: `${temp}°C ${climateModifier}`,
          city,
          timestamp: current.time || new Date().toISOString(),
        };
      }
    } catch {
      // Graceful fallback to calibrated default climate telemetry
    }

    // Default luxury editorial weather fallback
    return {
      temperature: 24,
      apparentTemperature: 23,
      humidity: 58,
      weatherCode: 1,
      condition: 'Partly Cloudy',
      isDay: true,
      windSpeed: 12,
      summary: '24°C Partly Cloudy · Light Breeze',
      city,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Translates WMO weather code into human-readable fashion context
   */
  private static mapWmoCode(code: number): string {
    if (code === 0) return 'Clear Sky';
    if (code === 1 || code === 2) return 'Mainly Clear';
    if (code === 3) return 'Partly Cloudy';
    if (code === 45 || code === 48) return 'Overcast / Foggy';
    if (code >= 51 && code <= 55) return 'Light Drizzle';
    if (code >= 61 && code <= 65) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Crisp Snow';
    if (code >= 80 && code <= 82) return 'Passing Showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Temperate';
  }
}
