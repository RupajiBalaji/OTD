import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/otd_tokens.dart';
import '../../shared/widgets/otd_bottom_nav.dart';

class MainShell extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const MainShell({
    super.key,
    required this.navigationShell,
  });

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);

    return Scaffold(
      backgroundColor: colors.canvas,
      body: navigationShell,
      bottomNavigationBar: OtdBottomNav(
        currentIndex: navigationShell.currentIndex,
        onTabSelected: (index) {
          navigationShell.goBranch(
            index,
            initialLocation: index == navigationShell.currentIndex,
          );
        },
        onCreatePressed: () {
          context.push('/plan');
        },
      ),
    );
  }
}
