import 'dart:convert';
import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../shared/models/fashion_models.dart';

abstract class WardrobeRepository {
  Future<List<WardrobeItem>> getWardrobeItems();
  Future<void> addWardrobeItem(WardrobeItem item);
  Future<void> updateWardrobeItem(WardrobeItem item);
  Future<void> deleteWardrobeItem(String id);
  Future<void> incrementWearCount(String id);
  Future<WardrobeItem?> getWardrobeItemById(String id);
  Future<void> resetToDefaults();
}

class MockWardrobeRepository implements WardrobeRepository {
  static const String _keyWardrobeInitialized = 'otd_wardrobe_initialized';
  static const String _keyWardrobeItems = 'otd_wardrobe_items';

  bool _isLoaded = false;
  final List<WardrobeItem> _items = [];

  static final List<WardrobeItem> _defaultDemoWardrobe = [
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
      color: 'Sand Beige',
      fabric: '100% Normandy Linen',
      fit: 'Relaxed',
      formality: 2,
      season: 'Spring / Summer',
      icon: '👕',
      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      timesWorn: 34,
      purchasePrice: 160.0,
      addedDate: DateTime.now().subtract(const Duration(days: 180)),
    ),
    WardrobeItem(
      id: 't4',
      name: 'Mercerized Pima Cotton T-Shirt',
      subType: 'Crewneck Tee',
      brand: 'Sunspel',
      category: GarmentCategory.tops,
      color: 'Midnight Black',
      fabric: '2-Ply Pima Cotton',
      fit: 'Tailored',
      formality: 1,
      season: 'All Season',
      icon: '👕',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      timesWorn: 52,
      purchasePrice: 90.0,
      addedDate: DateTime.now().subtract(const Duration(days: 240)),
    ),

    // Bottoms
    WardrobeItem(
      id: 'b1',
      name: 'Forward-Pleat Flannel Trousers',
      subType: 'Pleated Trousers',
      brand: 'Savile Row Bespoke',
      category: GarmentCategory.bottoms,
      color: 'Charcoal Grey',
      fabric: 'Super 120s Wool Flannel',
      fit: 'High-Rise Tapered',
      formality: 4,
      season: 'Autumn / Winter',
      icon: '👖',
      imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      timesWorn: 18,
      purchasePrice: 210.0,
      addedDate: DateTime.now().subtract(const Duration(days: 60)),
    ),
    WardrobeItem(
      id: 'b2',
      name: 'Brushed Cotton Gurkha Trousers',
      subType: 'Tailored Chinos',
      brand: 'Rota Pantaloni',
      category: GarmentCategory.bottoms,
      color: 'Tobacco Khaki',
      fabric: 'Italian Brushed Drill',
      fit: 'Tailored Straight',
      formality: 3,
      season: 'All Season',
      icon: '👖',
      imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
      timesWorn: 31,
      purchasePrice: 175.0,
      addedDate: DateTime.now().subtract(const Duration(days: 150)),
    ),
    WardrobeItem(
      id: 'b3',
      name: '13.5oz Clean Japanese Raw Denim',
      subType: 'Selvedge Denim',
      brand: 'Kuro',
      category: GarmentCategory.bottoms,
      color: 'Deep Indigo',
      fabric: 'Kurabo Mill Selvedge',
      fit: 'Slim Straight',
      formality: 2,
      season: 'All Season',
      icon: '👖',
      imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      timesWorn: 48,
      purchasePrice: 195.0,
      addedDate: DateTime.now().subtract(const Duration(days: 300)),
    ),

