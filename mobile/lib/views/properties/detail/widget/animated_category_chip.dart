import 'package:flutter/material.dart';

class AnimatedCategoryChip extends StatefulWidget {
  final String categoryType;
  const AnimatedCategoryChip({super.key, required this.categoryType});

  @override
  State<AnimatedCategoryChip> createState() => _AnimatedCategoryChipState();
}

class _AnimatedCategoryChipState extends State<AnimatedCategoryChip> {
  bool _isExpanded = false;

  IconData _getCategoryIcon(String categoryType) {
    switch (categoryType.toLowerCase()) {
      case 'Komersil':
        return Icons.apartment_rounded;
      case 'Subsidi':
        return Icons.house_rounded;
      default:
        return Icons.house_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final icon = _getCategoryIcon(widget.categoryType);

    return GestureDetector(
      onTap: () {
        setState(() {
          _isExpanded = !_isExpanded;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 350),
        curve: Curves.fastOutSlowIn,
        height: 50,
        width: _isExpanded ? 130 : 50,
        decoration: BoxDecoration(
          color: theme.colorScheme.primary,
          borderRadius: BorderRadius.circular(25),
          boxShadow: [
            BoxShadow(
              color: theme.colorScheme.primary.withOpacity(0.3),
              blurRadius: 10,
              offset: const Offset(0, 5),
            )
          ],
        ),
        // FIX: Mengganti Row dengan Stack untuk kontrol animasi posisi
        child: Stack(
          alignment: Alignment.center,
          children: [
            // 1. Animasikan posisi ikon
            AnimatedAlign(
              duration: const Duration(milliseconds: 350),
              curve: Curves.fastOutSlowIn,
              // Saat terbuka, geser ikon ke kiri. Saat tertutup, posisikan di tengah.
              alignment:
                  _isExpanded ? const Alignment(-0.7, 0) : Alignment.center,
              child: Icon(
                icon,
                color: Colors.white,
                size: 24,
              ),
            ),

            // 2. Animasikan kemunculan dan posisi teks
            AnimatedAlign(
              duration: const Duration(milliseconds: 350),
              curve: Curves.fastOutSlowIn,
              // Posisikan teks di sebelah kanan, atau di tengah saat tersembunyi
              alignment:
                  _isExpanded ? const Alignment(0.4, 0) : Alignment.center,
              child: AnimatedOpacity(
                duration: const Duration(milliseconds: 200),
                opacity: _isExpanded ? 1 : 0.0,
                child: Text(
                  widget.categoryType,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                  maxLines: 1,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
