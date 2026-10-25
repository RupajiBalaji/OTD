import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'auth_models.dart';
import 'auth_repository.dart';
import '../outfits/outfits_repository.dart';

enum AuthStatus {
  unauthenticated,
  onboardingIncomplete,
  authenticated,
}

class AuthSessionState {
  final AuthStatus status;
  final AuthUser? user;
  final AuthTokens? tokens;
  final bool isLoading;
  final String? errorMessage;
  final bool isInitialized;

  const AuthSessionState({
    this.status = AuthStatus.unauthenticated,
    this.user,
    this.tokens,
    this.isLoading = false,
    this.errorMessage,
    this.isInitialized = false,
  });

  AuthSessionState copyWith({
    AuthStatus? status,
    AuthUser? user,
    AuthTokens? tokens,
    bool? isLoading,
    String? errorMessage,
    bool? isInitialized,
    bool clearError = false,
  }) {
    return AuthSessionState(
      status: status ?? this.status,
      user: user ?? this.user,
      tokens: tokens ?? this.tokens,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      isInitialized: isInitialized ?? this.isInitialized,
    );
  }
}

class AuthNotifier extends ChangeNotifier {
  final Ref _ref;
  final AuthRepository _repository;
  AuthSessionState _state = const AuthSessionState();

  AuthSessionState get state => _state;

  static const String _keyUser = 'otd_auth_user';
  static const String _keyTokens = 'otd_auth_tokens';
  static const String _keyOnboardingDone = 'otd_onboarding_done';

  AuthNotifier(this._ref, this._repository) {
    _initSession();
  }

  void _setState(AuthSessionState newState) {
    _state = newState;
    notifyListeners();
  }

  Future<void> _initSession() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userJson = prefs.getString(_keyUser);
      final tokensJson = prefs.getString(_keyTokens);
      final onboardingDone = prefs.getBool(_keyOnboardingDone) ?? false;

      if (tokensJson != null && userJson != null) {
        final user = AuthUser.fromJson(jsonDecode(userJson) as Map<String, dynamic>);
        final tokens = AuthTokens.fromJson(jsonDecode(tokensJson) as Map<String, dynamic>);

        // Sync name into user profile provider
        final currentProfile = _ref.read(userProfileProvider);
        _ref.read(userProfileProvider.notifier).updateProfile(
              currentProfile.copyWith(name: user.name),
            );

        _setState(
          AuthSessionState(
            status: onboardingDone ? AuthStatus.authenticated : AuthStatus.onboardingIncomplete,
            user: user,
            tokens: tokens,
            isInitialized: true,
          ),
        );
      } else {
        _setState(
          const AuthSessionState(
            status: AuthStatus.unauthenticated,
            isInitialized: true,
          ),
        );
      }
    } catch (e) {
      _setState(
        const AuthSessionState(
          status: AuthStatus.unauthenticated,
          isInitialized: true,
        ),
      );
    }
  }

  Future<bool> login({
    required String email,
    required String password,
  }) async {
    _setState(_state.copyWith(isLoading: true, clearError: true));
    try {
      final res = await _repository.login(email: email, password: password);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_keyUser, jsonEncode(res.user.toJson()));
      await prefs.setString(_keyTokens, jsonEncode(res.tokens.toJson()));
      final onboardingDone = prefs.getBool(_keyOnboardingDone) ?? false;

      // Update user profile provider
      final currentProfile = _ref.read(userProfileProvider);
      _ref.read(userProfileProvider.notifier).updateProfile(
            currentProfile.copyWith(name: res.user.name),
          );

      _setState(
        _state.copyWith(
          status: onboardingDone ? AuthStatus.authenticated : AuthStatus.onboardingIncomplete,
          user: res.user,
          tokens: res.tokens,
          isLoading: false,
          clearError: true,
        ),
      );
      return true;
    } catch (e) {
      _setState(
        _state.copyWith(
          isLoading: false,
          errorMessage: 'Invalid credentials. Please verify your email and password.',
        ),
      );
      return false;
    }
  }

  Future<bool> register({
    required String name,
    required String email,
    required String password,
  }) async {
    _setState(_state.copyWith(isLoading: true, clearError: true));
    try {
      final res = await _repository.register(name: name, email: email, password: password);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_keyUser, jsonEncode(res.user.toJson()));
      await prefs.setString(_keyTokens, jsonEncode(res.tokens.toJson()));
      await prefs.setBool(_keyOnboardingDone, false);

      // Initialize profile with real name
      final currentProfile = _ref.read(userProfileProvider);
      _ref.read(userProfileProvider.notifier).updateProfile(
            currentProfile.copyWith(name: name),
          );

      _setState(
        _state.copyWith(
          status: AuthStatus.onboardingIncomplete,
          user: res.user,
          tokens: res.tokens,
          isLoading: false,
          clearError: true,
        ),
      );
      return true;
    } catch (e) {
      _setState(
        _state.copyWith(
          isLoading: false,
          errorMessage: 'Account creation failed. Please try again.',
        ),
      );
      return false;
    }
  }

  Future<void> completeOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyOnboardingDone, true);

    _setState(
      _state.copyWith(
        status: AuthStatus.authenticated,
      ),
    );
  }

  Future<void> logout() async {
    await _repository.logout();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyUser);
    await prefs.remove(_keyTokens);

    _setState(
      const AuthSessionState(
        status: AuthStatus.unauthenticated,
        isInitialized: true,
      ),
    );
  }

  void clearError() {
    if (_state.errorMessage != null) {
      _setState(_state.copyWith(clearError: true));
    }
  }
}

final authNotifierProvider = ChangeNotifierProvider<AuthNotifier>((ref) {
  final repo = ref.watch(authRepositoryProvider);
  return AuthNotifier(ref, repo);
});
