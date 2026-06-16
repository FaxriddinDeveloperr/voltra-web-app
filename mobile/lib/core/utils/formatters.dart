/// Spec 8.1/8.2 — Narx va telefon formatlash.
abstract class Formatters {
  static const _nbsp = ' '; // bo'linmas bo'shliq

  /// 4114000 -> "4 114 000 so'm" (har 3 raqamda NBSP).
  static String price(num value, {String suffix = "so'm"}) {
    final grouped = _group(value.round());
    return suffix.isEmpty ? grouped : '$grouped$_nbsp$suffix';
  }

  /// 340 -> "340 y.e."
  static String usd(num value) => '${_group(value.round())}${_nbsp}y.e.';

  /// USD shakli: 3000 -> "$3 000", 82.14 -> "$82.14"
  static String usdPrice(num? value) {
    if (value == null) return '';
    final d = value.toDouble();
    if (d == d.roundToDouble()) return '\$${_group(d.round())}';
    final cents = (d * 100).round();
    final intPart = cents ~/ 100;
    final frac = (cents % 100).toString().padLeft(2, '0');
    return '\$${_group(intPart)}.$frac';
  }

  static String _group(int value) {
    final neg = value < 0;
    final digits = value.abs().toString();
    final buf = StringBuffer();
    for (int i = 0; i < digits.length; i++) {
      if (i > 0 && (digits.length - i) % 3 == 0) buf.write(_nbsp);
      buf.write(digits[i]);
    }
    return neg ? '-${buf.toString()}' : buf.toString();
  }

  /// "+998940196141" -> "+998 94 019 61 41"
  static String phone(String raw) {
    final d = raw.replaceAll(RegExp(r'\D'), '');
    final body = d.startsWith('998') ? d.substring(3) : d;
    final p = body.padRight(9, ' ').substring(0, body.length.clamp(0, 9));
    final parts = <String>[];
    if (p.length >= 2) parts.add(p.substring(0, 2));
    if (p.length >= 5) parts.add(p.substring(2, 5));
    if (p.length >= 7) parts.add(p.substring(5, 7));
    if (p.length >= 9) parts.add(p.substring(7, 9));
    final tail = parts.join(' ');
    return '+998${tail.isEmpty ? '' : ' $tail'}';
  }

  /// UI maskadan toza E.164: "94 019 61 41" -> "+998940196141"
  static String toE164(String input) {
    final d = input.replaceAll(RegExp(r'\D'), '');
    final body = d.startsWith('998') ? d.substring(3) : d;
    return '+998$body';
  }
}
