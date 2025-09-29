import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/data/models/building_property/building_property.dart';
import 'package:mobile_nirwana/data/models/loan-simulation.dart';
import 'package:mobile_nirwana/helper/price.dart';
import 'package:mobile_nirwana/views/kpr/kpr_controller.dart';
import 'package:mobile_nirwana/views/layout_controller.dart';
import 'package:mobile_nirwana/widgets/error.dart';
import 'package:mobile_nirwana/widgets/sceleton_simulation.dart';

class KprPage extends StatefulWidget {
  const KprPage({super.key});

  @override
  State<KprPage> createState() => _KprPageState();
}

class _KprPageState extends State<KprPage> {
  final KprController _kprController = Get.put(KprController());
  final LayoutController _layoutController = Get.put(LayoutController());
  bool _isSearching = false;
  bool _isSelectionMode = false;
  LoanSimulation? _selectedSimulation;
  TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _layoutController.loadUserStatus();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _exitSelectionMode() {
    setState(() {
      _isSelectionMode = false;
      _selectedSimulation = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.grey[50],
        appBar: AppBar(
          leading: _isSelectionMode
              ? IconButton(
                  icon: const Icon(Icons.close, color: Colors.black),
                  onPressed: _exitSelectionMode,
                )
              : null,
          title: _isSelectionMode
              ? Text(
                  '1 dipilih',
                  style: TextStyle(
                    color: Color(0xFF1A1A1A),
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                )
              : _isSearching
                  ? TextField(
                      controller: _searchController,
                      autofocus: true,
                      decoration: InputDecoration(
                        hintText: 'Cari histori simulasi...',
                        hintStyle: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 16,
                        ),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(vertical: 15),
                      ),
                      style: TextStyle(
                        color: Color(0xFF1A1A1A),
                        fontSize: 16,
                        fontWeight: FontWeight.w400,
                      ),
                      onSubmitted: (value) {
                        print('Search query: $value');
                      },
                    )
                  : const Text(
                      'Histori Simulasi KPR',
                      style: TextStyle(
                        color: Color(0xFF1A1A1A),
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.3,
                      ),
                    ),
          backgroundColor: Colors.white,
          scrolledUnderElevation: 0,
          surfaceTintColor: Colors.transparent,
          elevation: 0,
          actions: _isSelectionMode
              ? [
                  IconButton(
                    icon: const Icon(
                      Icons.delete_outline,
                      color: Colors.red,
                    ),
                    onPressed: () {
                      if (_selectedSimulation != null) {
                        _showDeleteDialog(_selectedSimulation!);
                      }
                    },
                  ),
                ]
              : [
                  IconButton(
                    icon: Icon(
                      _isSearching ? Icons.close : Icons.search,
                      color: Colors.black,
                    ),
                    onPressed: () {
                      setState(() {
                        _isSearching = !_isSearching;
                        if (!_isSearching) {
                          _searchController.clear();
                        }
                      });
                    },
                  ),
                ],
        ),
        body: Obx(
          () => !_layoutController.isLoggedIn.value
              ? _buildLoginRequiredState()
              : _kprController.isLoading.value
                  ? Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: ListView.builder(
                        itemCount: 4,
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemBuilder: (context, index) =>
                            const SimulationCardSkeleton(),
                      ),
                    )
                  : _kprController.errorMessage.value.isNotEmpty
                      ? ErrorStateWidget.custom(
                          title: 'Simulasi Gagal',
                          message:
                              'Terjadi kesalahan saat\nmemproses simulasi KPR',
                          onRetry: () => _kprController.loadData(),
                        )
                      : _kprController.simulationByUser.isEmpty
                          ? _buildEmptyState()
                          : RefreshIndicator(
                              onRefresh: () async {
                                await _kprController.loadData();
                              },
                              color: Color(0xFFDBB837),
                              backgroundColor: Colors.white,
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: ListView.builder(
                                  physics:
                                      const AlwaysScrollableScrollPhysics(),
                                  itemCount:
                                      _kprController.simulationByUser.length,
                                  itemBuilder: (context, index) {
                                    final simulation =
                                        _kprController.simulationByUser[index];
                                    return _buildSimulationCard(simulation);
                                  },
                                ),
                              ),
                            ),
        ));
  }

  Widget _buildSimulationCard(LoanSimulation simulation) {
    final isSelected =
        _isSelectionMode && _selectedSimulation?.id == simulation.id;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: isSelected ? Color(0xFFDBB837).withOpacity(0.1) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isSelected ? Color(0xFFDBB837) : Colors.grey.withOpacity(0.2),
          width: isSelected ? 2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Main Content
          InkWell(
            onTap: () {
              if (_isSelectionMode) {
                setState(() {
                  if (_selectedSimulation?.id == simulation.id) {
                    _exitSelectionMode();
                  } else {
                    _selectedSimulation = simulation;
                  }
                });
              } else {
                Get.toNamed(
                  Routes.HASIL_SIMULATION,
                  arguments: {
                    "breakdown": simulation.breakdown!.take(12).toList(),
                    "loanSimulation": simulation,
                    "hasil": false
                  },
                );
              }
            },
            onLongPress: () {
              setState(() {
                _isSelectionMode = true;
                _selectedSimulation = simulation;
              });
            },
            borderRadius: BorderRadius.circular(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: IntrinsicHeight(
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Selection Checkbox (when in selection mode)
                        if (_isSelectionMode)
                          Padding(
                            padding: const EdgeInsets.only(right: 12),
                            child: Container(
                              width: 24,
                              height: 24,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: isSelected
                                    ? Color(0xFFDBB837)
                                    : Colors.transparent,
                                border: Border.all(
                                  color: isSelected
                                      ? Color(0xFFDBB837)
                                      : Colors.grey[400]!,
                                  width: 2,
                                ),
                              ),
                              child: isSelected
                                  ? Icon(
                                      Icons.check,
                                      size: 16,
                                      color: Colors.white,
                                    )
                                  : null,
                            ),
                          ),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Container(
                            width: 85,
                            height: 85,
                            decoration: BoxDecoration(
                              color: Colors.grey[300],
                            ),
                            child: Image.network(
                              Imgurl.get(
                                  'building_property/building_images/${_getBuildingPropertyImage(simulation.buildingProperty!)}'),
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                return Container(
                                  color: Colors.grey[300],
                                  child: const Icon(
                                    Icons.home,
                                    size: 30,
                                    color: Colors.grey,
                                  ),
                                );
                              },
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        // Property Details
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                simulation.buildingProperty?.property?.name ??
                                    'Property',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.grey[500],
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 4),
                              Text(
                                simulation.buildingProperty?.name ?? "-",
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Harga: ${formatPrice(simulation.buildingProperty?.price ?? 0.0)}',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[600],
                                ),
                              ),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  Expanded(
                                    child: _buildDetailItem(
                                      'Waktu',
                                      '${simulation.tenure} Tahun',
                                      Colors.green[700]!,
                                    ),
                                  ),
                                  Expanded(
                                    child: _buildDetailItem(
                                      'Bunga',
                                      '${simulation.interestRate}%',
                                      Colors.orange[700]!,
                                    ),
                                  ),
                                  Expanded(
                                    child: _buildDetailItem(
                                      'Cicilan',
                                      formatPrice(
                                          simulation.monthlyInstallment!),
                                      Colors.blue[700]!,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Type Badge - Only show when NOT in selection mode
          if (!_isSelectionMode)
            Positioned(
              top: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.grey[700],
                  borderRadius: const BorderRadius.only(
                    topRight: Radius.circular(10),
                    bottomLeft: Radius.circular(12),
                  ),
                ),
                child: Text(
                  simulation.buildingProperty?.property?.type ?? 'Type',
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildDetailItem(String label, String value, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 10,
            color: Colors.grey[600],
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 90,
              height: 90,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFFDBB837).withOpacity(0.1),
                    Color(0xFFDBB837).withOpacity(0.05),
                  ],
                ),
              ),
              child: Icon(
                Icons.calculate_rounded,
                size: 50,
                color: Color(0xFFDBB837),
              ),
            ),
            const SizedBox(height: 32),
            Text(
              'Belum ada simulasi KPR',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1A1A1A),
                letterSpacing: -0.5,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'Mulai rencanakan masa depan Anda dengan\nmembuat simulasi KPR pertama',
                style: TextStyle(
                  fontSize: 13,
                  color: Colors.grey[600],
                  height: 1.5,
                  letterSpacing: 0.1,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 30),
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Color(0xFFDBB837).withOpacity(0.3),
                    blurRadius: 12,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: ElevatedButton.icon(
                onPressed: () => Get.toNamed(Routes.SIMULATION_KPR),
                label: Text(
                  'Buat Simulasi Baru',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.3,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFFDBB837),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    maximumSize: Size(150, 50)),
              ),
            ),
            const SizedBox(height: 16),
            TextButton(
              onPressed: () {},
              child: Text(
                'Pelajari tentang simulasi KPR',
                style: TextStyle(
                  color: Color(0xFFDBB837),
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  decoration: TextDecoration.underline,
                  decorationColor: Color(0xFFDBB837).withOpacity(0.5),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoginRequiredState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFFDBB837).withOpacity(0.1),
                    Color(0xFFDBB837).withOpacity(0.05),
                  ],
                ),
              ),
              child: Icon(
                Icons.person_outline_rounded,
                size: 60,
                color: Color(0xFFDBB837),
              ),
            ),
            const SizedBox(height: 32),
            Text(
              'Login Diperlukan',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1A1A1A),
                letterSpacing: -0.5,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'Silakan login terlebih dahulu untuk\nmelihat histori simulasi KPR Anda',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey[600],
                  height: 1.5,
                  letterSpacing: 0.1,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 40),
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Color(0xFFDBB837).withOpacity(0.3),
                    blurRadius: 12,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: ElevatedButton.icon(
                onPressed: () {},
                icon: Container(
                  padding: EdgeInsets.all(2),
                  child: Icon(
                    Icons.login_rounded,
                    size: 20,
                  ),
                ),
                label: Text(
                  'Login Sekarang',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.3,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFFDBB837),
                  foregroundColor: Colors.white,
                  elevation: 0,
                  padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  minimumSize: Size(200, 52),
                ),
              ),
            ),
            const SizedBox(height: 16),
            OutlinedButton.icon(
              onPressed: () {},
              icon: Icon(
                Icons.person_add_outlined,
                size: 18,
                color: Color(0xFFDBB837),
              ),
              label: Text(
                'Daftar Akun Baru',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFFDBB837),
                  letterSpacing: 0.2,
                ),
              ),
              style: OutlinedButton.styleFrom(
                side: BorderSide(
                  color: Color(0xFFDBB837),
                  width: 1.5,
                ),
                padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                minimumSize: Size(160, 44),
              ),
            ),
            const SizedBox(height: 24),
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue[50],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: Colors.blue[100]!,
                  width: 1,
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.info_outline,
                    color: Colors.blue[700],
                    size: 20,
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Dengan login, Anda dapat menyimpan dan mengelola semua simulasi KPR Anda',
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.blue[800],
                        height: 1.4,
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

  void _showDeleteDialog(LoanSimulation simulation) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          elevation: 8,
          backgroundColor: Colors.white,
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.delete_outline,
                  color: Colors.red.shade400,
                  size: 24,
                ),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Text(
                  'Hapus Simulasi',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                    color: Colors.black87,
                  ),
                ),
              ),
            ],
          ),
          content: Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Text(
              'Apakah Anda yakin ingin menghapus simulasi "${simulation.buildingProperty?.name}"?',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey.shade700,
                height: 1.4,
              ),
            ),
          ),
          actionsPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                _exitSelectionMode();
              },
              style: TextButton.styleFrom(
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(color: Colors.grey.shade300),
                ),
                backgroundColor: Colors.grey.shade50,
              ),
              child: Text(
                'Batal',
                style: TextStyle(
                  color: Colors.grey.shade700,
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            const SizedBox(width: 6),
            Obx(
              () => ElevatedButton(
                onPressed: _kprController.isDelete.value
                    ? null
                    : () {
                        _kprController.remove(simulation.id!, context);
                        _exitSelectionMode();
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: _kprController.isDelete.value
                      ? Colors.red.shade200
                      : Colors.red.shade500,
                  foregroundColor: Colors.white,
                  elevation: _kprController.isDelete.value ? 0 : 2,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  disabledBackgroundColor: Colors.red.shade200,
                ),
                child: _kprController.isDelete.value
                    ? Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          SizedBox(
                            height: 18,
                            width: 18,
                            child: CircularProgressIndicator(
                              strokeWidth: 2.5,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                Colors.red.shade700,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Menghapus...',
                            style: TextStyle(
                              color: Colors.red.shade700,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      )
                    : const Text(
                        'Hapus',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
              ),
            ),
          ],
        );
      },
    );
  }
}

String _getBuildingPropertyImage(BuildingProperty building) {
  if (building.images.isNotEmpty && building.images[0].image_url != null) {
    final url = building.images[0].image_url!;
    return url;
  }
  return "";
}
