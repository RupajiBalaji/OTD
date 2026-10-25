import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// OTD luxury design system tokens pixel-matched to the 30-screen reference.
class OtdTokens {
  // Light Luxury Palette (Ivory Silk & Espresso)
  static const Color ivoryCanvas = Color(0xFFF7EFE0);
  static const Color ivoryCard = Color(0xFFFBF6EC);
  static const Color ivoryCardElevated = Color(0xFFF3E9D7);
  static const Color ivoryBorder = Color(0xFFEADBCE);
  static const Color ivoryBorderSubtle = Color(0xFFEFE4D6);
  static const Color espresso = Color(0xFF1C1612);
  static const Color espressoBody = Color(0xFF4A3E36);
  static const Color espressoMuted = Color(0xFF8A7969);
  static const Color espressoSubtle = Color(0xFFB5A594);

  // Dark Luxury Palette (Obsidian Noir)
  static const Color obsidianCanvas = Color(0xFF09090C);
  static const Color obsidianCard = Color(0xFF15151A);
  static const Color obsidianCardElevated = Color(0xFF1F1F27);
  static const Color obsidianBorder = Color(0xFF2C2C35);
  static const Color obsidianText = Color(0xFFF8F9FA);
  static const Color obsidianTextMuted = Color(0xFFA2A2AD);
  static const Color obsidianTextSubtle = Color(0xFF6B6B76);

  // Champagne & Deep Gold Accents
  static const Color gold = Color(0xFFD4AF37);
  static const Color goldDeep = Color(0xFFA67C1E);
  static const Color goldLight = Color(0xFFF7E7A9);
  static const Color goldMuted = Color(0xFFE3D4B4);
  static const Color goldTint = Color(0x1FD4AF37); // ~12% opacity gold
  static const Color goldGlow = Color(0x40D4AF37);

  // Status & Utility Colors
  static const Color white = Color(0xFFFFFFFF);
  static const Color emerald = Color(0xFF10B981);
  static const Color rose = Color(0xFFE11D48);

  // Geometry & Radii
  static const double radiusCard = 20.0;
  static const double radiusCardLg = 24.0;
  static const double radiusChip = 12.0;
  static const double radiusInput = 14.0;
  static const double radiusButton = 16.0;
  static const double buttonHeight = 52.0;

  // Spacing
  static const double screenPaddingH = 22.0;
  static const double screenPaddingV = 20.0;
  static const double gapSection = 24.0;
  static const double gapItems = 16.0;
  static const double gapSmall = 8.0;

  // Typography helpers
  static TextStyle headingLarge({Color? color, FontWeight weight = FontWeight.w600}) {
    return GoogleFonts.cormorantGaramond(
      fontSize: 32,
      fontWeight: weight,
      height: 1.15,
      letterSpacing: -0.3,
      color: color,
    );
  }

  static TextStyle headingMedium({Color? color, FontWeight weight = FontWeight.w600}) {
    return GoogleFonts.cormorantGaramond(
      fontSize: 26,
      fontWeight: weight,
      height: 1.2,
      letterSpacing: -0.2,
      color: color,
    );
  }

  static TextStyle headingSmall({Color? color, FontWeight weight = FontWeight.w600}) {
    return GoogleFonts.cormorantGaramond(
      fontSize: 21,
      fontWeight: weight,
      height: 1.25,
      letterSpacing: 0,
      color: color,
    );
  }

  static TextStyle bodyLarge({Color? color, FontWeight weight = FontWeight.w400}) {
    return GoogleFonts.inter(
      fontSize: 15,
      fontWeight: weight,
      height: 1.45,
      color: color,
    );
  }

  static TextStyle bodyMedium({Color? color, FontWeight weight = FontWeight.w400}) {
    return GoogleFonts.inter(
      fontSize: 13.5,
      fontWeight: weight,
      height: 1.4,
      color: color,
    );
  }

  static TextStyle bodySmall({Color? color, FontWeight weight = FontWeight.w400}) {
    return GoogleFonts.inter(
      fontSize: 12,
      fontWeight: weight,
      height: 1.35,
      color: color,
    );
  }

  static TextStyle label({Color? color, FontWeight weight = FontWeight.w600, double letterSpacing = 0.5}) {
    return GoogleFonts.inter(
      fontSize: 12,
      fontWeight: weight,
      letterSpacing: letterSpacing,
      color: color,
    );
  }

  static TextStyle caption({Color? color, FontWeight weight = FontWeight.w400, double letterSpacing = 0.4}) {
    return GoogleFonts.inter(
      fontSize: 10.5,
      fontWeight: weight,
      letterSpacing: letterSpacing,
      color: color,
    );
  }

  static TextStyle buttonText({Color? color, FontWeight weight = FontWeight.w600}) {
    return GoogleFonts.inter(
      fontSize: 15,
      fontWeight: weight,
      letterSpacing: 0.2,
      color: color,
    );
  }

  // Soft low-opacity shadows
  static List<BoxShadow> softShadow({bool isDark = false, double blur = 14, double offsetY = 4}) {
    return [
      BoxShadow(
        color: isDark ? Colors.black.withValues(alpha: 0.35) : const Color(0xFF1C1612).withValues(alpha: 0.04),
        blurRadius: blur,
        offset: Offset(0, offsetY),
      ),
    ];
  }

