import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../shared/models/fashion_models.dart';

abstract class WardrobeRepository {
  Future<List<WardrobeItem>> getWardrobeItems();
  Future<void> addWardrobeItem(WardrobeItem item);
  Future<void> deleteWardrobeItem(String id);
  Future<void> incrementWearCount(String id);
}

class MockWardrobeRepository implements WardrobeRepository {
  final List<WardrobeItem> _items = [
    WardrobeItem(
      id: 'w1',
      name: 'Double-Breasted Wool Blazer',
      category: GarmentCategory.outerwear,
      color: 'Noir Charcoal',
      fabric: '100% Merino Wool',
      season: 'Autumn / Winter',
      imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      timesWorn: 14,
      purchasePrice: 280.0,
      addedDate: DateTime.now().subtract(const Duration(days: 90)),
    ),
    WardrobeItem(
      id: 'w2',
      name: 'Oversized Silk Crepe Shirt',
      category: GarmentCategory.tops,
      color: 'Champagne Ivory',
      fabric: 'Mulberry Silk',
      season: 'All Season',
      imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
      timesWorn: 22,
      purchasePrice: 145.0,
      addedDate: DateTime.now().subtract(const Duration(days: 120)),
    ),
    WardrobeItem(
      id: 'w3',
      name: 'Tailored Wide-Leg Trousers',
      category: GarmentCategory.bottoms,
      color: 'Muted Espresso',
      fabric: 'Wool Blend',
      season: 'All Season',
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      timesWorn: 18,
      purchasePrice: 195.0,
      addedDate: DateTime.now().subtract(const Duration(days: 60)),
    ),
    WardrobeItem(
      id: 'w4',
      name: 'Lug-Sole Leather Loafers',
      category: GarmentCategory.footwear,
      color: 'Black Polish',
      fabric: 'Calfskin Leather',
      season: 'All Season',
      imageUrl: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80',
      timesWorn: 29,
      purchasePrice: 220.0,
      addedDate: DateTime.now().subtract(const Duration(days: 180)),
    ),
    WardrobeItem(
      id: 'w5',
      name: 'Ribbed Cashmere Mock-Neck',
      category: GarmentCategory.tops,
      color: 'Oatmeal Heather',
      fabric: '100% Cashmere',
      season: 'Winter',
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
      timesWorn: 11,
      purchasePrice: 160.0,
      addedDate: DateTime.now().subtract(const Duration(days: 45)),
    ),
    WardrobeItem(
      id: 'w6',
      name: 'Structured Leather Crossbody',
      category: GarmentCategory.accessories,
      color: 'Cognac Gold',
      fabric: 'Vegetable-Tanned Leather',
      season: 'All Season',
      imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      timesWorn: 45,
      purchasePrice: 310.0,
      addedDate: DateTime.now().subtract(const Duration(days: 200)),
    ),
  ];

  @override
  Future<List<WardrobeItem>> getWardrobeItems() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return List.from(_items);
  }

  @override
  Future<void> addWardrobeItem(WardrobeItem item) async {
    _items.insert(0, item);
  }

  @override
  Future<void> deleteWardrobeItem(String id) async {
    _items.removeWhere((item) => item.id == id);
  }

  @override
  Future<void> incrementWearCount(String id) async {
    final index = _items.indexWhere((item) => item.id == id);
    if (index != -1) {
      final old = _items[index];
      _items[index] = WardrobeItem(
        id: old.id,
        name: old.name,
        category: old.category,
        color: old.color,
        fabric: old.fabric,
        season: old.season,
        imageUrl: old.imageUrl,
        timesWorn: old.timesWorn + 1,
        purchasePrice: old.purchasePrice,
        addedDate: old.addedDate,
      );
    }
  }
}

final wardrobeRepositoryProvider = Provider<WardrobeRepository>((ref) {
  return MockWardrobeRepository();
});

class WardrobeNotifier extends StateNotifier<AsyncValue<List<WardrobeItem>>> {
  final WardrobeRepository _repo;

  WardrobeNotifier(this._repo) : super(const AsyncValue.loading()) {
    loadItems();
  }

  Future<void> loadItems() async {
    try {
      state = const AsyncValue.loading();
      final items = await _repo.getWardrobeItems();
      state = AsyncValue.data(items);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> addItem(WardrobeItem item) async {
    await _repo.addWardrobeItem(item);
    await loadItems();
  }

  Future<void> markWorn(String id) async {
    await _repo.incrementWearCount(id);
    await loadItems();
  }
}

final wardrobeProvider = StateNotifierProvider<WardrobeNotifier, AsyncValue<List<WardrobeItem>>>((ref) {
  final repo = ref.watch(wardrobeRepositoryProvider);
  return WardrobeNotifier(repo);
});

final selectedCategoryProvider = StateProvider<GarmentCategory?>((ref) => null);
