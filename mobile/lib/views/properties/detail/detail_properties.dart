import 'package:flutter/material.dart';
import 'package:mobile_nirwana/data/models/agent.dart';
import 'package:mobile_nirwana/data/models/developer.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/data/models/property/property_floor_plan.dart';
// Ganti dengan path yang benar ke file api.dart Anda
import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/data/models/property/specification.dart';
import 'package:mobile_nirwana/views/properties/detail/detail_properties_controller.dart';
import 'package:mobile_nirwana/views/properties/detail/floor_plan_viewer_page.dart';
import 'package:mobile_nirwana/views/properties/detail/poker_image_slider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:url_launcher/url_launcher.dart';

class PropertyDetailPage extends StatefulWidget {
  const PropertyDetailPage({super.key});

  @override
  State<PropertyDetailPage> createState() => _PropertyDetailPageState();
}

class _PropertyDetailPageState extends State<PropertyDetailPage> {
  final PropertyDetailController _propertyDetailController =
      Get.put(PropertyDetailController());

  @override
  void initState() {
    super.initState();
    if (Get.arguments != null && Get.arguments is String) {
      final String id = Get.arguments;
      _propertyDetailController.fetchDetail(id);
    } else {
      _propertyDetailController.errorMessage.value = "ID properti tidak valid.";
      _propertyDetailController.isLoading.value = false;
    }
  }

