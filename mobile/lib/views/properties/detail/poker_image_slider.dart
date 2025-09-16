import 'package:flutter/material.dart';
import 'package:mobile_nirwana/data/models/property/property_images.dart';
import 'package:mobile_nirwana/views/properties/detail/all_photos_grid_screen.dart';
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

    const double itemWidth = 65.0;
    const double itemHorizontalMargin = 4.0;
    const double listHorizontalPadding = 8.0;

    final int itemCount = _validImages.length > 5 ? 5 : _validImages.length;

    final double totalItemsWidth = itemWidth * itemCount;
    final double totalMarginsWidth = (itemHorizontalMargin * 2) * itemCount;
    final double totalPaddingWidth = listHorizontalPadding * 2;
    final double dynamicContainerWidth =
        totalItemsWidth + totalMarginsWidth + totalPaddingWidth;

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
            margin:
                const EdgeInsets.only(bottom: 26.0, right: 16.0, left: 16.0),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20.0),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
                child: Container(
                  width: dynamicContainerWidth,
                  height: 75,
                  padding: const EdgeInsets.symmetric(vertical: 8.0),
                  color: Colors.white.withOpacity(0.2),
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(
                        horizontal: listHorizontalPadding),
                    itemCount: itemCount,
                    itemBuilder: (context, index) {
                      if (index == 4 && _validImages.length > 5) {
                        return _buildCounterItem();
                      } else {
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
        width: 65,
        margin: const EdgeInsets.symmetric(horizontal: 2.0),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected
                ? Theme.of(context).primaryColor
                : Colors.white.withOpacity(0.7),
            width: 2.0,
          ),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(6.0),
          child: Image.network(
            fullUrl,
            fit: BoxFit.cover,
          ),
        ),
      ),
    );
  }

  Widget _buildCounterItem() {
    // Ambil gambar ke-5 (index 4) sebagai background
    final String filename = _validImages[4].image_url!;
    final String fullUrl = Imgurl.get('property/property_images/$filename');
    final int remainingImages = _validImages.length - 4;

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => AllPhotosGridScreen(images: _validImages),
          ),
        );
      },
      child: Container(
        width: 65,
        margin: const EdgeInsets.symmetric(horizontal: 2.0),
        child: Stack(
          fit: StackFit.expand,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8.0),
              child: Image.network(
                fullUrl,
                fit: BoxFit.cover,
              ),
            ),
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8.0),
                color: Colors.amber.withOpacity(0.8),
              ),
            ),
            Center(
              child: Text(
                '+$remainingImages',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  shadows: [Shadow(blurRadius: 2.0, color: Colors.black38)],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
