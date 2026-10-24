import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/fashion_models.dart';
import '../wardrobe_repository.dart';
import 'add_piece_sheet.dart';

class WardrobeScreen extends ConsumerStatefulWidget {
  const WardrobeScreen({super.key});

  @override
  ConsumerState<WardrobeScreen> createState() => _WardrobeScreenState();
}

class _WardrobeScreenState extends ConsumerState<WardrobeScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  int? _selectedFormality; // null = all, 1..5

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

  void _showItemDetail(BuildContext context, WardrobeItem item, bool isDark) {
    final surfaceColor = isDark ? AppTheme.surfaceNoir : AppTheme.surfaceIvory;
    final elevatedColor = isDark ? AppTheme.elevatedNoir : AppTheme.elevatedIvory;
    final borderColor = isDark ? AppTheme.borderNoir : AppTheme.borderIvory;
    final textColor = isDark ? AppTheme.silkWhite : AppTheme.textIvoryDark;
    final mutedColor = isDark ? AppTheme.mutedSilver : AppTheme.textIvoryMuted;

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (_) => Container(
        decoration: BoxDecoration(
          color: surfaceColor,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          border: const Border(top: BorderSide(color: AppTheme.gold, width: 1.5)),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: mutedColor.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 16),

            // Top action bar: Edit / Delete
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'GARMENT INSPECTION',
                  style: GoogleFonts.outfit(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.5,
                    color: AppTheme.gold,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.delete_outline, size: 20, color: Color(0xFFF43F5E)),
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        backgroundColor: surfaceColor,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        title: Text('Delete Garment?', style: GoogleFonts.cormorantGaramond(fontWeight: FontWeight.bold, color: textColor)),
                        content: Text(
                          'Are you sure you want to remove "${item.name}" from your digital closet?',
                          style: GoogleFonts.outfit(fontSize: 13, color: mutedColor),
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(ctx),
                            child: Text('Cancel', style: GoogleFonts.outfit(color: mutedColor)),
                          ),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent, foregroundColor: Colors.white),
                            onPressed: () {
                              ref.read(wardrobeProvider.notifier).deleteItem(item.id);
                              Navigator.pop(ctx);
                              Navigator.pop(context);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Removed ${item.name} from wardrobe.')),
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

            // Item Image or Icon
            Center(
              child: Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: elevatedColor,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: AppTheme.gold),
                ),
                clipBehavior: Clip.antiAlias,
                alignment: Alignment.center,
                child: Image.network(
                  item.imageUrl,
                  width: 100,
                  height: 100,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Text(item.icon, style: const TextStyle(fontSize: 42)),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              item.brand.toUpperCase(),
              style: GoogleFonts.outfit(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.8,
                color: AppTheme.gold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              item.name,
              textAlign: TextAlign.center,
              style: GoogleFonts.cormorantGaramond(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                color: textColor,
              ),
            ),
            Text(
              '${item.subType} · ${item.color}',
              style: GoogleFonts.outfit(fontSize: 12, color: mutedColor),
            ),
            const SizedBox(height: 18),

            // Attributes Grid for AI
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: elevatedColor,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: borderColor),
              ),
              child: Column(
                children: [
                  _DetailRow(label: 'Category', value: item.category.name.toUpperCase(), textColor: textColor, mutedColor: mutedColor),
                  const Divider(height: 16),
                  _DetailRow(label: 'Silhouette Cut', value: item.fit, textColor: textColor, mutedColor: mutedColor),
                  const Divider(height: 16),
                  _DetailRow(
                    label: 'Formality Tier',
                    value: 'Tier ${item.formality} (${_getFormalityLabel(item.formality)})',
                    textColor: AppTheme.gold,
                    mutedColor: mutedColor,
                  ),
                  const Divider(height: 16),
                  _DetailRow(label: 'Color Family', value: item.color, textColor: textColor, mutedColor: mutedColor),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Styling note
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.gold.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppTheme.gold.withValues(alpha: 0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'AI STYLING COMPATIBILITY',
                    style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w700, color: AppTheme.gold, letterSpacing: 1.2),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Eligible for automatic curation in ${_getFormalityLabel(item.formality)} settings. Complements your personal style DNA.',
                    style: GoogleFonts.outfit(fontSize: 11, color: textColor),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: AppTheme.gold, foregroundColor: AppTheme.noir),
                onPressed: () => Navigator.pop(context),
                child: const Text('DONE'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final wardrobeAsync = ref.watch(wardrobeProvider);
    final selectedCategory = ref.watch(selectedCategoryProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final bgColor = isDark ? AppTheme.noir : AppTheme.ivorySilk;
    final surfaceColor = isDark ? AppTheme.surfaceNoir : AppTheme.surfaceIvory;
    final elevatedColor = isDark ? AppTheme.elevatedNoir : AppTheme.elevatedIvory;
    final borderColor = isDark ? AppTheme.borderNoir : AppTheme.borderIvory;
    final textColor = isDark ? AppTheme.silkWhite : AppTheme.textIvoryDark;
    final mutedColor = isDark ? AppTheme.mutedSilver : AppTheme.textIvoryMuted;

    return Scaffold(
      backgroundColor: bgColor,
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.gold,
        foregroundColor: AppTheme.noir,
        elevation: 4,
        icon: const Icon(Icons.add_a_photo_outlined, size: 20),
        label: Text(
          'ADD PIECE',
          style: GoogleFonts.outfit(fontWeight: FontWeight.w700, letterSpacing: 1.0),
        ),
        onPressed: () => AddPieceSheet.show(context),
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
                      'DIGITAL CLOSET MATRIX',
                      style: GoogleFonts.outfit(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 2.0,
                        color: AppTheme.gold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Your Wardrobe', style: Theme.of(context).textTheme.displayMedium),
                        wardrobeAsync.maybeWhen(
                          data: (items) => Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: elevatedColor,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: borderColor),
                            ),
                            child: Text(
                              '${items.length} PIECES',
                              style: GoogleFonts.outfit(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: AppTheme.gold,
                              ),
                            ),
                          ),
                          orElse: () => const SizedBox.shrink(),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Search, filter by tier, or tap any piece for details and styling attributes.',
                      style: GoogleFonts.outfit(fontSize: 12, color: mutedColor),
                    ),
                    const SizedBox(height: 14),

                    // Search Omnibar
                    TextField(
                      controller: _searchController,
                      onChanged: (val) => setState(() => _searchQuery = val.trim().toLowerCase()),
                      style: GoogleFonts.outfit(fontSize: 13, color: textColor),
                      decoration: InputDecoration(
                        hintText: 'Search by brand, garment name, fabric or color...',
                        hintStyle: GoogleFonts.outfit(fontSize: 12, color: mutedColor.withValues(alpha: 0.6)),
                        prefixIcon: const Icon(Icons.search, size: 18, color: AppTheme.gold),
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
                        fillColor: elevatedColor,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: borderColor)),
                        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: borderColor)),
                        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppTheme.gold)),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Formality Tier Filter Dropdown Row
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: elevatedColor,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: borderColor),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<int?>(
                              value: _selectedFormality,
                              isDense: true,
                              dropdownColor: surfaceColor,
                              hint: Text('All Formality Tiers', style: GoogleFonts.outfit(fontSize: 11, color: mutedColor)),
                              items: [
                                DropdownMenuItem<int?>(
                                  value: null,
                                  child: Text('All Formality Tiers', style: GoogleFonts.outfit(fontSize: 11, color: textColor)),
                                ),
                                DropdownMenuItem<int?>(
                                  value: 1,
                                  child: Text('Tier 1: Casual', style: GoogleFonts.outfit(fontSize: 11, color: textColor)),
                                ),
                                DropdownMenuItem<int?>(
                                  value: 2,
                                  child: Text('Tier 2: Smart Casual', style: GoogleFonts.outfit(fontSize: 11, color: textColor)),
                                ),
                                DropdownMenuItem<int?>(
                                  value: 3,
                                  child: Text('Tier 3: Elevated Date', style: GoogleFonts.outfit(fontSize: 11, color: textColor)),
                                ),
                                DropdownMenuItem<int?>(
                                  value: 4,
                                  child: Text('Tier 4: Sartorial', style: GoogleFonts.outfit(fontSize: 11, color: textColor)),
                                ),
                                DropdownMenuItem<int?>(
                                  value: 5,
                                  child: Text('Tier 5: Black-Tie', style: GoogleFonts.outfit(fontSize: 11, color: textColor)),
                                ),
                              ],
                              onChanged: (val) => setState(() => _selectedFormality = val),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        if (_selectedFormality != null || _searchQuery.isNotEmpty)
                          GestureDetector(
                            onTap: () {
                              _searchController.clear();
                              setState(() {
                                _searchQuery = '';
                                _selectedFormality = null;
                              });
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                              decoration: BoxDecoration(
                                color: AppTheme.gold.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                'Reset Filters',
                                style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.gold),
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Category Filter Chips
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      physics: const BouncingScrollPhysics(),
                      child: Row(
                        children: [
                          _CategoryFilterChip(
                            label: 'ALL',
                            isSelected: selectedCategory == null,
                            isDark: isDark,
                            onTap: () => ref.read(selectedCategoryProvider.notifier).state = null,
                          ),
                          ...GarmentCategory.values.where((c) => c != GarmentCategory.onePiece).map(
                            (cat) => _CategoryFilterChip(
                              label: cat.name.toUpperCase(),
                              isSelected: selectedCategory == cat,
                              isDark: isDark,
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

                if (filtered.isEmpty) {
                  return SliverFillRemaining(
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.checkroom_outlined, size: 48, color: mutedColor),
                          const SizedBox(height: 12),
                          Text(
                            'No garments match your filters',
                            style: GoogleFonts.cormorantGaramond(fontSize: 20, fontWeight: FontWeight.bold, color: textColor),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Try clearing search keywords or upload a new piece.',
                            style: GoogleFonts.outfit(fontSize: 12, color: mutedColor),
                          ),
                          const SizedBox(height: 14),
                          ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.gold, foregroundColor: AppTheme.noir),
                            icon: const Icon(Icons.add, size: 16),
                            label: const Text('Add Garment'),
                            onPressed: () => AddPieceSheet.show(context),
                          ),
                        ],
                      ),
                    ),
                  );
                }

                return SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  sliver: SliverGrid(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 0.72,
                    ),
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final item = filtered[index];
                        return GestureDetector(
                          onTap: () => _showItemDetail(context, item, isDark),
                          child: Container(
                            decoration: BoxDecoration(
                              color: surfaceColor,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: borderColor),
                            ),
                            padding: const EdgeInsets.all(12),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Container(
                                      width: 42,
                                      height: 42,
                                      decoration: BoxDecoration(
                                        color: elevatedColor,
                                        borderRadius: BorderRadius.circular(12),
                                        border: Border.all(color: borderColor),
                                      ),
                                      alignment: Alignment.center,
                                      child: Text(item.icon, style: const TextStyle(fontSize: 20)),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: AppTheme.gold.withValues(alpha: 0.12),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        'T${item.formality}',
                                        style: GoogleFonts.outfit(
                                          fontSize: 9,
                                          fontWeight: FontWeight.w700,
                                          color: AppTheme.gold,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const Spacer(),

                                Text(
                                  item.brand.toUpperCase(),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.outfit(
                                    fontSize: 9,
                                    fontWeight: FontWeight.w700,
                                    letterSpacing: 1.0,
                                    color: AppTheme.gold,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  item.name,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.outfit(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: textColor,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '${item.color} · ${item.fit}',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.outfit(
                                    fontSize: 10,
                                    color: mutedColor,
                                  ),
                                ),
                                const SizedBox(height: 8),

                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.symmetric(vertical: 4),
                                  alignment: Alignment.center,
                                  decoration: BoxDecoration(
                                    color: elevatedColor,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    _getFormalityLabel(item.formality).toUpperCase(),
                                    style: GoogleFonts.outfit(
                                      fontSize: 9,
                                      fontWeight: FontWeight.w600,
                                      color: AppTheme.gold,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
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
}

class _CategoryFilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final bool isDark;
  final VoidCallback onTap;

  const _CategoryFilterChip({
    required this.label,
    required this.isSelected,
    required this.isDark,
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
          color: isSelected
              ? AppTheme.gold
              : (isDark ? AppTheme.elevatedNoir : AppTheme.elevatedIvory),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected
                ? AppTheme.gold
                : (isDark ? AppTheme.borderNoir : AppTheme.borderIvory),
          ),
        ),
        child: Text(
          label,
          style: GoogleFonts.outfit(
            fontSize: 11,
            fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
            color: isSelected
                ? AppTheme.noir
                : (isDark ? AppTheme.silkWhite : AppTheme.textIvoryDark),
          ),
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;
  final Color textColor;
  final Color mutedColor;

  const _DetailRow({
    required this.label,
    required this.value,
    required this.textColor,
    required this.mutedColor,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: GoogleFonts.outfit(fontSize: 11, color: mutedColor)),
        Text(value, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600, color: textColor)),
      ],
    );
  }
}
