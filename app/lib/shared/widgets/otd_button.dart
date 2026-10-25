import 'package:flutter/material.dart';
import '../../core/theme/otd_tokens.dart';

enum OtdButtonVariant {
  primary,
  gold,
  outline,
  ghost,
}

class OtdButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final OtdButtonVariant variant;
  final Widget? icon;
  final Widget? suffixIcon;
  final bool isLoading;
  final double? width;
  final double height;
  final double borderRadius;
  final bool isFullWidth;
  final EdgeInsetsGeometry? padding;

  const OtdButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.variant = OtdButtonVariant.primary,
    this.icon,
    this.suffixIcon,
    this.isLoading = false,
    this.width,
    this.height = OtdTokens.buttonHeight,
    this.borderRadius = OtdTokens.radiusButton,
    this.isFullWidth = true,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);
    final isDark = colors.isDark;

    Color bg;
    Color fg;
    BorderSide border = BorderSide.none;

    switch (variant) {
      case OtdButtonVariant.primary:
        bg = isDark ? OtdTokens.gold : OtdTokens.espresso;
        fg = isDark ? OtdTokens.espresso : OtdTokens.white;
        break;
      case OtdButtonVariant.gold:
        bg = OtdTokens.gold;
        fg = OtdTokens.espresso;
        break;
      case OtdButtonVariant.outline:
        bg = Colors.transparent;
        fg = colors.textPrimary;
        border = BorderSide(
          color: colors.border,
          width: 1.5,
        );
        break;
      case OtdButtonVariant.ghost:
        bg = Colors.transparent;
        fg = colors.accentDeep;
        break;
    }

    final effectiveWidth = isFullWidth ? (width ?? double.infinity) : width;

    final childWidget = isLoading
        ? SizedBox(
            height: 20,
            width: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(fg),
            ),
          )
        : Row(
            mainAxisSize: isFullWidth ? MainAxisSize.max : MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null) ...[
                icon!,
                const SizedBox(width: 8),
              ],
              Text(
                text,
                style: OtdTokens.buttonText(color: fg),
                textAlign: TextAlign.center,
              ),
              if (suffixIcon != null) ...[
                const SizedBox(width: 8),
                suffixIcon!,
              ],
            ],
          );

    return SizedBox(
      width: effectiveWidth,
      height: height,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: bg,
          foregroundColor: fg,
          disabledBackgroundColor: bg.withValues(alpha: 0.5),
          disabledForegroundColor: fg.withValues(alpha: 0.5),
          elevation: 0,
          padding: padding ?? const EdgeInsets.symmetric(horizontal: 20),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(borderRadius),
            side: border,
          ),
          shadowColor: Colors.transparent,
        ),
        child: childWidget,
      ),
    );
  }
}
