import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get/utils.dart';
import 'package:intl/intl.dart'; // Import untuk format harga
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/core/utils/api.dart'; // Sesuaikan path
import 'package:mobile_nirwana/data/models/building_property/building_property.dart';
import 'package:cached_network_image/cached_network_image.dart';

class AllUnitsBottomSheet extends StatefulWidget {
  final ScrollController scrollController;
  final List<BuildingProperty> allUnits;

  const AllUnitsBottomSheet({
    super.key,
    required this.scrollController,
    required this.allUnits,
  });

  @override
  State<AllUnitsBottomSheet> createState() => _AllUnitsBottomSheetState();
}

class _AllUnitsBottomSheetState extends State<AllUnitsBottomSheet> {
  late final TextEditingController _searchController;
  late List<BuildingProperty> _filteredUnits;

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController();
    _filteredUnits = widget.allUnits;
    _searchController.addListener(_filterUnits);
  }

  @override
  void dispose() {
    _searchController.removeListener(_filterUnits);
    _searchController.dispose();
    super.dispose();
  }

  void _filterUnits() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      if (query.isEmpty) {
        _filteredUnits = widget.allUnits;
      } else {
        _filteredUnits = widget.allUnits.where((unit) {
          // Hanya mencari berdasarkan nama unit
          return unit.name.toLowerCase().contains(query);
        }).toList();
      }
    });
  }

  // Helper untuk mengambil gambar, bisa disesuaikan
  String _getUnitImage(BuildingProperty unit) {
    if (unit.images.isNotEmpty && unit.images[0].image_url != null) {
      return unit.images[0].image_url!;
    }
    return "";
  }

  // Helper untuk format harga (kita copy dari halaman detail)
  String _formatCurrency(double? amount) {
    if (amount == null) return "Harga tidak tersedia";
    final formatter = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    );
    return formatter.format(amount);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[100], // Ganti warna latar belakang di sini
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      child: Column(
        children: [
          Container(
            width: 40,
            height: 5,
            margin: const EdgeInsets.symmetric(vertical: 12.0),
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(10),
            ),
          ),
          Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Cari nama unit...', // Hint text diubah
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: Colors.grey[100],
              ),
            ),
          ),
          Expanded(
            child: ListView.builder(
              controller: widget.scrollController,
              itemCount: _filteredUnits.length,
              padding: const EdgeInsets.fromLTRB(16.0, 16.0, 16.0, 0),
              itemBuilder: (context, index) {
                final unit = _filteredUnits[index];
                return _buildUnitCardInModal(context, unit);
              },
            ),
          ),
        ],
      ),
    );
  }

  // >> PERUBAHAN 2: Card disesuaikan untuk menampilkan harga & spesifikasi <<
  Widget _buildUnitCardInModal(BuildContext context, BuildingProperty unit) {
    final String fullImageUrl =
        Imgurl.get('building_property/building_images/${_getUnitImage(unit)}');
    final specs = unit.specifications;
    final theme = Theme.of(context);
    return InkWell(
      onTap: () {
        Get.toNamed(
          Routes.DETAIL_BUILDING,
          arguments: unit, // Kirim objek 'unit' sebagai argumen
        );
      },
      borderRadius: BorderRadius.circular(12),
      child: Card(
        color: Colors.white,
        elevation: 2,
        margin: const EdgeInsets.only(bottom: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8.0),
                child: CachedNetworkImage(
                  imageUrl: fullImageUrl,
                  width: 80,
                  height: 80,
                  fit: BoxFit.cover,
                  placeholder: (context, url) =>
                      Container(color: Colors.grey[200]),
                  errorWidget: (context, url, error) => Container(
                    width: 80,
                    height: 80,
                    color: Colors.grey[200],
                    child: const Icon(Icons.apartment, color: Colors.grey),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Nama Unit
                    Text(
                      unit.name,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    // Harga
                    Text(
                      _formatCurrency(unit.price),
                      style: TextStyle(
                        fontSize: 14,
                        color: theme.primaryColor,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    // Spesifikasi (Luas, Kamar Tidur, Kamar Mandi)
                    Text(
                      'Luas: ${unit.buildingSize ?? '-'} m² • KT: ${specs?.bedrooms ?? '-'} • KM: ${specs?.bathrooms ?? '-'}',
                      style: TextStyle(fontSize: 13, color: Colors.grey[700]),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
