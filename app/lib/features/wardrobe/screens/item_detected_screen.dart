import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/models/fashion_models.dart';
import '../../../shared/widgets/luxury_image.dart';
import '../../../shared/widgets/otd_button.dart';
import '../../../shared/widgets/otd_card.dart';
import '../garment_detection_service.dart';
import '../wardrobe_repository.dart';

class ItemDetectedScreen extends ConsumerStatefulWidget {
  final DetectedGarment detected;

  const ItemDetectedScreen({super.key, required this.detected});

  @override
  ConsumerState<ItemDetectedScreen> createState() => _ItemDetectedScreenState();
}

class _ItemDetectedScreenState extends ConsumerState<ItemDetectedScreen> {
  late GarmentCategory _category;
  late String _colour;
  late String _type;
  late String _sleeve;
  late String _material;
  late String _fit;
  late int _formality;
  late double _confidence;
  late String _imagePath;
  String _brand = 'Designer Essential';

  @override
  void initState() {
    super.initState();
    _category = widget.detected.category;
    _colour = widget.detected.colour;
    _type = widget.detected.type;
    _sleeve = widget.detected.sleeve;
    _material = widget.detected.material;
    _fit = widget.detected.fit;
    _formality = widget.detected.formality;
    _confidence = widget.detected.confidence;
    _imagePath = widget.detected.imagePath;
  }

