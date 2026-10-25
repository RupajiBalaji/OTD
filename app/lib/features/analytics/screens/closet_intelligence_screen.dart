import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/otd_tokens.dart';
import 'package:go_router/go_router.dart';
import '../../wardrobe/wardrobe_repository.dart';
import '../analytics_repository.dart';

class ClosetIntelligenceScreen extends ConsumerWidget {
  const ClosetIntelligenceScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = OtdColors.of(context);
    final statsAsync = ref.watch(wardrobeStatsProvider);
    final wardrobeAsync = ref.watch(wardrobeProvider);

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        backgroundColor: colors.canvas,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 20, color: colors.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'AI INTELLIGENCE',
              style: OtdTokens.caption(
                color: colors.accent,
                weight: FontWeight.w700,
              ).copyWith(letterSpacing: 2.0),
            ),
            Text(
              'Closet Intelligence',
              style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: statsAsync.when(
          loading: () => const Center(
            child: CircularProgressIndicator(color: AppTheme.gold),
          ),
          error: (err, _) => Center(
            child: Text('Error: $err', style: const TextStyle(color: Colors.red)),
          ),
          data: (stats) {
            return CustomScrollView(
              physics: const BouncingScrollPhysics(),
              slivers: [
                SliverPadding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: OtdTokens.screenPaddingH,
                    vertical: 12,
                  ),
                  sliver: SliverList(
                    delegate: SliverChildListDelegate([
                      // 1. Top KPI Stat Cards (Calculated directly from real wardrobe)
                      Row(
                        children: [
                          Expanded(
                            child: _buildKpiCard(
                              title: 'CLOSET VALUATION',
                              value: '\$${stats.totalClosetValue.toInt()}',
                              subtitle: '${stats.totalItems} pieces cataloged',
                              icon: Iconsax.wallet_3,
                              colors: colors,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildKpiCard(
                              title: 'AVG COST / WEAR',
                              value: '\$${stats.averageCostPerWear.toStringAsFixed(1)}',
                              subtitle: stats.totalItems > 0 ? 'Decreasing per rotation' : 'No wear logs yet',
                              icon: Iconsax.trend_down,
                              colors: colors,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),

                      // 2. Wardrobe Utilization Gauge Card
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: colors.card,
                          borderRadius: BorderRadius.circular(22),
                          border: Border.all(color: colors.border),
                          boxShadow: OtdTokens.softShadow(isDark: colors.isDark, blur: 12, offsetY: 3),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'WARDROBE UTILIZATION',
                                  style: OtdTokens.caption(
                                    color: colors.accent,
                                    weight: FontWeight.w700,
                                  ).copyWith(letterSpacing: 1.5),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: colors.accent.withValues(alpha: 0.12),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(color: colors.accent.withValues(alpha: 0.3)),
                                  ),
                                  child: Text(
                                    '${stats.activeUtilizationPercent.toInt()}% ACTIVE',
                                    style: OtdTokens.caption(
                                      color: colors.accent,
                                      weight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 14),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(10),
                              child: LinearProgressIndicator(
                                value: (stats.activeUtilizationPercent / 100.0).clamp(0.0, 1.0),
                                minHeight: 9,
                                backgroundColor: colors.canvas,
                                valueColor: AlwaysStoppedAnimation<Color>(colors.accent),
                              ),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              '${stats.activeUtilizationPercent.toInt()}% of your pieces have been worn in outfits. Rotating underutilized items maximizes your cost-per-wear efficiency.',
                              style: OtdTokens.bodySmall(color: colors.textSecondary),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),

                      // 3. Category Breakdown Chart (fl_chart BarChart)
                      wardrobeAsync.maybeWhen(
                        data: (items) => _buildCategoryChart(items, colors),
                        orElse: () => const SizedBox.shrink(),
                      ),
                      const SizedBox(height: 24),

                      // 4. Detected Gaps Section Header with "View All"
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'WARDROBE GAPS',
                                style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700).copyWith(letterSpacing: 1.5),
                              ),
                              Text(
                                'Missing Foundation Pieces',
                                style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
                              ),
                            ],
                          ),
                          GestureDetector(
onTap: () => context.push('/gap-intelligence'),
                            child: Row(
                              children: [
                                Text('See all', style: OtdTokens.label(color: colors.accent, weight: FontWeight.w600)),
                                const SizedBox(width: 4),
                                Icon(Icons.chevron_right, size: 16, color: colors.accent),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Gaps List
                      if (stats.detectedGaps.isEmpty)
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: colors.card,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: colors.border),
                          ),
                          child: Row(
                            children: [
                              Icon(Iconsax.tick_circle, color: colors.accent, size: 22),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  'Your wardrobe is fully balanced across all essential categories!',
                                  style: OtdTokens.bodyMedium(color: colors.textPrimary),
                                ),
                              ),
                            ],
                          ),
                        )
                      else
                        ...stats.detectedGaps.map(
                          (gap) => Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: colors.card,
                              borderRadius: BorderRadius.circular(18),
                              border: Border.all(color: colors.border),
                              boxShadow: OtdTokens.softShadow(isDark: colors.isDark, blur: 8, offsetY: 2),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: colors.accent.withValues(alpha: 0.12),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        gap.recommendedCategory.toUpperCase(),
                                        style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700).copyWith(fontSize: 9),
                                      ),
                                    ),
                                    Text(
                                      '${gap.urgency.toUpperCase()} PRIORITY',
                                      style: TextStyle(
                                        fontSize: 9.5,
                                        fontWeight: FontWeight.w700,
                                        color: gap.urgency == 'High' ? const Color(0xFFF43F5E) : colors.accent,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  gap.title,
                                  style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700).copyWith(fontSize: 16),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  gap.reason,
                                  style: OtdTokens.bodySmall(color: colors.textSecondary),
                                ),
                              ],
                            ),
                          ),
                        ),
                      const SizedBox(height: 32),
                    ]),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildKpiCard({
    required String title,
    required String value,
    required String subtitle,
    required IconData icon,
    required OtdColors colors,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colors.border),
        boxShadow: OtdTokens.softShadow(isDark: colors.isDark, blur: 10, offsetY: 3),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: OtdTokens.caption(color: colors.textMuted, weight: FontWeight.w700).copyWith(fontSize: 8.5),
              ),
              Icon(icon, size: 16, color: colors.accent),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: OtdTokens.headingMedium(color: colors.textPrimary, weight: FontWeight.w700),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: OtdTokens.caption(color: colors.textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChart(List<dynamic> items, OtdColors colors) {
    int tops = 0, bottoms = 0, footwear = 0, outerwear = 0, accessories = 0;
    for (final item in items) {
      final cat = item.category.toString().toLowerCase();
      if (cat.contains('top')) tops++;
      if (cat.contains('bottom')) bottoms++;
      if (cat.contains('footwear')) footwear++;
      if (cat.contains('outerwear')) outerwear++;
      if (cat.contains('accessories')) accessories++;
    }

    final maxCount = [tops, bottoms, footwear, outerwear, accessories].reduce((a, b) => a > b ? a : b);
    final maxY = (maxCount + 2).toDouble();

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: colors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'CATEGORY DISTRIBUTION',
            style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700).copyWith(letterSpacing: 1.5),
          ),
          const SizedBox(height: 4),
          Text(
            'Wardrobe Composition by Layer',
            style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700).copyWith(fontSize: 16),
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 160,
            child: BarChart(
              BarChartData(
                maxY: maxY,
                barTouchData: BarTouchData(enabled: true),
                titlesData: FlTitlesData(
                  show: true,
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: (val, _) {
                        switch (val.toInt()) {
                          case 0:
                            return Text('Tops', style: TextStyle(fontSize: 10, color: colors.textSecondary));
                          case 1:
                            return Text('Bottoms', style: TextStyle(fontSize: 10, color: colors.textSecondary));
                          case 2:
                            return Text('Shoes', style: TextStyle(fontSize: 10, color: colors.textSecondary));
                          case 3:
                            return Text('Outer', style: TextStyle(fontSize: 10, color: colors.textSecondary));
                          case 4:
                            return Text('Acc', style: TextStyle(fontSize: 10, color: colors.textSecondary));
                          default:
                            return const Text('');
                        }
                      },
                    ),
                  ),
                  leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                ),
                gridData: const FlGridData(show: false),
                borderData: FlBorderData(show: false),
                barGroups: [
                  _makeBarGroup(0, tops.toDouble(), colors.accent),
                  _makeBarGroup(1, bottoms.toDouble(), colors.accent.withValues(alpha: 0.85)),
                  _makeBarGroup(2, footwear.toDouble(), colors.accent.withValues(alpha: 0.7)),
                  _makeBarGroup(3, outerwear.toDouble(), colors.accent.withValues(alpha: 0.55)),
                  _makeBarGroup(4, accessories.toDouble(), colors.accent.withValues(alpha: 0.4)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  BarChartGroupData _makeBarGroup(int x, double y, Color color) {
    return BarChartGroupData(
      x: x,
      barRods: [
        BarChartRodData(
          toY: y,
          color: color,
          width: 18,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(6)),
        ),
      ],
    );
  }
}
