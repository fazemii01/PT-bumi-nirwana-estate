import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:mobile_nirwana/views/auth/register/register_controller.dart';
import 'package:mobile_nirwana/widgets/customt_text_form_field.dart';
import 'package:mobile_nirwana/widgets/custom_text_password.dart';

class RegisterPage extends StatefulWidget {
  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage>
    with TickerProviderStateMixin {
  final RegisterController _registerController = Get.put(RegisterController());

  late AnimationController _animationController;
  bool _showManualForm = false;
  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: Duration(milliseconds: 500),
      vsync: this,
    );

    _registerController.fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));

    _registerController.slideAnimation = Tween<Offset>(
      begin: Offset(0, 0.5),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeOutCubic,
    ));
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _toggleManualForm() {
    setState(() {
      _showManualForm = !_showManualForm;
    });

    if (_showManualForm) {
      _animationController.forward();
    } else {
      _animationController.reverse();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        scrolledUnderElevation: 0, // Mencegah perubahan elevation saat scroll
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios, color: Color(0xFF1A1A1A)),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              SizedBox(height: 20),

              // Logo Section
              Center(
                child: Column(
                  children: [
                    Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          color: Color.fromARGB(255, 255, 255, 255),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Image.asset(
                          'assets/logo.png',
                          width: 40,
                          height: 40,
                        )),
                    SizedBox(height: 20),
                    Text(
                      'Sign Up Your Account',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1A1A1A),
                        letterSpacing: -0.5,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Bergabunglah dan temukan rumah impian Anda',
                      style: TextStyle(
                        fontSize: 16,
                        color: Color(0xFF757575),
                        fontWeight: FontWeight.w400,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),

              SizedBox(height: 40),

              // Google Register Button
              SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: Obx(
                    () => OutlinedButton.icon(
                      onPressed: _registerController.isLoadingGoogle.value
                          ? null
                          : _registerController.handleGoogleRegister,
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Color(0xFF1A1A1A),
                        backgroundColor: Colors.white,
                        side: BorderSide(color: Color(0xFFE0E0E0)),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 0,
                      ),
                      icon: _registerController.isLoadingGoogle.value
                          ? SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                    Color(0xFFE4B61A)),
                              ),
                            )
                          : Container(
                              width: 20,
                              height: 20,
                              child: Image.asset(
                                'assets/google_icon.png',
                                errorBuilder: (context, error, stackTrace) {
                                  return Icon(Icons.g_mobiledata_rounded,
                                      color: Color(0xFF4285F4));
                                },
                              ),
                            ),
                      label: Text(
                        _registerController.isLoadingGoogle.value
                            ? 'Sign up...'
                            : 'Continue with Google',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          letterSpacing: 0.25,
                        ),
                      ),
                    ),
                  )),

              SizedBox(height: 24),

              // Manual Registration Toggle
              Center(
                child: TextButton(
                  onPressed: _toggleManualForm,
                  style: TextButton.styleFrom(
                    padding: EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        _showManualForm ? 'Hidden form' : 'Continue with Email',
                        style: TextStyle(
                          color: Color(0xFF757575),
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      SizedBox(width: 8),
                      AnimatedRotation(
                        turns: _showManualForm ? 0.5 : 0,
                        duration: Duration(milliseconds: 300),
                        child: Icon(
                          Icons.keyboard_arrow_down,
                          color: Color(0xFF757575),
                          size: 20,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Manual Registration Form
              AnimatedContainer(
                duration: Duration(milliseconds: 300),
                curve: Curves.easeInOut,
                height: _showManualForm ? null : 0,
                child: _showManualForm
                    ? FadeTransition(
                        opacity: _registerController.fadeAnimation,
                        child: SlideTransition(
                          position: _registerController.slideAnimation,
                          child: Container(
                            margin: EdgeInsets.only(top: 24),
                            padding: EdgeInsets.all(24),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: Color(0xFFE0E0E0)),
                            ),
                            child: Form(
                              key: _registerController.formKey,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  Text(
                                    'Informasi Akun',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF1A1A1A),
                                    ),
                                  ),
                                  SizedBox(height: 20),

                                  // Full Name Field
                                  CustomTextFormField(
                                    controller:
                                        _registerController.fullNameController,
                                    label: "Nama Lengkap",
                                    hint: "Masukkan nama lengkap Anda",
                                    icon: Icons.person_outline,
                                    validator: (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Nama lengkap tidak boleh kosong';
                                      }
                                      if (value.length < 2) {
                                        return 'Nama lengkap minimal 2 karakter';
                                      }
                                      return null;
                                    },
                                  ),

                                  SizedBox(height: 16),
                                  CustomTextFormField(
                                    controller:
                                        _registerController.emailController,
                                    label: "Email",
                                    hint: "Masukkan email ",
                                    icon: Icons.email_outlined,
                                    validator: (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Email tidak boleh kosong';
                                      }
                                      if (!RegExp(
                                              r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
                                          .hasMatch(value)) {
                                        return 'Format email tidak valid';
                                      }
                                      return null;
                                    },
                                  ),

                                  SizedBox(height: 16),

                                  CustomTextFormField(
                                    controller:
                                        _registerController.phoneController,
                                    label: 'Nomor Telepon (Opsional)',
                                    hint: 'Masukkan nomor telepon Anda',
                                    icon: Icons.phone,
                                    validator: (value) {
                                      if (value != null && value.isNotEmpty) {
                                        if (value.length < 10 ||
                                            value.length > 15) {
                                          return 'Nomor telepon harus 10-15 digit';
                                        }
                                        if (!RegExp(r'^[0-9+\-\s]+$')
                                            .hasMatch(value)) {
                                          return 'Format nomor telepon tidak valid';
                                        }
                                      }
                                      return null;
                                    },
                                  ),

                                  SizedBox(height: 16),

                                  // Password Field
                                  Customtextpassword(
                                    controller:
                                        _registerController.passwordController,
                                    label: 'Password',
                                    hint: 'Minimal 8 karakter',
                                    icon: Icons.lock_outline,
                                    isObscure: _registerController
                                        .obscurePassword.value,
                                    onToggle: () {
                                      setState(() {
                                        _registerController
                                                .obscurePassword.value =
                                            !_registerController
                                                .obscurePassword.value;
                                      });
                                    },
                                    validator: (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Password tidak boleh kosong';
                                      }
                                      if (value.length < 8) {
                                        return 'Password minimal 8 karakter';
                                      }
                                      // if (!RegExp(
                                      //         r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)')
                                      //     .hasMatch(value)) {
                                      //   return 'Password harus mengandung huruf besar, kecil, dan angka';
                                      // }
                                      return null;
                                    },
                                  ),

                                  SizedBox(height: 16),

                                  Customtextpassword(
                                    controller: _registerController
                                        .confirmPasswordController,
                                    label: 'Konfirmasi Password',
                                    hint: 'Masukkan ulang password',
                                    icon: Icons.lock_outline_sharp,
                                    isObscure: _registerController
                                        .obscureConfirmPassword.value,
                                    onToggle: () {
                                      setState(() {
                                        _registerController
                                                .obscureConfirmPassword.value =
                                            !_registerController
                                                .obscureConfirmPassword.value;
                                      });
                                    },
                                    validator: (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Konfirmasi password tidak boleh kosong';
                                      }
                                      if (value !=
                                          _registerController
                                              .passwordController.text) {
                                        return 'Password tidak sama';
                                      }
                                      return null;
                                    },
                                  ),

                                  SizedBox(height: 20),

                                  // Terms and Conditions Checkbox
                                  Row(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Checkbox(
                                        value: _registerController
                                            .agreeToTerms.value,
                                        onChanged: (value) {
                                          setState(() {
                                            _registerController.agreeToTerms
                                                .value = value ?? false;
                                          });
                                        },
                                        activeColor: Colors.black,
                                        shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(4),
                                        ),
                                      ),
                                      Expanded(
                                        child: Padding(
                                          padding: EdgeInsets.only(top: 12),
                                          child: RichText(
                                            text: TextSpan(
                                              text: 'Saya setuju dengan ',
                                              style: TextStyle(
                                                color: Color(0xFF757575),
                                                fontSize: 10,
                                              ),
                                              children: [
                                                TextSpan(
                                                  text: 'Syarat & Ketentuan',
                                                  style: TextStyle(
                                                    color: Color(0xFF757575),
                                                    fontWeight: FontWeight.w600,
                                                    decoration: TextDecoration
                                                        .underline,
                                                  ),
                                                ),
                                                TextSpan(text: ' dan '),
                                                TextSpan(
                                                  text: 'Kebijakan Privasi',
                                                  style: TextStyle(
                                                    color: Color(0xFF757575),
                                                    fontWeight: FontWeight.w600,
                                                    decoration: TextDecoration
                                                        .underline,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),

                                  SizedBox(height: 24),

                                  // Register Button
                                  SizedBox(
                                      width: double.infinity,
                                      height: 56,
                                      child: Obx(
                                        () => ElevatedButton(
                                          onPressed: _registerController
                                                  .isLoading.value
                                              ? null
                                              : () => _registerController
                                                  .handleManualRegister(
                                                      context),
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: Colors.black,
                                            foregroundColor: Colors.white,
                                            elevation: 0,
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(12),
                                            ),
                                            disabledBackgroundColor:
                                                Color(0xFFBDBDBD),
                                          ),
                                          child: _registerController
                                                  .isLoading.value
                                              ? SizedBox(
                                                  width: 20,
                                                  height: 20,
                                                  child:
                                                      CircularProgressIndicator(
                                                    strokeWidth: 2,
                                                    valueColor:
                                                        AlwaysStoppedAnimation<
                                                                Color>(
                                                            Colors.white),
                                                  ),
                                                )
                                              : Text(
                                                  'Register',
                                                  style: TextStyle(
                                                    fontSize: 16,
                                                    fontWeight: FontWeight.w600,
                                                    letterSpacing: 0.5,
                                                  ),
                                                ),
                                        ),
                                      )),
                                ],
                              ),
                            ),
                          ),
                        ),
                      )
                    : SizedBox.shrink(),
              ),

              SizedBox(height: 32),

              // Login Link
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Sudah punya akun? ',
                    style: TextStyle(
                      color: Color(0xFF757575),
                      fontSize: 14,
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.zero,
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    child: Text(
                      'Masuk',
                      style: TextStyle(
                        color: Color(0xFF2196F3),
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),

              SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
