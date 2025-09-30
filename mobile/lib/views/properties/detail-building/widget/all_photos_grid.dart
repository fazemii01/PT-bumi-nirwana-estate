import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/data/models/building_property/building_images.dart';

class AllPhotosGridScreen extends StatelessWidget {
  final List<BuildingImages> images;

  const AllPhotosGridScreen({super.key, required this.images});

  void _showGojekStyleBottomSheet(BuildContext context, String imageUrl) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (BuildContext context) {
        return AnnotatedRegion<SystemUiOverlayStyle>(
          value: SystemUiOverlayStyle(
            systemNavigationBarColor: Colors.white,
            systemNavigationBarIconBrightness: Brightness.dark,
          ),
          child: Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 0), // Modal lebih lebar
            child: Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28.0)),
              ),
              child: SafeArea(
                top: false,
                child: Column(
                  // mainAxisSize.min tidak diperlukan lagi karena ada Expanded
                  children: <Widget>[
                    // Handle bar
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 12.0),
                      child: Container(
                        width: 40,
                        height: 5,
                        decoration: BoxDecoration(
                          color: Colors.grey[300],
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),

                    // FIX: Gambar dibuat fleksibel dengan Expanded agar tidak overflow
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(16.0, 0, 16.0, 16.0),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(16.0),
                          child: Image.network(
                            imageUrl,
                            fit: BoxFit.cover,
                            // height dihapus dari sini agar Expanded bisa bekerja
                          ),
                        ),
                      ),
                    ),

                    // Tombol Kembali
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16.0, 0, 16.0, 16.0),
                      child: SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor:
                                const Color(0xFFDBB837), // Warna disesuaikan
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text(
                            'Kembali',
                            style: TextStyle(fontSize: 16, color: Colors.white),
                          ),
                          onPressed: () {
                            Navigator.of(context).pop();
                          },
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Semua Foto'),
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 1.0,
      ),
      body: GridView.builder(
        padding: const EdgeInsets.all(8.0),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          crossAxisSpacing: 8.0,
          mainAxisSpacing: 8.0,
        ),
        itemCount: images.length,
        itemBuilder: (context, index) {
          final image = images[index];
          final String filename = image.image_url!;
          final String fullUrl =
              Imgurl.get('property/property_images/$filename');

          return GestureDetector(
            onTap: () {
              // Pastikan memanggil nama fungsi yang benar
              _showGojekStyleBottomSheet(context, fullUrl);
            },
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8.0),
              child: Image.network(
                fullUrl,
                fit: BoxFit.cover,
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return const Center(child: CircularProgressIndicator());
                },
                errorBuilder: (context, error, stackTrace) {
                  return const Icon(Icons.error, color: Colors.red);
                },
              ),
            ),
          );
        },
      ),
    );
  }
}
