import 'package:flutter/material.dart';
import '../../core/theme/otd_tokens.dart';

class StepProgress extends StatelessWidget {
  final int currentStep; // 1-based (e.g. 1, 2, 3...)
  final int totalSteps;
  final String? stepLabel;
  final VoidCallback? onBack;

  const StepProgress({
    super.key,
    required this.currentStep,
    required this.totalSteps,
    this.stepLabel,
    this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (stepLabel != null || onBack != null) ...[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (onBack != null)
                IconButton(
                  onPressed: onBack,
                  icon: Icon(
                    Icons.arrow_back_ios_new,
                    size: 18,
                    color: colors.textPrimary,
                  ),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                )
              else
                const SizedBox.shrink(),
              if (stepLabel != null)
                Text(
                  stepLabel!,
                  style: OtdTokens.label(
                    color: colors.textMuted,
                    letterSpacing: 1.0,
                  ),
                )
              else
                Text(
                  'STEP $currentStep OF $totalSteps',
                  style: OtdTokens.label(
                    color: colors.textMuted,
                    letterSpacing: 1.0,
                  ),
                ),
              const SizedBox(width: 18), // Visual balance for back button
            ],
          ),
          const SizedBox(height: 12),
        ],
        // Segmented capsules
        Row(
          children: List.generate(totalSteps, (index) {
            final isCompleted = index < currentStep;
            return Expanded(
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                curve: Curves.easeInOut,
                height: 4.5,
                margin: EdgeInsets.only(
                  right: index == totalSteps - 1 ? 0 : 6,
                ),
                decoration: BoxDecoration(
                  color: isCompleted ? colors.accent : colors.border,
                  borderRadius: BorderRadius.circular(3),
                  boxShadow: isCompleted
                      ? [
                          BoxShadow(
                            color: colors.accent.withValues(alpha: 0.35),
                            blurRadius: 4,
                            offset: const Offset(0, 1),
                          ),
                        ]
                      : null,
                ),
              ),
            );
          }),
        ),
      ],
    );
  }
}