    // Outerwear
    WardrobeItem(
      id: 'o1',
      name: 'Unstructured Hopsack Navy Blazer',
      subType: 'Double-Breasted Blazer',
      brand: 'Cesare Attolini',
      category: GarmentCategory.outerwear,
      color: 'Midnight Navy',
      fabric: 'High-Twist Wool Hopsack',
      fit: 'Neapolitan Soft Shoulder',
      formality: 4,
      season: 'All Season',
      icon: '🧥',
      imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      timesWorn: 14,
      purchasePrice: 420.0,
      addedDate: DateTime.now().subtract(const Duration(days: 45)),
    ),
    WardrobeItem(
      id: 'o2',
      name: 'Belted Cashmere Trench Overcoat',
      subType: 'Belted Coat',
      brand: 'Berluti',
      category: GarmentCategory.outerwear,
      color: 'Camel Brown',
      fabric: 'Double-Faced Cashmere',
      fit: 'Oversized Drape',
      formality: 5,
      season: 'Winter',
      icon: '🧥',
      imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80',
      timesWorn: 8,
      purchasePrice: 650.0,
      addedDate: DateTime.now().subtract(const Duration(days: 200)),
    ),
    WardrobeItem(
      id: 'o3',
      name: 'Shearling-Lined Suede Overshirt',
      subType: 'Suede Jacket',
      brand: 'Zegna',
      category: GarmentCategory.outerwear,
      color: 'Espresso Suede',
      fabric: 'Calf Suede & Shearling',
      fit: 'Boxy Casual',
      formality: 3,
      season: 'Autumn / Winter',
      icon: '🧥',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      timesWorn: 19,
      purchasePrice: 380.0,
      addedDate: DateTime.now().subtract(const Duration(days: 100)),
    ),

    // Footwear
    WardrobeItem(
      id: 'f1',
      name: 'Burnished Museum Calf Loafers',
      subType: 'Penny Loafers',
      brand: 'John Lobb',
      category: GarmentCategory.footwear,
      color: 'Burgundy Museum',
      fabric: 'Full-Grain Boxcalf',
      fit: 'Standard E',
      formality: 4,
      season: 'All Season',
      icon: '👞',
      imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
      timesWorn: 26,
      purchasePrice: 310.0,
      addedDate: DateTime.now().subtract(const Duration(days: 80)),
    ),
    WardrobeItem(
      id: 'f2',
      name: 'Chocolate Suede Tassel Slip-ons',
      subType: 'Belgian Loafers',
      brand: 'Baudoin & Lange',
      category: GarmentCategory.footwear,
      color: 'Chocolate Brown',
      fabric: 'Unlined French Kid Suede',
      fit: 'Glove Fit',
      formality: 3,
      season: 'Spring / Summer / Autumn',
      icon: '👞',
      imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
      timesWorn: 38,
      purchasePrice: 240.0,
      addedDate: DateTime.now().subtract(const Duration(days: 160)),
    ),
    WardrobeItem(
      id: 'f3',
      name: 'Minimalist Nappa Leather Low-Top',
      subType: 'Clean Sneaker',
      brand: 'Common Projects',
      category: GarmentCategory.footwear,
      color: 'Triple White',
      fabric: 'Italian Nappa Leather',
      fit: 'Narrow Clean',
      formality: 2,
      season: 'All Season',
      icon: '👟',
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      timesWorn: 64,
      purchasePrice: 190.0,
      addedDate: DateTime.now().subtract(const Duration(days: 320)),
    ),
    WardrobeItem(
      id: 'f4',
      name: 'Hand-Patinated Glazed Leather Boots',
      subType: 'Chelsea Boots',
      brand: 'Berluti',
      category: GarmentCategory.footwear,
      color: 'Dark Amber',
      fabric: 'Venezia Calf Leather',
      fit: 'Ankle Hugging',
      formality: 4,
      season: 'Autumn / Winter',
      icon: '🥾',
      imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
      timesWorn: 16,
      purchasePrice: 480.0,
      addedDate: DateTime.now().subtract(const Duration(days: 75)),
    ),

