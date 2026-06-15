import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/di/providers.dart';
import '../../core/models/catalog.dart';

final servicesProvider = FutureProvider<List<ServiceItem>>((ref) {
  return ref.watch(apiServiceProvider).services();
});
