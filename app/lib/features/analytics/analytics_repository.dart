import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../shared/models/fashion_models.dart';
import '../wardrobe/wardrobe_repository.dart';

class WardrobeStats {
  final int totalItems;
  final double totalClosetValue;
  final double averageCostPerWear;
  final double activeUtilizationPercent; // e.g. 78%
  final List<WardrobeGap> detectedGaps;

  WardrobeStats({
    required this.totalItems,
    required this.totalClosetValue,
    required this.averageCostPerWear,
    required this.activeUtilizationPercent,
    required this.detectedGaps,
  });
}

abstract class AnalyticsRepository {
  Future<WardrobeStats> getWardrobeStats();
  Future<void> resolveGap(String gapId);
}

class DynamicAnalyticsRepository implements AnalyticsRepository {
  final WardrobeRepository _wardrobeRepo;
  final Set<String> _resolvedGapIds = {};

  DynamicAnalyticsRepository(this._wardrobeRepo);

  @override
  Future<void> resolveGap(String gapId) async {
    _resolvedGapIds.add(gapId);
  }

  @override
  Future<WardrobeStats> getWardrobeStats() async {
    final items = await _wardrobeRepo.getWardrobeItems();

    if (items.isEmpty) {
      return WardrobeStats(
        totalItems: 0,
        totalClosetValue: 0.0,
        averageCostPerWear: 0.0,
        activeUtilizationPercent: 0.0,
        detectedGaps: [
          WardrobeGap(
            id: 'gap_starter_top',
            title: 'Essential Neutral High-Neck or Shirt',
            reason: 'Your closet has no garments. Add a versatile top to start curating looks.',
            urgency: 'High',
            recommendedCategory: 'Tops',
          ),
          WardrobeGap(
            id: 'gap_starter_bottom',
            title: 'Tailored Trousers or Chinos',
            reason: 'Add a foundation trouser to unlock daytime and evening combinations.',
            urgency: 'High',
            recommendedCategory: 'Bottoms',
          ),
        ],
      );
    }

    final totalItems = items.length;
    final totalClosetValue = items.fold<double>(0.0, (sum, i) => sum + i.purchasePrice);
    final totalWears = items.fold<int>(0, (sum, i) => sum + i.timesWorn);
    final wornCount = items.where((i) => i.timesWorn > 0).length;

    final activeUtilizationPercent = totalItems > 0 ? (wornCount / totalItems * 100.0) : 0.0;
    final averageCostPerWear = totalWears > 0 ? (totalClosetValue / totalWears) : totalClosetValue;

    // Dynamically derive gaps from closet composition
    final gaps = <WardrobeGap>[];

    final hasOuterwear = items.any((i) => i.category == GarmentCategory.outerwear);
    if (!hasOuterwear && !_resolvedGapIds.contains('gap_outerwear')) {
      gaps.add(
        WardrobeGap(
          id: 'gap_outerwear',
          title: 'Camel Double-Breasted Trench or Overcoat',
          reason: 'Transitional outerwear layer needed for cool 12°C–18°C evenings and wet weather.',
          urgency: 'High',
          recommendedCategory: 'Outerwear',
        ),
      );
    }

    final hasWhiteSneaker = items.any(
      (i) => i.category == GarmentCategory.footwear && (i.name.toLowerCase().contains('sneaker') || i.subType.toLowerCase().contains('sneaker')),
    );
    if (!hasWhiteSneaker && !_resolvedGapIds.contains('gap_sneaker')) {
      gaps.add(
        WardrobeGap(
          id: 'gap_sneaker',
          title: 'Minimalist Clean White Leather Sneaker',
          reason: 'Versatile foundation piece required to bridge high-tailored trousers with casual weekend ensembles.',
          urgency: 'Medium',
          recommendedCategory: 'Footwear',
        ),
      );
    }

    final accessoriesCount = items.where((i) => i.category == GarmentCategory.accessories).length;
    if (accessoriesCount < 2 && !_resolvedGapIds.contains('gap_accessory')) {
      gaps.add(
        WardrobeGap(
          id: 'gap_accessory',
          title: 'Italian Leather Belt & Silk Scarf',
          reason: 'Accent accessories to anchor elevated formal dress codes identified in your style calendar.',
          urgency: 'Low',
          recommendedCategory: 'Accessories',
        ),
      );
    }

    final hasFormalTailoring = items.any((i) => i.formality >= 4);
    if (!hasFormalTailoring && !_resolvedGapIds.contains('gap_formal')) {
      gaps.add(
        WardrobeGap(
          id: 'gap_formal',
          title: 'Tier-4 Sartorial Navy or Charcoal Blazer',
          reason: 'Missing sharp sartorial presence for high-impact executive and celebration events.',
          urgency: 'High',
          recommendedCategory: 'Outerwear',
        ),
      );
    }

    return WardrobeStats(
      totalItems: totalItems,
      totalClosetValue: totalClosetValue,
      averageCostPerWear: double.parse(averageCostPerWear.toStringAsFixed(2)),
      activeUtilizationPercent: double.parse(activeUtilizationPercent.toStringAsFixed(1)),
      detectedGaps: gaps,
    );
  }
}

final analyticsRepositoryProvider = Provider<AnalyticsRepository>((ref) {
  final wardrobeRepo = ref.watch(wardrobeRepositoryProvider);
  return DynamicAnalyticsRepository(wardrobeRepo);
});

final wardrobeStatsProvider = FutureProvider<WardrobeStats>((ref) async {
  // Automatically invalidates and recalculates when wardrobeProvider updates
  ref.watch(wardrobeProvider);
  final repo = ref.watch(analyticsRepositoryProvider);
  return repo.getWardrobeStats();
});
