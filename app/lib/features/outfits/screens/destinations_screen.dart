import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class CuratedVenue {
  final String id;
  final String name;
  final String location;
  final String category;
  final String img;
  final String ambience;
  final String vibe;
  final String crowd;
  final String dressCode;
  final bool isIndoor;
  final String tempRange;
  final String description;

  const CuratedVenue({
    required this.id,
    required this.name,
    required this.location,
    required this.category,
    required this.img,
    required this.ambience,
    required this.vibe,
    required this.crowd,
    required this.dressCode,
    required this.isIndoor,
    required this.tempRange,
    required this.description,
  });
}

class DestinationsScreen extends StatelessWidget {
  final Function(CuratedVenue venue)? onSelectVenue;

  const DestinationsScreen({super.key, this.onSelectVenue});

  static const List<CuratedVenue> venues = [
    CuratedVenue(
      id: 'lamore',
      name: "L'amore",
      location: 'Banjara Hills, Hyderabad',
      category: 'Restaurant',
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      ambience: 'Fine Dining',
      vibe: 'Romantic',
      crowd: 'Upscale',
      dressCode: 'Smart Casual',
      isIndoor: true,
      tempRange: '26-30°C',
      description: "L'amore is a fine dining restaurant known for its elegant ambience, warm lighting and modern aesthetic. It's a popular spot for date nights, special occasions and upscale dinners.",
    ),
    CuratedVenue(
      id: 'olive',
      name: 'Olive Bistro',
      location: 'Jubilee Hills, Hyderabad',
      category: 'Restaurant',
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      ambience: 'Mediterranean Terrace',
      vibe: 'Chic & Breezy',
      crowd: 'Sartorial Socialites',
      dressCode: 'Resort Smart Casual',
      isIndoor: false,
      tempRange: '24-28°C',
      description: 'Picturesque hilltop bistro overlooking Durgam Cheruvu lake. White-washed walls, floral bougainvillea, and candle-lit alfresco seating perfect for relaxed conversations.',
    ),
    CuratedVenue(
      id: 'aer',
      name: 'Aer Lounge',
      location: 'Worli, Mumbai',
      category: 'Bar / Club',
      img: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80',
      ambience: 'Rooftop Sky Lounge',
      vibe: 'Electrifying & Alluring',
      crowd: 'Nightlife Connoisseurs',
      dressCode: 'Cocktail Tailored',
      isIndoor: false,
      tempRange: '27-29°C',
      description: 'High-altitude open-air lounge offering panoramic Arabian Sea vistas, house beats, and dramatic city skyline night views requiring sleek tailoring.',
    ),
    CuratedVenue(
      id: 'soho',
      name: 'Soho House Lounge',
      location: 'Juhu Beach, Mumbai',
      category: 'Café',
      img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      ambience: 'Private Club & Library',
      vibe: 'Minimalist & Creative',
      crowd: 'Artists & Executives',
      dressCode: 'Casual Luxury',
      isIndoor: true,
      tempRange: '23-25°C',
      description: 'Understated beachside member enclave boasting vintage velvet armchairs, teak finishes, and art collections suitable for elevated relaxed pieces.',
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
              'DESTINATION MODE',
              style: GoogleFonts.outfit(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                letterSpacing: 2.0,
                color: AppTheme.gold,
              ),
            ),
            Text(
              'Curated Venues & Ambience',
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
        itemCount: venues.length,
        separatorBuilder: (_, __) => const SizedBox(height: 18),
        itemBuilder: (context, index) {
          final venue = venues[index];
          return Container(
            decoration: BoxDecoration(
              color: surfaceColor,
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: borderColor),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            clipBehavior: Clip.antiAlias,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Venue Image & Tag
                Stack(
                  children: [
                    Container(
                      height: 180,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        image: DecorationImage(
                          image: NetworkImage(venue.img),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    Positioned(
                      top: 12,
                      left: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.75),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          venue.category.toUpperCase(),
                          style: GoogleFonts.outfit(
                            fontSize: 9,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.gold,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      top: 12,
                      right: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.75),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          venue.tempRange,
                          style: GoogleFonts.outfit(
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),

                // Venue Details
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            venue.name,
                            style: GoogleFonts.cormorantGaramond(
                              fontSize: 22,
                              fontWeight: FontWeight.w700,
                              color: textColor,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: elevatedColor,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: borderColor),
                            ),
                            child: Text(
                              venue.isIndoor ? 'Indoor A/C' : 'Alfresco Terrace',
                              style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.bold, color: AppTheme.gold),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          const Icon(Icons.location_on_outlined, size: 13, color: AppTheme.gold),
                          const SizedBox(width: 4),
                          Text(
                            venue.location,
                            style: GoogleFonts.outfit(fontSize: 11, color: mutedColor),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        venue.description,
                        style: GoogleFonts.outfit(fontSize: 12, color: textColor, height: 1.35),
                      ),
                      const SizedBox(height: 12),

                      // Chips: Ambience, Vibe, Dress Code
                      Wrap(
                        spacing: 6,
                        runSpacing: 6,
                        children: [
                          _TagChip(label: venue.ambience, isDark: isDark),
                          _TagChip(label: venue.vibe, isDark: isDark),
                          _TagChip(label: 'Dress: ${venue.dressCode}', isDark: isDark, isHighlight: true),
                        ],
                      ),
                      const SizedBox(height: 16),

                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.gold,
                            foregroundColor: AppTheme.noir,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          ),
                          icon: const Icon(Icons.auto_awesome, size: 16),
                          label: Text(
                            'STYLE ME FOR THIS PLACE',
                            style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 0.5),
                          ),
                          onPressed: () {
                            if (onSelectVenue != null) {
                              onSelectVenue!(venue);
                            }
                            Navigator.pop(context);
                          },
                        ),
                      ),
                    ],
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

class _TagChip extends StatelessWidget {
  final String label;
  final bool isDark;
  final bool isHighlight;

  const _TagChip({required this.label, required this.isDark, this.isHighlight = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: isHighlight
            ? AppTheme.gold.withValues(alpha: 0.15)
            : (isDark ? AppTheme.elevatedNoir : AppTheme.elevatedIvory),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isHighlight ? AppTheme.gold.withValues(alpha: 0.5) : (isDark ? AppTheme.borderNoir : AppTheme.borderIvory),
        ),
      ),
      child: Text(
        label,
        style: GoogleFonts.outfit(
          fontSize: 10,
          fontWeight: isHighlight ? FontWeight.w700 : FontWeight.w500,
          color: isHighlight ? AppTheme.gold : (isDark ? AppTheme.mutedSilver : AppTheme.textIvoryMuted),
        ),
      ),
    );
  }
}
