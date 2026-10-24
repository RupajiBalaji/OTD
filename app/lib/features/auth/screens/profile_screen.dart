import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/theme_provider.dart';
import '../../outfits/outfits_repository.dart';
import 'profile_dna_sheet.dart';
import 'settings_modal_sheet.dart';
import 'auth_modal_sheet.dart';
import 'onboarding_survey_modal.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userProfile = ref.watch(userProfileProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final bgColor = isDark ? AppTheme.noir : AppTheme.ivorySilk;
    final surfaceColor = isDark ? AppTheme.surfaceNoir : AppTheme.surfaceIvory;
    final elevatedColor = isDark ? AppTheme.elevatedNoir : AppTheme.elevatedIvory;
    final borderColor = isDark ? AppTheme.borderNoir : AppTheme.borderIvory;
    final textColor = isDark ? AppTheme.silkWhite : AppTheme.textIvoryDark;
    final mutedColor = isDark ? AppTheme.mutedSilver : AppTheme.textIvoryMuted;

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // Top App Bar
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'STYLE PROFILE & DNA',
                      style: GoogleFonts.outfit(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 2.0,
                        color: AppTheme.gold,
                      ),
                    ),
                    Row(
                      children: [
                        IconButton(
                          icon: Icon(
                            isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
                            size: 20,
                            color: AppTheme.gold,
                          ),
                          onPressed: () {
                            ref.read(themeModeProvider.notifier).toggleTheme();
                          },
                        ),
                        IconButton(
                          icon: const Icon(Icons.tune_outlined, size: 20, color: AppTheme.gold),
                          onPressed: () => SettingsModalSheet.show(context),
                        ),
                        IconButton(
                          icon: const Icon(Icons.lock_outline, size: 20, color: AppTheme.gold),
                          onPressed: () => AuthModalSheet.show(context),
                        ),
                        IconButton(
                          icon: const Icon(Icons.edit_outlined, size: 20, color: AppTheme.gold),
                          onPressed: () => ProfileDnaSheet.show(context),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Profile Header Card
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: surfaceColor,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: borderColor),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.05),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      // User Avatar with gold border
                      Container(
                        width: 76,
                        height: 76,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: AppTheme.gold, width: 2),
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.gold.withValues(alpha: 0.2),
                              blurRadius: 12,
                            ),
                          ],
                        ),
                        child: ClipOval(
                          child: Image.network(
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),

                      // User Details
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  userProfile.name,
                                  style: GoogleFonts.cormorantGaramond(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w700,
                                    color: textColor,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                const Icon(Icons.verified, size: 16, color: AppTheme.gold),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Hyderabad, India · Age 22',
                              style: GoogleFonts.outfit(
                                fontSize: 12,
                                color: mutedColor,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppTheme.gold.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                'STYLE ARCHETYPE: MINIMAL LUXE',
                                style: GoogleFonts.outfit(
                                  fontSize: 9,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 1.0,
                                  color: AppTheme.gold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Telemetry Grid: Height, Body Shape, Skin Tone
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                child: Row(
                  children: [
                    Expanded(
                      child: _TelemetryCard(
                        label: 'HEIGHT',
                        value: userProfile.height,
                        icon: Icons.height,
                        elevatedColor: elevatedColor,
                        borderColor: borderColor,
                        textColor: textColor,
                        mutedColor: mutedColor,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _TelemetryCard(
                        label: 'BODY SHAPE',
                        value: userProfile.bodyShape,
                        icon: Icons.accessibility,
                        elevatedColor: elevatedColor,
                        borderColor: borderColor,
                        textColor: textColor,
                        mutedColor: mutedColor,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _TelemetryCard(
                        label: 'SKIN TONE',
                        value: 'Medium',
                        isColorSwatch: true,
                        swatchColor: const Color(0xFFD4A373),
                        icon: Icons.palette_outlined,
                        elevatedColor: elevatedColor,
                        borderColor: borderColor,
                        textColor: textColor,
                        mutedColor: mutedColor,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Style Preferences Card (Screenshot 2: "Your Style Profile")
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                child: Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: surfaceColor,
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(color: borderColor),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'STYLE PREFERENCES',
                            style: GoogleFonts.outfit(
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 1.2,
                              color: AppTheme.gold,
                            ),
                          ),
                          GestureDetector(
                            onTap: () => ProfileDnaSheet.show(context),
                            child: Text(
                              'Edit',
                              style: GoogleFonts.outfit(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.gold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      _ProfileDetailRow(
                        icon: Icons.style_outlined,
                        title: 'Aesthetic',
                        value: userProfile.stylePersonas.join(', '),
                        textColor: textColor,
                        mutedColor: mutedColor,
                      ),
                      const Divider(height: 16),

                      _ProfileDetailRow(
                        icon: Icons.checkroom_outlined,
                        title: 'Preferred Fit',
                        value: userProfile.preferredFit,
                        textColor: textColor,
                        mutedColor: mutedColor,
                      ),
                      const Divider(height: 16),

                      _ProfileDetailRow(
                        icon: Icons.palette_outlined,
                        title: 'Palette Tone',
                        value: userProfile.palettePreferences.join(' · '),
                        textColor: textColor,
                        mutedColor: mutedColor,
                      ),
                      const Divider(height: 16),

                      _ProfileDetailRow(
                        icon: Icons.auto_awesome,
                        title: 'Style Mood',
                        value: 'Modern · Versatile · Comfortable',
                        textColor: textColor,
                        mutedColor: mutedColor,
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Wardrobe Goals & Priorities
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                child: Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: surfaceColor,
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(color: borderColor),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'WARDROBE GOALS',
                        style: GoogleFonts.outfit(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 1.2,
                          color: AppTheme.gold,
                        ),
                      ),
                      const SizedBox(height: 12),

                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          '✨ Elevate Date Night Looks',
                          '👔 Sharp Executive Presence',
                          '🌱 Maximize Garment Versatility',
                          '🎨 Master Color Harmonies',
                          '⚡ Fast Morning Decisions',
                        ].map((goal) => Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: elevatedColor,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: borderColor),
                              ),
                              child: Text(
                                goal,
                                style: GoogleFonts.outfit(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: textColor,
                                ),
                              ),
                            )).toList(),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Action Buttons: Calibrate Style DNA
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Column(
                  children: [
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.assignment_outlined, size: 16),
                        label: Text(
                          'FULL STYLE ONBOARDING SURVEY',
                          style: GoogleFonts.outfit(
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.0,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.gold,
                          foregroundColor: AppTheme.noir,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(28),
                          ),
                        ),
                        onPressed: () => OnboardingSurveyModal.show(context),
                      ),
                    ),
                    const SizedBox(height: 10),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        icon: const Icon(Icons.tune, size: 16, color: AppTheme.gold),
                        label: Text(
                          'CALIBRATE STYLE DNA PROFILE',
                          style: GoogleFonts.outfit(
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.0,
                            color: textColor,
                          ),
                        ),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          side: const BorderSide(color: AppTheme.gold),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(28),
                          ),
                        ),
                        onPressed: () => ProfileDnaSheet.show(context),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 40)),
          ],
        ),
      ),
    );
  }
}

