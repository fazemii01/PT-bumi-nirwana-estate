import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/core/utils/api.dart';
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
          return unit.name.toLowerCase().contains(query);
        }).toList();
      }
    });
  }

  String _getUnitImage(BuildingProperty unit) {
    if (unit.images.isNotEmpty && unit.images[0].image_url != null) {
      return unit.images[0].image_url!;
    }
    return "";
  }

  String _formatCurrency(double? amount) {
    if (amount == null) return "Harga tidak tersedia";
    final formatter = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    );
    return formatter.format(amount);
  }

  // Helper untuk status
  String _getStatusText(BuildingStatus status) {
    switch (status) {
      case BuildingStatus.AVAILABLE:
        return 'Tersedia';
      case BuildingStatus.SOLD_OUT:
        return 'Terjual';
      case BuildingStatus.RESERVED:
        return 'Dipesan';
      default:
        return 'Segera Hadir';
    }
  }

  // Helper untuk ikon
  Widget _buildInfoIcon(IconData icon, String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: Colors.grey[600]),
        const SizedBox(width: 4),
        Flexible(
          child: Text(
            text,
            style: TextStyle(fontSize: 12, color: Colors.grey[700]),
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[100],
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
                hintText: 'Cari nama unit...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: Colors.white, // Warna search bar diubah jadi putih
              ),
            ),
          ),
          Expanded(
            child: ListView.builder(
              controller: widget.scrollController,
              itemCount: _filteredUnits.length,
              padding: const EdgeInsets.fromLTRB(16.0, 8.0, 16.0, 0),
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

  Widget _buildUnitCardInModal(BuildContext context, BuildingProperty unit) {
    final String fullImageUrl =
        Imgurl.get('building_property/building_images/${_getUnitImage(unit)}');
    final theme = Theme.of(context);

    return InkWell(
      onTap: () {
        Get.toNamed(Routes.DETAIL_BUILDING, arguments: unit);
      },
      borderRadius: BorderRadius.circular(12),
      child: Card(
        color: Colors.white,
        elevation: 2,
        margin: const EdgeInsets.only(bottom: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Row(
          children: [
            // Gambar di Kiri
            ClipRRect(
              borderRadius:
                  const BorderRadius.horizontal(left: Radius.circular(12)),
              child: CachedNetworkImage(
                imageUrl: fullImageUrl,
                width: 100,
                height: 110,
                fit: BoxFit.cover,
                placeholder: (context, url) =>
                    Container(color: Colors.grey[200]),
                errorWidget: (context, url, error) => Container(
                  width: 100,
                  height: 110,
                  color: Colors.grey[200],
                  child: const Icon(Icons.apartment, color: Colors.grey),
                ),
              ),
            ),
            // Teks di Kanan
            Expanded(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
                // >> PERUBAHAN UTAMA DI SINI <<
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  // Ganti Spacer dengan MainAxisAlignment.spaceBetween
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // KELOMPOK ATAS: Nama & Status
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          unit.name,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Chip(
                          label: Text(
                            _getStatusText(unit.status),
                            style: TextStyle(
                              fontSize: 10,
                              color: theme.primaryColor,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          backgroundColor: theme.primaryColor.withOpacity(0.15),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                          materialTapTargetSize:
                              MaterialTapTargetSize.shrinkWrap,
                          visualDensity: VisualDensity.compact,
                          padding: const EdgeInsets.symmetric(horizontal: 8),
                          side: BorderSide.none,
                        ),
                      ],
                    ),

                    // KELOMPOK BAWAH: Harga & Info Ikon
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _formatCurrency(unit.price),
                          style: TextStyle(
                            fontSize: 15,
                            color: theme.primaryColor,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            Flexible(
                              child: _buildInfoIcon(Icons.inventory_2_outlined,
                                  '${unit.totalUnits ?? '-'} unit'),
                            ),
                            const SizedBox(width: 12),
                            Flexible(
                              child: _buildInfoIcon(Icons.square_foot_outlined,
                                  '${unit.buildingSize ?? '-'} m²'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
