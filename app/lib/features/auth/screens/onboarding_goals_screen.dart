import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/widgets/otd_button.dart';
import '../../../shared/widgets/selectable_tile.dart';
import '../../../shared/widgets/step_progress.dart';
import '../auth_state_provider.dart';
import '../../outfits/outfits_repository.dart';

class OnboardingGoalsScreen extends ConsumerStatefulWidget {
  const OnboardingGoalsScreen({super.key});

  @override
  ConsumerState<OnboardingGoalsScreen> createState() => _OnboardingGoalsScreenState();
}

class _OnboardingGoalsScreenState extends ConsumerState<OnboardingGoalsScreen> {
  final Set<String> _selectedGoals = {'Everyday Looks', 'Work/Office'};

  final List<Map<String, dynamic>> _goalsList = [
    {
      'title': 'Everyday Looks',
      'subtitle': 'Effortless daily chic for any regular day',
      'icon': Iconsax.sun_1,
    },
    {
      'title': 'Work/Office',
      'subtitle': 'Professional, polished corporate styling',
      'icon': Iconsax.briefcase,
    },
    {
      'title': 'College',
      'subtitle': 'Trendy, relaxed campus fits & layers',
      'icon': Iconsax.book,
    },
    {
      'title': 'Parties',
      'subtitle': 'Standout evening & nightlife glamour',
      'icon': Iconsax.music,
    },
    {
      'title': 'Travel',
      'subtitle': 'Wrinkle-resistant, versatile packable looks',
      'icon': Iconsax.airplane,
    },
    {
      'title': 'Events',
      'subtitle': 'Curated high-profile & art gallery looks',
      'icon': Iconsax.crown,
    },
    {
      'title': 'Weddings',
      'subtitle': 'Celebratory elegance & luxury attire',
      'icon': Iconsax.magic_star,
    },
    {
      'title': 'Dates',
      'subtitle': 'Alluring, romantic & memorable cuts',
      'icon': Iconsax.heart,
    },
  ];

  @override
  void initState() {
    super.initState();
    final profile = ref.read(userProfileProvider);
    if (profile.goals.isNotEmpty) {
      _selectedGoals.clear();
      _selectedGoals.addAll(profile.goals);
    }
  }

  Future<void> _handleComplete() async {
    if (_selectedGoals.isEmpty) return;

    final current = ref.read(userProfileProvider);
    final updated = current.copyWith(
      goals: _selectedGoals.toList(),
    );
    ref.read(userProfileProvider.notifier).updateProfile(updated);

    // Mark onboarding done in persistent session
    await ref.read(authNotifierProvider.notifier).completeOnboarding();

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Welcome to OTD, ${updated.name}! Your wardrobe is ready.'),
          backgroundColor: OtdTokens.goldDeep,
          behavior: SnackBarBehavior.floating,
        ),
      );
      context.go('/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);

    return Scaffold(
      backgroundColor: colors.canvas,
      body: SafeArea(
        child: Column(
          children: [
            // Top Step Progress
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: OtdTokens.screenPaddingH,
                vertical: 12,
              ),
              child: StepProgress(
                currentStep: 3,
                totalSteps: 3,
                stepLabel: 'YOUR GOALS • 3/3',
                onBack: () => context.go('/onboarding/style'),
              ),
            ),

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
                      'What are your goals?',
                      style: OtdTokens.headingLarge(
                        color: colors.textPrimary,
                        weight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Select the moments you want OTD to inspire and elevate. You can select multiple.',
                      style: OtdTokens.bodyMedium(color: colors.textMuted),
                    ),

                    const SizedBox(height: 20),

                    // 2-Column Grid of Goals
                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 1.15,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                      ),
                      itemCount: _goalsList.length,
                      itemBuilder: (context, index) {
                        final item = _goalsList[index];
                        final title = item['title'] as String;
                        final subtitle = item['subtitle'] as String;
                        final icon = item['icon'] as IconData;
                        final isSelected = _selectedGoals.contains(title);

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
                            setState(() {
                              if (isSelected) {
                                if (_selectedGoals.length > 1) {
                                  _selectedGoals.remove(title);
                                }
                              } else {
                                _selectedGoals.add(title);
                              }
                            });
                          },
                        );
                      },
                    ),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),

            // Bottom Complete Profile Button
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: OtdTokens.screenPaddingH,
                vertical: 16,
              ),
              child: OtdButton(
                text: 'Complete Profile',
                onPressed: _selectedGoals.isNotEmpty ? _handleComplete : null,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
