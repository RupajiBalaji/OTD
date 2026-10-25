import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/widgets/otd_button.dart';
import '../../../shared/widgets/otd_chip.dart';
import '../../../shared/widgets/selectable_tile.dart';
import '../../../shared/widgets/step_progress.dart';
import '../../outfits/outfits_repository.dart';

class OnboardingAboutScreen extends ConsumerStatefulWidget {
  const OnboardingAboutScreen({super.key});

  @override
  ConsumerState<OnboardingAboutScreen> createState() => _OnboardingAboutScreenState();
}

class _OnboardingAboutScreenState extends ConsumerState<OnboardingAboutScreen> {
  String _gender = 'Male';
  double _heightCm = 178;
  double _weightKg = 68;
  String _bodyShape = 'Rectangle';

  final List<Map<String, dynamic>> _bodyShapes = [
    {
      'title': 'Rectangle',
      'subtitle': 'Balanced shoulders and hips',
      'icon': Icons.crop_portrait_outlined,
    },
    {
      'title': 'Triangle',
      'subtitle': 'Broader hips, narrower shoulders',
      'icon': Icons.change_history_outlined,
    },
    {
      'title': 'Hourglass',
      'subtitle': 'Defined waist, curved silhouette',
      'icon': Icons.hourglass_empty_outlined,
    },
    {
      'title': 'Oval',
      'subtitle': 'Softer midsection, balanced frame',
      'icon': Icons.circle_outlined,
    },
  ];

  @override
  void initState() {
    super.initState();
    final profile = ref.read(userProfileProvider);
    _gender = profile.gender;
    _bodyShape = profile.bodyShape.isNotEmpty ? profile.bodyShape : 'Rectangle';
    if (profile.weightKg > 0) _weightKg = profile.weightKg;
  }

  void _handleNext() {
    final current = ref.read(userProfileProvider);
    final updated = current.copyWith(
      gender: _gender,
      height: '${_heightCm.round()} cm',
      weightKg: _weightKg,
      bodyShape: _bodyShape,
    );
    ref.read(userProfileProvider.notifier).updateProfile(updated);
    context.go('/onboarding/style');
  }

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);

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
                currentStep: 1,
                totalSteps: 3,
                stepLabel: 'ABOUT YOU • 1/3',
                onBack: () => context.go('/login'),
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
                    // Title & Subtitle
                    Text(
                      'Tell us about you',
                      style: OtdTokens.headingLarge(
                        color: colors.textPrimary,
                        weight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Calibrate your silhouette so OTD can recommend silhouettes that flatter your proportions.',
                      style: OtdTokens.bodyMedium(color: colors.textMuted),
                    ),

                    const SizedBox(height: 24),

                    // Gender Selection
                    Text(
                      'GENDER IDENTIFICATION',
                      style: OtdTokens.label(color: colors.textSecondary, letterSpacing: 1.0),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: ['Male', 'Female', 'Other'].map((g) {
                        final isSelected = _gender == g;
                        return Expanded(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 4),
                            child: OtdChip(
                              label: g,
                              isSelected: isSelected,
                              height: 44,
                              onTap: () => setState(() => _gender = g),
                            ),
                          ),
                        );
                      }).toList(),
                    ),

                    const SizedBox(height: 28),

                    // Height Slider
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'HEIGHT',
                          style: OtdTokens.label(color: colors.textSecondary, letterSpacing: 1.0),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: colors.accentTint,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: colors.accent.withValues(alpha: 0.3)),
                          ),
                          child: Text(
                            '${_heightCm.round()} cm',
                            style: OtdTokens.label(color: colors.accentDeep, weight: FontWeight.w700),
                          ),
                        ),
                      ],
                    ),
                    SliderTheme(
                      data: SliderTheme.of(context).copyWith(
                        activeTrackColor: colors.accent,
                        inactiveTrackColor: colors.border,
                        thumbColor: colors.accent,
                        overlayColor: colors.accent.withValues(alpha: 0.15),
                        trackHeight: 4,
                      ),
                      child: Slider(
                        value: _heightCm,
                        min: 140,
                        max: 215,
                        onChanged: (val) => setState(() => _heightCm = val),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Weight Slider
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'WEIGHT',
                          style: OtdTokens.label(color: colors.textSecondary, letterSpacing: 1.0),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: colors.accentTint,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: colors.accent.withValues(alpha: 0.3)),
                          ),
                          child: Text(
                            '${_weightKg.round()} kg',
                            style: OtdTokens.label(color: colors.accentDeep, weight: FontWeight.w700),
                          ),
                        ),
                      ],
                    ),
                    SliderTheme(
                      data: SliderTheme.of(context).copyWith(
                        activeTrackColor: colors.accent,
                        inactiveTrackColor: colors.border,
                        thumbColor: colors.accent,
                        overlayColor: colors.accent.withValues(alpha: 0.15),
                        trackHeight: 4,
                      ),
                      child: Slider(
                        value: _weightKg,
                        min: 40,
                        max: 140,
                        onChanged: (val) => setState(() => _weightKg = val),
                      ),
                    ),

                    const SizedBox(height: 28),

                    // Body Shape Selector
                    Text(
                      'BODY SHAPE',
                      style: OtdTokens.label(color: colors.textSecondary, letterSpacing: 1.0),
                    ),
                    const SizedBox(height: 12),
                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 1.35,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                      ),
                      itemCount: _bodyShapes.length,
                      itemBuilder: (context, index) {
                        final item = _bodyShapes[index];
                        final title = item['title'] as String;
                        final subtitle = item['subtitle'] as String;
                        final icon = item['icon'] as IconData;
                        final isSelected = _bodyShape == title;

                        return SelectableTile(
                          title: title,
                          subtitle: subtitle,
                          icon: Icon(
                            icon,
                            size: 26,
                            color: isSelected ? colors.accent : colors.textMuted,
                          ),
                          isSelected: isSelected,
                          onTap: () => setState(() => _bodyShape = title),
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
                onPressed: _handleNext,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
