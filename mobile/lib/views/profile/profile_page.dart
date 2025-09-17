import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/helper/address.dart';
import 'package:mobile_nirwana/helper/price.dart';
import 'package:mobile_nirwana/views/profile/profile_controller.dart';

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
    return CustomScrollView(
      slivers: [
        // Modern App Bar dengan gradient
        SliverAppBar(
          expandedHeight: 280,
          floating: false,
          pinned: true,
          elevation: 0,
          backgroundColor: Colors.white,
          flexibleSpace: FlexibleSpaceBar(
            background: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFFDBB837),
                    Color(0xFFF4D03F),
                  ],
                ),
              ),
              child: SafeArea(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SizedBox(height: 40),
                    // Avatar dengan shadow yang lebih modern
                    Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 20,
                            offset: Offset(0, 8),
                          ),
                        ],
                      ),
                      child: CircleAvatar(
                        radius: 45,
                        backgroundColor: Colors.white,
                        child: Icon(
                          Icons.person_rounded,
                          size: 45,
                          color: Color(0xFFDBB837),
                        ),
                      ),
                    ),
                    SizedBox(height: 20),
                    Text(
                      _profileController.currentUser.value.full_name,
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                        letterSpacing: 0.5,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      _profileController.currentUser.value.email,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.white.withOpacity(0.9),
                        letterSpacing: 0.3,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),

        // Content
        SliverToBoxAdapter(
          child: Column(
            children: [
              // Menu Items dengan card modern
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
                      onTap: () => print('Edit Profile tapped'),
                    ),
                    _buildDivider(),
                    _buildModernMenuItem(
                      icon: Icons.phone_outlined,
                      title: 'Nomor Telepon',
                      subtitle:
                          _profileController.currentUser.value.phone_number ??
                              'Belum ada',
                      onTap: () => print('Phone tapped'),
                    ),
                    _buildDivider(),
                    _buildModernMenuItem(
                      icon: Icons.notifications_none_rounded,
                      title: 'Notifikasi',
                      subtitle: 'Atur preferensi notifikasi',
                      onTap: () => print('Notifications tapped'),
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

              // Logout Button terpisah
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

              // Favorite Properties Section
              _buildFavoriteSection(),

              SizedBox(height: 100), // Extra space for bottom navigation
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildModernMenuItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return InkWell(
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
              Icons.arrow_forward_ios_rounded,
              size: 16,
              color: Colors.grey[400],
            ),
          ],
        ),
      ),
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
                height: 200,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Center(
                  child: CircularProgressIndicator(
                    color: Color(0xFFDBB837),
                    strokeWidth: 3,
                  ),
                ),
              );
            }

            if (_profileController.favoriteProperties.isEmpty) {
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
            }

            return ListView.builder(
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              itemCount: _profileController.favoriteProperties.length,
              itemBuilder: (context, index) {
                final property = _profileController.favoriteProperties[index];
                return _buildModernFavoriteProperty(property);
              },
            );
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

  Widget _buildModernFavoriteProperty(Property property) {
    return Container(
      margin: EdgeInsets.only(bottom: 16),
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
          // Property Image
          Container(
            height: 180,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
              image: DecorationImage(
                image: NetworkImage(
                  'property/property_images/${_getPropertyImage(property)}',
                ),
                fit: BoxFit.cover,
              ),
            ),
            child: Stack(
              children: [
                // Gradient overlay
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(16),
                      topRight: Radius.circular(16),
                    ),
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.transparent,
                        Colors.black.withOpacity(0.1),
                      ],
                    ),
                  ),
                ),
                Positioned(
                  top: 12,
                  right: 12,
                  child: Container(
                    padding: EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 8,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Icon(
                      Icons.favorite_rounded,
                      color: Colors.red,
                      size: 20,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Property Info
          Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  property.name,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Colors.black87,
                  ),
                ),
                SizedBox(height: 6),
                Row(
                  children: [
                    Icon(
                      Icons.location_on_rounded,
                      size: 16,
                      color: Colors.grey[500],
                    ),
                    SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        AreaHelper.formatSingleLine(property.address),
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 12),
                Text(
                  formatPrice(property.price),
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFFDBB837),
                  ),
                ),
                SizedBox(height: 12),
                Row(
                  children: [
                    _buildModernPropertyFeature(
                      Icons.bed_rounded,
                      property.specifications!.bedrooms.toString(),
                    ),
                    SizedBox(width: 16),
                    _buildModernPropertyFeature(
                      Icons.bathroom_rounded,
                      property.specifications!.bathrooms.toString(),
                    ),
                    SizedBox(width: 16),
                    _buildModernPropertyFeature(
                      Icons.square_foot_rounded,
                      '${property.buildingSize}m²',
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildModernPropertyFeature(IconData icon, String value) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Color(0xFFF8F9FA),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Icon(icon, size: 16, color: Colors.grey[600]),
          SizedBox(width: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Colors.grey[700],
            ),
          ),
        ],
      ),
    );
  }
}

String _getPropertyImage(Property property) {
  if (property.images.isNotEmpty && property.images[0].image_url != null) {
    return property.images[0].image_url!;
  }
  return "";
}
