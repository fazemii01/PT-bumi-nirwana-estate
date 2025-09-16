import 'package:flutter/material.dart';
import 'package:mobile_nirwana/data/models/property/property_images.dart';
import 'package:mobile_nirwana/core/utils/api.dart';
import 'dart:ui';

class PokerCardImageSlider extends StatefulWidget {
  final List<PropertyImages> images;
  const PokerCardImageSlider({super.key, required this.images});

  @override
  State<PokerCardImageSlider> createState() => _PokerCardImageSliderState();
}

class _PokerCardImageSliderState extends State<PokerCardImageSlider> {
  late final PageController _pageController;
  int _currentIndex = 0;
  late final List<PropertyImages> _validImages;

  @override
  void initState() {
    super.initState();
    _validImages = widget.images
        .where((img) => img.image_url != null && img.image_url!.isNotEmpty)
        .toList();

    _pageController = PageController(
      viewportFraction: 1.0,
    );
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_validImages.isEmpty) {
      return Center(
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 0, vertical: 46),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            color: Colors.grey[300],
          ),
          child: const Center(
              child: Icon(Icons.image_not_supported,
                  color: Colors.grey, size: 48)),
        ),
      );
    }

    return Stack(
      children: [
        PageView.builder(
          controller: _pageController,
          itemCount: _validImages.length,
          onPageChanged: (index) {
            setState(() {
              _currentIndex = index;
            });
          },
          itemBuilder: (context, index) {
            final String filename = _validImages[index].image_url!;

            final String fullUrl =
                Imgurl.get('property/property_images/$filename');

            return Container(
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(fullUrl),
                  fit: BoxFit.cover,
                ),
              ),
            );
          },
        ),
        Align(
          alignment: Alignment.bottomCenter,
          child: Container(
            // Margin agar tidak menempel di tepi bawah/samping
            margin:
                const EdgeInsets.only(bottom: 24.0, left: 16.0, right: 16.0),
            // Gunakan ClipRRect untuk membuat sudut melengkung pada area blur
            child: ClipRRect(
              borderRadius:
                  BorderRadius.circular(20.0), // Sudut yang lebih besar/modern
              child: BackdropFilter(
                // INI BAGIAN KUNCINYA: memberikan efek blur
                filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
                child: Container(
                  height: 75,
                  // Beri warna semi-transparan, INI PENTING untuk efek "kaca"
                  color: Colors.white.withOpacity(0.2),
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    // Padding untuk item pertama dan terakhir di dalam list
                    padding: const EdgeInsets.symmetric(horizontal: 8.0),
                    itemCount: _validImages.length > 5
                        ? 5
                        : _validImages.length, // Tampilkan maksimal 5 item
                    itemBuilder: (context, index) {
                      // Cek: Apakah ini item terakhir (index ke-4) DAN ada lebih dari 5 gambar?
                      if (index == 4 && _validImages.length > 5) {
                        // Jika ya, tampilkan widget counter
                        return _buildCounterItem();
                      } else {
                        // Jika tidak, tampilkan thumbnail biasa
                        return _buildThumbnailItem(index);
                      }
                    },
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  // Ganti method _buildThumbnailItem lama Anda dengan yang ini
  Widget _buildThumbnailItem(int index) {
    final String filename = _validImages[index].image_url!;
    final String fullUrl = Imgurl.get('property/property_images/$filename');
    bool isSelected = _currentIndex == index;

    return GestureDetector(
      onTap: () {
        _pageController.animateToPage(
          index,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        // Margin antar thumbnail
        margin: const EdgeInsets.symmetric(horizontal: 4.0, vertical: 4.0),
        width: 78,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            // Beri border yang lebih jelas saat terpilih
            color: isSelected
                ? Theme.of(context).primaryColor
                : Colors.transparent,
            width: 2.5,
          ),
        ),
        child: Stack(
          fit: StackFit.expand,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(6.0),
              child: Image.network(
                fullUrl,
                fit: BoxFit.cover,
              ),
            ),
            // Overlay gelap jika tidak terpilih
            if (!isSelected)
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(6.0),
                  color: Colors.black.withOpacity(0.5),
                ),
              ),
          ],
        ),
      ),
    );
  }

  // Tambahkan method ini di dalam State class Anda
  Widget _buildCounterItem() {
    // Ambil gambar ke-5 (index 4) sebagai background
    final String filename = _validImages[4].image_url!;
    final String fullUrl = Imgurl.get('property/property_images/$filename');
    // Hitung sisa gambar
    final int remainingImages = _validImages.length - 4;

    return GestureDetector(
      onTap: () {
        // TODO: Navigasi ke halaman galeri grid
        print('Tampilkan semua ${_validImages.length} gambar');
        // Navigator.push(context, MaterialPageRoute(builder: (_) => AllPhotosGridScreen(images: _validImages)));
      },
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 4.0),
        width: 60,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Background: Gambar ke-5
            ClipRRect(
              borderRadius: BorderRadius.circular(8.0),
              child: Image.network(
                fullUrl,
                fit: BoxFit.cover,
              ),
            ),
            // Overlay gelap
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8.0),
                color: Colors.black.withOpacity(0.6),
              ),
            ),
            // Teks "+X"
            Center(
              child: Text(
                '+$remainingImages',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
