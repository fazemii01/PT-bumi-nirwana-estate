import 'dart:convert';

import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_nirwana/data/models/loan-simulation.dart';

class LoanSimulationService extends Api {
  Future<String?> addLoanSimulation(LoanSimulation loanSimulation) async {
    print("DEBUG LOAN SIMULATION ${jsonEncode(loanSimulation.toJson())}");
    // final response = await http.post(
    //   Uri.parse('$baseUrl/loan-simulations'),
    //   headers: getToken(),
    //   body: jsonEncode(loanSimulation.toJson()),
    // );
  }
}
