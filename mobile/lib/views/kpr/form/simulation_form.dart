import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:mobile_nirwana/helper/price.dart';
import 'dart:math';

class SimulationForm extends StatefulWidget {
  const SimulationForm({Key? key}) : super(key: key);

  @override
  State<SimulationForm> createState() => _SimulationFormState();
}

class _SimulationFormState extends State<SimulationForm> {
  final _formKey = GlobalKey<FormState>();
  final _propertyPriceController = TextEditingController();
  final _downPaymentController = TextEditingController();
  final _interestRateController = TextEditingController();

  int _selectedTenure = 15;
  String _selectedBank = '';
  double _monthlyInstallment = 0;
  double _totalInterest = 0;
  double _totalPayment = 0;
  bool _isCalculated = false;

  final List<int> _tenureOptions = [5, 10, 15, 20, 25];
  final List<Map<String, dynamic>> _bankOptions = [
    {'name': 'Bank BRI', 'id': 'BRI', 'rate': 6.5},
    {'name': 'Bank BNI', 'id': 'BNI', 'rate': 6.75},
    {'name': 'Bank Mandiri', 'id': 'MANDIRI', 'rate': 6.8},
    {'name': 'Bank BCA', 'id': 'BCA', 'rate': 6.9},
    {'name': 'Bank BTN', 'id': 'BTN', 'rate': 6.25},
  ];

  @override
  void initState() {
    super.initState();
    _selectedBank = _bankOptions.first['id'];
    _interestRateController.text = _bankOptions.first['rate'].toString();
  }

  @override
  void dispose() {
    _propertyPriceController.dispose();
    _downPaymentController.dispose();
    _interestRateController.dispose();
    super.dispose();
  }

  void _resetForm() {
    setState(() {
      _propertyPriceController.clear();
      _downPaymentController.clear();
      _selectedTenure = 15;
      _selectedBank = _bankOptions.first['id'];
      _interestRateController.text = _bankOptions.first['rate'].toString();
      _isCalculated = false;
      _monthlyInstallment = 0;
      _totalInterest = 0;
      _totalPayment = 0;
    });
  }

  void _calculateKPR() {
    if (_formKey.currentState!.validate()) {
      double propertyPrice = double.parse(
          _propertyPriceController.text.replaceAll(RegExp(r'[^0-9]'), ''));
      double downPayment = double.parse(
          _downPaymentController.text.replaceAll(RegExp(r'[^0-9]'), ''));
      double interestRate = double.parse(_interestRateController.text) / 100;

      double loanAmount = propertyPrice - downPayment;
      double monthlyRate = interestRate / 12;
      int totalMonths = _selectedTenure * 12;

      // Rumus perhitungan cicilan KPR
      double monthlyInstallment = loanAmount *
          (monthlyRate * pow(1 + monthlyRate, totalMonths)) /
          (pow(1 + monthlyRate, totalMonths) - 1);

      double totalPayment = monthlyInstallment * totalMonths;
      double totalInterest = totalPayment - loanAmount;

      setState(() {
        _monthlyInstallment = monthlyInstallment;
        _totalInterest = totalInterest;
        _totalPayment = totalPayment;
        _isCalculated = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
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
                _buildResultCard(),
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

          // Harga Property
          _buildLabel('Harga Properti'),
          _buildCurrencyField(
            controller: _propertyPriceController,
            hintText: 'Masukkan harga properti',
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Harga properti harus diisi';
              }
              return null;
            },
          ),
          const SizedBox(height: 20),

          // Uang Muka
          _buildLabel('Uang Muka (DP)'),
          _buildCurrencyField(
            controller: _downPaymentController,
            hintText: 'Masukkan uang muka',
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Uang muka harus diisi';
              }
              return null;
            },
          ),
          const SizedBox(height: 20),

          // Bank
          _buildLabel('Pilih Bank'),
          _buildBankDropdown(),
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

