import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/theme_provider.dart';
import '../outfits_repository.dart';
import '../../auth/screens/profile_dna_sheet.dart';
import '../../wardrobe/screens/add_piece_sheet.dart';
import 'plan_your_look_sheet.dart';

class DailyOtdScreen extends ConsumerStatefulWidget {
  const DailyOtdScreen({super.key});

  @override
  ConsumerState<DailyOtdScreen> createState() => _DailyOtdScreenState();
}

class _DailyOtdScreenState extends ConsumerState<DailyOtdScreen> {
  final TextEditingController _promptController =
      TextEditingController(text: 'Rooftop restaurant tonight for a date');
  final TextEditingController _chatController = TextEditingController();

  String _selectedVenue = 'Rooftop Lounge';
  String _selectedOccasion = 'Date Night';
  String _selectedVibe = 'Romantic & Alluring';
  String _selectedWeather = 'Tonight · 22°C Breezy';

  final List<String> _venues = [
    'Rooftop Lounge',
    'Fine Dining Bistro',
    'Executive Boardroom',
    'Casual Cafe',
    'Art Gallery Vernissage',
    'Cocktails & Social',
  ];

  final List<String> _occasions = [
    'Date Night',
    'High-Stakes Business',
    'Casual Social',
    'Cocktail Celebration',
    'Off-Duty Weekend',
  ];

  final List<String> _vibes = [
    'Romantic & Alluring',
    'Effortless Minimalist',
    'Sharp & Commanding',
    'Relaxed & Approachable',
  ];

  final List<String> _weathers = [
    'Tonight · 22°C Breezy',
    'Evening · 16°C Cool',
    'Afternoon · 28°C Sunny',
    'Morning · 19°C Overcast',
  ];

  @override
  void dispose() {
    _promptController.dispose();
    _chatController.dispose();
    super.dispose();
  }

  void _handleCurate() {
    ref.read(curatedOutfitProvider.notifier).curateOutfit(
          venue: _selectedVenue,
          occasion: _selectedOccasion,
          vibe: _selectedVibe,
          weather: _selectedWeather,
        );
  }

  void _handleSendTweak(String instruction) {
    if (instruction.trim().isEmpty) return;
    ref.read(curatedOutfitProvider.notifier).modifyCuratedOutfit(instruction.trim());
    _chatController.clear();
  }

