class AppUser {
  AppUser({
    required this.id,
    required this.phone,
    this.firstName,
    this.lastName,
    this.middleName,
  });
  final String id;
  final String phone;
  final String? firstName;
  final String? lastName;
  final String? middleName;

  String get displayName {
    final parts = [lastName, firstName].where((e) => e != null && e.isNotEmpty);
    return parts.isEmpty ? phone : parts.join(' ');
  }

  factory AppUser.fromJson(Map<String, dynamic> j) => AppUser(
        id: j['id'] as String,
        phone: (j['phone'] ?? '') as String,
        firstName: j['firstName'] as String?,
        lastName: j['lastName'] as String?,
        middleName: j['middleName'] as String?,
      );
}
