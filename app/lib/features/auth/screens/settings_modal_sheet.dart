import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/theme_provider.dart';
import 'auth_modal_sheet.dart';

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
  String? _statusMessage;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final surfaceColor = isDark ? AppTheme.surfaceNoir : AppTheme.surfaceIvory;
    final elevatedColor = isDark ? AppTheme.elevatedNoir : AppTheme.elevatedIvory;
    final borderColor = isDark ? AppTheme.borderNoir : AppTheme.borderIvory;
    final textColor = isDark ? AppTheme.silkWhite : AppTheme.textIvoryDark;
    final mutedColor = isDark ? AppTheme.mutedSilver : AppTheme.textIvoryMuted;

    return Container(
      decoration: BoxDecoration(
        color: surfaceColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        border: const Border(top: BorderSide(color: AppTheme.gold, width: 1.5)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 18),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Center drag handle
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: mutedColor.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: AppTheme.gold.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppTheme.gold.withValues(alpha: 0.4)),
                      ),
                      alignment: Alignment.center,
                      child: const Icon(Icons.tune, size: 16, color: AppTheme.gold),
                    ),
                    const SizedBox(width: 10),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'PREFERENCES',
                          style: GoogleFonts.outfit(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1.5,
                            color: AppTheme.gold,
                          ),
                        ),
                        Text(
                          'Studio Settings',
                          style: GoogleFonts.cormorantGaramond(
                            fontSize: 20,
                            fontWeight: FontWeight.w700,
                            color: textColor,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.close, size: 20),
                  color: mutedColor,
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 16),

            if (_statusMessage != null)
              Container(
                margin: const EdgeInsets.only(bottom: 14),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.4)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle_outline, size: 16, color: Color(0xFF10B981)),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(_statusMessage!, style: GoogleFonts.outfit(fontSize: 11, color: const Color(0xFF10B981))),
                    ),
                  ],
                ),
              ),

            // Theme Setting
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: elevatedColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: borderColor),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Appearance Mode',
                        style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w700, color: textColor),
                      ),
                      Text(
                        isDark ? 'Obsidian Noir Mode' : 'Haute Ivory Silk Mode',
                        style: GoogleFonts.outfit(fontSize: 11, color: mutedColor),
                      ),
                    ],
                  ),
                  OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppTheme.gold),
                      foregroundColor: AppTheme.gold,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                    icon: Icon(isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined, size: 15),
                    label: Text(
                      isDark ? 'Light' : 'Dark',
                      style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                    onPressed: () {
                      ref.read(themeModeProvider.notifier).toggleTheme();
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Units Setting
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: elevatedColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: borderColor),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Measurement System',
                        style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w700, color: textColor),
                      ),
                      Text(
                        'Height, fit sizing & temperature',
                        style: GoogleFonts.outfit(fontSize: 11, color: mutedColor),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      GestureDetector(
                        onTap: () => setState(() => _unit = 'metric'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: _unit == 'metric' ? AppTheme.gold : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: _unit == 'metric' ? AppTheme.gold : borderColor),
                          ),
                          child: Text(
                            'Metric (°C)',
                            style: GoogleFonts.outfit(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: _unit == 'metric' ? AppTheme.noir : textColor,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      GestureDetector(
                        onTap: () => setState(() => _unit = 'imperial'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: _unit == 'imperial' ? AppTheme.gold : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: _unit == 'imperial' ? AppTheme.gold : borderColor),
                          ),
                          child: Text(
                            'Imperial (°F)',
                            style: GoogleFonts.outfit(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: _unit == 'imperial' ? AppTheme.noir : textColor,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Notification Toggles
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: elevatedColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: borderColor),
              ),
              child: Column(
                children: [
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    dense: true,
                    activeTrackColor: AppTheme.gold,
                    activeThumbColor: AppTheme.noir,
                    title: Text('Weather & Forecast Alerts', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600, color: textColor)),
                    subtitle: Text('Contextual updates when temperature shifts', style: GoogleFonts.outfit(fontSize: 10, color: mutedColor)),
                    value: _notifyWeather,
                    onChanged: (val) => setState(() => _notifyWeather = val),
                  ),
                  Divider(color: borderColor, height: 12),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    dense: true,
                    activeTrackColor: AppTheme.gold,
                    activeThumbColor: AppTheme.noir,
                    title: Text('Occasion & Calendar Reminders', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600, color: textColor)),
                    subtitle: Text('Upcoming date nights & dinners 2 hours prior', style: GoogleFonts.outfit(fontSize: 10, color: mutedColor)),
                    value: _notifyOccasions,
                    onChanged: (val) => setState(() => _notifyOccasions = val),
                  ),
                  Divider(color: borderColor, height: 12),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    dense: true,
                    activeTrackColor: AppTheme.gold,
                    activeThumbColor: AppTheme.noir,
                    title: Text('AI Stylist Recommendations', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600, color: textColor)),
                    subtitle: Text('Morning outfit curations based on current calendar', style: GoogleFonts.outfit(fontSize: 10, color: mutedColor)),
                    value: _notifySuggestions,
                    onChanged: (val) => setState(() => _notifySuggestions = val),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Account / Sign Out / Reset Cache Actions
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      side: BorderSide(color: borderColor),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    icon: const Icon(Icons.refresh, size: 16, color: AppTheme.gold),
                    label: Text(
                      'Clear Cache',
                      style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w700, color: textColor),
                    ),
                    onPressed: () {
                      setState(() => _statusMessage = 'Wardrobe & Style cache flushed.');
                    },
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: elevatedColor,
                      foregroundColor: Colors.redAccent,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                        side: BorderSide(color: Colors.redAccent.withValues(alpha: 0.3)),
                      ),
                    ),
                    icon: const Icon(Icons.logout, size: 16, color: Colors.redAccent),
                    label: Text(
                      'Account / Auth',
                      style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w700),
                    ),
                    onPressed: () {
                      Navigator.pop(context);
                      AuthModalSheet.show(context);
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }
}
