import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'otd_tokens.dart';

class AppTheme {
  // Brand Palettes - Obsidian Dark Mode
  static const Color noir = OtdTokens.obsidianCanvas;
  static const Color surfaceNoir = OtdTokens.obsidianCard;
  static const Color elevatedNoir = OtdTokens.obsidianCardElevated;
  static const Color borderNoir = OtdTokens.obsidianBorder;

  // Brand Palettes - Ivory Silk Light Mode (Pixel-matched to official reference)
  static const Color ivorySilk = OtdTokens.ivoryCanvas;
  static const Color surfaceIvory = OtdTokens.ivoryCard;
  static const Color elevatedIvory = OtdTokens.ivoryCardElevated;
  static const Color borderIvory = OtdTokens.ivoryBorder;
  static const Color textIvoryDark = OtdTokens.espresso;
  static const Color textIvoryBody = OtdTokens.espressoBody;
  static const Color textIvoryMuted = OtdTokens.espressoMuted;

  // Luxury Accents
  static const Color gold = OtdTokens.gold;
  static const Color goldLight = OtdTokens.goldLight;
  static const Color goldDark = OtdTokens.goldDeep;
  static const Color champagne = Color(0xFFE5D3B3);
  static const Color roseGold = Color(0xFFB76E79);
  static const Color emerald = OtdTokens.emerald;

  // Neutral tones
  static const Color silkWhite = OtdTokens.obsidianText;
  static const Color mutedSilver = OtdTokens.obsidianTextMuted;

  // 1. Luxury Dark Theme (Obsidian + Gold)
  static ThemeData get luxuryDarkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: OtdTokens.obsidianCanvas,
      primaryColor: OtdTokens.gold,
      extensions: const [OtdColors.dark],
      colorScheme: const ColorScheme.dark(
        primary: OtdTokens.gold,
        onPrimary: OtdTokens.espresso,
        secondary: OtdTokens.goldLight,
        onSecondary: OtdTokens.espresso,
        surface: OtdTokens.obsidianCard,
        onSurface: OtdTokens.obsidianText,
        error: Color(0xFFCF6679),
      ),
      cardTheme: CardThemeData(
        color: OtdTokens.obsidianCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(OtdTokens.radiusCard),
          side: const BorderSide(color: OtdTokens.obsidianBorder, width: 1),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: OtdTokens.obsidianCanvas,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: GoogleFonts.cormorantGaramond(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.5,
          color: OtdTokens.obsidianText,
        ),
        iconTheme: const IconThemeData(color: OtdTokens.obsidianText),
      ),
      textTheme: TextTheme(
        displayLarge: GoogleFonts.cormorantGaramond(
          fontSize: 34,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.3,
          color: OtdTokens.obsidianText,
        ),
        displayMedium: GoogleFonts.cormorantGaramond(
          fontSize: 26,
          fontWeight: FontWeight.w600,
          letterSpacing: -0.2,
          color: OtdTokens.obsidianText,
        ),
        headlineSmall: GoogleFonts.cormorantGaramond(
          fontSize: 21,
          fontWeight: FontWeight.w600,
          color: OtdTokens.obsidianText,
        ),
        titleMedium: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: OtdTokens.obsidianText,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: 15,
          color: OtdTokens.obsidianText,
          height: 1.45,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 13.5,
          color: OtdTokens.obsidianTextMuted,
          height: 1.4,
        ),
        labelLarge: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.3,
          color: OtdTokens.espresso,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: OtdTokens.gold,
          foregroundColor: OtdTokens.espresso,
          elevation: 0,
          minimumSize: const Size.fromHeight(OtdTokens.buttonHeight),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(OtdTokens.radiusButton),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.2,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: OtdTokens.obsidianCard,
        hintStyle: GoogleFonts.inter(color: OtdTokens.obsidianTextMuted, fontSize: 13.5),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(OtdTokens.radiusInput),
          borderSide: const BorderSide(color: OtdTokens.obsidianBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(OtdTokens.radiusInput),
          borderSide: const BorderSide(color: OtdTokens.obsidianBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(OtdTokens.radiusInput),
          borderSide: const BorderSide(color: OtdTokens.gold, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      ),
    );
  }

  // 2. Luxury Ivory Silk Light Theme (Ivory + Espresso + Gold)
  static ThemeData get luxuryLightTheme {
    return ThemeData(
      brightness: Brightness.light,
      scaffoldBackgroundColor: OtdTokens.ivoryCanvas,
      primaryColor: OtdTokens.espresso,
      extensions: const [OtdColors.light],
      colorScheme: const ColorScheme.light(
        primary: OtdTokens.espresso,
        onPrimary: OtdTokens.white,
        secondary: OtdTokens.gold,
        onSecondary: OtdTokens.white,
        surface: OtdTokens.ivoryCard,
        onSurface: OtdTokens.espresso,
        error: Color(0xFFB00020),
      ),
      cardTheme: CardThemeData(
        color: OtdTokens.ivoryCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(OtdTokens.radiusCard),
          side: const BorderSide(color: OtdTokens.ivoryBorder, width: 1),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: OtdTokens.ivoryCanvas,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: GoogleFonts.cormorantGaramond(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.5,
          color: OtdTokens.espresso,
        ),
        iconTheme: const IconThemeData(color: OtdTokens.espresso),
      ),
      textTheme: TextTheme(
        displayLarge: GoogleFonts.cormorantGaramond(
          fontSize: 34,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.3,
          color: OtdTokens.espresso,
        ),
        displayMedium: GoogleFonts.cormorantGaramond(
          fontSize: 26,
          fontWeight: FontWeight.w600,
          letterSpacing: -0.2,
          color: OtdTokens.espresso,
        ),
        headlineSmall: GoogleFonts.cormorantGaramond(
          fontSize: 21,
          fontWeight: FontWeight.w600,
          color: OtdTokens.espresso,
        ),
        titleMedium: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: OtdTokens.espresso,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: 15,
          color: OtdTokens.espressoBody,
          height: 1.45,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 13.5,
          color: OtdTokens.espressoMuted,
          height: 1.4,
        ),
        labelLarge: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.3,
          color: OtdTokens.white,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: OtdTokens.espresso,
          foregroundColor: OtdTokens.white,
          elevation: 0,
          minimumSize: const Size.fromHeight(OtdTokens.buttonHeight),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(OtdTokens.radiusButton),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.2,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: OtdTokens.ivoryCard,
        hintStyle: GoogleFonts.inter(color: OtdTokens.espressoMuted, fontSize: 13.5),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(OtdTokens.radiusInput),
          borderSide: const BorderSide(color: OtdTokens.ivoryBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(OtdTokens.radiusInput),
          borderSide: const BorderSide(color: OtdTokens.ivoryBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(OtdTokens.radiusInput),
          borderSide: const BorderSide(color: OtdTokens.gold, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      ),
    );
  }
}
