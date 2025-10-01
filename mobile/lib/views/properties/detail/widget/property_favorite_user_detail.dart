import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/views/home/home_controller.dart';

class FavoriteIcon extends StatelessWidget {
  final String propertyId;
  final bool isLoggedIn;
  final HomeController controller = Get.find<HomeController>();

  FavoriteIcon({super.key, required this.propertyId, required this.isLoggedIn});

  @override
  Widget build(BuildContext context) {
    // HAPUS: Widget Positioned yang menyebabkan error.
    // Untuk penggunaan di dalam AppBar/SliverAppBar, Positioned tidak diperlukan.
    // Cukup kembalikan GestureDetector secara langsung.
    return GestureDetector(
      onTap: () => isLoggedIn
          ? controller.toggleFavorite(propertyId)
          : Get.toNamed(Routes.LOGIN),
      child: Obx(
        () {
          final isFav = controller.favoriteIds.contains(propertyId);
          final isLoading = controller.loadingIds.contains(propertyId);
          return Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.9),
              shape:
                  BoxShape.circle, // Menggunakan shape circle agar lebih rapi
            ),
            child: isLoading
                ? const SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.red,
                    ),
                  )
                : Icon(
                    isFav
                        ? Icons.favorite
                        : Icons
                            .favorite_border, // Menggunakan favorite_border untuk konsistensi
                    size: 24,
                    color: isFav ? Colors.red : Colors.grey[800],
                  ),
          );
        },
      ),
    );
  }
}