  String _formatPrice(double price) {
    if (price >= 1000000000) {
      return 'Rp ${(price / 1000000000).toStringAsFixed(1)}M';
    }
    if (price >= 1000000) {
      return 'Rp ${(price / 1000000).toStringAsFixed(1)}JT';
    }
    return 'Rp ${price.toStringAsFixed(0)}';
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

                return Stack(
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
                                backgroundColor: Colors.white.withOpacity(0.8),
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
                                child: CircleAvatar(
                                  backgroundColor:
                                      Colors.white.withOpacity(0.8),
                                  child: IconButton(
                                    icon: const Icon(Icons.favorite_border,
                                        color: Colors.black),
                                    onPressed: () {},
                                  ),
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
                        SliverList(
                          delegate: SliverChildListDelegate(
                            [
                              Container(
                                margin: const EdgeInsets.only(top: 24.0),
                                child: Container(
                                  margin: const EdgeInsets.symmetric(
                                      horizontal: 24.0),
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 24.0, vertical: 20.0),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(16.0),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.05),
                                        blurRadius: 20,
                                        offset: const Offset(0, 4),
                                      ),
                                    ],
                                  ),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      _buildHeader(
                                          property.name,
                                          _formatPrice(property.price),
                                          "/${property.price_unit}",
                                          theme),
                                      const SizedBox(height: 16),
                                      Divider(color: Colors.grey[200]),
                                      const SizedBox(height: 16),
                                      _buildAddress(
                                          "${property.address?.street ?? ''}, ${property.address?.village ?? ''}, ${property.address?.district ?? ''}, ${property.address?.city ?? ''}, ${property.address?.province ?? ''}"),
                                    ],
                                  ),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 24.0, vertical: 24.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    _buildSpecifications(property),
                                    const SizedBox(height: 24),
                                    _buildDivider(), // Beri pemisah
                                    const SizedBox(height: 24),

                                    // PANGGIL WIDGET BARU DI SINI
                                    if (property.specifications != null)
                                      _buildDetailedSpecifications(
                                          property.specifications!),
                                    const SizedBox(height: 24),
                                    _buildFloorPlanSection(
                                        context, property.floorPlans),
                                    const SizedBox(height: 24),
                                    if (property.agent != null) ...[
                                      _buildAgentCard(theme, property.agent!),
                                      const SizedBox(height: 24),
                                    ],
                                    _buildDivider(),
                                    const SizedBox(height: 24),
                                    _buildDescription(
                                        theme, property.description),
                                    const SizedBox(height: 24),
                                    if (property.developer != null)
                                      _buildDeveloperInfo(property.developer!),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 120),
                            ],
                          ),
                        ),
                      ],
                    ),
                    if (property.agent != null)
                      _buildCtaButton(theme, property.agent!),
                  ],
                );
              }),
            ),
          );
        },
      ),
    );
  }

  // --- WIDGET PEMBANTU ---

  Widget _buildHeader(String name, String price, String unit, ThemeData theme) {
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
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              price,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: theme.colorScheme.primary,
              ),
            ),
            Text(
              unit,
              style: const TextStyle(
                fontSize: 12,
                color: Color(0xFF6B7280),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildAddress(String address) {
    return Row(
      children: [
        const Icon(
          Icons.location_on_outlined,
          color: Color(0xFF6B7280),
          size: 16,
        ),
        const SizedBox(width: 4),
        Expanded(
          child: Text(
            address,
            style: const TextStyle(
              fontSize: 12,
              color: Color(0xFF6B7280),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSpecifications(Property property) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: _buildSpecItem(
              Icons.bed_outlined,
              property.specifications?.bedrooms?.toString() ?? '-',
              "Kamar Tidur"),
        ),
        Expanded(
          child: _buildSpecItem(
              Icons.bathtub_outlined,
              property.specifications?.bathrooms?.toString() ?? '-',
              "Kamar Mandi"),
        ),
        Expanded(
          child: _buildSpecItem(Icons.square_foot_outlined,
              "${property.buildingSize ?? '-'} m²", "Luas Bangunan"),
        ),
        Expanded(
          // <-- ITEM KEEMPAT DITAMBAHKAN
          child: _buildSpecItem(Icons.landscape_outlined,
              "${property.landSize ?? '-'} m²", "Luas Tanah"),
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

  Widget _buildDetailedSpecifications(Specifications specs) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Rincian Properti",
          style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1F2937)),
        ),
        const SizedBox(height: 8),

        // Kategori Ruangan & Fasilitas
        _buildSpecRow("Ruang Keluarga", specs.familyRoom?.toString() ?? '-'),
        _buildSpecRow("Dapur", specs.kitchen?.toString() ?? '-'),
        _buildSpecRow("Garasi", specs.garage?.toString() ?? '-'),
        _buildSpecRow("Jumlah Lantai", specs.floors?.toString() ?? '-'),
        const SizedBox(height: 12),
        Divider(color: Colors.grey[200]),
        const SizedBox(height: 12),

        // Kategori Material & Teknis
        const Text(
          "Material & Teknis",
          style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1F2937)),
        ),
        const SizedBox(height: 8),
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

  Widget _buildCtaButton(ThemeData theme, Agent agent) {
    return Align(
      alignment: Alignment.bottomCenter,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
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
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          onPressed: () => _showAgentContactOptions(
              context, agent.phone_number, agent.email),
          child: const Text("Hubungi Agen",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        ),
      ),
    );
  }

  Widget _buildFloorPlanSection(
      BuildContext context, List<PropertyFloorPlan> floorPlans) {
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
                  'property/property_floor_plans/${floorPlan.file_url}');

              return GestureDetector(
                onTap: () {
                  final List<String> imageUrls = floorPlans
                      .map((fp) => Imgurl.get(
                          'property/property_floor_plans/${fp.file_url}'))
                      .toList();
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => FloorPlanViewerPage(
                        floorPlanImages: imageUrls,
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
                    "Dikembangkan oleh",
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
    showModalBottomSheet(
      context: context,
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
              ListTile(
                // <-- Hapus 'const'
                leading: const Icon(Icons.call_outlined),
                // Ganti Text statis menjadi dinamis
                title: Text("$phone"),
                onTap: () async {
                  final url = Uri.parse('tel:$phone');
                  if (await canLaunchUrl(url)) {
                    await launchUrl(url);
                  }
                  Navigator.pop(context);
                },
              ),
              ListTile(
                // <-- Hapus 'const'
                leading: const Icon(Icons.email_outlined),
                // Ganti Text statis menjadi dinamis
                title: Text("$email"),
                onTap: () async {
                  final url = Uri.parse('mailto:$email');
                  if (await canLaunchUrl(url)) {
                    await launchUrl(url);
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
