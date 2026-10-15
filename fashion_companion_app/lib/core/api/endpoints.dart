class Endpoints {
  static const String baseUrl = 'http://localhost:5000/api/v1';

  // Auth
  static const String register = '/auth/register';
  static const String login = '/auth/login';
  static const String refreshToken = '/auth/refresh-token';
  static const String profile = '/profile';

  // Wardrobe
  static const String wardrobe = '/wardrobe';
  static const String uploadWardrobeImage = '/wardrobe/upload';
  static const String wardrobeIntelligence = '/wardrobe-intelligence';

  // Outfits
  static const String outfitRecommendations = '/outfits/daily';
  static const String generateOutfit = '/outfits/generate';
  static const String outfitHistory = '/outfits/history';

  // Virtual Try-On
  static const String virtualTryOn = '/virtual-try-on';

  // Venues & Weather
  static const String venues = '/venues';
  static const String weather = '/weather';

  // Social
  static const String socialFeed = '/social/feed';
  static const String socialLike = '/social/like';

  // Shopping
  static const String shoppingRecommendations = '/shopping/recommendations';
}
