import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/views/home/home_controller.dart';

class FavoriteIcon extends StatelessWidget {
  final String propertyId;
  final HomeController controller = Get.find<HomeController>();

  FavoriteIcon({super.key, required this.propertyId});

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: 12,
      right: 12,
      child: GestureDetector(
        onTap: () => controller.toggleFavorite(propertyId),
        child: Obx(
          () {
            final isFav = controller.favoriteIds.contains(propertyId);
            return Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.9),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Icon(
                isFav ? Icons.favorite : Icons.favorite_outline,
                size: 16,
                color: isFav ? Colors.red : Colors.grey[600],
              ),
            );
          },
        ),
      ),
    );
  }
}
