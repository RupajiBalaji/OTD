import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class AvatarPreset {
  final String id;
  final String name;
  final String skinToneHex;
  final String hairStyle;
  final String hairColorHex;
  final String bodyShape;

  const AvatarPreset({
    required this.id,
    required this.name,
    required this.skinToneHex,
    required this.hairStyle,
    required this.hairColorHex,
    required this.bodyShape,
  });

  static const List<AvatarPreset> presets = [
    AvatarPreset(
      id: 'avatar_1',
      name: 'Aria Luxe',
      skinToneHex: '#E0AC69',
      hairStyle: 'Classic Wave',
      hairColorHex: '#2C1D11',
      bodyShape: 'Rectangle',
    ),
    AvatarPreset(
      id: 'avatar_2',
      name: 'Julian Noir',
      skinToneHex: '#8D5524',
      hairStyle: 'Textured Fade',
      hairColorHex: '#121212',
      bodyShape: 'Inverted Triangle',
    ),
    AvatarPreset(
      id: 'avatar_3',
      name: 'Elena Chic',
      skinToneHex: '#D4A373',
      hairStyle: 'Sleek Bob',
      hairColorHex: '#3B2219',
      bodyShape: 'Hourglass',
    ),
    AvatarPreset(
      id: 'avatar_4',
      name: 'Marcus Sartorial',
      skinToneHex: '#F1C27D',
      hairStyle: 'Modern Crop',
      hairColorHex: '#1F1A17',
      bodyShape: 'Rectangle',
    ),
    AvatarPreset(
      id: 'avatar_5',
      name: 'Sora Avant',
      skinToneHex: '#603B1A',
      hairStyle: 'Voluminous Updo',
      hairColorHex: '#0A0A0A',
      bodyShape: 'Oval',
    ),
  ];

  static AvatarPreset getById(String id) {
    return presets.firstWhere((p) => p.id == id, orElse: () => presets.first);
  }
}

class AvatarWidget extends StatelessWidget {
  final String skinTone;
  final String hairStyle;
  final String? hairColor;
  final double size;
  final bool showGoldBackdrop;
  final Color? topGarmentColor;
  final Color? bottomGarmentColor;

  const AvatarWidget({
    super.key,
    required this.skinTone,
    required this.hairStyle,
    this.hairColor,
    this.size = 120,
    this.showGoldBackdrop = false,
    this.topGarmentColor,
    this.bottomGarmentColor,
  });

  Color _parseHex(String hex, Color fallback) {
    try {
      final clean = hex.replaceAll('#', '');
      return Color(int.parse('FF$clean', radix: 16));
    } catch (_) {
      return fallback;
    }
  }

  @override
  Widget build(BuildContext context) {
    final skin = _parseHex(skinTone, const Color(0xFFE0AC69));
    final hair = _parseHex(hairColor ?? '#2C1D11', const Color(0xFF2C1D11));
    final topColor = topGarmentColor ?? const Color(0xFF1C1612);
    final bottomColor = bottomGarmentColor ?? const Color(0xFF4A4036);

    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: showGoldBackdrop
          ? BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  AppTheme.gold.withValues(alpha: 0.35),
                  AppTheme.gold.withValues(alpha: 0.08),
                  Colors.transparent,
                ],
                stops: const [0.4, 0.75, 1.0],
              ),
            )
          : null,
      child: CustomPaint(
        size: Size(size, size),
        painter: _IllustratedAvatarPainter(
          skinColor: skin,
          hairColor: hair,
          hairStyle: hairStyle,
          topColor: topColor,
          bottomColor: bottomColor,
        ),
      ),
    );
  }
}

class _IllustratedAvatarPainter extends CustomPainter {
  final Color skinColor;
  final Color hairColor;
  final String hairStyle;
  final Color topColor;
  final Color bottomColor;

