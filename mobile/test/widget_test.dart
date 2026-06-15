import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:quyoshli/core/utils/formatters.dart';

void main() {
  test('narx formati NBSP bilan', () {
    expect(Formatters.price(4114000), "4\u00A0114\u00A0000\u00A0so'm");
  });

  test('telefon formati', () {
    expect(Formatters.phone('+998940196141'), '+998 94 019 61 41');
  });

  testWidgets('smoke: MaterialApp quriladi', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: Scaffold()));
    expect(find.byType(Scaffold), findsOneWidget);
  });
}
