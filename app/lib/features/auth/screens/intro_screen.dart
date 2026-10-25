import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_images.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/widgets/luxury_image.dart';
import '../../../shared/widgets/otd_button.dart';

class IntroScreen extends StatefulWidget {
  const IntroScreen({super.key});

  @override
  State<IntroScreen> createState() => _IntroScreenState();
}

class _IntroScreenState extends State<IntroScreen> {
  int _activePage = 0;
  final PageController _pageController = PageController();

  final List<Map<String, String>> _slides = [
    {
      'image': AppImages.introFashionHero,
      'title': 'Look Good Anytime Anywhere',
      'subtitle':
          'Effortlessly styled looks tailored to your unique wardrobe, real-time weather, and every occasion.',
    },
    {
      'image': AppImages.introSlide2,
      'title': 'Curate With Confidence',
      'subtitle':
          'AI-guided fashion intelligence that unlocks combinations you never thought you had in your closet.',
    },
    {
      'image': AppImages.introSlide3,
      'title': 'Your Signature DNA',
      'subtitle':
          'From daily essentials to gala evenings, express your authentic self with effortless refinement.',
    },
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);

    return Scaffold(
      backgroundColor: colors.canvas,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Full-bleed PageView Image Carousel
          PageView.builder(
            controller: _pageController,
            onPageChanged: (idx) => setState(() => _activePage = idx),
            itemCount: _slides.length,
            itemBuilder: (context, index) {
              return Stack(
                fit: StackFit.expand,
                children: [
                  LuxuryImage(
                    imageUrl: _slides[index]['image']!,
                    fit: BoxFit.cover,
                  ),
                  // Dark vignette gradient overlay for contrast
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withValues(alpha: 0.15),
                          Colors.black.withValues(alpha: 0.35),
                          Colors.black.withValues(alpha: 0.88),
                          Colors.black.withValues(alpha: 0.96),
                        ],
                        stops: const [0.0, 0.45, 0.78, 1.0],
                      ),
                    ),
                  ),
                ],
              );
            },
          ),

          // Top Branding Badge
          SafeArea(
            child: Align(
              alignment: Alignment.topCenter,
              child: Padding(
                padding: const EdgeInsets.only(top: 16),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.4),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: OtdTokens.gold.withValues(alpha: 0.4),
                      width: 1,
                    ),
                  ),
                  child: Text(
                    'OTD • OUTFIT OF THE DAY',
                    style: OtdTokens.label(
                      color: OtdTokens.goldLight,
                      letterSpacing: 2.0,
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Bottom Content & Actions
          SafeArea(
            child: Align(
              alignment: Alignment.bottomCenter,
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: OtdTokens.screenPaddingH,
                  vertical: 24,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Title
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 300),
                      child: Text(
                        _slides[_activePage]['title']!,
                        key: ValueKey<String>('title_$_activePage'),
                        textAlign: TextAlign.center,
                        style: OtdTokens.headingLarge(
                          color: OtdTokens.white,
                          weight: FontWeight.w700,
                        ).copyWith(
                          fontSize: 30,
                          height: 1.2,
                        ),
                      ),
                    ),

                    const SizedBox(height: 12),

                    // Subtitle
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 300),
                      child: Text(
                        _slides[_activePage]['subtitle']!,
                        key: ValueKey<String>('sub_$_activePage'),
                        textAlign: TextAlign.center,
                        style: OtdTokens.bodyMedium(
                          color: const Color(0xFFD6D6DF),
                        ).copyWith(height: 1.45),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Animated Page Indicator Dots
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(_slides.length, (index) {
                        final isSelected = index == _activePage;
                        return AnimatedContainer(
                          duration: const Duration(milliseconds: 250),
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          width: isSelected ? 24 : 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: isSelected ? OtdTokens.gold : Colors.white.withValues(alpha: 0.35),
                            borderRadius: BorderRadius.circular(4),
                          ),
                        );
                      }),
                    ),

                    const SizedBox(height: 32),

                    // Gold "Get Started" Button
                    OtdButton(
                      text: 'Get Started',
                      variant: OtdButtonVariant.gold,
                      onPressed: () => context.go('/login'),
                    ),

                    const SizedBox(height: 8),
                  ],
                ).animate().fade(duration: 400.ms).slideY(begin: 0.1, end: 0),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
