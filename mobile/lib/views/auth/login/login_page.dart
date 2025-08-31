import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/views/auth/login/login_controller.dart';
import 'package:mobile_nirwana/widgets/customt_text_form_field.dart';
import 'package:mobile_nirwana/widgets/custom_text_password.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final LoginController _loginController = Get.put(LoginController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        scrolledUnderElevation: 0,
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
                    SizedBox(height: 24),
                    Text(
                      'BUMI NIRWANA ESTATE',
                      style: TextStyle(
                        fontSize: 25,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1A1A1A),
                        letterSpacing: -0.5,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Temukan rumah impian Anda',
                      style: TextStyle(
                        fontSize: 16,
                        color: Color(0xFF757575),
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ],
                ),
              ),

              SizedBox(height: 48),

              // Login Form
              Form(
                key: _loginController.formKey,
                child: Column(
                  children: [
                    CustomTextFormField(
                      controller: _loginController.emailController,
                      label: 'Email',
                      hint: 'Masukkan email Anda',
                      icon: Icons.email_outlined,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Email tidak boleh kosong';
                        }
                        if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
                            .hasMatch(value)) {
                          return 'Format email tidak valid';
                        }
                        return null;
                      },
                    ),

                    SizedBox(height: 20),

                    Customtextpassword(
                      controller: _loginController.passwordController,
                      label: 'Password',
                      hint: 'Masukkan password Anda',
                      icon: Icons.lock_outline,
                      isObscure: _loginController.obscurePassword.value,
                      onToggle: () {
                        setState(() {
                          _loginController.obscurePassword.value =
                              !_loginController.obscurePassword.value;
                        });
                      },
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Password tidak boleh kosong';
                        }
                        if (value.length < 6) {
                          return 'Password minimal 6 karakter';
                        }
                        return null;
                      },
                    ),

                    SizedBox(height: 10),

                    // Forgot Password
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                                content: Text(
                                    'Fitur lupa password akan segera hadir')),
                          );
                        },
                        child: Text(
                          'Forgot Password?',
                          style: TextStyle(
                            color: Colors.grey[500],
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ),

                    SizedBox(height: 24),

                    // Login Button
                    SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: Obx(
                          () => ElevatedButton(
                            onPressed: _loginController.isLoading.value
                                ? null
                                : _loginController.handleLogin,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color(0xFFE4B61A),
                              foregroundColor: Colors.white,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              disabledBackgroundColor:
                                  Color.fromARGB(255, 255, 224, 121),
                            ),
                            child: _loginController.isLoading.value
                                ? SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation<Color>(
                                          Colors.white),
                                    ),
                                  )
                                : Text(
                                    'Login',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                          ),
                        )),

                    SizedBox(height: 32),

                    // Divider
                    Row(
                      children: [
                        Expanded(
                          child: Divider(
                            color: Color(0xFFE0E0E0),
                            thickness: 1,
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 16),
                          child: Text(
                            'or',
                            style: TextStyle(
                              color: Color(0xFF757575),
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        Expanded(
                          child: Divider(
                            color: Color(0xFFE0E0E0),
                            thickness: 1,
                          ),
                        ),
                      ],
                    ),

                    SizedBox(height: 24),

                    // Google Login Button
                    SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: Obx(
                          () => OutlinedButton.icon(
                            onPressed: _loginController.isLoadingGoogle.value
                                ? null
                                : _loginController.handleGoogleLogin,
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Color(0xFF1A1A1A),
                              backgroundColor: Colors.white,
                              side: BorderSide(color: Color(0xFFE0E0E0)),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              elevation: 0,
                            ),
                            icon: Container(
                              width: 20,
                              height: 20,
                              child: Image.asset(
                                'assets/google_icon.png', // Anda perlu menambahkan asset ini
                                errorBuilder: (context, error, stackTrace) {
                                  return Icon(Icons.g_mobiledata_rounded,
                                      color: Color(0xFF4285F4));
                                },
                              ),
                            ),
                            label: Text(
                              'Masuk dengan Google',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                letterSpacing: 0.25,
                              ),
                            ),
                          ),
                        )),

                    SizedBox(height: 32),

                    // Sign Up Link
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Belum punya akun? ',
                          style: TextStyle(
                            color: Color(0xFF757575),
                            fontSize: 14,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            Get.toNamed(Routes.REGISTER);
                          },
                          style: TextButton.styleFrom(
                            padding: EdgeInsets.zero,
                            minimumSize: Size.zero,
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          ),
                          child: Text(
                            'Daftar',
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
            ],
          ),
        ),
      ),
    );
  }
}
