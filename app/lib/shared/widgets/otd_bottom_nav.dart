import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import '../../core/theme/otd_tokens.dart';

class OtdBottomNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTabSelected;
  final VoidCallback onCreatePressed;

  const OtdBottomNav({
    super.key,
    required this.currentIndex,
    required this.onTabSelected,
    required this.onCreatePressed,
  });

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);

    return Container(
      decoration: BoxDecoration(
        color: colors.card,
        border: Border(
          top: BorderSide(
            color: colors.border,
            width: 1.0,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: colors.isDark
                ? Colors.black.withValues(alpha: 0.4)
                : const Color(0xFF1C1612).withValues(alpha: 0.04),
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 64,
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              // 4 Navigation tabs row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _NavTabItem(
                    icon: Iconsax.home,
                    label: 'Home',
                    isSelected: currentIndex == 0,
                    onTap: () => onTabSelected(0),
                  ),
                  _NavTabItem(
                    icon: Iconsax.bag_2,
                    label: 'Closet',
                    isSelected: currentIndex == 1,
                    onTap: () => onTabSelected(1),
                  ),
                  // Spacer for center raised button
                  const SizedBox(width: 58),
                  _NavTabItem(
                    icon: Iconsax.magic_star,
                    label: 'Stylist',
                    isSelected: currentIndex == 2,
                    onTap: () => onTabSelected(2),
                  ),
                  _NavTabItem(
                    icon: Iconsax.user,
                    label: 'Profile',
                    isSelected: currentIndex == 3,
                    onTap: () => onTabSelected(3),
                  ),
                ],
              ),

              // Raised Center Gold "+" Button
              Positioned(
                top: -18,
                left: 0,
                right: 0,
                child: Center(
                  child: GestureDetector(
                    onTap: onCreatePressed,
                    child: Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: OtdTokens.gold,
                        border: Border.all(
                          color: colors.card,
                          width: 3.5,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: OtdTokens.gold.withValues(alpha: 0.45),
                            blurRadius: 14,
                            spreadRadius: 1,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Icon(
                          Iconsax.add,
                          size: 26,
                          color: OtdTokens.espresso,
                        ),
                      ),
                    ),
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

class _NavTabItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _NavTabItem({
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);
    final color = isSelected ? colors.accent : colors.textMuted;

    return Expanded(
      child: InkWell(
        onTap: onTap,
        splashColor: Colors.transparent,
        highlightColor: Colors.transparent,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 22,
              color: color,
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: OtdTokens.label(
                color: color,
                weight: isSelected ? FontWeight.w600 : FontWeight.w500,
                letterSpacing: 0.2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
