import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/helper/address.dart';
import 'package:mobile_nirwana/helper/price.dart';
import 'package:mobile_nirwana/views/properties/detail/widget/property_favorite_user_detail.dart';
import 'package:mobile_nirwana/views/layout_controller.dart';
import 'package:mobile_nirwana/views/properties/properties_controller.dart';
import 'package:mobile_nirwana/widgets/skeleton_property_card.dart';

class PropertiesPage extends StatefulWidget {
  const PropertiesPage({super.key});

  @override
  State<PropertiesPage> createState() => _PropertyCatalogPageState();
}

class _PropertyCatalogPageState extends State<PropertiesPage> {
  // Controllers
  final PropertiesController _propertiesController =
      Get.put(PropertiesController());
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final LayoutController _layoutController = Get.put(LayoutController());

  // State Management
  String _selectedFilter = 'All';
  String _searchQuery = '';
  List<Property> _filteredProperties = [];

  final List<FilterOption> _filterOptions = const [
    FilterOption(icon: Icons.grid_view_rounded, label: 'All'),
    FilterOption(icon: Icons.house_rounded, label: 'House'),
    FilterOption(icon: Icons.apartment_rounded, label: 'Apartment'),
    FilterOption(icon: Icons.storefront_rounded, label: 'Ruko'),
    FilterOption(icon: Icons.landscape_rounded, label: 'Kavling'),
  ];

  late List<GlobalKey> _filterKeys;

  double _indicatorWidth = 0.0;
  double _indicatorLeft = 0.0;

  Future<void> _handleRefresh() async {
    await _propertiesController.loadProperty();
  }

  Worker? _everWorker;

