import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'package:mobile_nirwana/views/properties/detail/floor_plan_viewer_page.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/services.dart';

// --- DATA MODEL SEMENTARA (Ganti dengan model 'Property' Anda nanti) ---
class PropertyImage {
  final int id;
  final String url;
  PropertyImage(this.id, this.url);
}

// --- WIDGET UTAMA HALAMAN DETAIL ---

class PropertyDetailPage extends StatefulWidget {
  const PropertyDetailPage({super.key});
  // Nantinya Anda akan menerima data properti di sini, contoh:
  // final Property property;
  // const PropertyDetailPage({super.key, required this.property});

  @override
  State<PropertyDetailPage> createState() => _PropertyDetailPageState();
}

class _PropertyDetailPageState extends State<PropertyDetailPage> {
  // Data gambar placeholder. Ganti dengan gambar dari properti Anda.
  final List<PropertyImage> _images = [
    PropertyImage(1,
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80'),
    PropertyImage(2,
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'),
    PropertyImage(3,
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'),
    PropertyImage(4,
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'),
  ];

  final List<String> _floorPlans = [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  ];

  @override
  Widget build(BuildContext context) {
    // --- TAMBAHKAN WIDGET THEME DI SINI ---
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
      // Builder diperlukan agar context yang digunakan di dalam Scaffold
      // sudah mengandung informasi Theme yang baru.
      child: Builder(
        builder: (context) {
          // Ambil theme dari context yang baru
          final theme = Theme.of(context);

          return AnnotatedRegion<SystemUiOverlayStyle>(
            // Terapkan style dengan ikon terang (putih)
            value: const SystemUiOverlayStyle(
              statusBarBrightness: Brightness.dark, // Untuk iOS
              statusBarIconBrightness: Brightness.light, // Untuk Android
            ),
            child: Scaffold(
              backgroundColor: const Color(0xFFFAFAFA),
              body: Stack(
                children: [
                  CustomScrollView(
                    slivers: [
                      SliverAppBar(
                        expandedHeight: 350.0,
                        backgroundColor: Colors.transparent,
                        elevation: 0,
                        pinned: true,
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
                                backgroundColor: Colors.white.withOpacity(0.8),
                                child: IconButton(
                                  icon: const Icon(Icons.favorite_border,
                                      color: Colors.black),
                                  onPressed: () {/* Logika untuk favorit */},
                                ),
                              ),
                            ),
                          ),
                        ],
                        flexibleSpace: FlexibleSpaceBar(
                          background: PokerCardImageSlider(images: _images),
                        ),
                      ),
                      SliverList(
                        delegate: SliverChildListDelegate(
                          [
                            // 1. Kartu Informasi Utama
                            Container(
                              margin: const EdgeInsets.only(top: 24.0),
                              child: Container(
                                margin: const EdgeInsets.symmetric(
                                    horizontal: 24.0),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 20.0, vertical: 24.0),
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
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    _buildHeader("Margoyoso Residence",
                                        "Rp 160.0 JT", "/Total", theme),
                                    const SizedBox(height: 16),
                                    Divider(color: Colors.grey[200]),
                                    const SizedBox(height: 16),
                                    _buildAddress("Dorogowok, Lumajang"),
                                  ],
                                ),
                              ),
                            ),

                            // 2. Padding untuk konten di bawah kartu
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 24.0, vertical: 24.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _buildSpecifications(),
                                  const SizedBox(height: 24),
                                  _buildFloorPlanSection(context),
                                  const SizedBox(height: 24),
                                  _buildDivider(),
                                  const SizedBox(height: 24),
                                  _buildDescription(theme),
                                ],
                              ),
                            ),

                            // Beri ruang ekstra di bagian bawah agar tidak mentok dengan tombol CTA
                            const SizedBox(height: 120),
                          ],
                        ),
                      ),
                    ],
                  ),
                  _buildCtaButton(theme),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
  // --- WIDGET-WIDGET PEMBANTU UNTUK UI ---

  Widget _buildHeader(String name, String price, String unit, ThemeData theme) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Text(
            name,
            style: const TextStyle(
              fontSize: 22, // Sedikit lebih kecil dari 24
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
                fontSize: 20, // Sedikit lebih kecil dari 22
                fontWeight: FontWeight.bold,
                color: theme.colorScheme.primary,
              ),
            ),
            Text(
              unit,
              style: const TextStyle(
                fontSize: 14, // Ukuran sama, warna bisa lebih lembut
                color: Color(0xFF6B7280),
              ),
            ),
          ],
        ),
      ],
    );
  }

