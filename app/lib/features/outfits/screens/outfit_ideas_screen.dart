import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class EditorialLookIdea {
  final String title;
  final String tag;
  final String img;
  final String desc;

  const EditorialLookIdea({
    required this.title,
    required this.tag,
    required this.img,
    required this.desc,
  });
}

class OutfitIdeasScreen extends StatelessWidget {
  final Function(String title)? onRecreateWithCloset;

  const OutfitIdeasScreen({super.key, this.onRecreateWithCloset});

  static const List<EditorialLookIdea> ideas = [
    EditorialLookIdea(
      title: 'The Milanese Tailored Linen',
      tag: 'Summer Sartorial',
      img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      desc: 'Breathable oatmeal linen trousers paired with open camp collar shirt and hand-finished Belgian loafers.',
    ),
    EditorialLookIdea(
      title: 'The Parisian Monochrome',
      tag: 'Minimalist Date',
      img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      desc: 'All-black high-neck cashmere sweater with sharp wool trousers and understated Chelsea boots.',
    ),
    EditorialLookIdea(
      title: 'The Riviera Seaside Resort',
      tag: 'Effortless Vacation',
      img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
      desc: 'Crisp sand linen overshirt with white Gurkha shorts, tortoise sunglasses, and clean canvas low-tops.',
    ),
  ];

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
              'HAUTE LOOKBOOK & IDEAS',
              style: GoogleFonts.outfit(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                letterSpacing: 2.0,
                color: AppTheme.gold,
              ),
            ),
            Text(
              'Editorial Styling Inspo',
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
        itemCount: ideas.length,
        separatorBuilder: (_, __) => const SizedBox(height: 20),
        itemBuilder: (context, index) {
          final idea = ideas[index];
          return Container(
            decoration: BoxDecoration(
              color: surfaceColor,
              borderRadius: BorderRadius.circular(24),
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
                Stack(
                  children: [
                    Container(
                      height: 200,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        image: DecorationImage(
                          image: NetworkImage(idea.img),
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
                          idea.tag.toUpperCase(),
                          style: GoogleFonts.outfit(
                            fontSize: 9,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.gold,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        idea.title,
                        style: GoogleFonts.cormorantGaramond(
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          color: textColor,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        idea.desc,
                        style: GoogleFonts.outfit(
                          fontSize: 12,
                          color: mutedColor,
                          height: 1.4,
                        ),
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
                            'RECREATE WITH MY CLOSET',
                            style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 0.5),
                          ),
                          onPressed: () {
                            if (onRecreateWithCloset != null) {
                              onRecreateWithCloset!(idea.title);
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
