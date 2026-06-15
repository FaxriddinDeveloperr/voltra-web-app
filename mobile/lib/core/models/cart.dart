import 'product.dart';
import '../utils/json.dart';

class CartLine {
  CartLine({
    required this.id,
    required this.productId,
    required this.quantity,
    required this.product,
    required this.lineTotal,
  });
  final String id;
  final String productId;
  final int quantity;
  final Product product;
  final double lineTotal;

  factory CartLine.fromJson(Map<String, dynamic> j) => CartLine(
        id: j['id'] as String,
        productId: j['productId'] as String,
        quantity: (j['quantity'] as num).toInt(),
        product: Product.fromJson(j['product'] as Map<String, dynamic>),
        lineTotal: toDouble(j['lineTotal']),
      );
}

class Cart {
  Cart({
    required this.items,
    required this.count,
    required this.itemsTotal,
    required this.discountTotal,
    required this.grandTotal,
  });
  final List<CartLine> items;
  final int count;
  final double itemsTotal;
  final double discountTotal;
  final double grandTotal;

  static Cart empty() => Cart(
      items: const [], count: 0, itemsTotal: 0, discountTotal: 0, grandTotal: 0);

  factory Cart.fromJson(Map<String, dynamic> j) => Cart(
        items: (j['items'] as List?)
                ?.whereType<Map<String, dynamic>>()
                .map(CartLine.fromJson)
                .toList() ??
            const [],
        count: (j['count'] as num?)?.toInt() ?? 0,
        itemsTotal: toDouble(j['itemsTotal']),
        discountTotal: toDouble(j['discountTotal']),
        grandTotal: toDouble(j['grandTotal']),
      );
}
