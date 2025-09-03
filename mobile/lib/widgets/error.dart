import 'package:flutter/material.dart';

class ErrorStateWidget extends StatelessWidget {
  final String? title;
  final String? message;
  final String? buttonText;
  final VoidCallback? onRetry;
  final IconData? icon;
  final bool showButton;
  final Color? primaryColor;

  const ErrorStateWidget({
    Key? key,
    this.title,
    this.message,
    this.buttonText,
    this.onRetry,
    this.icon,
    this.showButton = true,
    this.primaryColor,
  }) : super(key: key);

  // Named constructors for different error types
  const ErrorStateWidget.network({
    Key? key,
    this.onRetry,
    this.primaryColor,
  })  : title = 'Koneksi Bermasalah',
        message = 'Periksa koneksi internet Anda\ndan coba lagi',
        buttonText = 'Coba Lagi',
        icon = Icons.wifi_off_rounded,
        showButton = true,
        super(key: key);

  const ErrorStateWidget.server({
    Key? key,
    this.onRetry,
    this.primaryColor,
  })  : title = 'Server Error',
        message =
            'Terjadi kesalahan pada server\nSilakan coba beberapa saat lagi',
        buttonText = 'Coba Lagi',
        icon = Icons.cloud_off_rounded,
        showButton = true,
        super(key: key);

  const ErrorStateWidget.notFound({
    Key? key,
    this.onRetry,
    this.primaryColor,
  })  : title = 'Data Tidak Ditemukan',
        message = 'Data yang Anda cari tidak tersedia\natau telah dihapus',
        buttonText = 'Muat Ulang',
        icon = Icons.search_off_rounded,
        showButton = true,
        super(key: key);

  const ErrorStateWidget.unauthorized({
    Key? key,
    this.onRetry,
    this.primaryColor,
  })  : title = 'Akses Ditolak',
        message = 'Anda tidak memiliki izin\nuntuk mengakses data ini',
        buttonText = 'Login Ulang',
        icon = Icons.lock_outline_rounded,
        showButton = true,
        super(key: key);

  const ErrorStateWidget.timeout({
    Key? key,
    this.onRetry,
    this.primaryColor,
  })  : title = 'Request Timeout',
        message =
            'Permintaan membutuhkan waktu terlalu lama\nSilakan coba lagi',
        buttonText = 'Coba Lagi',
        icon = Icons.timer_off_rounded,
        showButton = true,
        super(key: key);

  const ErrorStateWidget.custom({
    Key? key,
    required this.title,
    required this.message,
    this.buttonText = 'Coba Lagi',
    this.onRetry,
    this.icon = Icons.error_outline_rounded,
    this.showButton = true,
    this.primaryColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final Color _primaryColor = primaryColor ?? const Color(0xFFDBB837);
    final Color _errorColor = Colors.red[400]!;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Error icon with gradient background
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    _errorColor.withOpacity(0.1),
                    _errorColor.withOpacity(0.05),
                  ],
                ),
              ),
              child: Icon(
                icon ?? Icons.error_outline_rounded,
                size: 60,
                color: _errorColor,
              ),
            ),
            const SizedBox(height: 32),

            // Error title
            Text(
              title ?? 'Terjadi Kesalahan',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1A1A1A),
                letterSpacing: -0.5,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),

            // Error message
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                message ??
                    'Mohon maaf, terjadi kesalahan\nSilakan coba lagi nanti',
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

            // Retry button (conditional)
            if (showButton && onRetry != null) ...[
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: _primaryColor.withOpacity(0.3),
                      blurRadius: 12,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),
                child: ElevatedButton.icon(
                  onPressed: onRetry,
                  icon: Container(
                    padding: EdgeInsets.all(2),
                    child: Icon(
                      Icons.refresh_rounded,
                      size: 20,
                    ),
                  ),
                  label: Text(
                    buttonText ?? 'Coba Lagi',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.3,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _primaryColor,
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
            ],

            // Secondary action button (optional)
            if (showButton) ...[
              TextButton.icon(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                icon: Icon(
                  Icons.arrow_back_rounded,
                  size: 18,
                  color: Colors.grey[600],
                ),
                label: Text(
                  'Kembali',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],

            const SizedBox(height: 24),

            // Error info box
            Container(
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
                      'Jika masalah terus berlanjut, silakan hubungi tim support kami',
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.red[800],
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
}

// Extension untuk kemudahan penggunaan
extension ErrorStateExtension on Widget {
  Widget onError({
    required bool hasError,
    String? errorTitle,
    String? errorMessage,
    VoidCallback? onRetry,
    Color? primaryColor,
  }) {
    if (hasError) {
      return ErrorStateWidget.custom(
        title: errorTitle,
        message: errorMessage,
        onRetry: onRetry,
        primaryColor: primaryColor,
      );
    }
    return this;
  }
}
