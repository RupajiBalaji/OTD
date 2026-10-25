import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/widgets/luxury_image.dart';
import '../../../shared/widgets/otd_button.dart';
import '../../../shared/widgets/otd_card.dart';
import '../../../shared/widgets/otd_chip.dart';
import '../../../shared/widgets/selectable_tile.dart';
import '../../../shared/widgets/step_progress.dart';
import '../../destinations/venue_repository.dart';
import '../outfits_repository.dart';
import '../plan_look_provider.dart';

class PlanYourLookScreen extends ConsumerStatefulWidget {
  const PlanYourLookScreen({super.key});

  @override
  ConsumerState<PlanYourLookScreen> createState() => _PlanYourLookScreenState();
}

class _PlanYourLookScreenState extends ConsumerState<PlanYourLookScreen> {
  final PageController _pageController = PageController();
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _customOccasionController = TextEditingController();
  int _venueTab = 0; // 0: Recent, 1: Popular, 2: Saved

  @override
  void dispose() {
    _pageController.dispose();
    _searchController.dispose();
    _customOccasionController.dispose();
    super.dispose();
  }

  void _goToStep(int step) {
    ref.read(planLookProvider.notifier).setStep(step);
    _pageController.animateToPage(
      step,
      duration: const Duration(milliseconds: 280),
      curve: Curves.easeInOut,
    );
  }

  void _handleBack() {
    final state = ref.read(planLookProvider);
    if (state.currentStep > 0) {
      _goToStep(state.currentStep - 1);
    } else {
      context.pop();
    }
  }

