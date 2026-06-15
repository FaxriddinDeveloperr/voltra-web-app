import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/di/providers.dart';
import '../../core/models/catalog.dart';

final categoriesProvider = FutureProvider<List<Category>>((ref) {
  return ref.watch(apiServiceProvider).categories();
});
