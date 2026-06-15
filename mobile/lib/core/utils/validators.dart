abstract class Validators {
  static String? required(String? v, {String msg = "Maydon to'ldirilishi shart"}) {
    if (v == null || v.trim().isEmpty) return msg;
    return null;
  }

  static String? phone(String? v) {
    if (v == null || v.trim().isEmpty) return 'Telefon raqamini kiriting';
    final d = v.replaceAll(RegExp(r'\D'), '');
    final body = d.startsWith('998') ? d.substring(3) : d;
    if (body.length != 9) return "Raqam to'liq emas";
    return null;
  }

  static String? otp(String? v) {
    if (v == null || v.length < 4) return 'Kodni kiriting';
    return null;
  }
}
