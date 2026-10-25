import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/otd_tokens.dart';
import '../auth_state_provider.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  void _handleContinue() {
    final authState = ref.read(authNotifierProvider).state;
    if (authState.status == AuthStatus.authenticated) {
      context.go('/home');
    } else if (authState.status == AuthStatus.onboardingIncomplete) {
      context.go('/onboarding/about');
    } else {
      context.go('/intro');
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: colors.canvas,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: OtdTokens.screenPaddingH,
            vertical: OtdTokens.screenPaddingV,
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const SizedBox(height: 10),

              // Arched Window Decorative Hero Frame
              Expanded(
                child: Center(
                  child: Container(
                    width: size.width * 0.82,
                    constraints: const BoxConstraints(maxWidth: 380, maxHeight: 460),
                    decoration: BoxDecoration(
                      color: colors.card,
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(190),
                        bottom: Radius.circular(24),
                      ),
                      border: Border.all(
                        color: colors.border,
                        width: 1.5,
                      ),
                      boxShadow: OtdTokens.softShadow(
                        isDark: colors.isDark,
                        blur: 24,
                        offsetY: 8,
                      ),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 36),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Arched Inner Outline
                        Container(
                          width: 140,
                          height: 170,
                          decoration: BoxDecoration(
                            borderRadius: const BorderRadius.vertical(
                              top: Radius.circular(70),
                              bottom: Radius.circular(16),
                            ),
                            border: Border.all(
                              color: colors.accent.withValues(alpha: 0.4),
                              width: 1.0,
                            ),
                          ),
                          padding: const EdgeInsets.all(20),
                          child: Center(
                            child: Image.asset(
                              'assets/images/otd_logo.png',
                              fit: BoxFit.contain,
                              errorBuilder: (context, error, stackTrace) => Icon(
                                Icons.checkroom,
                                size: 54,
                                color: colors.accent,
                              ),
                            ),
                          ),
                        ).animate().fade(duration: 400.ms).scale(delay: 100.ms),

                        const SizedBox(height: 32),

                        // Title / Tagline
                        Text(
                          'Your wardrobe.\nYour world.\nYour look.',
                          textAlign: TextAlign.center,
                          style: OtdTokens.headingLarge(
                            color: colors.textPrimary,
                            weight: FontWeight.w700,
                          ).copyWith(
                            letterSpacing: -0.5,
                            height: 1.25,
                          ),
                        ).animate().fade(delay: 200.ms, duration: 400.ms).slideY(begin: 0.1, end: 0),

                        const SizedBox(height: 12),

                        Text(
                          'AI-POWERED LUXURY WARDROBE COMPANION',
                          textAlign: TextAlign.center,
                          style: OtdTokens.label(
                            color: colors.textMuted,
                            letterSpacing: 1.6,
                          ),
                        ).animate().fade(delay: 300.ms, duration: 400.ms),
                      ],
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Circular Arrow Action Button
              GestureDetector(
                onTap: _handleContinue,
                child: Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: colors.isDark ? OtdTokens.gold : OtdTokens.espresso,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: (colors.isDark ? OtdTokens.gold : OtdTokens.espresso).withValues(alpha: 0.35),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Center(
                    child: Icon(
                      Icons.arrow_forward,
                      size: 26,
                      color: colors.isDark ? OtdTokens.espresso : OtdTokens.white,
                    ),
                  ),
                ),
              ).animate().fade(delay: 400.ms, duration: 300.ms).scale(begin: const Offset(0.85, 0.85)),

              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
