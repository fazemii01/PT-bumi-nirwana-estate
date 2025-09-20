import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/helper/price.dart';
import 'package:mobile_nirwana/views/layout.dart';
import 'package:mobile_nirwana/views/profile/profile_controller.dart';
import 'package:mobile_nirwana/views/profile/widgets/update_profile.dart';
import 'package:mobile_nirwana/widgets/error.dart';
import 'package:mobile_nirwana/widgets/simmer.dart';

class ProfilePage extends StatelessWidget {
  final ProfileController _profileController = Get.put(ProfileController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF8F9FA),
      body: Obx(() {
        return _profileController.isLoggedIn.value
            ? _loggedInView(context)
            : _buildNotLoggedInView(context);
      }),
    );
  }

  Widget _loggedInView(BuildContext context) {
    return RefreshIndicator(
      onRefresh: () async {
        _profileController.loadPage();
      },
      color: Color(0xFFDBB837),
      child: CustomScrollView(
        slivers: [
          SliverLayoutBuilder(
            builder: (context, constraints) {
              final isCollapsed = constraints.scrollOffset > 200;

              return SliverAppBar(
                expandedHeight: 320,
                pinned: true,
                surfaceTintColor: Colors.white,
                elevation: 0,
                backgroundColor: Colors.white,
                title: isCollapsed
                    ? Obx(() => Text(
                          _profileController.currentUser.value.full_name,
                          style: const TextStyle(
                            color: Colors.black87,
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ))
                    : null,
                leading: isCollapsed
                    ? IconButton(
                        icon:
                            const Icon(Icons.arrow_back, color: Colors.black87),
                        onPressed: () =>
                            Get.offAll(() => const Layout(), arguments: 0),
                      )
                    : null,
                flexibleSpace: FlexibleSpaceBar(
                  background: Stack(
                    children: [
                      // Background gradient
                      Container(
                        height: 280,
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [Color(0xFFDBB837), Color(0xFFF59E0B)],
                          ),
                        ),
                      ),

                      // Curved bottom
                      Positioned(
                        bottom: 0,
                        left: 0,
                        right: 0,
                        child: Container(
                          height: 80,
                          decoration: BoxDecoration(
                            color: Colors.grey[50],
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(40),
                              topRight: Radius.circular(40),
                            ),
                          ),
                        ),
                      ),

                      // Content
                      SafeArea(
                        child: Column(
                          children: [
                            // Header email
                            Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 20),
                              child: Row(
                                children: [
                                  IconButton(
                                    icon: const Icon(Icons.arrow_back,
                                        color: Colors.white),
                                    onPressed: () => Get.offAll(
                                        () => const Layout(),
                                        arguments: 0),
                                  ),
                                  Expanded(
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 16, vertical: 8),
                                      decoration: BoxDecoration(
                                        color: Colors.white.withOpacity(0.2),
                                        borderRadius: BorderRadius.circular(25),
                                        border: Border.all(
                                          color: Colors.white.withOpacity(0.3),
                                          width: 1,
                                        ),
                                      ),
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          const Icon(Icons.email_outlined,
                                              color: Colors.white, size: 16),
                                          const SizedBox(width: 8),
                                          Flexible(
                                            child: Obx(() => Text(
                                                  _profileController
                                                      .currentUser.value.email,
                                                  style: const TextStyle(
                                                    color: Colors.white,
                                                    fontSize: 14,
                                                    fontWeight: FontWeight.w500,
                                                  ),
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                )),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.more_vert,
                                        color: Colors.white),
                                    onPressed: () {},
                                  ),
                                ],
                              ),
                            ),

                            const SizedBox(height: 40),

                            Obx(() => _profilePictureSection()),

                            const SizedBox(height: 8),

                            // Tombol kamera
                            _cameraButton(),

                            const SizedBox(height: 20),

                            // Nama user
                            Obx(() => _profileController.isLoadUser.value
                                ? Simmer(
                                    width: 230,
                                    height: 30,
                                    borderRadius: BorderRadius.circular(8),
                                  )
                                : _profileController
                                        .errorLoadUser.value.isNotEmpty
                                    ? SizedBox.shrink()
                                    : Text(
                                        _profileController
                                            .currentUser.value.full_name,
                                        style: const TextStyle(
                                          fontSize: 24,
                                          fontWeight: FontWeight.w600,
                                          color: Colors.black87,
                                        ),
                                      )),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
          // Content
          SliverToBoxAdapter(
            child: Column(
              children: [
                Container(
                  margin: EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 20,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      _buildModernMenuItem(
                        icon: Icons.person_outline_rounded,
                        title: 'Edit Profile',
                        subtitle: 'Kelola informasi pribadi',
                        isExpandable: true,
                        isExpanded: _profileController.isProfileExpanded.value,
                        onTap: () {
                          _profileController.toggleProfileExpansion();
                        },
                      ),
                      _buildDivider(),
                      _buildModernMenuItem(
                        icon: Icons.security_rounded,
                        title: 'Keamanan',
                        subtitle: 'Password & keamanan akun',
                        onTap: () => print('Security tapped'),
                      ),
                      _buildDivider(),
                      _buildModernMenuItem(
                        icon: Icons.help_outline_rounded,
                        title: 'Bantuan',
                        subtitle: 'FAQ & dukungan pelanggan',
                        onTap: () => print('Help tapped'),
                      ),
                    ],
                  ),
                ),
                Container(
                  margin: EdgeInsets.symmetric(horizontal: 20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 20,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: _buildLogoutItem(),
                ),
                _buildFavoriteSection(),
                SizedBox(height: 100),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _profilePictureSection() {
    if (_profileController.isLoadUser.value) {
      return ClipOval(child: Simmer(height: 120, width: 120));
    }

    if (_profileController.errorLoadUser.value.isNotEmpty) {
      return Container(
        width: 120,
        height: 120,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: const Color(0xFFDBB837),
          border: Border.all(color: Colors.white, width: 4),
        ),
        child: const Icon(Icons.person, size: 80, color: Colors.white),
      );
    }

    return Container(
      width: 120,
      height: 120,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: const Color(0xFFDBB837),
        border: Border.all(color: Colors.white, width: 4),
      ),
      child: Center(
        child: Text(
          _getInitials(_profileController.currentUser.value.full_name),
          style: const TextStyle(
            fontSize: 36,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
    );
  }

  Widget _cameraButton() {
    return GestureDetector(
      onTap: () {
        // Action untuk ganti foto profil
      },
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: const Icon(Icons.camera_alt, size: 16, color: Colors.black54),
      ),
    );
  }

  Widget _buildModernMenuItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    bool isExpandable = false,
    bool isExpanded = false,
  }) {
    return Column(
      children: [
        InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: EdgeInsets.all(20),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Color(0xFFF8F9FA),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    icon,
                    color: Color(0xFFDBB837),
                    size: 24,
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.black87,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        subtitle,
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  isExpandable
                      ? (isExpanded
                          ? Icons.keyboard_arrow_down_rounded
                          : Icons.arrow_forward_ios_rounded)
                      : Icons.arrow_forward_ios_rounded,
                  size: isExpandable ? 16 : 16,
                  color: Colors.grey[400],
                ),
              ],
            ),
          ),
        ),
        if (isExpandable && isExpanded) _buildProfileInfoSection(),
      ],
    );
  }

  Widget _buildLogoutItem() {
    return InkWell(
      onTap: () => _showLogoutDialog(),
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                Icons.logout_rounded,
                color: Colors.red,
                size: 24,
              ),
            ),
            SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Logout',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.red,
                    ),
                  ),
                  SizedBox(height: 2),
                  Text(
                    'Keluar dari akun',
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.arrow_forward_ios_rounded,
              size: 16,
              color: Colors.red.withOpacity(0.5),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 20),
      height: 1,
      color: Colors.grey[100],
    );
  }

  void _showLogoutDialog() {
    Get.dialog(
      AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: Text(
          'Logout',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
        content: Text('Apakah Anda yakin ingin keluar?'),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: Text(
              'Batal',
              style: TextStyle(color: Colors.grey[600]),
            ),
          ),
          TextButton(
            onPressed: () {
              Get.back();
              _profileController.logout();
            },
            child: Text(
              'Logout',
              style: TextStyle(color: Colors.red),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFavoriteSection() {
    return Container(
      margin: EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 4),
            child: Text(
              'Properti Favorit',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: Colors.black87,
              ),
            ),
          ),
          SizedBox(height: 16),
          Obx(() {
            if (_profileController.isLoading.value) {
              return Container(
                height: 140,
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: 3,
                  itemBuilder: (context, index) {
                    return Padding(
                      padding: const EdgeInsets.only(right: 12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Stack(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(12),
                                child: Simmer(width: 160, height: 80),
                              ),
                              Positioned(
                                top: 6,
                                right: 6,
                                child: Container(
                                  padding: EdgeInsets.all(4),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    shape: BoxShape.circle,
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.1),
                                        blurRadius: 4,
                                        offset: Offset(0, 1),
                                      ),
                                    ],
                                  ),
                                  child: Simmer(width: 12, height: 12),
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 8),
                          Simmer(width: 80, height: 10),
                          SizedBox(height: 4),
                          Simmer(width: 100, height: 10),
                        ],
                      ),
                    );
                  },
                ),
              );
            } else if (_profileController.errorMessage.isNotEmpty) {
              return ErrorStateWidget.server(
                onRetry: () => _profileController.loadFavoriteProperties(),
              );
            } else if (_profileController.userFavorities.isEmpty) {
              return Container(
                padding: EdgeInsets.all(40),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 20,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: Color(0xFFF8F9FA),
                        borderRadius: BorderRadius.circular(40),
                      ),
                      child: Icon(
                        Icons.favorite_border_rounded,
                        size: 40,
                        color: Colors.grey[400],
                      ),
                    ),
                    SizedBox(height: 20),
                    Text(
                      'Belum ada properti favorit',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey[700],
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Mulai tambahkan properti ke favorit',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[500],
                      ),
                    ),
                  ],
                ),
              );
            } else {
              return Container(
                height: 140,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal, // Horizontal scroll
                  padding: EdgeInsets.symmetric(horizontal: 16),
                  itemCount: _profileController.userFavorities.length,
                  itemBuilder: (context, index) {
                    final userFavorite =
                        _profileController.userFavorities[index];
                    return _buildFavoriteProperty(userFavorite.property!);
                  },
                ),
              );
            }
          }),
        ],
      ),
    );
  }

  Widget _buildNotLoggedInView(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          children: [
            // Header
            SizedBox(height: 60),
            Text(
              'Profile',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w700,
                color: Colors.black87,
              ),
            ),

            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Illustration
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Color(0xFFDBB837).withOpacity(0.2),
                          Color(0xFFF4D03F).withOpacity(0.1),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(60),
                    ),
                    child: Icon(
                      Icons.person_rounded,
                      size: 60,
                      color: Color(0xFFDBB837),
                    ),
                  ),
                  SizedBox(height: 32),

                  Text(
                    'Belum Login',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w700,
                      color: Colors.black87,
                    ),
                  ),
                  SizedBox(height: 12),

                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20),
                    child: Text(
                      'Login untuk mengakses fitur profile dan melihat properti favorit Anda',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey[600],
                        height: 1.5,
                      ),
                    ),
                  ),
                  SizedBox(height: 48),

                  // Login Button
                  Container(
                    width: double.infinity,
                    height: 56,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                        colors: [
                          Color(0xFFDBB837),
                          Color(0xFFF4D03F),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Color(0xFFDBB837).withOpacity(0.3),
                          blurRadius: 20,
                          offset: Offset(0, 8),
                        ),
                      ],
                    ),
                    child: ElevatedButton(
                      onPressed: () => Get.toNamed(Routes.LOGIN),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        shadowColor: Colors.transparent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      child: Text(
                        'Login',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(height: 16),

                  // Register Button
                  Container(
                    width: double.infinity,
                    height: 56,
                    child: OutlinedButton(
                      onPressed: () => Get.toNamed(Routes.REGISTER),
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: Color(0xFFDBB837), width: 2),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      child: Text(
                        'Register',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFFDBB837),
                          letterSpacing: 0.5,
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
    );
  }

  Widget _buildFavoriteProperty(Property property) {
    return Container(
      width: 160,
      margin: EdgeInsets.only(right: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Thumbnail image
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(12),
                  topRight: Radius.circular(12),
                ),
                child: Image.network(
                  Imgurl.get(
                      'property/property_images/${_getPropertyImage(property)}'),
                  fit: BoxFit.cover,
                  width: 160,
                  height: 80,
                ),
              ),
              // Favorite badge
              Positioned(
                top: 6,
                right: 6,
                child: Container(
                  padding: EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 4,
                        offset: Offset(0, 1),
                      ),
                    ],
                  ),
                  child: Icon(
                    Icons.favorite_rounded,
                    color: Colors.red,
                    size: 12,
                  ),
                ),
              ),
            ],
          ),

          SizedBox(height: 8),

          // Property details dengan padding
          Expanded(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    property.name,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Colors.black87,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 2),
                  Text(
                    formatPrice(property.price),
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFFDBB837),
                    ),
                  ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildProfileInfoSection() {
    return AnimatedContainer(
      duration: Duration(milliseconds: 300),
      curve: Curves.easeInOut,
      padding: EdgeInsets.only(left: 20, right: 20, bottom: 20),
      child: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: Colors.grey[200]!,
            width: 1,
          ),
        ),
        child: _profileController.isLoadUser.value
            ? Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    alignment: Alignment.center,
                    child: const Simmer(
                        width: 16,
                        height: 16,
                        borderRadius: BorderRadius.all(Radius.circular(8))),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Simmer(width: 80, height: 10), // label shimmer
                        SizedBox(height: 4),
                        Simmer(
                            width: double.infinity,
                            height: 12), // value shimmer
                      ],
                    ),
                  ),
                ],
              )
            : _profileController.errorLoadUser.value.isNotEmpty
                ? Container(
                    padding: EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.red[50],
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: Colors.red[100]!,
                        width: 1,
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.info_outline,
                          color: Colors.red[700],
                          size: 20,
                        ),
                        SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'Terjadi kesalahan saat memuat konten',
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.red[800],
                              height: 1.4,
                            ),
                          ),
                        ),
                      ],
                    ),
                  )
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      InkWell(
                        onTap: () {},
                        child: Padding(
                          padding: EdgeInsets.all(5),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Informasi Pribadi',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.black87,
                                ),
                              ),
                              Container(
                                width: 32,
                                height: 32,
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: Colors.grey[200]!,
                                    width: 1,
                                  ),
                                ),
                                child: IconButton(
                                  padding: EdgeInsets.zero,
                                  icon: Icon(
                                    Icons.edit_outlined,
                                    size: 16,
                                    color: Color(0xFFDBB837),
                                  ),
                                  onPressed: () => _showUpdateProfileDialog(),
                                ),
                              )
                            ],
                          ),
                        ),
                      ),
                      SizedBox(height: 16),

                      // Field Nama Lengkap
                      _buildInfoField(
                        label: 'Nama Lengkap',
                        value: _profileController.currentUser.value.full_name,
                        icon: Icons.person_outline,
                      ),

                      SizedBox(height: 12),

                      // Field Email
                      _buildInfoField(
                        label: 'Email',
                        value: _profileController.currentUser.value.email,
                        icon: Icons.email_outlined,
                      ),

                      // Button Perbarui
                    ],
                  ),
      ),
    );
  }

// Widget untuk field informasi
  Widget _buildInfoField({
    required String label,
    required String value,
    required IconData icon,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 32,
          height: 32,
          child: Icon(
            icon,
            size: 16,
            color: Color(0xFFDBB837),
          ),
        ),
        SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                  fontWeight: FontWeight.w500,
                ),
              ),
              SizedBox(height: 2),
              Text(
                value,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.black87,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _showUpdateProfileDialog() {
    UpdateProfileBottomSheet.show(
      context: Get.context!,
      initialName: _profileController.currentUser.value.full_name,
      isLoading: _profileController.isEditing.value,
      onUpdate: (String name) {
        _profileController.editProfile(
            _profileController.currentUser.value.id!, name);
      },
    );
  }
}

String _getPropertyImage(Property property) {
  if (property.images.isNotEmpty && property.images[0].image_url != null) {
    return property.images[0].image_url!;
  }
  return "";
}

String _getInitials(String name) {
  if (name.isEmpty) return 'U';

  List<String> nameParts = name.split(' ');
  if (nameParts.length == 1) {
    return nameParts[0][0].toUpperCase();
  } else {
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  }
}
