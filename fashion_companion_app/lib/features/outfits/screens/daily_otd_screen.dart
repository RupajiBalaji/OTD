import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/fashion_models.dart';
import '../outfits_repository.dart';

class DailyOtdScreen extends ConsumerWidget {
  const DailyOtdScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final outfitsAsync = ref.watch(outfitsProvider);
    final todayFormatted = DateFormat('EEEE, MMMM d').format(DateTime.now()).toUpperCase();

    return Scaffold(
      backgroundColor: AppTheme.noir,
      body: SafeArea(
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // Luxury Header
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          todayFormatted,
                          style: GoogleFonts.outfit(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            letterSpacing: 2.0,
                            color: AppTheme.gold,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceNoir,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: AppTheme.borderNoir),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.wb_sunny_outlined, size: 14, color: AppTheme.gold),
                              const SizedBox(width: 6),
                              Text(
                                '21°C • Mild Autumn',
                                style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.silkWhite),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Outfit of the Day',
                      style: Theme.of(context).textTheme.displayMedium,
                    ),
                  ],
                ),
              ),
            ),

            // Content
            outfitsAsync.when(
              loading: () => const SliverFillRemaining(
                child: Center(
                  child: CircularProgressIndicator(color: AppTheme.gold),
                ),
              ),
              error: (err, _) => SliverFillRemaining(
                child: Center(
                  child: Text('Failed to load OTD: $err', style: const TextStyle(color: Colors.red)),
                ),
              ),
              data: (outfits) {
                if (outfits.isEmpty) {
                  return const SliverFillRemaining(
                    child: Center(
                      child: Text('No recommendations available.'),
                    ),
                  );
                }

                return SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final outfit = outfits[index];
                        return _OutfitCard(outfit: outfit);
                      },
                      childCount: outfits.length,
                    ),
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

class _OutfitCard extends ConsumerWidget {
  final OutfitRecommendation outfit;

  const _OutfitCard({required this.outfit});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      decoration: BoxDecoration(
        color: AppTheme.surfaceNoir,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: outfit.isWornToday ? AppTheme.gold : AppTheme.borderNoir,
          width: outfit.isWornToday ? 1.5 : 1.0,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header info
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppTheme.gold.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        '${(outfit.aiMatchScore * 100).toInt()}% AI MATCH • ${outfit.vibe.name.toUpperCase()}',
                        style: GoogleFonts.outfit(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.2,
                          color: AppTheme.gold,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: Icon(
                        outfit.isBookmarked ? Icons.bookmark : Icons.bookmark_border,
                        color: outfit.isBookmarked ? AppTheme.gold : AppTheme.mutedSilver,
                      ),
                      onPressed: () {
                        ref.read(outfitsProvider.notifier).toggleBookmark(outfit.id);
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  outfit.title,
                  style: GoogleFonts.cormorantGaramond(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.silkWhite,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  outfit.description,
                  style: GoogleFonts.outfit(
                    fontSize: 13,
                    color: AppTheme.mutedSilver,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 10),
                // Weather reasoning
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.noir,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.cloud_outlined, size: 16, color: AppTheme.gold),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          outfit.weatherFitReason,
                          style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.silkWhite),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Horizontal scroll of wardrobe pieces
          SizedBox(
            height: 150,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: outfit.items.length,
              itemBuilder: (context, i) {
                final item = outfit.items[i];
                return Container(
                  width: 110,
                  margin: const EdgeInsets.only(right: 12),
                  decoration: BoxDecoration(
                    color: AppTheme.elevatedNoir,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.borderNoir),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: ClipRRect(
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                          child: Image.network(
                            item.imageUrl,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(
                              color: AppTheme.noir,
                              child: const Icon(Icons.checkroom, color: AppTheme.mutedSilver),
                            ),
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              item.name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: GoogleFonts.outfit(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.silkWhite,
                              ),
                            ),
                            Text(
                              item.category.name.toUpperCase(),
                              style: GoogleFonts.outfit(
                                fontSize: 9,
                                color: AppTheme.gold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),

          // Bottom Action
          Padding(
            padding: const EdgeInsets.all(20),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: Icon(
                  outfit.isWornToday ? Icons.check_circle : Icons.checkroom_outlined,
                  size: 18,
                ),
                label: Text(
                  outfit.isWornToday ? 'WORN TODAY' : 'WEAR THIS LOOK TODAY',
                  style: GoogleFonts.outfit(fontWeight: FontWeight.w700),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: outfit.isWornToday ? AppTheme.gold : AppTheme.elevatedNoir,
                  foregroundColor: outfit.isWornToday ? AppTheme.noir : AppTheme.silkWhite,
                  side: BorderSide(
                    color: outfit.isWornToday ? AppTheme.gold : AppTheme.borderNoir,
                  ),
                ),
                onPressed: () {
                  ref.read(outfitsProvider.notifier).logAsWornToday(outfit.id);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Logged "${outfit.title}" as today\'s look! Wear count updated.'),
                      backgroundColor: AppTheme.surfaceNoir,
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}
