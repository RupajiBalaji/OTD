import 'package:flutter_riverpod/flutter_riverpod.dart';

class VenueItem {
  final String id;
  final String name;
  final String location;
  final String city;
  final String category;
  final String imageUrl;
  final String ambience;
  final String vibe;
  final String dressCode;
  final bool isIndoor;
  final bool isSaved;
  final bool isPopular;
  final bool isRecent;

  const VenueItem({
    required this.id,
    required this.name,
    required this.location,
    required this.city,
    required this.category,
    required this.imageUrl,
    required this.ambience,
    required this.vibe,
    required this.dressCode,
    this.isIndoor = true,
    this.isSaved = false,
    this.isPopular = false,
    this.isRecent = false,
  });
}

abstract class VenueRepository {
  Future<List<VenueItem>> getRecentVenues();
  Future<List<VenueItem>> getPopularVenues();
  Future<List<VenueItem>> getSavedVenues();
  Future<List<VenueItem>> searchVenues(String query);
}

class MockVenueRepository implements VenueRepository {
  static const List<VenueItem> _allVenues = [
    VenueItem(
      id: 'lamore',
      name: "L'amore",
      location: 'Banjara Hills, Hyderabad',
      city: 'Hyderabad',
      category: 'Restaurant',
      imageUrl:
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      ambience: 'Fine Dining',
      vibe: 'Romantic',
      dressCode: 'Smart Casual',
      isIndoor: true,
      isRecent: true,
      isPopular: true,
      isSaved: true,
    ),
    VenueItem(
      id: 'olive',
      name: 'Olive Bistro',
      location: 'Jubilee Hills, Hyderabad',
      city: 'Hyderabad',
      category: 'Bistro',
      imageUrl:
          'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      ambience: 'Mediterranean Terrace',
      vibe: 'Chic & Breezy',
      dressCode: 'Resort Smart Casual',
      isIndoor: false,
      isRecent: true,
      isPopular: true,
      isSaved: false,
    ),
    VenueItem(
      id: 'aer',
      name: 'Aer Lounge',
      location: 'Four Seasons, Worli, Mumbai',
      city: 'Mumbai',
      category: 'Rooftop Bar',
      imageUrl:
          'https://images.unsplash.com/photo-1570560258879-af7f8e1447ac?auto=format&fit=crop&w=800&q=80',
      ambience: 'Open-Air Rooftop',
      vibe: 'Glamorous Evening',
      dressCode: 'Cocktail Attire',
      isIndoor: false,
      isRecent: true,
      isPopular: true,
      isSaved: true,
    ),
    VenueItem(
      id: 'soho_house',
      name: 'Soho House',
      location: 'Juhu Beach, Mumbai',
      city: 'Mumbai',
      category: 'Members Club',
      imageUrl:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      ambience: 'Arts Club & Cinema',
      vibe: 'Artistic & Cosmopolitan',
      dressCode: 'Creative Smart',
      isIndoor: true,
      isRecent: false,
      isPopular: true,
      isSaved: true,
    ),
    VenueItem(
      id: 'bastian',
      name: 'Bastian at the Top',
      location: 'Bandra West, Mumbai',
      city: 'Mumbai',
      category: 'Restaurant & Bar',
      imageUrl:
          'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
      ambience: 'Panoramic High-Rise',
      vibe: 'High-Energy Social',
      dressCode: 'Statement Evening',
      isIndoor: true,
      isRecent: false,
      isPopular: true,
      isSaved: false,
    ),
    VenueItem(
      id: 'cirrus',
      name: 'The Piano Man Jazz Club',
      location: 'Safdarjung, New Delhi',
      city: 'New Delhi',
      category: 'Live Music & Club',
      imageUrl:
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      ambience: 'Speakeasy Jazz',
      vibe: 'Intimate & Sultry',
      dressCode: 'Dark Elegance',
      isIndoor: true,
      isRecent: true,
      isPopular: false,
      isSaved: true,
    ),
  ];

  @override
  Future<List<VenueItem>> getRecentVenues() async {
    await Future.delayed(const Duration(milliseconds: 100));
    return _allVenues.where((v) => v.isRecent).toList();
  }

  @override
  Future<List<VenueItem>> getPopularVenues() async {
    await Future.delayed(const Duration(milliseconds: 100));
    return _allVenues.where((v) => v.isPopular).toList();
  }

  @override
  Future<List<VenueItem>> getSavedVenues() async {
    await Future.delayed(const Duration(milliseconds: 100));
    return _allVenues.where((v) => v.isSaved).toList();
  }

  @override
  Future<List<VenueItem>> searchVenues(String query) async {
    await Future.delayed(const Duration(milliseconds: 80));
    final q = query.toLowerCase().trim();
    if (q.isEmpty) return _allVenues;
    return _allVenues.where((v) {
      return v.name.toLowerCase().contains(q) ||
          v.location.toLowerCase().contains(q) ||
          v.category.toLowerCase().contains(q) ||
          v.city.toLowerCase().contains(q);
    }).toList();
  }
}

final venueRepositoryProvider = Provider<VenueRepository>((ref) {
  return MockVenueRepository();
});
