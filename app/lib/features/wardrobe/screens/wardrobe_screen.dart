import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/fashion_models.dart';
import '../wardrobe_repository.dart';

class WardrobeScreen extends ConsumerWidget {
  const WardrobeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final wardrobeAsync = ref.watch(wardrobeProvider);
    final selectedCategory = ref.watch(selectedCategoryProvider);

    return Scaffold(
      backgroundColor: AppTheme.noir,
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.gold,
        foregroundColor: AppTheme.noir,
        elevation: 4,
        icon: const Icon(Icons.add_a_photo_outlined, size: 20),
        label: Text(
          'ADD PIECE',
          style: GoogleFonts.outfit(fontWeight: FontWeight.w700, letterSpacing: 1.0),
        ),
        onPressed: () => _showAddGarmentSheet(context, ref),
      ),
      body: SafeArea(
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // Header
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'DIGITAL CLOSET',
                      style: GoogleFonts.outfit(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 2.0,
                        color: AppTheme.gold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Your Wardrobe', style: Theme.of(context).textTheme.displayMedium),
                        wardrobeAsync.maybeWhen(
                          data: (items) => Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: AppTheme.surfaceNoir,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppTheme.borderNoir),
                            ),
                            child: Text(
                              '${items.length} PIECES',
                              style: GoogleFonts.outfit(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.champagne,
                              ),
                            ),
                          ),
                          orElse: () => const SizedBox.shrink(),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Filter Chips
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [
                          _CategoryFilterChip(
                            label: 'ALL',
                            isSelected: selectedCategory == null,
                            onTap: () => ref.read(selectedCategoryProvider.notifier).state = null,
                          ),
                          ...GarmentCategory.values.map(
                            (cat) => _CategoryFilterChip(
                              label: cat.name.toUpperCase(),
                              isSelected: selectedCategory == cat,
                              onTap: () => ref.read(selectedCategoryProvider.notifier).state = cat,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Garments Grid
            wardrobeAsync.when(
              loading: () => const SliverFillRemaining(
                child: Center(child: CircularProgressIndicator(color: AppTheme.gold)),
              ),
              error: (err, _) => SliverFillRemaining(
                child: Center(child: Text('Error: $err', style: const TextStyle(color: Colors.red))),
              ),
              data: (allItems) {
                final filtered = selectedCategory == null
                    ? allItems
                    : allItems.where((item) => item.category == selectedCategory).toList();

                if (filtered.isEmpty) {
                  return SliverFillRemaining(
                    child: Center(
                      child: Text(
                        'No pieces in this category yet.',
                        style: GoogleFonts.outfit(color: AppTheme.mutedSilver),
                      ),
                    ),
                  );
                }

                return SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  sliver: SliverGrid(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 14,
                      mainAxisSpacing: 14,
                      childAspectRatio: 0.68,
                    ),
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final item = filtered[index];
                        return _WardrobeItemCard(item: item);
                      },
                      childCount: filtered.length,
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showAddGarmentSheet(BuildContext context, WidgetRef ref) {
    final nameController = TextEditingController();
    final priceController = TextEditingController();
    GarmentCategory chosenCategory = GarmentCategory.tops;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.surfaceNoir,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 24,
                right: 24,
                top: 24,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Add Garment to Closet',
                        style: GoogleFonts.cormorantGaramond(
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.silkWhite,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: AppTheme.mutedSilver),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Camera upload placeholder container
                  Container(
                    width: double.infinity,
                    height: 120,
                    decoration: BoxDecoration(
                      color: AppTheme.elevatedNoir,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.borderNoir, style: BorderStyle.solid),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.camera_alt_outlined, color: AppTheme.gold, size: 28),
                          const SizedBox(height: 6),
                          Text(
                            'Snap Garment or Upload Photo',
                            style: GoogleFonts.outfit(fontSize: 13, color: AppTheme.silkWhite),
                          ),
                          Text(
                            'AI will auto-extract fabric, color & cut',
                            style: GoogleFonts.outfit(fontSize: 10, color: AppTheme.mutedSilver),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  TextField(
                    controller: nameController,
                    style: const TextStyle(color: AppTheme.silkWhite),
                    decoration: const InputDecoration(labelText: 'Garment Name / Description'),
                  ),
                  const SizedBox(height: 12),

                  TextField(
                    controller: priceController,
                    keyboardType: TextInputType.number,
                    style: const TextStyle(color: AppTheme.silkWhite),
                    decoration: const InputDecoration(
                      labelText: 'Purchase Price (\$) for Cost-Per-Wear',
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Category Selector
                  Wrap(
                    spacing: 8,
                    children: GarmentCategory.values.map((cat) {
                      final isSelected = chosenCategory == cat;
                      return ChoiceChip(
                        label: Text(
                          cat.name.toUpperCase(),
                          style: GoogleFonts.outfit(
                            fontSize: 11,
                            color: isSelected ? AppTheme.noir : AppTheme.silkWhite,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        selected: isSelected,
                        selectedColor: AppTheme.gold,
                        backgroundColor: AppTheme.elevatedNoir,
                        onSelected: (val) {
                          if (val) setModalState(() => chosenCategory = cat);
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 20),

                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        if (nameController.text.trim().isEmpty) return;
                        final price = double.tryParse(priceController.text) ?? 100.0;
                        final newItem = WardrobeItem(
                          id: 'w_${DateTime.now().millisecondsSinceEpoch}',
                          name: nameController.text.trim(),
                          category: chosenCategory,
                          color: 'Neutral',
                          fabric: 'Cotton Blend',
                          season: 'All Season',
                          imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
                          purchasePrice: price,
                          timesWorn: 0,
                          addedDate: DateTime.now(),
                        );
                        ref.read(wardrobeProvider.notifier).addItem(newItem);
                        Navigator.pop(ctx);
                      },
                      child: const Text('SAVE TO CLOSET'),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}

class _CategoryFilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _CategoryFilterChip({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.gold : AppTheme.surfaceNoir,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isSelected ? AppTheme.gold : AppTheme.borderNoir),
        ),
        child: Text(
          label,
          style: GoogleFonts.outfit(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            letterSpacing: 1.0,
            color: isSelected ? AppTheme.noir : AppTheme.silkWhite,
          ),
        ),
      ),
    );
  }
}

class _WardrobeItemCard extends StatelessWidget {
  final WardrobeItem item;

  const _WardrobeItemCard({required this.item});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surfaceNoir,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderNoir),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(19)),
                  child: Image.network(
                    item.imageUrl,
                    width: double.infinity,
                    height: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      color: AppTheme.elevatedNoir,
                      child: const Center(
                        child: Icon(Icons.checkroom, color: AppTheme.mutedSilver),
                      ),
                    ),
                  ),
                ),
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppTheme.noir.withValues(alpha: 0.75),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '${item.timesWorn}x Worn',
                      style: GoogleFonts.outfit(
                        fontSize: 9,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.gold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.outfit(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.silkWhite,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  item.fabric,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.mutedSilver),
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '\$${item.purchasePrice.toInt()}',
                      style: GoogleFonts.outfit(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.silkWhite,
                      ),
                    ),
                    Text(
                      '\$${item.costPerWear.toStringAsFixed(1)}/wear',
                      style: GoogleFonts.outfit(
                        fontSize: 10,
                        fontWeight: FontWeight.w500,
                        color: AppTheme.champagne,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
