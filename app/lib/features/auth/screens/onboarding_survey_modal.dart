import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../outfits/outfits_repository.dart';

class OnboardingSurveyModal extends ConsumerStatefulWidget {
  const OnboardingSurveyModal({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const OnboardingSurveyModal(),
    );
  }

  @override
  ConsumerState<OnboardingSurveyModal> createState() => _OnboardingSurveyModalState();
}

class _OnboardingSurveyModalState extends ConsumerState<OnboardingSurveyModal> {
  int _currentStep = 1;

  // Step 1: Personal Details
  late TextEditingController _nameController;
  int _age = 22;
  String _gender = 'Male';
  int _heightValue = 178;
  final String _heightUnit = 'cm';
  String _bodyShape = 'Athletic';
  String _skinTone = 'Medium';

  // Step 2: Style Preferences
  final Set<String> _selectedStyles = {'Minimal', 'Streetwear'};
  String _fitPreference = 'Slim Fit';
  final Set<String> _selectedColours = {'Black', 'Beige', 'White'};

  // Step 3: Goals & Interests
  final Set<String> _selectedGoals = {
    'Look good in everyday life',
    'Dress better for special occasions',
    'Improve my personal style'
  };
  final Set<String> _selectedOccasions = {'College', 'Dates', 'Casual Outings'};

  @override
  void initState() {
    super.initState();
    final profile = ref.read(userProfileProvider);
    _nameController = TextEditingController(text: profile.name);
    _bodyShape = profile.bodyShape;
    _fitPreference = profile.preferredFit;
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  void _handleComplete() {
    final current = ref.read(userProfileProvider);
    final updated = current.copyWith(
      name: _nameController.text.trim().isEmpty ? 'Mustafa Ali' : _nameController.text.trim(),
      height: '$_heightValue $_heightUnit',
      bodyShape: _bodyShape,
      stylePersonas: _selectedStyles.toList(),
      preferredFit: _fitPreference,
      palettePreferences: _selectedColours.toList(),
    );
    ref.read(userProfileProvider.notifier).updateProfile(updated);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Style Calibration Complete! Your personalized AI stylist profile is saved.'),
        backgroundColor: AppTheme.gold,
      ),
    );
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final surfaceColor = isDark ? AppTheme.surfaceNoir : AppTheme.surfaceIvory;
    final elevatedColor = isDark ? AppTheme.elevatedNoir : AppTheme.elevatedIvory;
    final borderColor = isDark ? AppTheme.borderNoir : AppTheme.borderIvory;
    final textColor = isDark ? AppTheme.silkWhite : AppTheme.textIvoryDark;
    final mutedColor = isDark ? AppTheme.mutedSilver : AppTheme.textIvoryMuted;

