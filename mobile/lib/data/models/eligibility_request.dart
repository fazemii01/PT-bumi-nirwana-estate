class EligibilityRequest {
  final String question;

  EligibilityRequest({required this.question});

  Map<String, dynamic> toJson() => {
        "question": question,
      };
}

class EligibilityResponse {
  final String result;

  EligibilityResponse({required this.result});

  factory EligibilityResponse.fromJson(Map<String, dynamic> json) {
    return EligibilityResponse(
      result: json["result"] ?? "",
    );
  }
}
