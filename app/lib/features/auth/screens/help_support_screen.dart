import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/otd_tokens.dart';

class HelpSupportScreen extends StatelessWidget {
  const HelpSupportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        backgroundColor: colors.canvas,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 20, color: colors.textPrimary),
          tooltip: 'Back',
          onPressed: () => context.pop(),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'CONCIERGE & ADVISORY',
              style: OtdTokens.caption(
                color: colors.accent,
                weight: FontWeight.w700,
              ).copyWith(letterSpacing: 2.0),
            ),
            Text(
              'Help & Support',
              style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(
            horizontal: OtdTokens.screenPaddingH,
            vertical: 16,
          ),
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: colors.card,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: colors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: colors.accent.withValues(alpha: 0.15),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(Iconsax.magic_star, color: colors.accent, size: 24),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Styling Advisory',
                              style: OtdTokens.headingSmall(color: colors.textPrimary),
                            ),
                            Text(
                              'How OTD curates your daily look',
                              style: OtdTokens.caption(color: colors.textSecondary),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Frequently Asked Questions and guidance on maximizing your digital wardrobe.',
                    style: OtdTokens.bodyMedium(color: colors.textSecondary),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            _buildFaq(
              question: 'How does OTD match outfits to weather and venues?',
              answer:
                  'OTD evaluates your local temperature, humidity, and forecast alongside the dress code and ambience of your destination. Our rule-based curation engine selects harmonious color palettes, appropriate layer weights, and formalities tailored to your calibrated style DNA.',
              colors: colors,
            ),
            const SizedBox(height: 12),

            _buildFaq(
              question: 'How do I add pieces to my Digital Closet?',
              answer:
                  'Navigate to the Closet tab and tap the gold "+" button (or select "Add Piece"). You can photograph items directly with your camera against a neutral background or upload existing photos from your gallery. OTD identifies category, color, and formality.',
              colors: colors,
            ),
            const SizedBox(height: 12),

            _buildFaq(
              question: 'What is Cost-Per-Wear (CPW) and how is it calculated?',
              answer:
                  'CPW measures wardrobe investment efficiency. It is calculated by dividing an item\'s estimated retail purchase price by the total number of logged wears. Over time, frequently styled signature pieces achieve an ultra-low CPW.',
              colors: colors,
            ),
            const SizedBox(height: 12),

            _buildFaq(
              question: 'Can I use OTD completely offline?',
              answer:
                  'Yes. OTD bundles all luxury fonts (Cormorant Garamond & Inter) directly in the app bundle and caches your wardrobe items on-device. Curation, Try-On previews, and Stylist consultations operate seamlessly without internet connectivity.',
              colors: colors,
            ),
            const SizedBox(height: 24),

            // Contact Concierge Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: colors.isDark ? const Color(0xFF161412) : const Color(0xFFF2ECE1),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: colors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Need Personalized Assistance?',
                    style: OtdTokens.bodyLarge(color: colors.textPrimary, weight: FontWeight.w700),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Reach our private styling concierge team for questions regarding tailoring, calibration, or technical questions.',
                    style: OtdTokens.bodySmall(color: colors.textSecondary),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Icon(Iconsax.sms, size: 16, color: colors.accent),
                      const SizedBox(width: 8),
                      Text(
                        'concierge@otd-atelier.luxury',
                        style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildFaq({
    required String question,
    required String answer,
    required OtdColors colors,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colors.border),
      ),
      child: ExpansionTile(
        tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        childrenPadding: const EdgeInsets.only(left: 16, right: 16, bottom: 16),
        title: Text(
          question,
          style: OtdTokens.bodyMedium(color: colors.textPrimary, weight: FontWeight.w600),
        ),
        iconColor: colors.accent,
        collapsedIconColor: colors.textSecondary,
        children: [
          Text(
            answer,
            style: OtdTokens.bodySmall(color: colors.textSecondary),
          ),
        ],
      ),
    );
  }
}
