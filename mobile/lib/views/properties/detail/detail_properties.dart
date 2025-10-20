import 'package:flutter/material.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/data/models/agent.dart';
import 'package:mobile_nirwana/data/models/building_property/building_property.dart';
import 'package:mobile_nirwana/data/models/developer.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/data/models/property/property_site_plan.dart';
import 'package:mobile_nirwana/views/layout_controller.dart';
import 'package:mobile_nirwana/views/properties/detail/widget/all_units_bottom_sheet.dart';
import 'package:mobile_nirwana/views/properties/detail/widget/animated_category_chip.dart';
import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/views/properties/detail/detail_properties_controller.dart';
import 'package:mobile_nirwana/views/properties/detail/floor_plan_viewer_page.dart';
import 'package:mobile_nirwana/views/properties/detail/poker_image_slider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/views/properties/detail/widget/property_favorite_user_detail.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:intl/intl.dart';

class PropertyDetailPage extends StatefulWidget {
  final Property property;
  const PropertyDetailPage({super.key, required this.property});

  @override
  State<PropertyDetailPage> createState() => _PropertyDetailPageState();
}

class _PropertyDetailPageState extends State<PropertyDetailPage> {
  final PropertyDetailController _propertyDetailController =
      Get.put(PropertyDetailController());
  final LayoutController _layoutController = Get.find<LayoutController>();

  bool _isDescriptionExpanded = false; // Untuk melacak status expand/collapse
  bool _isDescriptionLong = false;
  @override
  void initState() {
    super.initState();

    _propertyDetailController.property.value = widget.property;
    const int maxLength = 200; // Atur batas karakter

    if ((widget.property.detailDescription?.length ?? 0) > maxLength) {
      setState(() {
        _isDescriptionLong = true;
      });
    }
  }

