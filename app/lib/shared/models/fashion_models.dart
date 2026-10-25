enum GarmentCategory { tops, bottoms, outerwear, footwear, accessories, onePiece }

enum FashionOccasion { casual, business, evening, streetwear, cocktail, gym, vacation }

enum FashionVibe { minimalist, oldMoney, streetChic, bohemian, y2k, avantGarde }

class UserProfile {
  final String name;
  final String city;
  final String height;
  final String bodyShape;
  final List<String> stylePersonas;
  final String preferredFit;
  final List<String> palettePreferences;
  final String gender;
  final double weightKg;
  final List<String> goals;
  final String avatarId;
  final String skinTone;
  final String hairStyle;

  const UserProfile({
    required this.name,
    this.city = 'Mumbai',
    required this.height,
    required this.bodyShape,
    required this.stylePersonas,
    required this.preferredFit,
    required this.palettePreferences,
    this.gender = 'Male',
    this.weightKg = 68.0,
    this.goals = const ['Everyday Looks', 'Work/Office'],
    this.avatarId = 'avatar_1',
    this.skinTone = '#E0AC69',
    this.hairStyle = 'Classic Taper',
  });

  UserProfile copyWith({
    String? name,
    String? city,
    String? height,
    String? bodyShape,
    List<String>? stylePersonas,
    String? preferredFit,
    List<String>? palettePreferences,
    String? gender,
    double? weightKg,
    List<String>? goals,
    String? avatarId,
    String? skinTone,
    String? hairStyle,
  }) {
    return UserProfile(
      name: name ?? this.name,
      city: city ?? this.city,
      height: height ?? this.height,
      bodyShape: bodyShape ?? this.bodyShape,
      stylePersonas: stylePersonas ?? this.stylePersonas,
      preferredFit: preferredFit ?? this.preferredFit,
      palettePreferences: palettePreferences ?? this.palettePreferences,
      gender: gender ?? this.gender,
      weightKg: weightKg ?? this.weightKg,
      goals: goals ?? this.goals,
      avatarId: avatarId ?? this.avatarId,
      skinTone: skinTone ?? this.skinTone,
      hairStyle: hairStyle ?? this.hairStyle,
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'city': city,
        'height': height,
        'bodyShape': bodyShape,
        'stylePersonas': stylePersonas,
        'preferredFit': preferredFit,
        'palettePreferences': palettePreferences,
        'gender': gender,
        'weightKg': weightKg,
        'goals': goals,
        'avatarId': avatarId,
        'skinTone': skinTone,
        'hairStyle': hairStyle,
      };

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      name: json['name'] as String? ?? 'Alexa',
      city: json['city'] as String? ?? 'Mumbai',
      height: json['height'] as String? ?? "5'10\" (178 cm)",
      bodyShape: json['bodyShape'] as String? ?? 'Rectangle',
      stylePersonas: (json['stylePersonas'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? ['Minimal', 'Smart Casual'],
      preferredFit: json['preferredFit'] as String? ?? 'Tailored',
      palettePreferences: (json['palettePreferences'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? ['Black & White', 'Beige & Earth'],
      gender: json['gender'] as String? ?? 'Female',
      weightKg: (json['weightKg'] as num?)?.toDouble() ?? 62.0,
      goals: (json['goals'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? ['Everyday Looks', 'Work/Office'],
      avatarId: json['avatarId'] as String? ?? 'avatar_1',
      skinTone: json['skinTone'] as String? ?? '#E0AC69',
      hairStyle: json['hairStyle'] as String? ?? 'Classic Taper',
    );
  }
}

class WardrobeItem {
  final String id;
  final String name;
  final GarmentCategory category;
  final String subType;
  final String brand;
  final String color;
  final String fabric;
  final String fit; // 'Slim', 'Regular', 'Relaxed / Tailored'
  final int formality; // 1 (Casual) to 5 (Black Tie)
  final String season;
  final String imageUrl;
  final String icon;
  final int timesWorn;
  final double purchasePrice;
  final DateTime addedDate;

  WardrobeItem({
    required this.id,
    required this.name,
    required this.category,
    this.subType = '',
    this.brand = '',
    required this.color,
    this.fabric = '',
    this.fit = 'Regular',
    this.formality = 3,
    this.season = 'All Season',
    required this.imageUrl,
    this.icon = '👔',
    this.timesWorn = 0,
    required this.purchasePrice,
    required this.addedDate,
  });

  double get costPerWear => timesWorn == 0 ? purchasePrice : purchasePrice / timesWorn;

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'category': category.name,
    'subType': subType,
    'brand': brand,
    'color': color,
    'fabric': fabric,
    'fit': fit,
    'formality': formality,
    'season': season,
    'imageUrl': imageUrl,
    'icon': icon,
    'timesWorn': timesWorn,
    'purchasePrice': purchasePrice,
    'addedDate': addedDate.toIso8601String(),
  };

  factory WardrobeItem.fromJson(Map<String, dynamic> json) => WardrobeItem(
    id: json['id'],
    name: json['name'],
    category: GarmentCategory.values.firstWhere((e) => e.name == json['category'], orElse: () => GarmentCategory.tops),
    subType: json['subType'] ?? '',
    brand: json['brand'] ?? '',
    color: json['color'] ?? '',
    fabric: json['fabric'] ?? '',
    fit: json['fit'] ?? 'Regular',
    formality: json['formality'] ?? 3,
    season: json['season'] ?? 'All Season',
    imageUrl: json['imageUrl'] ?? '',
    icon: json['icon'] ?? '👔',
    timesWorn: json['timesWorn'] ?? 0,
    purchasePrice: (json['purchasePrice'] as num?)?.toDouble() ?? 0.0,
    addedDate: DateTime.tryParse(json['addedDate'] ?? '') ?? DateTime.now(),
  );
}

class OutfitRecommendation {
  final String id;
  final String title;
  final String description;
  final String venue;
  final List<WardrobeItem> items;
  final FashionOccasion occasion;
  final FashionVibe vibe;
  final double aiMatchScore; // e.g. 0.98 (98%)
  final String weatherFitReason;
  final String venueRationale;
  final String weatherRationale;
  final String paletteRationale;
  final bool isWornToday;
  final bool isBookmarked;

  OutfitRecommendation({
    required this.id,
    required this.title,
    required this.description,
    this.venue = '',
    required this.items,
    required this.occasion,
    required this.vibe,
    required this.aiMatchScore,
    required this.weatherFitReason,
    this.venueRationale = '',
    this.weatherRationale = '',
    this.paletteRationale = '',
    this.isWornToday = false,
    this.isBookmarked = false,
  });

  OutfitRecommendation copyWith({
    String? id,
    String? title,
    String? description,
    String? venue,
    List<WardrobeItem>? items,
    FashionOccasion? occasion,
    FashionVibe? vibe,
    double? aiMatchScore,
    String? weatherFitReason,
    String? venueRationale,
    String? weatherRationale,
    String? paletteRationale,
    bool? isWornToday,
    bool? isBookmarked,
  }) {
    return OutfitRecommendation(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      venue: venue ?? this.venue,
      items: items ?? this.items,
      occasion: occasion ?? this.occasion,
      vibe: vibe ?? this.vibe,
      aiMatchScore: aiMatchScore ?? this.aiMatchScore,
      weatherFitReason: weatherFitReason ?? this.weatherFitReason,
      venueRationale: venueRationale ?? this.venueRationale,
      weatherRationale: weatherRationale ?? this.weatherRationale,
      paletteRationale: paletteRationale ?? this.paletteRationale,
      isWornToday: isWornToday ?? this.isWornToday,
      isBookmarked: isBookmarked ?? this.isBookmarked,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'description': description,
    'venue': venue,
    'items': items.map((i) => i.toJson()).toList(),
    'occasion': occasion.name,
    'vibe': vibe.name,
    'aiMatchScore': aiMatchScore,
    'weatherFitReason': weatherFitReason,
    'venueRationale': venueRationale,
    'weatherRationale': weatherRationale,
    'paletteRationale': paletteRationale,
    'isWornToday': isWornToday,
    'isBookmarked': isBookmarked,
  };

  factory OutfitRecommendation.fromJson(Map<String, dynamic> json) => OutfitRecommendation(
    id: json['id'] ?? '',
    title: json['title'] ?? '',
    description: json['description'] ?? '',
    venue: json['venue'] ?? '',
    items: (json['items'] as List<dynamic>? ?? [])
        .map((i) => WardrobeItem.fromJson(i as Map<String, dynamic>))
        .toList(),
    occasion: FashionOccasion.values.firstWhere(
      (e) => e.name == json['occasion'],
      orElse: () => FashionOccasion.evening,
    ),
    vibe: FashionVibe.values.firstWhere(
      (e) => e.name == json['vibe'],
      orElse: () => FashionVibe.oldMoney,
    ),
    aiMatchScore: (json['aiMatchScore'] as num?)?.toDouble() ?? 0.95,
    weatherFitReason: json['weatherFitReason'] ?? '',
    venueRationale: json['venueRationale'] ?? '',
    weatherRationale: json['weatherRationale'] ?? '',
    paletteRationale: json['paletteRationale'] ?? '',
    isWornToday: json['isWornToday'] as bool? ?? false,
    isBookmarked: json['isBookmarked'] as bool? ?? false,
  );
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