    // Accessories
    WardrobeItem(
      id: 'a1',
      name: 'Rose Gold Ultra-Thin Mechanical',
      subType: 'Dress Watch',
      brand: 'A. Lange & Söhne',
      category: GarmentCategory.accessories,
      color: 'Rose Gold & Alligator',
      fabric: '18k Rose Gold, Leather',
      fit: '38mm Case',
      formality: 5,
      season: 'All Season',
      icon: '⌚',
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      timesWorn: 42,
      purchasePrice: 920.0,
      addedDate: DateTime.now().subtract(const Duration(days: 400)),
    ),
    WardrobeItem(
      id: 'a2',
      name: 'Monogram Reversible Textured Belt',
      subType: 'Leather Belt',
      brand: 'Hermès',
      category: GarmentCategory.accessories,
      color: 'Gold & Noir',
      fabric: 'Togo & Box Calf',
      fit: '32mm Width',
      formality: 4,
      season: 'All Season',
      icon: '👔',
      imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80',
      timesWorn: 55,
      purchasePrice: 320.0,
      addedDate: DateTime.now().subtract(const Duration(days: 350)),
    ),
  ];

  Future<void> _ensureLoaded() async {
    if (_isLoaded) return;
    try {
      final prefs = await SharedPreferences.getInstance();
      final isInit = prefs.getBool(_keyWardrobeInitialized) ?? false;
      final savedData = prefs.getString(_keyWardrobeItems);

      if (isInit && savedData != null) {
        final List<dynamic> jsonList = jsonDecode(savedData);
        _items.clear();
        _items.addAll(
          jsonList.map((j) => WardrobeItem.fromJson(j as Map<String, dynamic>)),
        );
      } else {
        // Seed initial demo items once only
        _items.clear();
        _items.addAll(_defaultDemoWardrobe);
        await _saveToPrefs(prefs);
        await prefs.setBool(_keyWardrobeInitialized, true);
      }
    } catch (_) {
      if (_items.isEmpty) {
        _items.addAll(_defaultDemoWardrobe);
      }
    }
    _isLoaded = true;
  }

  Future<void> _saveToPrefs([SharedPreferences? existingPrefs]) async {
    try {
      final prefs = existingPrefs ?? await SharedPreferences.getInstance();
      final jsonString = jsonEncode(_items.map((i) => i.toJson()).toList());
      await prefs.setString(_keyWardrobeItems, jsonString);
    } catch (_) {}
  }

  @override
  Future<List<WardrobeItem>> getWardrobeItems() async {
    await _ensureLoaded();
    return List.from(_items);
  }

  @override
  Future<void> addWardrobeItem(WardrobeItem item) async {
    await _ensureLoaded();
    _items.insert(0, item);
    await _saveToPrefs();
  }

  @override
  Future<void> updateWardrobeItem(WardrobeItem item) async {
    await _ensureLoaded();
    final index = _items.indexWhere((i) => i.id == item.id);
    if (index != -1) {
      _items[index] = item;
      await _saveToPrefs();
    }
  }

  @override
  Future<void> deleteWardrobeItem(String id) async {
    await _ensureLoaded();
    final index = _items.indexWhere((item) => item.id == id);
    if (index != -1) {
      final item = _items[index];
      if (item.imageUrl.isNotEmpty && !item.imageUrl.startsWith('http') && !item.imageUrl.startsWith('assets/')) {
        try {
          final file = File(item.imageUrl);
          if (file.existsSync()) {
            await file.delete();
          }
        } catch (_) {}
      }
      _items.removeAt(index);
      await _saveToPrefs();
    }
  }

  @override
  Future<WardrobeItem?> getWardrobeItemById(String id) async {
    await _ensureLoaded();
    try {
      return _items.firstWhere((i) => i.id == id);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<void> resetToDefaults() async {
    await _ensureLoaded();
    _items.clear();
    _items.addAll(_defaultDemoWardrobe);
    await _saveToPrefs();
  }

  @override
  Future<void> incrementWearCount(String id) async {
    await _ensureLoaded();
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
      await _saveToPrefs();
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

  Future<void> updateItem(WardrobeItem item) async {
    await _repo.updateWardrobeItem(item);
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

  Future<void> resetToDefaults() async {
    await _repo.resetToDefaults();
    await loadItems();
  }
}

final wardrobeProvider =
    StateNotifierProvider<WardrobeNotifier, AsyncValue<List<WardrobeItem>>>((ref) {
  final repo = ref.watch(wardrobeRepositoryProvider);
  return WardrobeNotifier(repo);
});

final selectedCategoryProvider = StateProvider<GarmentCategory?>((ref) => null);