  String _formatPhoneNumberForWhatsApp(String phone) {
    String digitsOnly = phone.replaceAll(RegExp(r'\D'), '');
    if (digitsOnly.startsWith('0')) {
      return '62${digitsOnly.substring(1)}';
    }
    if (digitsOnly.startsWith('62')) {
      return digitsOnly;
    }
    return digitsOnly;
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

  String _getStatusText(BuildingStatus status) {
    switch (status) {
      case BuildingStatus.AVAILABLE:
        return 'Tersedia';
      case BuildingStatus.SOLD_OUT:
        return 'Terjual';
      case BuildingStatus.RESERVED:
        return 'Dipesan';
      case BuildingStatus.PRE_LAUNCH:
        return 'Segera Hadir';
      default:
        return 'Tersedia';
    }
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
                if (_propertyDetailController.isLoading.value) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (_propertyDetailController.errorMessage.value.isNotEmpty) {
                  return Center(
                    child: Text(
                        'Error: ${_propertyDetailController.errorMessage.value}'),
                  );
                }

                final property = _propertyDetailController.property.value;
                if (property == null) {
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
                              title: property.name,
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
                            actions: [
                              SafeArea(
                                child: Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: FavoriteIcon(
                                    propertyId: property.id,
                                    isLoggedIn:
                                        _layoutController.isLoggedIn.value,
                                  ),
                                ),
                              ),
                            ],
                            flexibleSpace: FlexibleSpaceBar(
                              background: PokerCardImageSlider(
                                images: property.images,
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
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 24.0, vertical: 20.0),
                                        decoration: BoxDecoration(
                                          color: Colors.white,
                                          borderRadius:
                                              BorderRadius.circular(16.0),
                                          boxShadow: [
                                            BoxShadow(
                                              color: Colors.black
                                                  .withOpacity(0.05),
                                              blurRadius: 20,
                                              offset: const Offset(0, 4),
                                            ),
                                          ],
                                        ),
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            const SizedBox(height: 24.0),
                                            _buildHeader(property.name),
                                            const SizedBox(height: 16),
                                            Divider(color: Colors.grey[200]),
                                            const SizedBox(height: 16),
                                            _buildAddress(property),
                                          ],
                                        ),
                                      ),
                                    ),
                                    Positioned(
                                      top: 10,
                                      left: 40,
                                      child: AnimatedCategoryChip(
                                          categoryType: property.type),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 24),
                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 24.0),
                                  child: _buildDivider(),
                                ),
                              ],
                            ),
                          ),
                          SliverToBoxAdapter(
                            child: Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 24.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _buildSitePlanSection(
                                      context, property.sitePlans),
                                  const SizedBox(height: 24),
                                  if (property.agent != null) ...[
                                    _buildAgentCard(theme, property.agent!),
                                    const SizedBox(height: 24),
                                  ],
                                  _buildDivider(),
                                  const SizedBox(height: 24),
                                  _buildDescription(
                                      theme, property.detailDescription),
                                  const SizedBox(height: 24),
                                  if (property.developer != null)
                                    _buildDeveloperInfo(property.developer!),
                                  const SizedBox(height: 24),

                                  Obx(() => _buildBuildingPropertyListSection(
                                        context,
                                        _propertyDetailController
                                            .buildingProperty,
                                      )),

                                  const SizedBox(
                                      height: 120), // Padding untuk Tombol CTA
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
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

  Widget _buildHeader(String name) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Text(
            name,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1F2937),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildBuildingPropertyListSection(
      BuildContext context, List<BuildingProperty> displayedBuildings) {
    final allBuildings =
        _propertyDetailController.property.value?.building_property ?? [];

    if (allBuildings.isEmpty) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildSectionTitle("Daftar Unit"),
            if (allBuildings.length > 3)
              TextButton(
                onPressed: () {
                  _showAllUnitsModal(context, allBuildings);
                },
                child: const Text("Lihat Semua"),
                style: TextButton.styleFrom(
                  padding: EdgeInsets.zero,
                  alignment: Alignment.centerRight,
                ),
              ),
          ],
        ),
        ListView.separated(
          physics: const NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          itemCount: displayedBuildings.length,
          itemBuilder: (context, index) {
            final building = displayedBuildings[index];
            return _buildBuildingPropertyCard(context, building);
          },
          separatorBuilder: (context, index) => const SizedBox(height: 16),
        ),
      ],
    );
  }

  void _showAllUnitsModal(
      BuildContext context, List<BuildingProperty> allUnits) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true, // agar modal bisa lebih dari setengah layar
      backgroundColor: Colors.transparent,
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.6, // Tinggi awal modal (60% layar)
          minChildSize: 0.3, // Tinggi minimum saat ditarik ke bawah
          maxChildSize: 0.95, // Tinggi maksimum saat ditarik ke atas
          builder: (_, scrollController) {
            // Kita akan buat widget AllUnitsBottomSheet di langkah berikutnya
            return AllUnitsBottomSheet(
              scrollController: scrollController,
              allUnits: allUnits,
            );
          },
        );
      },
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.bold,
        color: Color(0xFF1F2937),
      ),
    );
  }

  Widget _buildBuildingPropertyCard(
      BuildContext context, BuildingProperty building) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 12.0, horizontal: 8.0),
          child: InkWell(
            onTap: () {
              Get.toNamed(
                Routes.DETAIL_BUILDING,
                arguments: building,
              );
            },
            borderRadius: BorderRadius.circular(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // BAGIAN KIRI: INFO TEXT
                Expanded(
                  flex: 3,
                  child: Padding(
                    padding: const EdgeInsets.only(right: 16, top: 4),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Nama Unit (Judul) - di atas
                        Text(
                          building.name.toUpperCase(),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1F2937),
                            letterSpacing: 0.3,
                          ),
                        ),

                        const SizedBox(height: 12),

                        // Deskripsi singkat
                        Text(
                          '${building.totalUnits ?? '-'} unit, ${building.landSize ?? '-'} m²',
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                            height: 1.4,
                          ),
                        ),

                        const SizedBox(height: 16),

                        // Harga - di bawah
                        Text(
                          _formatCurrency(building.price),
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1F2937),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // BAGIAN KANAN: GAMBAR + STATUS
                Expanded(
                  flex: 2,
                  child: Stack(
                    clipBehavior: Clip.none,
                    children: [
                      // GAMBAR dengan shadow dan rounded corner
                      Container(
                        height: 140,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(20.0),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.15),
                              blurRadius: 10,
                              spreadRadius: 0,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(16.0),
                          child: Image.network(
                            _getPropertyImage(building),
                            height: 140,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      Colors.grey[300]!,
                                      Colors.grey[100]!
                                    ],
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                  ),
                                ),
                                child: const Center(
                                  child: Icon(
                                    Icons.image_not_supported_outlined,
                                    color: Colors.grey,
                                    size: 40,
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ),

                      // PILL STATUS - overlay di bawah gambar, sedikit keluar
                      Positioned(
                        bottom: -8,
                        left: 0,
                        right: 0,
                        child: Center(
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(30),
                              border: Border.all(
                                color: const Color(0xFFDBB837), // Warna hijau
                                width: 1,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.12),
                                  blurRadius: 10,
                                  offset: const Offset(0, 3),
                                )
                              ],
                            ),
                            child: Text(
                              _getStatusText(building.status),
                              style: const TextStyle(
                                color: Color(0xFFDBB837), // Warna hijau
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        // GARIS PUTUS-PUTUS DIVIDER
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: CustomPaint(
            size: const Size(double.infinity, 1),
            painter: DashedLinePainter(),
          ),
        ),
      ],
    );
  }

  Widget _buildAddress(Property property) {
    final String addressText =
        "${property.address?.street ?? ''}, ${property.address?.village ?? ''}, ${property.address?.district ?? ''}, ${property.address?.city ?? ''}, ${property.address?.province ?? ''}";

    double? lat;
    double? lng;

    if (property.location != null &&
        property.location!.coordinates.length >= 2) {
      lng = property.location!.coordinates[0];
      lat = property.location!.coordinates[1];
    }

    final bool isTappable = lat != null && lng != null;
    final theme = const Color(0xFFDBB837);

    return Container(
      decoration: BoxDecoration(
        color: isTappable ? theme.withOpacity(0.08) : Colors.transparent,
        borderRadius: BorderRadius.circular(12.0),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(12.0),
          onTap: isTappable
              ? () async {
                  final Uri url = Uri.parse(
                      'https://www.google.com/maps/search/?api=1&query=$lat,$lng');

                  if (await canLaunchUrl(url)) {
                    await launchUrl(url, mode: LaunchMode.externalApplication);
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text('Tidak dapat membuka Google Maps.')),
                    );
                  }
                }
              : null,
          child: Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 12.0, vertical: 10.0),
            child: Row(
              children: [
                Icon(
                  Icons.location_on_outlined,
                  color: isTappable ? theme : const Color(0xFF6B7280),
                  size: 20,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    addressText,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: isTappable ? theme : const Color(0xFF6B7280),
                    ),
                  ),
                ),
                if (isTappable) ...[
                  const SizedBox(width: 8),
                  Icon(Icons.open_in_new, color: theme, size: 16),
                ]
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Divider(color: Colors.grey[300], thickness: 1);
  }

  // detail_building_page.dart

  Widget _buildDescription(ThemeData theme, String? detailDescription) {
    const int maxLength = 200;

    final String descriptionToShow =
        detailDescription ?? "Deskripsi tidak tersedia.";

    final String displayedText = _isDescriptionLong && !_isDescriptionExpanded
        ? '${descriptionToShow.substring(0, maxLength)}...'
        : descriptionToShow;

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

        // >> PERUBAHAN UTAMA DI SINI <<
        // Ganti widget Text biasa dengan Text.rich
        Text.rich(
          TextSpan(
            // Pecah teks berdasarkan karakter baris baru ('\n')
            children: displayedText.split('\n').map((paragraph) {
              // Ubah setiap potongan menjadi TextSpan dan tambahkan spasi paragraf
              return TextSpan(
                text:
                    '$paragraph\n\n', // Tambahkan '\n\n' untuk spasi antar paragraf
                style: const TextStyle(
                  fontSize: 15,
                  color: Color(0xFF6B7280),
                  height: 1.5,
                ),
              );
            }).toList(),
          ),
          textAlign: TextAlign.justify,
        ),

        // Tombol "Lihat Selengkapnya" (tidak ada perubahan)
        if (_isDescriptionLong)
          Padding(
            padding: const EdgeInsets.only(top: 8.0),
            child: GestureDetector(
              onTap: () {
                setState(() {
                  _isDescriptionExpanded = !_isDescriptionExpanded;
                });
              },
              child: Text(
                _isDescriptionExpanded
                    ? 'Lihat Lebih Sedikit'
                    : 'Lihat Selengkapnya',
                style: TextStyle(
                  color: theme.primaryColor,
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildSitePlanSection(
      BuildContext context, List<PropertySitePlan> sitePlans) {
    if (sitePlans.isEmpty) {
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
                "Site Plans",
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1F2937)),
              ),
              if (sitePlans.length > 1)
                Text(
                  "${sitePlans.length} Denah",
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
            itemCount: sitePlans.length,
            separatorBuilder: (context, index) => const SizedBox(width: 16),
            itemBuilder: (context, index) {
              final sitePlan = sitePlans[index];
              final String fullUrl = Imgurl.get(
                  'property/property_site_plans/${sitePlan.file_url}');

              return GestureDetector(
                onTap: () {
                  final List<String> imageUrls = sitePlans
                      .map((fp) => Imgurl.get(
                          'property/property_site_plans/${fp.file_url}'))
                      .toList();
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => SitePlanViewerPage(
                        sitePlanImages: imageUrls,
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

  Widget _buildAgentCard(ThemeData theme, Agent agent) {
    final String fullAvatarUrl = Imgurl.get('agent/${agent.avatar_url}');

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 30,
            backgroundColor: Colors.grey[200],
            child: CachedNetworkImage(
              imageUrl: fullAvatarUrl,
              imageBuilder: (context, imageProvider) => Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  image: DecorationImage(
                    image: imageProvider,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              placeholder: (context, url) =>
                  const Center(child: CircularProgressIndicator()),
              errorWidget: (context, url, error) => const Icon(
                Icons.person,
                size: 30,
                color: Colors.grey,
              ),
            ),
          ),
          const SizedBox(width: 16),
          Flexible(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  agent.full_name,
                  style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1F2937)),
                ),
                const SizedBox(height: 4),
                const Text(
                  "Agent",
                  style: TextStyle(fontSize: 14, color: Color(0xFF6B7280)),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          ElevatedButton(
            onPressed: () => _showAgentContactOptions(
                context, agent.phone_number, agent.email),
            style: ElevatedButton.styleFrom(
              backgroundColor: theme.colorScheme.primary.withOpacity(0.1),
              foregroundColor: theme.colorScheme.primary,
              elevation: 0,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text("Hubungi"),
          ),
        ],
      ),
    );
  }

  Widget _buildDeveloperInfo(Developer developer) {
    final String fullLogoUrl = Imgurl.get('developer/${developer.logo_url}');

    return InkWell(
      onTap: () async {
        final url = Uri.parse(developer.website_url ?? '');
        if (await canLaunchUrl(url)) {
          await launchUrl(url, mode: LaunchMode.externalApplication);
        }
      },
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        child: Row(
          children: [
            Image.network(
              fullLogoUrl,
              width: 40,
              height: 40,
              errorBuilder: (context, error, stackTrace) =>
                  const Icon(Icons.business, size: 40),
            ),
            const SizedBox(width: 12),
            Flexible(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Properti ini dibuat oleh",
                    style: TextStyle(fontSize: 14, color: Color(0xFF6B7280)),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    developer.name,
                    style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1F2937)),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: Color(0xFF6B7280)),
          ],
        ),
      ),
    );
  }

  void _showAgentContactOptions(
      BuildContext context, String phone, String email) {
    final propertyName =
        _propertyDetailController.property.value?.name ?? 'Properti';

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                "Pilih Opsi Kontak",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 24),

              // LIST TILE WHATSAPP
              ListTile(
                leading: const Icon(Icons.chat_bubble_outline_rounded),
                title: Text(phone),
                subtitle: const Text("WhatsApp"),
                onTap: () async {
                  final String whatsappNumber =
                      _formatPhoneNumberForWhatsApp(phone);
                  final url = Uri.parse('https://wa.me/$whatsappNumber');

                  if (await canLaunchUrl(url)) {
                    await launchUrl(url, mode: LaunchMode.externalApplication);
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text('Tidak dapat membuka WhatsApp.')),
                    );
                  }
                  Navigator.pop(context);
                },
              ),

              // LIST TILE  EMAIL
              ListTile(
                leading: const Icon(Icons.email_outlined),
                title: Text(email),
                subtitle: const Text("Email"),
                onTap: () async {
                  final String subject = Uri.encodeComponent(
                      "Pertanyaan Mengenai Properti: $propertyName");
                  final String body = Uri.encodeComponent(
                      "Halo, saya tertarik dengan properti '$propertyName'. Mohon informasinya.");

                  final url =
                      Uri.parse('mailto:$email?subject=$subject&body=$body');

                  if (await canLaunchUrl(url)) {
                    await launchUrl(url, mode: LaunchMode.externalApplication);
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text('Tidak dapat membuka aplikasi email.')),
                    );
                  }
                  Navigator.pop(context);
                },
              ),
              const SizedBox(height: 16),
            ],
          ),
        );
      },
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

String _getPropertyImage(BuildingProperty building) {
  if (building.images.isNotEmpty && building.images[0].image_url != null) {
    return building.images[0].image_url!;
  }
  return "";
}

class DashedLinePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.grey[300]!
      ..strokeWidth = 1
      ..style = PaintingStyle.stroke;

    const dashWidth = 5.0;
    const dashSpace = 5.0;
    double startX = 0;

    while (startX < size.width) {
      canvas.drawLine(
        Offset(startX, 0),
        Offset(startX + dashWidth, 0),
        paint,
      );
      startX += dashWidth + dashSpace;
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}
