// Kategoriya, banner, xizmat, viloyat, pickup, kontent modellari.

class Category {
  Category({
    required this.id,
    required this.nameUz,
    this.imageUrl,
    this.children = const [],
  });
  final String id;
  final String nameUz;
  final String? imageUrl;
  final List<Category> children;

  factory Category.fromJson(Map<String, dynamic> j) => Category(
        id: j['id'] as String,
        nameUz: (j['nameUz'] ?? '') as String,
        imageUrl: j['imageUrl'] as String?,
        children: (j['children'] as List?)
                ?.whereType<Map<String, dynamic>>()
                .map(Category.fromJson)
                .toList() ??
            const [],
      );
}

class Banner {
  Banner({required this.id, required this.imageUrl, this.title, this.link});
  final String id;
  final String imageUrl;
  final String? title;
  final String? link;

  factory Banner.fromJson(Map<String, dynamic> j) => Banner(
        id: j['id'] as String,
        imageUrl: (j['imageUrl'] ?? '') as String,
        title: j['title'] as String?,
        link: j['link'] as String?,
      );
}

class ServiceItem {
  ServiceItem({
    required this.id,
    required this.nameUz,
    required this.isActive,
    required this.comingSoon,
    required this.hasPowerField,
  });
  final String id;
  final String nameUz;
  final bool isActive;
  final bool comingSoon;
  final bool hasPowerField;

  factory ServiceItem.fromJson(Map<String, dynamic> j) => ServiceItem(
        id: j['id'] as String,
        nameUz: (j['nameUz'] ?? '') as String,
        isActive: (j['isActive'] as bool?) ?? true,
        comingSoon: (j['comingSoon'] as bool?) ?? false,
        hasPowerField: (j['hasPowerField'] as bool?) ?? false,
      );
}

class Region {
  Region({required this.id, required this.nameUz});
  final String id;
  final String nameUz;
  factory Region.fromJson(Map<String, dynamic> j) =>
      Region(id: j['id'] as String, nameUz: (j['nameUz'] ?? '') as String);
}

class City {
  City({required this.id, required this.nameUz});
  final String id;
  final String nameUz;
  factory City.fromJson(Map<String, dynamic> j) =>
      City(id: j['id'] as String, nameUz: (j['nameUz'] ?? '') as String);
}

class PickupPoint {
  PickupPoint({required this.id, required this.name, required this.city});
  final String id;
  final String name;
  final String city;
  factory PickupPoint.fromJson(Map<String, dynamic> j) => PickupPoint(
        id: j['id'] as String,
        name: (j['name'] ?? '') as String,
        city: (j['city'] ?? '') as String,
      );
}

class AppContent {
  AppContent({this.titleUz, this.bodyUz});
  final String? titleUz;
  final String? bodyUz;
  factory AppContent.fromJson(Map<String, dynamic> j) => AppContent(
        titleUz: j['titleUz'] as String?,
        bodyUz: j['bodyUz'] as String?,
      );
}
