import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../network/api_service.dart';
import '../network/dio_client.dart';
import '../storage/prefs.dart';
import '../storage/secure_storage.dart';

/// main()'da haqiqiy instance bilan override qilinadi.
final sharedPrefsProvider = Provider<SharedPreferences>(
  (ref) => throw UnimplementedError('sharedPrefsProvider override qilinmagan'),
);

final prefsProvider = Provider<Prefs>((ref) {
  return Prefs(ref.watch(sharedPrefsProvider));
});

final secureStorageProvider = Provider<SecureStorage>((ref) => SecureStorage());

final dioClientProvider = Provider<DioClient>((ref) {
  return DioClient(ref.watch(secureStorageProvider));
});

final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService(ref.watch(dioClientProvider).dio);
});
