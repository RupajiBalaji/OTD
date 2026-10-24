import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../outfits_repository.dart';
import 'plan_your_look_sheet.dart';

class InteractiveStylistStudioScreen extends ConsumerStatefulWidget {
  const InteractiveStylistStudioScreen({super.key});

  @override
  ConsumerState<InteractiveStylistStudioScreen> createState() => _InteractiveStylistStudioScreenState();
}

class _InteractiveStylistStudioScreenState extends ConsumerState<InteractiveStylistStudioScreen> {
  String _selectedOccasion = 'boardroom';
  String _selectedVibe = 'old-money';

  final Map<String, String> _occasions = {
    'boardroom': 'Executive Boardroom',
    'soiree': 'Monaco Soirée',
    'date': 'Rooftop Date Night',
    'gallery': 'Vernissage Gallery',
  };

  final Map<String, String> _vibes = {
    'old-money': 'Old Money Heritage',
    'minimalist': 'Architectural Minimalist',
    'sartorial': 'Contemporary Sartorial',
  };

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
              'EDITORIAL ENGINE',
              style: GoogleFonts.outfit(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                letterSpacing: 2.0,
                color: AppTheme.gold,
              ),
            ),
            Text(
              'Interactive AI Stylist Preset Lab',
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
            // Occasion Matrix Selector
            Text('1. Select Architectural Setting / Occasion', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
            const SizedBox(height: 8),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: _occasions.entries.map((e) {
                  final isSelected = _selectedOccasion == e.key;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(e.value),
                      selected: isSelected,
                      selectedColor: AppTheme.gold,
                      backgroundColor: elevatedColor,
                      labelStyle: GoogleFonts.outfit(fontSize: 11, fontWeight: isSelected ? FontWeight.bold : FontWeight.w500, color: isSelected ? AppTheme.noir : textColor),
                      onSelected: (_) => setState(() => _selectedOccasion = e.key),
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 16),

            // Vibe Selector
            Text('2. Silhouette Persona / Aesthetic Vibe', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
            const SizedBox(height: 8),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: _vibes.entries.map((e) {
                  final isSelected = _selectedVibe == e.key;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(e.value),
                      selected: isSelected,
                      selectedColor: AppTheme.gold,
                      backgroundColor: elevatedColor,
                      labelStyle: GoogleFonts.outfit(fontSize: 11, fontWeight: isSelected ? FontWeight.bold : FontWeight.w500, color: isSelected ? AppTheme.noir : textColor),
                      onSelected: (_) => setState(() => _selectedVibe = e.key),
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 20),

            // Curated Look Editorial Showcase Card
            Container(
              decoration: BoxDecoration(
                color: surfaceColor,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: borderColor),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.05), blurRadius: 12, offset: const Offset(0, 4)),
                ],
              ),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.gold.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text('99.4% SILHOUETTE HARMONY', style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w800, color: AppTheme.gold)),
                      ),
                      const Icon(Icons.auto_awesome, size: 16, color: AppTheme.gold),
                    ],
                  ),
                  const SizedBox(height: 10),

                  Text(
                    _selectedOccasion == 'boardroom'
                        ? (_selectedVibe == 'old-money' ? 'The Sovereign Executive' : 'The Modernist Architect')
                        : 'The Nocturne Bespoke',
                    style: GoogleFonts.cormorantGaramond(fontSize: 26, fontWeight: FontWeight.w700, color: textColor),
                  ),
                  Text(
                    'Precision curated for ${_occasions[_selectedOccasion]} with ${_vibes[_selectedVibe]} posture.',
                    style: GoogleFonts.outfit(fontSize: 12, color: mutedColor),
                  ),
                  const SizedBox(height: 16),

                  // Color Harmony Palette Swatches
                  Text('HARMONIC PALETTE', style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 1.2, color: AppTheme.gold)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _PaletteSwatch(name: 'Charcoal', color: const Color(0xFF2A2D34), textColor: textColor),
                      const SizedBox(width: 8),
                      _PaletteSwatch(name: 'French Blue', color: const Color(0xFF779ECB), textColor: textColor),
                      const SizedBox(width: 8),
                      _PaletteSwatch(name: 'Burgundy', color: const Color(0xFF631B26), textColor: textColor),
                      const SizedBox(width: 8),
                      _PaletteSwatch(name: 'Cream Silk', color: const Color(0xFFF7EFE0), textColor: textColor),
                    ],
                  ),
                  const SizedBox(height: 18),

                  // Pieces List
                  Text('RECOMMENDED WARDROBE ENSEMBLE', style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 1.2, color: AppTheme.gold)),
                  const SizedBox(height: 10),

                  ...[
                    {'cat': 'Outerwear', 'name': 'Double-Breasted Chalk-Stripe Jacket', 'brand': 'Brunello Cucinelli', 'icon': '🧥'},
                    {'cat': 'Shirt', 'name': 'Hand-Finished Sea Island Cotton Poplin', 'brand': 'Charvet', 'icon': '👔'},
                    {'cat': 'Trousers', 'name': 'Forward-Pleat Flannel Trousers', 'brand': 'Savile Row Bespoke', 'icon': '👖'},
                    {'cat': 'Footwear', 'name': 'Antique Museum Calf Loafers', 'brand': 'Baudoin & Lange', 'icon': '👞'},
                  ].map((p) => Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: elevatedColor,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: borderColor),
                        ),
                        child: Row(
                          children: [
                            Text(p['icon']!, style: const TextStyle(fontSize: 22)),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(p['name']!, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
                                  Text('${p['cat']} · ${p['brand']}', style: GoogleFonts.outfit(fontSize: 10, color: mutedColor)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      )),

                  const SizedBox(height: 16),

                  // Stylist Rationale
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppTheme.gold.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 0.3)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('STYLIST RATIONALE', style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 1.0, color: AppTheme.gold)),
                        const SizedBox(height: 4),
                        Text(
                          'The chalk-stripe tailoring introduces vertical authority, while breathable natural fibers remain responsive to interior climate control and transition gracefully into post-event socials.',
                          style: GoogleFonts.outfit(fontSize: 11, color: textColor, height: 1.35),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 18),

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
                      label: Text('ADAPT THIS PRESET TO MY CLOSET', style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 0.5)),
                      onPressed: () {
                        ref.read(curatedOutfitProvider.notifier).curateOutfit(
                              venue: _occasions[_selectedOccasion]!,
                              occasion: _selectedOccasion,
                              vibe: _vibes[_selectedVibe]!,
                              weather: 'Tonight · 28°C',
                            );
                        PlanYourLookSheet.show(context);
                      },
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PaletteSwatch extends StatelessWidget {
  final String name;
  final Color color;
  final Color textColor;

  const _PaletteSwatch({required this.name, required this.color, required this.textColor});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
            border: Border.all(color: AppTheme.gold.withValues(alpha: 0.4), width: 1.5),
          ),
        ),
        const SizedBox(height: 4),
        Text(name, style: GoogleFonts.outfit(fontSize: 9, color: textColor)),
      ],
    );
  }
}
