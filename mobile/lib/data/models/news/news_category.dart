class NewsCategory {
  final String id;
  final String name;

  NewsCategory({
    required this.id,
    required this.name,
  });

  factory NewsCategory.fromJson(Map<String, dynamic> json) {
    return NewsCategory(
      id: json['id'] as String,
      name: json['name'] as String,
    );
  }

  // Opsional: toJson method jika Anda perlu mengirim objek ini kembali ke server
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
    };
  }
}
