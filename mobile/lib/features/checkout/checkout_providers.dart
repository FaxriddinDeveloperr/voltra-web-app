import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/di/providers.dart';
import '../../core/models/catalog.dart';

final regionsProvider = FutureProvider<List<Region>>((ref) {
  return ref.watch(apiServiceProvider).regions();
});

final citiesProvider =
    FutureProvider.family<List<City>, String>((ref, regionId) {
  return ref.watch(apiServiceProvider).cities(regionId);
});

final pickupPointsProvider = FutureProvider<List<PickupPoint>>((ref) {
  return ref.watch(apiServiceProvider).pickupPoints();
});
