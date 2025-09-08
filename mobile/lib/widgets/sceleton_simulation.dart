import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class SimulationCardSkeleton extends StatelessWidget {
  const SimulationCardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header dengan tanggal palsu
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(12)),
            ),
            child: shimmerBox(height: 12, width: 80),
          ),

          // Content skeleton
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Property Image Placeholder
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: shimmerBox(height: 60, width: 60),
                ),
                const SizedBox(width: 12),

                // Property Details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      shimmerBox(height: 14, width: 150),
                      const SizedBox(height: 8),
                      shimmerBox(height: 12, width: 100),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(child: shimmerBox(height: 12)),
                          const SizedBox(width: 12),
                          Expanded(child: shimmerBox(height: 12)),
                        ],
                      ),
                      const SizedBox(height: 12),
                      shimmerBox(
                        height: 32,
                        borderRadius: BorderRadius.circular(6),
                      ),
                    ],
                  ),
                ),

                const SizedBox(width: 8),
                Icon(Icons.more_vert, color: Colors.grey[300]),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// Helper untuk shimmer container
  Widget shimmerBox({
    double height = 12,
    double? width,
    BorderRadius? borderRadius,
  }) {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: Container(
        height: height,
        width: width,
        decoration: BoxDecoration(
          color: Colors.grey[300],
          borderRadius: borderRadius ?? BorderRadius.circular(4),
        ),
      ),
    );
  }
}
