import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../theme/app_spacing.dart';

/// Spec 1.4.12 — SkeletonLoader (shimmer, kulrang bloklar).
class SkeletonBox extends StatelessWidget {
  const SkeletonBox({
    super.key,
    this.width = double.infinity,
    this.height = 16,
    this.radius = 8,
  });

  final double width;
  final double height;
  final double radius;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(radius),
      ),
    );
  }
}

/// Shimmer o'rab beruvchi.
class Skeleton extends StatelessWidget {
  const Skeleton({super.key, required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: const Color(0xFFE8E8E8),
      highlightColor: const Color(0xFFF5F5F5),
      child: child,
    );
  }
}

/// Home ekrani uchun skeleton (banner + quick actions + mahsulot bloklari).
class HomeSkeleton extends StatelessWidget {
  const HomeSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return Skeleton(
      child: ListView(
        padding: const EdgeInsets.all(AppSpacing.screen),
        children: [
          const SkeletonBox(height: 160, radius: 14),
          const SizedBox(height: AppSpacing.section),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(
              4,
              (_) => const SkeletonBox(width: 70, height: 80, radius: 14),
            ),
          ),
          const SizedBox(height: AppSpacing.section),
          const SkeletonBox(width: 160, height: 20),
          const SizedBox(height: AppSpacing.md),
          SizedBox(
            height: 230,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: 3,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (_, __) => const SizedBox(
                width: 160,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SkeletonBox(height: 150, radius: 12),
                    SizedBox(height: 8),
                    SkeletonBox(height: 14),
                    SizedBox(height: 6),
                    SkeletonBox(width: 90, height: 14),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Grid skeleton (katalog/qidiruv).
class GridSkeleton extends StatelessWidget {
  const GridSkeleton({super.key, this.itemCount = 6});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    return Skeleton(
      child: GridView.builder(
        padding: const EdgeInsets.all(AppSpacing.screen),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 0.62,
        ),
        itemCount: itemCount,
        itemBuilder: (_, __) => const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: SkeletonBox(radius: 12)),
            SizedBox(height: 8),
            SkeletonBox(height: 14),
            SizedBox(height: 6),
            SkeletonBox(width: 80, height: 14),
          ],
        ),
      ),
    );
  }
}
