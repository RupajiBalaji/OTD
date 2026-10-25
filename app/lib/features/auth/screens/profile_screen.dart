import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../core/theme/theme_provider.dart';
import '../../../shared/widgets/avatar_widget.dart';
import '../../outfits/outfits_repository.dart';
import '../../outfits/screens/notifications_sheet.dart';
import '../auth_state_provider.dart';
import 'profile_dna_sheet.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  void _confirmLogout(BuildContext context, WidgetRef ref, OtdColors colors) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: colors.card,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text('Log Out', style: OtdTokens.headingSmall(color: colors.textPrimary)),
        content: Text(
          'Are you sure you want to end your current styling session?',
          style: OtdTokens.bodyMedium(color: colors.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Cancel', style: OtdTokens.label(color: colors.textMuted)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: OtdTokens.espresso,
              foregroundColor: colors.accent,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () async {
              Navigator.pop(ctx);
              await ref.read(authNotifierProvider.notifier).logout();
            },
            child: const Text('Log Out'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = OtdColors.of(context);
    final userProfile = ref.watch(userProfileProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: colors.canvas,
      body: SafeArea(
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // Top App Bar
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: OtdTokens.screenPaddingH,
                  vertical: 12,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'STYLE PROFILE & DNA',
                      style: OtdTokens.caption(
                        color: colors.accent,
                        weight: FontWeight.w700,
                      ).copyWith(letterSpacing: 2.0),
                    ),
                    Row(
                      children: [
                        IconButton(
                          icon: Icon(
                            isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
                            size: 20,
                            color: colors.accent,
                          ),
                          onPressed: () => ref.read(themeModeProvider.notifier).toggleTheme(),
                        ),
                        IconButton(
                          icon: const Icon(Iconsax.setting_2, size: 20),
                          color: colors.textPrimary,
                          onPressed: () => context.push('/settings'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Profile Header Card (Screen 24 style)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: OtdTokens.screenPaddingH,
                  vertical: 8,
                ),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: colors.card,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: colors.border),
                    boxShadow: OtdTokens.softShadow(isDark: colors.isDark, blur: 16, offsetY: 4),
                  ),
                  child: Row(
                    children: [
                      // Avatar linked to Avatar Customizer
                      GestureDetector(
                        onTap: () => context.push('/avatar'),
                        child: Container(
                          width: 74,
                          height: 74,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: colors.accent, width: 2),
                            boxShadow: [
                              BoxShadow(
                                color: colors.accent.withValues(alpha: 0.25),
                                blurRadius: 10,
                              ),
                            ],
                          ),
                          child: ClipOval(
                            child: AvatarWidget(
                              skinTone: userProfile.skinTone,
                              hairStyle: userProfile.hairStyle,
                              size: 74,
                              showGoldBackdrop: true,
                            ),
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
                                Flexible(
                                  child: Text(
                                    userProfile.name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: OtdTokens.headingMedium(color: colors.textPrimary, weight: FontWeight.w700),
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Icon(Icons.verified, size: 16, color: colors.accent),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${userProfile.city} · ${userProfile.gender}',
                              style: OtdTokens.bodySmall(color: colors.textSecondary),
                            ),
                            const SizedBox(height: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: colors.accent.withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: colors.accent.withValues(alpha: 0.3)),
                              ),
                              child: Text(
                                userProfile.stylePersonas.isNotEmpty
                                    ? 'STYLE: ${userProfile.stylePersonas.first.toUpperCase()} LUXE'
                                    : 'STYLE: MINIMAL LUXE',
                                style: OtdTokens.caption(
                                  color: colors.accent,
                                  weight: FontWeight.w700,
                                ).copyWith(fontSize: 9, letterSpacing: 1.0),
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

            // Telemetry Chips (Height, Body Shape, Aesthetic)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: OtdTokens.screenPaddingH,
                  vertical: 8,
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: _buildTelemetryTile(
                        label: 'HEIGHT',
                        value: userProfile.height,
                        icon: Iconsax.ruler,
                        colors: colors,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _buildTelemetryTile(
                        label: 'SHAPE',
                        value: userProfile.bodyShape,
                        icon: Iconsax.user_tag,
                        colors: colors,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _buildTelemetryTile(
                        label: 'FIT',
                        value: userProfile.preferredFit,
                        icon: Iconsax.scissor,
                        colors: colors,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Section 1: Main Menu Rows (Reference Screen 24)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: OtdTokens.screenPaddingH,
                  vertical: 12,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'ACCOUNT & WARDROBE',
                      style: OtdTokens.caption(
                        color: colors.accent,
                        weight: FontWeight.w700,
                      ).copyWith(letterSpacing: 1.5),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      decoration: BoxDecoration(
                        color: colors.card,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: colors.border),
                      ),
                      child: Column(
                        children: [
                          _buildMenuRow(
                            icon: Iconsax.user_octagon,
                            title: 'My Avatar',
                            subtitle: 'Customize skin tone, hair & body shape',
                            colors: colors,
                            onTap: () => context.push('/avatar'),
                          ),
                          _buildDivider(colors),
                          _buildMenuRow(
                            icon: Iconsax.user,
                            title: 'My Profile',
                            subtitle: 'Calibrate your personal dimensions',
                            colors: colors,
                            onTap: () => ProfileDnaSheet.show(context),
                          ),
                          _buildDivider(colors),
                          _buildMenuRow(
                            icon: Icons.checkroom_outlined,
                            title: 'My Closet',
                            subtitle: 'View, filter, and add garments',
                            colors: colors,
                            onTap: () => context.go('/closet'),
                          ),
                          _buildDivider(colors),
                          _buildMenuRow(
                            icon: Iconsax.bookmark,
                            title: 'Saved Looks',
                            subtitle: 'Your curated and favorite outfits',
                            colors: colors,
                            onTap: () => context.push('/saved'),
                          ),
                          _buildDivider(colors),
                          _buildMenuRow(
                            icon: Iconsax.slider_horizontal,
                            title: 'Style Preferences',
                            subtitle: 'Color palettes, aesthetics, silhouettes',
                            colors: colors,
                            onTap: () => ProfileDnaSheet.show(context),
                          ),
                          _buildDivider(colors),
                          _buildMenuRow(
                            icon: Iconsax.notification,
                            title: 'Notifications',
                            subtitle: 'Daily morning style alerts & wear reminders',
                            colors: colors,
                            onTap: () => NotificationsSheet.show(context),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Section 2: Style Intelligence Suite
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: OtdTokens.screenPaddingH,
                  vertical: 8,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'STYLE SUITE & TOOLS',
                      style: OtdTokens.caption(
                        color: colors.accent,
                        weight: FontWeight.w700,
                      ).copyWith(letterSpacing: 1.5),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      decoration: BoxDecoration(
                        color: colors.card,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: colors.border),
                      ),
                      child: Column(
                        children: [
                          _buildMenuRow(
                            icon: Iconsax.chart_2,
                            title: 'Closet Intelligence',
                            subtitle: 'Wear frequency, cost per wear & analytics',
                            colors: colors,
onTap: () => context.push('/closet-intelligence'),
                          ),
                          _buildDivider(colors),
                          _buildMenuRow(
                            icon: Iconsax.radar_2,
                            title: 'Gap Intelligence',
                            subtitle: 'Missing essentials to unlock new looks',
                            colors: colors,
onTap: () => context.push('/gap-intelligence'),
                          ),
                          _buildDivider(colors),
                          _buildMenuRow(
                            icon: Iconsax.calendar_1,
                            title: 'Outfit Calendar',
                            subtitle: 'Schedule looks for upcoming events',
                            colors: colors,
onTap: () => context.push('/calendar'),
                          ),
                          _buildDivider(colors),
                          _buildMenuRow(
                            icon: Iconsax.lamp_on,
                            title: 'Outfit Ideas',
                            subtitle: 'Curated editorial ensembles & aesthetics',
                            colors: colors,
onTap: () => context.push('/ideas'),
                          ),
                          _buildDivider(colors),
                          _buildMenuRow(
                            icon: Iconsax.location,
                            title: 'Destinations',
                            subtitle: 'Venue dress codes and weather guidance',
                            colors: colors,
onTap: () => context.push('/destinations'),
                          ),
                          _buildDivider(colors),
                          _buildMenuRow(
                            icon: Iconsax.magicpen,
                            title: 'Virtual Try-On',
                            subtitle: 'Simulate looks with your virtual avatar',
                            colors: colors,
onTap: () => context.push('/try-on'),
                          ),
                          _buildDivider(colors),
                          _buildMenuRow(
                            icon: Iconsax.people,
                            title: 'Community Feed',
                            subtitle: 'See looks curated by fellow fashion enthusiasts',
                            colors: colors,
onTap: () => context.push('/community'),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Section 3: Preferences & Support
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: OtdTokens.screenPaddingH,
                  vertical: 8,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'PREFERENCES & SUPPORT',
                      style: OtdTokens.caption(
                        color: colors.accent,
                        weight: FontWeight.w700,
                      ).copyWith(letterSpacing: 1.5),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      decoration: BoxDecoration(
                        color: colors.card,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: colors.border),
                      ),
                      child: Column(
                        children: [
                          _buildMenuRow(
                            icon: Iconsax.clipboard_text,
                            title: 'Recalibrate Style Onboarding',
                            subtitle: 'Retake the 3-step style calibration',
                            colors: colors,
                            onTap: () => context.push('/onboarding/about'),
                          ),
                          _buildDivider(colors),
                          _buildMenuRow(
                            icon: Iconsax.shield_tick,
                            title: 'Privacy & Data Storage',
                            subtitle: 'What is stored locally on this device',
                            colors: colors,
                            onTap: () => context.push('/privacy'),
                          ),
                          _buildDivider(colors),
                          _buildMenuRow(
                            icon: Iconsax.message_question,
                            title: 'Help & Concierge Support',
                            subtitle: 'FAQ, styling tips & concierge email',
                            colors: colors,
                            onTap: () => context.push('/help'),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Log Out Button (Screen 24 styled)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: OtdTokens.screenPaddingH,
                  vertical: 16,
                ),
                child: Container(
                  decoration: BoxDecoration(
                    color: colors.card,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: colors.border),
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 4),
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: colors.accent.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(Iconsax.logout, size: 20, color: colors.accent),
                    ),
                    title: Text(
                      'Log Out',
                      style: OtdTokens.label(
                        color: colors.accent,
                        weight: FontWeight.w700,
                      ).copyWith(letterSpacing: 0.5),
                    ),
                    subtitle: Text(
                      'Sign out of your OTD account',
                      style: OtdTokens.caption(color: colors.textMuted),
                    ),
                    trailing: Icon(Icons.chevron_right, size: 18, color: colors.accent),
                    onTap: () => _confirmLogout(context, ref, colors),
                  ),
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 48)),
          ],
        ),
      ),
    );
  }

  Widget _buildTelemetryTile({
    required String label,
    required String value,
    required IconData icon,
    required OtdColors colors,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colors.border),
      ),
      child: Column(
        children: [
          Icon(icon, size: 16, color: colors.accent),
          const SizedBox(height: 4),
          Text(
            label,
            style: OtdTokens.caption(color: colors.textMuted, weight: FontWeight.w700).copyWith(fontSize: 8.5),
          ),
          const SizedBox(height: 2),
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: OtdTokens.label(color: colors.textPrimary, weight: FontWeight.w700).copyWith(fontSize: 11),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuRow({
    required IconData icon,
    required String title,
    required String subtitle,
    required OtdColors colors,
    required VoidCallback onTap,
  }) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: colors.canvas,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: colors.border),
        ),
        child: Icon(icon, size: 18, color: colors.accent),
      ),
      title: Text(
        title,
        style: OtdTokens.label(color: colors.textPrimary, weight: FontWeight.w600),
      ),
      subtitle: Text(
        subtitle,
        style: OtdTokens.caption(color: colors.textSecondary).copyWith(fontSize: 10.5),
      ),
      trailing: Icon(Icons.chevron_right, size: 16, color: colors.textMuted),
      onTap: onTap,
    );
  }

  Widget _buildDivider(OtdColors colors) {
    return Divider(height: 1, indent: 56, endIndent: 16, color: colors.border.withValues(alpha: 0.6));
  }
}
