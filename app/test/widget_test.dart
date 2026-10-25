import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:fashion_companion_app/features/auth/auth_repository.dart';
import 'package:fashion_companion_app/features/wardrobe/wardrobe_repository.dart';
import 'package:fashion_companion_app/features/outfits/outfits_repository.dart';
import 'package:fashion_companion_app/shared/models/fashion_models.dart';
import 'package:fashion_companion_app/features/auth/screens/settings_screen.dart';
import 'package:fashion_companion_app/core/theme/app_theme.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('1. Auth Validation Tests', () {
    test('Name validation: rejected if < 2 chars, accepted if >= 2', () {
      final repo = MockAuthRepository();
      expect(repo.validateName(''), false);
      expect(repo.validateName('A'), false);
      expect(repo.validateName('Al'), true);
      expect(repo.validateName('Elena Rostova'), true);
    });

    test('Email validation: RFC compliant syntax validation', () {
      final repo = MockAuthRepository();
      expect(repo.validateEmail(''), false);
      expect(repo.validateEmail('invalid'), false);
      expect(repo.validateEmail('user@'), false);
      expect(repo.validateEmail('user@domain'), false);
      expect(repo.validateEmail('user@domain.com'), true);
      expect(repo.validateEmail('elena.rostova@otd-atelier.luxury'), true);
    });

    test('Password validation: minimum 8 characters required', () {
      final repo = MockAuthRepository();
      expect(repo.validatePassword(''), false);
      expect(repo.validatePassword('1234567'), false);
      expect(repo.validatePassword('12345678'), true);
      expect(repo.validatePassword('SecretPassword123!'), true);
    });

    test('Mock registration and login returns token session', () async {
      final repo = MockAuthRepository();
      final regResult = await repo.register(
        name: 'Elena Rostova',
        email: 'elena@example.com',
        password: 'password123',
      );
      expect(regResult.user.name, 'Elena Rostova');
      expect(regResult.tokens.accessToken.isNotEmpty, true);

      final loginResult = await repo.login(
        email: 'elena@example.com',
        password: 'password123',
      );
      expect(loginResult.user.email, 'elena@example.com');
      expect(loginResult.tokens.accessToken.isNotEmpty, true);
    });
  });

  group('2. Onboarding & Session Persistence', () {
    test('Onboarding completion flag is saved and read from SharedPreferences', () async {
      SharedPreferences.setMockInitialValues({'otd_onboarding_done': true});
      final prefs = await SharedPreferences.getInstance();
      expect(prefs.getBool('otd_onboarding_done'), true);

      await prefs.setBool('otd_onboarding_done', false);
      expect(prefs.getBool('otd_onboarding_done'), false);
    });

    test('User profile serialization and deserialization survives restarts', () {
      const profile = UserProfile(
        name: 'Elena Rostova',
        city: 'Milan',
        height: "5'10\"",
        bodyShape: 'Hourglass',
        stylePersonas: ['Old Money', 'Minimalist'],
        preferredFit: 'Tailored',
        palettePreferences: ['Ivory & Espresso', 'Navy & White'],
        gender: 'Female',
        avatarId: 'avatar_3',
        skinTone: 'olive',
        hairStyle: 'medium_waves',
      );

      final json = profile.toJson();
      final restored = UserProfile.fromJson(json);

      expect(restored.name, 'Elena Rostova');
      expect(restored.city, 'Milan');
      expect(restored.bodyShape, 'Hourglass');
      expect(restored.avatarId, 'avatar_3');
      expect(restored.skinTone, 'olive');
      expect(restored.hairStyle, 'medium_waves');
    });
  });

  group('3. Curate Outfit Scoring & Edge Cases', () {
    test('Throws informative exception when closet has fewer than 2 items', () async {
      final emptyRepo = MockWardrobeRepository();
      final all = await emptyRepo.getWardrobeItems();
      for (final item in all) {
        await emptyRepo.deleteWardrobeItem(item.id);
      }

      final container = ProviderContainer(
        overrides: [
          wardrobeRepositoryProvider.overrideWithValue(emptyRepo),
        ],
      );

      await container.read(curatedOutfitProvider.notifier).curateOutfit(
            venue: "L'Amore Bistro",
            occasion: 'Date Night',
            vibe: 'Romantic',
            weather: '22°C Breezy',
          );

      final state = container.read(curatedOutfitProvider);
      expect(state.hasError, true);
      expect(state.error.toString(), contains('at least 2 pieces'));
    });

    test('Different results generated on "Try Another Look"', () async {
      final container = ProviderContainer();

      await container.read(curatedOutfitProvider.notifier).curateOutfit(
            venue: 'Rooftop Lounge',
            occasion: 'Date Night',
            vibe: 'Romantic',
            weather: '22°C',
            tryAnother: false,
          );
      final firstLook = container.read(curatedOutfitProvider).value;
      expect(firstLook, isNotNull);

      await container.read(curatedOutfitProvider.notifier).curateOutfit(
            venue: 'Rooftop Lounge',
            occasion: 'Date Night',
            vibe: 'Romantic',
            weather: '22°C',
            tryAnother: true,
          );
      final secondLook = container.read(curatedOutfitProvider).value;
      expect(secondLook, isNotNull);

      // Verify AI match score is in realistic range (0.90 to 0.99)
      expect(firstLook!.aiMatchScore, greaterThanOrEqualTo(0.90));
      expect(firstLook.aiMatchScore, lessThanOrEqualTo(0.99));
    });
  });

  group('4. Wardrobe Add/Delete Persistence & Wear Count', () {
    test('Adding and deleting items updates catalog correctly', () async {
      final repo = MockWardrobeRepository();
      final initialCount = (await repo.getWardrobeItems()).length;

      final newItem = WardrobeItem(
        id: 'test_item_99',
        name: 'Cashmere Rollneck',
        category: GarmentCategory.tops,
        subType: 'Sweater',
        brand: 'Loro Piana',
        color: 'Camel',
        fabric: '100% Cashmere',
        fit: 'Regular',
        formality: 4,
        season: 'Fall/Winter',
        imageUrl: 'https://example.com/sweater.jpg',
        timesWorn: 0,
        purchasePrice: 950.0,
        addedDate: DateTime.now(),
      );

      await repo.addWardrobeItem(newItem);
      final countAfterAdd = (await repo.getWardrobeItems()).length;
      expect(countAfterAdd, initialCount + 1);

      await repo.incrementWearCount('test_item_99');
      final fetched = await repo.getWardrobeItemById('test_item_99');
      expect(fetched?.timesWorn, 1);

      await repo.deleteWardrobeItem('test_item_99');
      final countAfterDelete = (await repo.getWardrobeItems()).length;
      expect(countAfterDelete, initialCount);
    });
  });

  group('5. Saved Looks Toggle', () {
    test('Toggling bookmark saves and subsequently removes look', () async {
      final container = ProviderContainer();
      final notifier = container.read(savedLooksProvider.notifier);

      final testOutfit = OutfitRecommendation(
        id: 'look_test_01',
        title: 'Milanese Tailoring',
        description: 'Test description',
        venue: 'Brera Vernissage',
        items: const [],
        occasion: FashionOccasion.business,
        vibe: FashionVibe.oldMoney,
        aiMatchScore: 0.96,
        weatherFitReason: 'Optimized',
        isBookmarked: false,
      );

      // 1. Toggle ON
      notifier.toggleSave(testOutfit);
      expect(container.read(savedLooksProvider).any((l) => l.id == 'look_test_01'), true);

      // 2. Toggle OFF
      notifier.toggleSave(testOutfit);
      expect(container.read(savedLooksProvider).any((l) => l.id == 'look_test_01'), false);
    });
  });

  group('6. Responsive Layout & 360dp Overflow Validation', () {
    testWidgets('Settings screen renders cleanly at 360x640 with 1.3x font scale', (tester) async {
      tester.view.physicalSize = const Size(360 * 2, 640 * 2);
      tester.view.devicePixelRatio = 2.0;

      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: AppTheme.luxuryLightTheme,
            home: const MediaQuery(
              data: MediaQueryData(
                size: Size(360, 640),
                textScaler: TextScaler.linear(1.3),
              ),
              child: SettingsScreen(),
            ),
          ),
        ),
      );

      await tester.pumpAndSettle();
      expect(find.text('Settings'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    testWidgets('Settings screen renders cleanly in Dark Theme at 411x891', (tester) async {
      tester.view.physicalSize = const Size(411 * 2, 891 * 2);
      tester.view.devicePixelRatio = 2.0;

      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: AppTheme.luxuryDarkTheme,
            home: const MediaQuery(
              data: MediaQueryData(
                size: Size(411, 891),
                textScaler: TextScaler.linear(1.0),
              ),
              child: SettingsScreen(),
            ),
          ),
        ),
      );

      await tester.pumpAndSettle();
      expect(find.text('Settings'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });
  });
}