  Widget _buildResultCard() {
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
            'Hasil Simulasi',
            style: TextStyle(
              color: Color(0xFF2D3748),
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 24),

          // Cicilan Bulanan
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFF667EEA).withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                const Text(
                  'Cicilan per Bulan',
                  style: TextStyle(
                    color: Color(0xFF667EEA),
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  formatPrice(_monthlyInstallment),
                  style: const TextStyle(
                    color: Color(0xFF667EEA),
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Total Interest & Payment
          Row(
            children: [
              Expanded(
                child: _buildResultItem('Total Bunga', _totalInterest),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildResultItem('Total Pembayaran', _totalPayment),
              ),
            ],
          ),

          const SizedBox(height: 20),
          _buildLoanBreakdown(),
        ],
      ),
    );
  }

  Widget _buildLoanBreakdown() {
    double propertyPrice = double.tryParse(
            _propertyPriceController.text.replaceAll(RegExp(r'[^0-9]'), '')) ??
        0;
    double downPayment = double.tryParse(
            _downPaymentController.text.replaceAll(RegExp(r'[^0-9]'), '')) ??
        0;
    double loanAmount = propertyPrice - downPayment;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Rincian Pinjaman',
          style: TextStyle(
            color: Color(0xFF2D3748),
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 12),
        _buildBreakdownItem('Harga Properti', propertyPrice),
        _buildBreakdownItem('Uang Muka', downPayment),
        const Divider(height: 24),
        _buildBreakdownItem('Jumlah Pinjaman', loanAmount, isHighlighted: true),
      ],
    );
  }

  Widget _buildBreakdownItem(String label, double value,
      {bool isHighlighted = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: isHighlighted
                  ? const Color(0xFF2D3748)
                  : const Color(0xFF718096),
              fontSize: 14,
              fontWeight: isHighlighted ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
          Text(
            formatPrice(value),
            style: TextStyle(
              color: isHighlighted
                  ? const Color(0xFF667EEA)
                  : const Color(0xFF2D3748),
              fontSize: 14,
              fontWeight: isHighlighted ? FontWeight.w700 : FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResultItem(String label, double value) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF7FAFC),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Color(0xFF718096),
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            formatPrice(value),
            style: const TextStyle(
              color: Color(0xFF2D3748),
              fontSize: 14,
              fontWeight: FontWeight.w700,
            ),
            textAlign: TextAlign.center,
          ),
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
            onPressed: _calculateKPR,
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
              onPressed: _resetForm,
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
        hintText: hintText,
        prefixText: 'Rp ',
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
      controller: _interestRateController,
      keyboardType: const TextInputType.numberWithOptions(decimal: true),
      inputFormatters: [
        FilteringTextInputFormatter.allow(RegExp(r'[0-9.]')),
      ],
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Suku bunga harus diisi';
        }
        return null;
      },
      decoration: InputDecoration(
        hintText: 'Masukkan suku bunga',
        suffixText: '%',
        suffixStyle: const TextStyle(
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

  Widget _buildBankDropdown() {
    return DropdownButtonFormField<String>(
      value: _selectedBank,
      decoration: InputDecoration(
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
      items: _bankOptions.map((bank) {
        return DropdownMenuItem<String>(
          value: bank['id'],
          child: Text(
            '${bank['name']} (${bank['rate']}%)',
            style: const TextStyle(
              color: Color(0xFF2D3748),
              fontSize: 14,
            ),
          ),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          _selectedBank = value!;
          final selectedBankData =
              _bankOptions.firstWhere((bank) => bank['id'] == value);
          _interestRateController.text = selectedBankData['rate'].toString();
        });
      },
    );
  }

  Widget _buildTenureSelector() {
    return Container(
      height: 50,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _tenureOptions.length,
        itemBuilder: (context, index) {
          final tenure = _tenureOptions[index];
          final isSelected = _selectedTenure == tenure;

          return Padding(
            padding: EdgeInsets.only(
                right: index < _tenureOptions.length - 1 ? 12 : 0),
            child: GestureDetector(
              onTap: () {
                setState(() {
                  _selectedTenure = tenure;
                });
              },
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                decoration: BoxDecoration(
                  color:
                      isSelected ? Color(0xFFE4B61A) : const Color(0xFFF7FAFC),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isSelected ? Color(0xFFE4B61A) : Colors.transparent,
                    width: 2,
                  ),
                ),
                child: Text(
                  '$tenure Tahun',
                  style: TextStyle(
                    color: isSelected ? Colors.white : const Color(0xFF2D3748),
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

// Currency Input Formatter
class CurrencyInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    if (newValue.selection.baseOffset == 0) {
      return newValue;
    }

    double value = double.parse(newValue.text);
    final formatter = NumberFormat.decimalPattern('id_ID');
    String newText = formatter.format(value);

    return newValue.copyWith(
      text: newText,
      selection: TextSelection.collapsed(offset: newText.length),
    );
  }
}
