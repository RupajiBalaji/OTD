import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'core/theme/theme_provider.dart';
import 'core/router/main_shell.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
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

    return MaterialApp(
      title: 'OTD - Outfit Of The Day',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.luxuryLightTheme,
      darkTheme: AppTheme.luxuryDarkTheme,
      themeMode: themeMode,
      home: const MainShell(),
    );
  }
}
