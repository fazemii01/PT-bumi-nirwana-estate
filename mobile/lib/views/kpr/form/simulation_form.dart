import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/data/models/bank.dart';
import 'package:mobile_nirwana/data/models/building_property/building_property.dart';
import 'package:mobile_nirwana/helper/address.dart';
import 'package:mobile_nirwana/helper/price.dart';
import 'package:mobile_nirwana/views/kpr/form/widgets/bank_simulation.dart';

import 'package:mobile_nirwana/views/kpr/form/simulation_form_controller.dart';
import 'package:mobile_nirwana/views/kpr/form/widgets/building_property_selection.dart';
import 'package:mobile_nirwana/views/kpr/form/widgets/tenure_selection_modal.dart';
import 'package:mobile_nirwana/widgets/currency_input_formater.dart';

class SimulationForm extends StatefulWidget {
  const SimulationForm({Key? key}) : super(key: key);

  @override
  State<SimulationForm> createState() => _SimulationFormState();
}

class _SimulationFormState extends State<SimulationForm> {
  final SimulationFormController _simulationFormController =
      Get.put(SimulationFormController());

  final _formKey = GlobalKey<FormState>();

  int? _maxTenure;
  bool _isCalculated = false;

  String? _bankError;
  String? _tenureError;
  String? _propertyError;

  @override
  void initState() {
    super.initState();

    if (Get.arguments != null && Get.arguments is String) {
      final String buildingId = Get.arguments;

      once(_simulationFormController.building,
          (List<BuildingProperty> buildingList) {
        final selectedProp =
            buildingList.firstWhereOrNull((b) => b.id == buildingId);

        if (selectedProp != null) {
          setState(() {
            _simulationFormController.selectedBuildingProperty = selectedProp;
            _simulationFormController.buildingId.value = selectedProp.id;
            _simulationFormController.buildingPriceController.text =
                'Rp ${formatPrice(selectedProp.price)}';
          });
        }
      });
    }
  }

