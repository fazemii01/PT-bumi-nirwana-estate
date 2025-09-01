class PropertyImages {
  final String id;
  final String? caption;
  final String? image_url;

  PropertyImages({required this.id, this.caption, this.image_url});

  factory PropertyImages.fromJson(Map<String, dynamic> json) {
    return PropertyImages(
        id: json['id'], caption: json['caption'], image_url: json['image_url']);
  }

  Map<String, dynamic> toJson() =>
      {'id': id, 'caption': caption, 'image_url': image_url};
}