class _TelemetryCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final bool isColorSwatch;
  final Color? swatchColor;
  final Color elevatedColor;
  final Color borderColor;
  final Color textColor;
  final Color mutedColor;

  const _TelemetryCard({
    required this.label,
    required this.value,
    required this.icon,
    this.isColorSwatch = false,
    this.swatchColor,
    required this.elevatedColor,
    required this.borderColor,
    required this.textColor,
    required this.mutedColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
      decoration: BoxDecoration(
        color: elevatedColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        children: [
          Icon(icon, size: 16, color: AppTheme.gold),
          const SizedBox(height: 6),
          Text(
            label,
            style: GoogleFonts.outfit(
              fontSize: 9,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.0,
              color: mutedColor,
            ),
          ),
          const SizedBox(height: 4),
          if (isColorSwatch)
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: swatchColor,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.black.withValues(alpha: 0.2)),
                  ),
                ),
                const SizedBox(width: 4),
                Text(
                  value,
                  style: GoogleFonts.outfit(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: textColor,
                  ),
                ),
              ],
            )
          else
            Text(
              value,
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: textColor,
              ),
            ),
        ],
      ),
    );
  }
}

class _ProfileDetailRow extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;
  final Color textColor;
  final Color mutedColor;

  const _ProfileDetailRow({
    required this.icon,
    required this.title,
    required this.value,
    required this.textColor,
    required this.mutedColor,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 16, color: AppTheme.gold),
        const SizedBox(width: 10),
        SizedBox(
          width: 90,
          child: Text(
            title,
            style: GoogleFonts.outfit(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: mutedColor,
            ),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: textColor,
            ),
          ),
        ),
      ],
    );
  }
}
