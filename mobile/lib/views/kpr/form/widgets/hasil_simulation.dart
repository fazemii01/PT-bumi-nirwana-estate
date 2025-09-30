import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/data/models/loan-simulation.dart';
import 'package:mobile_nirwana/helper/price.dart';
import 'package:mobile_nirwana/views/kpr/form/simulation_form_controller.dart';

class HasilSimulation extends StatefulWidget {
  List<Breakdown> breakdown;
  LoanSimulation loanSimulation;
  bool hasil;

  HasilSimulation(
      {Key? key,
      required this.breakdown,
      required this.loanSimulation,
      required this.hasil})
      : super(key: key);

  @override
  State<HasilSimulation> createState() => _HasilSimulationState();
}

class _HasilSimulationState extends State<HasilSimulation> {
  final SimulationFormController _simulationFormController =
      Get.put(SimulationFormController());
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: const Color(0xFFF5F7FA),
        appBar: AppBar(
          elevation: 0,
          backgroundColor: Colors.white,
          scrolledUnderElevation: 0,
          surfaceTintColor: Colors.transparent,
          title: const Text(
            'Hasil Simulasi KPR',
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
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildResultCard(),
                const SizedBox(height: 16),
                _buildAmortizationCard(),
              ],
            ),
          ),
        ));
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
          // Cicilan Bulanan - Highlighted
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFDBB837), Color(0xFFF59E0B)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                const Text(
                  'Cicilan per Bulan',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  customFormatPrice(widget.loanSimulation.monthlyInstallment!),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        'Bunga ${widget.loanSimulation.bank?.interest_rate}%',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '• ${widget.loanSimulation.tenure} tahun',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.9),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Summary Cards
          Row(
            children: [
              Expanded(
                child: _buildResultItem(
                    'Total Bunga', widget.loanSimulation.total_interest!),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildResultItem(
                    'Total Pembayaran', widget.loanSimulation.total_payment!),
              ),
            ],
          ),

          // const SizedBox(height: 20),
          // _buildLoanBank(),
          const SizedBox(height: 20),
          _buildLoanBreakdown(),
        ],
      ),
    );
  }

  // Widget _buildLoanBank() {
  //   return Container(
  //     margin: const EdgeInsets.only(bottom: 8),
  //     padding: const EdgeInsets.all(3),
  //     decoration: BoxDecoration(
  //       color: Colors.white,
  //       borderRadius: BorderRadius.circular(12),
  //     ),
  //     child: Row(
  //       mainAxisAlignment: MainAxisAlignment.center,
  //       children: [
  //         Container(
  //           width: 40,
  //           height: 40,
  //           decoration: BoxDecoration(
  //             shape: BoxShape.circle,
  //           ),
  //           child: ClipOval(
  //             child: Image.network(
  //               Imgurl.get('banks/${widget.loanSimulation.bank?.logo}'),
  //               width: 20,
  //               height: 20,
  //               fit: BoxFit.cover,
  //               errorBuilder: (context, error, stackTrace) {
  //                 return Container(
  //                   color: Colors.grey.shade200,
  //                   child: Icon(
  //                     Icons.account_balance,
  //                     size: 10,
  //                     color: Colors.grey.shade500,
  //                   ),
  //                 );
  //               },
  //               loadingBuilder: (context, child, loadingProgress) {
  //                 if (loadingProgress == null) return child;
  //                 return Container(
  //                   color: Colors.grey.shade100,
  //                   child: Center(
  //                     child: SizedBox(
  //                       width: 10,
  //                       height: 10,
  //                       child: CircularProgressIndicator(
  //                         strokeWidth: 2,
  //                         valueColor: AlwaysStoppedAnimation<Color>(
  //                           Colors.grey.shade400,
  //                         ),
  //                       ),
  //                     ),
  //                   ),
  //                 );
  //               },
  //             ),
  //           ),
  //         ),
  //       ],
  //     ),
  //   );
  // }

  Widget _buildLoanBreakdown() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Color(0xFFF7FAFC),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Rincian Pinjaman',
                style: TextStyle(
                  color: Color(0xFF2D3748),
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
              Text(
                'Bank ${widget.loanSimulation.bank?.name}',
                style: TextStyle(
                  color: Color(0xFF2D3748),
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        // _buildBreakdownItem(
        //     'Harga Properti', widget.loanSimulation.property?.price ?? 0.0),
        _buildBreakdownItem('Uang Muka', widget.loanSimulation.downPayment!),
        const Divider(height: 24),
        _buildBreakdownItem(
            'Jumlah Pinjaman', widget.loanSimulation.loanAmount!,
            isHighlighted: true),
        _buildBreakdownItem('Suku Bunga',
            double.parse(widget.loanSimulation.interestRate.toString()),
            isPercentage: true),
        _buildBreakdownItem(
            'Jangka Waktu', widget.loanSimulation.tenure!.toDouble(),
            isTenure: true),
      ],
    );
  }

  Widget _buildBreakdownItem(String label, double value,
      {bool isHighlighted = false,
      bool isPercentage = false,
      bool isTenure = false}) {
    String displayValue;
    if (isPercentage) {
      displayValue = '$value% per tahun';
    } else if (isTenure) {
      displayValue = '${value.toInt()} tahun (${(value * 12).toInt()} bulan)';
    } else {
      displayValue = formatPrice(value);
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: isHighlighted ? const EdgeInsets.all(12) : EdgeInsets.zero,
      decoration: isHighlighted
          ? BoxDecoration(
              color: Color(0xFFF7FAFC),
              borderRadius: BorderRadius.circular(8),
            )
          : null,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: isHighlighted ? Colors.black : const Color(0xFF718096),
              fontSize: 14,
              fontWeight: isHighlighted ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
          Text(
            displayValue,
            style: TextStyle(
              color: isHighlighted ? Colors.black : const Color(0xFF2D3748),
              fontSize: 14,
              fontWeight: isHighlighted ? FontWeight.w700 : FontWeight.w600,
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
        border: Border.all(color: const Color(0xFF667EEA).withOpacity(0.2)),
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
            customFormatPrice(value),
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

  Widget _buildAmortizationCard() {
    final totalBulan = widget.loanSimulation.tenure! * 12;
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
            'Tabel Amortisasi (12 Bulan Pertama)',
            style: TextStyle(
              color: Color(0xFF2D3748),
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 20),
          _buildAmortizationTable(),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF3CD),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.info_outline,
                  color: Color(0xFF856404),
                  size: 16,
                ),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Tabel di atas menampilkan 12 bulan pertama. Cicilan akan terus berlanjut hingga $totalBulan bulan.',
                    style: TextStyle(
                      color: Color(0xFF856404),
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ),
          SizedBox(
            height: 10,
          ),
          widget.hasil
              ? SizedBox(
                  width: double.infinity,
                  child: Obx(
                    () => ElevatedButton(
                        onPressed: _simulationFormController.isLoading.value
                            ? null
                            : _simulationFormController.handleSubmit,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color(0xFFE4B61A),
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: _simulationFormController.isLoading.value
                            ? SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation<Color>(
                                        Colors.white)),
                              )
                            : const Text(
                                'Simpan Simulasi',
                                style: TextStyle(
                                    fontSize: 16, fontWeight: FontWeight.w500),
                              )),
                  ))
              : const SizedBox.shrink()
        ],
      ),
    );
  }

  Widget _buildAmortizationTable() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Theme(
        data: Theme.of(context).copyWith(
          dividerColor: const Color(0xFFF1F5F9),
        ),
        child: DataTable(
          headingRowHeight: 48,
          dataRowHeight: 56,
          horizontalMargin: 10,
          columnSpacing: 24,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
          ),
          headingRowColor: MaterialStateProperty.all(
            const Color(0xFFF8FAFC),
          ),
          columns: [
            _buildColumn('Bulan', Icons.calendar_month_outlined),
            _buildColumn('Cicilan', Icons.payments_outlined),
            _buildColumn('Pokok', Icons.trending_up_outlined),
            _buildColumn('Bunga', Icons.percent_outlined),
            _buildColumn('Sisa', Icons.account_balance_outlined),
          ],
          rows: widget.breakdown.asMap().entries.map((entry) {
            final index = entry.key;
            final item = entry.value;
            final isEven = index % 2 == 0;

            return DataRow(
              color: MaterialStateProperty.all(
                isEven ? Colors.transparent : const Color(0xFFFAFBFC),
              ),
              cells: [
                DataCell(
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFF6366F1).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '${item.month}',
                      style: const TextStyle(
                        color: Color(0xFF6366F1),
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ),
                _buildDataCell(
                  'Rp ${formatPrice(item.installment)}',
                  const Color(0xFF1F2937),
                  FontWeight.w600,
                ),
                _buildDataCell(
                  'Rp ${formatPrice(item.principal)}',
                  const Color(0xFF059669),
                  FontWeight.w500,
                ),
                _buildDataCell(
                  'Rp ${formatPrice(item.interest)}',
                  const Color(0xFFDC2626),
                  FontWeight.w500,
                ),
                _buildDataCell(
                  'Rp ${formatPrice(item.remainingBalance)}',
                  const Color(0xFF6B7280),
                  FontWeight.w500,
                ),
              ],
            );
          }).toList(),
        ),
      ),
    );
  }

  DataColumn _buildColumn(String label, IconData icon) {
    return DataColumn(
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 16,
            color: const Color(0xFF6B7280),
          ),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(
              color: Color(0xFF374151),
              fontWeight: FontWeight.w600,
              fontSize: 13,
              letterSpacing: -0.2,
            ),
          ),
        ],
      ),
    );
  }

  DataCell _buildDataCell(String text, Color color, FontWeight weight) {
    return DataCell(
      Text(
        text,
        style: TextStyle(
          color: color,
          fontWeight: weight,
          fontSize: 14,
          letterSpacing: -0.2,
        ),
      ),
    );
  }

  String customFormatPrice(double price) {
    if (price >= 1000000000) {
      return 'Rp ${(price / 1000000000).toStringAsFixed(1)}M';
    } else if (price >= 1000000) {
      return 'Rp ${(price / 1000000).toStringAsFixed(1)}jt';
    } else {
      return 'Rp ${price.toStringAsFixed(0).replaceAllMapped(
            RegExp(r'(\d)(?=(\d{3})+(?!\d))'),
            (Match m) => '${m[1]}.',
          )}';
    }
  }
}