  _IllustratedAvatarPainter({
    required this.skinColor,
    required this.hairColor,
    required this.hairStyle,
    required this.topColor,
    required this.bottomColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final cx = w / 2;

    final skinPaint = Paint()..color = skinColor;
    final shadowSkinPaint = Paint()
      ..color = HSLColor.fromColor(skinColor).withLightness((HSLColor.fromColor(skinColor).lightness - 0.12).clamp(0.0, 1.0)).toColor();
    final hairPaint = Paint()..color = hairColor;
    final topPaint = Paint()..color = topColor;
    final linePaint = Paint()
      ..color = Colors.black.withValues(alpha: 0.25)
      ..style = PaintingStyle.stroke
      ..strokeWidth = w * 0.015;

    // 1. Shoulders & Torso (Top Garment)
    final topPath = Path()
      ..moveTo(cx - w * 0.28, h * 0.95)
      ..lineTo(cx - w * 0.24, h * 0.58)
      ..quadraticBezierTo(cx - w * 0.14, h * 0.50, cx - w * 0.07, h * 0.48)
      ..lineTo(cx + w * 0.07, h * 0.48)
      ..quadraticBezierTo(cx + w * 0.14, h * 0.50, cx + w * 0.24, h * 0.58)
      ..lineTo(cx + w * 0.28, h * 0.95)
      ..close();
    canvas.drawPath(topPath, topPaint);

    // Collar detail
    final collarPath = Path()
      ..moveTo(cx - w * 0.07, h * 0.48)
      ..quadraticBezierTo(cx, h * 0.56, cx + w * 0.07, h * 0.48)
      ..lineTo(cx, h * 0.53)
      ..close();
    canvas.drawPath(collarPath, shadowSkinPaint);

    // 2. Neck
    final neckRect = RRect.fromRectAndRadius(
      Rect.fromCenter(center: Offset(cx, h * 0.42), width: w * 0.15, height: h * 0.16),
      Radius.circular(w * 0.04),
    );
    canvas.drawRRect(neckRect, skinPaint);

    // Neck shadow under chin
    final neckShadow = Path()
      ..moveTo(cx - w * 0.07, h * 0.38)
      ..quadraticBezierTo(cx, h * 0.43, cx + w * 0.07, h * 0.38)
      ..lineTo(cx + w * 0.07, h * 0.42)
      ..quadraticBezierTo(cx, h * 0.46, cx - w * 0.07, h * 0.42)
      ..close();
    canvas.drawPath(neckShadow, shadowSkinPaint);

    // 3. Head & Face
    final headRect = Rect.fromCenter(
      center: Offset(cx, h * 0.28),
      width: w * 0.30,
      height: h * 0.36,
    );
    canvas.drawOval(headRect, skinPaint);

    // Ears
    canvas.drawOval(
      Rect.fromCenter(center: Offset(cx - w * 0.15, h * 0.29), width: w * 0.05, height: h * 0.08),
      skinPaint,
    );
    canvas.drawOval(
      Rect.fromCenter(center: Offset(cx + w * 0.15, h * 0.29), width: w * 0.05, height: h * 0.08),
      skinPaint,
    );

    // Minimal Facial Accents
    // Eyebrows
    canvas.drawLine(
      Offset(cx - w * 0.09, h * 0.24),
      Offset(cx - w * 0.03, h * 0.235),
      linePaint,
    );
    canvas.drawLine(
      Offset(cx + w * 0.03, h * 0.235),
      Offset(cx + w * 0.09, h * 0.24),
      linePaint,
    );

    // Closed Calm Eyes (fashion editorial style)
    final eyePaint = Paint()
      ..color = Colors.black.withValues(alpha: 0.6)
      ..style = PaintingStyle.stroke
      ..strokeWidth = w * 0.012;
    canvas.drawArc(
      Rect.fromCenter(center: Offset(cx - w * 0.06, h * 0.27), width: w * 0.045, height: h * 0.025),
      0,
      3.14159,
      false,
      eyePaint,
    );
    canvas.drawArc(
      Rect.fromCenter(center: Offset(cx + w * 0.06, h * 0.27), width: w * 0.045, height: h * 0.025),
      0,
      3.14159,
      false,
      eyePaint,
    );

    // Minimal Lips
    final lipsPaint = Paint()..color = shadowSkinPaint.color;
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromCenter(center: Offset(cx, h * 0.36), width: w * 0.065, height: h * 0.02),
        const Radius.circular(3),
      ),
      lipsPaint,
    );

    // 4. Hair Rendering by Style
    if (hairStyle.contains('Bob') || hairStyle.contains('Wave')) {
      // Long / Wave / Bob
      final hairPath = Path()
        ..moveTo(cx - w * 0.17, h * 0.38)
        ..lineTo(cx - w * 0.16, h * 0.24)
        ..quadraticBezierTo(cx - w * 0.15, h * 0.10, cx, h * 0.10)
        ..quadraticBezierTo(cx + w * 0.15, h * 0.10, cx + w * 0.16, h * 0.24)
        ..lineTo(cx + w * 0.17, h * 0.38)
        ..quadraticBezierTo(cx + w * 0.12, h * 0.32, cx + w * 0.10, h * 0.20)
        ..quadraticBezierTo(cx, h * 0.15, cx - w * 0.10, h * 0.20)
        ..quadraticBezierTo(cx - w * 0.12, h * 0.32, cx - w * 0.17, h * 0.38)
        ..close();
      canvas.drawPath(hairPath, hairPaint);
    } else if (hairStyle.contains('Updo') || hairStyle.contains('Voluminous')) {
      // Bun / Updo
      canvas.drawCircle(Offset(cx, h * 0.09), w * 0.12, hairPaint);
      final hairBase = Path()
        ..moveTo(cx - w * 0.15, h * 0.25)
        ..quadraticBezierTo(cx - w * 0.14, h * 0.13, cx, h * 0.13)
        ..quadraticBezierTo(cx + w * 0.14, h * 0.13, cx + w * 0.15, h * 0.25)
        ..quadraticBezierTo(cx, h * 0.18, cx - w * 0.15, h * 0.25)
        ..close();
      canvas.drawPath(hairBase, hairPaint);
    } else {
      // Classic Taper / Modern Crop
      final hairCrop = Path()
        ..moveTo(cx - w * 0.15, h * 0.26)
        ..quadraticBezierTo(cx - w * 0.14, h * 0.12, cx, h * 0.12)
        ..quadraticBezierTo(cx + w * 0.14, h * 0.12, cx + w * 0.15, h * 0.26)
        ..quadraticBezierTo(cx + w * 0.08, h * 0.19, cx, h * 0.18)
        ..quadraticBezierTo(cx - w * 0.08, h * 0.19, cx - w * 0.15, h * 0.26)
        ..close();
      canvas.drawPath(hairCrop, hairPaint);
    }
  }

  @override
  bool shouldRepaint(covariant _IllustratedAvatarPainter oldDelegate) {
    return oldDelegate.skinColor != skinColor ||
        oldDelegate.hairColor != hairColor ||
        oldDelegate.hairStyle != hairStyle ||
        oldDelegate.topColor != topColor ||
        oldDelegate.bottomColor != bottomColor;
  }
}