  void _handleNext() {
    final state = ref.read(planLookProvider);
    if (state.currentStep < 3) {
      _goToStep(state.currentStep + 1);
    } else {
      // Trigger curation & route to AI Loading
      final venue = state.effectiveVenueName;
      final occasion = state.effectiveOccasion;
      final mood = state.mood;
      final weather = state.weatherSnapshot?.summary ?? '24°C • Pleasant';

      ref.read(curatedOutfitProvider.notifier).curateOutfit(
            venue: venue,
            occasion: occasion,
            vibe: mood,
            weather: weather,
          );

      context.push('/plan/loading');
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);
    final state = ref.watch(planLookProvider);

    return Scaffold(
      backgroundColor: colors.canvas,
      body: SafeArea(
        child: Column(
          children: [
            // Top Step Progress Indicator
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: OtdTokens.screenPaddingH,
                vertical: 12,
              ),
              child: StepProgress(
                currentStep: state.currentStep + 1,
                totalSteps: 4,
                stepLabel: 'STEP ${state.currentStep + 1} OF 4',
                onBack: _handleBack,
              ),
            ),

            // Wizard Step Pages
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const NeverScrollableScrollPhysics(),
                children: [
                  _buildStep1Venue(context, colors, state),
                  _buildStep2Occasion(context, colors, state),
                  _buildStep3Mood(context, colors, state),
                  _buildStep4Weather(context, colors, state),
                ],
              ),
            ),

            // Bottom Navigation Action
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: OtdTokens.screenPaddingH,
                vertical: 16,
              ),
              child: OtdButton(
                text: state.currentStep == 3 ? 'Create My Look' : 'Next',
                variant: state.currentStep == 3
                    ? OtdButtonVariant.gold
                    : OtdButtonVariant.primary,
                suffixIcon: state.currentStep == 3
                    ? const Icon(Iconsax.magic_star, size: 18)
                    : const Icon(Icons.arrow_forward, size: 18),
                onPressed: _isCurrentStepValid(state) ? _handleNext : null,
              ),
            ),
          ],
        ),
      ),
    );
  }

  bool _isCurrentStepValid(PlanLookState state) {
    switch (state.currentStep) {
      case 0:
        return state.isStep1Valid;
      case 1:
        return state.isStep2Valid;
      case 2:
        return state.isStep3Valid;
      case 3:
        return state.isStep4Valid;
      default:
        return true;
    }
  }

  // STEP 1: WHERE ARE YOU GOING?
  Widget _buildStep1Venue(
      BuildContext context, OtdColors colors, PlanLookState state) {
    final venueRepo = ref.watch(venueRepositoryProvider);

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(
        horizontal: OtdTokens.screenPaddingH,
        vertical: 8,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Where are you going?',
            style: OtdTokens.headingLarge(
              color: colors.textPrimary,
              weight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Select your venue or destination so AI can calibrate ambient lighting and dress codes.',
            style: OtdTokens.bodyMedium(color: colors.textMuted),
          ),

          const SizedBox(height: 20),

          // Search Field
          TextField(
            controller: _searchController,
            style: OtdTokens.bodyMedium(color: colors.textPrimary),
            decoration: InputDecoration(
              hintText: 'Search restaurants, lounges, galas...',
              prefixIcon: Icon(Iconsax.search_normal, size: 18, color: colors.textMuted),
            ),
            onChanged: (val) {
              setState(() {});
              ref.read(planLookProvider.notifier).setCustomVenue(val);
            },
          ),

          const SizedBox(height: 14),

          // Use Current Location Row
          InkWell(
            onTap: () {
              ref.read(planLookProvider.notifier).setCustomVenue('Current Location (Nearby)');
              _searchController.text = 'Current Location (Nearby)';
            },
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: colors.card,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: colors.border),
              ),
              child: Row(
                children: [
                  Icon(Iconsax.location, size: 20, color: colors.accent),
                  const SizedBox(width: 10),
                  Text(
                    'Use current location',
                    style: OtdTokens.bodyMedium(
                      color: colors.textPrimary,
                      weight: FontWeight.w600,
                    ),
                  ),
                  const Spacer(),
                  Icon(Icons.arrow_forward_ios, size: 14, color: colors.textMuted),
                ],
              ),
            ),
          ),

          const SizedBox(height: 22),

          // Venue Category Filter Tabs
          Row(
            children: [
              _buildVenueTabChip(0, 'Recent', colors),
              const SizedBox(width: 8),
              _buildVenueTabChip(1, 'Popular', colors),
              const SizedBox(width: 8),
              _buildVenueTabChip(2, 'Saved', colors),
            ],
          ),

          const SizedBox(height: 18),

          // Venue List
          FutureBuilder<List<VenueItem>>(
            future: _searchController.text.trim().isNotEmpty
                ? venueRepo.searchVenues(_searchController.text.trim())
                : _venueTab == 0
                    ? venueRepo.getRecentVenues()
                    : _venueTab == 1
                        ? venueRepo.getPopularVenues()
                        : venueRepo.getSavedVenues(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(
                  child: Padding(
                    padding: EdgeInsets.all(32),
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                );
              }
              final venues = snapshot.data ?? [];
              if (venues.isEmpty) {
                return Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Text(
                      'No matching destinations found.',
                      style: OtdTokens.bodyMedium(color: colors.textMuted),
                    ),
                  ),
                );
              }

              return ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: venues.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  final v = venues[index];
                  final isSelected = state.venue?.id == v.id;

                  return OtdCard(
                    padding: const EdgeInsets.all(12),
                    borderRadius: 16,
                    borderColor: isSelected ? colors.accent : colors.border,
                    borderWidth: isSelected ? 1.5 : 1.0,
                    color: isSelected ? colors.accentTint : colors.card,
                    onTap: () {
                      ref.read(planLookProvider.notifier).setVenue(v);
                      _searchController.clear();
                    },
                    child: Row(
                      children: [
                        LuxuryImage(
                          imageUrl: v.imageUrl,
                          width: 58,
                          height: 58,
                          borderRadius: 12,
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                v.name,
                                style: OtdTokens.headingSmall(
                                  color: isSelected
                                      ? (colors.isDark ? colors.accent : OtdTokens.goldDeep)
                                      : colors.textPrimary,
                                  weight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(height: 3),
                              Text(
                                '${v.category} • ${v.location}',
                                style: OtdTokens.bodySmall(color: colors.textMuted),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                        if (isSelected)
                          Container(
                            width: 22,
                            height: 22,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: colors.accent,
                            ),
                            child: const Icon(Icons.check, size: 14, color: OtdTokens.white),
                          ),
                      ],
                    ),
                  );
                },
              );
            },
          ),

          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildVenueTabChip(int index, String label, OtdColors colors) {
    final isSelected = _venueTab == index;
    return OtdChip(
      label: label,
      isSelected: isSelected,
      onTap: () => setState(() => _venueTab = index),
    );
  }

  // STEP 2: WHAT'S THE OCCASION?
  Widget _buildStep2Occasion(
      BuildContext context, OtdColors colors, PlanLookState state) {
    final occasions = [
      {'title': 'Date', 'subtitle': 'Alluring & Romantic', 'icon': Iconsax.heart},
      {'title': 'Casual', 'subtitle': 'Relaxed Comfort', 'icon': Iconsax.coffee},
      {'title': 'Work', 'subtitle': 'Sharp Corporate', 'icon': Iconsax.briefcase},
      {'title': 'College', 'subtitle': 'Effortless Campus', 'icon': Iconsax.book},
      {'title': 'Party', 'subtitle': 'High-Energy Nightlife', 'icon': Iconsax.music},
      {'title': 'Wedding', 'subtitle': 'Luxury Gala', 'icon': Iconsax.crown},
      {'title': 'Travel', 'subtitle': 'Packable Chic', 'icon': Iconsax.airplane},
      {'title': 'Custom', 'subtitle': 'Personalized Event', 'icon': Iconsax.edit},
    ];

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(
        horizontal: OtdTokens.screenPaddingH,
        vertical: 8,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "What's the occasion?",
            style: OtdTokens.headingLarge(
              color: colors.textPrimary,
              weight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Tell us what you are dressing for so we can set the appropriate formality and cuts.',
            style: OtdTokens.bodyMedium(color: colors.textMuted),
          ),

          const SizedBox(height: 20),

          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 1.25,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
            ),
            itemCount: occasions.length,
            itemBuilder: (context, index) {
              final occ = occasions[index];
              final title = occ['title'] as String;
              final subtitle = occ['subtitle'] as String;
              final icon = occ['icon'] as IconData;
              final isSelected = state.occasion == title;

              return SelectableTile(
                title: title,
                subtitle: subtitle,
                icon: Icon(
                  icon,
                  size: 26,
                  color: isSelected ? colors.accent : colors.textMuted,
                ),
                isSelected: isSelected,
                onTap: () {
                  ref.read(planLookProvider.notifier).setOccasion(title);
                },
              );
            },
          ),

          if (state.occasion == 'Custom') ...[
            const SizedBox(height: 20),
            Text(
              'SPECIFY YOUR OCCASION',
              style: OtdTokens.label(color: colors.textSecondary, letterSpacing: 1.0),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _customOccasionController,
              style: OtdTokens.bodyMedium(color: colors.textPrimary),
              decoration: const InputDecoration(
                hintText: 'e.g. Art Gallery Vernissage, Rooftop Birthday',
              ),
              onChanged: (val) {
                ref
                    .read(planLookProvider.notifier)
                    .setOccasion('Custom', customText: val);
              },
            ),
          ],

          const SizedBox(height: 24),
        ],
      ),
    );
  }

  // STEP 3: HOW DO YOU WANT TO FEEL? (MOOD)
  Widget _buildStep3Mood(
      BuildContext context, OtdColors colors, PlanLookState state) {
    final moods = [
      {'title': 'Elegant', 'subtitle': 'Quiet luxury & refined lines'},
      {'title': 'Attractive', 'subtitle': 'Alluring & confident appeal'},
      {'title': 'Confident', 'subtitle': 'Commanding modern architecture'},
      {'title': 'Casual', 'subtitle': 'Approachable & laid back'},
      {'title': 'Comfortable', 'subtitle': 'Unrestricted natural flow'},
      {'title': 'Mysterious', 'subtitle': 'Deep tonal layering'},
      {'title': 'Romantic', 'subtitle': 'Soft textures & intimate vibe'},
      {'title': 'Effortless', 'subtitle': 'French undone sophistication'},
    ];

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(
        horizontal: OtdTokens.screenPaddingH,
        vertical: 8,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'How do you want to feel?',
            style: OtdTokens.headingLarge(
              color: colors.textPrimary,
              weight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Choose the emotional energy and fashion persona you want to project today.',
            style: OtdTokens.bodyMedium(color: colors.textMuted),
          ),

          const SizedBox(height: 20),

          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 1.35,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
            ),
            itemCount: moods.length,
            itemBuilder: (context, index) {
              final m = moods[index];
              final title = m['title']!;
              final subtitle = m['subtitle']!;
              final isSelected = state.mood == title;

              return SelectableTile(
                title: title,
                subtitle: subtitle,
                isSelected: isSelected,
                onTap: () {
                  ref.read(planLookProvider.notifier).setMood(title);
                },
              );
            },
          ),

          const SizedBox(height: 24),
        ],
      ),
    );
  }

  // STEP 4: WEATHER & TIME
  Widget _buildStep4Weather(
      BuildContext context, OtdColors colors, PlanLookState state) {
    final weather = state.weatherSnapshot;

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(
        horizontal: OtdTokens.screenPaddingH,
        vertical: 8,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Weather & Timing',
            style: OtdTokens.headingLarge(
              color: colors.textPrimary,
              weight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'AI cross-references micro-climate temperatures with your destination timing.',
            style: OtdTokens.bodyMedium(color: colors.textMuted),
          ),

          const SizedBox(height: 20),

          // Weather Card
          OtdCard(
            padding: const EdgeInsets.all(20),
            borderRadius: 20,
            color: colors.card,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          state.effectiveVenueName,
                          style: OtdTokens.headingSmall(
                            color: colors.textPrimary,
                            weight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          weather?.city ?? 'Local Climate',
                          style: OtdTokens.bodySmall(color: colors.textMuted),
                        ),
                      ],
                    ),
                    Text(
                      weather?.icon ?? '⛅',
                      style: const TextStyle(fontSize: 32),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '${weather?.temperature ?? 24}°C',
                      style: OtdTokens.headingLarge(
                        color: colors.isDark ? colors.accent : OtdTokens.goldDeep,
                        weight: FontWeight.w700,
                      ).copyWith(fontSize: 40),
                    ),
                    const SizedBox(width: 12),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: Text(
                        weather?.condition ?? 'Pleasant & Mild',
                        style: OtdTokens.bodyLarge(
                          color: colors.textSecondary,
                          weight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),
                Divider(color: colors.border),
                const SizedBox(height: 12),

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildWeatherStat(
                      Iconsax.drop,
                      'HUMIDITY',
                      '${weather?.humidity ?? 55}%',
                      colors,
                    ),
                    _buildWeatherStat(
                      Iconsax.wind_2,
                      'WIND',
                      '${weather?.windSpeedKmH ?? 12} km/h',
                      colors,
                    ),
                    _buildWeatherStat(
                      Iconsax.sun_1,
                      'THERMAL FIT',
                      'Optimal',
                      colors,
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // When? Segmented Options
          Text(
            'WHEN ARE YOU WEARING THIS?',
            style: OtdTokens.label(color: colors.textSecondary, letterSpacing: 1.0),
          ),
          const SizedBox(height: 10),
          Row(
            children: ['Now', 'Later', 'Custom'].map((w) {
              final isSelected = state.whenOption == w;
              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: OtdChip(
                    label: w,
                    isSelected: isSelected,
                    height: 44,
                    onTap: () =>
                        ref.read(planLookProvider.notifier).setWhen(w),
                  ),
                ),
              );
            }).toList(),
          ),

          const SizedBox(height: 20),

          // Time Dropdown / Picker
          Text(
            'SELECT TIME',
            style: OtdTokens.label(color: colors.textSecondary, letterSpacing: 1.0),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: colors.card,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: colors.border),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(Iconsax.clock, size: 20, color: colors.accent),
                    const SizedBox(width: 10),
                    Text(
                      state.selectedTime,
                      style: OtdTokens.bodyMedium(
                        color: colors.textPrimary,
                        weight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: state.selectedTime,
                    icon: Icon(Icons.keyboard_arrow_down, color: colors.textMuted),
                    dropdownColor: colors.card,
                    items: ['12:30 PM', '4:00 PM', '7:00 PM', '8:00 PM', '9:30 PM']
                        .map((t) => DropdownMenuItem(
                              value: t,
                              child: Text(
                                t,
                                style: OtdTokens.bodyMedium(color: colors.textPrimary),
                              ),
                            ))
                        .toList(),
                    onChanged: (val) {
                      if (val != null) {
                        ref
                            .read(planLookProvider.notifier)
                            .setWhen(state.whenOption, time: val);
                      }
                    },
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildWeatherStat(
      IconData icon, String label, String value, OtdColors colors) {
    return Column(
      children: [
        Icon(icon, size: 18, color: colors.accent),
        const SizedBox(height: 4),
        Text(
          label,
          style: OtdTokens.label(
            color: colors.textMuted,
            letterSpacing: 0.8,
          ).copyWith(fontSize: 10),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: OtdTokens.bodySmall(
            color: colors.textPrimary,
            weight: FontWeight.w700,
          ),
        ),
      ],
    );
  }
}
