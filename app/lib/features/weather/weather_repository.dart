import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../outfits/outfits_repository.dart';

class WeatherData {
  final int temperature; // in °C
  final String condition; // e.g. 'Partly Cloudy', 'Clear Evening', 'Breezy'
  final int humidity; // percentage e.g. 55
  final int windSpeedKmH; // in km/h e.g. 14
  final String city; // e.g. 'Mumbai', 'New York'
  final String icon; // emoji or icon code

  const WeatherData({
    required this.temperature,
    required this.condition,
    required this.humidity,
    required this.windSpeedKmH,
    required this.city,
    this.icon = '⛅',
  });

  String get summary => '$temperature°C • $condition';
}

abstract class WeatherRepository {
  Future<WeatherData> getCurrentWeather();
  Future<WeatherData> getWeatherForLocation(String location);
}

class MockWeatherRepository implements WeatherRepository {
  @override
  Future<WeatherData> getCurrentWeather() async {
    await Future.delayed(const Duration(milliseconds: 100));
    final hour = DateTime.now().hour;
    final isNight = hour < 6 || hour >= 19;

    return WeatherData(
      temperature: isNight ? 22 : 27,
      condition: isNight ? 'Breezy & Clear' : 'Partly Cloudy',
      humidity: 58,
      windSpeedKmH: 12,
      city: 'Mumbai',
      icon: isNight ? '🌙' : '⛅',
    );
  }

  @override
  Future<WeatherData> getWeatherForLocation(String location) async {
    await Future.delayed(const Duration(milliseconds: 150));
    final loc = location.toLowerCase();

    if (loc.contains('hills') || loc.contains('rooftop')) {
      return const WeatherData(
        temperature: 23,
        condition: 'Breezy & Cool',
        humidity: 50,
        windSpeedKmH: 18,
        city: 'Hyderabad',
        icon: '💨',
      );
    } else if (loc.contains('mumbai') || loc.contains('bastian') || loc.contains('aer')) {
      return const WeatherData(
        temperature: 28,
        condition: 'Warm & Balmy',
        humidity: 68,
        windSpeedKmH: 10,
        city: 'Mumbai',
        icon: '🌊',
      );
    } else if (loc.contains('delhi') || loc.contains('indoor')) {
      return const WeatherData(
        temperature: 25,
        condition: 'Mild & Clear',
        humidity: 45,
        windSpeedKmH: 8,
        city: 'New Delhi',
        icon: '☀️',
      );
    }

    return const WeatherData(
      temperature: 24,
      condition: 'Pleasant & Mild',
      humidity: 55,
      windSpeedKmH: 12,
      city: 'Curated Venue',
      icon: '⛅',
    );
  }
}

final weatherRepositoryProvider = Provider<WeatherRepository>((ref) {
  return MockWeatherRepository();
});

final currentWeatherProvider = FutureProvider<WeatherData>((ref) async {
  final repo = ref.watch(weatherRepositoryProvider);
  final userCity = ref.watch(userProfileProvider).city;
  return repo.getWeatherForLocation(userCity);
});
