import 'package:flutter/material.dart';
import '../../core/theme/otd_tokens.dart';

class SelectableTile extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Widget? icon;
  final String? imageUrl;
  final bool isSelected;
  final VoidCallback onTap;
  final double? height;
  final EdgeInsetsGeometry padding;

  const SelectableTile({
    super.key,
    required this.title,
    this.subtitle,
    this.icon,
    this.imageUrl,
    required this.isSelected,
    required this.onTap,
    this.height,
    this.padding = const EdgeInsets.all(16),
  });

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);

    final bg = isSelected ? colors.accentTint : colors.card;
    final borderColor = isSelected ? colors.accent : colors.border;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(OtdTokens.radiusCard),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeInOut,
          height: height,
          padding: padding,
          decoration: BoxDecoration(
            color: bg,
            borderRadius: BorderRadius.circular(OtdTokens.radiusCard),
            border: Border.all(
              color: borderColor,
              width: isSelected ? 1.5 : 1.0,
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: colors.accent.withValues(alpha: 0.18),
                      blurRadius: 12,
                      offset: const Offset(0, 3),
                    ),
                  ]
                : OtdTokens.softShadow(isDark: colors.isDark, blur: 8, offsetY: 2),
          ),
          child: Stack(
            children: [
              // Main content
              Align(
                alignment: Alignment.center,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    if (imageUrl != null) ...[
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(
                          imageUrl!,
                          height: 64,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Container(
                            height: 64,
                            color: colors.cardElevated,
                            child: Icon(Icons.image_outlined, color: colors.textMuted),
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                    ] else if (icon != null) ...[
                      icon!,
                      const SizedBox(height: 10),
                    ],
                    Text(
                      title,
                      style: OtdTokens.headingSmall(
                        color: isSelected ? (colors.isDark ? colors.accent : OtdTokens.goldDeep) : colors.textPrimary,
                        weight: FontWeight.w600,
                      ),
                      textAlign: TextAlign.center,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (subtitle != null) ...[
                      const SizedBox(height: 4),
                      Text(
                        subtitle!,
                        style: OtdTokens.bodySmall(color: colors.textMuted),
                        textAlign: TextAlign.center,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ],
                ),
              ),

              // Gold corner badge when selected
              if (isSelected)
                Positioned(
                  top: 0,
                  right: 0,
                  child: Container(
                    width: 22,
                    height: 22,
                    decoration: BoxDecoration(
                      color: colors.accent,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: colors.accent.withValues(alpha: 0.4),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.check,
                      size: 14,
                      color: OtdTokens.white,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
