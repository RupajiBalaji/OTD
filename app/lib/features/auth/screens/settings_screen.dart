import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../core/theme/theme_provider.dart';
import '../../../shared/models/fashion_models.dart';
import '../../../shared/widgets/otd_button.dart';
import '../../outfits/outfits_repository.dart';
import '../../wardrobe/wardrobe_repository.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  String _unit = 'metric';
  bool _notifyWeather = true;
  bool _notifyOccasions = true;
  bool _notifySuggestions = true;

  Future<void> _confirmClearData(OtdColors colors) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: colors.card,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          'Clear All App Data?',
          style: OtdTokens.headingSmall(color: colors.textPrimary),
        ),
        content: Text(
          'This will permanently reset your digital closet, custom avatars, saved looks, and profile preferences to factory defaults. Stored photos will be erased.',
          style: OtdTokens.bodyMedium(color: colors.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: Text('Cancel', style: TextStyle(color: colors.textMuted)),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Reset Everything', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      // 1. Delete all saved garment images in app documents directory
      try {
        final docDir = await getApplicationDocumentsDirectory();
        final entities = docDir.listSync();
        for (final entity in entities) {
          if (entity is File && (entity.path.endsWith('.jpg') || entity.path.endsWith('.png') || entity.path.endsWith('.jpeg'))) {
            try {
              entity.deleteSync();
            } catch (_) {}
          }
        }
      } catch (_) {}

      // 2. Wipe SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      await prefs.clear();

      // 3. Reset all providers in memory
      ref.read(wardrobeProvider.notifier).resetToDefaults();
      ref.read(savedLooksProvider.notifier).clearAll();
      ref.read(recentLooksProvider.notifier).clearAll();
      ref.read(userProfileProvider.notifier).updateProfile(
            const UserProfile(
              name: 'Guest Client',
              city: 'Milan',
              height: "5'10\" (178 cm)",
              bodyShape: 'Rectangle',
              stylePersonas: ['Minimal', 'Smart Casual'],
              preferredFit: 'Tailored',
              palettePreferences: ['Black & White', 'Beige & Earth'],
              gender: 'Female',
              weightKg: 62.0,
              goals: ['Everyday Looks', 'Work/Office'],
            ),
          );

      if (!mounted) return;
      final messenger = ScaffoldMessenger.of(context);
      messenger.showSnackBar(
        const SnackBar(
          content: Text('All local data cleared and reset to factory defaults.'),
          backgroundColor: Color(0xFF1C1612),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);
    final themeMode = ref.watch(themeModeProvider);
    final isDark = themeMode == ThemeMode.dark;

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
              'APPLICATION PREFERENCES',
              style: OtdTokens.caption(
                color: colors.accent,
                weight: FontWeight.w700,
              ).copyWith(letterSpacing: 2.0),
            ),
            Text(
              'Settings',
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
            // Appearance Section
            _buildSectionHeader('Appearance & Aesthetics', colors),
            Material(
              color: colors.card,
              borderRadius: BorderRadius.circular(18),
              clipBehavior: Clip.antiAlias,
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: colors.border),
                ),
                child: SwitchListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                title: Text(
                  'Dark Atelier Theme',
                  style: OtdTokens.bodyMedium(color: colors.textPrimary, weight: FontWeight.w600),
                ),
                subtitle: Text(
                  'Switch between warm Ivory Silk and Noir Obsidian palette',
                  style: OtdTokens.caption(color: colors.textSecondary),
                ),
                secondary: Icon(
                  isDark ? Iconsax.moon : Iconsax.sun_1,
                  color: colors.accent,
                ),
                value: isDark,
                onChanged: (_) {
                  ref.read(themeModeProvider.notifier).toggleTheme();
                },
              ),
            ),
          ),
            const SizedBox(height: 24),

            // Units Section
            _buildSectionHeader('Measurement Units', colors),
            Container(
              decoration: BoxDecoration(
                color: colors.card,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: colors.border),
              ),
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Preferred Temperature & Fit Units',
                    style: OtdTokens.caption(color: colors.textSecondary),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => setState(() => _unit = 'metric'),
                          style: OutlinedButton.styleFrom(
                            backgroundColor: _unit == 'metric' ? colors.accent.withValues(alpha: 0.15) : Colors.transparent,
                            side: BorderSide(
                              color: _unit == 'metric' ? colors.accent : colors.border,
                              width: 1.5,
                            ),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                          child: Text(
                            'Metric (°C / cm)',
                            style: OtdTokens.label(
                              color: _unit == 'metric' ? colors.accent : colors.textSecondary,
                              weight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => setState(() => _unit = 'imperial'),
                          style: OutlinedButton.styleFrom(
                            backgroundColor: _unit == 'imperial' ? colors.accent.withValues(alpha: 0.15) : Colors.transparent,
                            side: BorderSide(
                              color: _unit == 'imperial' ? colors.accent : colors.border,
                              width: 1.5,
                            ),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                          child: Text(
                            'Imperial (°F / in)',
                            style: OtdTokens.label(
                              color: _unit == 'imperial' ? colors.accent : colors.textSecondary,
                              weight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Notifications
            _buildSectionHeader('Editorial Notifications', colors),
            Material(
              color: colors.card,
              borderRadius: BorderRadius.circular(18),
              clipBehavior: Clip.antiAlias,
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: colors.border),
                ),
                child: Column(
                  children: [
                    SwitchListTile(
                    title: Text('Morning Weather & Vibe Dispatch', style: OtdTokens.bodyMedium(color: colors.textPrimary)),
                    subtitle: Text('Receive daily look readiness based on local climate', style: OtdTokens.caption(color: colors.textSecondary)),
                    value: _notifyWeather,
                        onChanged: (v) => setState(() => _notifyWeather = v),
                  ),
                  Divider(height: 1, color: colors.border),
                  SwitchListTile(
                    title: Text('Upcoming Calendar Occasions', style: OtdTokens.bodyMedium(color: colors.textPrimary)),
                    subtitle: Text('Reminders to curate high-stakes attire in advance', style: OtdTokens.caption(color: colors.textSecondary)),
                    value: _notifyOccasions,
                        onChanged: (v) => setState(() => _notifyOccasions = v),
                  ),
                  Divider(height: 1, color: colors.border),
                  SwitchListTile(
                    title: Text('Closet Intelligence Insights', style: OtdTokens.bodyMedium(color: colors.textPrimary)),
                    subtitle: Text('Cost-per-wear and wardrobe gap updates', style: OtdTokens.caption(color: colors.textSecondary)),
                    value: _notifySuggestions,
                        onChanged: (v) => setState(() => _notifySuggestions = v),
                  ),
                ],
              ),
            ),
          ),
            const SizedBox(height: 24),

            // Links to Legal & Privacy
            _buildSectionHeader('Data & Governance', colors),
            Material(
              color: colors.card,
              borderRadius: BorderRadius.circular(18),
              clipBehavior: Clip.antiAlias,
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: colors.border),
                ),
                child: Column(
                  children: [
                    ListTile(
                    leading: Icon(Iconsax.shield_tick, color: colors.accent),
                    title: Text('Privacy Policy & Storage Architecture', style: OtdTokens.bodyMedium(color: colors.textPrimary, weight: FontWeight.w600)),
                    subtitle: Text('Learn how your wardrobe data remains strictly on-device', style: OtdTokens.caption(color: colors.textSecondary)),
                    trailing: Icon(Icons.arrow_forward_ios, size: 14, color: colors.textMuted),
                    onTap: () => context.push('/privacy'),
                  ),
                  Divider(height: 1, color: colors.border),
                  ListTile(
                    leading: Icon(Iconsax.message_question, color: colors.accent),
                    title: Text('Help & Concierge Support', style: OtdTokens.bodyMedium(color: colors.textPrimary, weight: FontWeight.w600)),
                    subtitle: Text('Guides, FAQs, and styling support contact', style: OtdTokens.caption(color: colors.textSecondary)),
                    trailing: Icon(Icons.arrow_forward_ios, size: 14, color: colors.textMuted),
                    onTap: () => context.push('/help'),
                  ),
                ],
              ),
            ),
          ),
            const SizedBox(height: 28),

            // Reset Data Button
            OtdButton(
              text: 'CLEAR ALL DATA & RESET',
              variant: OtdButtonVariant.outline,
              icon: const Icon(Iconsax.trash, size: 18, color: Colors.redAccent),
              onPressed: () => _confirmClearData(colors),
            ),
            const SizedBox(height: 24),

            // App Version Badge
            Center(
              child: Text(
                'OTD Atelier Edition · v1.0.0 (Build 1)',
                style: OtdTokens.caption(color: colors.textMuted),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, OtdColors colors) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        title.toUpperCase(),
        style: OtdTokens.caption(
          color: colors.accent,
          weight: FontWeight.w700,
        ).copyWith(letterSpacing: 1.2),
      ),
    );
  }
}
