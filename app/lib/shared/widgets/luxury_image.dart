import 'dart:io';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../core/theme/otd_tokens.dart';

class LuxuryImage extends StatelessWidget {
  final String imageUrl;
  final double? width;
  final double? height;
  final BoxFit fit;
  final double borderRadius;
  final String? fallbackIcon;

  const LuxuryImage({
    super.key,
    required this.imageUrl,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius = 0,
    this.fallbackIcon,
  });

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);

    Widget image;

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      image = CachedNetworkImage(
        imageUrl: imageUrl,
        width: width,
        height: height,
        fit: fit,
        placeholder: (context, url) => Container(
          width: width,
          height: height,
          decoration: BoxDecoration(
            color: colors.cardElevated,
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                colors.card,
                colors.cardElevated,
                colors.card,
              ],
            ),
          ),
          child: Center(
            child: SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(colors.accent),
              ),
            ),
          ),
        ),
        errorWidget: (context, url, error) => _buildFallback(colors),
      );
    } else if (imageUrl.startsWith('assets/')) {
      image = Image.asset(
        imageUrl,
        width: width,
        height: height,
        fit: fit,
        errorBuilder: (context, error, stackTrace) => _buildFallback(colors),
      );
    } else {
      // Local file on device
      final file = File(imageUrl);
      if (file.existsSync()) {
        image = Image.file(
          file,
          width: width,
          height: height,
          fit: fit,
          errorBuilder: (context, error, stackTrace) => _buildFallback(colors),
        );
      } else {
        image = _buildFallback(colors);
      }
    }

    if (borderRadius > 0) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: image,
      );
    }

    return image;
  }

  Widget _buildFallback(OtdColors colors) {
    return Container(
      width: width,
      height: height,
      color: colors.cardElevated,
      child: Center(
        child: fallbackIcon != null && fallbackIcon!.isNotEmpty
            ? Text(fallbackIcon!, style: const TextStyle(fontSize: 26))
            : Icon(
                Icons.checkroom,
                color: colors.textMuted,
                size: 24,
              ),
      ),
    );
  }
}
