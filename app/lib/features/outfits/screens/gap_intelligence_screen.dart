import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../analytics/analytics_repository.dart';

class GapIntelligenceScreen extends ConsumerWidget {
  const GapIntelligenceScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = OtdColors.of(context);
    final statsAsync = ref.watch(wardrobeStatsProvider);

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
              'PREDICTIVE GRAPH',
              style: OtdTokens.caption(
                color: colors.accent,
                weight: FontWeight.w700,
              ).copyWith(letterSpacing: 2.0),
            ),
            Text(
              'Gap Intelligence',
              style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: statsAsync.when(
          loading: () => const Center(child: CircularProgressIndicator(color: AppTheme.gold)),
          error: (err, _) => Center(child: Text('Error: $err', style: const TextStyle(color: Colors.red))),
          data: (stats) {
            final gaps = stats.detectedGaps;

            return SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(
                horizontal: OtdTokens.screenPaddingH,
                vertical: 12,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Overview Card
                  Container(
                    padding: const EdgeInsets.all(18),
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
                              'IDENTIFIED GAPS',
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
                              ),
                              child: Text(
                                '${gaps.length} FOUND',
                                style: OtdTokens.caption(
                                  color: colors.accent,
                                  weight: FontWeight.w700,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Text(
                          'AI-Derived Foundation Gaps',
                          style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'These strategic additions bridge underutilized items in your current closet, unlocking new versatile outfit combinations across varied weather and dress codes.',
                          style: OtdTokens.bodySmall(color: colors.textSecondary),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  Text(
                    'STRATEGIC RECOMMENDATIONS',
                    style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700).copyWith(letterSpacing: 1.5),
                  ),
                  const SizedBox(height: 10),

                  if (gaps.isEmpty)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(28),
                      decoration: BoxDecoration(
                        color: colors.card,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: colors.border),
                      ),
                      child: Column(
                        children: [
                          Icon(Iconsax.tick_circle, color: colors.accent, size: 40),
                          const SizedBox(height: 12),
                          Text(
                            'All Gaps Resolved',
                            style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'Your digital wardrobe has a complete set of foundational layers across all core categories.',
                            textAlign: TextAlign.center,
                            style: OtdTokens.bodySmall(color: colors.textSecondary),
                          ),
                        ],
                      ),
                    )
                  else
                    ...gaps.map((gap) {
                      final isHigh = gap.urgency.toLowerCase() == 'high';

                      return Container(
                        margin: const EdgeInsets.only(bottom: 14),
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: colors.card,
                          borderRadius: BorderRadius.circular(20),
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
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: isHigh ? const Color(0xFFF43F5E).withValues(alpha: 0.12) : colors.accent.withValues(alpha: 0.12),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    '${gap.urgency.toUpperCase()} PRIORITY',
                                    style: TextStyle(
                                      fontSize: 9.5,
                                      fontWeight: FontWeight.w700,
                                      color: isHigh ? const Color(0xFFF43F5E) : colors.accent,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Text(
                              gap.title,
                              style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700).copyWith(fontSize: 17),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              gap.reason,
                              style: OtdTokens.bodySmall(color: colors.textSecondary),
                            ),
                            const SizedBox(height: 14),

                            // Mark Resolved Button
                            Align(
                              alignment: Alignment.centerRight,
                              child: TextButton.icon(
                                style: TextButton.styleFrom(
                                  foregroundColor: colors.accent,
                                ),
                                icon: const Icon(Iconsax.tick_circle, size: 16),
                                label: Text(
                                  'Mark Resolved',
                                  style: OtdTokens.label(color: colors.accent, weight: FontWeight.w700),
                                ),
                                onPressed: () async {
                                  await ref.read(analyticsRepositoryProvider).resolveGap(gap.id);
                                  ref.invalidate(wardrobeStatsProvider);
                                  if (context.mounted) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text('Marked "${gap.title}" as resolved!'),
                                        backgroundColor: OtdTokens.espresso,
                                      ),
                                    );
                                  }
                                },
                              ),
                            ),
                          ],
                        ),
                      );
                    }),
                  const SizedBox(height: 24),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
