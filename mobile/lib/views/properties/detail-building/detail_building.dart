import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/data/models/building_property/building_floor_plan.dart';
import 'package:mobile_nirwana/data/models/building_property/building_property.dart';
import 'package:mobile_nirwana/data/models/building_property/specification.dart';
import 'package:mobile_nirwana/views/layout_controller.dart';
import 'package:mobile_nirwana/views/properties/detail-building/detail_building_controller.dart';
import 'package:mobile_nirwana/views/properties/detail-building/widget/floor_plans_viewer.dart';
import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/views/properties/detail-building/widget/poker_image_slider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/views/properties/detail/widget/property_favorite_user_detail.dart';

class BuildingPropertyDetailPage extends StatefulWidget {
  final BuildingProperty building;
  const BuildingPropertyDetailPage({super.key, required this.building});

  @override
  State<BuildingPropertyDetailPage> createState() => _PropertyDetailPageState();
}

class _PropertyDetailPageState extends State<BuildingPropertyDetailPage>
    with SingleTickerProviderStateMixin {
  final BuildingPropertyDetailController _buildingDetailController =
      Get.put(BuildingPropertyDetailController());
  final LayoutController _layoutController = Get.find<LayoutController>();
  late TabController _tabController;
  bool _isMaterialExpanded = false;

  @override
  void initState() {
    super.initState();

    _tabController = TabController(length: 2, vsync: this);
    _tabController.addListener(() {
      setState(() {});
    });
    _buildingDetailController.building.value = widget.building;
  }

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFDBB837),
          brightness: Brightness.light,
          primary: const Color(0xFFDBB837),
        ),
        fontFamily: 'Inter',
        scaffoldBackgroundColor: const Color(0xFFFAFAFA),
        useMaterial3: true,
      ),
      child: Builder(
        builder: (context) {
          final theme = Theme.of(context);
          return AnnotatedRegion<SystemUiOverlayStyle>(
            value: const SystemUiOverlayStyle(
              statusBarBrightness: Brightness.dark,
              statusBarIconBrightness: Brightness.light,
            ),
            child: Scaffold(
              backgroundColor: const Color(0xFFFAFAFA),
              body: Obx(() {
                if (_buildingDetailController.isLoading.value) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (_buildingDetailController.errorMessage.value.isNotEmpty) {
                  return Center(
                    child: Text(
                        'Error: ${_buildingDetailController.errorMessage.value}'),
                  );
                }

                final building = _buildingDetailController.building.value;
                if (building == null) {
                  return const Center(child: Text('Properti tidak ditemukan.'));
                }
                return SafeArea(
                  top: false,
                  child: Stack(
                    children: [
                      CustomScrollView(
                        slivers: [
                          SliverAppBar(
                            expandedHeight: 350.0,
                            backgroundColor: Colors.white,
                            elevation: 0.5,
                            surfaceTintColor: Colors.white,
                            pinned: true,
                            title: CollapsingTitle(
                              title: building.name,
                            ),
                            centerTitle: false,
                            leading: SafeArea(
                              child: Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: CircleAvatar(
                                  backgroundColor:
                                      Colors.white.withOpacity(0.8),
                                  child: IconButton(
                                    icon: const Icon(Icons.arrow_back,
                                        color: Colors.black),
                                    onPressed: () => Navigator.pop(context),
                                  ),
                                ),
                              ),
                            ),
                            // actions: [
                            //   SafeArea(
                            //     child: Padding(
                            //       padding: const EdgeInsets.all(8.0),
                            //       child: FavoriteIcon(
                            //         propertyId: building.id,
                            //         isLoggedIn:
                            //             _layoutController.isLoggedIn.value,
                            //       ),
                            //     ),
                            //   ),
                            // ],
                            flexibleSpace: FlexibleSpaceBar(
                              background: PokerCardImageSlider(
                                images: building.images,
                              ),
                            ),
                          ),
                          SliverToBoxAdapter(
                            child: Column(
                              children: [
                                Stack(
                                  clipBehavior: Clip.none,
                                  children: [
                                    Container(
                                      margin: const EdgeInsets.only(
                                          top: 36.0, left: 24.0, right: 24.0),
                                      child: CustomPaint(
                                        painter: TicketPainter(),
                                        child: Container(
                                          padding: const EdgeInsets.fromLTRB(
                                              32.0, 16.0, 24.0, 0.0),
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              const SizedBox(height: 24.0),
                                              _buildHeader(building),
                                              const SizedBox(height: 16),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 24.0, vertical: 24.0),
                                  child: _buildSpecifications(building),
                                ),
                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 24.0),
                                  child: _buildDivider(),
                                ),
                              ],
                            ),
                          ),
                          SliverPersistentHeader(
                            delegate: _SliverTabBarDelegate(
                              TabBar(
                                controller: _tabController,
                                labelColor: theme.colorScheme.primary,
                                unselectedLabelColor: Colors.grey,
                                // Hapus 'indicatorColor', ganti dengan 'indicator'
                                indicator: UnderlineTabIndicator(
                                  borderSide: BorderSide(
                                    width: 2.0, // Atur ketebalan garis
                                    color: theme.colorScheme
                                        .primary, // Atur warna garis
                                  ),
                                  insets: EdgeInsets.symmetric(horizontal: 0.0),
                                ),
                                tabs: const [
                                  Tab(text: 'Rincian & Fasilitas'),
                                  Tab(text: 'Spesifikasi Teknis'),
                                ],
                              ),
                            ),
                            pinned: true,
                          ),
                          SliverToBoxAdapter(
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 24.0, vertical: 24.0),
                              child: _tabController.index == 0
                                  ? _buildRincianFasilitas(
                                      building.specifications!) // Konten tab 1
                                  : _buildMaterialTeknis(
                                      building.specifications!), // Konten tab 2
                            ),
                          ),
                          SliverToBoxAdapter(
                            child: Padding(
                              padding: const EdgeInsets.only(
                                left: 24.0,
                                right: 24.0,
                                bottom:
                                    100.0, // Tambahkan padding bottom untuk ruang button CTA
                              ),
                              child: Column(
                                children: [
                                  _buildFloorPlanSection(
                                      context, building.floorPlans),
                                  const SizedBox(height: 24),

                                  _buildDivider(),
                                  const SizedBox(height: 24),
                                  _buildDescription(
                                      theme, building.description),
                                  const SizedBox(height: 24),
                                  // Padding untuk Tombol CTA
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                      _buildCtaButton(theme, building),
                    ],
                  ),
                );
              }),
            ),
          );
        },
      ),
    );
  }

  // Ganti fungsi _buildHeader Anda dengan ini
  Widget _buildHeader(BuildingProperty building) {
    // Helper untuk format harga
    String _formatCurrency(double amount) {
      final formatter = NumberFormat.currency(
          locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0);
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

    // Helper untuk warna status
    Color _getStatusColor(BuildingStatus status) {
      switch (status) {
        case BuildingStatus.AVAILABLE:
          return const Color(0xFF10B981);
        case BuildingStatus.SOLD_OUT:
          return const Color(0xFFEF4444);
        case BuildingStatus.RESERVED:
          return const Color(0xFFF59E0B);
        default:
          return const Color(0xFF6B7280);
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Row untuk Status dan Nama
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: _getStatusColor(building.status).withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                _getStatusText(building.status),
                style: TextStyle(
                  color: _getStatusColor(building.status),
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        // Nama Building
        Text(
          building.name,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1F2937),
            height: 1.2,
          ),
        ),
        const SizedBox(height: 32),
        // Harga dengan Background Kuning
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: const Color(0xFFDBB837).withOpacity(0.15),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: const Color(0xFFDBB837).withOpacity(0.3),
              width: 1.5,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.payments_rounded,
                color: Color(0xFFDBB837),
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                '${_formatCurrency(building.price)} ',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFDBB837),
                ),
              ),
              Text(
                '/ ${building.price_unit}',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFFDBB837).withOpacity(0.8),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSpecifications(BuildingProperty building) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: _buildSpecItem(
              Icons.bed_outlined,
              building.specifications?.bedrooms?.toString() ?? '-',
              "Kamar Tidur"),
        ),
        Expanded(
          child: _buildSpecItem(
              Icons.bathtub_outlined,
              building.specifications?.bathrooms?.toString() ?? '-',
              "Kamar Mandi"),
        ),
        Expanded(
          child: _buildSpecItem(Icons.square_foot_outlined,
              "${building.buildingSize ?? '-'} m²", "Luas Bangunan"),
        ),
        Expanded(
          // <-- ITEM KEEMPAT DITAMBAHKAN
          child: _buildSpecItem(Icons.landscape_outlined,
              "${building.landSize ?? '-'} m²", "Luas Tanah"),
        ),
      ],
    );
  }

  Widget _buildSpecItem(IconData icon, String value, String label) {
    return Column(
      children: [
        Icon(icon, color: const Color(0xFF6B7280), size: 28),
        const SizedBox(height: 8),
        Text(value,
            textAlign: TextAlign.center,
            style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1F2937))),
        const SizedBox(height: 4),
        Text(label,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
      ],
    );
  }

  Widget _buildSpecRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 15, color: Color(0xFF6B7280)),
          ),
          Text(
            value,
            style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1F2937)),
          ),
        ],
      ),
    );
  }

  Widget _buildRincianFasilitas(Specifications specs) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Fasilitas & Ruangan",
          style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1F2937)),
        ),
        const SizedBox(height: 8),
        _buildSpecRow("Ruang Keluarga", specs.familyRoom?.toString() ?? '-'),
        _buildSpecRow("Dapur", specs.kitchen?.toString() ?? '-'),
        _buildSpecRow("Garasi", specs.garage?.toString() ?? '-'),
        _buildSpecRow("Jumlah Lantai", specs.floors?.toString() ?? '-'),
      ],
    );
  }

  Widget _buildMaterialTeknis(Specifications? specs) {
    if (specs == null) return const Text("Data material tidak tersedia.");

    final allSpecItems = <Widget>[
      _buildSpecRow("Struktur", specs.structure ?? '-'),
      _buildSpecRow("Lantai", specs.floor ?? '-'),
      _buildSpecRow("Dinding", specs.walls ?? '-'),
      _buildSpecRow("Atap", specs.roof ?? '-'),
      _buildSpecRow("Pintu", specs.doors ?? '-'),
      _buildSpecRow("Jendela", specs.windows ?? '-'),
      _buildSpecRow("Listrik", specs.electricity ?? '-'),
      _buildSpecRow("Sumber Air", specs.waterSource ?? '-'),
      _buildSpecRow("Internet", specs.internet ?? '-'),
      _buildSpecRow("Keamanan", specs.security ?? '-'),
      _buildSpecRow("Fasilitas Lain", specs.facilities ?? '-'),
    ];

    final displayedItems =
        _isMaterialExpanded ? allSpecItems : allSpecItems.take(4).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Material & Teknis",
          style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1F2937)),
        ),
        const SizedBox(height: 8),
        AnimatedSize(
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
          child: Column(
            children: displayedItems,
          ),
        ),
        if (allSpecItems.length > 4)
          Align(
            alignment: Alignment.center,
            child: Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: TextButton(
                onPressed: () {
                  setState(() {
                    _isMaterialExpanded = !_isMaterialExpanded;
                  });
                },
                style: TextButton.styleFrom(
                  foregroundColor: const Color(0xFFDBB837),
                ),
                child: Text(
                  _isMaterialExpanded
                      ? 'Lihat Lebih Sedikit'
                      : 'Lihat Selengkapnya...',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildDivider() {
    return Divider(color: Colors.grey[300], thickness: 1);
  }

  Widget _buildDescription(ThemeData theme, String? description) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Deskripsi",
          style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1F2937)),
        ),
        const SizedBox(height: 8),
        Text(
          description ?? "Deskripsi tidak tersedia.",
          style: const TextStyle(
              fontSize: 15, color: Color(0xFF6B7280), height: 1.5),
        ),
      ],
    );
  }

  Widget _buildCtaButton(ThemeData theme, BuildingProperty building) {
    return Align(
      alignment: Alignment.bottomCenter,
      child: SafeArea(
        // FIX: Bungkus dengan SafeArea
        child: Container(
          padding: const EdgeInsets.fromLTRB(
              24, 16, 24, 16), // FIX: Beri padding bawah
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 20,
                offset: const Offset(0, -10),
              )
            ],
          ),
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: theme.colorScheme.primary,
              foregroundColor: Colors.white,
              minimumSize: const Size(double.infinity, 50),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () {
              if (_layoutController.isLoggedIn.value) {
                Get.toNamed(
                  Routes.SIMULATION_KPR,
                  arguments: building.id,
                );
              } else {
                Get.toNamed(Routes.LOGIN);
              }
            },
            child: const Text("Simulasi KPR",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ),
        ),
      ),
    );
  }

  Widget _buildFloorPlanSection(
      BuildContext context, List<BuildingFloorPlan> floorPlans) {
    if (floorPlans.isEmpty) {
      return const SizedBox.shrink();
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Denah Rumah",
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1F2937)),
              ),
              if (floorPlans.length > 1)
                Text(
                  "${floorPlans.length} Denah",
                  style:
                      const TextStyle(fontSize: 14, color: Color(0xFF6B7280)),
                ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 150,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            scrollDirection: Axis.horizontal,
            itemCount: floorPlans.length,
            separatorBuilder: (context, index) => const SizedBox(width: 16),
            itemBuilder: (context, index) {
              final floorPlan = floorPlans[index];
              final String fullUrl = Imgurl.get(
                  'building_property/building_floor_plans/${floorPlan.file_url}');

              return GestureDetector(
                onTap: () {
                  final List<String> imageUrls = floorPlans
                      .map((fp) => Imgurl.get(
                          'building_property/building_floor_plans/${fp.file_url}'))
                      .toList();
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => FloorPlansViewerPage(
                        floorPlansImages: imageUrls,
                        initialIndex: index,
                      ),
                    ),
                  );
                },
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: CachedNetworkImage(
                    imageUrl: fullUrl,
                    fit: BoxFit.cover,
                    width: 200,
                    placeholder: (context, url) => Container(
                      width: 200,
                      color: Colors.grey[300],
                      child: const Center(child: CircularProgressIndicator()),
                    ),
                    errorWidget: (context, url, error) => Container(
                      width: 200,
                      color: Colors.grey[300],
                      child: const Icon(Icons.broken_image_outlined,
                          color: Colors.grey, size: 48),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class CollapsingTitle extends StatelessWidget {
  final String title;
  const CollapsingTitle({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    final settings =
        context.dependOnInheritedWidgetOfExactType<FlexibleSpaceBarSettings>();
    if (settings == null) {
      return const SizedBox.shrink();
    }

    final delta = settings.maxExtent - settings.minExtent;
    final progress =
        (1.0 - (settings.currentExtent - settings.minExtent) / delta)
            .clamp(0.0, 1.0);

    const threshold = 0.9;
    double newOpacity = 0.0;
    if (progress > threshold) {
      newOpacity = (progress - threshold) / (1 - threshold);
    }

    return Opacity(
      opacity: newOpacity.clamp(0.0, 1.0),
      child: Text(
        title,
        style: const TextStyle(
          color: Colors.black,
          fontSize: 16.0,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}

class _SliverTabBarDelegate extends SliverPersistentHeaderDelegate {
  _SliverTabBarDelegate(this._tabBar);

  final TabBar _tabBar;

  @override
  double get minExtent => _tabBar.preferredSize.height;
  @override
  double get maxExtent => _tabBar.preferredSize.height;

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: const Color(0xFFFAFAFA),
      width: 1.0, // Samakan dengan scaffoldBackgroundColor
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: _tabBar,
      ),
    );
  }

  @override
  bool shouldRebuild(_SliverTabBarDelegate oldDelegate) {
    return false;
  }
}

class TicketPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    final path = Path();

    // Radius untuk sudut dan lekukan
    const radius = 16.0;
    const notchRadius = 10.0;
    const notchPosition = 0.60; // Posisi lekukan di 65% dari tinggi

    // Mulai dari kiri atas
    path.moveTo(radius, 0);

    // Garis atas
    path.lineTo(size.width - radius, 0);
    path.arcToPoint(
      Offset(size.width, radius),
      radius: const Radius.circular(radius),
    );

    // Sisi kanan dengan lekukan
    final notchY = size.height * notchPosition;
    path.lineTo(size.width, notchY - notchRadius);
    path.arcToPoint(
      Offset(size.width, notchY + notchRadius),
      radius: const Radius.circular(notchRadius),
      clockwise: false,
    );

    // Lanjut ke bawah kanan
    path.lineTo(size.width, size.height - radius);
    path.arcToPoint(
      Offset(size.width - radius, size.height),
      radius: const Radius.circular(radius),
    );

    // Garis bawah
    path.lineTo(radius, size.height);
    path.arcToPoint(
      Offset(0, size.height - radius),
      radius: const Radius.circular(radius),
    );

    // Sisi kiri dengan lekukan
    path.lineTo(0, notchY + notchRadius);
    path.arcToPoint(
      Offset(0, notchY - notchRadius),
      radius: const Radius.circular(notchRadius),
      clockwise: false,
    );

    // Kembali ke atas kiri
    path.lineTo(0, radius);
    path.arcToPoint(
      Offset(radius, 0),
      radius: const Radius.circular(radius),
    );

    path.close();

    // Gambar shadow
    canvas.drawShadow(path, Colors.black.withOpacity(0.1), 8, false);

    // Gambar shape
    canvas.drawPath(path, paint);

    // Gambar garis putus-putus di tengah
    final dashPaint = Paint()
      ..color = Colors.grey.withOpacity(0.3)
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;

    const dashWidth = 5.0;
    const dashSpace = 5.0;
    double startX = 20.0;

    while (startX < size.width - 20) {
      canvas.drawLine(
        Offset(startX, notchY),
        Offset(startX + dashWidth, notchY),
        dashPaint,
      );
      startX += dashWidth + dashSpace;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
