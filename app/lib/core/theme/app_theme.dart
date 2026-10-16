import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Brand Palettes - Obsidian Dark Mode
  static const Color noir = Color(0xFF09090C);
  static const Color surfaceNoir = Color(0xFF141418);
  static const Color elevatedNoir = Color(0xFF1F1F26);
  static const Color borderNoir = Color(0xFF2C2C34);

  // Brand Palettes - Ivory Silk Light Mode (Pixel-matched to official logo)
  static const Color ivorySilk = Color(0xFFF7EFE0);
  static const Color surfaceIvory = Color(0xFFFFFFFF);
  static const Color elevatedIvory = Color(0xFFF0E5D3);
  static const Color borderIvory = Color(0xFFE2D3BD);
  static const Color textIvoryDark = Color(0xFF1C1612);
  static const Color textIvoryBody = Color(0xFF4A3E36);
  static const Color textIvoryMuted = Color(0xFF8A7969);

  // Luxury Accents
  static const Color gold = Color(0xFFD4AF37);
  static const Color goldLight = Color(0xFFF7E7A9);
  static const Color goldDark = Color(0xFFA67C1E);
  static const Color champagne = Color(0xFFE5D3B3);
  static const Color roseGold = Color(0xFFB76E79);
  static const Color emerald = Color(0xFF10B981);

  // Neutral tones
  static const Color silkWhite = Color(0xFFF8F9FA);
  static const Color mutedSilver = Color(0xFFA2A2AD);

  // 1. Luxury Dark Theme (Default)
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
        titleTextStyle: GoogleFonts.cinzel(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          letterSpacing: 2.0,
          color: silkWhite,
        ),
        iconTheme: const IconThemeData(color: silkWhite),
      ),
      textTheme: TextTheme(
        displayLarge: GoogleFonts.cormorantGaramond(
          fontSize: 36,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.5,
          color: silkWhite,
        ),
        displayMedium: GoogleFonts.cormorantGaramond(
          fontSize: 28,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.5,
          color: silkWhite,
        ),
        headlineSmall: GoogleFonts.outfit(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.3,
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
            fontSize: 13,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.8,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceNoir,
        hintStyle: GoogleFonts.outfit(color: mutedSilver, fontSize: 13),
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
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      ),
    );
  }

  // 2. Luxury Ivory Silk Light Theme (Matching Web & Official Logo)
  static ThemeData get luxuryLightTheme {
    return ThemeData(
      brightness: Brightness.light,
      scaffoldBackgroundColor: ivorySilk,
      primaryColor: goldDark,
      colorScheme: const ColorScheme.light(
        primary: goldDark,
        onPrimary: silkWhite,
        secondary: gold,
        onSecondary: textIvoryDark,
        surface: surfaceIvory,
        onSurface: textIvoryDark,
        error: Color(0xFFB00020),
      ),
      cardTheme: CardThemeData(
        color: surfaceIvory,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: borderIvory, width: 1),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: ivorySilk,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: GoogleFonts.cinzel(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          letterSpacing: 2.0,
          color: textIvoryDark,
        ),
        iconTheme: const IconThemeData(color: textIvoryDark),
      ),
      textTheme: TextTheme(
        displayLarge: GoogleFonts.cormorantGaramond(
          fontSize: 36,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.5,
          color: textIvoryDark,
        ),
        displayMedium: GoogleFonts.cormorantGaramond(
          fontSize: 28,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.5,
          color: textIvoryDark,
        ),
        headlineSmall: GoogleFonts.outfit(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.3,
          color: textIvoryDark,
        ),
        titleMedium: GoogleFonts.outfit(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: textIvoryDark,
        ),
        bodyLarge: GoogleFonts.outfit(
          fontSize: 15,
          color: textIvoryBody,
          height: 1.4,
        ),
        bodyMedium: GoogleFonts.outfit(
          fontSize: 13,
          color: textIvoryMuted,
          height: 1.4,
        ),
        labelLarge: GoogleFonts.outfit(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          letterSpacing: 1.0,
          color: silkWhite,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: goldDark,
          foregroundColor: ivorySilk,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: GoogleFonts.outfit(
            fontSize: 13,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.8,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceIvory,
        hintStyle: GoogleFonts.outfit(color: textIvoryMuted, fontSize: 13),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: borderIvory),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: borderIvory),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: goldDark, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      ),
    );
  }
}
