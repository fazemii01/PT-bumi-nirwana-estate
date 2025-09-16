// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';
// import 'package:mobile_nirwana/views/home/home_page.dart';
// import 'package:mobile_nirwana/views/kpr/kpr_page.dart';
// import 'package:mobile_nirwana/views/profile/profile_page.dart';
// import 'package:mobile_nirwana/views/properties/properties_page.dart';

// class Layout extends StatefulWidget {
//   final int initialIndex;
//   const Layout({Key? key, this.initialIndex = 0}) : super(key: key);

//   @override
//   _LayoutState createState() => _LayoutState();
// }

// class _LayoutState extends State<Layout> {
//   late int _selectedIndex;

//   @override
//   void initState() {
//     super.initState();
//     _selectedIndex = widget.initialIndex;
//   }

//   final List<Widget> _pages = [
//     HomePage(),
//     PropertiesPage(),
//     KprPage(),
//     ProfilePage(),
//   ];

//   void _onItemTapped(int index) {
//     setState(() {
//       _selectedIndex = index;
//     });
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.grey[50],
//       body: _pages[_selectedIndex],
//       bottomNavigationBar: _buildBottomNavigation(),
//     );
//   }

//   Widget _buildBottomNavigation() {
//     return Container(
//       decoration: BoxDecoration(
//         color: Colors.white,
//         boxShadow: [
//           BoxShadow(
//             color: Colors.grey.withOpacity(0.1),
//             blurRadius: 10,
//             offset: Offset(0, -2),
//           ),
//         ],
//       ),
//       child: BottomNavigationBar(
//         currentIndex: _selectedIndex,
//         onTap: _onItemTapped,
//         type: BottomNavigationBarType.fixed,
//         backgroundColor: Colors.white,
//         selectedItemColor: const Color(0xFFDBB837),
//         unselectedItemColor: Colors.grey[400],
//         items: const [
//           BottomNavigationBarItem(
//             icon: Icon(Icons.home_outlined),
//             activeIcon: Icon(Icons.home),
//             label: 'Home',
//           ),
//           BottomNavigationBarItem(
//             icon: Icon(Icons.explore_outlined),
//             activeIcon: Icon(Icons.explore),
//             label: 'Explore',
//           ),
//           BottomNavigationBarItem(
//             icon: Icon(Icons.calculate_outlined),
//             activeIcon: Icon(Icons.calculate),
//             label: 'My Simulation',
//           ),
//           BottomNavigationBarItem(
//             icon: Icon(Icons.person_outline),
//             activeIcon: Icon(Icons.person),
//             label: 'Profile',
//           ),
//         ],
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/views/home/home_page.dart';
import 'package:mobile_nirwana/views/kpr/kpr_page.dart';
import 'package:mobile_nirwana/views/profile/profile_page.dart';
import 'package:mobile_nirwana/views/properties/properties_page.dart';
import 'package:mobile_nirwana/views/layout_controller.dart';

class Layout extends StatelessWidget {
  const Layout({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Inisialisasi controller Anda
    final LayoutController controller = Get.put(LayoutController());

    final List<Widget> pages = [
      HomePage(),
      PropertiesPage(),
      KprPage(),
      ProfilePage(),
    ];

    return Scaffold(
      backgroundColor: Colors.grey[50],
      // Obx akan otomatis mengubah halaman saat tabIndex di controller berubah
      body: Obx(() => pages[controller.tabIndex.value]),
      // Obx juga akan meng-update BottomNavigationBar
      bottomNavigationBar: Obx(
        () => _buildBottomNavigation(
          currentIndex: controller.tabIndex.value,
          onTap: (index) => controller.changeTabIndex(index),
        ),
      ),
    );
  }

  Widget _buildBottomNavigation(
      {required int currentIndex, required ValueChanged<int> onTap}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            offset: Offset(0, -2),
          ),
        ],
      ),
      child: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: onTap,
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        selectedItemColor: const Color(0xFFDBB837),
        unselectedItemColor: Colors.grey[400],
        items: const [
          BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home),
              label: 'Home'),
          BottomNavigationBarItem(
              icon: Icon(Icons.explore_outlined),
              activeIcon: Icon(Icons.explore),
              label: 'Explore'),
          BottomNavigationBarItem(
              icon: Icon(Icons.calculate_outlined),
              activeIcon: Icon(Icons.calculate),
              label: 'My Simulation'),
          BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              activeIcon: Icon(Icons.person),
              label: 'Profile'),
        ],
      ),
    );
  }
}
