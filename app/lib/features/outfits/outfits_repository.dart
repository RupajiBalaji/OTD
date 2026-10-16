import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../shared/models/fashion_models.dart';
import '../wardrobe/wardrobe_repository.dart';

// User Profile Provider
class UserProfileNotifier extends StateNotifier<UserProfile> {
  UserProfileNotifier()
      : super(
          UserProfile(
            name: 'Mustafa Ali',
            height: "5'10\" (178 cm)",
            bodyShape: 'Athletic',
            stylePersonas: ['Minimal', 'Classy', 'Smart Casual'],
            preferredFit: 'Slim Fit',
            palettePreferences: ['Black & White', 'Beige & Earth', 'Charcoal & Navy'],
          ),
        );

  void updateProfile(UserProfile newProfile) {
    state = newProfile;
  }
}

final userProfileProvider = StateNotifierProvider<UserProfileNotifier, UserProfile>((ref) {
  return UserProfileNotifier();
});

// Outfit Curation & Modification State
class CuratedOutfitNotifier extends StateNotifier<AsyncValue<OutfitRecommendation?>> {
  final WardrobeRepository _wardrobeRepo;
  final UserProfile _userProfile;

  CuratedOutfitNotifier(this._wardrobeRepo, this._userProfile)
      : super(const AsyncValue.data(null));

