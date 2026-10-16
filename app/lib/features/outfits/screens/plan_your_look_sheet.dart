import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../outfits_repository.dart';

class PlanYourLookSheet extends ConsumerStatefulWidget {
  const PlanYourLookSheet({super.key});

  static Future<void> show(BuildContext context) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const PlanYourLookSheet(),
    );
  }

  @override
  ConsumerState<PlanYourLookSheet> createState() => _PlanYourLookSheetState();
}

class _PlanYourLookSheetState extends ConsumerState<PlanYourLookSheet> {
  int _currentStep = 1;

  // Step 1 State
  String _selectedOccasion = 'Date';
  final TextEditingController _destinationController =
      TextEditingController(text: "L'amore, Banjara Hills, Hyderabad");
  String _selectedVenueCategory = 'Restaurant';
  final String _selectedDate = 'Mon, 14 Oct 2024';
  final String _selectedTime = '8:00 PM';

  // Step 2 State
  String _selectedMood = 'Confident';
  String _selectedWeather = 'Partly Cloudy';
  final Set<String> _selectedPreferences = {'Light & Breezy'};

  // Step 3 State
  final TextEditingController _chatController = TextEditingController();
  final List<Map<String, String>> _messages = [
    {
      'sender': 'user',
      'text': "I'm going to L'amore tonight for a date. Suggest an outfit from my wardrobe.",
    },
    {
      'sender': 'ai',
      'text':
          "Here are some outfit options for L'amore based on the ambience, weather (28°C Partly Cloudy) and your style. Would you like to see more options or try a different vibe?",
    },
  ];

  @override
  void dispose() {
    _destinationController.dispose();
    _chatController.dispose();
    super.dispose();
  }

