import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/widgets/otd_button.dart';
import '../../../shared/widgets/otd_chip.dart';
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
  late TextEditingController _cityController;
  late TextEditingController _heightController;
  late String _bodyShape;
  late List<String> _selectedStyles;
  late String _preferredFit;

  final List<String> _availableShapes = [
    'Rectangle',
    'Hourglass',
    'Inverted Triangle',
    'Oval',
  ];

  final List<String> _availableStyles = [
    'Minimal',
    'Smart Casual',
    'Streetwear',
    'Classic Formal',
    'Luxury',
    'Sporty',
  ];

  final List<String> _availableFits = [
    'Tailored',
    'Regular Classic',
    'Relaxed Oversized',
  ];

  @override
  void initState() {
    super.initState();
    final profile = ref.read(userProfileProvider);
    _nameController = TextEditingController(text: profile.name);
    _cityController = TextEditingController(text: profile.city);
    _heightController = TextEditingController(text: profile.height);
    _bodyShape = profile.bodyShape;
    _selectedStyles = List.from(profile.stylePersonas);
    _preferredFit = profile.preferredFit;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _cityController.dispose();
    _heightController.dispose();
    super.dispose();
  }

  void _handleSave() {
    final current = ref.read(userProfileProvider);
    final updated = current.copyWith(
      name: _nameController.text.trim().isEmpty ? current.name : _nameController.text.trim(),
      city: _cityController.text.trim().isEmpty ? current.city : _cityController.text.trim(),
      height: _heightController.text.trim().isEmpty ? current.height : _heightController.text.trim(),
      bodyShape: _bodyShape,
      stylePersonas: _selectedStyles.isEmpty ? current.stylePersonas : _selectedStyles,
      preferredFit: _preferredFit,
    );

    ref.read(userProfileProvider.notifier).updateProfile(updated);
    Navigator.pop(context);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Style DNA profile updated and saved.'),
        backgroundColor: Color(0xFF1C1612),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);

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
      padding: EdgeInsets.only(
        left: 22,
        right: 22,
        top: 16,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            // Center drag handle
            Center(
              child: Container(
                width: 44,
                height: 4,
                decoration: BoxDecoration(
                  color: colors.textMuted.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 34,
                      height: 34,
                      decoration: BoxDecoration(
                        color: colors.accent.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: colors.accent.withValues(alpha: 0.4)),
                      ),
                      alignment: Alignment.center,
                      child: Icon(Iconsax.slider_horizontal, size: 18, color: colors.accent),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'STYLE CALIBRATION',
                          style: OtdTokens.caption(
                            color: colors.accent,
                            weight: FontWeight.w700,
                          ).copyWith(letterSpacing: 1.5),
                        ),
                        Text(
                          'Style DNA Matrix',
                          style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
                        ),
                      ],
                    ),
                  ],
                ),
                IconButton(
                  icon: Icon(Icons.close, size: 20, color: colors.textMuted),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // Name Field
            Text('Full Name', style: OtdTokens.label(color: colors.textSecondary)),
            const SizedBox(height: 6),
            TextField(
              controller: _nameController,
              style: OtdTokens.bodyMedium(color: colors.textPrimary),
              decoration: InputDecoration(
                filled: true,
                fillColor: colors.canvas,
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              ),
            ),
            const SizedBox(height: 14),

            // City / Location Field
            Text('City / Preferred Weather Location', style: OtdTokens.label(color: colors.textSecondary)),
            const SizedBox(height: 6),
            TextField(
              controller: _cityController,
              style: OtdTokens.bodyMedium(color: colors.textPrimary),
              decoration: InputDecoration(
                hintText: 'e.g. Mumbai, London, New York',
                filled: true,
                fillColor: colors.canvas,
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              ),
            ),
            const SizedBox(height: 14),

            // Height Field
            Text('Height Measurement', style: OtdTokens.label(color: colors.textSecondary)),
            const SizedBox(height: 6),
            TextField(
              controller: _heightController,
              style: OtdTokens.bodyMedium(color: colors.textPrimary),
              decoration: InputDecoration(
                filled: true,
                fillColor: colors.canvas,
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              ),
            ),
            const SizedBox(height: 18),

            // Body Shape Selector
            Text('Body Architecture', style: OtdTokens.label(color: colors.textSecondary)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _availableShapes.map((shape) {
                final isSelected = _bodyShape.toLowerCase() == shape.toLowerCase();
                return OtdChip(
                  label: shape,
                  isSelected: isSelected,
                  onTap: () => setState(() => _bodyShape = shape),
                );
              }).toList(),
            ),
            const SizedBox(height: 18),

            // Style Personas
            Text('Preferred Style Aesthetics', style: OtdTokens.label(color: colors.textSecondary)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _availableStyles.map((style) {
                final isSelected = _selectedStyles.contains(style);
                return OtdChip(
                  label: style,
                  isSelected: isSelected,
                  onTap: () {
                    setState(() {
                      if (isSelected) {
                        if (_selectedStyles.length > 1) _selectedStyles.remove(style);
                      } else {
                        _selectedStyles.add(style);
                      }
                    });
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 18),

            // Preferred Silhouette Fit
            Text('Silhouette Drape & Fit', style: OtdTokens.label(color: colors.textSecondary)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _availableFits.map((fit) {
                final isSelected = _preferredFit.toLowerCase() == fit.toLowerCase();
                return OtdChip(
                  label: fit,
                  isSelected: isSelected,
                  onTap: () => setState(() => _preferredFit = fit),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            // Save Button
            OtdButton(
              text: 'SAVE PROFILE CALIBRATIONS',
              isFullWidth: true,
              onPressed: _handleSave,
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }
}
