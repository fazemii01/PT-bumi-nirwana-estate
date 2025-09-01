import 'package:flutter/material.dart';

class Customtextpassword extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final String hint;
  final IconData icon;
  final bool isObscure;
  final VoidCallback onToggle;
  final TextInputAction textInputAction;
  final String? Function(String?)? validator;

  const Customtextpassword({
    Key? key,
    required this.controller,
    required this.label,
    required this.hint,
    required this.icon,
    required this.isObscure,
    required this.onToggle,
    this.textInputAction = TextInputAction.next,
    this.validator,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      textInputAction: textInputAction,
      obscureText: isObscure,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: Icon(icon, color: Color(0xFF757575)),
        suffixIcon: IconButton(
          icon: Icon(
            isObscure
                ? Icons.visibility_off_outlined
                : Icons.visibility_outlined,
            color: const Color(0xFF757575),
          ),
          onPressed: onToggle,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Color(0xFFE0E0E0)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Color(0xFFE0E0E0)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Color(0xFFE4B61A), width: 1),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.red, width: 1),
        ),
        filled: true,
        fillColor: Colors.white,
        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      ),
      validator: validator,
    );
  }
}
