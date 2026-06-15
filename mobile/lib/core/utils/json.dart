/// Decimal (backend string sifatida qaytaradi) -> double.
double toDouble(dynamic v) {
  if (v == null) return 0;
  if (v is num) return v.toDouble();
  return double.tryParse(v.toString()) ?? 0;
}

double? toDoubleN(dynamic v) => v == null ? null : toDouble(v);
