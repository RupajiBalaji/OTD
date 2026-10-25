import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/widgets/otd_button.dart';
import '../../../shared/widgets/otd_card.dart';
import '../outfits_repository.dart';

class WhyThisLookScreen extends ConsumerWidget {
  const WhyThisLookScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = OtdColors.of(context);
    final outfit = ref.watch(curatedOutfitProvider).value;
    final profile = ref.watch(userProfileProvider);

    if (outfit == null) {
      return Scaffold(
        backgroundColor: colors.canvas,
        body: Center(
          child: OtdButton(
            text: 'Return Home',
            width: 160,
            onPressed: () => context.go('/home'),
          ),
        ),
      );
    }

    final rationales = [
      {
        'icon': Iconsax.heart,
        'title': 'Occasion Synergy',
        'subtitle': 'Formality & Cut Balance',
        'body':
            'Formality index calibrated for ${outfit.venue}. Structured shoulder lines paired with tailored fluidity match ambient expectations.',
      },
      {
        'icon': Iconsax.sun_1,
        'title': 'Weather Adaptation',
        'subtitle': 'Thermal & Fiber Responsiveness',
        'body': outfit.weatherRationale,
      },
      {
        'icon': Iconsax.magic_star,
        'title': 'Style Calibration',
        'subtitle': 'Personal Persona Match',
        'body':
            'Synthesizes your ${profile.stylePersonas.join(' & ')} aesthetic with proportional fit flattering your ${profile.bodyShape} silhouette.',
      },
      {
        'icon': Iconsax.colorfilter,
        'title': 'Colour Harmony',
        'subtitle': 'Tonal Contrast & Palettes',
        'body': outfit.paletteRationale,
      },
      {
        'icon': Icons.checkroom,
        'title': 'Wardrobe Synergy',
        'subtitle': 'Ambient Destination Fit',
        'body': outfit.venueRationale,
      },
    ];

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        backgroundColor: colors.canvas,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 20, color: colors.textPrimary),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(
                  horizontal: OtdTokens.screenPaddingH,
                  vertical: 8,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Why this look?',
                      style: OtdTokens.headingLarge(
                        color: colors.textPrimary,
                        weight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'How OTD fashion intelligence arrived at this recommendation.',
                      style: OtdTokens.bodyMedium(color: colors.textMuted),
                    ),

                    const SizedBox(height: 24),

                    // Rationale Cards List
                    ...rationales.map((item) {
                      final icon = item['icon'] as IconData;
                      final title = item['title'] as String;
                      final subtitle = item['subtitle'] as String;
                      final body = item['body'] as String;

                      return Padding(
                        padding: const EdgeInsets.only(bottom: 14),
                        child: OtdCard(
                          padding: const EdgeInsets.all(18),
                          borderRadius: 18,
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: colors.accentTint,
                                  border: Border.all(
                                    color: colors.accent.withValues(alpha: 0.3),
                                  ),
                                ),
                                child: Center(
                                  child: Icon(
                                    icon,
                                    size: 20,
                                    color: colors.accent,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      title,
                                      style: OtdTokens.headingSmall(
                                        color: colors.textPrimary,
                                        weight: FontWeight.w700,
                                      ),
                                    ),
                                    Text(
                                      subtitle,
                                      style: OtdTokens.label(
                                        color: colors.accentDeep,
                                        weight: FontWeight.w600,
                                      ).copyWith(fontSize: 11),
                                    ),
                                    const SizedBox(height: 6),
                                    Text(
                                      body,
                                      style: OtdTokens.bodyMedium(
                                        color: colors.textSecondary,
                                      ).copyWith(height: 1.4),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),

                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ),

            // Bottom Done Action
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: OtdTokens.screenPaddingH,
                vertical: 16,
              ),
              child: OtdButton(
                text: 'Done',
                onPressed: () => context.go('/home'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
