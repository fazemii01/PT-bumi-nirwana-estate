import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/views/profile/profile_controller.dart';

class UpdateProfileBottomSheet extends StatefulWidget {
  final String initialName;
  final String initialPhone;

  const UpdateProfileBottomSheet({
    Key? key,
    required this.initialName,
    required this.initialPhone,
  }) : super(key: key);

  @override
  State<UpdateProfileBottomSheet> createState() =>
      _UpdateProfileBottomSheetState();

  static void show({
    required BuildContext context,
    required String initialName,
    required String initialPhone,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => UpdateProfileBottomSheet(
        initialName: initialName,
        initialPhone: initialPhone,
      ),
    );
  }
}

class _UpdateProfileBottomSheetState extends State<UpdateProfileBottomSheet> {
  final _profileController = Get.find<ProfileController>();
  late TextEditingController nameController;
  late TextEditingController phoneController;

  @override
  void initState() {
    super.initState();
    nameController = TextEditingController(text: widget.initialName);
    phoneController = TextEditingController(text: widget.initialPhone);
  }

  @override
  void dispose() {
    nameController.dispose();
    phoneController.dispose();
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
                            Icons.person_outline,
                            color: Color(0xFFDBB837),
                            size: 24,
                          ),
                          SizedBox(width: 12),
                          Text(
                            'Perbarui Profile',
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
                      Text(
                        'Nama Lengkap',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[600],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      SizedBox(height: 8),
                      Container(
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey[300]!),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: TextField(
                          controller: nameController,
                          decoration: InputDecoration(
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.all(13),
                            hintText: 'Masukkan nama lengkap',
                            hintStyle: TextStyle(color: Colors.grey[400]),
                          ),
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),

                      SizedBox(height: 15),
                      Text(
                        'Phone Number',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[600],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      SizedBox(height: 8),
                      Container(
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey[300]!),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: TextField(
                          controller: phoneController,
                          keyboardType: TextInputType.number,
                          decoration: InputDecoration(
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.all(13),
                            hintText: 'Masukkan no handphone',
                            hintStyle: TextStyle(color: Colors.grey[400]),
                          ),
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      SizedBox(height: 15),
                      // Save Button
                      Container(
                        width: double.infinity,
                        child: ElevatedButton(
                            onPressed: () {
                              _profileController.editProfile(
                                  nameController.text,
                                  phoneController.text,
                                  context);
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color(0xFFDBB837),
                              padding: EdgeInsets.symmetric(vertical: 10),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              elevation: 0,
                            ),
                            child: Obx(
                              () => _profileController.isEditing.value
                                  ? SizedBox(
                                      width: 15,
                                      height: 15,
                                      child: CircularProgressIndicator(
                                        color: Colors.white,
                                        strokeWidth: 2,
                                      ),
                                    )
                                  : Text(
                                      'Simpan Perubahan',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                        color: Colors.white,
                                      ),
                                    ),
                            )),
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
