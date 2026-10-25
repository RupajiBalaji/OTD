import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/widgets/luxury_image.dart';
import '../../../shared/widgets/otd_button.dart';
import '../plan_look_provider.dart';

class EditorialLookIdea {
  final String title;
  final String tag;
  final String img;
  final String desc;
  final String occasion;
  final String vibe;

  const EditorialLookIdea({
    required this.title,
    required this.tag,
    required this.img,
    required this.desc,
    required this.occasion,
    required this.vibe,
  });
}

class OutfitIdeasScreen extends ConsumerWidget {
  const OutfitIdeasScreen({super.key});

  static const List<EditorialLookIdea> ideas = [
    EditorialLookIdea(
      title: 'The Milanese Tailored Linen',
      tag: 'Summer Sartorial',
      img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      desc: 'Breathable oatmeal linen trousers paired with open camp collar shirt and hand-finished Belgian loafers.',
      occasion: 'Date',
      vibe: 'Confident',
    ),
    EditorialLookIdea(
      title: 'The Parisian Monochrome',
      tag: 'Minimalist Date',
      img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      desc: 'All-black high-neck cashmere sweater with sharp wool trousers and understated Chelsea boots.',
      occasion: 'Evening',
      vibe: 'Mysterious',
    ),
    EditorialLookIdea(
      title: 'The Riviera Seaside Resort',
      tag: 'Effortless Vacation',
      img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
      desc: 'Crisp sand linen overshirt with white Gurkha shorts, tortoise sunglasses, and clean canvas low-tops.',
      occasion: 'Travel',
      vibe: 'Comfortable',
    ),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = OtdColors.of(context);

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
              'EDITORIAL LOOKBOOK',
              style: OtdTokens.caption(
                color: colors.accent,
                weight: FontWeight.w700,
              ).copyWith(letterSpacing: 2.0),
            ),
            Text(
              'Outfit Ideas',
              style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: ListView.separated(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(
            horizontal: OtdTokens.screenPaddingH,
            vertical: 16,
          ),
          itemCount: ideas.length,
          separatorBuilder: (_, __) => const SizedBox(height: 18),
          itemBuilder: (context, index) {
            final idea = ideas[index];

            return Container(
              decoration: BoxDecoration(
                color: colors.card,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: colors.border),
                boxShadow: OtdTokens.softShadow(isDark: colors.isDark, blur: 14, offsetY: 4),
              ),
              clipBehavior: Clip.antiAlias,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Full-width luxury photo
                  Stack(
                    children: [
                      SizedBox(
                        height: 210,
                        width: double.infinity,
                        child: LuxuryImage(
                          imageUrl: idea.img,
                          fit: BoxFit.cover,
                        ),
                      ),
                      Positioned(
                        top: 12,
                        left: 12,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.7),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: colors.accent.withValues(alpha: 0.5)),
                          ),
                          child: Text(
                            idea.tag.toUpperCase(),
                            style: const TextStyle(
                              fontSize: 9.5,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.gold,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),

                  // Content & Action
                  Padding(
                    padding: const EdgeInsets.all(18),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          idea.title,
                          style: OtdTokens.headingMedium(color: colors.textPrimary, weight: FontWeight.w700).copyWith(fontSize: 20),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          idea.desc,
                          style: OtdTokens.bodySmall(color: colors.textSecondary),
                        ),
                        const SizedBox(height: 16),
                        OtdButton(
                          text: 'RECREATE WITH MY CLOSET',
                          icon: const Icon(Iconsax.magic_star, size: 18, color: Colors.white),
                          isFullWidth: true,
                          onPressed: () {
                            ref.read(planLookProvider.notifier).setOccasion(idea.occasion);
                            ref.read(planLookProvider.notifier).setMood(idea.vibe);
                            Navigator.pop(context);
                            context.push('/plan');
                          },
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
    );
  }
}