  void _showBankSelectionModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => BankSelectionModal(
        banks: _simulationFormController.banks,
        selectedBank: _simulationFormController.selectedBank,
        onBankSelected: (Bank bank) {
          setState(() {
            _simulationFormController.bankId.value = bank.id;
            _simulationFormController.selectedBank = bank;
            _maxTenure = bank.max_tenure;
            _simulationFormController.interest_rate.text =
                bank.interest_rate.toString();
          });
          Navigator.pop(context);
        },
      ),
    );
  }

  void _showTenureSelectionModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => TenureSelectionModal(
        selectedTenure: _simulationFormController.tenure,
        maxTenure: _maxTenure,
        onTenureSelected: (int tenure) {
          setState(() {
            _simulationFormController.tenure = tenure;
          });
          Navigator.pop(context);
        },
      ),
    );
  }

  void _showBuildingSelectionModal() {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) => BuildingPropertySelection(
        properties: _simulationFormController.properties,
        selectedBuildingProperty:
            _simulationFormController.selectedBuildingProperty,
        onBuildingPropertySelected: (BuildingProperty building) {
          setState(() {
            _simulationFormController.selectedBuildingProperty = building;
            _simulationFormController.buildingId.value = building.id;
            _simulationFormController.buildingPriceController.text =
                'Rp ${formatPrice(building.price)}';
          });
          Navigator.pop(context);
        },
      ),
    );
  }

  void _calculateKPR() {
    if (_simulationFormController.selectedBuildingProperty == null) {
      setState(() {
        _propertyError = "Silahkan pilih property dahulu";
      });
      return;
    }
    if (_formKey.currentState!.validate()) {
      if (_simulationFormController.selectedBank == null) {
        setState(() {
          _bankError = "Silakan pilih bank terlebih dahulu";
        });
        return;
      }
      if (_simulationFormController.tenure == null) {
        setState(() {
          _tenureError = "Silakan pilih jangka waktu terlebih dahulu";
        });
        return;
      }
      _simulationFormController.handleCalculateKpr();

      // setState(() {
      //   _monthlyInstallment = monthlyInstallment;
      //   _totalInterest = totalInterest;
      //   _totalPayment = totalPayment;
      //   _isCalculated = true;
      // });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        scrolledUnderElevation: 0,
        surfaceTintColor: Colors.transparent,
        title: const Text(
          'Simulasi KPR',
          style: TextStyle(
            color: Color(0xFF2D3748),
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF2D3748)),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeaderCard(),
              const SizedBox(height: 24),
              _buildFormCard(),
              const SizedBox(height: 24),
              if (_isCalculated) ...[
                // _buildResultCard(),
                const SizedBox(height: 24),
              ],
              _buildActionButtons(),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeaderCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFFDBB837), Color(0xFFF59E0B)]),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Color(0xFFDBB837).withOpacity(0.4),
            blurRadius: 20,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          const Icon(
            Icons.home,
            color: Colors.white,
            size: 48,
          ),
          const SizedBox(height: 16),
          const Text(
            'Simulasi Kredit Perumahan',
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.w700,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          const Text(
            'Hitung cicilan KPR impian Anda',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 14,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildFormCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Informasi Kredit',
            style: TextStyle(
              color: Color(0xFF2D3748),
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 24),

          _buildLabel('Pilih Properti'),
          _buildPropertySelector(),
          const SizedBox(height: 20),

          if (_simulationFormController.selectedBuildingProperty != null) ...[
            _buildLabel('Harga Properti'),
            _buildCurrencyField(
              controller: _simulationFormController.buildingPriceController,
              hintText: 'Masukkan harga properti',
              enable: false,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Harga properti harus diisi';
                }
                return null;
              },
            ),
            const SizedBox(height: 20),
          ],
          const SizedBox(height: 20),

          // Uang Muka
          _buildLabel('Uang Muka (DP)'),
          _buildCurrencyField(
            controller: _simulationFormController.down_payment,
            hintText: 'Masukkan uang muka',
            prefixText: 'Rp',
            enable: true,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Uang muka harus diisi';
              }
              return null;
            },
          ),
          const SizedBox(height: 20),

          _buildLabel('Pilih Bank'),
          _buildBankTextField(),
          const SizedBox(height: 20),

          // Suku Bunga
          _buildLabel('Suku Bunga (% per tahun)'),
          _buildPercentageField(),
          const SizedBox(height: 20),

          // Jangka Waktu
          _buildLabel('Jangka Waktu'),
          _buildTenureSelector(),
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          height: 50,
          child: ElevatedButton(
            onPressed: () {
              _calculateKPR();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Color(0xFFE4B61A),
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text(
              'Hitung Simulasi',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ),
        if (_isCalculated) ...[
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: OutlinedButton(
              onPressed: () {},
              style: OutlinedButton.styleFrom(
                foregroundColor: const Color(0xFF667EEA),
                side: const BorderSide(color: Color(0xFF667EEA)),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Reset Form',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        text,
        style: const TextStyle(
          color: Color(0xFF2D3748),
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildCurrencyField({
    required TextEditingController controller,
    required String hintText,
    String? prefixText,
    required bool enable,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: TextInputType.number,
      inputFormatters: [
        FilteringTextInputFormatter.digitsOnly,
        CurrencyInputFormatter(),
      ],
      validator: validator,
      decoration: InputDecoration(
        enabled: enable,
        hintText: hintText,
        hintStyle: const TextStyle(
          color: Colors.grey,
          fontSize: 16,
          fontWeight: FontWeight.w400,
        ),
        prefixText: prefixText != null ? '$prefixText ' : '',
        prefixStyle: const TextStyle(
          color: Color(0xFF2D3748),
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
        filled: true,
        fillColor: const Color(0xFFF7FAFC),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFE4B61A), width: 1),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFE53E3E), width: 1),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFE53E3E), width: 2),
        ),
      ),
    );
  }

  Widget _buildPercentageField() {
    return TextFormField(
      controller: _simulationFormController.interest_rate,
      keyboardType: const TextInputType.numberWithOptions(decimal: true),
      inputFormatters: [
        FilteringTextInputFormatter.allow(RegExp(r'[0-9.]')),
      ],
      decoration: InputDecoration(
        enabled: false,
        hintText: 'Otomatis dari pilihan bank',
        suffixText: '%',
        suffixStyle: const TextStyle(
          color: Colors.black87,
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
        filled: true,
        fillColor: const Color(0xFFF7FAFC),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFE4B61A), width: 1),
        ),
      ),
    );
  }

  Widget _buildBankTextField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GestureDetector(
          onTap: () {
            _showBankSelectionModal();
            setState(() {
              _bankError = null;
            });
          },
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: const Color(0xFFF7FAFC),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: _bankError != null ? Colors.red : Colors.transparent,
                width: 1.5,
              ),
            ),
            child: Row(
              children: [
                if (_simulationFormController.selectedBank?.logo != null) ...[
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.network(
                      Imgurl.get(
                          'banks/${_simulationFormController.selectedBank!.logo}'),
                      width: 32,
                      height: 32,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: Colors.blue[100],
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(
                            Icons.account_balance,
                            size: 16,
                            color: Color(0xFFE4B61A),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                ],
                Expanded(
                  child: Text(
                    _simulationFormController.selectedBank?.name ??
                        'Pilih Bank',
                    style: TextStyle(
                      color: _simulationFormController.selectedBank != null
                          ? Colors.black87
                          : Colors.grey[500],
                      fontSize: 16,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ),
                Icon(
                  Icons.keyboard_arrow_down,
                  color: Colors.grey[600],
                  size: 24,
                ),
              ],
            ),
          ),
        ),
        if (_bankError != null) ...[
          const SizedBox(height: 6),
          Text(
            _bankError!,
            style: const TextStyle(color: Colors.red, fontSize: 12),
          ),
        ]
      ],
    );
  }

  Widget _buildTenureSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GestureDetector(
          onTap: () {
            _simulationFormController.selectedBank == null
                ? _bankError = 'Silakan pilih bank terlebih dahulu'
                : _showTenureSelectionModal();
            setState(() {
              _tenureError = null;
            });
          },
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
                color: const Color(0xFFF7FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                    color:
                        _tenureError != null ? Colors.red : Colors.transparent,
                    width: 1)),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    _simulationFormController.tenure != null
                        ? '${_simulationFormController.tenure} Tahun'
                        : 'Pilih Jangka Waktu',
                    style: TextStyle(
                      color: _simulationFormController.tenure != null
                          ? Colors.black87
                          : Colors.grey[500],
                      fontSize: 16,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ),
                Icon(
                  Icons.keyboard_arrow_down,
                  color: Colors.grey[600],
                  size: 24,
                ),
              ],
            ),
          ),
        ),
        if (_tenureError != null) ...[
          const SizedBox(height: 6),
          Text(
            _tenureError!,
            style: const TextStyle(color: Colors.red, fontSize: 12),
          ),
        ]
      ],
    );
  }

  Widget _buildPropertySelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GestureDetector(
          onTap: () {
            _showBuildingSelectionModal();
            setState(() {
              _propertyError = null;
            });
          },
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: const Color(0xFFF7FAFC),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: _propertyError != null ? Colors.red : Colors.transparent,
                width: 1,
              ),
            ),
            child: Row(
              children: [
                if (_simulationFormController
                        .selectedBuildingProperty?.images !=
                    null) ...[
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.network(
                      Imgurl.get(
                          'building_property/building_images/${_getBuildingImage(_simulationFormController.selectedBuildingProperty!)}'),
                      width: 40,
                      height: 40,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: Colors.blue[100],
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Icon(
                            Icons.villa,
                            size: 20,
                            color: Colors.blue[600],
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                ],
                // Property info
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _simulationFormController
                                .selectedBuildingProperty?.name ??
                            'Pilih Properti',
                        style: TextStyle(
                          color: _simulationFormController
                                      .selectedBuildingProperty !=
                                  null
                              ? Colors.black87
                              : Colors.grey[500],
                          fontSize: 16,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                      if (_simulationFormController.selectedBuildingProperty !=
                          null) ...[
                        const SizedBox(height: 2),
                        Text(
                          AreaHelper.formatSingleLine(_simulationFormController
                              .selectedBuildingProperty!.property!.address),
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                // Arrow icon
                Icon(
                  Icons.keyboard_arrow_down,
                  color: Colors.grey[600],
                  size: 24,
                ),
              ],
            ),
          ),
        ),
        if (_propertyError != null) ...[
          const SizedBox(height: 6),
          Text(
            _propertyError!,
            style: const TextStyle(color: Colors.red, fontSize: 12),
          ),
        ]
      ],
    );
  }
}

String _getBuildingImage(BuildingProperty building) {
  if (building.images.isNotEmpty && building.images[0].image_url != null) {
    return building.images[0].image_url!;
  }
  return "";
}
