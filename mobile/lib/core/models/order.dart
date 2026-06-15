import '../utils/json.dart';

class OrderItem {
  OrderItem({
    required this.productName,
    required this.price,
    required this.quantity,
  });
  final String productName;
  final double price;
  final int quantity;

  factory OrderItem.fromJson(Map<String, dynamic> j) => OrderItem(
        productName: (j['productName'] ?? '') as String,
        price: toDouble(j['price']),
        quantity: (j['quantity'] as num).toInt(),
      );
}

class Order {
  Order({
    required this.id,
    required this.orderNumber,
    required this.status,
    required this.grandTotal,
    required this.createdAt,
    required this.items,
  });
  final String id;
  final String orderNumber;
  final String status;
  final double grandTotal;
  final DateTime createdAt;
  final List<OrderItem> items;

  factory Order.fromJson(Map<String, dynamic> j) => Order(
        id: j['id'] as String,
        orderNumber: (j['orderNumber'] ?? '') as String,
        status: (j['status'] ?? 'NEW') as String,
        grandTotal: toDouble(j['grandTotal']),
        createdAt:
            DateTime.tryParse((j['createdAt'] ?? '') as String) ?? DateTime(2000),
        items: (j['items'] as List?)
                ?.whereType<Map<String, dynamic>>()
                .map(OrderItem.fromJson)
                .toList() ??
            const [],
      );
}

class Application {
  Application({
    required this.id,
    required this.type,
    required this.status,
    required this.createdAt,
    this.comment,
  });
  final String id;
  final String type;
  final String status;
  final DateTime createdAt;
  final String? comment;

  factory Application.fromJson(Map<String, dynamic> j) => Application(
        id: j['id'] as String,
        type: (j['type'] ?? '') as String,
        status: (j['status'] ?? 'NEW') as String,
        createdAt:
            DateTime.tryParse((j['createdAt'] ?? '') as String) ?? DateTime(2000),
        comment: j['comment'] as String?,
      );
}
