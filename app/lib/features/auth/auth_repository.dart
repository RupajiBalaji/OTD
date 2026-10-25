import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'auth_models.dart';

abstract class AuthRepository {
  bool validateName(String name) => name.trim().length >= 2;
  bool validateEmail(String email) => RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$').hasMatch(email.trim());
  bool validatePassword(String password) => password.length >= 8;

  Future<AuthResponse> login({
    required String email,
    required String password,
  });

  Future<AuthResponse> register({
    required String name,
    required String email,
    required String password,
  });

  Future<void> logout();

  Future<AuthUser?> currentUser();
}

class MockAuthRepository extends AuthRepository {
  AuthUser? _cachedUser;

  @override
  Future<AuthResponse> login({
    required String email,
    required String password,
  }) async {
    // Simulate backend network latency
    await Future.delayed(const Duration(milliseconds: 700));

    final user = AuthUser(
      id: 'usr_mock_001',
      name: email.split('@').first.capitalize(),
      email: email,
      role: 'user',
    );
    const tokens = AuthTokens(
      accessToken: 'jwt_mock_access_token_12345',
      refreshToken: 'jwt_mock_refresh_token_67890',
    );

    _cachedUser = user;
    return AuthResponse(user: user, tokens: tokens);
  }

  @override
  Future<AuthResponse> register({
    required String name,
    required String email,
    required String password,
  }) async {
    await Future.delayed(const Duration(milliseconds: 800));

    final user = AuthUser(
      id: 'usr_${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      email: email,
      role: 'user',
    );
    const tokens = AuthTokens(
      accessToken: 'jwt_mock_access_token_register_12345',
      refreshToken: 'jwt_mock_refresh_token_register_67890',
    );

    _cachedUser = user;
    return AuthResponse(user: user, tokens: tokens);
  }

  @override
  Future<void> logout() async {
    await Future.delayed(const Duration(milliseconds: 200));
    _cachedUser = null;
  }

  @override
  Future<AuthUser?> currentUser() async {
    return _cachedUser;
  }
}

extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1)}';
  }
}

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return MockAuthRepository();
});
