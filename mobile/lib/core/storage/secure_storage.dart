import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Token saqlash (spec 3 — flutter_secure_storage).
class SecureStorage {
  SecureStorage([FlutterSecureStorage? storage])
      : _s = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _s;

  static const _kAccess = 'access_token';
  static const _kRefresh = 'refresh_token';

  Future<void> saveTokens(String access, String refresh) async {
    await _s.write(key: _kAccess, value: access);
    await _s.write(key: _kRefresh, value: refresh);
  }

  Future<String?> get accessToken => _s.read(key: _kAccess);
  Future<String?> get refreshToken => _s.read(key: _kRefresh);

  Future<void> clear() async {
    await _s.delete(key: _kAccess);
    await _s.delete(key: _kRefresh);
  }
}
