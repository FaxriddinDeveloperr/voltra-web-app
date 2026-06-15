import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Rasm + placeholder (spec — kulrang placeholder).
class NetworkImg extends StatelessWidget {
  const NetworkImg({super.key, this.url, this.fit = BoxFit.cover});
  final String? url;
  final BoxFit fit;

  @override
  Widget build(BuildContext context) {
    if (url == null || url!.isEmpty) {
      return _placeholder();
    }
    return CachedNetworkImage(
      imageUrl: url!,
      fit: fit,
      placeholder: (_, __) => _placeholder(),
      errorWidget: (_, __, ___) => _placeholder(broken: true),
    );
  }

  Widget _placeholder({bool broken = false}) => Container(
        color: AppColors.imagePlaceholder,
        alignment: Alignment.center,
        child: Icon(
          broken ? Icons.image_not_supported_outlined : Icons.solar_power,
          color: AppColors.strikethrough,
          size: 32,
        ),
      );
}