  void _sendMessage(String text) {
    if (text.trim().isEmpty) return;
    setState(() {
      _messages.add({'sender': 'user', 'text': text.trim()});
    });
    ref.read(curatedOutfitProvider.notifier).modifyCuratedOutfit(text.trim());
    _chatController.clear();

    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      setState(() {
        _messages.add({
          'sender': 'ai',
          'text': "Refined your look with those adjustments! Swapped pieces from your verified wardrobe.",
        });
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? AppTheme.noir : AppTheme.ivorySilk;
    final surfaceColor = isDark ? AppTheme.surfaceNoir : AppTheme.surfaceIvory;
    final elevatedColor = isDark ? AppTheme.elevatedNoir : AppTheme.elevatedIvory;
    final borderColor = isDark ? AppTheme.borderNoir : AppTheme.borderIvory;
    final textColor = isDark ? AppTheme.silkWhite : AppTheme.textIvoryDark;
    final mutedColor = isDark ? AppTheme.mutedSilver : AppTheme.textIvoryMuted;

    return Container(
      height: MediaQuery.of(context).size.height * 0.92,
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(top: 12, bottom: 8),
              decoration: BoxDecoration(
                color: mutedColor.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          // Stepper Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _currentStep == 1
                          ? 'Plan Your Perfect Look'
                          : _currentStep == 2
                              ? 'Set Your Mood & Weather'
                              : 'Curated Outfit of the Day',
                      style: GoogleFonts.cormorantGaramond(
                        fontSize: 22,
                        fontWeight: FontWeight.w700,
                        color: textColor,
                      ),
                    ),
                    Text(
                      'Step $_currentStep of 3',
                      style: GoogleFonts.outfit(
                        fontSize: 11,
                        color: AppTheme.gold,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                IconButton(
                  icon: Icon(Icons.close, color: mutedColor),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
          ),

          const Divider(height: 1),

          // Step Body
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              physics: const BouncingScrollPhysics(),
              child: _buildCurrentStep(
                isDark: isDark,
                surfaceColor: surfaceColor,
                elevatedColor: elevatedColor,
                borderColor: borderColor,
                textColor: textColor,
                mutedColor: mutedColor,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCurrentStep({
    required bool isDark,
    required Color surfaceColor,
    required Color elevatedColor,
    required Color borderColor,
    required Color textColor,
    required Color mutedColor,
  }) {
    if (_currentStep == 1) {
      return _buildStep1OccasionDestination(
        surfaceColor: surfaceColor,
        elevatedColor: elevatedColor,
        borderColor: borderColor,
        textColor: textColor,
        mutedColor: mutedColor,
      );
    } else if (_currentStep == 2) {
      return _buildStep2MoodWeather(
        surfaceColor: surfaceColor,
        elevatedColor: elevatedColor,
        borderColor: borderColor,
        textColor: textColor,
        mutedColor: mutedColor,
      );
    } else {
      return _buildStep3Recommendation(
        surfaceColor: surfaceColor,
        elevatedColor: elevatedColor,
        borderColor: borderColor,
        textColor: textColor,
        mutedColor: mutedColor,
      );
    }
  }

  // =========================================================================
  // STEP 1: OCCASION & DESTINATION (Screenshot 3)
  // =========================================================================
  Widget _buildStep1OccasionDestination({
    required Color surfaceColor,
    required Color elevatedColor,
    required Color borderColor,
    required Color textColor,
    required Color mutedColor,
  }) {
    final occasions = ['Date', 'Casual Outing', 'Party', 'Wedding', 'Office', 'Travel'];
    final categories = ['Restaurant', 'Café', 'Bar / Club', 'Mall', 'Resort', 'Outdoor'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "1. What's the occasion?",
          style: GoogleFonts.cormorantGaramond(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: textColor,
          ),
        ),
        const SizedBox(height: 10),

        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: occasions.map((occ) {
            final isSelected = _selectedOccasion == occ;
            return ChoiceChip(
              label: Text(occ),
              selected: isSelected,
              onSelected: (_) => setState(() => _selectedOccasion = occ),
              selectedColor: AppTheme.gold,
              backgroundColor: elevatedColor,
              labelStyle: GoogleFonts.outfit(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected ? AppTheme.noir : textColor,
              ),
            );
          }).toList(),
        ),

        const SizedBox(height: 20),

        Text(
          "2. Where are you going?",
          style: GoogleFonts.cormorantGaramond(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: textColor,
          ),
        ),
        const SizedBox(height: 8),

        TextField(
          controller: _destinationController,
          style: TextStyle(color: textColor, fontSize: 13),
          decoration: InputDecoration(
            prefixIcon: const Icon(Icons.location_on_outlined, color: AppTheme.gold, size: 18),
            hintText: "Search for a specific place...",
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            fillColor: elevatedColor,
          ),
        ),
        const SizedBox(height: 10),

        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: categories.map((cat) {
            final isSelected = _selectedVenueCategory == cat;
            return ChoiceChip(
              label: Text(cat),
              selected: isSelected,
              onSelected: (_) => setState(() => _selectedVenueCategory = cat),
              selectedColor: AppTheme.gold,
              backgroundColor: elevatedColor,
              labelStyle: GoogleFonts.outfit(
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected ? AppTheme.noir : textColor,
              ),
            );
          }).toList(),
        ),

        const SizedBox(height: 20),

        // Date and Time (Screenshot 3: Section 3)
        Text(
          "3. When are you going? (Optional)",
          style: GoogleFonts.cormorantGaramond(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: textColor,
          ),
        ),
        const SizedBox(height: 8),

        Row(
          children: [
            Expanded(
              flex: 3,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                decoration: BoxDecoration(
                  color: elevatedColor,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: borderColor),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.calendar_today_outlined, size: 14, color: AppTheme.gold),
                        const SizedBox(width: 8),
                        Text(_selectedDate, style: GoogleFonts.outfit(fontSize: 12, color: textColor)),
                      ],
                    ),
                    const Icon(Icons.arrow_drop_down, size: 18, color: AppTheme.gold),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              flex: 2,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                decoration: BoxDecoration(
                  color: elevatedColor,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: borderColor),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.access_time, size: 14, color: AppTheme.gold),
                        const SizedBox(width: 8),
                        Text(_selectedTime, style: GoogleFonts.outfit(fontSize: 12, color: textColor)),
                      ],
                    ),
                    const Icon(Icons.arrow_drop_down, size: 18, color: AppTheme.gold),
                  ],
                ),
              ),
            ),
          ],
        ),

        const SizedBox(height: 20),

        // Weather Auto-detected Card (Screenshot 3: Section 4)
        Text(
          "4. Weather (Auto-detected)",
          style: GoogleFonts.cormorantGaramond(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: textColor,
          ),
        ),
        const SizedBox(height: 8),

        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: surfaceColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: borderColor),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.wb_sunny_outlined, color: Colors.amber, size: 28),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '28°C · Partly Cloudy',
                        style: GoogleFonts.outfit(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: textColor,
                        ),
                      ),
                      Text(
                        'Hyderabad, India · Feels like 29°C',
                        style: GoogleFonts.outfit(fontSize: 11, color: mutedColor),
                      ),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.green.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'Auto-detected',
                  style: GoogleFonts.outfit(fontSize: 9, color: Colors.green, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 24),

        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            icon: const Icon(Icons.arrow_forward, size: 18),
            label: Text(
              'NEXT: SET MOOD & WEATHER',
              style: GoogleFonts.outfit(fontWeight: FontWeight.w800, letterSpacing: 1.0),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.gold,
              foregroundColor: AppTheme.noir,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
            ),
            onPressed: () => setState(() => _currentStep = 2),
          ),
        ),
      ],
    );
  }

  // =========================================================================
  // STEP 2: MOOD & WEATHER (Screenshot 4)
  // =========================================================================
  Widget _buildStep2MoodWeather({
    required Color surfaceColor,
    required Color elevatedColor,
    required Color borderColor,
    required Color textColor,
    required Color mutedColor,
  }) {
    final moods = ['Confident', 'Chill', 'Romantic', 'Energetic', 'Classy', 'Minimal', 'Trendy', 'Bold'];
    final weatherOptions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Windy', 'Cold', 'Hot'];
    final preferences = ['Light & Breezy', 'Layering', 'Warm & Cozy', 'Breathable', 'All Day Comfort'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "1. What's your mood today?",
          style: GoogleFonts.cormorantGaramond(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: textColor,
          ),
        ),
        const SizedBox(height: 10),

        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: moods.map((m) {
            final isSelected = _selectedMood == m;
            return ChoiceChip(
              label: Text(m),
              selected: isSelected,
              onSelected: (_) => setState(() => _selectedMood = m),
              selectedColor: AppTheme.gold,
              backgroundColor: elevatedColor,
              labelStyle: GoogleFonts.outfit(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected ? AppTheme.noir : textColor,
              ),
            );
          }).toList(),
        ),

        const SizedBox(height: 20),

        Text(
          "2. What's the weather like?",
          style: GoogleFonts.cormorantGaramond(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: textColor,
          ),
        ),
        const SizedBox(height: 10),

        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: weatherOptions.map((w) {
            final isSelected = _selectedWeather == w;
            return ChoiceChip(
              label: Text(w),
              selected: isSelected,
              onSelected: (_) => setState(() => _selectedWeather = w),
              selectedColor: AppTheme.gold,
              backgroundColor: elevatedColor,
              labelStyle: GoogleFonts.outfit(
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected ? AppTheme.noir : textColor,
              ),
            );
          }).toList(),
        ),

        const SizedBox(height: 20),

        Text(
          "3. Any additional preferences?",
          style: GoogleFonts.cormorantGaramond(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: textColor,
          ),
        ),
        const SizedBox(height: 10),

        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: preferences.map((p) {
            final isSelected = _selectedPreferences.contains(p);
            return FilterChip(
              label: Text(p),
              selected: isSelected,
              onSelected: (val) {
                setState(() {
                  if (val) {
                    _selectedPreferences.add(p);
                  } else {
                    _selectedPreferences.remove(p);
                  }
                });
              },
              selectedColor: AppTheme.gold,
              backgroundColor: elevatedColor,
              labelStyle: GoogleFonts.outfit(
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected ? AppTheme.noir : textColor,
              ),
            );
          }).toList(),
        ),

        const SizedBox(height: 24),

        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: () => setState(() => _currentStep = 1),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                ),
                child: const Text('BACK'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              flex: 2,
              child: ElevatedButton.icon(
                icon: const Icon(Icons.auto_awesome, size: 18),
                label: Text(
                  'GENERATE OUTFIT',
                  style: GoogleFonts.outfit(fontWeight: FontWeight.w800, letterSpacing: 1.0),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.gold,
                  foregroundColor: AppTheme.noir,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                ),
                onPressed: () {
                  ref.read(curatedOutfitProvider.notifier).curateOutfit(
                        venue: _destinationController.text,
                        occasion: _selectedOccasion,
                        vibe: _selectedMood,
                        weather: _selectedWeather,
                      );
                  setState(() => _currentStep = 3);
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  // =========================================================================
  // STEP 3: OUTFIT RECOMMENDATION & CHAT MODIFIER
  // =========================================================================
  Widget _buildStep3Recommendation({
    required Color surfaceColor,
    required Color elevatedColor,
    required Color borderColor,
    required Color textColor,
    required Color mutedColor,
  }) {
    final curatedAsync = ref.watch(curatedOutfitProvider);

    return curatedAsync.when(
      loading: () => const Padding(
        padding: EdgeInsets.symmetric(vertical: 60),
        child: Center(
          child: Column(
            children: [
              CircularProgressIndicator(color: AppTheme.gold),
              SizedBox(height: 16),
              Text('Styling from your verified Digital Closet...'),
            ],
          ),
        ),
      ),
      error: (err, _) => Text('Error: $err'),
      data: (outfit) {
        if (outfit == null) return const SizedBox();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Match Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.green.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Text(
                    '${(outfit.aiMatchScore * 100).toInt()}% CLOSET MATCH',
                    style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.green),
                  ),
                ),
                Text(
                  'Dinner at L\'amore',
                  style: GoogleFonts.outfit(fontSize: 12, color: mutedColor),
                ),
              ],
            ),
            const SizedBox(height: 8),

            Text(
              outfit.title,
              style: GoogleFonts.cormorantGaramond(
                fontSize: 24,
                fontWeight: FontWeight.w700,
                color: textColor,
              ),
            ),
            const SizedBox(height: 14),

            // Garment pieces list
            Text(
              'CLOTHES FROM YOUR WARDROBE',
              style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.gold),
            ),
            const SizedBox(height: 8),

            ...outfit.items.map((item) => Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: surfaceColor,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: borderColor),
                  ),
                  child: Row(
                    children: [
                      Text(item.icon, style: const TextStyle(fontSize: 22)),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(item.name, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
                            Text('${item.color} · ${item.brand}', style: GoogleFonts.outfit(fontSize: 10, color: mutedColor)),
                          ],
                        ),
                      ),
                      Text(item.category.name.toUpperCase(), style: GoogleFonts.outfit(fontSize: 9, color: AppTheme.gold, fontWeight: FontWeight.bold)),
                    ],
                  ),
                )),

            const SizedBox(height: 16),

            // AI Stylist Chat Stream
            Text(
              'CHAT & TWEAK WITH AI STYLIST',
              style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.gold),
            ),
            const SizedBox(height: 8),

            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: surfaceColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: borderColor),
              ),
              child: Column(
                children: [
                  ..._messages.map((msg) => Align(
                        alignment: msg['sender'] == 'user' ? Alignment.centerRight : Alignment.centerLeft,
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          decoration: BoxDecoration(
                            color: msg['sender'] == 'user'
                                ? AppTheme.gold.withValues(alpha: 0.2)
                                : elevatedColor,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            msg['text']!,
                            style: GoogleFonts.outfit(fontSize: 12, color: textColor),
                          ),
                        ),
                      )),

                  // Quick prompts
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: [
                      'Make it more casual.',
                      'Change the shoes.',
                      "Don't use jeans.",
                      'Make it more attractive.',
                    ].map((p) => ActionChip(
                          label: Text(p, style: const TextStyle(fontSize: 10)),
                          onPressed: () => _sendMessage(p),
                          backgroundColor: elevatedColor,
                        )).toList(),
                  ),
                  const SizedBox(height: 8),

                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _chatController,
                          style: TextStyle(color: textColor, fontSize: 12),
                          decoration: InputDecoration(
                            hintText: 'Ask OTD to change something...',
                            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            fillColor: elevatedColor,
                          ),
                          onSubmitted: _sendMessage,
                        ),
                      ),
                      const SizedBox(width: 8),
                      IconButton(
                        icon: const Icon(Icons.send, color: AppTheme.gold, size: 18),
                        onPressed: () => _sendMessage(_chatController.text),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Outfit saved to your curated looks!')),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.gold,
                  foregroundColor: AppTheme.noir,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                ),
                child: Text(
                  'CONFIRM & SAVE LOOK',
                  style: GoogleFonts.outfit(fontWeight: FontWeight.w800, letterSpacing: 1.0),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
