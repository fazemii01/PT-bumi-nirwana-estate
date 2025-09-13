class NewsImages {
  final String id;
  final String imgUrl;

  NewsImages({
    required this.id,
    required this.imgUrl,
  });

  factory NewsImages.fromJson(Map<String, dynamic> json) {
    return NewsImages(
      id: json['id'] as String,
      imgUrl: json['img_url'] as String,
    );
  }
}
