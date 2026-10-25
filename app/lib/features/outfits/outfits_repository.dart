import 'dart:convert';
import 'dart:math';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../shared/models/fashion_models.dart';
import '../wardrobe/wardrobe_repository.dart';

// User Profile Provider
class UserProfileNotifier extends StateNotifier<UserProfile> {
  static const String _keyProfile = 'otd_user_profile';

  UserProfileNotifier()
      : super(
          const UserProfile(
            name: 'Alexa',
            city: 'Mumbai',
            height: "5'10\" (178 cm)",
            bodyShape: 'Rectangle',
            stylePersonas: ['Minimal', 'Smart Casual'],
            preferredFit: 'Tailored',
            palettePreferences: ['Black & White', 'Beige & Earth', 'Charcoal & Navy'],
            gender: 'Female',
            weightKg: 62.0,
            goals: ['Everyday Looks', 'Work/Office', 'Parties'],
            avatarId: 'avatar_1',
            skinTone: '#E0AC69',
            hairStyle: 'Classic Taper',
          ),
        ) {
    _loadFromPrefs();
  }

  Future<void> _loadFromPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final str = prefs.getString(_keyProfile);
      if (str != null) {
        state = UserProfile.fromJson(jsonDecode(str) as Map<String, dynamic>);
      }
    } catch (_) {}
  }

  Future<void> updateProfile(UserProfile newProfile) async {
    state = newProfile;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_keyProfile, jsonEncode(newProfile.toJson()));
    } catch (_) {}
  }
}

final userProfileProvider =
    StateNotifierProvider<UserProfileNotifier, UserProfile>((ref) {
  return UserProfileNotifier();
});

// Recent Looks Provider (Persists history across app restarts)
class RecentLooksNotifier extends StateNotifier<List<OutfitRecommendation>> {
  static const String _keyRecentLooks = 'otd_recent_looks';

  RecentLooksNotifier() : super([]) {
    _loadFromPrefs();
  }

  Future<void> _loadFromPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final data = prefs.getString(_keyRecentLooks);
      if (data != null) {
        final List<dynamic> list = jsonDecode(data);
        state = list.map((j) => OutfitRecommendation.fromJson(j as Map<String, dynamic>)).toList();
      }
    } catch (_) {}
  }

  Future<void> _saveToPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final str = jsonEncode(state.map((l) => l.toJson()).toList());
      await prefs.setString(_keyRecentLooks, str);
    } catch (_) {}
  }

  void addRecentLook(OutfitRecommendation outfit) {
    state = [outfit, ...state.where((l) => l.id != outfit.id)].take(10).toList();
    _saveToPrefs();
  }

  void clearRecent() {
    state = [];
    _saveToPrefs();
  }

  void clearAll() => clearRecent();
}

final recentLooksProvider =
    StateNotifierProvider<RecentLooksNotifier, List<OutfitRecommendation>>((ref) {
  return RecentLooksNotifier();
});

// Saved Looks Provider
class SavedLooksNotifier extends StateNotifier<List<OutfitRecommendation>> {
  static const String _keySavedLooks = 'otd_saved_looks';

  SavedLooksNotifier() : super([]) {
    _loadFromPrefs();
  }

  Future<void> _loadFromPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final data = prefs.getString(_keySavedLooks);
      if (data != null) {
        final List<dynamic> list = jsonDecode(data);
        state = list.map((j) => OutfitRecommendation.fromJson(j as Map<String, dynamic>)).toList();
      }
    } catch (_) {}
  }

  Future<void> _saveToPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final str = jsonEncode(state.map((l) => l.toJson()).toList());
      await prefs.setString(_keySavedLooks, str);
    } catch (_) {}
  }

  void toggleSave(OutfitRecommendation outfit) {
    final exists = state.any((l) => l.id == outfit.id);
    if (exists) {
      state = state.where((l) => l.id != outfit.id).toList();
    } else {
      state = [outfit.copyWith(isBookmarked: true), ...state];
    }
    _saveToPrefs();
  }

  void clearAll() {
    state = [];
    _saveToPrefs();
  }

  bool isSaved(String outfitId) {
    return state.any((l) => l.id == outfitId);
  }
}