  @override
  void initState() {
    super.initState();

    if (_propertiesController.properties.isNotEmpty) {
      _filterProperties();
    }
    _everWorker =
        ever(_propertiesController.properties, (_) => _filterProperties());

    _searchController.addListener(_onSearchChanged);

    _filterKeys = List.generate(_filterOptions.length, (_) => GlobalKey());

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _updateIndicatorPosition(0);
    });
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    _scrollController.dispose();
    _everWorker?.dispose();
    super.dispose();
  }

  String? _getPropertyImage(Property property) {
    if (property.images.isNotEmpty && property.images.first.image_url != null) {
      return property.images.first.image_url;
    }
    return null;
  }

  String _buildPropertyImageUrl(Property property) {
    final String? filename = _getPropertyImage(property);
    if (filename != null && filename.isNotEmpty) {
      return Imgurl.get('property/property_images/$filename');
    }
    return 'https://via.placeholder.com/400x300.png?text=No+Image';
  }

  void _scrollToTop() {
    _scrollController.animateTo(
      0,
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeInOut,
    );
  }

  void _onSearchChanged() {
    if (_searchQuery != _searchController.text) {
      setState(() {
        _searchQuery = _searchController.text.toLowerCase();
        _filterProperties();
      });
    }
  }

  void _updateIndicatorPosition(int index) {
    final key = _filterKeys[index];
    if (key.currentContext != null) {
      final RenderBox renderBox =
          key.currentContext!.findRenderObject() as RenderBox;
      final RenderBox listRenderBox = context.findRenderObject() as RenderBox;
      final listGlobalPosition = listRenderBox.localToGlobal(Offset.zero);
      final globalPosition = renderBox.localToGlobal(Offset.zero);

      setState(() {
        _indicatorLeft = globalPosition.dx - listGlobalPosition.dx;
        _indicatorWidth = renderBox.size.width;
      });
    }
  }

  void _onFilterTapped(String filter, int index) {
    if (_selectedFilter != filter) {
      setState(() {
        _selectedFilter = filter;
        _filterProperties();
      });
      _updateIndicatorPosition(index);
      HapticFeedback.lightImpact();
    }
  }

  void _filterProperties() {
    final sourceList = _propertiesController.properties;

    if (sourceList.isEmpty) {
      setState(() {
        _filteredProperties = [];
      });
      return;
    }

    _filteredProperties = sourceList.where((p) {
      final search = _searchQuery;
      final filter = _selectedFilter.toLowerCase();

      final matchesSearch = search.isEmpty ||
          p.name.toLowerCase().contains(search) ||
          (p.address?.city?.toLowerCase().contains(search) ?? false) ||
          (p.address?.district?.toLowerCase().contains(search) ?? false) ||
          (p.address?.village?.toLowerCase().contains(search) ?? false);

      final matchesFilter = filter == 'all' ||
          (p.type != null && p.type!.toLowerCase() == filter);

      return matchesSearch && matchesFilter;
    }).toList();

    if (mounted) {
      setState(() {});
    }
  }

  // Build Methods
  @override
  Widget build(BuildContext context) {
    final topPadding = MediaQuery.of(context).padding.top;

    return Theme(
      data: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFDBB837),
          brightness: Brightness.light,
          primary: const Color(0xFFDBB837),
        ),
        useMaterial3: true,
        fontFamily: 'Inter',
        scaffoldBackgroundColor: const Color(0xFFFAFAFA),
      ),
      child: Builder(
        builder: (BuildContext newContext) {
          final correctTheme = Theme.of(newContext);

          // AnnotatedRegion diletakkan di sini, membungkus Scaffold
          return AnnotatedRegion<SystemUiOverlayStyle>(
            // Terapkan style dengan ikon gelap (hitam) untuk halaman ini
            value: const SystemUiOverlayStyle(
              statusBarBrightness:
                  Brightness.light, // Untuk iOS (background terang)
              statusBarIconBrightness:
                  Brightness.dark, // Untuk Android (ikon gelap)
            ),
            child: Scaffold(
              body: CustomScrollView(
                controller: _scrollController,
                physics: const BouncingScrollPhysics(
                    parent: AlwaysScrollableScrollPhysics()),
                slivers: [
                  SliverPersistentHeader(
                    pinned: true,
                    delegate: _PropertyHeaderDelegate(
                      searchController: _searchController,
                      searchQuery: _searchQuery,
                      onPinnedHeaderTap: _scrollToTop,
                      selectedFilter: _selectedFilter,
                      onFilterTapped: _onFilterTapped,
                      filterOptions: _filterOptions,
                      filterKeys: _filterKeys,
                      indicatorWidth: _indicatorWidth,
                      indicatorLeft: _indicatorLeft,
                      minExtent: topPadding + 116,
                      maxExtent: topPadding + 164,
                    ),
                  ),
                  CupertinoSliverRefreshControl(
                    onRefresh: _handleRefresh,
                    builder: (
                      BuildContext context,
                      RefreshIndicatorMode refreshState,
                      double pulledExtent,
                      double refreshTriggerPullDistance,
                      double refreshIndicatorExtent,
                    ) {
                      if (refreshState == RefreshIndicatorMode.refresh ||
                          refreshState == RefreshIndicatorMode.armed) {
                        return Center(
                          child: SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(
                              strokeWidth: 2.5,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                Theme.of(context).colorScheme.primary,
                              ),
                            ),
                          ),
                        );
                      }
                      return const SizedBox.shrink();
                    },
                  ),
                  const SliverToBoxAdapter(child: SizedBox(height: 16)),
                  _buildSectionHeader(),
                  const SliverToBoxAdapter(child: SizedBox(height: 16)),
                  _buildPropertyGrid(correctTheme),
                  const SliverToBoxAdapter(child: SizedBox(height: 100)),
                ],
              ),
            ),
          );
        },
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
            // DIHAPUS: Tombol 'View' yang tidak fungsional.
          ],
        ),
      ),
    );
  }

  Widget _buildPropertyGrid(ThemeData theme) {
    return Obx(() {
      if (_propertiesController.isLoading.value &&
          _propertiesController.properties.isEmpty) {
        return SliverPadding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          sliver: SliverList.builder(
            itemCount: 3,
            itemBuilder: (context, index) => const Padding(
              padding: EdgeInsets.only(bottom: 24.0),
              child: SkeletonPropertyCard(),
            ),
          ),
        );
      }

      if (_propertiesController.errorMessage.value.isNotEmpty) {
        return SliverFillRemaining(
          hasScrollBody: false,
          child: Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.red[50],
                        borderRadius: BorderRadius.circular(40),
                        border: Border.all(
                          color: Colors.red[100]!,
                          width: 2,
                        ),
                      ),
                      child: Icon(
                        Icons.wifi_off_rounded,
                        size: 30,
                        color: Colors.red[400],
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'Something went wrong',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey[800],
                        letterSpacing: -0.3,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Container(
                      constraints: const BoxConstraints(maxWidth: 280),
                      child: Text(
                        _propertiesController.errorMessage.value,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[600],
                          height: 1.4,
                        ),
                        textAlign: TextAlign.center,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: () => _propertiesController.loadProperty(),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFDBB837),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 28,
                          vertical: 14,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: const [
                          Icon(
                            Icons.refresh_rounded,
                            size: 18,
                            color: Colors.white,
                          ),
                          SizedBox(width: 8),
                          Text(
                            'Try Again',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      }

      if (_filteredProperties.isEmpty) {
        return const SliverFillRemaining(
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.search_off_rounded,
                    size: 64, color: Color(0xFF9CA3AF)),
                SizedBox(height: 16),
                Text(
                  'No properties found',
                  style: TextStyle(color: Color(0xFF6B7280)),
                ),
                SizedBox(height: 8),
                Text(
                  'Try adjusting your search or filters',
                  style: TextStyle(color: Color(0xFF9CA3AF)),
                ),
              ],
            ),
          ),
        );
      }

      return SliverPadding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        sliver: SliverList.builder(
          itemCount: _filteredProperties.length,
          itemBuilder: (context, index) => Padding(
            padding: const EdgeInsets.only(bottom: 24.0),
            child: _buildPropertyCard(_filteredProperties[index], theme),
          ),
        ),
      );
    });
  }

  Widget _buildPropertyCard(Property property, ThemeData theme) {
    return GestureDetector(
      onTap: () {
        Get.toNamed(
          Routes.DETAIL_PROPERTIES,
          arguments: property,
        );
      },
      child: AspectRatio(
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
              Expanded(
                flex: 3,
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius:
                        const BorderRadius.vertical(top: Radius.circular(20)),
                    image: DecorationImage(
                      image: NetworkImage(_buildPropertyImageUrl(property)),
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
                            color: Color(0xFFDBB837).withOpacity(0.9),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            property.type,
                            style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Colors.white),
                          ),
                        ),
                      ),
                      FavoriteIcon(
                        propertyId: property.id,
                        isLoggedIn: _layoutController.isLoggedIn.value,
                      ),
                    ],
                  ),
                ),
              ),
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
                                  property.name,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700),
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    const Icon(Icons.location_on_rounded,
                                        size: 14, color: Color(0xFF6B7280)),
                                    const SizedBox(width: 4),
                                    Expanded(
                                      child: Text(
                                        AreaHelper.formatSingleLine(
                                            property.address),
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
                                formatPrice(property.price),
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                  color: theme.colorScheme.primary,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                "/${property.price_unit}",
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
                          if (property.specifications?.bedrooms != null)
                            _buildDetailItem(Icons.bed_rounded,
                                '${property.specifications!.bedrooms}'),
                          const SizedBox(width: 16),
                          if (property.specifications?.bathrooms != null)
                            _buildDetailItem(Icons.bathtub_rounded,
                                '${property.specifications!.bathrooms}'),
                          const SizedBox(width: 16),
                          if (property.buildingSize != null)
                            _buildDetailItem(Icons.square_foot_rounded,
                                '${property.buildingSize!.toInt()}m²'),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: theme.colorScheme.primary.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Icon(Icons.arrow_forward_rounded,
                                size: 16, color: theme.colorScheme.primary),
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

class FilterOption {
  final IconData icon;
  final String label;

  const FilterOption({required this.icon, required this.label});
}

class _PropertyHeaderDelegate extends SliverPersistentHeaderDelegate {
  final TextEditingController searchController;
  final String searchQuery;
  final VoidCallback onPinnedHeaderTap;
  final String selectedFilter;
  final Function(String, int) onFilterTapped;
  final List<FilterOption> filterOptions;
  final List<GlobalKey> filterKeys;
  final double indicatorWidth;
  final double indicatorLeft;
  @override
  final double minExtent;
  @override
  final double maxExtent;

  _PropertyHeaderDelegate({
    required this.searchController,
    required this.searchQuery,
    required this.onPinnedHeaderTap,
    required this.selectedFilter,
    required this.filterOptions,
    required this.filterKeys,
    required this.indicatorWidth,
    required this.indicatorLeft,
    required this.onFilterTapped,
    required this.minExtent,
    required this.maxExtent,
  });

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    final progress = (shrinkOffset / (maxExtent - minExtent)).clamp(0.0, 1.0);
    final topPadding = MediaQuery.of(context).padding.top;
    final filterTop = topPadding + 100 - (45 * progress);

    return Material(
      elevation: progress > 0.5 ? 1.0 : 0.0,
      child: Container(
        color: Colors.white,
        child: Stack(
          fit: StackFit.expand,
          children: [
            Positioned(
              top: topPadding + 8,
              left: 24,
              right: 24,
              child: Opacity(
                opacity: 1.0 - (progress * 2).clamp(0.0, 1.0),
                child: Column(
                  children: [
                    const SizedBox(height: 16),
                    _buildSearchSection(context),
                  ],
                ),
              ),
            ),
            Positioned(
              top: topPadding,
              left: 0,
              right: 0,
              child: Opacity(
                opacity: (progress - 0.5).clamp(0.0, 1.0) * 2,
                child: _buildPinnedSearch(context),
              ),
            ),
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
        indicatorWidth != oldDelegate.indicatorWidth ||
        indicatorLeft != oldDelegate.indicatorLeft;
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

  Widget _buildFilterItem(
    BuildContext context, {
    required FilterOption option,
    required bool isSelected,
    required VoidCallback onTap,
    required GlobalKey key,
  }) {
    final color = isSelected
        ? Theme.of(context).colorScheme.primary
        : const Color(0xFF6B7280);

    return InkWell(
      key: key,
      onTap: onTap,
      splashColor: Colors.transparent,
      highlightColor: Colors.transparent,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(option.icon, color: color, size: 24),
            const SizedBox(height: 4),
            Text(
              option.label,
              style: TextStyle(
                color: color,
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChips(BuildContext context) {
    // DIHAPUS: Deklarasi `filterOptions` yang berulang.

    return SizedBox(
      height: 60,
      child: Stack(
        children: [
          AnimatedPositioned(
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeInOut,
            left: indicatorLeft,
            bottom: 3,
            child: Container(
              width: indicatorWidth,
              height: 3,
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 24),
            itemCount: filterOptions.length,
            itemBuilder: (context, index) {
              final option = filterOptions[index];
              final isSelected =
                  selectedFilter.toLowerCase() == option.label.toLowerCase();

              return _buildFilterItem(
                context,
                key: filterKeys[index],
                option: option,
                isSelected: isSelected,
                onTap: () => onFilterTapped(option.label, index),
              );
            },
          ),
        ],
      ),
    );
  }
}
