import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/widgets/luxury_image.dart';
import '../../../shared/widgets/otd_button.dart';
import '../../destinations/venue_repository.dart';
import '../plan_look_provider.dart';

class DestinationsScreen extends ConsumerWidget {
  const DestinationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = OtdColors.of(context);
    final venueRepo = ref.watch(venueRepositoryProvider);

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
              'VENUE & LOCATION MATRIX',
              style: OtdTokens.caption(
                color: colors.accent,
                weight: FontWeight.w700,
              ).copyWith(letterSpacing: 2.0),
            ),
            Text(
              'Curated Destinations',
              style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: FutureBuilder<List<VenueItem>>(
          future: venueRepo.getPopularVenues(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator(color: AppTheme.gold));
            }
            final venues = snapshot.data ?? [];

            return ListView.separated(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(
                horizontal: OtdTokens.screenPaddingH,
                vertical: 16,
              ),
              itemCount: venues.length,
              separatorBuilder: (_, __) => const SizedBox(height: 18),
              itemBuilder: (context, index) {
                final venue = venues[index];

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
                  // Venue Image with Category & Dress Code Pills
                  Stack(
                    children: [
                      SizedBox(
                        height: 190,
                        width: double.infinity,
                        child: LuxuryImage(
                          imageUrl: venue.imageUrl,
                          fit: BoxFit.cover,
                        ),
                      ),
                      Positioned(
                        top: 12,
                        left: 12,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.75),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: colors.accent.withValues(alpha: 0.5)),
                          ),
                          child: Text(
                            venue.category.toUpperCase(),
                            style: const TextStyle(
                              fontSize: 9.5,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.gold,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        top: 12,
                        right: 12,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.75),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Text(
                            venue.dressCode,
                            style: const TextStyle(
                              fontSize: 9.5,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),

                  // Venue Details & Dress For Destination Button
                  Padding(
                    padding: const EdgeInsets.all(18),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                venue.name,
                                style: OtdTokens.headingMedium(color: colors.textPrimary, weight: FontWeight.w700).copyWith(fontSize: 21),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: colors.canvas,
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(color: colors.border),
                              ),
                              child: Text(
                                venue.isIndoor ? 'Indoor' : 'Outdoor',
                                style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Icon(Iconsax.location, size: 13, color: colors.accent),
                            const SizedBox(width: 4),
                            Text(
                              venue.city,
                              style: OtdTokens.caption(color: colors.textSecondary),
                            ),
                            const SizedBox(width: 8),
                            Text('·', style: TextStyle(color: colors.textMuted)),
                            const SizedBox(width: 8),
                            Text(
                              venue.vibe,
                              style: OtdTokens.caption(color: colors.textSecondary),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '${venue.ambience} setting in ${venue.location}. Recommended aesthetic: ${venue.vibe}.',
                          style: OtdTokens.bodySmall(color: colors.textSecondary),
                        ),
                        const SizedBox(height: 16),

                        OtdButton(
                          text: 'DRESS FOR THIS VENUE',
                          icon: const Icon(Iconsax.magic_star, size: 18, color: Colors.white),
                          isFullWidth: true,
                          onPressed: () {
                            ref.read(planLookProvider.notifier).setVenue(venue);
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
        );
      },
    ),
  ),
);
}
}
