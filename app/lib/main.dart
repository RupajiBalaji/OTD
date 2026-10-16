import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'core/router/main_shell.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const ProviderScope(
      child: FashionCompanionApp(),
    ),
  );
}

class FashionCompanionApp extends StatelessWidget {
  const FashionCompanionApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AI Fashion Companion (OTD)',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.luxuryDarkTheme,
      home: const MainShell(),
    );
  }
}
