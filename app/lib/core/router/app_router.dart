import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/auth_state_provider.dart';
import '../../features/auth/screens/splash_screen.dart';
import '../../features/auth/screens/intro_screen.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/signup_screen.dart';
import '../../features/auth/screens/onboarding_about_screen.dart';
import '../../features/auth/screens/onboarding_style_screen.dart';
import '../../features/auth/screens/onboarding_goals_screen.dart';
import '../../features/outfits/screens/daily_otd_screen.dart';
import '../../features/wardrobe/screens/wardrobe_screen.dart';
import '../../features/outfits/screens/interactive_stylist_screen.dart';
import '../../features/auth/screens/profile_screen.dart';
import '../../features/outfits/screens/plan_your_look_screen.dart';
import '../../features/outfits/screens/ai_loading_screen.dart';
import '../../features/outfits/screens/outfit_result_screen.dart';
import '../../features/outfits/screens/why_this_look_screen.dart';
import '../../features/outfits/screens/saved_looks_screen.dart';
import '../../features/wardrobe/garment_detection_service.dart';
import '../../features/wardrobe/screens/add_piece_screen.dart';
import '../../features/wardrobe/screens/item_detected_screen.dart';
import '../../features/auth/screens/avatar_screen.dart';
import '../../features/try_on/screens/try_on_screen.dart';
import '../../features/analytics/screens/closet_intelligence_screen.dart';
import '../../features/outfits/screens/gap_intelligence_screen.dart';
import '../../features/outfits/screens/outfit_calendar_screen.dart';
import '../../features/outfits/screens/outfit_ideas_screen.dart';
import '../../features/outfits/screens/destinations_screen.dart';
import '../../features/social/screens/community_feed_screen.dart';
import '../../features/outfits/screens/notifications_screen.dart';
import '../../features/auth/screens/settings_screen.dart';
import '../../features/auth/screens/privacy_screen.dart';
import '../../features/auth/screens/help_support_screen.dart';
import 'main_shell.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final authNotifier = ref.watch(authNotifierProvider);

  return GoRouter(
    initialLocation: '/splash',
    refreshListenable: authNotifier,
    redirect: (BuildContext context, GoRouterState state) {
      final authState = authNotifier.state;
      if (!authState.isInitialized) {
        return null;
      }

      final loc = state.matchedLocation;
      final isAuthRoute = loc == '/login' || loc == '/signup';
      final isIntroRoute = loc == '/intro' || loc == '/splash';
      final isOnboardingRoute = loc.startsWith('/onboarding');

      switch (authState.status) {
        case AuthStatus.unauthenticated:
          if (!isAuthRoute && !isIntroRoute) {
            return '/login';
          }
          return null;

        case AuthStatus.onboardingIncomplete:
          if (!isOnboardingRoute) {
            return '/onboarding/about';
          }
          return null;

        case AuthStatus.authenticated:
          if (isAuthRoute || isIntroRoute || isOnboardingRoute) {
            return '/home';
          }
          return null;
      }
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/intro',
        builder: (context, state) => const IntroScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/signup',
        builder: (context, state) => const SignupScreen(),
      ),
      GoRoute(
        path: '/onboarding/about',
        builder: (context, state) => const OnboardingAboutScreen(),
      ),
      GoRoute(
        path: '/onboarding/style',
        builder: (context, state) => const OnboardingStyleScreen(),
      ),
      GoRoute(
        path: '/onboarding/goals',
        builder: (context, state) => const OnboardingGoalsScreen(),
      ),

      // Plan Your Look Wizard Flow (Pushed on top of the shell)
      GoRoute(
        path: '/plan',
        builder: (context, state) => const PlanYourLookScreen(),
      ),
      GoRoute(
        path: '/plan/loading',
        builder: (context, state) => const AiLoadingScreen(),
      ),
      GoRoute(
        path: '/plan/result',
        builder: (context, state) => const OutfitResultScreen(),
      ),
      GoRoute(
        path: '/plan/why',
        builder: (context, state) => const WhyThisLookScreen(),
      ),

      // Closet Add & Detected Flow
      GoRoute(
        path: '/closet/add',
        builder: (context, state) => const AddPieceScreen(),
      ),
      GoRoute(
        path: '/closet/detected',
        builder: (context, state) {
          final detected = state.extra as DetectedGarment?;
          if (detected == null) {
            return const AddPieceScreen();
          }
          return ItemDetectedScreen(detected: detected);
        },
      ),

      // Saved Looks Route
      GoRoute(
        path: '/saved',
        builder: (context, state) => const SavedLooksScreen(),
      ),

      // Avatar & Virtual Try-On Routes
      GoRoute(
        path: '/avatar',
        builder: (context, state) => const AvatarScreen(),
      ),
      GoRoute(
        path: '/try-on',
        builder: (context, state) => const VirtualTryOnScreen(),
      ),

      // Auxiliary & Editorial Feature Routes
      GoRoute(
        path: '/closet-intelligence',
        builder: (context, state) => const ClosetIntelligenceScreen(),
      ),
      GoRoute(
        path: '/gap-intelligence',
        builder: (context, state) => const GapIntelligenceScreen(),
      ),
      GoRoute(
        path: '/calendar',
        builder: (context, state) => const OutfitCalendarScreen(),
      ),
      GoRoute(
        path: '/ideas',
        builder: (context, state) => const OutfitIdeasScreen(),
      ),
      GoRoute(
        path: '/destinations',
        builder: (context, state) => const DestinationsScreen(),
      ),
      GoRoute(
        path: '/community',
        builder: (context, state) => const CommunityFeedScreen(),
      ),
      GoRoute(
        path: '/notifications',
        builder: (context, state) => const NotificationsScreen(),
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: '/privacy',
        builder: (context, state) => const PrivacyScreen(),
      ),
      GoRoute(
        path: '/help',
        builder: (context, state) => const HelpSupportScreen(),
      ),

      // Stateful Main Shell with persistent branches
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return MainShell(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/home',
                builder: (context, state) => const DailyOtdScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/closet',
                builder: (context, state) => const WardrobeScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/stylist',
                builder: (context, state) => const InteractiveStylistStudioScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/profile',
                builder: (context, state) => const ProfileScreen(),
              ),
            ],
          ),
        ],
      ),
    ],
  );
});
