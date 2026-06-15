import 'package:flutter/material.dart';

/// Bosishda yengil scale feedback (0.97). Listener orqali — bosish hodisasini
/// YUTMAYDI, faqat vizual scale beradi; ichidagi tugma/karta o'z tap'ini oladi.
/// reduced-motion'ni hurmat qiladi.
class Pressable extends StatefulWidget {
  const Pressable({
    super.key,
    required this.child,
    this.onTap,
    this.scale = 0.97,
  });

  final Widget child;
  final VoidCallback? onTap;
  final double scale;

  @override
  State<Pressable> createState() => _PressableState();
}

class _PressableState extends State<Pressable> {
  bool _down = false;
  void _set(bool v) => _down == v ? null : setState(() => _down = v);

  @override
  Widget build(BuildContext context) {
    final reduce = MediaQuery.maybeOf(context)?.disableAnimations ?? false;
    final scale = (_down && !reduce) ? widget.scale : 1.0;

    Widget content = AnimatedScale(
      scale: scale,
      duration: const Duration(milliseconds: 110),
      curve: Curves.easeOut,
      child: widget.child,
    );

    if (widget.onTap != null) {
      content = GestureDetector(
        onTap: widget.onTap,
        behavior: HitTestBehavior.opaque,
        child: content,
      );
    }

    return Listener(
      onPointerDown: (_) => _set(true),
      onPointerUp: (_) => _set(false),
      onPointerCancel: (_) => _set(false),
      child: content,
    );
  }
}
