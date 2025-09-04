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

  Future<List<LoanSimulation>> getByUserEmail(String email) async {
    try {
      final response = await http.get(
          Uri.parse('$baseUrl/loan-simulations/user/$email'),
          headers: getToken());

      if (response.statusCode == 200) {
        final List<dynamic> jsonData = jsonDecode(response.body);

        List<LoanSimulation> dataList =
            jsonData.map((list) => LoanSimulation.fromJson(list)).toList();
        return dataList;
      } else {
        throw Exception('Failed fetch data by $email');
      }
    } catch (e) {
      print("ERROR fetch $e");
      throw Exception('Gagal terhubung ke server');
    }
  }

  Future<String?> deleteSimulation(String id) async {
    try {
      final response = await http.delete(
          Uri.parse('$baseUrl/loan-simulations/$id'),
          headers: getToken());
      if (response.statusCode == 200) {
        return null;
      } else {
        print("ERROR ${jsonDecode(response.body)}");
        return "Gagal menghapus data";
      }
    } catch (e) {
      print("ERROR $e");
      return "Terjadi kesalahan. try again!.";
    }
  }
}
