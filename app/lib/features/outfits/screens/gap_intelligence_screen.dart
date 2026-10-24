import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../screens/plan_your_look_sheet.dart';

class GapIntelligenceScreen extends StatefulWidget {
  const GapIntelligenceScreen({super.key});

  @override
  State<GapIntelligenceScreen> createState() => _GapIntelligenceScreenState();
}

class _GapIntelligenceScreenState extends State<GapIntelligenceScreen> {
  final List<Map<String, dynamic>> _gaps = [
    {
      'id': 'gap-1',
      'category': 'Outerwear Investment',
      'title': 'Double-Breasted Belted Camel Overcoat',
      'rationale': 'Bridges your casual denim with your formal tailoring. Instantly anchors 18 dormant winter pieces that lack warm-toned outerwear.',
      'synergy': '+18 Ensembles',
      'multiplier': '+38% Power',
      'brands': 'Loro Piana, Max Mara, Canali',
      'icon': '🧥',
      'active': true,
    },
    {
      'id': 'gap-2',
      'category': 'Mid-Layer Staple',
      'title': 'Charcoal Extra-Fine Merino Mockneck',
      'rationale': 'Eliminates the stiffness of collared dress shirts under blazers. Converts 12 boardroom blazers into smart-evening cocktails.',
      'synergy': '+14 Ensembles',
      'multiplier': '+24% Power',
      'brands': 'Brunello Cucinelli, John Smedley',
      'icon': '👕',
      'active': true,
    },
    {
      'id': 'gap-3',
      'category': 'Footwear Transition',
      'title': 'Chocolate Suede Belgian Tassel Loafers',
      'rationale': 'Replaces sneakers when sneakers are too casual, and replaces Oxfords when Oxfords are too rigid. Seamlessly pairs with flannel & chinos.',
      'synergy': '+11 Ensembles',
      'multiplier': '+19% Power',
      'brands': 'Baudoin & Lange, Edward Green',
      'icon': '👞',
      'active': false,
    },
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

    final activeCount = _gaps.where((g) => g['active'] == true).length;
    final totalCombos = 32 + (activeCount * 14);

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
              'PREDICTIVE CLOSET GRAPH',
              style: GoogleFonts.outfit(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                letterSpacing: 2.0,
                color: AppTheme.gold,
              ),
            ),
            Text(
              'Closet Gap Intelligence',
              style: GoogleFonts.cormorantGaramond(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: textColor,
              ),
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Synergy KPI Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1C1917), Color(0xFF2C2416)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppTheme.gold.withValues(alpha: 0.4)),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: 0.25), blurRadius: 10, offset: const Offset(0, 4)),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('GRAPH POTENTIAL', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.5, color: AppTheme.gold)),
                      const SizedBox(height: 4),
                      Text('$totalCombos Looks', style: GoogleFonts.cormorantGaramond(fontSize: 28, fontWeight: FontWeight.bold, color: const Color(0xFFF7EFE0))),
                      Text('+$activeCount strategic pieces simulated', style: GoogleFonts.outfit(fontSize: 11, color: const Color(0xFFD5C29D))),
                    ],
                  ),
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: AppTheme.gold.withValues(alpha: 0.2),
                      shape: BoxShape.circle,
                      border: Border.all(color: AppTheme.gold),
                    ),
                    alignment: Alignment.center,
                    child: const Icon(Icons.hub_outlined, color: AppTheme.gold, size: 24),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            Text(
              'High-Leverage Strategic Missing Pieces',
              style: GoogleFonts.cormorantGaramond(fontSize: 22, fontWeight: FontWeight.w700, color: textColor),
            ),
            Text(
              'Identified by analyzing gaps in your formality spectrum and color harmony graph.',
              style: GoogleFonts.outfit(fontSize: 12, color: mutedColor),
            ),
            const SizedBox(height: 14),

            // Gaps List
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _gaps.length,
              separatorBuilder: (_, __) => const SizedBox(height: 14),
              itemBuilder: (context, index) {
                final gap = _gaps[index];
                final isActive = gap['active'] as bool;

                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: surfaceColor,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: isActive ? AppTheme.gold : borderColor, width: isActive ? 1.5 : 1.0),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: elevatedColor,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(gap['category'].toString().toUpperCase(), style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.bold, color: AppTheme.gold)),
                          ),
                          Switch(
                            value: isActive,
                            activeTrackColor: AppTheme.gold,
                            activeThumbColor: AppTheme.noir,
                            onChanged: (val) {
                              setState(() {
                                gap['active'] = val;
                              });
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),

                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: elevatedColor,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            alignment: Alignment.center,
                            child: Text(gap['icon'], style: const TextStyle(fontSize: 22)),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(gap['title'], style: GoogleFonts.cormorantGaramond(fontSize: 18, fontWeight: FontWeight.w700, color: textColor)),
                                const SizedBox(height: 4),
                                Text(gap['rationale'], style: GoogleFonts.outfit(fontSize: 11, color: mutedColor, height: 1.35)),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppTheme.gold.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(gap['synergy'], style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.gold)),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: const Color(0xFF10B981).withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(gap['multiplier'], style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF10B981))),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text('Recommended Artisans: ${gap['brands']}', style: GoogleFonts.outfit(fontSize: 10, color: mutedColor)),
                    ],
                  ),
                );
              },
            ),

            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.gold,
                  foregroundColor: AppTheme.noir,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                icon: const Icon(Icons.auto_awesome, size: 16),
                label: Text('TEST STYLING WITH SIMULATED PIECES', style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 0.5)),
                onPressed: () => PlanYourLookSheet.show(context),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
