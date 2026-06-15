import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/di/providers.dart';
import '../../core/models/order.dart';

final ordersProvider = FutureProvider<List<Order>>((ref) {
  return ref.watch(apiServiceProvider).orders();
});