  static List<BoxShadow> goldGlowShadow() {
    return [
      BoxShadow(
        color: gold.withValues(alpha: 0.28),
        blurRadius: 18,
        spreadRadius: 1,
        offset: const Offset(0, 4),
      ),
    ];
  }
}

/// Convenience theme extension to access dynamic tokens according to brightness
@immutable
class OtdColors extends ThemeExtension<OtdColors> {
  final bool isDark;
  final Color canvas;
  final Color card;
  final Color cardElevated;
  final Color border;
  final Color borderSubtle;
  final Color textPrimary;
  final Color textSecondary;
  final Color textMuted;
  final Color primaryButtonBg;
  final Color primaryButtonText;
  final Color accent;
  final Color accentDeep;
  final Color accentTint;

  const OtdColors({
    required this.isDark,
    required this.canvas,
    required this.card,
    required this.cardElevated,
    required this.border,
    required this.borderSubtle,
    required this.textPrimary,
    required this.textSecondary,
    required this.textMuted,
    required this.primaryButtonBg,
    required this.primaryButtonText,
    required this.accent,
    required this.accentDeep,
    required this.accentTint,
  });

  static const OtdColors light = OtdColors(
    isDark: false,
    canvas: OtdTokens.ivoryCanvas,
    card: OtdTokens.ivoryCard,
    cardElevated: OtdTokens.ivoryCardElevated,
    border: OtdTokens.ivoryBorder,
    borderSubtle: OtdTokens.ivoryBorderSubtle,
    textPrimary: OtdTokens.espresso,
    textSecondary: OtdTokens.espressoBody,
    textMuted: OtdTokens.espressoMuted,
    primaryButtonBg: OtdTokens.espresso,
    primaryButtonText: OtdTokens.white,
    accent: OtdTokens.gold,
    accentDeep: OtdTokens.goldDeep,
    accentTint: OtdTokens.goldTint,
  );

  static const OtdColors dark = OtdColors(
    isDark: true,
    canvas: OtdTokens.obsidianCanvas,
    card: OtdTokens.obsidianCard,
    cardElevated: OtdTokens.obsidianCardElevated,
    border: OtdTokens.obsidianBorder,
    borderSubtle: Color(0xFF22222A),
    textPrimary: OtdTokens.obsidianText,
    textSecondary: Color(0xFFD6D6E0),
    textMuted: OtdTokens.obsidianTextMuted,
    primaryButtonBg: OtdTokens.gold,
    primaryButtonText: OtdTokens.espresso,
    accent: OtdTokens.gold,
    accentDeep: OtdTokens.goldLight,
    accentTint: Color(0x28D4AF37),
  );

  static OtdColors of(BuildContext context) {
    return Theme.of(context).extension<OtdColors>() ??
        (Theme.of(context).brightness == Brightness.dark ? dark : light);
  }

  @override
  ThemeExtension<OtdColors> copyWith({
    bool? isDark,
    Color? canvas,
    Color? card,
    Color? cardElevated,
    Color? border,
    Color? borderSubtle,
    Color? textPrimary,
    Color? textSecondary,
    Color? textMuted,
    Color? primaryButtonBg,
    Color? primaryButtonText,
    Color? accent,
    Color? accentDeep,
    Color? accentTint,
  }) {
    return OtdColors(
      isDark: isDark ?? this.isDark,
      canvas: canvas ?? this.canvas,
      card: card ?? this.card,
      cardElevated: cardElevated ?? this.cardElevated,
      border: border ?? this.border,
      borderSubtle: borderSubtle ?? this.borderSubtle,
      textPrimary: textPrimary ?? this.textPrimary,
      textSecondary: textSecondary ?? this.textSecondary,
      textMuted: textMuted ?? this.textMuted,
      primaryButtonBg: primaryButtonBg ?? this.primaryButtonBg,
      primaryButtonText: primaryButtonText ?? this.primaryButtonText,
      accent: accent ?? this.accent,
      accentDeep: accentDeep ?? this.accentDeep,
      accentTint: accentTint ?? this.accentTint,
    );
  }

  @override
  ThemeExtension<OtdColors> lerp(covariant ThemeExtension<OtdColors>? other, double t) {
    if (other is! OtdColors) return this;
    return OtdColors(
      isDark: t < 0.5 ? isDark : other.isDark,
      canvas: Color.lerp(canvas, other.canvas, t)!,
      card: Color.lerp(card, other.card, t)!,
      cardElevated: Color.lerp(cardElevated, other.cardElevated, t)!,
      border: Color.lerp(border, other.border, t)!,
      borderSubtle: Color.lerp(borderSubtle, other.borderSubtle, t)!,
      textPrimary: Color.lerp(textPrimary, other.textPrimary, t)!,
      textSecondary: Color.lerp(textSecondary, other.textSecondary, t)!,
      textMuted: Color.lerp(textMuted, other.textMuted, t)!,
      primaryButtonBg: Color.lerp(primaryButtonBg, other.primaryButtonBg, t)!,
      primaryButtonText: Color.lerp(primaryButtonText, other.primaryButtonText, t)!,
      accent: Color.lerp(accent, other.accent, t)!,
      accentDeep: Color.lerp(accentDeep, other.accentDeep, t)!,
      accentTint: Color.lerp(accentTint, other.accentTint, t)!,
    );
  }
}
