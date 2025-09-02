import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class PropertiesPage extends StatelessWidget {
  const PropertiesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Property Catalog',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFDBB837),
          brightness: Brightness.light,
          primary: const Color(0xFFDBB837),
        ),
        useMaterial3: true,
        fontFamily: 'Inter',
        scaffoldBackgroundColor: const Color(0xFFFAFAFA),
      ),
      home: const PropertyCatalogPage(),
    );
  }
}

// 1. MODEL DATA
class Property {
  final String id;
  final String title;
  final String location;
  final String price;
  final String priceRange;
  final String type;
  final int bedrooms;
  final int bathrooms;
  final double area;
  final String imageUrl;
  final bool isFavorite;
  final double rating;

  const Property({
    required this.id,
    required this.title,
    required this.location,
    required this.price,
    required this.priceRange,
    required this.type,
    required this.bedrooms,
    required this.bathrooms,
    required this.area,
    required this.imageUrl,
    this.isFavorite = false,
    required this.rating,
  });
}

// 2. HALAMAN UTAMA
class PropertyCatalogPage extends StatefulWidget {
  const PropertyCatalogPage({super.key});

  @override
  State<PropertyCatalogPage> createState() => _PropertyCatalogPageState();
}

class _PropertyCatalogPageState extends State<PropertyCatalogPage>
    with TickerProviderStateMixin {
  // Controllers
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  // Animation Controllers & Animations
  late AnimationController _fabAnimationController;

  void _scrollToTop() {
    _scrollController.animateTo(
      0,
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeInOut,
    );
  }

  // State Management
  String _selectedFilter = 'All';
  String _searchQuery = '';
  List<Property> _filteredProperties = [];

  // 3. DATA
  final List<String> _filterOptions = const [
    'All',
    'House',
    'Apartment',
    'Villa',
    'Studio'
  ];

  final List<Property> _mockProperties = const [
    Property(
      id: '1',
      title: 'Modern Minimalist House',
      location: 'Menteng, Central Jakarta',
      price: '2.5B',
      priceRange: '/month',
      type: 'House',
      bedrooms: 4,
      bathrooms: 3,
      area: 180.5,
      rating: 4.8,
      imageUrl:
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
    ),
    Property(
      id: '2',
      title: 'Luxury Sky Apartment',
      location: 'Kuningan, South Jakarta',
      price: '1.8B',
      priceRange: '/month',
      type: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      area: 95.0,
      rating: 4.6,
      imageUrl:
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    ),
    Property(
      id: '3',
      title: 'Tropical Villa Resort',
      location: 'Bandung, West Java',
      price: '3.2B',
      priceRange: '/month',
      type: 'Villa',
      bedrooms: 5,
      bathrooms: 4,
      area: 250.0,
      rating: 4.9,
      imageUrl:
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    ),
    Property(
      id: '4',
      title: 'Urban Studio Loft',
      location: 'Kemang, South Jakarta',
      price: '850K',
      priceRange: '/month',
      type: 'Studio',
      bedrooms: 1,
      bathrooms: 1,
      area: 35.0,
      rating: 4.4,
      imageUrl:
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    ),
    Property(
      id: '5',
      title: 'Designer Penthouse',
      location: 'Senopati, South Jakarta',
      price: '4.5B',
      priceRange: '/month',
      type: 'Apartment',
      bedrooms: 3,
      bathrooms: 3,
      area: 150.0,
      rating: 4.7,
      imageUrl:
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    ),
    Property(
      id: '6',
      title: 'Garden Family Home',
      location: 'Bogor, West Java',
      price: '1.9B',
      priceRange: '/month',
      type: 'House',
      bedrooms: 3,
      bathrooms: 2,
      area: 140.0,
      rating: 4.5,
      imageUrl:
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _filteredProperties = _mockProperties;

    // Inisialisasi Animation Controllers
    _fabAnimationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    _fabAnimationController.forward();

    // Setup Listeners
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    _fabAnimationController.dispose();
    super.dispose();
  }

  // 4. LOGIC & HANDLERS
  void _onSearchChanged() {
    if (_searchQuery != _searchController.text) {
      setState(() {
        _searchQuery = _searchController.text.toLowerCase();
        _filterProperties();
      });
    }
  }

  void _filterProperties() {
    _filteredProperties = _mockProperties.where((p) {
      final matchesSearch = _searchQuery.isEmpty ||
          p.title.toLowerCase().contains(_searchQuery) ||
          p.location.toLowerCase().contains(_searchQuery);
      final matchesFilter =
          _selectedFilter == 'All' || p.type == _selectedFilter;
      return matchesSearch && matchesFilter;
    }).toList();
    setState(() {});
  }

  void _onFilterSelected(String filter) {
    if (_selectedFilter != filter) {
      setState(() {
        _selectedFilter = filter;
        _filterProperties();
      });
      HapticFeedback.lightImpact();
    }
  }

  // 5. MAIN BUILD METHOD
  @override
  Widget build(BuildContext context) {
    final topPadding = MediaQuery.of(context).padding.top;

    return Scaffold(
      body: CustomScrollView(
        controller: _scrollController,
        slivers: [
          SliverPersistentHeader(
            pinned: true,
            delegate: _PropertyHeaderDelegate(
              searchController: _searchController,
              searchQuery: _searchQuery,
              onPinnedHeaderTap: _scrollToTop,
              selectedFilter: _selectedFilter,
              onFilterSelected: _onFilterSelected,
              minExtent: topPadding + 116,
              maxExtent: topPadding + 214,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),
          _buildSectionHeader(),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),
          _buildPropertyGrid(),
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }

  Widget _buildSectionHeader() {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Featured Properties',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF1F2937),
                      ),
                ),
                const SizedBox(height: 4),
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: Text(
                    '${_filteredProperties.length} properties found',
                    key: ValueKey(_filteredProperties.length),
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: const Color(0xFF6B7280),
                        ),
                  ),
                ),
              ],
            ),
            TextButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.view_module_rounded),
              label: const Text('View'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPropertyGrid() {
    if (_filteredProperties.isEmpty) {
      return SliverFillRemaining(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.search_off_rounded,
                  size: 64, color: Color(0xFF9CA3AF)),
              const SizedBox(height: 16),
              Text(
                'No properties found',
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(color: const Color(0xFF6B7280)),
              ),
              const SizedBox(height: 8),
              Text(
                'Try adjusting your search or filters',
                style: Theme.of(context)
                    .textTheme
                    .bodyMedium
                    ?.copyWith(color: const Color(0xFF9CA3AF)),
              ),
            ],
          ),
        ),
      );
    }
    return SliverPadding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      sliver: SliverList(
        delegate: SliverChildBuilderDelegate(
          (context, index) => Padding(
            padding: const EdgeInsets.only(bottom: 24.0),
            child: _buildPropertyCard(_filteredProperties[index]),
          ),
          childCount: _filteredProperties.length,
        ),
      ),
    );
  }

  Widget _buildPropertyCard(Property property) {
    return AspectRatio(
      aspectRatio: 1.1,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              offset: const Offset(0, 8),
              blurRadius: 24,
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            Expanded(
              flex: 3,
              child: Container(
                decoration: BoxDecoration(
                  borderRadius:
                      const BorderRadius.vertical(top: Radius.circular(20)),
                  image: DecorationImage(
                    image: NetworkImage(property.imageUrl),
                    fit: BoxFit.cover,
                  ),
                ),
                child: Stack(
                  children: [
                    Positioned(
                      top: 16,
                      left: 16,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.9),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          property.type,
                          style: const TextStyle(
                              fontSize: 12, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 16,
                      right: 16,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.9),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.star_rounded,
                                size: 14, color: Color(0xFFFF8A00)),
                            const SizedBox(width: 4),
                            Text(
                              property.rating.toString(),
                              style: const TextStyle(
                                  fontSize: 12, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Content
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                property.title,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                    fontSize: 16, fontWeight: FontWeight.w700),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  const Icon(Icons.location_on_rounded,
                                      size: 14, color: Color(0xFF6B7280)),
                                  const SizedBox(width: 4),
                                  Expanded(
                                    child: Text(
                                      property.location,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                          fontSize: 13,
                                          color: Color(0xFF6B7280)),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              'Rp ${property.price}',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              property.priceRange,
                              style: const TextStyle(
                                  fontSize: 12, color: Color(0xFF6B7280)),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const Spacer(),
                    Row(
                      children: [
                        _buildDetailItem(
                            Icons.bed_rounded, '${property.bedrooms}'),
                        const SizedBox(width: 16),
                        _buildDetailItem(
                            Icons.bathtub_rounded, '${property.bathrooms}'),
                        const SizedBox(width: 16),
                        _buildDetailItem(Icons.square_foot_rounded,
                            '${property.area.toInt()}m²'),
                        const Spacer(),
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Theme.of(context)
                                .colorScheme
                                .primary
                                .withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Icon(Icons.arrow_forward_rounded,
                              size: 16,
                              color: Theme.of(context).colorScheme.primary),
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

  Widget _buildDetailItem(IconData icon, String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: const Color(0xFF6B7280)),
        const SizedBox(width: 4),
        Text(
          text,
          style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: Color(0xFF6B7280)),
        ),
      ],
    );
  }
}

// LETAKKAN CLASS INI DI PALING BAWAH FILE ANDA
class _PropertyHeaderDelegate extends SliverPersistentHeaderDelegate {
  final TextEditingController searchController;
  final String searchQuery;
  final VoidCallback onPinnedHeaderTap;
  final String selectedFilter;
  final ValueChanged<String> onFilterSelected;
  @override
  final double minExtent;
  @override
  final double maxExtent;

  _PropertyHeaderDelegate({
    required this.searchController,
    required this.searchQuery,
    required this.onPinnedHeaderTap,
    required this.selectedFilter,
    required this.onFilterSelected,
    required this.minExtent,
    required this.maxExtent,
  });

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    final progress = (shrinkOffset / (maxExtent - minExtent)).clamp(0.0, 1.0);
    final topPadding = MediaQuery.of(context).padding.top;
    final filterTop = topPadding + 140 - (80 * progress);

    return Material(
      elevation: progress > 0.5 ? 4.0 : 0.0,
      child: Container(
        color: Colors.white,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // === Bagian yang Scroll dan Hilang (Header & Search Bar Besar) ===
            Positioned(
              top: topPadding + 8,
              left: 24,
              right: 24,
              child: Opacity(
                opacity: 1.0 - (progress * 2).clamp(0.0, 1.0),
                child: Column(
                  children: [
                    _buildHeader(context),
                    const SizedBox(height: 16),
                    _buildSearchSection(context),
                  ],
                ),
              ),
            ),

            // === Pinned Search Bar Kecil yang Muncul ===
            Positioned(
              top: topPadding,
              left: 0,
              right: 0,
              child: Opacity(
                opacity: (progress - 0.5).clamp(0.0, 1.0) * 2,
                child: _buildPinnedSearch(context),
              ),
            ),

            // === Filter Chips yang Bergerak ke Atas ===
            Positioned(
              top: filterTop,
              left: 0,
              right: 0,
              child: _buildFilterChips(context),
            ),
          ],
        ),
      ),
    );
  }

  @override
  bool shouldRebuild(covariant _PropertyHeaderDelegate oldDelegate) {
    return minExtent != oldDelegate.minExtent ||
        maxExtent != oldDelegate.maxExtent ||
        selectedFilter != oldDelegate.selectedFilter ||
        searchQuery != oldDelegate.searchQuery ||
        onPinnedHeaderTap != oldDelegate.onPinnedHeaderTap ||
        searchController != oldDelegate.searchController ||
        onFilterSelected != oldDelegate.onFilterSelected;
  }

  // Helper untuk membangun UI di dalam delegate
  Widget _buildHeader(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Image.asset(
            'assets/logo.png',
            width: 36,
            height: 36,
            fit: BoxFit.cover,
            errorBuilder: (ctx, err, st) => Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Theme.of(context).colorScheme.primary,
                    const Color(0xFFC49B1A)
                  ],
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Center(
                  child: Text("BN",
                      style: TextStyle(
                          color: Colors.white, fontWeight: FontWeight.bold))),
            ),
          ),
        ),
        const SizedBox(width: 16),
        const Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('PT BUMI NIRWANA ESTATE',
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
              Text('Estate Management',
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSearchSection(BuildContext context) {
    return Container(
      height: 56,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.08),
              offset: const Offset(0, 4),
              blurRadius: 16),
        ],
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Icon(Icons.search_rounded,
              color: Theme.of(context).colorScheme.primary),
          const SizedBox(width: 12),
          Expanded(
            child: TextField(
              controller: searchController,
              decoration: const InputDecoration(
                hintText: 'Search properties, locations...',
                hintStyle: TextStyle(
                    color: Color(0xFF9CA3AF), fontWeight: FontWeight.w400),
                border: InputBorder.none,
                isCollapsed: true,
              ),
            ),
          ),
          const SizedBox(width: 12),
          TextButton(
            onPressed: () => FocusScope.of(context).unfocus(),
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              backgroundColor: Theme.of(context).colorScheme.primary,
              foregroundColor: Colors.white,
              shape: const StadiumBorder(),
            ),
            child: const Text('Cari',
                style: TextStyle(fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );
  }

  Widget _buildPinnedSearch(BuildContext context) {
    return GestureDetector(
      onTap: onPinnedHeaderTap,
      child: Container(
        padding: const EdgeInsets.fromLTRB(24, 12, 24, 12),
        decoration: const BoxDecoration(
          color: Colors.white,
          border:
              Border(bottom: BorderSide(color: Color(0xFFE5E7EB), width: 0.5)),
        ),
        child: Row(
          children: [
            Icon(Icons.search_rounded,
                color: Theme.of(context).colorScheme.primary, size: 20),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                searchQuery.isEmpty
                    ? 'Tap to search properties...'
                    : searchQuery,
                style: TextStyle(
                  color: searchQuery.isEmpty
                      ? const Color(0xFF9CA3AF)
                      : const Color(0xFF1F2937),
                  fontSize: 15,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(width: 12),
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Icon(Icons.keyboard_arrow_up_rounded,
                  size: 16, color: Theme.of(context).colorScheme.primary),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChips(BuildContext context) {
    final List<String> filterOptions = const [
      'All',
      'House',
      'Apartment',
      'Villa',
      'Studio'
    ];
    return SizedBox(
      height: 44,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 24),
        itemCount: filterOptions.length,
        itemBuilder: (context, index) {
          final filter = filterOptions[index];
          final isSelected = selectedFilter == filter;
          return Padding(
            padding: EdgeInsets.only(
                right: index < filterOptions.length - 1 ? 12 : 0),
            child: FilterChip(
              label: Text(filter),
              selected: isSelected,
              onSelected: (_) => onFilterSelected(filter),
              backgroundColor: Colors.white,
              selectedColor: Theme.of(context).colorScheme.primary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(22),
                side: BorderSide(
                  color: isSelected
                      ? Theme.of(context).colorScheme.primary
                      : const Color(0xFFE5E7EB),
                ),
              ),
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : const Color(0xFF6B7280),
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
              ),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            ),
          );
        },
      ),
    );
  }
}
