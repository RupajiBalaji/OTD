import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/fashion_models.dart';
import '../wardrobe_repository.dart';

class AddPieceSheet extends ConsumerStatefulWidget {
  const AddPieceSheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const AddPieceSheet(),
    );
  }

  @override
  ConsumerState<AddPieceSheet> createState() => _AddPieceSheetState();
}

class _AddPieceSheetState extends ConsumerState<AddPieceSheet> {
  int _stage = 0; // 0: Upload/Camera, 1: AI Scanning, 2: Confirmation
  bool _saved = false;

  late TextEditingController _nameController;
  late TextEditingController _brandController;
  late TextEditingController _colorController;
  GarmentCategory _category = GarmentCategory.outerwear;
  String _subType = 'Overcoat';
  String _fit = 'Relaxed / Tailored';
  int _formality = 4;
  String _icon = '🧥';

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: 'Double-Faced Camel Wool Overcoat');
    _brandController = TextEditingController(text: 'Loro Piana');
    _colorController = TextEditingController(text: 'Vicuna Camel');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _brandController.dispose();
    _colorController.dispose();
    super.dispose();
  }

  void _simulateAiScan({
    String? name,
    String? brand,
    GarmentCategory? cat,
    String? sub,
    String? col,
    String? icon,
    int? form,
  }) {
    if (name != null) _nameController.text = name;
    if (brand != null) _brandController.text = brand;
    if (cat != null) _category = cat;
    if (sub != null) _subType = sub;
    if (col != null) _colorController.text = col;
    if (icon != null) _icon = icon;
    if (form != null) _formality = form;

    setState(() => _stage = 1);

    Future.delayed(const Duration(milliseconds: 900), () {
      if (mounted) {
        setState(() => _stage = 2);
      }
    });
  }

  void _handleConfirmSave() {
    final newItem = WardrobeItem(
      id: 'w_${DateTime.now().millisecondsSinceEpoch}',
      name: _nameController.text.trim().isEmpty ? 'Bespoke Garment' : _nameController.text.trim(),
      category: _category,
      subType: _subType,
      brand: _brandController.text.trim().isEmpty ? 'Artisanal' : _brandController.text.trim(),
      color: _colorController.text.trim().isEmpty ? 'Neutral' : _colorController.text.trim(),
      fit: _fit,
      formality: _formality,
      icon: _icon,
      imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      purchasePrice: 200.0,
      addedDate: DateTime.now(),
    );

    ref.read(wardrobeProvider.notifier).addItem(newItem);
    setState(() => _saved = true);

    Future.delayed(const Duration(milliseconds: 700), () {
      if (mounted) Navigator.pop(context);
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final surfaceColor = isDark ? AppTheme.surfaceNoir : AppTheme.surfaceIvory;
    final borderColor = isDark ? AppTheme.borderNoir : AppTheme.borderIvory;
    final textColor = isDark ? AppTheme.silkWhite : AppTheme.textIvoryDark;
    final mutedColor = isDark ? AppTheme.mutedSilver : AppTheme.textIvoryMuted;

    return Container(
      decoration: BoxDecoration(
        color: surfaceColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        border: const Border(top: BorderSide(color: AppTheme.gold, width: 1.5)),
      ),
      padding: EdgeInsets.only(
        left: 22,
        right: 22,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle bar
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: mutedColor.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'AI CLOSET INGESTION',
                      style: GoogleFonts.outfit(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.8,
                        color: AppTheme.gold,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Add Garment to Closet',
                      style: GoogleFonts.cormorantGaramond(
                        fontSize: 22,
                        fontWeight: FontWeight.w700,
                        color: textColor,
                      ),
                    ),
                  ],
                ),
                IconButton(
                  icon: Icon(Icons.close, color: mutedColor),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // STAGE 0: PHOTO UPLOAD
            if (_stage == 0) ...[
              GestureDetector(
                onTap: () => _simulateAiScan(),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 20),
                  decoration: BoxDecoration(
                    color: isDark ? AppTheme.elevatedNoir : AppTheme.elevatedIvory,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.gold.withValues(alpha: 0.4), width: 1.5),
                  ),
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppTheme.gold.withValues(alpha: 0.15),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.camera_alt_outlined, size: 28, color: AppTheme.gold),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Take Photo or Drop Image',
                        style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700, color: textColor),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'OTD Vision AI isolates garment silhouette, color & fabric cut',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.outfit(fontSize: 11, color: mutedColor),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              Text(
                'OR CHOOSE QUICK PRESET TO SCAN:',
                style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w600, color: mutedColor),
              ),
              const SizedBox(height: 10),

              Row(
                children: [
                  Expanded(
                    child: _PresetGarmentButton(
                      title: 'Oatmeal Flannel',
                      sub: 'Trousers',
                      icon: '👖',
                      onTap: () => _simulateAiScan(
                        name: 'Oatmeal Wool Flannel Trousers',
                        brand: 'Fox Brothers',
                        cat: GarmentCategory.bottoms,
                        sub: 'Flannel Trousers',
                        col: 'Oatmeal Beige',
                        icon: '👖',
                        form: 4,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _PresetGarmentButton(
                      title: 'Silk Safari',
                      sub: 'Overshirt',
                      icon: '🧥',
                      onTap: () => _simulateAiScan(
                        name: 'Raw Silk Safari Overshirt',
                        brand: 'Zegna',
                        cat: GarmentCategory.outerwear,
                        sub: 'Overshirt',
                        col: 'Olive Forest',
                        icon: '🧥',
                        form: 3,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _PresetGarmentButton(
                      title: 'Horsebit Calf',
                      sub: 'Loafers',
                      icon: '👞',
                      onTap: () => _simulateAiScan(
                        name: 'Calfskin Horsebit Loafers',
                        brand: 'Gucci 1953',
                        cat: GarmentCategory.footwear,
                        sub: 'Loafers',
                        col: 'Burgundy Noir',
                        icon: '👞',
                        form: 4,
                      ),
                    ),
                  ),
                ],
              ),
            ],

            // STAGE 1: AI SCANNING SPINNER
            if (_stage == 1) ...[
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 36),
                child: Center(
                  child: Column(
                    children: [
                      const SizedBox(
                        width: 48,
                        height: 48,
                        child: CircularProgressIndicator(
                          color: AppTheme.gold,
                          strokeWidth: 3,
                        ),
                      ),
                      const SizedBox(height: 20),
                      Text(
                        'OTD Vision Engine Scanning...',
                        style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700, color: textColor),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Segmenting layers and tagging formality & silhouette',
                        style: GoogleFonts.outfit(fontSize: 11, color: mutedColor),
                      ),
                    ],
                  ),
                ),
              ),
            ],

            // STAGE 2: CONFIRM / EDIT DETECTED GARMENT
            if (_stage == 2) ...[
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: AppTheme.gold.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppTheme.gold.withValues(alpha: 0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.auto_awesome, size: 16, color: AppTheme.gold),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'AI Identification Complete. Confirm or edit details:',
                        style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.gold),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),

              // Garment Name & Brand
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('GARMENT NAME', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w600, color: mutedColor)),
                        const SizedBox(height: 4),
                        TextField(
                          controller: _nameController,
                          style: TextStyle(color: textColor, fontSize: 13),
                          decoration: InputDecoration(
                            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            fillColor: isDark ? AppTheme.noir : AppTheme.elevatedIvory,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('BRAND / MAKER', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w600, color: mutedColor)),
                        const SizedBox(height: 4),
                        TextField(
                          controller: _brandController,
                          style: TextStyle(color: textColor, fontSize: 13),
                          decoration: InputDecoration(
                            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            fillColor: isDark ? AppTheme.noir : AppTheme.elevatedIvory,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Category & Color
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('CATEGORY', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w600, color: mutedColor)),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            color: isDark ? AppTheme.noir : AppTheme.elevatedIvory,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: borderColor),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<GarmentCategory>(
                              value: _category,
                              isExpanded: true,
                              dropdownColor: isDark ? AppTheme.surfaceNoir : AppTheme.surfaceIvory,
                              items: GarmentCategory.values
                                  .where((c) => c != GarmentCategory.onePiece)
                                  .map((c) => DropdownMenuItem(
                                        value: c,
                                        child: Text(c.name.toUpperCase(), style: TextStyle(color: textColor, fontSize: 12)),
                                      ))
                                  .toList(),
                              onChanged: (val) {
                                if (val != null) setState(() => _category = val);
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('COLOR TONE', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w600, color: mutedColor)),
                        const SizedBox(height: 4),
                        TextField(
                          controller: _colorController,
                          style: TextStyle(color: textColor, fontSize: 13),
                          decoration: InputDecoration(
                            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            fillColor: isDark ? AppTheme.noir : AppTheme.elevatedIvory,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Fit & Formality
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('FIT PROFILE', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w600, color: mutedColor)),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            color: isDark ? AppTheme.noir : AppTheme.elevatedIvory,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: borderColor),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: _fit,
                              isExpanded: true,
                              dropdownColor: isDark ? AppTheme.surfaceNoir : AppTheme.surfaceIvory,
                              items: ['Slim', 'Regular', 'Relaxed / Tailored']
                                  .map((f) => DropdownMenuItem(
                                        value: f,
                                        child: Text(f, style: TextStyle(color: textColor, fontSize: 12)),
                                      ))
                                  .toList(),
                              onChanged: (val) {
                                if (val != null) setState(() => _fit = val);
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('FORMALITY TIER (1-5)', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w600, color: mutedColor)),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            color: isDark ? AppTheme.noir : AppTheme.elevatedIvory,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: borderColor),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<int>(
                              value: _formality,
                              isExpanded: true,
                              dropdownColor: isDark ? AppTheme.surfaceNoir : AppTheme.surfaceIvory,
                              items: [1, 2, 3, 4, 5]
                                  .map((tier) => DropdownMenuItem(
                                        value: tier,
                                        child: Text('Tier $tier', style: TextStyle(color: textColor, fontSize: 12)),
                                      ))
                                  .toList(),
                              onChanged: (val) {
                                if (val != null) setState(() => _formality = val);
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Actions
              Row(
                children: [
                  OutlinedButton(
                    onPressed: () => setState(() => _stage = 0),
                    child: const Text('RETAKE'),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton.icon(
                      icon: Icon(_saved ? Icons.check : Icons.add_circle_outline, size: 18),
                      label: Text(_saved ? 'ADDED TO CLOSET!' : 'CONFIRM & ADD TO CLOSET'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _saved ? AppTheme.emerald : AppTheme.gold,
                        foregroundColor: AppTheme.noir,
                      ),
                      onPressed: _handleConfirmSave,
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _PresetGarmentButton extends StatelessWidget {
  final String title;
  final String sub;
  final String icon;
  final VoidCallback onTap;

  const _PresetGarmentButton({
    required this.title,
    required this.sub,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: isDark ? AppTheme.elevatedNoir : AppTheme.elevatedIvory,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: isDark ? AppTheme.borderNoir : AppTheme.borderIvory),
        ),
        child: Column(
          children: [
            Text(icon, style: const TextStyle(fontSize: 22)),
            const SizedBox(height: 4),
            Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w700),
            ),
            Text(
              sub,
              style: GoogleFonts.outfit(fontSize: 9, color: AppTheme.gold),
            ),
          ],
        ),
      ),
    );
  }
}
