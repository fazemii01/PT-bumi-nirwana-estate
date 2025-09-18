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
    this.icon = Icons.wifi_off_outlined,
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
              width: 60,
              height: 60,
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
                icon ?? Icons.wifi_off_outlined,
                size: 30,
                color: _errorColor,
              ),
            ),
            const SizedBox(height: 20),

            // Error title
            Text(
              title ?? 'Terjadi Kesalahan',
              style: TextStyle(
                fontSize: 20,
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
                  fontSize: 14,
                  color: Colors.grey[600],
                  height: 1.5,
                  letterSpacing: 0.1,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 12),

            // Retry button (conditional)
            if (showButton && onRetry != null) ...[
              Container(
                width: 50,
                height: 50,
                // decoration: BoxDecoration(
                //   color: Colors.white,
                //   shape: BoxShape.circle,
                //   border: Border.all(
                //     color: Colors.grey[200]!,
                //     width: 1,
                //   ),
                // ),
                child: IconButton(
                  padding: EdgeInsets.zero,
                  icon: Icon(
                    Icons.refresh_outlined,
                    size: 35,
                    color: Colors.grey[400],
                  ),
                  onPressed: onRetry,
                ),
              ),
              const SizedBox(height: 16),
            ],
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
