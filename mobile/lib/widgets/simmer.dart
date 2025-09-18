import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class Simmer extends StatelessWidget {
  final double? height;
  final double? width;
  final BorderRadius? borderRadius;
  const Simmer({
    Key? key,
    this.height,
    this.width,
    this.borderRadius,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey[200]!,
      highlightColor: Colors.grey[100]!,
      child: Container(
        height: height,
        width: width,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: borderRadius ?? BorderRadius.circular(4),
        ),
      ),
    );
  }
}