  Future<void> curateOutfit({
    required String venue,
    required String occasion,
    required String vibe,
    required String weather,
  }) async {
    state = const AsyncValue.loading();
    try {
      final wardrobe = await _wardrobeRepo.getWardrobeItems();

      // Intelligent match based on context and user's actual clothes
      WardrobeItem top = wardrobe.firstWhere(
        (i) => i.category == GarmentCategory.tops && i.formality >= 3,
        orElse: () => wardrobe.firstWhere((i) => i.category == GarmentCategory.tops),
      );

      WardrobeItem bottom = wardrobe.firstWhere(
        (i) => i.category == GarmentCategory.bottoms && i.formality >= 3,
        orElse: () => wardrobe.firstWhere((i) => i.category == GarmentCategory.bottoms),
      );

      WardrobeItem outerwear = wardrobe.firstWhere(
        (i) => i.category == GarmentCategory.outerwear && i.formality >= 3,
        orElse: () => wardrobe.firstWhere((i) => i.category == GarmentCategory.outerwear),
      );

      WardrobeItem shoe = wardrobe.firstWhere(
        (i) => i.category == GarmentCategory.footwear && i.formality >= 3,
        orElse: () => wardrobe.firstWhere((i) => i.category == GarmentCategory.footwear),
      );

      WardrobeItem acc = wardrobe.firstWhere(
        (i) => i.category == GarmentCategory.accessories,
        orElse: () => wardrobe.first,
      );

      // Context adjustments
      final lowerOccasion = occasion.toLowerCase();
      final lowerVenue = venue.toLowerCase();
      final lowerVibe = vibe.toLowerCase();

      if (lowerVibe.contains('relaxed') || lowerOccasion.contains('casual')) {
        top = wardrobe.firstWhere((i) => i.id == 't3' || i.id == 't4', orElse: () => top);
        bottom = wardrobe.firstWhere((i) => i.id == 'b2' || i.id == 'b3', orElse: () => bottom);
        shoe = wardrobe.firstWhere((i) => i.id == 'f3' || i.id == 'f2', orElse: () => shoe);
      } else if (lowerOccasion.contains('date') || lowerVenue.contains('rooftop')) {
        top = wardrobe.firstWhere((i) => i.id == 't1', orElse: () => top); // Silk-Cashmere High Neck
        bottom = wardrobe.firstWhere((i) => i.id == 'b1', orElse: () => bottom); // Flannel Trousers
        outerwear = wardrobe.firstWhere((i) => i.id == 'o1', orElse: () => outerwear); // Navy Blazer
        shoe = wardrobe.firstWhere((i) => i.id == 'f2', orElse: () => shoe); // Belgian Loafers
      }

      final items = <WardrobeItem>[top, bottom, outerwear, shoe];
      if (acc.category == GarmentCategory.accessories) items.add(acc);

      final curated = OutfitRecommendation(
        id: 'otd_${DateTime.now().millisecondsSinceEpoch}',
        title: '$vibe at $venue',
        description: 'Contextually tailored for $occasion from your verified Digital Closet.',
        venue: venue,
        items: items,
        occasion: FashionOccasion.evening,
        vibe: FashionVibe.oldMoney,
        aiMatchScore: 0.98,
        weatherFitReason: 'Calibrated for $weather. Breathable natural fibers with responsive thermal layering.',
        venueRationale: 'Selected to match the lighting and ambience of $venue. The ${top.name} creates an alluring, refined tone without looking excessively corporate.',
        weatherRationale: 'Layered configuration for $weather. Retains thermal comfort in evening breezes while allowing temperature flexibility.',
        paletteRationale: 'The pairing of ${top.color} against ${bottom.color} creates high-contrast visual balance matching your ${_userProfile.palettePreferences.first} preference.',
        isWornToday: false,
        isBookmarked: false,
      );

      state = AsyncValue.data(curated);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
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

      if (lower.contains('casual') || lower.contains('relax')) {
        // Swap shoe to sneakers
        final sneakers = wardrobe.firstWhere(
          (i) => i.subType.contains('Sneaker') || i.category == GarmentCategory.footwear,
        );
        updatedItems = updatedItems.map((p) => p.category == GarmentCategory.footwear ? sneakers : p).toList();

        // Swap bottoms to chinos or denim
        final chinos = wardrobe.firstWhere(
          (i) => i.id == 'b2' || i.id == 'b3',
          orElse: () => updatedItems.firstWhere((p) => p.category == GarmentCategory.bottoms),
        );
        updatedItems = updatedItems.map((p) => p.category == GarmentCategory.bottoms ? chinos : p).toList();
        newVenueRationale = 'Modified for a more relaxed, approachable casual energy while retaining clean sartorial lines.';
      } else if (lower.contains('shoe') || lower.contains('shoes') || lower.contains('boot')) {
        final currentShoe = updatedItems.firstWhere((p) => p.category == GarmentCategory.footwear);
        final nextShoe = wardrobe.firstWhere(
          (i) => i.category == GarmentCategory.footwear && i.id != currentShoe.id,
          orElse: () => currentShoe,
        );
        updatedItems = updatedItems.map((p) => p.category == GarmentCategory.footwear ? nextShoe : p).toList();
        newVenueRationale = 'Footwear adjusted to ${nextShoe.name} to alter the ground posture and silhouette weight.';
      } else if (lower.contains('no jeans') || lower.contains('dont use jeans') || lower.contains("don't use jeans")) {
        final trousers = wardrobe.firstWhere((i) => i.id == 'b1' || i.id == 'b2');
        updatedItems = updatedItems.map((p) => p.category == GarmentCategory.bottoms ? trousers : p).toList();
        newVenueRationale = 'Substituted denim with tailored ${trousers.name} for elevated sartorial formality.';
      } else if (lower.contains('attractive') || lower.contains('date') || lower.contains('sharp')) {
        final luxuryKnit = wardrobe.firstWhere((i) => i.id == 't1');
        final chelseaBoots = wardrobe.firstWhere((i) => i.id == 'f4' || i.id == 'f2');
        updatedItems = updatedItems.map((p) => p.category == GarmentCategory.tops ? luxuryKnit : p).toList();
        updatedItems = updatedItems.map((p) => p.category == GarmentCategory.footwear ? chelseaBoots : p).toList();
        newVenueRationale = 'Elevated allure: Swapped in ${luxuryKnit.name} and ${chelseaBoots.name} for high-definition evening appeal.';
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

  void toggleBookmark() {
    final current = state.value;
    if (current == null) return;
    state = AsyncValue.data(current.copyWith(isBookmarked: !current.isBookmarked));
  }

  void toggleWornToday() {
    final current = state.value;
    if (current == null) return;
    state = AsyncValue.data(current.copyWith(isWornToday: !current.isWornToday));
  }
}

final curatedOutfitProvider = StateNotifierProvider<CuratedOutfitNotifier, AsyncValue<OutfitRecommendation?>>((ref) {
  final wardrobeRepo = ref.watch(wardrobeRepositoryProvider);
  final profile = ref.watch(userProfileProvider);
  return CuratedOutfitNotifier(wardrobeRepo, profile);
});
