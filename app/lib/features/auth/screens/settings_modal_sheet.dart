import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:iconsax/iconsax.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../core/theme/theme_provider.dart';
import '../../../shared/models/fashion_models.dart';
import '../../../shared/widgets/otd_button.dart';
import '../../../shared/widgets/otd_chip.dart';
import '../../outfits/outfits_repository.dart';
import '../../wardrobe/wardrobe_repository.dart';

class SettingsModalSheet extends ConsumerStatefulWidget {
  const SettingsModalSheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const SettingsModalSheet(),
    );
  }

  @override
  ConsumerState<SettingsModalSheet> createState() => _SettingsModalSheetState();
}

class _SettingsModalSheetState extends ConsumerState<SettingsModalSheet> {
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
          'This will purge all custom wardrobe pieces, wear logs, saved ensembles, and personalized preferences from this device. The wardrobe will reset to the curated starter collection.',
          style: OtdTokens.bodyMedium(color: colors.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: Text('Cancel', style: OtdTokens.label(color: colors.textMuted)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFF43F5E),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Clear All Data'),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.clear();

      // Reset providers to clean initial state
      await ref.read(wardrobeProvider.notifier).loadItems();
      ref.read(savedLooksProvider.notifier).clearAll();
      ref.read(recentLooksProvider.notifier).clearRecent();
      await ref.read(userProfileProvider.notifier).updateProfile(
            const UserProfile(
              name: 'Alexa',
              city: 'Mumbai',
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
      Navigator.pop(context);
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

    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.85,
      ),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        border: Border(top: BorderSide(color: colors.accent, width: 1.5)),
        boxShadow: OtdTokens.softShadow(isDark: colors.isDark, blur: 24, offsetY: -4),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 16),
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Center drag handle
            Center(
              child: Container(
                width: 44,
                height: 4,
                decoration: BoxDecoration(
                  color: colors.textMuted.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Header Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 34,
                      height: 34,
                      decoration: BoxDecoration(
                        color: colors.accent.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: colors.accent.withValues(alpha: 0.4)),
                      ),
                      alignment: Alignment.center,
                      child: Icon(Iconsax.setting_2, size: 18, color: colors.accent),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'STUDIO PREFERENCES',
                          style: OtdTokens.caption(
                            color: colors.accent,
                            weight: FontWeight.w700,
                          ).copyWith(letterSpacing: 1.5),
                        ),
                        Text(
                          'Settings & Units',
                          style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
                        ),
                      ],
                    ),
                  ],
                ),
                IconButton(
                  icon: Icon(Icons.close, size: 20, color: colors.textMuted),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Theme Appearance Toggle
            Text(
              'APPEARANCE & THEME',
              style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700).copyWith(letterSpacing: 1.2),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: colors.canvas,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: colors.border),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(isDark ? Icons.dark_mode_outlined : Icons.light_mode_outlined, size: 18, color: colors.accent),
                      const SizedBox(width: 10),
                      Text(
                        isDark ? 'Obsidian Noir (Dark)' : 'Ivory Silk (Light)',
                        style: OtdTokens.label(color: colors.textPrimary, weight: FontWeight.w600),
                      ),
                    ],
                  ),
                  Switch(
                    value: isDark,
                    activeTrackColor: colors.accent,
                    activeThumbColor: AppTheme.noir,
                    onChanged: (_) => ref.read(themeModeProvider.notifier).toggleTheme(),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Measurement Units
            Text(
              'MEASUREMENT UNITS',
              style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700).copyWith(letterSpacing: 1.2),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: OtdChip(
                    label: 'Metric (cm, kg, °C)',
                    isSelected: _unit == 'metric',
                    onTap: () => setState(() => _unit = 'metric'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OtdChip(
                    label: 'Imperial (in, lbs, °F)',
                    isSelected: _unit == 'imperial',
                    onTap: () => setState(() => _unit = 'imperial'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Push Notifications Toggles
            Text(
              'INTELLIGENCE NOTIFICATIONS',
              style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700).copyWith(letterSpacing: 1.2),
            ),
            const SizedBox(height: 8),
            Container(
              decoration: BoxDecoration(
                color: colors.canvas,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: colors.border),
              ),
              child: Column(
                children: [
                  SwitchListTile(
                    dense: true,
                    activeTrackColor: colors.accent,
                    activeThumbColor: AppTheme.noir,
                    title: Text('Weather & Forecast Alerts', style: OtdTokens.label(color: colors.textPrimary, weight: FontWeight.w600)),
                    subtitle: Text('Contextual alerts when temperatures fluctuate', style: OtdTokens.caption(color: colors.textSecondary)),
                    value: _notifyWeather,
                    onChanged: (val) => setState(() => _notifyWeather = val),
                  ),
                  Divider(height: 1, color: colors.border.withValues(alpha: 0.6)),
                  SwitchListTile(
                    dense: true,
                    activeTrackColor: colors.accent,
                    activeThumbColor: AppTheme.noir,
                    title: Text('Occasion & Event Reminders', style: OtdTokens.label(color: colors.textPrimary, weight: FontWeight.w600)),
                    subtitle: Text('Scheduled looks for upcoming evening events', style: OtdTokens.caption(color: colors.textSecondary)),
                    value: _notifyOccasions,
                    onChanged: (val) => setState(() => _notifyOccasions = val),
                  ),
                  Divider(height: 1, color: colors.border.withValues(alpha: 0.6)),
                  SwitchListTile(
                    dense: true,
                    activeTrackColor: colors.accent,
                    activeThumbColor: AppTheme.noir,
                    title: Text('AI Stylist Look Suggestions', style: OtdTokens.label(color: colors.textPrimary, weight: FontWeight.w600)),
                    subtitle: Text('Daily morning curations based on venue', style: OtdTokens.caption(color: colors.textSecondary)),
                    value: _notifySuggestions,
                    onChanged: (val) => setState(() => _notifySuggestions = val),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Data Management / Purge Data Button
            Text(
              'LOCAL STORAGE & CACHE',
              style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700).copyWith(letterSpacing: 1.2),
            ),
            const SizedBox(height: 8),
            Container(
              decoration: BoxDecoration(
                color: colors.canvas,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: colors.border),
              ),
              child: ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF43F5E).withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Iconsax.trash, size: 18, color: Color(0xFFF43F5E)),
                ),
                title: Text(
                  'Clear All Local App Data',
                  style: OtdTokens.label(color: const Color(0xFFF43F5E), weight: FontWeight.w700),
                ),
                subtitle: Text(
                  'Purge local wardrobe items, wear logs & saved outfits',
                  style: OtdTokens.caption(color: colors.textMuted),
                ),
                trailing: const Icon(Icons.chevron_right, size: 16, color: Color(0xFFF43F5E)),
                onTap: () => _confirmClearData(colors),
              ),
            ),
            const SizedBox(height: 24),

            // Done Button
            OtdButton(
              text: 'DONE',
              isFullWidth: true,
              onPressed: () => Navigator.pop(context),
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }
}
