export interface WeatherTelemetry {
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
