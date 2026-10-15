import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Luxury Dark Mode Palette
  static const Color noir = Color(0xFF0C0C0E);
  static const Color surfaceNoir = Color(0xFF161619);
  static const Color elevatedNoir = Color(0xFF222226);
  static const Color borderNoir = Color(0xFF2E2E34);

  // Luxury Accents
  static const Color gold = Color(0xFFD4AF37);
  static const Color goldLight = Color(0xFFF3E5AB);
  static const Color champagne = Color(0xFFE5D3B3);
  static const Color roseGold = Color(0xFFB76E79);
  static const Color emerald = Color(0xFF2D5A47);

  // Neutral tones
  static const Color silkWhite = Color(0xFFF8F9FA);
  static const Color mutedSilver = Color(0xFF9E9EA7);
  static const Color darkGray = Color(0xFF4A4A52);

  static ThemeData get luxuryDarkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: noir,
      primaryColor: gold,
      colorScheme: const ColorScheme.dark(
        primary: gold,
        onPrimary: noir,
        secondary: champagne,
        onSecondary: noir,
        surface: surfaceNoir,
        onSurface: silkWhite,
        error: Color(0xFFCF6679),
      ),
      cardTheme: CardThemeData(
        color: surfaceNoir,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: borderNoir, width: 1),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: noir,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: GoogleFonts.cormorantGaramond(
          fontSize: 26,
          fontWeight: FontWeight.w600,
          letterSpacing: 1.2,
          color: silkWhite,
        ),
        iconTheme: const IconThemeData(color: silkWhite),
      ),
      textTheme: TextTheme(
        displayLarge: GoogleFonts.cormorantGaramond(
          fontSize: 38,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.2,
          color: silkWhite,
        ),
        displayMedium: GoogleFonts.cormorantGaramond(
          fontSize: 28,
          fontWeight: FontWeight.w600,
          letterSpacing: 1.0,
          color: silkWhite,
        ),
        headlineSmall: GoogleFonts.outfit(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.5,
          color: silkWhite,
        ),
        titleMedium: GoogleFonts.outfit(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: silkWhite,
        ),
        bodyLarge: GoogleFonts.outfit(
          fontSize: 15,
          color: silkWhite,
          height: 1.4,
        ),
        bodyMedium: GoogleFonts.outfit(
          fontSize: 13,
          color: mutedSilver,
          height: 1.4,
        ),
        labelLarge: GoogleFonts.outfit(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          letterSpacing: 1.0,
          color: noir,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: gold,
          foregroundColor: noir,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: GoogleFonts.outfit(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            letterSpacing: 1.0,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: silkWhite,
          side: const BorderSide(color: borderNoir, width: 1.2),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: GoogleFonts.outfit(
            fontSize: 13,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceNoir,
        hintStyle: GoogleFonts.outfit(color: mutedSilver, fontSize: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: borderNoir),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: borderNoir),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: gold, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: surfaceNoir,
        indicatorColor: gold.withValues(alpha: 0.15),
        labelTextStyle: WidgetStateProperty.all(
          GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w500),
        ),
      ),
    );
  }
}
