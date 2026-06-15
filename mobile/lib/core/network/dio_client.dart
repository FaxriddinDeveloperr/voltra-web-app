import 'package:dio/dio.dart';
import '../storage/secure_storage.dart';
import 'api_endpoints.dart';

/// Spec 3/4.2 — Dio client + auth interceptor (token qo'shish, 401 da refresh).
class DioClient {
  DioClient(this._storage) {
    dio = Dio(
      BaseOptions(
        baseUrl: ApiEndpoints.baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 20),
        contentType: 'application/json',
      ),
    );
    dio.interceptors.add(_authInterceptor());
  }

  final SecureStorage _storage;
  late final Dio dio;
  bool _refreshing = false;

  InterceptorsWrapper _authInterceptor() {
    return InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.accessToken;
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (err, handler) async {
        final isAuthCall = err.requestOptions.path.contains('/auth/');
        if (err.response?.statusCode == 401 && !isAuthCall && !_refreshing) {
          final refreshed = await _tryRefresh();
          if (refreshed) {
            try {
              final clone = await _retry(err.requestOptions);
              return handler.resolve(clone);
            } catch (_) {
              // davom etadi
            }
          }
        }
        handler.next(err);
      },
    );
  }

  Future<bool> _tryRefresh() async {
    final refreshToken = await _storage.refreshToken;
    if (refreshToken == null || refreshToken.isEmpty) return false;
    _refreshing = true;
    try {
      final res = await Dio(BaseOptions(baseUrl: ApiEndpoints.baseUrl)).post(
        ApiEndpoints.refresh,
        data: {'refreshToken': refreshToken},
      );
      final data = res.data as Map<String, dynamic>;
      await _storage.saveTokens(
        data['accessToken'] as String,
        data['refreshToken'] as String,
      );
      return true;
    } catch (_) {
      await _storage.clear();
      return false;
    } finally {
      _refreshing = false;
    }
  }

  Future<Response<dynamic>> _retry(RequestOptions options) async {
    final token = await _storage.accessToken;
    return dio.request(
      options.path,
      data: options.data,
      queryParameters: options.queryParameters,
      options: Options(
        method: options.method,
        headers: {...options.headers, 'Authorization': 'Bearer $token'},
      ),
    );
  }
}
