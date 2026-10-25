# Flutter ProGuard/R8 Rules
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.**  { *; }
-keep class io.flutter.util.**  { *; }
-keep class io.flutter.view.**  { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.**  { *; }

# Keep application code & models
-keep class com.otd.app.** { *; }

# Keep SharedPreferences & PathProvider reflection
-keep class androidx.core.content.FileProvider { *; }

# Don't warn on missing optional libraries
-dontwarn io.flutter.**
-dontwarn javax.annotation.**
-dontwarn com.google.errorprone.annotations.**
