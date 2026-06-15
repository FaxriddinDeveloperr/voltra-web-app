import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import '../../../core/models/catalog.dart' as m;
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/widgets/network_img.dart';

/// Spec 2.2.1 — Banner karusel (PageView, avto-scroll, nuqta indikator).
class BannerCarousel extends StatefulWidget {
  const BannerCarousel({super.key, required this.banners});
  final List<m.Banner> banners;

  @override
  State<BannerCarousel> createState() => _BannerCarouselState();
}

class _BannerCarouselState extends State<BannerCarousel> {
  int _current = 0;

  @override
  Widget build(BuildContext context) {
    if (widget.banners.isEmpty) return const SizedBox.shrink();
    return Column(
      children: [
        CarouselSlider(
          options: CarouselOptions(
            height: 160,
            viewportFraction: 1,
            autoPlay: widget.banners.length > 1,
            autoPlayInterval: const Duration(seconds: 4),
            autoPlayCurve: Curves.easeOut,
            onPageChanged: (i, _) => setState(() => _current = i),
          ),
          items: widget.banners.map((b) {
            return ClipRRect(
              borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
              child: SizedBox(
                width: double.infinity,
                child: NetworkImg(url: b.imageUrl),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: AppSpacing.md),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(widget.banners.length, (i) {
            final active = i == _current;
            return AnimatedContainer(
              duration: const Duration(milliseconds: 250),
              margin: const EdgeInsets.symmetric(horizontal: 3),
              width: active ? 18 : 7,
              height: 7,
              decoration: BoxDecoration(
                color: active ? AppColors.primaryAccent : AppColors.border,
                borderRadius: BorderRadius.circular(4),
              ),
            );
          }),
        ),
      ],
    );
  }
}
