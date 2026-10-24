import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class CalendarPlanItem {
  final String day;
  final String name;
  final String occasion;
  final bool planned;
  final String? img;

  CalendarPlanItem({
    required this.day,
    required this.name,
    required this.occasion,
    required this.planned,
    this.img,
  });
}

class OutfitCalendarScreen extends StatefulWidget {
  final VoidCallback? onPlanLook;

  const OutfitCalendarScreen({super.key, this.onPlanLook});

  @override
  State<OutfitCalendarScreen> createState() => _OutfitCalendarScreenState();
}

class _OutfitCalendarScreenState extends State<OutfitCalendarScreen> {
  final List<CalendarPlanItem> _plans = [
    CalendarPlanItem(
      day: '14',
      name: 'Mon',
      occasion: "Dinner at L'amore",
      planned: true,
      img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80',
    ),
    CalendarPlanItem(
      day: '15',
      name: 'Tue',
      occasion: 'Executive Boardroom',
      planned: true,
      img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80',
    ),
    CalendarPlanItem(
      day: '16',
      name: 'Wed',
      occasion: 'Client Lunch',
      planned: false,
    ),
    CalendarPlanItem(
      day: '17',
      name: 'Thu',
      occasion: 'Art Gallery Opening',
      planned: true,
      img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&q=80',
    ),
    CalendarPlanItem(
      day: '18',
      name: 'Fri',
      occasion: 'Casual Friday & Drinks',
      planned: false,
    ),
    CalendarPlanItem(
      day: '19',
      name: 'Sat',
      occasion: 'Rooftop Lounge Party',
      planned: true,
      img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    ),
    CalendarPlanItem(
      day: '20',
      name: 'Sun',
      occasion: 'Weekend Brunch',
      planned: false,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? AppTheme.noir : AppTheme.ivorySilk;
    final surfaceColor = isDark ? AppTheme.surfaceNoir : AppTheme.surfaceIvory;
    final elevatedColor = isDark ? AppTheme.elevatedNoir : AppTheme.elevatedIvory;
    final borderColor = isDark ? AppTheme.borderNoir : AppTheme.borderIvory;
    final textColor = isDark ? AppTheme.silkWhite : AppTheme.textIvoryDark;
    final mutedColor = isDark ? AppTheme.mutedSilver : AppTheme.textIvoryMuted;

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: surfaceColor,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 18, color: textColor),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'OUTFIT CALENDAR',
              style: GoogleFonts.outfit(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                letterSpacing: 2.0,
                color: AppTheme.gold,
              ),
            ),
            Text(
              'Weekly Schedule & Log',
              style: GoogleFonts.cormorantGaramond(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: textColor,
              ),
            ),
          ],
        ),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(20),
        itemCount: _plans.length,
        separatorBuilder: (_, __) => const SizedBox(height: 14),
        itemBuilder: (context, index) {
          final item = _plans[index];
          return Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: surfaceColor,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: item.planned ? AppTheme.gold.withValues(alpha: 0.5) : borderColor,
                width: item.planned ? 1.5 : 1.0,
              ),
            ),
            child: Row(
              children: [
                // Day & Date Pill
                Container(
                  width: 54,
                  height: 54,
                  decoration: BoxDecoration(
                    color: item.planned ? AppTheme.gold : elevatedColor,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        item.name.toUpperCase(),
                        style: GoogleFonts.outfit(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: item.planned ? AppTheme.noir : AppTheme.gold,
                        ),
                      ),
                      Text(
                        item.day,
                        style: GoogleFonts.outfit(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: item.planned ? AppTheme.noir : textColor,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 14),

                // Info & Planned State
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.occasion,
                        style: GoogleFonts.cormorantGaramond(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: textColor,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Row(
                        children: [
                          Icon(
                            item.planned ? Icons.check_circle : Icons.schedule,
                            size: 13,
                            color: item.planned ? const Color(0xFF10B981) : mutedColor,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            item.planned ? 'Outfit Curated & Ready' : 'No ensemble locked yet',
                            style: GoogleFonts.outfit(
                              fontSize: 11,
                              fontWeight: item.planned ? FontWeight.bold : FontWeight.normal,
                              color: item.planned ? const Color(0xFF10B981) : mutedColor,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Thumbnail or Add Action
                if (item.planned && item.img != null)
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.network(
                      item.img!,
                      width: 50,
                      height: 50,
                      fit: BoxFit.cover,
                    ),
                  )
                else
                  TextButton(
                    onPressed: () {
                      Navigator.pop(context);
                      if (widget.onPlanLook != null) widget.onPlanLook!();
                    },
                    child: Text(
                      '+ Plan',
                      style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.gold),
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
}
