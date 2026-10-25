import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../shared/models/fashion_models.dart';
import '../wardrobe/wardrobe_repository.dart';

enum TryOnViewMode {
  myAvatar,
  model,
  both,
}

class TryOnState {
  final TryOnViewMode mode;
  final WardrobeItem? top;
  final WardrobeItem? bottom;
  final WardrobeItem? outerwear;
  final WardrobeItem? footwear;
  final WardrobeItem? accessory;
  final bool isRendering;
  final String statusMessage;

  const TryOnState({
    this.mode = TryOnViewMode.myAvatar,
    this.top,
    this.bottom,
    this.outerwear,
    this.footwear,
    this.accessory,
    this.isRendering = false,
    this.statusMessage = 'Interactive 2D Wardrobe Layer',
  });

  TryOnState copyWith({
    TryOnViewMode? mode,
    WardrobeItem? top,
    WardrobeItem? bottom,
    WardrobeItem? outerwear,
    WardrobeItem? footwear,
    WardrobeItem? accessory,
    bool? isRendering,
    String? statusMessage,
    bool clearOuterwear = false,
    bool clearAccessory = false,
  }) {
    return TryOnState(
      mode: mode ?? this.mode,
      top: top ?? this.top,
      bottom: bottom ?? this.bottom,
      outerwear: clearOuterwear ? null : (outerwear ?? this.outerwear),
      footwear: footwear ?? this.footwear,
      accessory: clearAccessory ? null : (accessory ?? this.accessory),
      isRendering: isRendering ?? this.isRendering,
      statusMessage: statusMessage ?? this.statusMessage,
    );
  }

  List<WardrobeItem> get activeItems {
    final list = <WardrobeItem>[];
    if (top != null) list.add(top!);
    if (bottom != null) list.add(bottom!);
    if (outerwear != null) list.add(outerwear!);
    if (footwear != null) list.add(footwear!);
    if (accessory != null) list.add(accessory!);
    return list;
  }
}

abstract class TryOnRenderer {
  Future<void> renderPreview(TryOnState state);
}

class MockTryOnRenderer implements TryOnRenderer {
  @override
  Future<void> renderPreview(TryOnState state) async {
    // Simulated layered canvas composition delay
    await Future.delayed(const Duration(milliseconds: 300));
  }
}

final tryOnRendererProvider = Provider<TryOnRenderer>((ref) {
  return MockTryOnRenderer();
});

class TryOnNotifier extends StateNotifier<TryOnState> {
  final TryOnRenderer _renderer;
  final WardrobeRepository _wardrobeRepo;

  TryOnRenderer get renderer => _renderer;

  TryOnNotifier(this._renderer, this._wardrobeRepo) : super(const TryOnState()) {
    _initDefaultItems();
  }

  Future<void> _initDefaultItems() async {
    try {
      final items = await _wardrobeRepo.getWardrobeItems();
      if (items.isNotEmpty) {
        final top = items.firstWhere(
          (i) => i.category == GarmentCategory.tops,
          orElse: () => items.first,
        );
        final bottom = items.firstWhere(
          (i) => i.category == GarmentCategory.bottoms,
          orElse: () => items.length > 1 ? items[1] : items.first,
        );
        final shoes = items.firstWhere(
          (i) => i.category == GarmentCategory.footwear,
          orElse: () => items.last,
        );
        final outerwear = items.where((i) => i.category == GarmentCategory.outerwear).firstOrNull;
        final accessory = items.where((i) => i.category == GarmentCategory.accessories).firstOrNull;

        state = state.copyWith(
          top: top,
          bottom: bottom,
          footwear: shoes,
          outerwear: outerwear,
          accessory: accessory,
        );
      }
    } catch (_) {}
  }

  void setMode(TryOnViewMode mode) {
    state = state.copyWith(mode: mode);
  }

  void selectTop(WardrobeItem item) {
    state = state.copyWith(top: item);
  }

  void selectBottom(WardrobeItem item) {
    state = state.copyWith(bottom: item);
  }

  void selectFootwear(WardrobeItem item) {
    state = state.copyWith(footwear: item);
  }

  void selectOuterwear(WardrobeItem? item) {
    if (item == null) {
      state = state.copyWith(clearOuterwear: true);
    } else {
      state = state.copyWith(outerwear: item);
    }
  }

  void selectAccessory(WardrobeItem? item) {
    if (item == null) {
      state = state.copyWith(clearAccessory: true);
    } else {
      state = state.copyWith(accessory: item);
    }
  }

  void loadFromOutfit(OutfitRecommendation outfit) {
    WardrobeItem? top;
    WardrobeItem? bottom;
    WardrobeItem? shoes;
    WardrobeItem? outerwear;
    WardrobeItem? accessory;

    for (final i in outfit.items) {
      switch (i.category) {
        case GarmentCategory.tops:
          top = i;
          break;
        case GarmentCategory.bottoms:
          bottom = i;
          break;
        case GarmentCategory.footwear:
          shoes = i;
          break;
        case GarmentCategory.outerwear:
          outerwear = i;
          break;
        case GarmentCategory.accessories:
          accessory = i;
          break;
        default:
          break;
      }
    }

    state = state.copyWith(
      top: top ?? state.top,
      bottom: bottom ?? state.bottom,
      footwear: shoes ?? state.footwear,
      outerwear: outerwear ?? state.outerwear,
      accessory: accessory ?? state.accessory,
    );
  }
}

final tryOnProvider = StateNotifierProvider<TryOnNotifier, TryOnState>((ref) {
  final renderer = ref.watch(tryOnRendererProvider);
  final repo = ref.watch(wardrobeRepositoryProvider);
  return TryOnNotifier(renderer, repo);
});
