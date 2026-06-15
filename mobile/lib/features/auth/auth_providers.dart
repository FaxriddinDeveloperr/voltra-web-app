import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/di/providers.dart';
import '../../core/models/user.dart';

enum AuthStatus { unknown, unauthenticated, needsProfile, authenticated }

class AuthState {
  const AuthState({required this.status, this.user});
  final AuthStatus status;
  final AppUser? user;

  AuthState copyWith({AuthStatus? status, AppUser? user}) =>
      AuthState(status: status ?? this.status, user: user ?? this.user);

  static const initial = AuthState(status: AuthStatus.unknown);
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._ref) : super(AuthState.initial);
  final Ref _ref;

  /// Splash: token bormi tekshiradi.
  Future<void> bootstrap() async {
    final storage = _ref.read(secureStorageProvider);
    final token = await storage.accessToken;
    if (token == null || token.isEmpty) {
      state = const AuthState(status: AuthStatus.unauthenticated);
      return;
    }
    try {
      final user = await _ref.read(apiServiceProvider).getMe();
      state = _fromUser(user);
    } catch (_) {
      await storage.clear();
      state = const AuthState(status: AuthStatus.unauthenticated);
    }
  }

  Future<void> sendOtp(String phone) =>
      _ref.read(apiServiceProvider).sendOtp(phone);

  /// OTP tasdiqlash -> token saqlash -> state.
  Future<AuthStatus> verifyOtp(String phone, String code) async {
    final api = _ref.read(apiServiceProvider);
    final res = await api.verifyOtp(phone, code);
    await _ref.read(secureStorageProvider).saveTokens(
          res['accessToken'] as String,
          res['refreshToken'] as String,
        );
    final user = AppUser.fromJson(res['user'] as Map<String, dynamic>);
    final isNewProfile = (res['isNewProfile'] as bool?) ?? false;
    state = isNewProfile
        ? AuthState(status: AuthStatus.needsProfile, user: user)
        : _fromUser(user);
    return state.status;
  }

  Future<void> completeProfile({
    required String firstName,
    required String lastName,
    String? middleName,
  }) async {
    final user = await _ref.read(apiServiceProvider).updateMe({
      'firstName': firstName,
      'lastName': lastName,
      if (middleName != null && middleName.isNotEmpty) 'middleName': middleName,
    });
    state = AuthState(status: AuthStatus.authenticated, user: user);
  }

  void setUser(AppUser user) =>
      state = AuthState(status: AuthStatus.authenticated, user: user);

  Future<void> logout() async {
    try {
      await _ref.read(apiServiceProvider).logout();
    } catch (_) {}
    await _ref.read(secureStorageProvider).clear();
    state = const AuthState(status: AuthStatus.unauthenticated);
  }

  AuthState _fromUser(AppUser user) {
    final needs = (user.firstName == null || user.firstName!.isEmpty) &&
        (user.lastName == null || user.lastName!.isEmpty);
    return AuthState(
      status: needs ? AuthStatus.needsProfile : AuthStatus.authenticated,
      user: user,
    );
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>(
  (ref) => AuthNotifier(ref),
);
