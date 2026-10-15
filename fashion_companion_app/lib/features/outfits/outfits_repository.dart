import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../shared/models/fashion_models.dart';
import '../wardrobe/wardrobe_repository.dart';

abstract class OutfitsRepository {
  Future<List<OutfitRecommendation>> getDailyRecommendations();
  Future<OutfitRecommendation> generateOutfit({
    required FashionOccasion occasion,
    required FashionVibe vibe,
    required String weatherCondition,
  });
}

class MockOutfitsRepository implements OutfitsRepository {
  final WardrobeRepository _wardrobeRepo;

  MockOutfitsRepository(this._wardrobeRepo);

  @override
  Future<List<OutfitRecommendation>> getDailyRecommendations() async {
    final wardrobe = await _wardrobeRepo.getWardrobeItems();
    
    // Curated combinations from the closet
    return [
      OutfitRecommendation(
        id: 'outfit_1',
        title: 'The Parisian Minimalist',
        description: 'Understated elegance balancing structured wool tailoring with soft fluid silk. Impeccably suited for transitional temperature changes.',
        items: wardrobe.take(4).toList(),
        occasion: FashionOccasion.business,
        vibe: FashionVibe.minimalist,
        aiMatchScore: 0.98,
        weatherFitReason: 'Optimized for 21°C Mild Autumn. Light breathable silk base layer with wool insulation for evening breezes.',
        isWornToday: false,
      ),
      OutfitRecommendation(
        id: 'outfit_2',
        title: 'Old Money Leisure',
        description: 'Tonal cashmere knitwear paired with wide-leg trousers and burnished leather accents. Effortless quiet luxury.',
        items: wardrobe.reversed.take(3).toList(),
        occasion: FashionOccasion.casual,
        vibe: FashionVibe.oldMoney,
        aiMatchScore: 0.94,
        weatherFitReason: 'Superb thermal regulation. Warm without bulk, suited for indoor café culture and relaxed meetings.',
        isWornToday: false,
      ),
      OutfitRecommendation(
        id: 'outfit_3',
        title: 'Gallery Night Cocktail',
        description: 'Structured noir blazer worn over monochromatic tones with lug-sole statement footwear for high-fashion contrast.',
        items: [wardrobe[0], wardrobe[2], wardrobe[3], wardrobe[5]],
        occasion: FashionOccasion.cocktail,
        vibe: FashionVibe.streetChic,
        aiMatchScore: 0.91,
        weatherFitReason: 'Evening weather approved. Protective outerwear that retains sharp silhouettes indoors.',
        isWornToday: false,
      ),
    ];
  }

  @override
  Future<OutfitRecommendation> generateOutfit({
    required FashionOccasion occasion,
    required FashionVibe vibe,
    required String weatherCondition,
  }) async {
    final wardrobe = await _wardrobeRepo.getWardrobeItems();
    await Future.delayed(const Duration(milliseconds: 800)); // Simulate AI neural inference
    return OutfitRecommendation(
      id: 'ai_gen_${DateTime.now().millisecondsSinceEpoch}',
      title: 'Curated ${vibe.name.toUpperCase()} Look',
      description: 'Algorithmically synthesized to align with your personal color palette and expected ${occasion.name} ambiance.',
      items: (wardrobe..shuffle()).take(3).toList(),
      occasion: occasion,
      vibe: vibe,
      aiMatchScore: 0.96,
      weatherFitReason: 'Harmonized for $weatherCondition. Layered configuration allows agile temperature adjustments.',
    );
  }
}

final outfitsRepositoryProvider = Provider<OutfitsRepository>((ref) {
  final wardrobeRepo = ref.watch(wardrobeRepositoryProvider);
  return MockOutfitsRepository(wardrobeRepo);
});

class OutfitsNotifier extends StateNotifier<AsyncValue<List<OutfitRecommendation>>> {
  final OutfitsRepository _repo;
  final WardrobeNotifier _wardrobeNotifier;

  OutfitsNotifier(this._repo, this._wardrobeNotifier) : super(const AsyncValue.loading()) {
    loadRecommendations();
  }

  Future<void> loadRecommendations() async {
    try {
      state = const AsyncValue.loading();
      final list = await _repo.getDailyRecommendations();
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> logAsWornToday(String outfitId) async {
    state.whenData((outfits) {
      final updated = outfits.map((outfit) {
        if (outfit.id == outfitId) {
          // Increment wear counts on items
          for (final item in outfit.items) {
            _wardrobeNotifier.markWorn(item.id);
          }
          return outfit.copyWith(isWornToday: true);
        }
        return outfit.copyWith(isWornToday: false);
      }).toList();
      state = AsyncValue.data(updated);
    });
  }

  Future<void> toggleBookmark(String outfitId) async {
    state.whenData((outfits) {
      final updated = outfits.map((o) {
        if (o.id == outfitId) {
          return o.copyWith(isBookmarked: !o.isBookmarked);
        }
        return o;
      }).toList();
      state = AsyncValue.data(updated);
    });
  }
}

final outfitsProvider = StateNotifierProvider<OutfitsNotifier, AsyncValue<List<OutfitRecommendation>>>((ref) {
  final repo = ref.watch(outfitsRepositoryProvider);
  final wardrobeNotifier = ref.watch(wardrobeProvider.notifier);
  return OutfitsNotifier(repo, wardrobeNotifier);
});
