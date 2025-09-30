import 'package:flutter/material.dart';
import 'package:photo_view/photo_view.dart';
import 'package:photo_view/photo_view_gallery.dart';

class SitePlanViewerPage extends StatelessWidget {
  // Anda akan menerima daftar URL gambar denah dari halaman sebelumnya
  final List<String> sitePlanImages;
  final int initialIndex;

  const SitePlanViewerPage({
    super.key,
    required this.sitePlanImages,
    this.initialIndex = 0,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        // Tombol kembali dengan warna kontras (putih)
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: PhotoViewGallery.builder(
        itemCount: sitePlanImages.length,
        // Memulai dari gambar yang dipilih
        pageController: PageController(initialPage: initialIndex),
        builder: (context, index) {
          final imageUrl = sitePlanImages[index];
          return PhotoViewGalleryPageOptions(
            imageProvider: NetworkImage(imageUrl),
            // Opsi untuk zoom
            minScale: PhotoViewComputedScale.contained * 0.8,
            maxScale: PhotoViewComputedScale.covered * 2,
            heroAttributes: PhotoViewHeroAttributes(tag: imageUrl),
          );
        },
        // Tampilkan loading spinner saat gambar dimuat
        loadingBuilder: (context, event) => const Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
          ),
        ),
        // Latar belakang galeri
        backgroundDecoration: const BoxDecoration(
          color: Colors.black,
        ),
      ),
    );
  }
}
