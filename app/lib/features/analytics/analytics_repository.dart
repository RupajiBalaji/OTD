import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../shared/models/fashion_models.dart';

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
}

class MockAnalyticsRepository implements AnalyticsRepository {
  @override
  Future<WardrobeStats> getWardrobeStats() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return WardrobeStats(
      totalItems: 38,
      totalClosetValue: 4680.0,
      averageCostPerWear: 18.25,
      activeUtilizationPercent: 82.0,
      detectedGaps: [
        WardrobeGap(
          id: 'gap_1',
          title: 'Camel Double-Breasted Trench',
          reason: 'Essential waterproof layer missing for 12°C - 18°C transitional autumn and spring weather.',
          urgency: 'High',
          recommendedCategory: 'Outerwear',
        ),
        WardrobeGap(
          id: 'gap_2',
          title: 'Minimalist Clean White Leather Sneaker',
          reason: 'Versatile foundation piece required to bridge high-tailored trousers with casual weekend ensembles.',
          urgency: 'Medium',
          recommendedCategory: 'Footwear',
        ),
        WardrobeGap(
          id: 'gap_3',
          title: 'Silk Herringbone Pocket Square / Scarf',
          reason: 'Accent accessory to complete formal evening dress codes identified in upcoming calendar events.',
          urgency: 'Low',
          recommendedCategory: 'Accessories',
        ),
      ],
    );
  }
}

final analyticsRepositoryProvider = Provider<AnalyticsRepository>((ref) {
  return MockAnalyticsRepository();
});

final wardrobeStatsProvider = FutureProvider<WardrobeStats>((ref) async {
  final repo = ref.watch(analyticsRepositoryProvider);
  return repo.getWardrobeStats();
});
