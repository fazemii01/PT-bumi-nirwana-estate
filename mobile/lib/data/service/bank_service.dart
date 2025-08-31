import 'dart:convert';

import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/data/models/bank.dart';
import 'package:http/http.dart' as http;

class BankService extends Api {
  Future<List<Bank>> getAllBank() async {
    try {
      final response =
          await http.get(Uri.parse('$baseUrl/banks'), headers: getToken());
      if (response.statusCode == 200) {
        List<dynamic> jsonData = jsonDecode(response.body);
        List<Bank> banks = jsonData.map((bank) => Bank.fromJson(bank)).toList();
        return banks;
      } else {
        throw Exception('Failed to load data bank');
      }
    } catch (e) {
      print("ERROR FATCHING $e");
      throw Exception('Failed to fatching data bank');
    }
  }
}
