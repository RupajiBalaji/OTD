import { requestApi } from './api.client';

export interface WeatherTelemetryResponse {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  condition: string;
  isDay: boolean;
  windSpeed: number;
  summary: string;
  city: string;
  timestamp: string;
}

export const weatherApiService = {
  /**
   * Fetches weather telemetry from backend API using coordinates or fallback city
   */
  async fetchWeather(
    lat?: number,
    lon?: number,
    city?: string
  ): Promise<WeatherTelemetryResponse | null> {
    const params = new URLSearchParams();
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lon !== undefined) params.append('lon', lon.toString());
    if (city) params.append('city', city);

    const query = params.toString() ? `?${params.toString()}` : '';
    const result = await requestApi<WeatherTelemetryResponse>(`/weather${query}`);
    return result.data;
  },

  /**
   * Automatically requests browser GPS and pulls real-time weather
   */
  async detectBrowserLocationWeather(): Promise<WeatherTelemetryResponse | null> {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        return resolve(this.fetchWeather(17.385, 78.4867, 'Hyderabad'));
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const weather = await this.fetchWeather(latitude, longitude, 'Current Location');
          resolve(weather);
        },
        async () => {
          // If location permission denied, fall back to luxury default city
          const fallback = await this.fetchWeather(17.385, 78.4867, 'Hyderabad');
          resolve(fallback);
        },
        { timeout: 5000 }
      );
    });
  },
};
