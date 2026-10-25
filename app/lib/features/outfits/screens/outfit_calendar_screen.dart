import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/widgets/luxury_image.dart';

class CalendarEntry {
  final int day;
  final String weekday;
  final String event;
  final bool isToday;
  final String? outfitTitle;
  final String? imageUrl;

  CalendarEntry({
    required this.day,
    required this.weekday,
    required this.event,
    this.isToday = false,
    this.outfitTitle,
    this.imageUrl,
  });
}

class OutfitCalendarScreen extends ConsumerStatefulWidget {
  const OutfitCalendarScreen({super.key});

  @override
  ConsumerState<OutfitCalendarScreen> createState() => _OutfitCalendarScreenState();
}

class _OutfitCalendarScreenState extends ConsumerState<OutfitCalendarScreen> {
  final List<CalendarEntry> _schedule = [
    CalendarEntry(
      day: 24,
      weekday: 'Thu',
      event: 'Design Review & Executive Sync',
      outfitTitle: 'Minimal Tailored Suit',
      imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80',
    ),
    CalendarEntry(
      day: 25,
      weekday: 'Fri',
      event: 'Casual Friday & Rooftop Dinner',
      isToday: true,
      outfitTitle: 'Silk Camp Shirt & Chinos',
      imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80',
    ),
    CalendarEntry(
      day: 26,
      weekday: 'Sat',
      event: 'Vernissage Art Gallery & Soirée',
      outfitTitle: null,
      imageUrl: null,
    ),
    CalendarEntry(
      day: 27,
      weekday: 'Sun',
      event: 'Weekend Brunch & Stroll',
      outfitTitle: 'Cashmere Knit & Denim',
      imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&q=80',
    ),
    CalendarEntry(
      day: 28,
      weekday: 'Mon',
      event: 'Client Presentation Boardroom',
      outfitTitle: null,
      imageUrl: null,
    ),
  ];

  void _scheduleLookForDay(int day, String event) {
    context.push('/plan');
  }

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
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'OUTFIT CALENDAR',
              style: OtdTokens.caption(
                color: colors.accent,
                weight: FontWeight.w700,
              ).copyWith(letterSpacing: 2.0),
            ),
            Text(
              'Schedule & Events',
              style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(Iconsax.add, size: 22, color: colors.accent),
            tooltip: 'Plan a Look',
            onPressed: () => context.push('/plan'),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: ListView.separated(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(
            horizontal: OtdTokens.screenPaddingH,
            vertical: 16,
          ),
          itemCount: _schedule.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final entry = _schedule[index];
            final hasOutfit = entry.outfitTitle != null;

            return Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: colors.card,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: entry.isToday ? colors.accent : colors.border,
                  width: entry.isToday ? 1.5 : 1.0,
                ),
                boxShadow: entry.isToday
                    ? [
                        BoxShadow(
                          color: colors.accent.withValues(alpha: 0.15),
                          blurRadius: 12,
                          offset: const Offset(0, 3),
                        ),
                      ]
                    : OtdTokens.softShadow(isDark: colors.isDark, blur: 6, offsetY: 2),
              ),
              child: Row(
                children: [
                  // Day & Date Pill
                  Container(
                    width: 52,
                    height: 54,
                    decoration: BoxDecoration(
                      color: entry.isToday ? colors.accent : colors.canvas,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: entry.isToday ? colors.accent : colors.border,
                      ),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          entry.weekday.toUpperCase(),
                          style: OtdTokens.caption(
                            color: entry.isToday ? AppTheme.noir : colors.accent,
                            weight: FontWeight.w800,
                          ).copyWith(fontSize: 9),
                        ),
                        Text(
                          '${entry.day}',
                          style: OtdTokens.label(
                            color: entry.isToday ? AppTheme.noir : colors.textPrimary,
                            weight: FontWeight.w800,
                          ).copyWith(fontSize: 16),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 14),

                  // Event Info & Outfit Status
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (entry.isToday)
                          Padding(
                            padding: const EdgeInsets.only(bottom: 2),
                            child: Text(
                              'TODAY',
                              style: OtdTokens.caption(
                                color: colors.accent,
                                weight: FontWeight.w800,
                              ).copyWith(fontSize: 9, letterSpacing: 1.0),
                            ),
                          ),
                        Text(
                          entry.event,
                          style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700).copyWith(fontSize: 15),
                        ),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            Icon(
                              hasOutfit ? Iconsax.tick_circle : Iconsax.clock,
                              size: 13,
                              color: hasOutfit ? colors.accent : colors.textMuted,
                            ),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                hasOutfit ? entry.outfitTitle! : 'No outfit scheduled',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: OtdTokens.caption(
                                  color: hasOutfit ? colors.textSecondary : colors.textMuted,
                                  weight: hasOutfit ? FontWeight.w600 : FontWeight.w400,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Image thumbnail or + Plan button
                  if (hasOutfit && entry.imageUrl != null)
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: SizedBox(
                        width: 48,
                        height: 48,
                        child: LuxuryImage(
                          imageUrl: entry.imageUrl!,
                          fit: BoxFit.cover,
                        ),
                      ),
                    )
                  else
                    TextButton(
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        backgroundColor: colors.accent.withValues(alpha: 0.12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () => _scheduleLookForDay(entry.day, entry.event),
                      child: Text(
                        '+ Plan',
                        style: OtdTokens.label(color: colors.accent, weight: FontWeight.w700),
                      ),
                    ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
