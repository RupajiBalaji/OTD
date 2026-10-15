import 'package:dio/dio.dart';
import 'endpoints.dart';

class ApiClient {
  late final Dio _dio;
  String? _accessToken;

  ApiClient({String? baseUrl}) {
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl ?? Endpoints.baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          if (_accessToken != null) {
            options.headers['Authorization'] = 'Bearer $_accessToken';
          }
          return handler.next(options);
        },
        onError: (DioException error, handler) async {
          // Handle 401 Unauthorized for automatic token refreshing
          if (error.response?.statusCode == 401) {
            // Placeholder: call refresh token endpoint
          }
          return handler.next(error);
        },
      ),
    );
  }

  void setToken(String token) {
    _accessToken = token;
  }

  Dio get dio => _dio;
}
