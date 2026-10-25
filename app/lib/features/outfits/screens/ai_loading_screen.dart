import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/widgets/otd_button.dart';
import '../outfits_repository.dart';

class AiLoadingScreen extends ConsumerStatefulWidget {
  const AiLoadingScreen({super.key});

  @override
  ConsumerState<AiLoadingScreen> createState() => _AiLoadingScreenState();
}

class _AiLoadingScreenState extends ConsumerState<AiLoadingScreen> {
  int _activeChecklistIndex = 0;
  bool _minTimerDone = false;

  final List<String> _steps = [
    'Analyzing your wardrobe',
    'Understanding the occasion',
    'Checking local micro-climate',
    'Matching your style & vibe',
    'Creating your perfect look',
  ];

  @override
  void initState() {
    super.initState();
    _startSequence();
  }

  void _startSequence() async {
    // Tick through checklist steps every 500ms
    for (int i = 0; i < _steps.length; i++) {
      await Future.delayed(const Duration(milliseconds: 500));
      if (!mounted) return;
      setState(() {
        _activeChecklistIndex = i + 1;
      });
    }

    _minTimerDone = true;
    _checkTransition();
  }

  void _checkTransition() {
    if (!_minTimerDone) return;
    final curatedState = ref.read(curatedOutfitProvider);

    curatedState.whenOrNull(
      data: (outfit) {
        if (outfit != null && mounted) {
          context.go('/plan/result');
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);
    final curatedState = ref.watch(curatedOutfitProvider);

    // Watch for async completion
    ref.listen(curatedOutfitProvider, (previous, next) {
      next.whenOrNull(
        data: (outfit) {
          if (_minTimerDone && outfit != null && mounted) {
            context.go('/plan/result');
          }
        },
      );
    });

    return Scaffold(
      backgroundColor: colors.canvas,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: OtdTokens.screenPaddingH,
            vertical: 24,
          ),
          child: curatedState.when(
            loading: () => _buildLoadingContent(colors),
            data: (outfit) {
              if (outfit == null) {
                return _buildLoadingContent(colors);
              }
              // If already loaded before timer completes, keep showing animation until timer finishes
              return _buildLoadingContent(colors);
            },
            error: (error, _) => _buildErrorContent(colors, error.toString()),
          ),
        ),
      ),
    );
  }

  Widget _buildLoadingContent(OtdColors colors) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Circular Gold Progress Ring
          Stack(
            alignment: Alignment.center,
            children: [
              Container(
                width: 110,
                height: 110,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: colors.card,
                  boxShadow: OtdTokens.goldGlowShadow(),
                  border: Border.all(
                    color: colors.border,
                    width: 1.5,
                  ),
                ),
                child: const Center(
                  child: Icon(
                    Iconsax.magicpen,
                    size: 38,
                    color: OtdTokens.gold,
                  ),
                ),
              ),
              SizedBox(
                width: 130,
                height: 130,
                child: CircularProgressIndicator(
                  strokeWidth: 3,
                  valueColor: AlwaysStoppedAnimation<Color>(colors.accent),
                  backgroundColor: colors.accent.withValues(alpha: 0.15),
                ),
              ),
            ],
          ).animate(onPlay: (controller) => controller.repeat()).shimmer(
                duration: 1800.ms,
                color: colors.accent.withValues(alpha: 0.3),
              ),

          const SizedBox(height: 36),

          Text(
            'Curating Your Look',
            style: OtdTokens.headingMedium(
              color: colors.textPrimary,
              weight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Harmonizing your digital pieces with real-time context',
            style: OtdTokens.bodySmall(color: colors.textMuted),
            textAlign: TextAlign.center,
          ),

          const SizedBox(height: 40),

          // Animated Checklist
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            decoration: BoxDecoration(
              color: colors.card,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: colors.border),
              boxShadow: OtdTokens.softShadow(isDark: colors.isDark),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: List.generate(_steps.length, (index) {
                final isDone = index < _activeChecklistIndex;
                final isCurrent = index == _activeChecklistIndex;

                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Row(
                    children: [
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 250),
                        width: 22,
                        height: 22,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isDone
                              ? colors.accent
                              : (isCurrent ? colors.accentTint : colors.cardElevated),
                          border: Border.all(
                            color: isDone || isCurrent ? colors.accent : colors.border,
                            width: 1.5,
                          ),
                        ),
                        child: Center(
                          child: isDone
                              ? const Icon(Icons.check, size: 14, color: OtdTokens.white)
                              : isCurrent
                                  ? Container(
                                      width: 6,
                                      height: 6,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: colors.accent,
                                      ),
                                    )
                                  : null,
                        ),
                      ),
                      const SizedBox(width: 14),
                      Text(
                        _steps[index],
                        style: OtdTokens.bodyMedium(
                          color: isDone
                              ? colors.textPrimary
                              : (isCurrent ? colors.accentDeep : colors.textMuted),
                          weight: isDone || isCurrent ? FontWeight.w600 : FontWeight.w400,
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorContent(OtdColors colors, String error) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.red.withValues(alpha: 0.1),
            ),
            child: const Icon(
              Icons.warning_amber_rounded,
              color: Colors.redAccent,
              size: 38,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            'Unable to Curate Outfit',
            style: OtdTokens.headingMedium(
              color: colors.textPrimary,
              weight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 10),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Text(
              error.replaceFirst('Exception: ', ''),
              textAlign: TextAlign.center,
              style: OtdTokens.bodyMedium(color: colors.textMuted),
            ),
          ),
          const SizedBox(height: 32),
          OtdButton(
            text: 'Add Pieces to Closet',
            variant: OtdButtonVariant.primary,
            onPressed: () {
              context.go('/closet');
            },
          ),
          const SizedBox(height: 12),
          OtdButton(
            text: 'Try Again',
            variant: OtdButtonVariant.outline,
            onPressed: () {
              context.pop();
            },
          ),
        ],
      ),
    );
  }
}