  void _editAttribute(String label, String currentValue, ValueChanged<String> onSaved) {
    final controller = TextEditingController(text: currentValue);
    showDialog(
      context: context,
      builder: (ctx) {
        final colors = OtdColors.of(ctx);
        return AlertDialog(
          backgroundColor: colors.card,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          title: Text(
            'Edit $label',
            style: OtdTokens.headingSmall(color: colors.textPrimary),
          ),
          content: TextField(
            controller: controller,
            style: OtdTokens.bodyMedium(color: colors.textPrimary),
            decoration: InputDecoration(hintText: 'Enter new $label'),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: Text('Cancel', style: OtdTokens.label(color: colors.textMuted)),
            ),
            TextButton(
              onPressed: () {
                if (controller.text.trim().isNotEmpty) {
                  onSaved(controller.text.trim());
                  Navigator.pop(ctx);
                }
              },
              child: Text('Save', style: OtdTokens.label(color: colors.accent)),
            ),
          ],
        );
      },
    );
  }

  Future<void> _handleAddToCloset() async {
    final newItem = WardrobeItem(
      id: 'usr_item_${DateTime.now().millisecondsSinceEpoch}',
      name: '$_colour $_type',
      category: _category,
      subType: _type,
      brand: _brand,
      color: _colour,
      fabric: _material,
      fit: _fit,
      formality: _formality,
      season: 'All Season',
      imageUrl: _imagePath,
      timesWorn: 0,
      purchasePrice: 150.0,
      addedDate: DateTime.now(),
    );

    await ref.read(wardrobeProvider.notifier).addItem(newItem);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${newItem.name} added to your Digital Closet!'),
          backgroundColor: OtdTokens.goldDeep,
          behavior: SnackBarBehavior.floating,
        ),
      );
      context.go('/closet');
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        backgroundColor: colors.canvas,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 20, color: colors.textPrimary),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Item Detected',
          style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(
            horizontal: OtdTokens.screenPaddingH,
            vertical: 8,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Product Image Display with Confidence Tag
              Stack(
                children: [
                  Container(
                    width: double.infinity,
                    height: 240,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: colors.border),
                    ),
                    child: LuxuryImage(
                      imageUrl: _imagePath,
                      width: double.infinity,
                      height: 240,
                      borderRadius: 20,
                    ),
                  ),
                  Positioned(
                    top: 14,
                    right: 14,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.75),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: OtdTokens.gold, width: 1),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Iconsax.magic_star, size: 14, color: OtdTokens.gold),
                          const SizedBox(width: 6),
                          Text(
                            '${(_confidence * 100).round()}% CONFIDENCE',
                            style: OtdTokens.label(
                              color: OtdTokens.goldLight,
                              weight: FontWeight.w700,
                              letterSpacing: 0.8,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // Section Title & Hint
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'GARMENT ATTRIBUTES',
                    style: OtdTokens.label(color: colors.textSecondary, letterSpacing: 1.2),
                  ),
                  Text(
                    'Tap row to edit',
                    style: OtdTokens.bodySmall(color: colors.textMuted),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // Attribute Table
              OtdCard(
                padding: EdgeInsets.zero,
                borderRadius: 18,
                child: Column(
                  children: [
                    _buildAttributeRow(
                      'Category',
                      _category.name.toUpperCase(),
                      colors,
                      onTap: () {
                        // Category chooser
                        _showCategoryPicker(colors);
                      },
                    ),
                    Divider(height: 1, color: colors.border),
                    _buildAttributeRow(
                      'Colour',
                      _colour,
                      colors,
                      onTap: () => _editAttribute('Colour', _colour, (val) => setState(() => _colour = val)),
                    ),
                    Divider(height: 1, color: colors.border),
                    _buildAttributeRow(
                      'Type',
                      _type,
                      colors,
                      onTap: () => _editAttribute('Type', _type, (val) => setState(() => _type = val)),
                    ),
                    Divider(height: 1, color: colors.border),
                    _buildAttributeRow(
                      'Sleeve',
                      _sleeve,
                      colors,
                      onTap: () => _editAttribute('Sleeve', _sleeve, (val) => setState(() => _sleeve = val)),
                    ),
                    Divider(height: 1, color: colors.border),
                    _buildAttributeRow(
                      'Material',
                      _material,
                      colors,
                      onTap: () => _editAttribute('Material', _material, (val) => setState(() => _material = val)),
                    ),
                    Divider(height: 1, color: colors.border),
                    _buildAttributeRow(
                      'Fit',
                      _fit,
                      colors,
                      onTap: () => _editAttribute('Fit', _fit, (val) => setState(() => _fit = val)),
                    ),
                    Divider(height: 1, color: colors.border),
                    _buildAttributeRow(
                      'Brand',
                      _brand,
                      colors,
                      onTap: () => _editAttribute('Brand', _brand, (val) => setState(() => _brand = val)),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 32),

              // Buttons: Retake / Add to Closet
              Row(
                children: [
                  Expanded(
                    child: OtdButton(
                      text: 'Retake',
                      variant: OtdButtonVariant.outline,
                      onPressed: () => context.pop(),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: OtdButton(
                      text: 'Add to Closet',
                      variant: OtdButtonVariant.primary,
                      icon: const Icon(Icons.add, size: 18),
                      onPressed: _handleAddToCloset,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAttributeRow(String label, String value, OtdColors colors, {required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: OtdTokens.bodyMedium(color: colors.textMuted),
            ),
            Row(
              children: [
                Text(
                  value,
                  style: OtdTokens.bodyMedium(
                    color: colors.textPrimary,
                    weight: FontWeight.w600,
                  ),
                ),
                const SizedBox(width: 8),
                Icon(Icons.edit_outlined, size: 14, color: colors.accent),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showCategoryPicker(OtdColors colors) {
    showModalBottomSheet(
      context: context,
      backgroundColor: colors.card,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: GarmentCategory.values.map((cat) {
              return ListTile(
                title: Text(
                  cat.name.toUpperCase(),
                  style: OtdTokens.bodyMedium(color: colors.textPrimary, weight: FontWeight.w600),
                ),
                trailing: _category == cat ? Icon(Icons.check, color: colors.accent) : null,
                onTap: () {
                  setState(() => _category = cat);
                  Navigator.pop(ctx);
                },
              );
            }).toList(),
          ),
        );
      },
    );
  }
}
