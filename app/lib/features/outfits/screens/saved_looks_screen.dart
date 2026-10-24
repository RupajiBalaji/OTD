import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class SavedLookItem {
  final String id;
  final String title;
  final String subtitle;
  final String occasion;
  final String venue;
  final String weather;
  final String img;
  final String piecesSummary;
  final String date;

  SavedLookItem({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.occasion,
    required this.venue,
    required this.weather,
    required this.img,
    required this.piecesSummary,
    required this.date,
  });
}

class SavedLooksScreen extends StatefulWidget {
  final Function(SavedLookItem)? onWearLook;

  const SavedLooksScreen({super.key, this.onWearLook});

  @override
  State<SavedLooksScreen> createState() => _SavedLooksScreenState();
}

class _SavedLooksScreenState extends State<SavedLooksScreen> {
  final List<SavedLookItem> _savedLooks = [
    SavedLookItem(
      id: 'smart-casual-1',
      title: 'Smart Casual',
      subtitle: "For Today's Weather",
      occasion: 'Casual Evening',
      venue: 'Olive Bistro',
      weather: '28°C Breezy',
      img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
      piecesSummary: 'Linen Camp Shirt, Gurkha Chinos, Belgian Loafers',
      date: 'Saved Oct 16',
    ),
    SavedLookItem(
      id: 'date-night-1',
      title: 'Date Night',
      subtitle: 'Classy & Effortless',
      occasion: 'Date Night',
      venue: "L'amore, Banjara Hills",
      weather: '27°C Partly Cloudy',
      img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80',
      piecesSummary: 'Silk-Cashmere Knit, Flannel Pleated Trousers, Suede Loafers',
      date: 'Saved Oct 17',
    ),
    SavedLookItem(
      id: 'office-ready-1',
      title: 'Office Ready',
      subtitle: 'Clean & Polished',
      occasion: 'Executive Presentation',
      venue: 'Executive Boardroom',
      weather: '24°C Climate Controlled',
      img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80',
      piecesSummary: 'Sea Island Cotton Shirt, Navy Hopsack Blazer, Oxford Shoes',
      date: 'Saved Oct 18',
    ),
  ];

  void _removeLook(String id) {
    setState(() {
      _savedLooks.removeWhere((l) => l.id == id);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Look removed from saved.')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? AppTheme.noir : AppTheme.ivorySilk;
    final surfaceColor = isDark ? AppTheme.surfaceNoir : AppTheme.surfaceIvory;
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
              'SAVED LOOKS & FAVORITES',
              style: GoogleFonts.outfit(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                letterSpacing: 2.0,
                color: AppTheme.gold,
              ),
            ),
            Text(
              'Curated Ensembles',
              style: GoogleFonts.cormorantGaramond(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: textColor,
              ),
            ),
          ],
        ),
      ),
      body: _savedLooks.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.bookmark_border, size: 48, color: mutedColor),
                  const SizedBox(height: 12),
                  Text(
                    'No saved looks yet',
                    style: GoogleFonts.cormorantGaramond(fontSize: 22, fontWeight: FontWeight.bold, color: textColor),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Bookmark outfits from AI Stylist to access them here.',
                    style: GoogleFonts.outfit(fontSize: 12, color: mutedColor),
                  ),
                ],
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(20),
              itemCount: _savedLooks.length,
              separatorBuilder: (_, __) => const SizedBox(height: 16),
              itemBuilder: (context, index) {
                final look = _savedLooks[index];
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
                      // Image with overlay actions
                      Stack(
                        children: [
                          Container(
                            height: 180,
                            width: double.infinity,
                            decoration: BoxDecoration(
                              image: DecorationImage(
                                image: NetworkImage(look.img),
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
                                color: Colors.black.withValues(alpha: 0.7),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                look.occasion.toUpperCase(),
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
                            top: 10,
                            right: 10,
                            child: CircleAvatar(
                              radius: 16,
                              backgroundColor: Colors.black.withValues(alpha: 0.65),
                              child: IconButton(
                                icon: const Icon(Icons.delete_outline, size: 16, color: Color(0xFFF43F5E)),
                                padding: EdgeInsets.zero,
                                onPressed: () => _removeLook(look.id),
                              ),
                            ),
                          ),
                        ],
                      ),

                      // Information Body
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  look.title,
                                  style: GoogleFonts.cormorantGaramond(
                                    fontSize: 20,
                                    fontWeight: FontWeight.w700,
                                    color: textColor,
                                  ),
                                ),
                                Text(
                                  look.date,
                                  style: GoogleFonts.outfit(fontSize: 10, color: mutedColor),
                                ),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Row(
                              children: [
                                const Icon(Icons.location_on_outlined, size: 13, color: AppTheme.gold),
                                const SizedBox(width: 4),
                                Text(
                                  look.venue,
                                  style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.gold, fontWeight: FontWeight.w600),
                                ),
                                const SizedBox(width: 8),
                                Text('•', style: TextStyle(color: mutedColor, fontSize: 10)),
                                const SizedBox(width: 8),
                                Text(look.weather, style: GoogleFonts.outfit(fontSize: 11, color: mutedColor)),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Text(
                              look.piecesSummary,
                              style: GoogleFonts.outfit(fontSize: 12, color: textColor, height: 1.3),
                            ),
                            const SizedBox(height: 14),

                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppTheme.gold,
                                  foregroundColor: AppTheme.noir,
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                ),
                                icon: const Icon(Icons.visibility_outlined, size: 16),
                                label: Text(
                                  'WEAR / VIEW IN STYLIST',
                                  style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 0.5),
                                ),
                                onPressed: () {
                                  if (widget.onWearLook != null) {
                                    widget.onWearLook!(look);
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
