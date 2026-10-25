import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/models/fashion_models.dart';
import '../../../shared/widgets/luxury_image.dart';
import '../../../shared/widgets/otd_button.dart';
import '../../../shared/widgets/otd_card.dart';
import '../outfits_repository.dart';
import '../plan_look_provider.dart';
import '../../try_on/try_on_renderer.dart';

class OutfitResultScreen extends ConsumerWidget {
  const OutfitResultScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = OtdColors.of(context);
    final curatedState = ref.watch(curatedOutfitProvider);
    final outfit = curatedState.value;

    if (outfit == null) {
      return Scaffold(
        backgroundColor: colors.canvas,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'No outfit recommendation found.',
                style: OtdTokens.bodyLarge(color: colors.textPrimary),
              ),
              const SizedBox(height: 16),
              OtdButton(
                text: 'Plan A Look',
                width: 180,
                onPressed: () => context.go('/plan'),
              ),
            ],
          ),
        ),
      );
    }

    // Separate main apparel and accessories
    final apparelItems = outfit.items
        .where((i) => i.category != GarmentCategory.accessories)
        .toList();
    final accessoryItems = outfit.items
        .where((i) => i.category == GarmentCategory.accessories)
        .toList();

    final isSaved = ref.watch(savedLooksProvider).any((l) => l.id == outfit.id);

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        backgroundColor: colors.canvas,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.close, color: colors.textPrimary),
          onPressed: () => context.go('/home'),
        ),
        actions: [
          IconButton(
            icon: Icon(
              isSaved ? Icons.bookmark : Icons.bookmark_border,
              color: isSaved ? colors.accent : colors.textPrimary,
            ),
            onPressed: () {
              ref.read(curatedOutfitProvider.notifier).toggleBookmark();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    isSaved ? 'Look removed from Saved Looks' : 'Look saved to your collection!',
                  ),
                  backgroundColor: OtdTokens.goldDeep,
                  duration: const Duration(milliseconds: 1400),
                ),
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(
            horizontal: OtdTokens.screenPaddingH,
            vertical: 8,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Match Score Chip & Occasion Tag
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: colors.accentTint,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: colors.accent.withValues(alpha: 0.4)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Iconsax.magic_star, size: 14, color: OtdTokens.gold),
                        const SizedBox(width: 6),
                        Text(
                          '${(outfit.aiMatchScore * 100).round()}% MATCH',
                          style: OtdTokens.label(
                            color: colors.isDark ? colors.accent : OtdTokens.goldDeep,
                            weight: FontWeight.w700,
                            letterSpacing: 0.8,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    outfit.venue,
                    style: OtdTokens.label(color: colors.textMuted, letterSpacing: 0.8),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              // Title & Subtitle
              Text(
                outfit.title,
                style: OtdTokens.headingLarge(
                  color: colors.textPrimary,
                  weight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                outfit.description,
                style: OtdTokens.bodyMedium(color: colors.textMuted),
              ),

              const SizedBox(height: 24),

              // Garment Layout Grid: Apparel Stack on Left, Accessories on Right
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Main Apparel Column (60% width)
                  Expanded(
                    flex: 6,
                    child: Column(
                      children: apparelItems.map((item) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: OtdCard(
                            padding: const EdgeInsets.all(10),
                            borderRadius: 16,
                            child: Row(
                              children: [
                                LuxuryImage(
                                  imageUrl: item.imageUrl,
                                  width: 68,
                                  height: 68,
                                  borderRadius: 12,
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        item.name,
                                        style: OtdTokens.bodyMedium(
                                          color: colors.textPrimary,
                                          weight: FontWeight.w600,
                                        ),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      const SizedBox(height: 3),
                                      Text(
                                        '${item.brand} • ${item.color}',
                                        style: OtdTokens.bodySmall(color: colors.textMuted),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),

                  const SizedBox(width: 12),

                  // Accessories & Detail Column (40% width)
                  Expanded(
                    flex: 4,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'ACCENTS',
                          style: OtdTokens.label(color: colors.textMuted, letterSpacing: 1.0),
                        ),
                        const SizedBox(height: 8),
                        if (accessoryItems.isNotEmpty)
                          ...accessoryItems.map((acc) {
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: OtdCard(
                                padding: const EdgeInsets.all(10),
                                borderRadius: 16,
                                child: Column(
                                  children: [
                                    LuxuryImage(
                                      imageUrl: acc.imageUrl,
                                      width: double.infinity,
                                      height: 78,
                                      borderRadius: 10,
                                    ),
                                    const SizedBox(height: 6),
                                    Text(
                                      acc.name,
                                      style: OtdTokens.bodySmall(
                                        color: colors.textPrimary,
                                        weight: FontWeight.w600,
                                      ),
                                      textAlign: TextAlign.center,
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ),
                              ),
                            );
                          })
                        else
                          OtdCard(
                            padding: const EdgeInsets.all(14),
                            borderRadius: 14,
                            child: Center(
                              child: Text(
                                'Minimalist\nNo Heavy Accents',
                                textAlign: TextAlign.center,
                                style: OtdTokens.bodySmall(color: colors.textMuted),
                              ),
                            ),
                          ),

                        const SizedBox(height: 8),

                        // "Why This Look" Trigger Tile
                        OtdCard(
                          padding: const EdgeInsets.all(14),
                          borderRadius: 16,
                          borderColor: colors.accent.withValues(alpha: 0.3),
                          color: colors.accentTint,
                          onTap: () => context.push('/plan/why'),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(Iconsax.info_circle, size: 16, color: colors.accent),
                                  const SizedBox(width: 6),
                                  Text(
                                    'WHY THIS LOOK',
                                    style: OtdTokens.label(
                                      color: colors.isDark ? colors.accent : OtdTokens.goldDeep,
                                      weight: FontWeight.w700,
                                      letterSpacing: 0.8,
                                    ).copyWith(fontSize: 10.5),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Text(
                                'Inspect rationale & color synergy',
                                style: OtdTokens.bodySmall(color: colors.textSecondary),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // Action Buttons Row: Save Look & Wear This Look
              Row(
                children: [
                  Expanded(
                    child: OtdButton(
                      text: isSaved ? 'Saved' : 'Save Look',
                      variant: OtdButtonVariant.outline,
                      icon: Icon(
                        isSaved ? Icons.bookmark : Icons.bookmark_border,
                        size: 18,
                        color: isSaved ? colors.accent : colors.textPrimary,
                      ),
                      onPressed: () {
                        ref.read(curatedOutfitProvider.notifier).toggleBookmark();
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OtdButton(
                      text: outfit.isWornToday ? 'Worn Today' : 'Wear This Look',
                      variant: OtdButtonVariant.gold,
                      icon: const Icon(Icons.checkroom, size: 18, color: OtdTokens.espresso),
                      onPressed: () async {
                        await ref.read(curatedOutfitProvider.notifier).wearCuratedOutfit();
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Logged in your Wardrobe wear history! Looking sharp.'),
                              backgroundColor: OtdTokens.goldDeep,
                              duration: Duration(seconds: 2),
                            ),
                          );
                        }
                      },
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              // Try On Button (Screen 20 connector)
              OtdButton(
                text: 'TRY ON VIRTUAL AVATAR',
                variant: OtdButtonVariant.outline,
                icon: const Icon(Iconsax.magicpen, size: 18),
                onPressed: () {
                  ref.read(tryOnProvider.notifier).loadFromOutfit(outfit);
                  context.push('/try-on');
                },
              ),

              const SizedBox(height: 14),

              // Try Another Look & Stylist Chat buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  TextButton.icon(
                    onPressed: () {
                      final planState = ref.read(planLookProvider);
                      ref.read(curatedOutfitProvider.notifier).curateOutfit(
                            venue: planState.effectiveVenueName,
                            occasion: planState.effectiveOccasion,
                            vibe: planState.mood,
                            weather: planState.weatherSnapshot?.summary ?? '24°C • Pleasant',
                            tryAnother: true,
                          );
                    },
                    icon: Icon(Icons.refresh, size: 16, color: colors.textMuted),
                    label: Text(
                      'Try Another Look',
                      style: OtdTokens.bodyMedium(
                        color: colors.textMuted,
                        weight: FontWeight.w600,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  TextButton.icon(
                    onPressed: () {
                      context.go('/stylist');
                    },
                    icon: Icon(Iconsax.magic_star, size: 16, color: colors.accent),
                    label: Text(
                      'Refine with AI Stylist',
                      style: OtdTokens.bodyMedium(
                        color: colors.accentDeep,
                        weight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
