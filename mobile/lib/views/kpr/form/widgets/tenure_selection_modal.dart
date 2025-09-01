import 'package:flutter/material.dart';

class TenureSelectionModal extends StatelessWidget {
  final int? selectedTenure;
  final int? maxTenure;
  final Function(int) onTenureSelected;

  const TenureSelectionModal({
    Key? key,
    this.selectedTenure,
    this.maxTenure,
    required this.onTenureSelected,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.55,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
        ),
      ),
      child: Column(
        children: [
          // Handle bar
          Container(
            margin: const EdgeInsets.only(top: 12),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.all(24),
            child: Row(
              children: [
                const Expanded(
                  child: Text(
                    'Pilih Jangka Waktu',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF2D3748),
                    ),
                  ),
                ),
                GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      Icons.close,
                      size: 20,
                      color: Colors.grey[600],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Subtitle
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Pilih masa kredit yang sesuai dengan kemampuan finansial Anda',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
            ),
          ),

          const SizedBox(height: 20),

          // Tenure Grid
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 2.2,
                ),
                itemCount: maxTenure, // 1 sampai 15 tahun
                itemBuilder: (context, index) {
                  final tenure = index + 1;
                  final isSelected = selectedTenure == tenure;

                  return GestureDetector(
                    onTap: () => onTenureSelected(tenure),
                    child: Container(
                      decoration: BoxDecoration(
                        color:
                            isSelected ? const Color(0xFFD4AF37) : Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected
                              ? const Color(0xFFD4AF37)
                              : Colors.grey[300]!,
                          width: isSelected ? 2 : 1,
                        ),
                        boxShadow: isSelected
                            ? [
                                BoxShadow(
                                  color:
                                      const Color(0xFFD4AF37).withOpacity(0.3),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ]
                            : [],
                      ),
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              '$tenure',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w700,
                                color: isSelected
                                    ? Colors.white
                                    : const Color(0xFF2D3748),
                              ),
                            ),
                            Text(
                              'Tahun',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: isSelected
                                    ? Colors.white.withOpacity(0.9)
                                    : Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),

          // Popular Options

          Container(
            padding: const EdgeInsets.all(24),
            child: maxTenure! >= 15
                ? Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Pilihan Populer',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[700],
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          _buildPopularOption(context, 5, 'Cicilan Tinggi'),
                          const SizedBox(width: 8),
                          _buildPopularOption(context, 10, 'Seimbang'),
                          const SizedBox(width: 8),
                          _buildPopularOption(context, 15, 'Cicilan Ringan'),
                        ],
                      ),
                    ],
                  )
                : null,
          ),
        ],
      ),
    );
  }

  Widget _buildPopularOption(BuildContext context, int tenure, String label) {
    final isSelected = selectedTenure == tenure;

    return Expanded(
      child: GestureDetector(
        onTap: () => onTenureSelected(tenure),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFFFFF8E7) : Colors.grey[50],
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isSelected ? const Color(0xFFD4AF37) : Colors.grey[300]!,
              width: 1,
            ),
          ),
          child: Column(
            children: [
              Text(
                '$tenure th',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: isSelected
                      ? const Color(0xFFD4AF37)
                      : const Color(0xFF2D3748),
                ),
              ),
              Text(
                label,
                style: TextStyle(
                  fontSize: 10,
                  color:
                      isSelected ? const Color(0xFFD4AF37) : Colors.grey[600],
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
