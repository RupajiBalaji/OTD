enum GarmentCategory { tops, bottoms, outerwear, footwear, accessories, onePiece }

enum FashionOccasion { casual, business, evening, streetwear, cocktail, gym, vacation }

enum FashionVibe { minimalist, oldMoney, streetChic, bohemian, y2k, avantGarde }

class WardrobeItem {
  final String id;
  final String name;
  final GarmentCategory category;
  final String color;
  final String fabric;
  final String season;
  final String imageUrl;
  final int timesWorn;
  final double purchasePrice;
  final DateTime addedDate;

  WardrobeItem({
    required this.id,
    required this.name,
    required this.category,
    required this.color,
    required this.fabric,
    required this.season,
    required this.imageUrl,
    this.timesWorn = 0,
    required this.purchasePrice,
    required this.addedDate,
  });

  double get costPerWear => timesWorn == 0 ? purchasePrice : purchasePrice / timesWorn;

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'category': category.name,
    'color': color,
    'fabric': fabric,
    'season': season,
    'imageUrl': imageUrl,
    'timesWorn': timesWorn,
    'purchasePrice': purchasePrice,
    'addedDate': addedDate.toIso8601String(),
  };

  factory WardrobeItem.fromJson(Map<String, dynamic> json) => WardrobeItem(
    id: json['id'],
    name: json['name'],
    category: GarmentCategory.values.firstWhere((e) => e.name == json['category'], orElse: () => GarmentCategory.tops),
    color: json['color'] ?? '',
    fabric: json['fabric'] ?? '',
    season: json['season'] ?? 'All Season',
    imageUrl: json['imageUrl'] ?? '',
    timesWorn: json['timesWorn'] ?? 0,
    purchasePrice: (json['purchasePrice'] as num?)?.toDouble() ?? 0.0,
    addedDate: DateTime.tryParse(json['addedDate'] ?? '') ?? DateTime.now(),
  );
}

class OutfitRecommendation {
  final String id;
  final String title;
  final String description;
  final List<WardrobeItem> items;
  final FashionOccasion occasion;
  final FashionVibe vibe;
  final double aiMatchScore; // e.g. 0.96 (96%)
  final String weatherFitReason;
  final bool isWornToday;
  final bool isBookmarked;

  OutfitRecommendation({
    required this.id,
    required this.title,
    required this.description,
    required this.items,
    required this.occasion,
    required this.vibe,
    required this.aiMatchScore,
    required this.weatherFitReason,
    this.isWornToday = false,
    this.isBookmarked = false,
  });

  OutfitRecommendation copyWith({
    bool? isWornToday,
    bool? isBookmarked,
  }) {
    return OutfitRecommendation(
      id: id,
      title: title,
      description: description,
      items: items,
      occasion: occasion,
      vibe: vibe,
      aiMatchScore: aiMatchScore,
      weatherFitReason: weatherFitReason,
      isWornToday: isWornToday ?? this.isWornToday,
      isBookmarked: isBookmarked ?? this.isBookmarked,
    );
  }
}

class WardrobeGap {
  final String id;
  final String title;
  final String reason;
  final String urgency; // High, Medium, Low
  final String recommendedCategory;

  WardrobeGap({
    required this.id,
    required this.title,
    required this.reason,
    required this.urgency,
    required this.recommendedCategory,
  });
}

class SocialPost {
  final String id;
  final String userName;
  final String userHandle;
  final String userAvatar;
  final String outfitTitle;
  final String imageUrl;
  final String vibeTag;
  final int likes;
  final int comments;
  final bool isLiked;
  final String timeAgo;

  SocialPost({
    required this.id,
    required this.userName,
    required this.userHandle,
    required this.userAvatar,
    required this.outfitTitle,
    required this.imageUrl,
    required this.vibeTag,
    required this.likes,
    required this.comments,
    this.isLiked = false,
    required this.timeAgo,
  });

  SocialPost copyWith({
    int? likes,
    bool? isLiked,
  }) {
    return SocialPost(
      id: id,
      userName: userName,
      userHandle: userHandle,
      userAvatar: userAvatar,
      outfitTitle: outfitTitle,
      imageUrl: imageUrl,
      vibeTag: vibeTag,
      likes: likes ?? this.likes,
      comments: comments,
      isLiked: isLiked ?? this.isLiked,
      timeAgo: timeAgo,
    );
  }
}

class ShoppingProduct {
  final String id;
  final String brand;
  final String title;
  final double price;
  final String imageUrl;
  final String gapFills;
  final double matchScore;

  ShoppingProduct({
    required this.id,
    required this.brand,
    required this.title,
    required this.price,
    required this.imageUrl,
    required this.gapFills,
    required this.matchScore,
  });
}
