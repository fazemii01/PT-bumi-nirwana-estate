import 'package:flutter/material.dart';
import 'package:mobile_nirwana/data/models/property/property_images.dart';
import 'dart:math' as math;
import 'package:mobile_nirwana/core/utils/api.dart';

class PokerCardImageSlider extends StatefulWidget {
  final List<PropertyImages> images;
  const PokerCardImageSlider({super.key, required this.images});

  @override
  State<PokerCardImageSlider> createState() => _PokerCardImageSliderState();
}

class _PokerCardImageSliderState extends State<PokerCardImageSlider> {
  late final PageController _pageController;
  double _currentPage = 0.0;
  late final List<PropertyImages> _validImages;

  @override
  void initState() {
    super.initState();
    _validImages = widget.images
        .where((img) => img.image_url != null && img.image_url!.isNotEmpty)
        .toList();

    _pageController = PageController(
      viewportFraction: 0.85,
    );
    _pageController.addListener(() {
      if (mounted) {
        setState(() {
          _currentPage = _pageController.page!;
        });
      }
    });
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

    return PageView.builder(
      controller: _pageController,
      itemCount: _validImages.length,
      itemBuilder: (context, index) {
        final double delta = (index - _currentPage).abs();
        final double scale = math.max(1 - (delta * 0.2), 0.8);
        final double opacity = math.max(1 - (delta * 0.5), 0.6);

        final String filename = _validImages[index].image_url!;

        final String fullUrl = Imgurl.get('property/property_images/$filename');

        return Transform.scale(
          scale: scale,
          child: Opacity(
            opacity: opacity,
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 0, vertical: 46),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.25),
                    blurRadius: 15,
                    offset: const Offset(0, 5),
                  ),
                ],
                image: DecorationImage(
                  image: NetworkImage(fullUrl),
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
