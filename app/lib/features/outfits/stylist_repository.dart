import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../shared/models/fashion_models.dart';
import '../wardrobe/wardrobe_repository.dart';
import 'outfits_repository.dart';

class StylistMessage {
  final String id;
  final bool isUser;
  final String text;
  final OutfitRecommendation? outfit;
  final DateTime timestamp;
  final List<String> suggestions;

  const StylistMessage({
    required this.id,
    required this.isUser,
    required this.text,
    this.outfit,
    required this.timestamp,
    this.suggestions = const [],
  });
}

class StylistResponse {
  final String text;
  final OutfitRecommendation? updatedOutfit;
  final List<String> suggestions;

  const StylistResponse({
    required this.text,
    this.updatedOutfit,
    this.suggestions = const [],
  });
}

abstract class StylistRepository {
  Future<StylistResponse> processInstruction({
    required String userMessage,
    required OutfitRecommendation? currentOutfit,
    required List<WardrobeItem> wardrobe,
    required UserProfile profile,
  });
}

class MockStylistRepository implements StylistRepository {
  @override
  Future<StylistResponse> processInstruction({
    required String userMessage,
    required OutfitRecommendation? currentOutfit,
    required List<WardrobeItem> wardrobe,
    required UserProfile profile,
  }) async {
    // Simulated natural language processing delay
    await Future.delayed(const Duration(milliseconds: 650));

    if (wardrobe.length < 2) {
      return const StylistResponse(
        text: "Your digital closet currently has fewer than 2 garments. Please add a few tops, bottoms, and shoes to your closet so I can curate and refine outfits for you.",
        suggestions: ["Add a piece to closet"],
      );
    }

    final lower = userMessage.toLowerCase();

    // If there is no active outfit, curate a new starting look
    OutfitRecommendation active = currentOutfit ??
        OutfitRecommendation(
          id: 'stylist_look_${DateTime.now().millisecondsSinceEpoch}',
          title: 'The Contemporary Essential',
          description: 'A balanced signature look curated for your style archetype.',
          venue: 'Studio Styling',
          items: [
            wardrobe.firstWhere((i) => i.category == GarmentCategory.tops, orElse: () => wardrobe.first),
            wardrobe.firstWhere((i) => i.category == GarmentCategory.bottoms, orElse: () => wardrobe.last),
            wardrobe.firstWhere((i) => i.category == GarmentCategory.footwear, orElse: () => wardrobe.first),
          ],
          occasion: FashionOccasion.casual,
          vibe: FashionVibe.minimalist,
          aiMatchScore: 0.94,
          weatherFitReason: 'Tailored for versatile indoor and outdoor comfort.',
        );

    List<WardrobeItem> updatedItems = List.from(active.items);
    String responseText = '';
    final defaultSuggestions = <String>[
      'Make it more formal',
      'Show with sneakers',
      'Swap the shoes',
      'No jeans',
    ];

    if (lower.contains('formal') || lower.contains('sharp') || lower.contains('blazer')) {
      // Find outerwear or sartorial blazer
      final blazer = wardrobe.where((i) => i.category == GarmentCategory.outerwear).firstOrNull ??
          wardrobe.firstWhere((i) => i.formality >= 4, orElse: () => wardrobe.first);

      if (!updatedItems.any((i) => i.id == blazer.id)) {
        updatedItems.insert(1, blazer);
      }

      // If shoes are casual, upgrade to formal shoes
      final formalShoes = wardrobe.firstWhere(
        (i) => i.category == GarmentCategory.footwear && i.formality >= 3,
        orElse: () => updatedItems.firstWhere((i) => i.category == GarmentCategory.footwear, orElse: () => wardrobe.first),
      );
      updatedItems = updatedItems.map((p) => p.category == GarmentCategory.footwear ? formalShoes : p).toList();

      responseText = "I've structured this ensemble with a tailored silhouette, layering the ${blazer.name} and elevated footwear for a sharper sartorial presence.";
    } else if (lower.contains('sneaker') || lower.contains('casual') || lower.contains('relax')) {
      // Find sneakers / casual footwear
      final sneakers = wardrobe.firstWhere(
        (i) => i.category == GarmentCategory.footwear && (i.subType.toLowerCase().contains('sneaker') || i.formality <= 2),
        orElse: () => updatedItems.firstWhere((i) => i.category == GarmentCategory.footwear, orElse: () => wardrobe.first),
      );
      updatedItems = updatedItems.map((p) => p.category == GarmentCategory.footwear ? sneakers : p).toList();

      // Remove heavy outerwear if present
      updatedItems.removeWhere((i) => i.category == GarmentCategory.outerwear && i.formality >= 4);

      responseText = "Swapped in the ${sneakers.name} for an effortless, relaxed weekend silhouette that still honors your minimal aesthetic.";
    } else if (lower.contains('shoes') || lower.contains('footwear')) {
      // Swap to alternative shoes in wardrobe
      final currentShoe = updatedItems.where((i) => i.category == GarmentCategory.footwear).firstOrNull;
      final altShoes = wardrobe.firstWhere(
        (i) => i.category == GarmentCategory.footwear && (currentShoe == null || i.id != currentShoe.id),
        orElse: () => currentShoe ?? wardrobe.first,
      );
      updatedItems = updatedItems.map((p) => p.category == GarmentCategory.footwear ? altShoes : p).toList();

      responseText = "Refreshed the look with ${altShoes.name} to alter the formality balance and stance.";
    } else if (lower.contains('no jeans') || lower.contains('trousers') || lower.contains('chinos')) {
      // Replace bottom with non-denim trousers
      final trousers = wardrobe.firstWhere(
        (i) => i.category == GarmentCategory.bottoms && !i.subType.toLowerCase().contains('jean') && !i.fabric.toLowerCase().contains('denim'),
        orElse: () => updatedItems.firstWhere((i) => i.category == GarmentCategory.bottoms, orElse: () => wardrobe.first),
      );
      updatedItems = updatedItems.map((p) => p.category == GarmentCategory.bottoms ? trousers : p).toList();

      responseText = "Replaced denim with the ${trousers.name} for a cleaner drape and elevated finish.";
    } else {
      // General styling advice or fine-tune
      final top = wardrobe.firstWhere((i) => i.category == GarmentCategory.tops, orElse: () => wardrobe.first);
      responseText = "Here is a refined configuration incorporating ${top.name} with harmonic neutral tones tailored to your ${profile.preferredFit} preference.";
    }

    final newOutfit = active.copyWith(
      id: 'look_refined_${DateTime.now().millisecondsSinceEpoch}',
      items: updatedItems,
      venueRationale: responseText,
    );

    return StylistResponse(
      text: responseText,
      updatedOutfit: newOutfit,
      suggestions: defaultSuggestions,
    );
  }
}

