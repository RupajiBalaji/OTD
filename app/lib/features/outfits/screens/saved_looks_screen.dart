import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/models/fashion_models.dart';
import '../../../shared/widgets/luxury_image.dart';
import '../../../shared/widgets/otd_button.dart';
import '../../../shared/widgets/otd_chip.dart';
import '../outfits_repository.dart';

class SavedLooksScreen extends ConsumerStatefulWidget {
  const SavedLooksScreen({super.key});

  @override
  ConsumerState<SavedLooksScreen> createState() => _SavedLooksScreenState();
}

class _SavedLooksScreenState extends ConsumerState<SavedLooksScreen> {
  String _selectedOccasion = 'All';

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);
    final savedLooks = ref.watch(savedLooksProvider);

    // Extract unique occasions for filter chips
    final occasions = <String>{'All'};
    for (final look in savedLooks) {
      occasions.add(look.occasion.name);
    }

    final filteredLooks = _selectedOccasion == 'All'
        ? savedLooks
        : savedLooks.where((l) => l.occasion.name.toLowerCase() == _selectedOccasion.toLowerCase()).toList();

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        backgroundColor: colors.canvas,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 20, color: colors.textPrimary),
          onPressed: () {
            if (Navigator.of(context).canPop()) {
              Navigator.of(context).pop();
            } else {
              context.go('/home');
            }
          },
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'SAVED ENSEMBLES',
              style: OtdTokens.caption(
                color: colors.accent,
                weight: FontWeight.w700,
              ).copyWith(letterSpacing: 2.0),
            ),
            Text(
              'Saved Looks',
              style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: colors.card,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: colors.border),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Iconsax.bookmark_2, size: 14, color: colors.accent),
                const SizedBox(width: 4),
                Text(
                  '${savedLooks.length}',
                  style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Occasion Filter Chips
            if (occasions.length > 2)
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: OtdTokens.screenPaddingH,
                  vertical: 10,
                ),
                child: SizedBox(
                  height: 38,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    physics: const BouncingScrollPhysics(),
                    itemCount: occasions.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemBuilder: (context, idx) {
                      final occ = occasions.elementAt(idx);
                      return OtdChip(
                        label: occ,
                        isSelected: _selectedOccasion == occ,
                        onTap: () => setState(() => _selectedOccasion = occ),
                      );
                    },
                  ),
                ),
              ),

            // Main Looks Grid or Empty State
            Expanded(
              child: filteredLooks.isEmpty
                  ? Center(
                      child: Padding(
                        padding: const EdgeInsets.all(32),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              width: 80,
                              height: 80,
                              decoration: BoxDecoration(
                                color: colors.card,
                                shape: BoxShape.circle,
                                border: Border.all(color: colors.border),
                              ),
                              child: Icon(
                                Iconsax.bookmark,
                                size: 36,
                                color: colors.accent.withValues(alpha: 0.6),
                              ),
                            ),
                            const SizedBox(height: 20),
                            Text(
                              'No saved looks yet',
                              style: OtdTokens.headingMedium(color: colors.textPrimary, weight: FontWeight.w700),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Explore the Look Planner to curate and bookmark your favorite stylish combinations.',
                              textAlign: TextAlign.center,
                              style: OtdTokens.bodyMedium(color: colors.textSecondary),
                            ),
                            const SizedBox(height: 24),
                            OtdButton(
                              text: 'Create My Look',
                              icon: const Icon(Iconsax.magic_star, size: 18, color: Colors.white),
                              onPressed: () => context.push('/plan'),
                            ),
                          ],
                        ),
                      ),
                    )
                  : GridView.builder(
                      physics: const BouncingScrollPhysics(),
                      padding: const EdgeInsets.fromLTRB(
                        OtdTokens.screenPaddingH,
                        8,
                        OtdTokens.screenPaddingH,
                        32,
                      ),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 14,
                        childAspectRatio: 0.66,
                      ),
                      itemCount: filteredLooks.length,
                      itemBuilder: (context, idx) {
                        final outfit = filteredLooks[idx];
                        return _buildSavedLookCard(context, outfit, colors);
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSavedLookCard(BuildContext context, OutfitRecommendation outfit, OtdColors colors) {
    // Pick the most representative image (outerwear, top, or default)
    final imageUrl = outfit.items.isNotEmpty ? outfit.items.first.imageUrl : '';

    return GestureDetector(
      onTap: () {
        ref.read(curatedOutfitProvider.notifier).setOutfit(outfit);
        context.push('/plan/result');
      },
      child: Container(
        decoration: BoxDecoration(
          color: colors.card,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: colors.border),
          boxShadow: OtdTokens.softShadow(isDark: colors.isDark, blur: 10, offsetY: 3),
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Thumbnail with bookmark toggle & match score
            Expanded(
              child: Stack(
                children: [
                  Positioned.fill(
                    child: LuxuryImage(
                      imageUrl: imageUrl,
                      fit: BoxFit.cover,
                      fallbackIcon: '✨',
                    ),
                  ),

                  // Top gradient shadow for icons
                  Positioned(
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 50,
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.black.withValues(alpha: 0.5),
                            Colors.transparent,
                          ],
                        ),
                      ),
                    ),
                  ),

                  // Match Score Tag
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppTheme.noir.withValues(alpha: 0.75),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: colors.accent.withValues(alpha: 0.5)),
                      ),
                      child: Text(
                        '${(outfit.aiMatchScore > 1 ? outfit.aiMatchScore : (outfit.aiMatchScore * 100)).toInt()}% Match',
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.gold,
                        ),
                      ),
                    ),
                  ),

                  // Bookmark Heart Action
                  Positioned(
                    top: 6,
                    right: 6,
                    child: GestureDetector(
                      onTap: () {
                        ref.read(savedLooksProvider.notifier).toggleSave(outfit);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Removed look from saved collection')),
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.6),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.bookmark,
                          size: 16,
                          color: AppTheme.gold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Details info
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    outfit.occasion.name.toUpperCase(),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: OtdTokens.caption(
                      color: colors.accent,
                      weight: FontWeight.w700,
                    ).copyWith(fontSize: 9, letterSpacing: 1.0),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    outfit.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: OtdTokens.label(
                      color: colors.textPrimary,
                      weight: FontWeight.w700,
                    ).copyWith(fontSize: 13),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    outfit.venue.isNotEmpty ? outfit.venue : 'Curated Look',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: OtdTokens.caption(color: colors.textMuted),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${outfit.items.length} Pieces',
                        style: OtdTokens.caption(color: colors.textSecondary, weight: FontWeight.w600),
                      ),
                      Icon(Iconsax.arrow_right_3, size: 14, color: colors.accent),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
