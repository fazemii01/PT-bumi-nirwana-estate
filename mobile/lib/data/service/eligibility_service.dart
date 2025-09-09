import 'dart:convert';

import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_nirwana/data/models/eligibility_request.dart';

class EligibilityService extends Api {
  Future<EligibilityResponse> checkEligibility(String question) async {
    final response = await http.post(
      Uri.parse("$baseUrl/cek-eligibility"),
      headers: getToken(),
      body: jsonEncode({"question": question}),
    );

    if (response.statusCode == 201 || response.statusCode == 200) {
      final data = jsonDecode(response.body);
      print(data);
      return EligibilityResponse.fromJson(data);
    } else {
      throw Exception("Gagal cek eligibilitas");
    }
  }
}
