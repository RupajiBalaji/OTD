import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../outfits/outfits_repository.dart';

class ProfileDnaSheet extends ConsumerStatefulWidget {
  const ProfileDnaSheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const ProfileDnaSheet(),
    );
  }

  @override
  ConsumerState<ProfileDnaSheet> createState() => _ProfileDnaSheetState();
}

class _ProfileDnaSheetState extends ConsumerState<ProfileDnaSheet> {
  late TextEditingController _nameController;
  late TextEditingController _heightController;
  late String _bodyShape;
  late List<String> _selectedStyles;
  late String _preferredFit;
  bool _saved = false;

  final List<String> _availableShapes = [
    'Athletic / V-Taper',
    'Lean / Slim',
    'Broad / Regular',
  ];

  final List<String> _availableStyles = [
    'Old Money Heritage',
    'Clean Minimalist',
    'Smart Sartorial',
    'Relaxed Contemporary',
    'Streetwear Chic',
  ];

  final List<String> _availableFits = [
    'Tailored / Slim',
    'Regular Classic',
    'Relaxed / Drape',
  ];

  @override
  void initState() {
    super.initState();
    final profile = ref.read(userProfileProvider);
    _nameController = TextEditingController(text: profile.name);
    _heightController = TextEditingController(text: profile.height);
    _bodyShape = profile.bodyShape;
    _selectedStyles = List.from(profile.stylePersonas);
    _preferredFit = profile.preferredFit;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _heightController.dispose();
    super.dispose();
  }

  void _handleSave() {
    final current = ref.read(userProfileProvider);
    final updated = current.copyWith(
      name: _nameController.text.trim().isEmpty ? 'Curator' : _nameController.text.trim(),
      height: _heightController.text.trim().isEmpty ? "5'11\" (180 cm)" : _heightController.text.trim(),
      bodyShape: _bodyShape,
      stylePersonas: _selectedStyles.isEmpty ? ['Old Money Heritage'] : _selectedStyles,
      preferredFit: _preferredFit,
    );

    ref.read(userProfileProvider.notifier).updateProfile(updated);
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
            // Drag handle & close
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

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'STYLE DNA & PROFILE',
                      style: GoogleFonts.outfit(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.8,
                        color: AppTheme.gold,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Calibrate Personal Styling',
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

            // Name & Height
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'NAME',
                        style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w600, color: mutedColor),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: _nameController,
                        style: TextStyle(color: textColor, fontSize: 13),
                        decoration: InputDecoration(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          hintText: 'e.g. Curator',
                          fillColor: isDark ? AppTheme.noir : AppTheme.elevatedIvory,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'HEIGHT',
                        style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w600, color: mutedColor),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: _heightController,
                        style: TextStyle(color: textColor, fontSize: 13),
                        decoration: InputDecoration(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          hintText: "5'11\" (180 cm)",
                          fillColor: isDark ? AppTheme.noir : AppTheme.elevatedIvory,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // Body Shape
            Text(
              'BODY SILHOUETTE',
              style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w600, color: mutedColor),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _availableShapes.map((shape) {
                final isSelected = _bodyShape == shape;
                return ChoiceChip(
                  label: Text(
                    shape,
                    style: GoogleFonts.outfit(
                      fontSize: 11,
                      fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                      color: isSelected
                          ? (isDark ? AppTheme.noir : AppTheme.silkWhite)
                          : textColor,
                    ),
                  ),
                  selected: isSelected,
                  selectedColor: AppTheme.gold,
                  backgroundColor: isDark ? AppTheme.noir : AppTheme.elevatedIvory,
                  side: BorderSide(color: isSelected ? AppTheme.gold : borderColor),
                  onSelected: (val) {
                    if (val) setState(() => _bodyShape = shape);
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 18),

            // Style Personas
            Text(
              'PERSONAL STYLE DNA',
              style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w600, color: mutedColor),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _availableStyles.map((style) {
                final isSelected = _selectedStyles.contains(style);
                return FilterChip(
                  label: Text(
                    style,
                    style: GoogleFonts.outfit(
                      fontSize: 11,
                      fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                      color: isSelected
                          ? (isDark ? AppTheme.noir : AppTheme.silkWhite)
                          : textColor,
                    ),
                  ),
                  selected: isSelected,
                  selectedColor: AppTheme.gold,
                  backgroundColor: isDark ? AppTheme.noir : AppTheme.elevatedIvory,
                  side: BorderSide(color: isSelected ? AppTheme.gold : borderColor),
                  onSelected: (val) {
                    setState(() {
                      if (val) {
                        _selectedStyles.add(style);
                      } else {
                        _selectedStyles.remove(style);
                      }
                    });
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 18),

            // Fit Preference
            Text(
              'PREFERRED SILHOUETTE FIT',
              style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w600, color: mutedColor),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _availableFits.map((fit) {
                final isSelected = _preferredFit == fit;
                return ChoiceChip(
                  label: Text(
                    fit,
                    style: GoogleFonts.outfit(
                      fontSize: 11,
                      fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                      color: isSelected
                          ? (isDark ? AppTheme.noir : AppTheme.silkWhite)
                          : textColor,
                    ),
                  ),
                  selected: isSelected,
                  selectedColor: AppTheme.gold,
                  backgroundColor: isDark ? AppTheme.noir : AppTheme.elevatedIvory,
                  side: BorderSide(color: isSelected ? AppTheme.gold : borderColor),
                  onSelected: (val) {
                    if (val) setState(() => _preferredFit = fit);
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            // Save Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: Icon(_saved ? Icons.check : Icons.auto_awesome, size: 18),
                label: Text(
                  _saved ? 'STYLE DNA CALIBRATED & SAVED' : 'SAVE STYLE PREFERENCES',
                  style: GoogleFonts.outfit(fontWeight: FontWeight.w700, letterSpacing: 1.0),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: _saved ? AppTheme.emerald : AppTheme.gold,
                  foregroundColor: AppTheme.noir,
                ),
                onPressed: _handleSave,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