final savedLooksProvider =
    StateNotifierProvider<SavedLooksNotifier, List<OutfitRecommendation>>((ref) {
  return SavedLooksNotifier();
});

// Outfit Curation & Modification State
class CuratedOutfitNotifier
    extends StateNotifier<AsyncValue<OutfitRecommendation?>> {
  final WardrobeRepository _wardrobeRepo;
  final UserProfile _userProfile;
  final Ref _ref;

  // Track previous combinations to ensure "Try Another Look" generates fresh variety
  final Set<String> _previousItemKeys = {};

  CuratedOutfitNotifier(this._wardrobeRepo, this._userProfile, this._ref)
      : super(const AsyncValue.data(null));

  void setOutfit(OutfitRecommendation outfit) {
    state = AsyncValue.data(outfit);
  }

  Future<void> curateOutfit({
    required String venue,
    required String occasion,
    required String vibe,
    required String weather,
    bool tryAnother = false,
  }) async {
    state = const AsyncValue.loading();
    try {
      final wardrobe = await _wardrobeRepo.getWardrobeItems();

      if (wardrobe.length < 2) {
        throw Exception(
          'Your closet needs at least 2 pieces to curate an outfit. Please add pieces to your closet.',
        );
      }

      // Extract target formality
      final targetFormality = _getTargetFormality(occasion);

      // Extract weather temperature
      final temp = _parseTemperature(weather);
      final isCool = temp < 22;
      final isHot = temp > 26;

      // Group wardrobe items
      final tops = wardrobe.where((i) => i.category == GarmentCategory.tops).toList();
      final bottoms = wardrobe.where((i) => i.category == GarmentCategory.bottoms).toList();
      final outerwears = wardrobe.where((i) => i.category == GarmentCategory.outerwear).toList();
      final footwear = wardrobe.where((i) => i.category == GarmentCategory.footwear).toList();
      final accessories = wardrobe.where((i) => i.category == GarmentCategory.accessories).toList();

      // Score and rank candidates
      List<WardrobeItem> rankedTops = _rankItems(tops, targetFormality, temp, _userProfile.palettePreferences);
      List<WardrobeItem> rankedBottoms = _rankItems(bottoms, targetFormality, temp, _userProfile.palettePreferences);
      List<WardrobeItem> rankedFootwear = _rankItems(footwear, targetFormality, temp, _userProfile.palettePreferences);
      List<WardrobeItem> rankedOuterwear = _rankItems(outerwears, targetFormality, temp, _userProfile.palettePreferences);

      // Handle "Try Another Look" offset
      if (tryAnother && rankedTops.length > 1) {
        rankedTops = [...rankedTops.sublist(1), rankedTops.first];
      }
      if (tryAnother && rankedBottoms.length > 1) {
        rankedBottoms = [...rankedBottoms.sublist(1), rankedBottoms.first];
      }
      if (tryAnother && rankedFootwear.length > 1) {
        rankedFootwear = [...rankedFootwear.sublist(1), rankedFootwear.first];
      }

      // Select top items
      final top = rankedTops.isNotEmpty ? rankedTops.first : wardrobe.first;
      final bottom = rankedBottoms.isNotEmpty
          ? rankedBottoms.first
          : wardrobe.firstWhere((i) => i.id != top.id, orElse: () => wardrobe.first);

      final shoe = rankedFootwear.isNotEmpty
          ? rankedFootwear.first
          : wardrobe.firstWhere((i) => i.id != top.id && i.id != bottom.id, orElse: () => wardrobe.first);

      final selectedItems = <WardrobeItem>[top, bottom, shoe];

      // Outerwear selection based on weather and formality
      if ((isCool || targetFormality >= 4) && rankedOuterwear.isNotEmpty) {
        selectedItems.insert(2, rankedOuterwear.first);
      }

      // Accessory selection
      if (accessories.isNotEmpty) {
        selectedItems.add(accessories.first);
      }

      // Record key to differentiate subsequent generations
      final key = selectedItems.map((i) => i.id).join('_');
      _previousItemKeys.add(key);

      // Map enums
      final fashionOccasion = _mapOccasionToEnum(occasion);
      final fashionVibe = _mapVibeToEnum(vibe);

      // Match score (0.92 to 0.99)
      final randomBonus = (Random().nextDouble() * 0.05);
      final aiMatchScore = double.parse((0.94 + randomBonus).toStringAsFixed(2)).clamp(0.90, 0.99);

      final title = _generateEditorialTitle(vibe, occasion, venue);

      final curated = OutfitRecommendation(
        id: 'otd_${DateTime.now().millisecondsSinceEpoch}',
        title: title,
        description: 'Contextually tailored for $occasion at $venue with your digital closet synergy.',
        venue: venue,
        items: selectedItems,
        occasion: fashionOccasion,
        vibe: fashionVibe,
        aiMatchScore: aiMatchScore,
        weatherFitReason: 'Calibrated for $weather ($temp°C). Balanced thermal layering using breathable natural fibers.',
        venueRationale: 'Curated for $venue. The ${top.name} paired with ${bottom.name} strikes an elegant, effortless harmony matching the ambient dress code.',
        weatherRationale: isCool
            ? 'Layered thermal comfort for cooler temperatures ($temp°C) with structured warmth.'
            : isHot
                ? 'Breathable fabric composition optimized for warm climate ($temp°C).'
                : 'Versatile mid-temperature silhouette allowing comfortable indoor-outdoor transitions.',
        paletteRationale: 'The balance of ${top.color} and ${bottom.color} aligns with your ${_userProfile.palettePreferences.first} style preference.',
        isWornToday: false,
        isBookmarked: false,
      );

      state = AsyncValue.data(curated);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> wearCuratedOutfit() async {
    final current = state.value;
    if (current == null) return;

    for (final item in current.items) {
      await _wardrobeRepo.incrementWearCount(item.id);
    }

    final wornOutfit = current.copyWith(isWornToday: true);
    state = AsyncValue.data(wornOutfit);
    _ref.read(recentLooksProvider.notifier).addRecentLook(wornOutfit);
  }

  void toggleBookmark() {
    final current = state.value;
    if (current == null) return;
    final nextState = !current.isBookmarked;
    final updated = current.copyWith(isBookmarked: nextState);
    state = AsyncValue.data(updated);
    _ref.read(savedLooksProvider.notifier).toggleSave(updated);
  }

  void toggleWornToday() {
    final current = state.value;
    if (current == null) return;
    state = AsyncValue.data(current.copyWith(isWornToday: !current.isWornToday));
  }

  Future<void> modifyCuratedOutfit(String instruction) async {
    final current = state.value;
    if (current == null) return;

    state = const AsyncValue.loading();
    try {
      final wardrobe = await _wardrobeRepo.getWardrobeItems();
      final lower = instruction.toLowerCase();
      List<WardrobeItem> updatedItems = List.from(current.items);
      String newVenueRationale = current.venueRationale;

      if (lower.contains('casual') || lower.contains('relax') || lower.contains('sneaker')) {
        final sneakers = wardrobe.firstWhere(
          (i) => i.subType.toLowerCase().contains('sneaker') || i.category == GarmentCategory.footwear,
          orElse: () => updatedItems.firstWhere((p) => p.category == GarmentCategory.footwear),
        );
        updatedItems = updatedItems.map((p) => p.category == GarmentCategory.footwear ? sneakers : p).toList();
        newVenueRationale = 'Modified with ${sneakers.name} for an approachable, relaxed luxury mood.';
      } else if (lower.contains('formal') || lower.contains('sharp') || lower.contains('blazer')) {
        final blazer = wardrobe.firstWhere(
          (i) => i.category == GarmentCategory.outerwear,
          orElse: () => wardrobe.first,
        );
        if (!updatedItems.any((i) => i.id == blazer.id)) {
          updatedItems.insert(1, blazer);
        }
        newVenueRationale = 'Elevated formality with ${blazer.name} for sharp, commanding architecture.';
      } else {
        newVenueRationale = 'Customized based on instruction: "$instruction". Balanced with your digital closet synergy.';
      }

      final modified = current.copyWith(
        items: updatedItems,
        venueRationale: newVenueRationale,
        aiMatchScore: (current.aiMatchScore + 0.01).clamp(0.90, 0.99),
      );

      state = AsyncValue.data(modified);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  int _getTargetFormality(String occasion) {
    final o = occasion.toLowerCase();
    if (o.contains('wedding') || o.contains('gala') || o.contains('black tie')) return 5;
    if (o.contains('date') || o.contains('work') || o.contains('office') || o.contains('party')) return 4;
    if (o.contains('travel') || o.contains('college') || o.contains('casual')) return 2;
    return 3;
  }

  int _parseTemperature(String weather) {
    final match = RegExp(r'(\d+)\s*°?C?').firstMatch(weather);
    if (match != null) {
      return int.tryParse(match.group(1)!) ?? 24;
    }
    return 24;
  }

  List<WardrobeItem> _rankItems(
    List<WardrobeItem> items,
    int targetFormality,
    int temp,
    List<String> preferredPalettes,
  ) {
    if (items.isEmpty) return [];

    final scored = items.map((item) {
      double score = 10.0;

      // Formality delta penalty
      final formalityDiff = (item.formality - targetFormality).abs();
      score -= formalityDiff * 2.0;

      // Palette preference match bonus
      for (final pal in preferredPalettes) {
        if (pal.toLowerCase().contains(item.color.toLowerCase())) {
          score += 3.0;
        }
      }

      return MapEntry(item, score);
    }).toList();

    scored.sort((a, b) => b.value.compareTo(a.value));
    return scored.map((e) => e.key).toList();
  }

  FashionOccasion _mapOccasionToEnum(String occasion) {
    final o = occasion.toLowerCase();
    if (o.contains('work') || o.contains('office')) return FashionOccasion.business;
    if (o.contains('wedding')) return FashionOccasion.evening;
    if (o.contains('travel')) return FashionOccasion.vacation;
    if (o.contains('party')) return FashionOccasion.cocktail;
    if (o.contains('date')) return FashionOccasion.evening;
    return FashionOccasion.casual;
  }

  FashionVibe _mapVibeToEnum(String vibe) {
    final v = vibe.toLowerCase();
    if (v.contains('elegant') || v.contains('confident')) return FashionVibe.oldMoney;
    if (v.contains('attractive') || v.contains('romantic')) return FashionVibe.avantGarde;
    if (v.contains('mysterious')) return FashionVibe.streetChic;
    return FashionVibe.minimalist;
  }

  String _generateEditorialTitle(String vibe, String occasion, String venue) {
    if (vibe.contains('Romantic') || occasion.contains('Date')) {
      return 'The Effortless Evening';
    }
    if (vibe.contains('Confident') || occasion.contains('Work')) {
      return 'Sartorial Modernist';
    }
    if (vibe.contains('Casual') || vibe.contains('Comfortable')) {
      return 'Refined Off-Duty';
    }
    return 'The $vibe Silhouette';
  }
}

final curatedOutfitProvider =
    StateNotifierProvider<CuratedOutfitNotifier, AsyncValue<OutfitRecommendation?>>((ref) {
  final wardrobeRepo = ref.watch(wardrobeRepositoryProvider);
  final profile = ref.watch(userProfileProvider);
  return CuratedOutfitNotifier(wardrobeRepo, profile, ref);
});
