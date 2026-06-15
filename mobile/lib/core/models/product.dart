import '../utils/json.dart';

/// Mahsulot modeli (backend Product). Manual JSON.
class ProductImage {
  ProductImage({required this.id, required this.url, required this.sortOrder});
  final String id;
  final String url;
  final int sortOrder;

  factory ProductImage.fromJson(Map<String, dynamic> j) => ProductImage(
        id: j['id'] as String,
        url: j['url'] as String,
        sortOrder: (j['sortOrder'] as num?)?.toInt() ?? 0,
      );
}

class ProductSpec {
  ProductSpec({required this.icon, required this.label, required this.value});
  final String icon;
  final String label;
  final String value;

  factory ProductSpec.fromJson(Map<String, dynamic> j) => ProductSpec(
        icon: (j['icon'] ?? '') as String,
        label: (j['label'] ?? '') as String,
        value: (j['value'] ?? '') as String,
      );
}

class Brand {
  Brand({required this.id, required this.name, this.logoUrl});
  final String id;
  final String name;
  final String? logoUrl;

  factory Brand.fromJson(Map<String, dynamic> j) => Brand(
        id: j['id'] as String,
        name: j['name'] as String,
        logoUrl: j['logoUrl'] as String?,
      );
}

class Product {
  Product({
    required this.id,
    required this.nameUz,
    required this.slug,
    required this.price,
    this.oldPrice,
    this.priceUsd,
    this.discountPct,
    required this.stock,
    this.vatIncluded = true,
    this.descriptionUz,
    this.shortFeatures = const [],
    this.specs = const [],
    this.images = const [],
    this.datasheetUrl,
    this.isHot = false,
    this.isNew = false,
    this.isBestSeller = false,
    this.isXit = false,
    this.brand,
  });

  final String id;
  final String nameUz;
  final String slug;
  final double price;
  final double? oldPrice;
  final double? priceUsd;
  final int? discountPct;
  final int stock;
  final bool vatIncluded;
  final String? descriptionUz;
  final List<String> shortFeatures;
  final List<ProductSpec> specs;
  final List<ProductImage> images;
  final String? datasheetUrl;
  final bool isHot;
  final bool isNew;
  final bool isBestSeller;
  final bool isXit;
  final Brand? brand;

  String? get firstImage => images.isNotEmpty ? images.first.url : null;
  bool get hasDiscount => oldPrice != null && oldPrice! > price;

  factory Product.fromJson(Map<String, dynamic> j) => Product(
        id: j['id'] as String,
        nameUz: (j['nameUz'] ?? '') as String,
        slug: (j['slug'] ?? '') as String,
        price: toDouble(j['price']),
        oldPrice: toDoubleN(j['oldPrice']),
        priceUsd: toDoubleN(j['priceUsd']),
        discountPct: (j['discountPct'] as num?)?.toInt(),
        stock: (j['stock'] as num?)?.toInt() ?? 0,
        vatIncluded: (j['vatIncluded'] as bool?) ?? true,
        descriptionUz: j['descriptionUz'] as String?,
        shortFeatures: (j['shortFeatures'] as List?)
                ?.map((e) => e.toString())
                .toList() ??
            const [],
        specs: (j['specs'] as List?)
                ?.whereType<Map<String, dynamic>>()
                .map(ProductSpec.fromJson)
                .toList() ??
            const [],
        images: (j['images'] as List?)
                ?.whereType<Map<String, dynamic>>()
                .map(ProductImage.fromJson)
                .toList() ??
            const [],
        datasheetUrl: j['datasheetUrl'] as String?,
        isHot: (j['isHot'] as bool?) ?? false,
        isNew: (j['isNew'] as bool?) ?? false,
        isBestSeller: (j['isBestSeller'] as bool?) ?? false,
        isXit: (j['isXit'] as bool?) ?? false,
        brand: j['brand'] is Map<String, dynamic>
            ? Brand.fromJson(j['brand'] as Map<String, dynamic>)
            : null,
      );
}

/// Sahifalangan natija (/products).
class Paginated<T> {
  Paginated({required this.items, required this.total});
  final List<T> items;
  final int total;
}
