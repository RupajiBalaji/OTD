import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/models/fashion_models.dart';
import '../../../shared/widgets/luxury_image.dart';
import '../../../shared/widgets/otd_button.dart';
import '../../../shared/widgets/otd_chip.dart';
import '../wardrobe_repository.dart';

class WardrobeScreen extends ConsumerStatefulWidget {
  const WardrobeScreen({super.key});

  @override
  ConsumerState<WardrobeScreen> createState() => _WardrobeScreenState();
}

class _WardrobeScreenState extends ConsumerState<WardrobeScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  int? _selectedFormality; // null = all, 1..5
  bool _isSectionedView = false;
  bool _isSearchVisible = false;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  String _getFormalityLabel(int tier) {
    switch (tier) {
      case 1:
        return 'Casual / Street';
      case 2:
        return 'Smart Casual';
      case 3:
        return 'Elevated Date';
      case 4:
        return 'Sartorial Tailored';
      case 5:
        return 'Black-Tie Formal';
      default:
        return 'Versatile';
    }
  }

  void _showItemDetail(BuildContext context, WardrobeItem item) {
    final colors = OtdColors.of(context);

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (bottomSheetCtx) => Consumer(
        builder: (context, ref, _) {
          // Watch the fresh item from repository in case wear count updates
          final wardrobeAsync = ref.watch(wardrobeProvider);
          final currentItem = wardrobeAsync.maybeWhen(
            data: (items) => items.firstWhere((i) => i.id == item.id, orElse: () => item),
            orElse: () => item,
          );
          final currentCostPerWear = currentItem.purchasePrice / (currentItem.timesWorn > 0 ? currentItem.timesWorn : 1);

          return Container(
            constraints: BoxConstraints(
              maxHeight: MediaQuery.of(context).size.height * 0.88,
            ),
            decoration: BoxDecoration(
              color: colors.card,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
              border: Border(top: BorderSide(color: colors.accent, width: 1.5)),
              boxShadow: OtdTokens.softShadow(isDark: colors.isDark, blur: 24, offsetY: -4),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Drag handle
                Container(
                  margin: const EdgeInsets.only(top: 12, bottom: 8),
                  width: 44,
                  height: 4,
                  decoration: BoxDecoration(
                    color: colors.textMuted.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),

                Expanded(
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Top bar: Label & Delete icon
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'GARMENT INSPECTION',
                              style: OtdTokens.caption(
                                color: colors.accent,
                                weight: FontWeight.w700,
                              ).copyWith(letterSpacing: 1.8),
                            ),
                            IconButton(
                              icon: const Icon(Iconsax.trash, size: 20, color: Color(0xFFF43F5E)),
                              tooltip: 'Delete Garment',
                              onPressed: () {
                                showDialog(
                                  context: context,
                                  builder: (ctx) => AlertDialog(
                                    backgroundColor: colors.card,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                                    title: Text(
                                      'Delete Garment?',
                                      style: OtdTokens.headingSmall(color: colors.textPrimary),
                                    ),
                                    content: Text(
                                      'Are you sure you want to remove "${currentItem.name}" from your digital closet?',
                                      style: OtdTokens.bodyMedium(color: colors.textSecondary),
                                    ),
                                    actions: [
                                      TextButton(
                                        onPressed: () => Navigator.pop(ctx),
                                        child: Text('Cancel', style: OtdTokens.label(color: colors.textMuted)),
                                      ),
                                      ElevatedButton(
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: const Color(0xFFF43F5E),
                                          foregroundColor: Colors.white,
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                        ),
                                        onPressed: () {
                                          ref.read(wardrobeProvider.notifier).deleteItem(currentItem.id);
                                          Navigator.pop(ctx);
                                          Navigator.pop(bottomSheetCtx);
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            SnackBar(content: Text('Removed ${currentItem.name} from wardrobe.')),
                                          );
                                        },
                                        child: const Text('Delete'),
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),

                        // Large Garment Image
                        Center(
                          child: Container(
                            width: double.infinity,
                            height: 220,
                            decoration: BoxDecoration(
                              color: colors.canvas,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: colors.border),
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(19),
                              child: Hero(
                                tag: 'closet_item_${currentItem.id}',
                                child: LuxuryImage(
                                  imageUrl: currentItem.imageUrl,
                                  fit: BoxFit.cover,
                                  fallbackIcon: currentItem.icon,
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Brand & Name
                        Text(
                          currentItem.brand.toUpperCase(),
                          style: OtdTokens.caption(
                            color: colors.accent,
                            weight: FontWeight.w700,
                          ).copyWith(letterSpacing: 1.5),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          currentItem.name,
                          style: OtdTokens.headingMedium(color: colors.textPrimary, weight: FontWeight.w700),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${currentItem.subType} · ${currentItem.color} · ${currentItem.season}',
                          style: OtdTokens.bodySmall(color: colors.textSecondary),
                        ),
                        const SizedBox(height: 16),

                        // Wear Analytics Card (Times Worn & Cost per Wear)
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: colors.accent.withValues(alpha: 0.08),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: colors.accent.withValues(alpha: 0.25)),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              Column(
                                children: [
                                  Text(
                                    '${currentItem.timesWorn}',
                                    style: OtdTokens.headingMedium(color: colors.textPrimary, weight: FontWeight.w700),
                                  ),
                                  Text('Times Worn', style: OtdTokens.caption(color: colors.textSecondary)),
                                ],
                              ),
                              Container(height: 36, width: 1, color: colors.border),
                              Column(
                                children: [
                                  Text(
                                    '\$${currentCostPerWear.toStringAsFixed(1)}',
                                    style: OtdTokens.headingMedium(color: colors.accent, weight: FontWeight.w700),
                                  ),
                                  Text('Cost per Wear', style: OtdTokens.caption(color: colors.textSecondary)),
                                ],
                              ),
                              Container(height: 36, width: 1, color: colors.border),
                              Column(
                                children: [
                                  Text(
                                    '\$${currentItem.purchasePrice.toStringAsFixed(0)}',
                                    style: OtdTokens.headingMedium(color: colors.textPrimary, weight: FontWeight.w700),
                                  ),
                                  Text('Purchase Price', style: OtdTokens.caption(color: colors.textSecondary)),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Garment Attributes
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: colors.canvas,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: colors.border),
                          ),
                          child: Column(
                            children: [
                              _DetailRow(label: 'Category', value: currentItem.category.name.toUpperCase(), colors: colors),
                              const Divider(height: 18),
                              _DetailRow(label: 'Fabric & Material', value: currentItem.fabric.isNotEmpty ? currentItem.fabric : 'Pure Cotton', colors: colors),
                              const Divider(height: 18),
                              _DetailRow(label: 'Silhouette Fit', value: currentItem.fit, colors: colors),
                              const Divider(height: 18),
                              _DetailRow(
                                label: 'Formality Tier',
                                value: 'Tier ${currentItem.formality} (${_getFormalityLabel(currentItem.formality)})',
                                colors: colors,
                                isAccent: true,
                              ),
                              const Divider(height: 18),
                              _DetailRow(label: 'Color Palette', value: currentItem.color, colors: colors),
                            ],
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Action Buttons: Mark Worn & Edit
                        Row(
                          children: [
                            Expanded(
                              flex: 3,
                              child: OtdButton(
                                text: 'MARK AS WORN',
                                icon: const Icon(Iconsax.tick_circle, size: 18, color: Colors.white),
                                isFullWidth: true,
                                onPressed: () {
                                  ref.read(wardrobeProvider.notifier).markWorn(currentItem.id);
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('Marked "${currentItem.name}" as worn! (Now ${currentItem.timesWorn + 1} wears)')),
                                  );
                                },
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              flex: 2,
                              child: OtdButton(
                                text: 'EDIT',
                                variant: OtdButtonVariant.outline,
                                isFullWidth: true,
                                onPressed: () {
                                  _showEditGarmentDialog(context, currentItem);
                                },
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  void _showEditGarmentDialog(BuildContext context, WardrobeItem item) {
    final nameCtrl = TextEditingController(text: item.name);
    final brandCtrl = TextEditingController(text: item.brand);
    final colorCtrl = TextEditingController(text: item.color);
    int formality = item.formality;

    showDialog(
      context: context,
      builder: (ctx) {
        final colors = OtdColors.of(ctx);
        return StatefulBuilder(
          builder: (dialogCtx, setDialogState) {
            return AlertDialog(
              backgroundColor: colors.card,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: Text('Edit Garment Attributes', style: OtdTokens.headingSmall(color: colors.textPrimary)),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: nameCtrl,
                      decoration: const InputDecoration(labelText: 'Garment Name'),
                      style: OtdTokens.bodyMedium(color: colors.textPrimary),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: brandCtrl,
                      decoration: const InputDecoration(labelText: 'Brand'),
                      style: OtdTokens.bodyMedium(color: colors.textPrimary),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: colorCtrl,
                      decoration: const InputDecoration(labelText: 'Color'),
                      style: OtdTokens.bodyMedium(color: colors.textPrimary),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Formality Tier', style: OtdTokens.label(color: colors.textSecondary)),
                        DropdownButton<int>(
                          value: formality,
                          dropdownColor: colors.card,
                          items: [1, 2, 3, 4, 5].map((t) => DropdownMenuItem(value: t, child: Text('Tier $t'))).toList(),
                          onChanged: (val) {
                            if (val != null) setDialogState(() => formality = val);
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: Text('Cancel', style: OtdTokens.label(color: colors.textMuted)),
                ),
                TextButton(
                  onPressed: () {
                    final updated = WardrobeItem(
                      id: item.id,
                      name: nameCtrl.text.trim().isNotEmpty ? nameCtrl.text.trim() : item.name,
                      category: item.category,
                      subType: item.subType,
                      brand: brandCtrl.text.trim().isNotEmpty ? brandCtrl.text.trim() : item.brand,
                      color: colorCtrl.text.trim().isNotEmpty ? colorCtrl.text.trim() : item.color,
                      fabric: item.fabric,
                      fit: item.fit,
                      formality: formality,
                      season: item.season,
                      imageUrl: item.imageUrl,
                      icon: item.icon,
                      timesWorn: item.timesWorn,
                      purchasePrice: item.purchasePrice,
                      addedDate: item.addedDate,
                    );
                    ref.read(wardrobeProvider.notifier).updateItem(updated);
                    Navigator.pop(ctx);
                    Navigator.pop(context); // Close bottom sheet to refresh cleanly
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Updated ${updated.name}')),
                    );
                  },
                  child: Text('Save', style: OtdTokens.label(color: colors.accent)),
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);
    final wardrobeAsync = ref.watch(wardrobeProvider);
    final selectedCategory = ref.watch(selectedCategoryProvider);

    return Scaffold(
      backgroundColor: colors.canvas,
      floatingActionButton: FloatingActionButton(
        backgroundColor: colors.accent,
        foregroundColor: AppTheme.noir,
        elevation: 4,
        shape: const CircleBorder(),
        onPressed: () => context.push('/closet/add'),
        child: const Icon(Icons.add, size: 28),
      ),
      body: SafeArea(
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // Top App Bar: Title, Count, View Mode Switch, Search Icon
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: OtdTokens.screenPaddingH,
                  vertical: 14,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Sub-tag and action row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'DIGITAL CLOSET MATRIX',
                          style: OtdTokens.caption(
                            color: colors.accent,
                            weight: FontWeight.w700,
                          ).copyWith(letterSpacing: 2.0),
                        ),
                        Row(
                          children: [
                            // Search toggle icon
                            IconButton(
                              icon: Icon(
                                _isSearchVisible ? Icons.search_off : Iconsax.search_normal_1,
                                size: 20,
                                color: colors.textPrimary,
                              ),
                              onPressed: () {
                                setState(() {
                                  _isSearchVisible = !_isSearchVisible;
                                  if (!_isSearchVisible) {
                                    _searchController.clear();
                                    _searchQuery = '';
                                  }
                                });
                              },
                            ),
                            // View Mode Toggle (Grid vs Sectioned)
                            IconButton(
                              icon: Icon(
                                _isSectionedView ? Iconsax.grid_3 : Iconsax.row_vertical,
                                size: 20,
                                color: colors.accent,
                              ),
                              tooltip: _isSectionedView ? 'Switch to Grid View' : 'Switch to Sectioned View',
                              onPressed: () {
                                setState(() => _isSectionedView = !_isSectionedView);
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),

                    // Main Title & Items Count
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          _isSectionedView ? 'Your Closet' : 'Your Digital Closet',
                          style: OtdTokens.headingMedium(color: colors.textPrimary, weight: FontWeight.w700),
                        ),
                        wardrobeAsync.maybeWhen(
                          data: (items) => Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: colors.card,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: colors.border),
                            ),
                            child: Text(
                              '${items.length} PIECES',
                              style: OtdTokens.caption(
                                color: colors.accent,
                                weight: FontWeight.w700,
                              ).copyWith(letterSpacing: 1.0),
                            ),
                          ),
                          orElse: () => const SizedBox.shrink(),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Expandable Search Omnibar
                    if (_isSearchVisible) ...[
                      TextField(
                        controller: _searchController,
                        onChanged: (val) => setState(() => _searchQuery = val.trim().toLowerCase()),
                        style: OtdTokens.bodyMedium(color: colors.textPrimary),
                        decoration: InputDecoration(
                          hintText: 'Search by brand, garment, color...',
                          prefixIcon: Icon(Iconsax.search_normal_1, size: 18, color: colors.accent),
                          suffixIcon: _searchQuery.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(Icons.clear, size: 16),
                                  onPressed: () {
                                    _searchController.clear();
                                    setState(() => _searchQuery = '');
                                  },
                                )
                              : null,
                          filled: true,
                          fillColor: colors.card,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        ),
                      ),
                      const SizedBox(height: 10),
                    ],

                    // Category Chips (All, Tops, Bottoms, Shoes, Accessories, Outerwear)
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      physics: const BouncingScrollPhysics(),
                      child: Row(
                        children: [
                          OtdChip(
                            label: 'All',
                            isSelected: selectedCategory == null,
                            onTap: () => ref.read(selectedCategoryProvider.notifier).state = null,
                          ),
                          const SizedBox(width: 8),
                          OtdChip(
                            label: 'Tops',
                            isSelected: selectedCategory == GarmentCategory.tops,
                            onTap: () => ref.read(selectedCategoryProvider.notifier).state = GarmentCategory.tops,
                          ),
                          const SizedBox(width: 8),
                          OtdChip(
                            label: 'Bottoms',
                            isSelected: selectedCategory == GarmentCategory.bottoms,
                            onTap: () => ref.read(selectedCategoryProvider.notifier).state = GarmentCategory.bottoms,
                          ),
                          const SizedBox(width: 8),
                          OtdChip(
                            label: 'Shoes',
                            isSelected: selectedCategory == GarmentCategory.footwear,
                            onTap: () => ref.read(selectedCategoryProvider.notifier).state = GarmentCategory.footwear,
                          ),
                          const SizedBox(width: 8),
                          OtdChip(
                            label: 'Accessories',
                            isSelected: selectedCategory == GarmentCategory.accessories,
                            onTap: () => ref.read(selectedCategoryProvider.notifier).state = GarmentCategory.accessories,
                          ),
                          const SizedBox(width: 8),
                          OtdChip(
                            label: 'Outerwear',
                            isSelected: selectedCategory == GarmentCategory.outerwear,
                            onTap: () => ref.read(selectedCategoryProvider.notifier).state = GarmentCategory.outerwear,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Content: Either Sectioned View (Screen 16) or 3-Column Grid View (Screen 13)
            wardrobeAsync.when(
              loading: () => const SliverFillRemaining(
                child: Center(
                  child: CircularProgressIndicator(color: AppTheme.gold),
                ),
              ),
              error: (err, _) => SliverFillRemaining(
                child: Center(
                  child: Text('Error: $err', style: const TextStyle(color: Colors.red)),
                ),
              ),
              data: (allItems) {
                var filtered = selectedCategory == null
                    ? allItems
                    : allItems.where((item) => item.category == selectedCategory).toList();

                if (_selectedFormality != null) {
                  filtered = filtered.where((item) => item.formality == _selectedFormality).toList();
                }

                if (_searchQuery.isNotEmpty) {
                  filtered = filtered.where((item) {
                    final target = '${item.name} ${item.brand} ${item.color} ${item.subType} ${item.fabric}'.toLowerCase();
                    return target.contains(_searchQuery);
                  }).toList();
                }

                // If user toggled Sectioned View and no specific single category is selected
                if (_isSectionedView && selectedCategory == null && _searchQuery.isEmpty) {
                  return _buildSectionedView(context, allItems, colors);
                }

                // Empty state
                if (filtered.isEmpty) {
                  return SliverFillRemaining(
                    hasScrollBody: false,
                    child: Center(
                      child: Padding(
                        padding: const EdgeInsets.all(32),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Iconsax.folder_open, size: 52, color: colors.textMuted.withValues(alpha: 0.5)),
                            const SizedBox(height: 16),
                            Text(
                              'No pieces found',
                              style: OtdTokens.headingSmall(color: colors.textPrimary),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'Add your first item to build your digital wardrobe.',
                              textAlign: TextAlign.center,
                              style: OtdTokens.bodySmall(color: colors.textSecondary),
                            ),
                            const SizedBox(height: 20),
                            OtdButton(
                              text: 'Add a Piece',
                              icon: const Icon(Iconsax.add, size: 18, color: Colors.white),
                              onPressed: () => context.push('/closet/add'),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }

                // Screen 13: 3-column Grid View
                return SliverPadding(
                  padding: const EdgeInsets.fromLTRB(
                    OtdTokens.screenPaddingH,
                    6,
                    OtdTokens.screenPaddingH,
                    90,
                  ),
                  sliver: SliverGrid(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 12,
                      childAspectRatio: 0.62,
                    ),
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final item = filtered[index];
                        return _buildClosetGridCard(context, item, colors);
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

  // 3-Column Card item
  Widget _buildClosetGridCard(BuildContext context, WardrobeItem item, OtdColors colors) {
    return GestureDetector(
      onTap: () => _showItemDetail(context, item),
      child: Container(
        decoration: BoxDecoration(
          color: colors.card,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: colors.border),
          boxShadow: OtdTokens.softShadow(isDark: colors.isDark, blur: 8, offsetY: 2),
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Garment Image (Aspect ~ 1:1)
            Expanded(
              child: Stack(
                children: [
                  Positioned.fill(
                    child: LuxuryImage(
                      imageUrl: item.imageUrl,
                      fit: BoxFit.cover,
                      fallbackIcon: item.icon,
                    ),
                  ),
                  // Formality badge in top corner
                  Positioned(
                    top: 6,
                    right: 6,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.65),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        'T${item.formality}',
                        style: const TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.gold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Card text info
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 6, 8, 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.brand.toUpperCase(),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: OtdTokens.caption(
                      color: colors.accent,
                      weight: FontWeight.w700,
                    ).copyWith(fontSize: 8.5, letterSpacing: 0.8),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    item.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: OtdTokens.label(
                      color: colors.textPrimary,
                      weight: FontWeight.w600,
                    ).copyWith(fontSize: 11),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    item.color,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: OtdTokens.caption(
                      color: colors.textMuted,
                    ).copyWith(fontSize: 9),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Screen 16: Sectioned View with Horizontal rows and "See all"
  Widget _buildSectionedView(BuildContext context, List<WardrobeItem> items, OtdColors colors) {
    final tops = items.where((i) => i.category == GarmentCategory.tops).toList();
    final bottoms = items.where((i) => i.category == GarmentCategory.bottoms).toList();
    final shoes = items.where((i) => i.category == GarmentCategory.footwear).toList();
    final outerwear = items.where((i) => i.category == GarmentCategory.outerwear).toList();
    final accessories = items.where((i) => i.category == GarmentCategory.accessories).toList();

    return SliverPadding(
      padding: const EdgeInsets.only(bottom: 90),
      sliver: SliverList(
        delegate: SliverChildListDelegate([
          _buildCategorySection(
            context,
            title: 'Tops',
            category: GarmentCategory.tops,
            items: tops,
            colors: colors,
          ),
          _buildCategorySection(
            context,
            title: 'Bottoms',
            category: GarmentCategory.bottoms,
            items: bottoms,
            colors: colors,
          ),
          _buildCategorySection(
            context,
            title: 'Shoes',
            category: GarmentCategory.footwear,
            items: shoes,
            colors: colors,
          ),
          if (outerwear.isNotEmpty)
            _buildCategorySection(
              context,
              title: 'Outerwear',
              category: GarmentCategory.outerwear,
              items: outerwear,
              colors: colors,
            ),
          if (accessories.isNotEmpty)
            _buildCategorySection(
              context,
              title: 'Accessories',
              category: GarmentCategory.accessories,
              items: accessories,
              colors: colors,
            ),
        ]),
      ),
    );
  }

  Widget _buildCategorySection(
    BuildContext context, {
    required String title,
    required GarmentCategory category,
    required List<WardrobeItem> items,
    required OtdColors colors,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: OtdTokens.screenPaddingH, vertical: 10),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Text(
                    title,
                    style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: colors.card,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: colors.border),
                    ),
                    child: Text(
                      '${items.length}',
                      style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700),
                    ),
                  ),
                ],
              ),
              GestureDetector(
                onTap: () {
                  ref.read(selectedCategoryProvider.notifier).state = category;
                  setState(() => _isSectionedView = false);
                },
                child: Row(
                  children: [
                    Text(
                      'See all',
                      style: OtdTokens.label(color: colors.accent, weight: FontWeight.w600),
                    ),
                    const SizedBox(width: 2),
                    Icon(Icons.chevron_right, size: 16, color: colors.accent),
                  ],
                ),
              ),
            ],
          ),
        ),
        if (items.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: OtdTokens.screenPaddingH, vertical: 8),
            child: Text('No $title in wardrobe yet', style: OtdTokens.bodySmall(color: colors.textMuted)),
          )
        else
          SizedBox(
            height: 195,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: OtdTokens.screenPaddingH),
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (context, idx) {
                final item = items[idx];
                return SizedBox(
                  width: 125,
                  child: _buildClosetGridCard(context, item, colors),
                );
              },
            ),
          ),
        const SizedBox(height: 12),
      ],
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;
  final OtdColors colors;
  final bool isAccent;

  const _DetailRow({
    required this.label,
    required this.value,
    required this.colors,
    this.isAccent = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: OtdTokens.caption(color: colors.textSecondary)),
        Flexible(
          child: Text(
            value,
            textAlign: TextAlign.right,
            style: OtdTokens.label(
              color: isAccent ? colors.accent : colors.textPrimary,
              weight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }
}