final stylistRepositoryProvider = Provider<StylistRepository>((ref) {
  return MockStylistRepository();
});

class StylistChatState {
  final List<StylistMessage> messages;
  final bool isThinking;

  const StylistChatState({
    required this.messages,
    this.isThinking = false,
  });

  StylistChatState copyWith({
    List<StylistMessage>? messages,
    bool? isThinking,
  }) {
    return StylistChatState(
      messages: messages ?? this.messages,
      isThinking: isThinking ?? this.isThinking,
    );
  }
}

class StylistChatNotifier extends StateNotifier<StylistChatState> {
  final StylistRepository _repository;
  final Ref _ref;

  StylistChatNotifier(this._repository, this._ref)
      : super(
          StylistChatState(
            messages: [
              StylistMessage(
                id: 'welcome_1',
                isUser: false,
                text: "Hello, I am your personal OTD Stylist. Tell me how you'd like to refine your look today, or tap any suggestion below.",
                timestamp: DateTime.now(),
                suggestions: const [
                  'Make it more formal',
                  'Show with sneakers',
                  'Swap the shoes',
                  'No jeans',
                ],
              ),
            ],
          ),
        );

  Future<void> sendMessage(String text) async {
    final userMsg = StylistMessage(
      id: 'user_${DateTime.now().millisecondsSinceEpoch}',
      isUser: true,
      text: text,
      timestamp: DateTime.now(),
    );

    state = state.copyWith(
      messages: [...state.messages, userMsg],
      isThinking: true,
    );

    final currentOutfit = _ref.read(curatedOutfitProvider).value;
    final wardrobe = await _ref.read(wardrobeRepositoryProvider).getWardrobeItems();
    final profile = _ref.read(userProfileProvider);

    final response = await _repository.processInstruction(
      userMessage: text,
      currentOutfit: currentOutfit,
      wardrobe: wardrobe,
      profile: profile,
    );

    if (response.updatedOutfit != null) {
      _ref.read(curatedOutfitProvider.notifier).setOutfit(response.updatedOutfit!);
    }

    final assistantMsg = StylistMessage(
      id: 'assistant_${DateTime.now().millisecondsSinceEpoch}',
      isUser: false,
      text: response.text,
      outfit: response.updatedOutfit,
      timestamp: DateTime.now(),
      suggestions: response.suggestions,
    );

    state = state.copyWith(
      messages: [...state.messages, assistantMsg],
      isThinking: false,
    );
  }

  void clearChat() {
    state = StylistChatState(
      messages: [
        StylistMessage(
          id: 'welcome_new',
          isUser: false,
          text: "Starting a fresh styling session. How can I assist your wardrobe curation today?",
          timestamp: DateTime.now(),
          suggestions: const [
            'Make it more formal',
            'Show with sneakers',
            'Swap the shoes',
            'No jeans',
          ],
        ),
      ],
      isThinking: false,
    );
  }
}

final stylistChatProvider =
    StateNotifierProvider<StylistChatNotifier, StylistChatState>((ref) {
  final repo = ref.watch(stylistRepositoryProvider);
  return StylistChatNotifier(repo, ref);
});
