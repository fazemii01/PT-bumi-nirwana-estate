import 'dart:convert';

import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_nirwana/data/models/loan-simulation.dart';

class LoanSimulationService extends Api {
  Future<String?> addLoanSimulation(LoanSimulation loanSimulation) async {
    final body = loanSimulation.toJson();
    final headers = getToken()..addAll({"Content-Type": "application/json"});

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/loan-simulations'),
        headers: headers,
        body: jsonEncode(body),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        return null;
      }
      return "Gagal menyimpan data simulasi.";
    } catch (e) {
      print("=== ERROR SAVE SIMULASI ===");
      print(e);
      return "Failed save simulation. try again!";
    }
  }
}
