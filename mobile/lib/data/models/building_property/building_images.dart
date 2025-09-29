class BuildingImages {
  final String id;
  final String? caption;
  final String? image_url;

  BuildingImages({required this.id, this.caption, this.image_url});

  factory BuildingImages.fromJson(Map<String, dynamic> json) {
    return BuildingImages(
        id: json['id'], caption: json['caption'], image_url: json['image_url']);
  }

  Map<String, dynamic> toJson() =>
      {'id': id, 'caption': caption, 'image_url': image_url};
}
