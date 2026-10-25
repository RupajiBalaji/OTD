import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/models/fashion_models.dart';
import '../../../shared/widgets/avatar_widget.dart';
import '../../../shared/widgets/luxury_image.dart';
import '../../../shared/widgets/otd_button.dart';
import '../../outfits/outfits_repository.dart';
import '../../wardrobe/wardrobe_repository.dart';
import '../try_on_renderer.dart';

class VirtualTryOnScreen extends ConsumerStatefulWidget {
  const VirtualTryOnScreen({super.key});

  @override
  ConsumerState<VirtualTryOnScreen> createState() => _VirtualTryOnScreenState();
}

class _VirtualTryOnScreenState extends ConsumerState<VirtualTryOnScreen> {
  void _openGarmentPicker(BuildContext context, GarmentCategory category, String label) {
    final colors = OtdColors.of(context);
    final wardrobeAsync = ref.read(wardrobeProvider);

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (_) {
        return Container(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.7,
          ),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            border: Border(top: BorderSide(color: colors.accent, width: 1.5)),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: colors.textMuted.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'SELECT ${label.toUpperCase()}',
                    style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700).copyWith(letterSpacing: 1.5),
                  ),
                  IconButton(
                    icon: Icon(Icons.close, size: 20, color: colors.textMuted),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Expanded(
                child: wardrobeAsync.maybeWhen(
                  data: (items) {
                    final categoryItems = items.where((i) => i.category == category).toList();
                    if (categoryItems.isEmpty) {
                      return Center(
                        child: Text(
                          'No $label available in your wardrobe.',
                          style: OtdTokens.bodyMedium(color: colors.textMuted),
                        ),
                      );
                    }
                    return ListView.separated(
                      physics: const BouncingScrollPhysics(),
                      itemCount: categoryItems.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (ctx, idx) {
                        final item = categoryItems[idx];
                        return ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          tileColor: colors.canvas,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                            side: BorderSide(color: colors.border),
                          ),
                          leading: ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: SizedBox(
                              width: 48,
                              height: 48,
                              child: LuxuryImage(
                                imageUrl: item.imageUrl,
                                fit: BoxFit.cover,
                                fallbackIcon: item.icon,
                              ),
                            ),
                          ),
                          title: Text(
                            item.name,
                            style: OtdTokens.label(color: colors.textPrimary, weight: FontWeight.w600),
                          ),
                          subtitle: Text(
                            '${item.brand} · ${item.color}',
                            style: OtdTokens.caption(color: colors.textMuted),
                          ),
                          trailing: Icon(Icons.check_circle_outline, color: colors.accent, size: 18),
                          onTap: () {
                            final notifier = ref.read(tryOnProvider.notifier);
                            switch (category) {
                              case GarmentCategory.tops:
                                notifier.selectTop(item);
                                break;
                              case GarmentCategory.bottoms:
                                notifier.selectBottom(item);
                                break;
                              case GarmentCategory.footwear:
                                notifier.selectFootwear(item);
                                break;
                              case GarmentCategory.outerwear:
                                notifier.selectOuterwear(item);
                                break;
                              case GarmentCategory.accessories:
                                notifier.selectAccessory(item);
                                break;
                              default:
                                break;
                            }
                            Navigator.pop(context);
                          },
                        );
                      },
                    );
                  },
                  orElse: () => const Center(child: CircularProgressIndicator()),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _saveCurrentLook(BuildContext context, TryOnState tryOnState, UserProfile profile) {
    final activeItems = tryOnState.activeItems;
    if (activeItems.length < 2) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select at least a top and bottom to save this look.')),
      );
      return;
    }

    final newLook = OutfitRecommendation(
      id: 'look_tryon_${DateTime.now().millisecondsSinceEpoch}',
      title: '${profile.preferredFit} ${tryOnState.top?.color ?? 'Signature'} Look',
      description: 'Layered ensemble curated in Virtual Try-On studio.',
      venue: 'Studio Styling',
      items: activeItems,
      occasion: FashionOccasion.casual,
      vibe: FashionVibe.minimalist,
      aiMatchScore: 0.95,
      weatherFitReason: 'Optimized for current weather and personal fit.',
      isBookmarked: true,
    );

    ref.read(savedLooksProvider.notifier).toggleSave(newLook);
    ref.read(recentLooksProvider.notifier).addRecentLook(newLook);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Outfit saved to your collection!'),
        backgroundColor: Color(0xFF1C1612),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);
    final userProfile = ref.watch(userProfileProvider);
    final tryOnState = ref.watch(tryOnProvider);

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
              'FITTING STUDIO',
              style: OtdTokens.caption(
                color: colors.accent,
                weight: FontWeight.w700,
              ).copyWith(letterSpacing: 2.0),
            ),
            Text(
              'Virtual Try-On',
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
                Icon(Iconsax.info_circle, size: 14, color: colors.accent),
                const SizedBox(width: 4),
                Text(
                  'Preview',
                  style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: OtdTokens.screenPaddingH,
            vertical: 8,
          ),
          child: Column(
            children: [
              // Segmented Control: My Avatar / Model / Both (Screen 20)
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: colors.card,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: colors.border),
                ),
                child: Row(
                  children: [
                    _buildSegmentButton(
                      label: 'My Avatar',
                      isSelected: tryOnState.mode == TryOnViewMode.myAvatar,
                      colors: colors,
                      onTap: () => ref.read(tryOnProvider.notifier).setMode(TryOnViewMode.myAvatar),
                    ),
                    _buildSegmentButton(
                      label: 'Model',
                      isSelected: tryOnState.mode == TryOnViewMode.model,
                      colors: colors,
                      onTap: () => ref.read(tryOnProvider.notifier).setMode(TryOnViewMode.model),
                    ),
                    _buildSegmentButton(
                      label: 'Both',
                      isSelected: tryOnState.mode == TryOnViewMode.both,
                      colors: colors,
                      onTap: () => ref.read(tryOnProvider.notifier).setMode(TryOnViewMode.both),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // Main Preview Stage + Right Thumbnails Column
              Expanded(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Canvas Stage (Layered 2D Preview)
                    Expanded(
                      flex: 7,
                      child: Container(
                        decoration: BoxDecoration(
                          color: colors.card,
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(color: colors.border),
                          boxShadow: OtdTokens.softShadow(isDark: colors.isDark, blur: 20, offsetY: 4),
                        ),
                        clipBehavior: Clip.antiAlias,
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            // Soft ambient background circle
                            Container(
                              width: 220,
                              height: 220,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: colors.accent.withValues(alpha: 0.12),
                              ),
                            ),

                            // Honest UI Watermark Tag
                            Positioned(
                              top: 12,
                              left: 12,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: Colors.black.withValues(alpha: 0.6),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  'Layered 2D Studio Preview',
                                  style: TextStyle(
                                    fontSize: 9.5,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.white.withValues(alpha: 0.8),
                                  ),
                                ),
                              ),
                            ),

                            // Avatar / Model Render
                            if (tryOnState.mode == TryOnViewMode.myAvatar || tryOnState.mode == TryOnViewMode.both)
                              Center(
                                child: AvatarWidget(
                                  skinTone: userProfile.skinTone,
                                  hairStyle: userProfile.hairStyle,
                                  size: tryOnState.mode == TryOnViewMode.both ? 160 : 230,
                                  showGoldBackdrop: false,
                                  topGarmentColor: tryOnState.top != null ? _parseColor(tryOnState.top!.color) : null,
                                  bottomGarmentColor: tryOnState.bottom != null ? _parseColor(tryOnState.bottom!.color) : null,
                                ),
                              )
                            else
                              // Model Illustration
                              Center(
                                child: AvatarWidget(
                                  skinTone: '#D4A373',
                                  hairStyle: 'Modern Crop',
                                  size: 230,
                                  showGoldBackdrop: false,
                                  topGarmentColor: tryOnState.top != null ? _parseColor(tryOnState.top!.color) : null,
                                  bottomGarmentColor: tryOnState.bottom != null ? _parseColor(tryOnState.bottom!.color) : null,
                                ),
                              ),

                            // Floating Active Pieces Capsule
                            Positioned(
                              bottom: 12,
                              left: 12,
                              right: 12,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                decoration: BoxDecoration(
                                  color: colors.card.withValues(alpha: 0.92),
                                  borderRadius: BorderRadius.circular(14),
                                  border: Border.all(color: colors.border),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Text(
                                          'ACTIVE ENSEMBLE',
                                          style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700).copyWith(fontSize: 8.5),
                                        ),
                                        Text(
                                          '${tryOnState.activeItems.length} Pieces Fitted',
                                          style: OtdTokens.label(color: colors.textPrimary, weight: FontWeight.w600).copyWith(fontSize: 11),
                                        ),
                                      ],
                                    ),
                                    Icon(Iconsax.tick_circle, color: colors.accent, size: 16),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),

                    // Right-Hand Vertical Column of Thumbnails (Screen 20)
                    Expanded(
                      flex: 3,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _buildGarmentSlot(
                            label: 'Top',
                            item: tryOnState.top,
                            category: GarmentCategory.tops,
                            colors: colors,
                          ),
                          _buildGarmentSlot(
                            label: 'Bottom',
                            item: tryOnState.bottom,
                            category: GarmentCategory.bottoms,
                            colors: colors,
                          ),
                          _buildGarmentSlot(
                            label: 'Outerwear',
                            item: tryOnState.outerwear,
                            category: GarmentCategory.outerwear,
                            colors: colors,
                          ),
                          _buildGarmentSlot(
                            label: 'Shoes',
                            item: tryOnState.footwear,
                            category: GarmentCategory.footwear,
                            colors: colors,
                          ),
                          _buildGarmentSlot(
                            label: 'Accessory',
                            item: tryOnState.accessory,
                            category: GarmentCategory.accessories,
                            colors: colors,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),

              // Save This Look Button (Screen 20)
              OtdButton(
                text: 'SAVE THIS LOOK',
                icon: const Icon(Iconsax.bookmark, size: 18, color: Colors.white),
                isFullWidth: true,
                onPressed: () => _saveCurrentLook(context, tryOnState, userProfile),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSegmentButton({
    required String label,
    required bool isSelected,
    required OtdColors colors,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? colors.accent : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: OtdTokens.label(
              color: isSelected ? AppTheme.noir : colors.textSecondary,
              weight: isSelected ? FontWeight.w700 : FontWeight.w500,
            ).copyWith(fontSize: 11),
          ),
        ),
      ),
    );
  }

  Widget _buildGarmentSlot({
    required String label,
    required WardrobeItem? item,
    required GarmentCategory category,
    required OtdColors colors,
  }) {
    return Expanded(
      child: GestureDetector(
        onTap: () => _openGarmentPicker(context, category, label),
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 3),
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: item != null ? colors.accent.withValues(alpha: 0.6) : colors.border,
              width: item != null ? 1.5 : 1.0,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (item != null)
                Expanded(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LuxuryImage(
                      imageUrl: item.imageUrl,
                      fit: BoxFit.cover,
                      fallbackIcon: item.icon,
                    ),
                  ),
                )
              else
                Icon(Iconsax.add, size: 20, color: colors.textMuted),
              const SizedBox(height: 2),
              Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: OtdTokens.caption(
                  color: item != null ? colors.accent : colors.textMuted,
                  weight: FontWeight.w600,
                ).copyWith(fontSize: 8.5),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color _parseColor(String colorName) {
    final lower = colorName.toLowerCase();
    if (lower.contains('blue') || lower.contains('navy')) return const Color(0xFF1E3A8A);
    if (lower.contains('cream') || lower.contains('ivory') || lower.contains('white')) return const Color(0xFFF7EFE0);
    if (lower.contains('black') || lower.contains('charcoal')) return const Color(0xFF18181B);
    if (lower.contains('beige') || lower.contains('tan') || lower.contains('khaki')) return const Color(0xFFD4A373);
    if (lower.contains('green') || lower.contains('olive')) return const Color(0xFF3F6212);
    return const Color(0xFF4A4036);
  }
}
