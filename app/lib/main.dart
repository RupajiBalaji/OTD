import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/theme/app_theme.dart';
import 'core/theme/theme_provider.dart';
import 'core/router/app_router.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  GoogleFonts.config.allowRuntimeFetching = false;
  runApp(
    const ProviderScope(
      child: FashionCompanionApp(),
    ),
  );
}

class FashionCompanionApp extends ConsumerWidget {
  const FashionCompanionApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'OTD - Outfit Of The Day',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.luxuryLightTheme,
      darkTheme: AppTheme.luxuryDarkTheme,
      themeMode: themeMode,
      routerConfig: router,
    );
  }
}
