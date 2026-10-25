# OTD (Outfit Of The Day) - Mobile Application

A luxury AI fashion companion mobile application built with Flutter, Riverpod, and GoRouter. Styled according to an editorial warm ivory and noir obsidian luxury aesthetic (`#F7EFE0` ivory canvas, `#09090C` dark obsidian canvas, `#D4AF37` gold accents, and `#1C1612` near-black espresso controls).

---

## Getting Started

### Prerequisites
- Flutter SDK `>=3.0.0 <4.0.0`
- Dart SDK `>=3.0.0 <4.0.0`
- Java Development Kit (JDK 17)
- Android SDK Platform 34+

### Installation & Run
```bash
cd app
flutter pub get
flutter run
```

---

## Building Signed Production Releases

### 1. Generate Your Private Upload Keystore
Generate your release signing key using the standard Java `keytool`:
```bash
keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```
Keep `upload-keystore.jks` secure and never commit it to source control.

### 2. Configure `key.properties`
Copy `android/key.properties.example` to `android/key.properties`:
```properties
storePassword=your_keystore_password_here
keyPassword=your_key_password_here
keyAlias=upload
storeFile=../upload-keystore.jks
```
*(Both `key.properties` and `*.jks`/`*.keystore` are strictly excluded in `.gitignore`)*.

### 3. Build Release Artifacts
```bash
# Build split-per-ABI release APKs (optimized for smaller download size)
flutter build apk --release --split-per-abi

# Build universal release APK (runs on all architectures)
flutter build apk --release

# Build Android App Bundle (for Google Play Store upload)
flutter build appbundle --release
```

If `android/key.properties` is absent, the Gradle build outputs a warning and falls back to debug signing for testing purposes.

---

## Architecture & Codebase Layout

The project follows clean architecture principles with feature-driven modularization and dependency inversion:

```
lib/
├── core/
│   ├── constants/             # Global dimensions, timing, and system assets
│   ├── router/                # GoRouter configuration & StatefulShellRoute
│   │   ├── app_router.dart    # Complete app route table & auth redirect guards
│   │   └── main_shell.dart    # Persistent 5-branch navigation shell
│   └── theme/
│       ├── app_theme.dart     # Material 3 Luxury Light & Dark themes
│       ├── otd_tokens.dart    # Central design tokens, typography, and color palette
│       └── theme_provider.dart# Riverpod state toggle for Ivory/Noir theme
├── features/
│   ├── analytics/             # Closet Intelligence, valuation & wear analytics
│   ├── auth/                  # Splash, Intro, Auth, Avatars & Profile DNA
│   ├── destinations/          # Venue & location matrix
│   ├── outfits/               # Daily OTD, Plan Your Look, Stylist Chat, Calendar
│   ├── social/                # Editorial Community Feed
│   ├── try_on/                # 2D Virtual Try-On Studio & TryOnRenderer
│   ├── wardrobe/              # Digital closet, camera/gallery add, AI detection
│   └── weather/               # Contextual weather & climate conditions
└── shared/
    ├── models/                # Core domain models (Garments, Looks, Profile)
    └── widgets/               # Reusable luxury UI (OtdButton, LuxuryImage, etc.)
```

---

## State Management & Mock Repositories

State is managed via **Flutter Riverpod**. All business logic and data providers interact strictly with abstract repository interfaces, allowing instant swapping from mock implementations to production HTTP/Dio backend clients.

### Repository Inventory & Provider Wiring

| Domain | Interface | Current Implementation | Provider to Swap for Production Backend |
|---|---|---|---|
| **Authentication** | `AuthRepository` | `MockAuthRepository` | `authRepositoryProvider` in `lib/features/auth/auth_repository.dart` |
| **Digital Wardrobe** | `WardrobeRepository` | `MockWardrobeRepository` | `wardrobeRepositoryProvider` in `lib/features/wardrobe/wardrobe_repository.dart` |
| **Outfit Curation** | `CuratedOutfitNotifier` | Rule-based engine | `curatedOutfitProvider` in `lib/features/outfits/outfits_repository.dart` |
| **Weather & Climate** | `WeatherRepository` | `MockWeatherRepository` | `weatherRepositoryProvider` in `lib/features/weather/weather_repository.dart` |
| **Venues & Locations**| `VenueRepository` | `MockVenueRepository` | `venueRepositoryProvider` in `lib/features/destinations/venue_repository.dart` |
| **AI Stylist Chat** | `StylistRepository` | `MockStylistRepository` | `stylistRepositoryProvider` in `lib/features/outfits/stylist_repository.dart` |
| **Virtual Try-On** | `TryOnRenderer` | `MockTryOnRenderer` | `tryOnRendererProvider` in `lib/features/try_on/try_on_renderer.dart` |
| **Garment Detection** | `GarmentDetectionService` | `MockGarmentDetectionService` | `garmentDetectionServiceProvider` in `lib/features/wardrobe/garment_detection_service.dart` |
| **Closet Analytics** | `AnalyticsRepository` | `MockAnalyticsRepository` | `analyticsRepositoryProvider` in `lib/features/analytics/analytics_repository.dart` |

---

## Offline Font Assets & Privacy
- **Offline Typography**: Variable font assets for **Cormorant Garamond** and **Inter** are bundled directly in `assets/fonts/` (licensed under SIL Open Font License 1.1). Runtime fetching is disabled in `main.dart` to guarantee consistent offline typography.
- **Privacy Architecture**: All wardrobe photos, biometric style DNA configurations, and wear history are stored strictly on-device using local app storage (`getApplicationDocumentsDirectory` and `SharedPreferences`). No user media or telemetry is transmitted to third-party ad networks or tracking servers.
