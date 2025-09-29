class PropertySitePlan {
  final String id;
  final String name;
  final String file_url;

  PropertySitePlan(
      {required this.id, required this.name, required this.file_url});

  factory PropertySitePlan.fromJson(Map<String, dynamic> json) {
    return PropertySitePlan(
        id: json['id'], name: json['name'], file_url: json['file_url']);
  }

  Map<String, dynamic> toJson() =>
      {'id': id, 'name': name, 'file_url': file_url};
}
