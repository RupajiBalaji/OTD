import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_images.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/widgets/otd_button.dart';
import '../../../shared/widgets/selectable_tile.dart';
import '../../../shared/widgets/step_progress.dart';
import '../../outfits/outfits_repository.dart';

class OnboardingStyleScreen extends ConsumerStatefulWidget {
  const OnboardingStyleScreen({super.key});

  @override
  ConsumerState<OnboardingStyleScreen> createState() => _OnboardingStyleScreenState();
}

class _OnboardingStyleScreenState extends ConsumerState<OnboardingStyleScreen> {
  final Set<String> _selectedStyles = {'Minimal', 'Smart Casual'};

  final List<Map<String, String>> _styleArchetypes = [
    {
      'title': 'Minimal',
      'subtitle': 'Clean lines, monochromatic & timeless',
      'image': AppImages.styleMinimal,
    },
    {
      'title': 'Casual',
      'subtitle': 'Relaxed, effortless every-day comfort',
      'image': AppImages.styleCasual,
    },
    {
      'title': 'Streetwear',
      'subtitle': 'Bold graphics, oversized silhouettes',
      'image': AppImages.styleStreetwear,
    },
    {
      'title': 'Formal',
      'subtitle': 'Sharp tailoring, structured elegance',
      'image': AppImages.styleFormal,
    },
    {
      'title': 'Smart Casual',
      'subtitle': 'Elevated essentials & crisp tailoring',
      'image': AppImages.styleSmartCasual,
    },
    {
      'title': 'Luxury',
      'subtitle': 'High-end fabrics, rich quiet luxury',
      'image': AppImages.styleLuxury,
    },
    {
      'title': 'Sporty',
      'subtitle': 'Athletic functionality & tech silhouettes',
      'image': AppImages.styleSporty,
    },
    {
      'title': 'Trendy',
      'subtitle': 'Current seasonal statements & bold cuts',
      'image': AppImages.styleTrendy,
    },
  ];

  @override
  void initState() {
    super.initState();
    final profile = ref.read(userProfileProvider);
    if (profile.stylePersonas.isNotEmpty) {
      _selectedStyles.clear();
      _selectedStyles.addAll(profile.stylePersonas);
    }
  }

  void _handleNext() {
    if (_selectedStyles.isEmpty) return;

    final current = ref.read(userProfileProvider);
    final updated = current.copyWith(
      stylePersonas: _selectedStyles.toList(),
    );
    ref.read(userProfileProvider.notifier).updateProfile(updated);
    context.go('/onboarding/goals');
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
                currentStep: 2,
                totalSteps: 3,
                stepLabel: 'STYLE PERSONAS • 2/3',
                onBack: () => context.go('/onboarding/about'),
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
                      "What's your style?",
                      style: OtdTokens.headingLarge(
                        color: colors.textPrimary,
                        weight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Choose style aesthetics that reflect your aesthetic preferences. You can select multiple.',
                      style: OtdTokens.bodyMedium(color: colors.textMuted),
                    ),

                    const SizedBox(height: 20),

                    // 2-Column Grid of Style Personas
                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.95,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                      ),
                      itemCount: _styleArchetypes.length,
                      itemBuilder: (context, index) {
                        final item = _styleArchetypes[index];
                        final title = item['title']!;
                        final subtitle = item['subtitle']!;
                        final imageUrl = item['image']!;
                        final isSelected = _selectedStyles.contains(title);

                        return SelectableTile(
                          title: title,
                          subtitle: subtitle,
                          imageUrl: imageUrl,
                          isSelected: isSelected,
                          onTap: () {
                            setState(() {
                              if (isSelected) {
                                if (_selectedStyles.length > 1) {
                                  _selectedStyles.remove(title);
                                }
                              } else {
                                _selectedStyles.add(title);
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

            // Bottom Next Button
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: OtdTokens.screenPaddingH,
                vertical: 16,
              ),
              child: OtdButton(
                text: 'Next',
                onPressed: _selectedStyles.isNotEmpty ? _handleNext : null,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
