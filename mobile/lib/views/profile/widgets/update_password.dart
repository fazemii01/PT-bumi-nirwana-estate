import 'package:flutter/material.dart';
import 'package:mobile_nirwana/widgets/custom_text_password.dart';

class UpdatePassword extends StatefulWidget {
  const UpdatePassword({
    Key? key,
  }) : super(key: key);

  @override
  State<UpdatePassword> createState() => _UpdatePasswordState();

  static void show({
    required BuildContext context,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => UpdatePassword(),
    );
  }
}

class _UpdatePasswordState extends State<UpdatePassword> {
  late TextEditingController newPaassword;
  late TextEditingController confirmPassword;
  bool obscurePassword = true;

  @override
  void initState() {
    super.initState();
    newPaassword = TextEditingController();
    confirmPassword = TextEditingController();
  }

  @override
  void dispose() {
    newPaassword.dispose();
    confirmPassword.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * 0.9,
          minHeight: MediaQuery.of(context).size.height * 0.45,
        ),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20),
            topRight: Radius.circular(20),
          ),
        ),
        child: SingleChildScrollView(
          child: Container(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom > 0 ? 20 : 0,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header with close button
                Container(
                  padding: EdgeInsets.fromLTRB(24, 10, 16, 5),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(
                            Icons.lock_person_sharp,
                            color: Color(0xFFDBB837),
                            size: 24,
                          ),
                          SizedBox(width: 12),
                          Text(
                            'Perbarui Password',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: Colors.black87,
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        onPressed: () => Navigator.pop(context),
                        icon: Icon(Icons.close, color: Colors.grey[600]),
                        padding: EdgeInsets.zero,
                        constraints: BoxConstraints(),
                      ),
                    ],
                  ),
                ),

                // Divider
                const SizedBox(
                  height: 5,
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16),
                    child: Divider(
                      color: Color(0xFFE0E0E0),
                      thickness: 1,
                    ),
                  ),
                ),

                // Content
                Padding(
                  padding: EdgeInsets.fromLTRB(16, 15, 16, 10),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Name Field
                      Customtextpassword(
                        controller: newPaassword,
                        label: 'Password Baru',
                        hint: 'password baru',
                        icon: Icons.lock_person_outlined,
                        isObscure: obscurePassword,
                        onToggle: () {
                          setState(() {
                            obscurePassword = !obscurePassword;
                          });
                        },
                      ),

                      SizedBox(height: 15),
                      Customtextpassword(
                        controller: newPaassword,
                        label: 'Confirmasi Password',
                        hint: 'confirmasi password',
                        icon: Icons.lock_person_outlined,
                        isObscure: obscurePassword,
                        onToggle: () {
                          setState(() {
                            obscurePassword = !obscurePassword;
                          });
                        },
                      ),
                      SizedBox(height: 15),

                      // Save Button
                      Container(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.pop(context);
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color(0xFFDBB837),
                            padding: EdgeInsets.symmetric(vertical: 10),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            elevation: 0,
                          ),
                          child: Text(
                            'Simpan Perubahan',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Colors.white,
                            ),
                          ),
                          // child: widget.isLoading
                          //     ? SizedBox(
                          //         width: 20,
                          //         height: 20,
                          //         child: CircularProgressIndicator(
                          //           color: Colors.white,
                          //           strokeWidth: 2,
                          //         ),
                          //       )
                          //     : Text(
                          //         'Simpan Perubahan',
                          //         style: TextStyle(
                          //           fontSize: 16,
                          //           fontWeight: FontWeight.w600,
                          //           color: Colors.white,
                          //         ),
                          //       ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