    return Container(
      height: MediaQuery.of(context).size.height * 0.88,
      decoration: BoxDecoration(
        color: surfaceColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        border: const Border(top: BorderSide(color: AppTheme.gold, width: 1.5)),
      ),
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 16,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: Column(
        children: [
          // Drag handle
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: mutedColor.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 14),

          // Header & Stepper
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'STEP $_currentStep OF 3 · STYLE ONBOARDING',
                    style: GoogleFonts.outfit(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.5,
                      color: AppTheme.gold,
                    ),
                  ),
                  Text(
                    _currentStep == 1
                        ? 'Personal Details & Biometrics'
                        : _currentStep == 2
                            ? 'Style Preferences & Colors'
                            : 'Goals & Wardrobe Utility',
                    style: GoogleFonts.cormorantGaramond(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      color: textColor,
                    ),
                  ),
                ],
              ),
              IconButton(
                icon: const Icon(Icons.close, size: 20),
                color: mutedColor,
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: _currentStep / 3.0,
              backgroundColor: borderColor,
              valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.gold),
              minHeight: 4,
            ),
          ),
          const SizedBox(height: 16),

          // Content Pages
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: _currentStep == 1
                  ? _buildStep1(textColor, mutedColor, elevatedColor, borderColor)
                  : _currentStep == 2
                      ? _buildStep2(textColor, mutedColor, elevatedColor, borderColor)
                      : _buildStep3(textColor, mutedColor, elevatedColor, borderColor),
            ),
          ),

          // Footer Navigation Buttons
          const SizedBox(height: 14),
          Row(
            children: [
              if (_currentStep > 1) ...[
                Expanded(
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      side: BorderSide(color: borderColor),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    onPressed: () => setState(() => _currentStep--),
                    child: Text('Back', style: GoogleFonts.outfit(fontWeight: FontWeight.w700, color: textColor)),
                  ),
                ),
                const SizedBox(width: 12),
              ],
              Expanded(
                flex: 2,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.gold,
                    foregroundColor: AppTheme.noir,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  onPressed: () {
                    if (_currentStep < 3) {
                      setState(() => _currentStep++);
                    } else {
                      _handleComplete();
                    }
                  },
                  child: Text(
                    _currentStep == 3 ? 'COMPLETE CALIBRATION' : 'CONTINUE →',
                    style: GoogleFonts.outfit(fontWeight: FontWeight.w800, letterSpacing: 1.0),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStep1(Color textColor, Color mutedColor, Color elevatedColor, Color borderColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Full Name', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
        const SizedBox(height: 6),
        TextField(
          controller: _nameController,
          style: TextStyle(color: textColor, fontSize: 13),
          decoration: InputDecoration(
            hintText: 'Mustafa Ali',
            filled: true,
            fillColor: elevatedColor,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: borderColor)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: borderColor)),
          ),
        ),
        const SizedBox(height: 16),

        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Age', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                    decoration: BoxDecoration(color: elevatedColor, borderRadius: BorderRadius.circular(14), border: Border.all(color: borderColor)),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<int>(
                        value: _age,
                        isExpanded: true,
                        dropdownColor: elevatedColor,
                        items: List.generate(60, (i) => i + 16).map((a) => DropdownMenuItem(value: a, child: Text('$a', style: TextStyle(color: textColor)))).toList(),
                        onChanged: (v) => setState(() => _age = v ?? 22),
                      ),
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
                  Text('Gender', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                    decoration: BoxDecoration(color: elevatedColor, borderRadius: BorderRadius.circular(14), border: Border.all(color: borderColor)),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _gender,
                        isExpanded: true,
                        dropdownColor: elevatedColor,
                        items: ['Male', 'Female', 'Non-Binary', 'Prefer not to say'].map((g) => DropdownMenuItem(value: g, child: Text(g, style: TextStyle(color: textColor)))).toList(),
                        onChanged: (v) => setState(() => _gender = v ?? 'Male'),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        Text('Height: $_heightValue $_heightUnit', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
        Slider(
          value: _heightValue.toDouble(),
          min: 140,
          max: 220,
          activeColor: AppTheme.gold,
          inactiveColor: borderColor,
          onChanged: (v) => setState(() => _heightValue = v.toInt()),
        ),
        const SizedBox(height: 10),

        Text('Body Shape & Silhouette', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: ['Athletic', 'Slim', 'Average', 'Muscular', 'Broad / Large'].map((s) {
            final isSelected = _bodyShape == s;
            return ChoiceChip(
              label: Text(s),
              selected: isSelected,
              selectedColor: AppTheme.gold,
              backgroundColor: elevatedColor,
              labelStyle: GoogleFonts.outfit(fontSize: 11, fontWeight: isSelected ? FontWeight.bold : FontWeight.w500, color: isSelected ? AppTheme.noir : textColor),
              onSelected: (_) => setState(() => _bodyShape = s),
            );
          }).toList(),
        ),
        const SizedBox(height: 16),

        Text('Skin Tone / Complexion Palette', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: ['Fair', 'Light', 'Medium / Warm', 'Olive / Tan', 'Deep / Rich'].map((t) {
            final isSelected = _skinTone == t;
            return ChoiceChip(
              label: Text(t),
              selected: isSelected,
              selectedColor: AppTheme.gold,
              backgroundColor: elevatedColor,
              labelStyle: GoogleFonts.outfit(fontSize: 11, fontWeight: isSelected ? FontWeight.bold : FontWeight.w500, color: isSelected ? AppTheme.noir : textColor),
              onSelected: (_) => setState(() => _skinTone = t),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildStep2(Color textColor, Color mutedColor, Color elevatedColor, Color borderColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Style Categories (Multi-select)', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            'Minimal',
            'Old Money / Classic',
            'Streetwear',
            'Smart Casual',
            'Sartorial Tailored',
            'Korean Aesthetic',
            'Casual Chic',
          ].map((style) {
            final isSelected = _selectedStyles.contains(style);
            return FilterChip(
              label: Text(style),
              selected: isSelected,
              selectedColor: AppTheme.gold,
              backgroundColor: elevatedColor,
              labelStyle: GoogleFonts.outfit(fontSize: 11, fontWeight: isSelected ? FontWeight.bold : FontWeight.w500, color: isSelected ? AppTheme.noir : textColor),
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

        Text('Fit Preference', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
        const SizedBox(height: 8),
        Row(
          children: ['Slim Fit', 'Regular Fit', 'Loose Fit'].map((fit) {
            final isSelected = _fitPreference == fit;
            return Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _fitPreference = fit),
                child: Container(
                  margin: const EdgeInsets.only(right: 6),
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  decoration: BoxDecoration(
                    color: isSelected ? AppTheme.gold : elevatedColor,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: isSelected ? AppTheme.gold : borderColor),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    fit,
                    style: GoogleFonts.outfit(fontSize: 11, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal, color: isSelected ? AppTheme.noir : textColor),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 18),

        Text('Preferred Color Palette', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: ['Black', 'White', 'Beige', 'Navy Blue', 'Earth Tones', 'Pastels', 'Olive Green', 'Charcoal'].map((col) {
            final isSelected = _selectedColours.contains(col);
            return FilterChip(
              label: Text(col),
              selected: isSelected,
              selectedColor: AppTheme.gold,
              backgroundColor: elevatedColor,
              labelStyle: GoogleFonts.outfit(fontSize: 11, fontWeight: isSelected ? FontWeight.bold : FontWeight.w500, color: isSelected ? AppTheme.noir : textColor),
              onSelected: (val) {
                setState(() {
                  if (val) {
                    _selectedColours.add(col);
                  } else {
                    _selectedColours.remove(col);
                  }
                });
              },
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildStep3(Color textColor, Color mutedColor, Color elevatedColor, Color borderColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('What are your main goals with OTD?', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
        const SizedBox(height: 8),
        ...[
          'Look good in everyday life',
          'Dress better for special occasions',
          'Improve my personal style',
          'Maximize the clothes I already own',
          'Build a cohesive capsule wardrobe',
        ].map((goal) {
          final isSelected = _selectedGoals.contains(goal);
          return CheckboxListTile(
            contentPadding: EdgeInsets.zero,
            dense: true,
            activeColor: AppTheme.gold,
            checkColor: AppTheme.noir,
            title: Text(goal, style: GoogleFonts.outfit(fontSize: 12, color: textColor)),
            value: isSelected,
            onChanged: (val) {
              setState(() {
                if (val == true) {
                  _selectedGoals.add(goal);
                } else {
                  _selectedGoals.remove(goal);
                }
              });
            },
          );
        }),
        const SizedBox(height: 16),

        Text('Occasions you dress for most frequently:', style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: ['Work / Corporate', 'Dates & Fine Dining', 'College / Campus', 'Parties & Lounges', 'Travel', 'Casual Weekend'].map((occ) {
            final isSelected = _selectedOccasions.contains(occ);
            return FilterChip(
              label: Text(occ),
              selected: isSelected,
              selectedColor: AppTheme.gold,
              backgroundColor: elevatedColor,
              labelStyle: GoogleFonts.outfit(fontSize: 11, fontWeight: isSelected ? FontWeight.bold : FontWeight.w500, color: isSelected ? AppTheme.noir : textColor),
              onSelected: (val) {
                setState(() {
                  if (val) {
                    _selectedOccasions.add(occ);
                  } else {
                    _selectedOccasions.remove(occ);
                  }
                });
              },
            );
          }).toList(),
        ),
      ],
    );
  }
}
