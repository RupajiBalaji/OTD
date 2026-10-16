import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../../features/outfits/screens/daily_otd_screen.dart';
import '../../features/wardrobe/screens/wardrobe_screen.dart';
import '../../features/try_on/screens/try_on_screen.dart';
import '../../features/social/screens/community_feed_screen.dart';
import '../../features/analytics/screens/closet_intelligence_screen.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    DailyOtdScreen(),
    WardrobeScreen(),
    VirtualTryOnScreen(),
    CommunityFeedScreen(),
    ClosetIntelligenceScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final surfaceColor = isDark ? AppTheme.surfaceNoir : AppTheme.surfaceIvory;
    final borderColor = isDark ? AppTheme.borderNoir : AppTheme.borderIvory;

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: surfaceColor,
          border: Border(
            top: BorderSide(color: borderColor, width: 1),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.05),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _NavBarItem(
                  icon: Icons.auto_awesome_outlined,
                  activeIcon: Icons.auto_awesome,
                  label: 'OTD',
                  isActive: _currentIndex == 0,
                  isDark: isDark,
                  onTap: () => setState(() => _currentIndex = 0),
                ),
                _NavBarItem(
                  icon: Icons.checkroom_outlined,
                  activeIcon: Icons.checkroom,
                  label: 'CLOSET',
                  isActive: _currentIndex == 1,
                  isDark: isDark,
                  onTap: () => setState(() => _currentIndex = 1),
                ),
                _NavBarItem(
                  icon: Icons.accessibility_new_outlined,
                  activeIcon: Icons.accessibility_new,
                  label: 'TRY-ON',
                  isActive: _currentIndex == 2,
                  isDark: isDark,
                  onTap: () => setState(() => _currentIndex = 2),
                ),
                _NavBarItem(
                  icon: Icons.explore_outlined,
                  activeIcon: Icons.explore,
                  label: 'FEED',
                  isActive: _currentIndex == 3,
                  isDark: isDark,
                  onTap: () => setState(() => _currentIndex = 3),
                ),
                _NavBarItem(
                  icon: Icons.insights_outlined,
                  activeIcon: Icons.insights,
                  label: 'ANALYTICS',
                  isActive: _currentIndex == 4,
                  isDark: isDark,
                  onTap: () => setState(() => _currentIndex = 4),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NavBarItem extends StatelessWidget {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool isActive;
  final bool isDark;
  final VoidCallback onTap;

  const _NavBarItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.isActive,
    required this.isDark,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final inactiveColor = isDark ? AppTheme.mutedSilver : AppTheme.textIvoryMuted;

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            isActive ? activeIcon : icon,
            size: 22,
            color: isActive ? AppTheme.gold : inactiveColor,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: GoogleFonts.outfit(
              fontSize: 10,
              fontWeight: isActive ? FontWeight.w800 : FontWeight.w500,
              letterSpacing: 1.0,
              color: isActive ? AppTheme.gold : inactiveColor,
            ),
          ),
        ],
      ),
    );
  }
}