// --- WIDGET _buildAddress ---
  Widget _buildAddress(String address) {
    return Row(
      children: [
        const Icon(
          Icons.location_on_outlined,
          color: Color(0xFF6B7280),
          size: 16, // Ukuran ikon tetap sama
        ),
        const SizedBox(width: 4),
        Text(
          address,
          style: const TextStyle(
            fontSize: 15, // Sedikit lebih kecil dari 16
            color: Color(0xFF6B7280),
          ),
        ),
      ],
    );
  }

  Widget _buildSpecifications() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        _buildSpecItem(Icons.bed_outlined, "2", "Kamar Tidur"),
        _buildSpecItem(Icons.bathtub_outlined, "1", "Kamar Mandi"),
        _buildSpecItem(Icons.square_foot_outlined, "90m²", "Luas Bangunan"),
      ],
    );
  }

  Widget _buildSpecItem(IconData icon, String value, String label) {
    return Column(
      children: [
        Icon(icon, color: const Color(0xFF6B7280), size: 28),
        const SizedBox(height: 8),
        Text(value,
            style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1F2937))),
        const SizedBox(height: 4),
        Text(label,
            style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
      ],
    );
  }

  Widget _buildDivider() {
    return Divider(color: Colors.grey[300], thickness: 1);
  }

  Widget _buildDescription(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Deskripsi",
          style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1F2937)),
        ),
        const SizedBox(height: 8),
        Text(
          "Rumah modern minimalis di lokasi yang sangat strategis di jantung kota. Dekat dengan fasilitas umum seperti sekolah, rumah sakit, dan pusat perbelanjaan. Cocok untuk keluarga muda yang dinamis.",
          style: TextStyle(fontSize: 15, color: Color(0xFF6B7280), height: 1.5),
        ),
      ],
    );
  }

  Widget _buildCtaButton(ThemeData theme) {
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
          onPressed: () {},
          child: const Text("Hubungi Agen",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        ),
      ),
    );
  }

  Widget _buildFloorPlanSection(BuildContext context) {
    if (_floorPlans.isEmpty) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Judul section, padding-nya 24 agar sejajar dengan konten lain
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
              if (_floorPlans.length > 1)
                Text(
                  "${_floorPlans.length} Denah",
                  style:
                      const TextStyle(fontSize: 14, color: Color(0xFF6B7280)),
                ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- PERUBAHAN UTAMA DI SINI ---
        SizedBox(
          height: 150,
          child: ListView.separated(
            // 1. Padding untuk seluruh list (24 di kiri dan 24 di kanan)
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            scrollDirection: Axis.horizontal,
            itemCount: _floorPlans.length,

            // 2. Widget pemisah (jarak antar item sebesar 16)
            separatorBuilder: (context, index) => const SizedBox(width: 16),

            // 3. Builder untuk setiap item (TANPA PADDING TAMBAHAN)
            itemBuilder: (context, index) {
              final imageUrl = _floorPlans[index];
              return GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => FloorPlanViewerPage(
                        floorPlanImages: _floorPlans,
                        initialIndex: index,
                      ),
                    ),
                  );
                },
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: CachedNetworkImage(
                    imageUrl: imageUrl,
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

// --- WIDGET KHUSUS UNTUK IMAGE SLIDER ---

class PokerCardImageSlider extends StatefulWidget {
  final List<PropertyImage> images;
  const PokerCardImageSlider({super.key, required this.images});

  @override
  State<PokerCardImageSlider> createState() => _PokerCardImageSliderState();
}

class _PokerCardImageSliderState extends State<PokerCardImageSlider> {
  late final PageController _pageController;
  double _currentPage = 0.0;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(
      // viewportFraction membuat kartu di sampingnya sedikit terlihat
      viewportFraction: 0.8,
    );
    _pageController.addListener(() {
      setState(() {
        _currentPage = _pageController.page!;
      });
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Gunakan PageView.builder untuk looping tak terbatas (infinity)
    return PageView.builder(
      controller: _pageController,
      itemBuilder: (context, index) {
        // Operator modulo (%) untuk menciptakan efek infinity loop
        final int currentIndex = index % widget.images.length;
        final double delta = (index - _currentPage).abs();

        // Kalkulasi untuk efek tumpukan kartu
        final double scale = math.max(1 - (delta * 0.2), 0.8);
        final double opacity = math.max(1 - (delta * 0.5), 0.0);

        return Transform.scale(
          scale: scale,
          child: Opacity(
            opacity: opacity,
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 0, vertical: 20),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    blurRadius: 15,
                    offset: const Offset(0, 5),
                  ),
                ],
                image: DecorationImage(
                  image: NetworkImage(widget.images[currentIndex].url),
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
