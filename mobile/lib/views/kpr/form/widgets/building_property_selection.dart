import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/data/models/building_property/building_property.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/helper/address.dart';
import 'package:mobile_nirwana/views/kpr/form/simulation_form_controller.dart';
import 'package:mobile_nirwana/widgets/error.dart';
import 'package:mobile_nirwana/widgets/simmer.dart';

class BuildingPropertySelection extends StatefulWidget {
  final List<Property> properties;
  final BuildingProperty? selectedBuildingProperty;
  final Function(BuildingProperty) onBuildingPropertySelected;
  const BuildingPropertySelection({
    Key? key,
    required this.properties,
    this.selectedBuildingProperty,
    required this.onBuildingPropertySelected,
  }) : super(key: key);

  @override
  State<BuildingPropertySelection> createState() =>
      _BuildingPropertySelectionState();
}

class _BuildingPropertySelectionState extends State<BuildingPropertySelection> {
  final SimulationFormController _simulationFormController =
      Get.find<SimulationFormController>();
  String _searchQuery = '';
  String _selectedNameProperty = 'Semua';

  List<String> get propertyNames {
    final names = widget.properties.map((p) => p.name).toSet().toList();
    return ['Semua', ...names];
  }

  List<BuildingProperty> get filteredBuildingProperties {
    var filtered = _simulationFormController.building;

    if (_searchQuery.isNotEmpty) {
      filtered = filtered
          .where(
              (b) => b.name.toLowerCase().contains(_searchQuery.toLowerCase()))
          .toList()
          .obs;
    }

    return filtered;
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      child: Container(
          width: MediaQuery.of(context).size.width * 0.9,
          height: MediaQuery.of(context).size.height * 0.75,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Obx(
            () => Column(
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(20),
                      topRight: Radius.circular(20),
                    ),
                    border: Border(
                      bottom: BorderSide(color: Colors.grey[200]!, width: 1),
                    ),
                  ),
                  child: Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'Pilih Bangunan Properti',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF2D3748),
                          ),
                        ),
                      ),
                      GestureDetector(
                        onTap: () => Navigator.pop(context),
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.grey[100],
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Icon(
                            Icons.close,
                            size: 20,
                            color: Colors.grey[600],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Search and Filter
                Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      // Search Field
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.grey[50],
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.grey[200]!),
                        ),
                        child: TextField(
                          onChanged: (value) =>
                              setState(() => _searchQuery = value),
                          decoration: InputDecoration(
                            hintText:
                                'Cari nama bangunan atau lokasi properti...',
                            hintStyle: TextStyle(color: Colors.grey[500]),
                            prefixIcon:
                                Icon(Icons.search, color: Colors.grey[500]),
                            border: InputBorder.none,
                            contentPadding: const EdgeInsets.all(16),
                          ),
                        ),
                      ),

                      const SizedBox(height: 16),

                      // Filter Type
                      SizedBox(
                        height: 40,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: propertyNames.length,
                          itemBuilder: (context, index) {
                            final propertyName = propertyNames[index];
                            final isSelected =
                                _selectedNameProperty == propertyName;

                            return Padding(
                              padding: EdgeInsets.only(
                                right: index < propertyNames.length - 1 ? 8 : 0,
                              ),
                              child: GestureDetector(
                                onTap: () async {
                                  setState(() =>
                                      _selectedNameProperty = propertyName);

                                  if (propertyName == 'Semua') {
                                    await _simulationFormController
                                        .loadAllBuildings();
                                  } else {
                                    final selectedProperty =
                                        widget.properties.firstWhere(
                                      (p) => p.name == propertyName,
                                      orElse: () => widget.properties.first,
                                    );
                                    await _simulationFormController
                                        .loadBuildingsByProperty(
                                            selectedProperty);
                                  }
                                },
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: isSelected
                                        ? const Color(0xFFD4AF37)
                                        : Colors.grey[100],
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    propertyName,
                                    style: TextStyle(
                                      color: isSelected
                                          ? Colors.white
                                          : Colors.grey[700],
                                      fontSize: 14,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      )
                    ],
                  ),
                ),

                // Building List
                Expanded(
                  child: _simulationFormController.isLoadingBuilding.value
                      ? _simulationFormController
                              .errorMessageBuilding.value.isNotEmpty
                          ? ErrorStateWidget.network(
                              onRetry: () =>
                                  _simulationFormController.loadAllBuildings(),
                            )
                          : ListView.builder(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 24),
                              itemBuilder: (context, index) =>
                                  buildingPropertyShimmer(),
                            )
                      : filteredBuildingProperties.isEmpty
                          ? const Center(
                              child: Text('Tidak ada building property'))
                          : ListView.builder(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 24),
                              itemCount: filteredBuildingProperties.length,
                              itemBuilder: (context, index) {
                                final building =
                                    filteredBuildingProperties[index];
                                final isSelected =
                                    widget.selectedBuildingProperty?.id ==
                                        building.id;
                                return Container(
                                  margin: const EdgeInsets.only(bottom: 16),
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: isSelected
                                        ? const Color(0xFFFFF8E7)
                                        : Colors.white,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                      color: isSelected
                                          ? const Color(0xFFD4AF37)
                                          : Colors.grey[200]!,
                                      width: isSelected ? 2 : 1,
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.grey.withOpacity(0.1),
                                        spreadRadius: 0,
                                        blurRadius: 8,
                                        offset: const Offset(0, 2),
                                      ),
                                    ],
                                  ),
                                  child: InkWell(
                                    onTap: () => widget
                                        .onBuildingPropertySelected(building),
                                    borderRadius: BorderRadius.circular(16),
                                    child: Row(
                                      children: [
                                        // Building Image
                                        Container(
                                          width: 80,
                                          height: 80,
                                          decoration: BoxDecoration(
                                            borderRadius:
                                                BorderRadius.circular(12),
                                          ),
                                          child: ClipRRect(
                                            borderRadius:
                                                BorderRadius.circular(12),
                                            child: Image.network(
                                              _getBuildingImage(building),
                                              fit: BoxFit.cover,
                                              errorBuilder:
                                                  (context, error, stackTrace) {
                                                return Container(
                                                  decoration: BoxDecoration(
                                                    gradient: LinearGradient(
                                                      colors: [
                                                        Colors.blue[100]!,
                                                        Colors.blue[50]!
                                                      ],
                                                      begin: Alignment.topLeft,
                                                      end:
                                                          Alignment.bottomRight,
                                                    ),
                                                  ),
                                                  child: Center(
                                                    child: Icon(
                                                      Icons.villa,
                                                      size: 32,
                                                      color: Colors.blue[300],
                                                    ),
                                                  ),
                                                );
                                              },
                                            ),
                                          ),
                                        ),

                                        const SizedBox(width: 16),

                                        // Building Info
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Row(
                                                mainAxisAlignment:
                                                    MainAxisAlignment
                                                        .spaceBetween,
                                                children: [
                                                  Expanded(
                                                    child: Text(
                                                      building.name,
                                                      style: TextStyle(
                                                        fontSize: 16,
                                                        fontWeight:
                                                            FontWeight.bold,
                                                        color: isSelected
                                                            ? const Color(
                                                                0xFFD4AF37)
                                                            : Colors.black87,
                                                      ),
                                                    ),
                                                  ),
                                                  if (isSelected)
                                                    const Icon(
                                                      Icons.check_circle,
                                                      color: Color(0xFFD4AF37),
                                                      size: 20,
                                                    ),
                                                ],
                                              ),
                                              const SizedBox(height: 8),
                                              Row(
                                                children: [
                                                  Icon(
                                                    Icons.location_on,
                                                    size: 14,
                                                    color: Colors.grey[400],
                                                  ),
                                                  const SizedBox(width: 4),
                                                  Expanded(
                                                    child: Text(
                                                      AddressHelper
                                                          .formatSingleLine(
                                                              building.property
                                                                  ?.address),
                                                      style: TextStyle(
                                                        fontSize: 12,
                                                        color: Colors.grey[600],
                                                      ),
                                                    ),
                                                  ),
                                                ],
                                              ),
                                              const SizedBox(height: 8),
                                              Text(
                                                'Rp ${building.price.toStringAsFixed(0)} ${building.price_unit}',
                                                style: TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.bold,
                                                  color: isSelected
                                                      ? const Color(0xFFD4AF37)
                                                      : const Color(0xFFDBB837),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                ),

                const SizedBox(height: 16),
              ],
            ),
          )),
    );
  }

  Widget buildingPropertyShimmer() {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey[200]!),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // Gambar kotak shimmer
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          const SizedBox(width: 16),

          // Info shimmer
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: double.infinity,
                  height: 16,
                  color: Colors.grey[300],
                ),
                const SizedBox(height: 8),
                Container(
                  width: 150,
                  height: 12,
                  color: Colors.grey[300],
                ),
                const SizedBox(height: 8),
                Container(
                  width: 100,
                  height: 14,
                  color: Colors.grey[300],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

String _getBuildingImage(BuildingProperty building) {
  if (building.images.isNotEmpty && building.images.first.image_url != null) {
    return Imgurl.get(
        'building_property/building_images/${building.images.first.image_url!}');
  }
  return "";
}
