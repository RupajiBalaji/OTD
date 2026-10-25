import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../shared/models/fashion_models.dart';

class DetectedGarment {
  final GarmentCategory category;
  final String colour;
  final String type;
  final String sleeve;
  final String material;
  final String fit;
  final int formality;
  final double confidence;
  final String imagePath;

  const DetectedGarment({
    required this.category,
    required this.colour,
    required this.type,
    required this.sleeve,
    required this.material,
    required this.fit,
    required this.formality,
    required this.confidence,
    required this.imagePath,
  });

  DetectedGarment copyWith({
    GarmentCategory? category,
    String? colour,
    String? type,
    String? sleeve,
    String? material,
    String? fit,
    int? formality,
    double? confidence,
    String? imagePath,
  }) {
    return DetectedGarment(
      category: category ?? this.category,
      colour: colour ?? this.colour,
      type: type ?? this.type,
      sleeve: sleeve ?? this.sleeve,
      material: material ?? this.material,
      fit: fit ?? this.fit,
      formality: formality ?? this.formality,
      confidence: confidence ?? this.confidence,
      imagePath: imagePath ?? this.imagePath,
    );
  }
}

abstract class GarmentDetectionService {
  Future<DetectedGarment> detectGarment(String imagePath);
}

class MockGarmentDetectionService implements GarmentDetectionService {
  @override
  Future<DetectedGarment> detectGarment(String imagePath) async {
    // Simulate neural network classification latency
    await Future.delayed(const Duration(milliseconds: 1200));

    final lower = imagePath.toLowerCase();

    if (lower.contains('pant') || lower.contains('jean') || lower.contains('trouser')) {
      return DetectedGarment(
        category: GarmentCategory.bottoms,
        colour: 'Charcoal Grey',
        type: 'Pleated Trousers',
        sleeve: 'N/A',
        material: 'Wool Flannel',
        fit: 'Tailored Tapered',
        formality: 4,
        confidence: 0.97,
        imagePath: imagePath,
      );
    } else if (lower.contains('shoe') || lower.contains('boot') || lower.contains('loafer')) {
      return DetectedGarment(
        category: GarmentCategory.footwear,
        colour: 'Chocolate Brown',
        type: 'Belgian Loafers',
        sleeve: 'N/A',
        material: 'Calf Suede',
        fit: 'Standard E',
        formality: 3,
        confidence: 0.95,
        imagePath: imagePath,
      );
    } else if (lower.contains('blazer') || lower.contains('coat') || lower.contains('jacket')) {
      return DetectedGarment(
        category: GarmentCategory.outerwear,
        colour: 'Midnight Navy',
        type: 'Unstructured Blazer',
        sleeve: 'Long Sleeve',
        material: 'High-Twist Wool',
        fit: 'Soft Neapolitan',
        formality: 4,
        confidence: 0.98,
        imagePath: imagePath,
      );
    }

    // Default top detection
    return DetectedGarment(
      category: GarmentCategory.tops,
      colour: 'Ivory Cream',
      type: 'Cashmere High-Neck',
      sleeve: 'Long Sleeve',
      material: '70% Cashmere, 30% Silk',
      fit: 'Regular Tailored',
      formality: 3,
      confidence: 0.96,
      imagePath: imagePath,
    );
  }
}

final garmentDetectionServiceProvider = Provider<GarmentDetectionService>((ref) {
  return MockGarmentDetectionService();
});