  @override
  Widget build(BuildContext context) {
    final curatedAsync = ref.watch(curatedOutfitProvider);
    final userProfile = ref.watch(userProfileProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final bgColor = isDark ? AppTheme.noir : AppTheme.ivorySilk;
    final surfaceColor = isDark ? AppTheme.surfaceNoir : AppTheme.surfaceIvory;
    final elevatedColor = isDark ? AppTheme.elevatedNoir : AppTheme.elevatedIvory;
    final borderColor = isDark ? AppTheme.borderNoir : AppTheme.borderIvory;
    final textColor = isDark ? AppTheme.silkWhite : AppTheme.textIvoryDark;
    final mutedColor = isDark ? AppTheme.mutedSilver : AppTheme.textIvoryMuted;

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // Top App Bar with Logo, Theme Switcher & Profile Button
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Official OTD Brand Monogram
                    Row(
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: const Color(0xFFF7EFE0),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: AppTheme.gold),
                            boxShadow: [
                              BoxShadow(
                                color: AppTheme.gold.withValues(alpha: 0.2),
                                blurRadius: 8,
                              ),
                            ],
                          ),
                          padding: const EdgeInsets.all(2),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.asset(
                              'assets/images/otd_logo.png',
                              fit: BoxFit.contain,
                              errorBuilder: (_, __, ___) => const Center(
                                child: Text('OTD', style: TextStyle(color: Color(0xFF1C1612), fontSize: 10, fontWeight: FontWeight.w900)),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  'OTD',
                                  style: GoogleFonts.cinzel(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: 2.0,
                                    color: textColor,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                const Text('✦', style: TextStyle(color: AppTheme.gold, fontSize: 11)),
                              ],
                            ),
                            Text(
                              'OUTFIT OF THE DAY',
                              style: GoogleFonts.outfit(
                                fontSize: 9,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 1.5,
                                color: AppTheme.gold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),

                    // Actions: Theme Toggle + Profile Button
                    Row(
                      children: [
                        IconButton(
                          icon: Icon(
                            isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
                            size: 20,
                            color: AppTheme.gold,
                          ),
                          onPressed: () {
                            ref.read(themeModeProvider.notifier).toggleTheme();
                          },
                        ),
                        const SizedBox(width: 4),
                        GestureDetector(
                          onTap: () => ProfileDnaSheet.show(context),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: elevatedColor,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppTheme.gold.withValues(alpha: 0.5)),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.person_outline, size: 14, color: AppTheme.gold),
                                const SizedBox(width: 6),
                                Text(
                                  userProfile.name,
                                  style: GoogleFonts.outfit(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: textColor,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Hero Header: "Where are you going?"
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Greeting matching Screenshot 1 & 2
                    Text(
                      'Hi Mustafa,',
                      style: GoogleFonts.cormorantGaramond(
                        fontSize: 32,
                        fontWeight: FontWeight.w700,
                        color: textColor,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "What's your vibe today?",
                      style: GoogleFonts.outfit(
                        fontSize: 13,
                        color: mutedColor,
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Vibe Horizontal Selector
                    SizedBox(
                      height: 40,
                      child: ListView(
                        scrollDirection: Axis.horizontal,
                        physics: const BouncingScrollPhysics(),
                        children: [
                          'Daily Wear',
                          'Office',
                          'Date Night',
                          'Travel',
                          'Party',
                          'Custom',
                        ].map((vibe) {
                          final isSelected = _selectedVibe.toLowerCase().contains(vibe.toLowerCase()) ||
                              (vibe == 'Date Night' && _selectedOccasion == 'Date Night');
                          return GestureDetector(
                            onTap: () {
                              if (vibe == 'Date Night') {
                                PlanYourLookSheet.show(context);
                              } else {
                                setState(() {
                                  _selectedVibe = vibe;
                                  _selectedOccasion = vibe;
                                });
                              }
                            },
                            child: Container(
                              margin: const EdgeInsets.only(right: 8),
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                              decoration: BoxDecoration(
                                color: isSelected ? AppTheme.gold : elevatedColor,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: isSelected ? AppTheme.gold : borderColor,
                                ),
                              ),
                              child: Row(
                                children: [
                                  if (vibe == 'Custom')
                                    Icon(
                                      Icons.tune,
                                      size: 13,
                                      color: isSelected ? AppTheme.noir : AppTheme.gold,
                                    )
                                  else
                                    Icon(
                                      Icons.auto_awesome,
                                      size: 13,
                                      color: isSelected ? AppTheme.noir : AppTheme.gold,
                                    ),
                                  const SizedBox(width: 6),
                                  Text(
                                    vibe,
                                    style: GoogleFonts.outfit(
                                      fontSize: 11,
                                      fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                                      color: isSelected ? AppTheme.noir : textColor,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Editorial Banner matching Screenshot 1
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [
                            Color(0xFF1A1A1E),
                            Color(0xFF2C2523),
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppTheme.gold.withValues(alpha: 0.3)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.3),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'YOUR WARDROBE. YOUR WORLD.',
                                style: GoogleFonts.outfit(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 1.5,
                                  color: AppTheme.gold,
                                ),
                              ),
                              const Text('✦', style: TextStyle(color: AppTheme.gold, fontSize: 12)),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'Your style. Every place.',
                            style: GoogleFonts.cormorantGaramond(
                              fontSize: 22,
                              fontWeight: FontWeight.w700,
                              fontStyle: FontStyle.italic,
                              color: const Color(0xFFF7EFE0),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'AI styling powered by the clothes you already own.',
                            style: GoogleFonts.outfit(
                              fontSize: 11,
                              color: const Color(0xFFD5C29D),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Your Next Plan Card matching Screenshot 1
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: surfaceColor,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: borderColor),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'YOUR NEXT PLAN',
                                style: GoogleFonts.outfit(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 1.2,
                                  color: AppTheme.gold,
                                ),
                              ),
                              Row(
                                children: [
                                  const Icon(Icons.wb_cloudy_outlined, size: 14, color: AppTheme.gold),
                                  const SizedBox(width: 4),
                                  Text(
                                    'Hyderabad · 28°C',
                                    style: GoogleFonts.outfit(fontSize: 10, color: mutedColor),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Row(
                            children: [
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  color: elevatedColor,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: AppTheme.gold.withValues(alpha: 0.3)),
                                ),
                                child: const Center(
                                  child: Icon(Icons.restaurant, color: AppTheme.gold, size: 22),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Dinner at L\'amore',
                                      style: GoogleFonts.outfit(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w700,
                                        color: textColor,
                                      ),
                                    ),
                                    Text(
                                      '8:00 PM · Today · Date Night (Banjara Hills)',
                                      style: GoogleFonts.outfit(fontSize: 11, color: mutedColor),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              icon: const Icon(Icons.auto_awesome, size: 15),
                              label: Text(
                                'PLAN YOUR PERFECT LOOK (3-STEP AI WIZARD)',
                                style: GoogleFonts.outfit(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.gold,
                                foregroundColor: AppTheme.noir,
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                              ),
                              onPressed: () => PlanYourLookSheet.show(context),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Quick Actions (Screenshot 2)
                    Text(
                      'QUICK ACTIONS',
                      style: GoogleFonts.outfit(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.2,
                        color: AppTheme.gold,
                      ),
                    ),
                    const SizedBox(height: 10),

                    SizedBox(
                      height: 105,
                      child: ListView(
                        scrollDirection: Axis.horizontal,
                        physics: const BouncingScrollPhysics(),
                        children: [
                          _QuickActionCard(
                            title: 'Upload New Item',
                            subtitle: 'Add to your closet',
                            icon: Icons.add_photo_alternate_outlined,
                            isDark: isDark,
                            surfaceColor: surfaceColor,
                            borderColor: borderColor,
                            textColor: textColor,
                            mutedColor: mutedColor,
                            onTap: () => AddPieceSheet.show(context),
                          ),
                          _QuickActionCard(
                            title: 'Get Outfit Ideas',
                            subtitle: 'AI powered styling',
                            icon: Icons.auto_awesome_outlined,
                            isDark: isDark,
                            surfaceColor: surfaceColor,
                            borderColor: borderColor,
                            textColor: textColor,
                            mutedColor: mutedColor,
                            onTap: () => PlanYourLookSheet.show(context),
                          ),
                          _QuickActionCard(
                            title: 'Outfit for a Place',
                            subtitle: 'Destination mode',
                            icon: Icons.location_on_outlined,
                            isDark: isDark,
                            surfaceColor: surfaceColor,
                            borderColor: borderColor,
                            textColor: textColor,
                            mutedColor: mutedColor,
                            onTap: () => PlanYourLookSheet.show(context),
                          ),
                          _QuickActionCard(
                            title: 'Virtual Try-On',
                            subtitle: 'See on your avatar',
                            icon: Icons.camera_alt_outlined,
                            isDark: isDark,
                            surfaceColor: surfaceColor,
                            borderColor: borderColor,
                            textColor: textColor,
                            mutedColor: mutedColor,
                            onTap: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Switched to Try-On Studio tab.')),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 22),

                    // Outfit Suggestions For You (Screenshot 1 & 2)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Outfit Suggestions For You',
                              style: GoogleFonts.cormorantGaramond(
                                fontSize: 20,
                                fontWeight: FontWeight.w700,
                                color: textColor,
                              ),
                            ),
                            Text(
                              'Curated for your style and today\'s Hyderabad weather',
                              style: GoogleFonts.outfit(fontSize: 11, color: mutedColor),
                            ),
                          ],
                        ),
                        TextButton(
                          onPressed: () => PlanYourLookSheet.show(context),
                          child: Text(
                            'See All →',
                            style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.gold),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),

                    SizedBox(
                      height: 230,
                      child: ListView(
                        scrollDirection: Axis.horizontal,
                        physics: const BouncingScrollPhysics(),
                        children: [
                          _OutfitSuggestionCard(
                            title: 'Smart Casual',
                            subtitle: 'For Today\'s Weather (28°C)',
                            matchPercent: 98,
                            imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80',
                            isDark: isDark,
                            surfaceColor: surfaceColor,
                            borderColor: borderColor,
                            textColor: textColor,
                            mutedColor: mutedColor,
                            onTry: () {
                              ref.read(curatedOutfitProvider.notifier).curateOutfit(
                                    venue: 'Relaxed Dinner',
                                    occasion: 'Casual Evening',
                                    vibe: 'Smart Casual',
                                    weather: 'Tonight · 28°C Partly Cloudy',
                                  );
                            },
                          ),
                          _OutfitSuggestionCard(
                            title: 'Date Night',
                            subtitle: 'Classy & Effortless for L\'amore',
                            matchPercent: 95,
                            imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&q=80',
                            isDark: isDark,
                            surfaceColor: surfaceColor,
                            borderColor: borderColor,
                            textColor: textColor,
                            mutedColor: mutedColor,
                            onTry: () {
                              ref.read(curatedOutfitProvider.notifier).curateOutfit(
                                    venue: 'L\'amore Bistro',
                                    occasion: 'Date Night',
                                    vibe: 'Romantic & Classy',
                                    weather: 'Tonight · 28°C Breezy',
                                  );
                            },
                          ),
                          _OutfitSuggestionCard(
                            title: 'Office Ready',
                            subtitle: 'Clean & Polished Tailoring',
                            matchPercent: 92,
                            imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
                            isDark: isDark,
                            surfaceColor: surfaceColor,
                            borderColor: borderColor,
                            textColor: textColor,
                            mutedColor: mutedColor,
                            onTry: () {
                              ref.read(curatedOutfitProvider.notifier).curateOutfit(
                                    venue: 'Executive Office',
                                    occasion: 'Workplace',
                                    vibe: 'Sharp & Minimal',
                                    weather: 'Daytime · 28°C',
                                  );
                            },
                          ),
                          _OutfitSuggestionCard(
                            title: 'Travel Look',
                            subtitle: 'Comfort Meets Modern Style',
                            matchPercent: 90,
                            imageUrl: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=400&q=80',
                            isDark: isDark,
                            surfaceColor: surfaceColor,
                            borderColor: borderColor,
                            textColor: textColor,
                            mutedColor: mutedColor,
                            onTry: () {
                              ref.read(curatedOutfitProvider.notifier).curateOutfit(
                                    venue: 'Airport Transit',
                                    occasion: 'Travel',
                                    vibe: 'Relaxed & Breathable',
                                    weather: 'Transit · 24°C',
                                  );
                            },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 22),

                    // Your Closet Quick Stats (Screenshot 2: "Your Closet")
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: surfaceColor,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: borderColor),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'YOUR CLOSET OVERVIEW',
                                style: GoogleFonts.outfit(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 1.2,
                                  color: AppTheme.gold,
                                ),
                              ),
                              Text(
                                'See All →',
                                style: GoogleFonts.outfit(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.gold,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              _ClosetCategoryPill(icon: '👕', name: 'Tops', count: '12 items', textColor: textColor, mutedColor: mutedColor),
                              _ClosetCategoryPill(icon: '👖', name: 'Bottoms', count: '8 items', textColor: textColor, mutedColor: mutedColor),
                              _ClosetCategoryPill(icon: '🧥', name: 'Outerwear', count: '5 items', textColor: textColor, mutedColor: mutedColor),
                              _ClosetCategoryPill(icon: '👞', name: 'Shoes', count: '6 items', textColor: textColor, mutedColor: mutedColor),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 22),

                    // Subtitle for Custom Prompt
                    Text(
                      'AI Stylist Prompt & Destination:',
                      style: GoogleFonts.outfit(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: mutedColor,
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Context Omnibar Card
                    Container(
                      decoration: BoxDecoration(
                        color: surfaceColor,
                        borderRadius: BorderRadius.circular(22),
                        border: Border.all(color: borderColor),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      padding: const EdgeInsets.all(18),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'DESCRIBE YOUR DESTINATION & EVENT',
                            style: GoogleFonts.outfit(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 1.2,
                              color: AppTheme.gold,
                            ),
                          ),
                          const SizedBox(height: 8),

                          TextField(
                            controller: _promptController,
                            style: TextStyle(color: textColor, fontSize: 13),
                            decoration: InputDecoration(
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                              hintText: 'e.g. Dinner date tonight at a rooftop restaurant...',
                              fillColor: elevatedColor,
                            ),
                          ),
                          const SizedBox(height: 14),

                          // Guided Selectors
                          Row(
                            children: [
                              Expanded(
                                child: _SelectorField(
                                  label: 'VENUE',
                                  value: _selectedVenue,
                                  items: _venues,
                                  isDark: isDark,
                                  onChanged: (v) => setState(() => _selectedVenue = v),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: _SelectorField(
                                  label: 'OCCASION',
                                  value: _selectedOccasion,
                                  items: _occasions,
                                  isDark: isDark,
                                  onChanged: (v) => setState(() => _selectedOccasion = v),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),

                          Row(
                            children: [
                              Expanded(
                                child: _SelectorField(
                                  label: 'DESIRED VIBE',
                                  value: _selectedVibe,
                                  items: _vibes,
                                  isDark: isDark,
                                  onChanged: (v) => setState(() => _selectedVibe = v),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: _SelectorField(
                                  label: 'WEATHER & TIME',
                                  value: _selectedWeather,
                                  items: _weathers,
                                  isDark: isDark,
                                  onChanged: (v) => setState(() => _selectedWeather = v),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 18),

                          // Curate CTA Button
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              icon: const Icon(Icons.auto_awesome, size: 18),
                              label: Text(
                                'CURATE MY OUTFIT OF THE DAY',
                                style: GoogleFonts.outfit(
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 1.0,
                                ),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.gold,
                                foregroundColor: AppTheme.noir,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                              ),
                              onPressed: _handleCurate,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Result Screen: Curated Outfit Recommendation
            curatedAsync.when(
              loading: () => const SliverToBoxAdapter(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 40),
                  child: Center(
                    child: Column(
                      children: [
                        CircularProgressIndicator(color: AppTheme.gold),
                        SizedBox(height: 16),
                        Text('Styling from your verified Digital Closet...', style: TextStyle(color: AppTheme.gold, fontSize: 12)),
                      ],
                    ),
                  ),
                ),
              ),
              error: (err, _) => SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Text('Error curating outfit: $err', style: const TextStyle(color: Colors.red)),
                ),
              ),
              data: (outfit) {
                if (outfit == null) {
                  return const SliverToBoxAdapter(child: SizedBox(height: 40));
                }

                return SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  sliver: SliverList(
                    delegate: SliverChildListDelegate([
                      // Result Title & Match Score Header
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: surfaceColor,
                          borderRadius: BorderRadius.circular(22),
                          border: Border.all(color: AppTheme.gold, width: 1.5),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      width: 8,
                                      height: 8,
                                      decoration: const BoxDecoration(
                                        color: AppTheme.emerald,
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      'CURATED OUTFIT OF THE DAY',
                                      style: GoogleFonts.outfit(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w700,
                                        letterSpacing: 1.5,
                                        color: AppTheme.gold,
                                      ),
                                    ),
                                  ],
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: AppTheme.gold.withValues(alpha: 0.15),
                                    borderRadius: BorderRadius.circular(14),
                                  ),
                                  child: Text(
                                    '${(outfit.aiMatchScore * 100).toInt()}% CLOSET MATCH',
                                    style: GoogleFonts.outfit(
                                      fontSize: 10,
                                      fontWeight: FontWeight.w700,
                                      color: AppTheme.gold,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),

                            Text(
                              outfit.title,
                              style: GoogleFonts.cormorantGaramond(
                                fontSize: 24,
                                fontWeight: FontWeight.w700,
                                color: textColor,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              outfit.description,
                              style: GoogleFonts.outfit(fontSize: 12, color: mutedColor),
                            ),
                            const SizedBox(height: 16),

                            // Garments Composition
                            Text(
                              'VERIFIED CLOSET PIECES IN THIS LOOK',
                              style: GoogleFonts.outfit(
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 1.2,
                                color: mutedColor,
                              ),
                            ),
                            const SizedBox(height: 10),

                            SizedBox(
                              height: 140,
                              child: ListView.builder(
                                scrollDirection: Axis.horizontal,
                                itemCount: outfit.items.length,
                                itemBuilder: (context, i) {
                                  final item = outfit.items[i];
                                  return Container(
                                    width: 125,
                                    margin: const EdgeInsets.only(right: 10),
                                    decoration: BoxDecoration(
                                      color: elevatedColor,
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(color: borderColor),
                                    ),
                                    padding: const EdgeInsets.all(10),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(
                                              'Layer 0${i + 1}',
                                              style: GoogleFonts.outfit(
                                                fontSize: 9,
                                                fontWeight: FontWeight.w600,
                                                color: AppTheme.gold,
                                              ),
                                            ),
                                            Text(item.icon, style: const TextStyle(fontSize: 16)),
                                          ],
                                        ),
                                        const Spacer(),
                                        Text(
                                          item.name,
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                          style: GoogleFonts.outfit(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w700,
                                            color: textColor,
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          '${item.color} · ${item.brand}',
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: GoogleFonts.outfit(
                                            fontSize: 9,
                                            color: mutedColor,
                                          ),
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              ),
                            ),
                            const SizedBox(height: 16),

                            // "Why This Outfit?" Editorial Card
                            Container(
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: elevatedColor,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: borderColor),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(Icons.psychology_outlined, size: 16, color: AppTheme.gold),
                                      const SizedBox(width: 6),
                                      Text(
                                        'WHY OTD CHOSE THIS LOOK',
                                        style: GoogleFonts.outfit(
                                          fontSize: 10,
                                          fontWeight: FontWeight.w700,
                                          letterSpacing: 1.2,
                                          color: AppTheme.gold,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  _RationaleRow(title: 'Venue Ambience', text: outfit.venueRationale, textColor: textColor, mutedColor: mutedColor),
                                  const SizedBox(height: 6),
                                  _RationaleRow(title: 'Weather Fit', text: outfit.weatherRationale, textColor: textColor, mutedColor: mutedColor),
                                  const SizedBox(height: 6),
                                  _RationaleRow(title: 'Color Proportions', text: outfit.paletteRationale, textColor: textColor, mutedColor: mutedColor),
                                ],
                              ),
                            ),
                            const SizedBox(height: 16),

                            // Conversational Modifier Engine
                            Container(
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: isDark ? AppTheme.noir : AppTheme.ivorySilk,
                                borderRadius: BorderRadius.circular(18),
                                border: Border.all(color: AppTheme.gold.withValues(alpha: 0.5)),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'CHAT & MODIFY THIS LOOK',
                                    style: GoogleFonts.outfit(
                                      fontSize: 10,
                                      fontWeight: FontWeight.w700,
                                      letterSpacing: 1.2,
                                      color: AppTheme.gold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),

                                  // Quick Tweak Chips
                                  SingleChildScrollView(
                                    scrollDirection: Axis.horizontal,
                                    child: Row(
                                      children: [
                                        _TweakChip(label: 'Make it more casual', onTap: () => _handleSendTweak('Make it more casual'), isDark: isDark),
                                        _TweakChip(label: 'Change the shoes', onTap: () => _handleSendTweak('Change the shoes'), isDark: isDark),
                                        _TweakChip(label: "Don't use jeans", onTap: () => _handleSendTweak("Don't use jeans"), isDark: isDark),
                                        _TweakChip(label: 'Make it more attractive', onTap: () => _handleSendTweak('Make it more attractive'), isDark: isDark),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(height: 10),

                                  // Freeform Chat Input
                                  Row(
                                    children: [
                                      Expanded(
                                        child: TextField(
                                          controller: _chatController,
                                          style: TextStyle(color: textColor, fontSize: 12),
                                          decoration: InputDecoration(
                                            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                            hintText: "e.g. 'Swap loafers for white sneakers'...",
                                            fillColor: surfaceColor,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      IconButton(
                                        style: IconButton.styleFrom(
                                          backgroundColor: AppTheme.gold,
                                          foregroundColor: AppTheme.noir,
                                        ),
                                        icon: const Icon(Icons.send_rounded, size: 18),
                                        onPressed: () => _handleSendTweak(_chatController.text),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 16),

                            // Action: Save / Wear Look
                            SizedBox(
                              width: double.infinity,
                              child: OutlinedButton.icon(
                                icon: Icon(
                                  outfit.isWornToday ? Icons.check_circle : Icons.bookmark_border,
                                  color: AppTheme.gold,
                                  size: 18,
                                ),
                                label: Text(
                                  outfit.isWornToday ? 'LOGGED AS WORN TODAY' : 'SAVE THIS LOOK FOR TODAY',
                                  style: GoogleFonts.outfit(fontWeight: FontWeight.w700),
                                ),
                                style: OutlinedButton.styleFrom(
                                  side: const BorderSide(color: AppTheme.gold),
                                  padding: const EdgeInsets.symmetric(vertical: 14),
                                ),
                                onPressed: () {
                                  ref.read(curatedOutfitProvider.notifier).toggleWornToday();
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text('Outfit saved to your worn history!'),
                                      backgroundColor: AppTheme.surfaceNoir,
                                    ),
                                  );
                                },
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 30),
                    ]),
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

class _SelectorField extends StatelessWidget {
  final String label;
  final String value;
  final List<String> items;
  final bool isDark;
  final ValueChanged<String> onChanged;

  const _SelectorField({
    required this.label,
    required this.value,
    required this.items,
    required this.isDark,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final textColor = isDark ? AppTheme.silkWhite : AppTheme.textIvoryDark;
    final mutedColor = isDark ? AppTheme.mutedSilver : AppTheme.textIvoryMuted;
    final elevatedColor = isDark ? AppTheme.elevatedNoir : AppTheme.elevatedIvory;
    final borderColor = isDark ? AppTheme.borderNoir : AppTheme.borderIvory;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w700, color: mutedColor),
        ),
        const SizedBox(height: 4),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          decoration: BoxDecoration(
            color: elevatedColor,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: borderColor),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: items.contains(value) ? value : items.first,
              isExpanded: true,
              dropdownColor: isDark ? AppTheme.surfaceNoir : AppTheme.surfaceIvory,
              items: items
                  .map((e) => DropdownMenuItem(
                        value: e,
                        child: Text(
                          e,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(color: textColor, fontSize: 11, fontWeight: FontWeight.w500),
                        ),
                      ))
                  .toList(),
              onChanged: (v) {
                if (v != null) onChanged(v);
              },
            ),
          ),
        ),
      ],
    );
  }
}

class _RationaleRow extends StatelessWidget {
  final String title;
  final String text;
  final Color textColor;
  final Color mutedColor;

  const _RationaleRow({
    required this.title,
    required this.text,
    required this.textColor,
    required this.mutedColor,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w700, color: textColor),
        ),
        Text(
          text,
          style: GoogleFonts.outfit(fontSize: 11, color: mutedColor, height: 1.3),
        ),
      ],
    );
  }
}

class _TweakChip extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  final bool isDark;

  const _TweakChip({
    required this.label,
    required this.onTap,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isDark ? AppTheme.surfaceNoir : AppTheme.surfaceIvory,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppTheme.gold.withValues(alpha: 0.4)),
        ),
        child: Text(
          '"$label"',
          style: GoogleFonts.outfit(
            fontSize: 10,
            fontWeight: FontWeight.w600,
            color: isDark ? AppTheme.silkWhite : AppTheme.textIvoryDark,
          ),
        ),
      ),
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final bool isDark;
  final Color surfaceColor;
  final Color borderColor;
  final Color textColor;
  final Color mutedColor;
  final VoidCallback onTap;

  const _QuickActionCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.isDark,
    required this.surfaceColor,
    required this.borderColor,
    required this.textColor,
    required this.mutedColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 140,
        margin: const EdgeInsets.only(right: 10),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: surfaceColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: borderColor),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppTheme.gold.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, size: 18, color: AppTheme.gold),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.outfit(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: textColor,
                  ),
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.outfit(
                    fontSize: 10,
                    color: mutedColor,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _OutfitSuggestionCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final int matchPercent;
  final String imageUrl;
  final bool isDark;
  final Color surfaceColor;
  final Color borderColor;
  final Color textColor;
  final Color mutedColor;
  final VoidCallback onTry;

  const _OutfitSuggestionCard({
    required this.title,
    required this.subtitle,
    required this.matchPercent,
    required this.imageUrl,
    required this.isDark,
    required this.surfaceColor,
    required this.borderColor,
    required this.textColor,
    required this.mutedColor,
    required this.onTry,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 175,
      margin: const EdgeInsets.only(right: 12),
      decoration: BoxDecoration(
        color: surfaceColor,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Flat lay preview image
          SizedBox(
            height: 120,
            child: Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(17)),
                  child: Image.network(
                    imageUrl,
                    width: double.infinity,
                    height: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.7),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '$matchPercent% MATCH',
                      style: GoogleFonts.outfit(
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.cormorantGaramond(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: textColor,
                  ),
                ),
                Text(
                  subtitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.outfit(fontSize: 10, color: mutedColor),
                ),
                const SizedBox(height: 8),

                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: onTry,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isDark ? Colors.white : Colors.black,
                      foregroundColor: isDark ? Colors.black : Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 6),
                      minimumSize: const Size(0, 28),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    child: Text(
                      'Try Look →',
                      style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ClosetCategoryPill extends StatelessWidget {
  final String icon;
  final String name;
  final String count;
  final Color textColor;
  final Color mutedColor;

  const _ClosetCategoryPill({
    required this.icon,
    required this.name,
    required this.count,
    required this.textColor,
    required this.mutedColor,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(icon, style: const TextStyle(fontSize: 22)),
        const SizedBox(height: 4),
        Text(
          name,
          style: GoogleFonts.outfit(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: textColor,
          ),
        ),
        Text(
          count,
          style: GoogleFonts.outfit(
            fontSize: 9,
            color: mutedColor,
          ),
        ),
      ],
    );
  }
}
