import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../destinations/venue_repository.dart';
import '../weather/weather_repository.dart';

class PlanLookState {
  final VenueItem? venue;
  final String customVenueName;
  final String occasion;
  final String customOccasion;
  final String mood;
  final WeatherData? weatherSnapshot;
  final String whenOption;
  final String selectedTime;
  final int currentStep;

  const PlanLookState({
    this.venue,
    this.customVenueName = '',
    this.occasion = 'Date',
    this.customOccasion = '',
    this.mood = 'Confident',
    this.weatherSnapshot,
    this.whenOption = 'Now',
    this.selectedTime = '8:00 PM',
    this.currentStep = 0,
  });

  String get effectiveVenueName {
    if (venue != null) return venue!.name;
    if (customVenueName.trim().isNotEmpty) return customVenueName.trim();
    return 'L\'amore';
  }

  String get effectiveOccasion {
    if (occasion == 'Custom' && customOccasion.trim().isNotEmpty) {
      return customOccasion.trim();
    }
    return occasion;
  }

  bool get isStep1Valid => venue != null || customVenueName.trim().isNotEmpty;
  bool get isStep2Valid =>
      occasion != 'Custom' || customOccasion.trim().isNotEmpty;
  bool get isStep3Valid => mood.isNotEmpty;
  bool get isStep4Valid => true;

  PlanLookState copyWith({
    VenueItem? venue,
    String? customVenueName,
    String? occasion,
    String? customOccasion,
    String? mood,
    WeatherData? weatherSnapshot,
    String? whenOption,
    String? selectedTime,
    int? currentStep,
    bool clearVenue = false,
  }) {
    return PlanLookState(
      venue: clearVenue ? null : (venue ?? this.venue),
      customVenueName: customVenueName ?? this.customVenueName,
      occasion: occasion ?? this.occasion,
      customOccasion: customOccasion ?? this.customOccasion,
      mood: mood ?? this.mood,
      weatherSnapshot: weatherSnapshot ?? this.weatherSnapshot,
      whenOption: whenOption ?? this.whenOption,
      selectedTime: selectedTime ?? this.selectedTime,
      currentStep: currentStep ?? this.currentStep,
    );
  }
}

class PlanLookNotifier extends StateNotifier<PlanLookState> {
  final Ref _ref;

  PlanLookNotifier(this._ref) : super(const PlanLookState()) {
    _initDefaultWeather();
  }

  Future<void> _initDefaultWeather() async {
    final weatherRepo = _ref.read(weatherRepositoryProvider);
    final w = await weatherRepo.getCurrentWeather();
    if (mounted) {
      state = state.copyWith(weatherSnapshot: w);
    }
  }

  void setVenue(VenueItem venue) async {
    state = state.copyWith(
      venue: venue,
      customVenueName: '',
    );
    // Auto-update weather for selected venue
    final weatherRepo = _ref.read(weatherRepositoryProvider);
    final w = await weatherRepo.getWeatherForLocation(venue.location);
    if (mounted) {
      state = state.copyWith(weatherSnapshot: w);
    }
  }

  void setCustomVenue(String name) async {
    state = state.copyWith(
      customVenueName: name,
      clearVenue: true,
    );
    if (name.trim().isNotEmpty) {
      final weatherRepo = _ref.read(weatherRepositoryProvider);
      final w = await weatherRepo.getWeatherForLocation(name);
      if (mounted) {
        state = state.copyWith(weatherSnapshot: w);
      }
    }
  }

  void setOccasion(String occasion, {String? customText}) {
    state = state.copyWith(
      occasion: occasion,
      customOccasion: customText,
    );
  }

  void setMood(String mood) {
    state = state.copyWith(mood: mood);
  }

  void setWhen(String whenOption, {String? time}) {
    state = state.copyWith(
      whenOption: whenOption,
      selectedTime: time,
    );
  }

  void setStep(int step) {
    state = state.copyWith(currentStep: step.clamp(0, 3));
  }

  void nextStep() {
    if (state.currentStep < 3) {
      state = state.copyWith(currentStep: state.currentStep + 1);
    }
  }

  void prevStep() {
    if (state.currentStep > 0) {
      state = state.copyWith(currentStep: state.currentStep - 1);
    }
  }

  void reset() {
    state = const PlanLookState();
    _initDefaultWeather();
  }
}

final planLookProvider =
    StateNotifierProvider<PlanLookNotifier, PlanLookState>((ref) {
  return PlanLookNotifier(ref);
});
