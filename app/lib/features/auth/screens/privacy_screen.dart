import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/otd_tokens.dart';

class PrivacyScreen extends StatelessWidget {
  const PrivacyScreen({super.key});

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
              'TRANSPARENCY & DATA',
              style: OtdTokens.caption(
                color: colors.accent,
                weight: FontWeight.w700,
              ).copyWith(letterSpacing: 2.0),
            ),
            Text(
              'Privacy & Local Storage',
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
                        child: Icon(Iconsax.shield_security, color: colors.accent, size: 24),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'On-Device Architecture',
                              style: OtdTokens.headingSmall(color: colors.textPrimary),
                            ),
                            Text(
                              'Zero server tracking by default',
                              style: OtdTokens.caption(color: colors.textSecondary),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  Text(
                    'OTD is engineered with privacy as a foundational principle. Here is exactly how your information is handled:',
                    style: OtdTokens.bodyMedium(color: colors.textSecondary),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            _buildCard(
              icon: Iconsax.document_upload,
              title: 'Wardrobe Photos & Garment Media',
              content:
                  'Every photo taken with your camera or uploaded from your photo gallery is copied into your application\'s local documents directory. They are never transmitted to external cloud servers, training corpora, or third-party analytical vendors. When you delete a piece from your digital closet, the file on your device storage is purged immediately.',
              colors: colors,
            ),
            const SizedBox(height: 14),

            _buildCard(
              icon: Iconsax.profile_circle,
              title: 'Biometric & Style Preferences',
              content:
                  'Your style personas, body shape selections, color palettes, and calibration metrics are serialized into local device preferences (SharedPreferences). They remain strictly on your phone to curate personalized recommendations offline.',
              colors: colors,
            ),
            const SizedBox(height: 14),

            _buildCard(
              icon: Iconsax.cloud_cross,
              title: 'No Network Analytics or Ad SDKs',
              content:
                  'There are zero third-party advertising SDKs, behavioral fingerprinting scripts, or cross-app tracking beacons bundled within the OTD binary. Network requests occur solely for weather data lookups and font assets.',
              colors: colors,
            ),
            const SizedBox(height: 14),

            _buildCard(
              icon: Iconsax.trash,
              title: 'Complete Data Erasure',
              content:
                  'You retain total sovereignty over your digital closet. At any moment, you can visit Settings > Clear All Data & Reset to instantly erase all local databases, cached images, and user preferences with a single tap.',
              colors: colors,
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildCard({
    required IconData icon,
    required String title,
    required String content,
    required OtdColors colors,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: colors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 20, color: colors.accent),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  title,
                  style: OtdTokens.bodyLarge(color: colors.textPrimary, weight: FontWeight.w700),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            content,
            style: OtdTokens.bodySmall(color: colors.textSecondary),
          ),
        ],
      ),
    );
  }
}
