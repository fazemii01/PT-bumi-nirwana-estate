import 'package:flutter/material.dart';
import 'package:mobile_nirwana/core/utils/api.dart'; // Sesuaikan path import ini jika perlu
import 'package:mobile_nirwana/data/models/property/property_images.dart'; // Sesuaikan path import ini jika perlu

class AllPhotosGridScreen extends StatelessWidget {
  final List<PropertyImages> images;

  const AllPhotosGridScreen({super.key, required this.images});

  void _showStyleBottomSheet(BuildContext context, String imageUrl) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (BuildContext context) {
        // FIX 1: Kurangi padding horizontal agar modal lebih lebar
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 0),
          child: Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(28.0)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
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

                // FIX 2: Beri Padding pada gambar agar tidak menempel di tepi
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: ClipRRect(
                    // FIX 2: Beri gambar sudut melengkung di semua sisinya
                    borderRadius: BorderRadius.circular(16.0),
                    child: Image.network(
                      imageUrl,
                      fit: BoxFit.cover,
                      height: MediaQuery.of(context).size.height * 0.4,
                    ),
                  ),
                ),

                // Tombol (tidak ada perubahan)
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFDBB837),
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
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Semua Foto'),
        backgroundColor: Colors.white,
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
              _showStyleBottomSheet(context, fullUrl);
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
