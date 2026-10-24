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
    // Tops
    WardrobeItem(
      id: 't1',
      name: 'Seamless Silk-Cashmere High Neck',
      subType: 'Knit Rollneck',
      brand: 'Brunello Cucinelli',
      category: GarmentCategory.tops,
      color: 'Ivory Cream',
      fabric: '70% Cashmere, 30% Silk',
      fit: 'Regular',
      formality: 3,
      season: 'Autumn / Winter',
      icon: '👕',
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
      timesWorn: 29,
      purchasePrice: 180.0,
      addedDate: DateTime.now().subtract(const Duration(days: 90)),
    ),
    WardrobeItem(
      id: 't2',
      name: 'Sea Island Cotton Button-Down',
      subType: 'Oxford Shirt',
      brand: 'Charvet',
      category: GarmentCategory.tops,
      color: 'French Blue',
      fabric: 'Sea Island 140s Cotton',
      fit: 'Slim',
      formality: 4,
      season: 'All Season',
      icon: '👔',
      imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
      timesWorn: 22,
      purchasePrice: 145.0,
      addedDate: DateTime.now().subtract(const Duration(days: 120)),
    ),
    WardrobeItem(
      id: 't3',
      name: 'Open-Collar Washed Camp Shirt',
      subType: 'Linen Shirt',
      brand: 'Loro Piana',
      category: GarmentCategory.tops,
      color: 'Sand White',
      fabric: 'Pure French Linen',
      fit: 'Relaxed / Tailored',
      formality: 2,
      season: 'Spring / Summer',
      icon: '👕',
      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      timesWorn: 15,
      purchasePrice: 130.0,
      addedDate: DateTime.now().subtract(const Duration(days: 60)),
    ),
    WardrobeItem(
      id: 't4',
      name: 'Mercerized Pima Cotton T-Shirt',
      subType: 'Crewneck Tee',
      brand: 'Sunspel',
      category: GarmentCategory.tops,
      color: 'Jet Black',
      fabric: 'Long-Staple Pima Cotton',
      fit: 'Regular',
      formality: 1,
      season: 'All Season',
      icon: '👕',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      timesWorn: 34,
      purchasePrice: 90.0,
      addedDate: DateTime.now().subtract(const Duration(days: 150)),
    ),

    // Bottoms
    WardrobeItem(
      id: 'b1',
      name: 'Forward-Pleat Flannel Trousers',
      subType: 'Pleated Trousers',
      brand: 'Savile Row Bespoke',
      category: GarmentCategory.bottoms,
      color: 'Flint Charcoal',
      fabric: 'Fox Brothers 370g Flannel',
      fit: 'Relaxed / Tailored',
      formality: 4,
      season: 'Autumn / Winter',
      icon: '👖',
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      timesWorn: 38,
      purchasePrice: 220.0,
      addedDate: DateTime.now().subtract(const Duration(days: 100)),
    ),
    WardrobeItem(
      id: 'b2',
      name: 'Brushed Cotton Gurkha Trousers',
      subType: 'Tailored Chinos',
      brand: 'Rota Pantaloni',
      category: GarmentCategory.bottoms,
      color: 'Warm Caramel',
      fabric: 'Italian Brushed Cotton Twill',
      fit: 'Regular',
      formality: 3,
      season: 'All Season',
      icon: '👖',
      imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
      timesWorn: 26,
      purchasePrice: 175.0,
      addedDate: DateTime.now().subtract(const Duration(days: 80)),
    ),
    WardrobeItem(
      id: 'b3',
      name: '13.5oz Clean Japanese Raw Denim',
      subType: 'Selvedge Denim',
      brand: 'Kuro',
      category: GarmentCategory.bottoms,
      color: 'Deep Indigo',
      fabric: 'Kihada Selvedge Denim',
      fit: 'Regular',
      formality: 2,
      season: 'All Season',
      icon: '👖',
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
      timesWorn: 45,
      purchasePrice: 160.0,
      addedDate: DateTime.now().subtract(const Duration(days: 200)),
    ),

    // Outerwear
    WardrobeItem(
      id: 'o1',
      name: 'Unstructured Hopsack Navy Blazer',
      subType: 'Double-Breasted Blazer',
      brand: 'Cesare Attolini',
      category: GarmentCategory.outerwear,
      color: 'Midnight Navy',
      fabric: 'High-Twist Hopsack Wool',
      fit: 'Regular',
      formality: 4,
      season: 'All Season',
      icon: '🧥',
      imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      timesWorn: 31,
      purchasePrice: 380.0,
      addedDate: DateTime.now().subtract(const Duration(days: 90)),
    ),
    WardrobeItem(
      id: 'o2',
      name: 'Belted Cashmere Trench Overcoat',
      subType: 'Cashmere Overcoat',
      brand: 'Loro Piana',
      category: GarmentCategory.outerwear,
      color: 'Vicuna Camel',
      fabric: 'Double-Faced 100% Cashmere',
      fit: 'Relaxed / Tailored',
      formality: 4,
      season: 'Autumn / Winter',
      icon: '🧥',
      imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      timesWorn: 19,
      purchasePrice: 520.0,
      addedDate: DateTime.now().subtract(const Duration(days: 140)),
    ),
    WardrobeItem(
      id: 'o3',
      name: 'Spanish Lambskin Suede Field Jacket',
      subType: 'Suede Jacket',
      brand: 'Zegna',
      category: GarmentCategory.outerwear,
      color: 'Hazelnut Brown',
      fabric: 'Ultra-Supple Suede Leather',
      fit: 'Regular',
      formality: 3,
      season: 'Autumn / Spring',
      icon: '🧥',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      timesWorn: 24,
      purchasePrice: 420.0,
      addedDate: DateTime.now().subtract(const Duration(days: 70)),
    ),

    // Footwear
    WardrobeItem(
      id: 'f1',
      name: 'Burnished Museum Calf Loafers',
      subType: 'Penny Loafers',
      brand: 'John Lobb',
      category: GarmentCategory.footwear,
      color: 'Espresso Brown',
      fabric: 'French Box Calf Leather',
      fit: 'Regular',
      formality: 4,
      season: 'All Season',
      icon: '👞',
      imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
      timesWorn: 42,
      purchasePrice: 290.0,
      addedDate: DateTime.now().subtract(const Duration(days: 160)),
    ),
    WardrobeItem(
      id: 'f2',
      name: 'Chocolate Suede Tassel Slip-ons',
      subType: 'Belgian Loafers',
      brand: 'Baudoin & Lange',
      category: GarmentCategory.footwear,
      color: 'Dark Chocolate',
      fabric: 'Glove-Soft Kid Suede',
      fit: 'Regular',
      formality: 3,
      season: 'All Season',
      icon: '👞',
      imageUrl: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80',
      timesWorn: 36,
      purchasePrice: 240.0,
      addedDate: DateTime.now().subtract(const Duration(days: 110)),
    ),
    WardrobeItem(
      id: 'f3',
      name: 'Minimalist Nappa Leather Low-Top',
      subType: 'Clean Sneaker',
      brand: 'Common Projects',
      category: GarmentCategory.footwear,
      color: 'Chalk White',
      fabric: 'Italian Nappa Leather',
      fit: 'Regular',
      formality: 2,
      season: 'All Season',
      icon: '👟',
      imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
      timesWorn: 50,
      purchasePrice: 195.0,
      addedDate: DateTime.now().subtract(const Duration(days: 180)),
    ),
    WardrobeItem(
      id: 'f4',
      name: 'Hand-Patinated Glazed Leather Boots',
      subType: 'Chelsea Boots',
      brand: 'Berluti',
      category: GarmentCategory.footwear,
      color: 'Tobacco Patina',
      fabric: 'Venezia Calf Leather',
      fit: 'Regular',
      formality: 3,
      season: 'Autumn / Winter',
      icon: '👢',
      imageUrl: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
      timesWorn: 28,
      purchasePrice: 320.0,
      addedDate: DateTime.now().subtract(const Duration(days: 130)),
    ),

    // Accessories
    WardrobeItem(
      id: 'a1',
      name: 'Rose Gold Ultra-Thin Mechanical',
      subType: 'Dress Watch',
      brand: 'A. Lange & Söhne',
      category: GarmentCategory.accessories,
      color: 'Rose Gold',
      fabric: '18k Pink Gold / Alligator',
      fit: 'Regular',
      formality: 5,
      season: 'All Season',
      icon: '⌚',
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      timesWorn: 60,
      purchasePrice: 650.0,
      addedDate: DateTime.now().subtract(const Duration(days: 300)),
    ),
  ];

  @override
  Future<List<WardrobeItem>> getWardrobeItems() async {
    await Future.delayed(const Duration(milliseconds: 200));
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
        subType: old.subType,
        brand: old.brand,
        color: old.color,
        fabric: old.fabric,
        fit: old.fit,
        formality: old.formality,
        season: old.season,
        imageUrl: old.imageUrl,
        icon: old.icon,
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

  Future<void> deleteItem(String id) async {
    await _repo.deleteWardrobeItem(id);
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
