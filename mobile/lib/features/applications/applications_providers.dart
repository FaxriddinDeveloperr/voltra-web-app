import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/di/providers.dart';
import '../../core/models/order.dart';

final applicationsProvider = FutureProvider<List<Application>>((ref) {
  return ref.watch(apiServiceProvider).applications();
});
