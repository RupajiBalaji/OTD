import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/widgets/avatar_widget.dart';
import '../../../shared/widgets/otd_button.dart';
import '../../../shared/widgets/otd_chip.dart';
import '../../outfits/outfits_repository.dart';
import '../../try_on/try_on_renderer.dart';

class AvatarScreen extends ConsumerStatefulWidget {
  const AvatarScreen({super.key});

  @override
  ConsumerState<AvatarScreen> createState() => _AvatarScreenState();
}

class _AvatarScreenState extends ConsumerState<AvatarScreen> {
  final List<String> _skinTones = [
    '#F1C27D',
    '#E0AC69',
    '#D4A373',
    '#8D5524',
    '#603B1A',
  ];

  final List<String> _hairStyles = [
    'Classic Taper',
    'Modern Crop',
    'Classic Wave',
    'Sleek Bob',
    'Voluminous Updo',
  ];

  final List<String> _bodyShapes = [
    'Rectangle',
    'Hourglass',
    'Inverted Triangle',
    'Oval',
  ];

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
              context.go('/profile');
            }
          },
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'DIGITAL TWIN',
              style: OtdTokens.caption(
                color: colors.accent,
                weight: FontWeight.w700,
              ).copyWith(letterSpacing: 2.0),
            ),
            Text(
              'Your Avatar',
              style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(
            horizontal: OtdTokens.screenPaddingH,
            vertical: 12,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Large Avatar on Soft Gold Circle Stage (Screen 21)
              Center(
                child: Container(
                  width: 250,
                  height: 250,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: colors.card,
                    border: Border.all(color: colors.accent.withValues(alpha: 0.35), width: 2),
                    boxShadow: [
                      BoxShadow(
                        color: colors.accent.withValues(alpha: 0.18),
                        blurRadius: 36,
                        spreadRadius: 4,
                      ),
                    ],
                  ),
                  child: AvatarWidget(
                    skinTone: userProfile.skinTone,
                    hairStyle: userProfile.hairStyle,
                    size: 210,
                    showGoldBackdrop: true,
                    topGarmentColor: tryOnState.top != null ? _parseGarmentColor(tryOnState.top!.color) : null,
                    bottomGarmentColor: tryOnState.bottom != null ? _parseGarmentColor(tryOnState.bottom!.color) : null,
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Active Avatar Archetype & Silhouette Pill
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: colors.card,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: colors.border),
                ),
                child: Text(
                  '${userProfile.bodyShape.toUpperCase()} SILHOUETTE · ${userProfile.hairStyle.toUpperCase()}',
                  style: OtdTokens.caption(
                    color: colors.accent,
                    weight: FontWeight.w700,
                  ).copyWith(letterSpacing: 1.2),
                ),
              ),
              const SizedBox(height: 24),

              // Section: Preset Avatars Carousel
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'PRESET ARCHETYPES',
                  style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700).copyWith(letterSpacing: 1.5),
                ),
              ),
              const SizedBox(height: 10),
              SizedBox(
                height: 110,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  itemCount: AvatarPreset.presets.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 12),
                  itemBuilder: (context, idx) {
                    final preset = AvatarPreset.presets[idx];
                    final isSelected = userProfile.avatarId == preset.id;

                    return GestureDetector(
                      onTap: () {
                        ref.read(userProfileProvider.notifier).updateProfile(
                              userProfile.copyWith(
                                avatarId: preset.id,
                                skinTone: preset.skinToneHex,
                                hairStyle: preset.hairStyle,
                                bodyShape: preset.bodyShape,
                              ),
                            );
                      },
                      child: Container(
                        width: 90,
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: isSelected ? colors.accent.withValues(alpha: 0.12) : colors.card,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isSelected ? colors.accent : colors.border,
                            width: isSelected ? 1.5 : 1.0,
                          ),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            AvatarWidget(
                              skinTone: preset.skinToneHex,
                              hairStyle: preset.hairStyle,
                              size: 52,
                            ),
                            const SizedBox(height: 6),
                            Text(
                              preset.name.split(' ').first,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: OtdTokens.caption(
                                color: isSelected ? colors.accent : colors.textPrimary,
                                weight: isSelected ? FontWeight.w700 : FontWeight.w600,
                              ).copyWith(fontSize: 10),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),

              // Section: Edit Avatar (Skin tone, Hair, Body Shape)
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'CUSTOMIZE AVATAR',
                  style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700).copyWith(letterSpacing: 1.5),
                ),
              ),
              const SizedBox(height: 12),

              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: colors.card,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: colors.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 1. Skin Tone Swatches
                    Text('Complexion & Skin Tone', style: OtdTokens.label(color: colors.textSecondary)),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: _skinTones.map((tone) {
                        final isSelected = userProfile.skinTone.toUpperCase() == tone.toUpperCase();
                        final color = Color(int.parse('FF${tone.replaceAll('#', '')}', radix: 16));

                        return GestureDetector(
                          onTap: () {
                            ref.read(userProfileProvider.notifier).updateProfile(
                                  userProfile.copyWith(skinTone: tone),
                                );
                          },
                          child: Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: color,
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: isSelected ? colors.accent : Colors.black.withValues(alpha: 0.15),
                                width: isSelected ? 3 : 1,
                              ),
                              boxShadow: isSelected
                                  ? [
                                      BoxShadow(
                                        color: colors.accent.withValues(alpha: 0.4),
                                        blurRadius: 8,
                                      ),
                                    ]
                                  : null,
                            ),
                            child: isSelected ? const Icon(Icons.check, size: 18, color: Colors.white) : null,
                          ),
                        );
                      }).toList(),
                    ),
                    const Divider(height: 24),

                    // 2. Hair Style Chips
                    Text('Hair Silhouette', style: OtdTokens.label(color: colors.textSecondary)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _hairStyles.map((style) {
                        final isSelected = userProfile.hairStyle == style;
                        return OtdChip(
                          label: style,
                          isSelected: isSelected,
                          onTap: () {
                            ref.read(userProfileProvider.notifier).updateProfile(
                                  userProfile.copyWith(hairStyle: style),
                                );
                          },
                        );
                      }).toList(),
                    ),
                    const Divider(height: 24),

                    // 3. Body Shape Selector
                    Text('Body Shape Architecture', style: OtdTokens.label(color: colors.textSecondary)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _bodyShapes.map((shape) {
                        final isSelected = userProfile.bodyShape.toLowerCase() == shape.toLowerCase();
                        return OtdChip(
                          label: shape,
                          isSelected: isSelected,
                          onTap: () {
                            ref.read(userProfileProvider.notifier).updateProfile(
                                  userProfile.copyWith(bodyShape: shape),
                                );
                          },
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Action Buttons: Change Outfit (Opens Try-On) & Save
              OtdButton(
                text: 'CHANGE OUTFIT IN TRY-ON',
                icon: const Icon(Iconsax.magicpen, size: 18, color: Colors.white),
                isFullWidth: true,
                onPressed: () => context.push('/try-on'),
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }

  Color _parseGarmentColor(String name) {
    final lower = name.toLowerCase();
    if (lower.contains('blue') || lower.contains('navy')) return const Color(0xFF1E3A8A);
    if (lower.contains('cream') || lower.contains('ivory') || lower.contains('white')) return const Color(0xFFF7EFE0);
    if (lower.contains('black') || lower.contains('charcoal')) return const Color(0xFF18181B);
    if (lower.contains('beige') || lower.contains('tan') || lower.contains('khaki')) return const Color(0xFFD4A373);
    if (lower.contains('green') || lower.contains('olive')) return const Color(0xFF3F6212);
    return const Color(0xFF4A4036);
  }
}
