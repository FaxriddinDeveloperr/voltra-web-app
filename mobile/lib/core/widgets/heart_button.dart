import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Spec 1.6 — Like (heart) toggle: outline -> to'ldirilgan qizil + scale pop.
/// CLAUDE.md: ease-out, qisqa (~180ms), reduced-motion'ni hurmat qiladi.
class HeartButton extends StatefulWidget {
  const HeartButton({
    super.key,
    required this.isFavorite,
    this.onTap,
    this.size = 18,
  });

  final bool isFavorite;
  final VoidCallback? onTap;
  final double size;

  @override
  State<HeartButton> createState() => _HeartButtonState();
}

class _HeartButtonState extends State<HeartButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 220),
  );
  late final Animation<double> _scale = TweenSequence<double>([
    TweenSequenceItem(tween: Tween(begin: 1, end: 1.35), weight: 40),
    TweenSequenceItem(tween: Tween(begin: 1.35, end: 1), weight: 60),
  ]).animate(CurvedAnimation(parent: _c, curve: Curves.easeOut));

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  void _handleTap() {
    final reduce = MediaQuery.maybeOf(context)?.disableAnimations ?? false;
    if (!reduce && !widget.isFavorite) {
      _c.forward(from: 0);
    }
    widget.onTap?.call();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _handleTap,
      child: Container(
        padding: const EdgeInsets.all(6),
        decoration: const BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
        ),
        child: ScaleTransition(
          scale: _scale,
          child: Icon(
            widget.isFavorite ? Icons.favorite : Icons.favorite_border,
            size: widget.size,
            color: widget.isFavorite
                ? AppColors.discountRed
                : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}
