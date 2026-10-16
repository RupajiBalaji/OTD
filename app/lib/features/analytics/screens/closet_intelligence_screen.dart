import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../analytics_repository.dart';

class ClosetIntelligenceScreen extends ConsumerWidget {
  const ClosetIntelligenceScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(wardrobeStatsProvider);

    return Scaffold(
      backgroundColor: AppTheme.noir,
      body: SafeArea(
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // Header
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'AI INTELLIGENCE',
                      style: GoogleFonts.outfit(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 2.0,
                        color: AppTheme.gold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Closet Analytics',
                      style: Theme.of(context).textTheme.displayMedium,
                    ),
                  ],
                ),
              ),
            ),

            statsAsync.when(
              loading: () => const SliverFillRemaining(
                child: Center(child: CircularProgressIndicator(color: AppTheme.gold)),
              ),
              error: (err, _) => SliverFillRemaining(
                child: Center(child: Text('Error: $err', style: const TextStyle(color: Colors.red))),
              ),
              data: (stats) {
                return SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  sliver: SliverList(
                    delegate: SliverChildListDelegate([
                      // Top KPI cards in grid
                      Row(
                        children: [
                          Expanded(
                            child: _StatCard(
                              title: 'CLOSET VALUATION',
                              value: '\$${stats.totalClosetValue.toInt()}',
                              subtitle: '${stats.totalItems} pieces cataloged',
                              icon: Icons.account_balance_wallet_outlined,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: _StatCard(
                              title: 'AVG COST / WEAR',
                              value: '\$${stats.averageCostPerWear.toStringAsFixed(1)}',
                              subtitle: 'Declining per wear',
                              icon: Icons.trending_down,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),

                      // Utilization Banner
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceNoir,
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(color: AppTheme.borderNoir),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'CLOSET UTILIZATION',
                                  style: GoogleFonts.outfit(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    letterSpacing: 1.5,
                                    color: AppTheme.champagne,
                                  ),
                                ),
                                Text(
                                  '${stats.activeUtilizationPercent.toInt()}% ACTIVE',
                                  style: GoogleFonts.outfit(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: AppTheme.gold,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 14),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(10),
                              child: LinearProgressIndicator(
                                value: stats.activeUtilizationPercent / 100.0,
                                minHeight: 8,
                                backgroundColor: AppTheme.elevatedNoir,
                                valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.gold),
                              ),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              'You actively rotate 82% of your pieces. 18% of items have been idle for >90 days.',
                              style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.mutedSilver),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 28),

                      // Wardrobe Gap Detector Section
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Wardrobe Gaps Detected',
                            style: GoogleFonts.cormorantGaramond(
                              fontSize: 22,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.silkWhite,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppTheme.roseGold.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Text(
                              '3 GAPS',
                              style: GoogleFonts.outfit(
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                color: AppTheme.roseGold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'AI identified missing cornerstone pieces needed to unlock 14+ new outfit combinations:',
                        style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.mutedSilver),
                      ),
                      const SizedBox(height: 16),

                      // List of Gaps
                      ...stats.detectedGaps.map((gap) => Container(
                            margin: const EdgeInsets.only(bottom: 14),
                            padding: const EdgeInsets.all(18),
                            decoration: BoxDecoration(
                              color: AppTheme.surfaceNoir,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppTheme.borderNoir),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: AppTheme.gold.withValues(alpha: 0.12),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        gap.recommendedCategory.toUpperCase(),
                                        style: GoogleFonts.outfit(
                                          fontSize: 9,
                                          fontWeight: FontWeight.w700,
                                          color: AppTheme.gold,
                                        ),
                                      ),
                                    ),
                                    Text(
                                      '${gap.urgency.toUpperCase()} PRIORITY',
                                      style: GoogleFonts.outfit(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w600,
                                        color: gap.urgency == 'High' ? AppTheme.roseGold : AppTheme.champagne,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 10),
                                Text(
                                  gap.title,
                                  style: GoogleFonts.cormorantGaramond(
                                    fontSize: 19,
                                    fontWeight: FontWeight.w700,
                                    color: AppTheme.silkWhite,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  gap.reason,
                                  style: GoogleFonts.outfit(
                                    fontSize: 12,
                                    color: AppTheme.mutedSilver,
                                    height: 1.4,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                SizedBox(
                                  width: double.infinity,
                                  child: OutlinedButton.icon(
                                    icon: const Icon(Icons.shopping_bag_outlined, size: 14),
                                    label: const Text('EXPLORE CURATED OPTIONS'),
                                    onPressed: () {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(
                                          content: Text('Opening AI Shopping recommendations for "${gap.title}"'),
                                          backgroundColor: AppTheme.surfaceNoir,
                                        ),
                                      );
                                    },
                                  ),
                                ),
                              ],
                            ),
                          )),
                      const SizedBox(height: 32),
                    ]),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final String subtitle;
  final IconData icon;

  const _StatCard({
    required this.title,
    required this.value,
    required this.subtitle,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppTheme.surfaceNoir,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppTheme.borderNoir),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: AppTheme.gold),
          const SizedBox(height: 12),
          Text(
            title,
            style: GoogleFonts.outfit(
              fontSize: 10,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.2,
              color: AppTheme.mutedSilver,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: GoogleFonts.cormorantGaramond(
              fontSize: 26,
              fontWeight: FontWeight.w700,
              color: AppTheme.silkWhite,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.champagne),
          ),
        ],
      ),
    );
  }
}
