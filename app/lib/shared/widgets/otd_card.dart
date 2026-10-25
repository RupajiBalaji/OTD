import 'package:flutter/material.dart';
import '../../core/theme/otd_tokens.dart';

class OtdCard extends StatelessWidget {
  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry padding;
  final double borderRadius;
  final Color? color;
  final Color? borderColor;
  final double borderWidth;
  final List<BoxShadow>? customShadow;
  final double? width;
  final double? height;

  const OtdCard({
    super.key,
    required this.child,
    this.onTap,
    this.padding = const EdgeInsets.all(20),
    this.borderRadius = OtdTokens.radiusCard,
    this.color,
    this.borderColor,
    this.borderWidth = 1.0,
    this.customShadow,
    this.width,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);

    final bg = color ?? colors.card;
    final border = borderColor ?? colors.border;
    final shadow = customShadow ?? OtdTokens.softShadow(isDark: colors.isDark);

    final container = Container(
      width: width,
      height: height,
      padding: padding,
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(
          color: border,
          width: borderWidth,
        ),
        boxShadow: shadow,
      ),
      child: child,
    );

    if (onTap == null) {
      return container;
    }

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(borderRadius),
        child: container,
      ),
    );
  }
}
