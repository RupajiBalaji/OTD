import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../wardrobe/wardrobe_repository.dart';

class VirtualTryOnScreen extends ConsumerStatefulWidget {
  const VirtualTryOnScreen({super.key});

  @override
  ConsumerState<VirtualTryOnScreen> createState() => _VirtualTryOnScreenState();
}

class _VirtualTryOnScreenState extends ConsumerState<VirtualTryOnScreen> {
  bool _isRendering = false;
  bool _showRenderedModel = false;

  @override
  Widget build(BuildContext context) {
    final wardrobeAsync = ref.watch(wardrobeProvider);

    return Scaffold(
      backgroundColor: AppTheme.noir,
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'AI FITTING ROOM',
                        style: GoogleFonts.outfit(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 2.0,
                          color: AppTheme.gold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Virtual Try-On',
                        style: Theme.of(context).textTheme.displayMedium,
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceNoir,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppTheme.borderNoir),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.auto_awesome, size: 14, color: AppTheme.gold),
                        const SizedBox(width: 6),
                        Text(
                          'Diffusion V2',
                          style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.silkWhite),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Center: Avatar Render Preview Stage
            Expanded(
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceNoir,
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: AppTheme.borderNoir),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(28),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Avatar Model Image
                      Image.network(
                        _showRenderedModel
                            ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
                            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
                        width: double.infinity,
                        height: double.infinity,
                        fit: BoxFit.cover,
                      ),

                      // Gradient Overlay for readability
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.transparent,
                              AppTheme.noir.withValues(alpha: 0.85),
                            ],
                            stops: const [0.6, 1.0],
                          ),
                        ),
                      ),

                      // Rendering Overlay Animation
                      if (_isRendering)
                        Container(
                          color: AppTheme.noir.withValues(alpha: 0.75),
                          child: Center(
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const CircularProgressIndicator(color: AppTheme.gold),
                                const SizedBox(height: 16),
                                Text(
                                  'Draping Garments on 3D Mesh...',
                                  style: GoogleFonts.cormorantGaramond(
                                    fontSize: 20,
                                    color: AppTheme.silkWhite,
                                  ),
                                ),
                                Text(
                                  'Calculating cloth physics & light reflection',
                                  style: GoogleFonts.outfit(
                                    fontSize: 12,
                                    color: AppTheme.mutedSilver,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),

                      // Bottom floating controls on stage
                      Positioned(
                        bottom: 16,
                        left: 16,
                        right: 16,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: AppTheme.noir.withValues(alpha: 0.8),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: AppTheme.borderNoir),
                              ),
                              child: Text(
                                _showRenderedModel ? '✨ AI Synthesis Active' : '👤 Avatar Base Mesh',
                                style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.gold),
                              ),
                            ),
                            ElevatedButton.icon(
                              icon: Icon(_isRendering ? Icons.hourglass_top : Icons.auto_fix_high, size: 16),
                              label: Text(_showRenderedModel ? 'RESET' : 'TRY-ON NOW'),
                              style: ElevatedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              ),
                              onPressed: _isRendering ? null : () => _simulateTryOn(),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Bottom Closet Picker Reel
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Select Pieces to Drape',
                    style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.silkWhite),
                  ),
                  Text(
                    '3 Items Selected',
                    style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.champagne),
                  ),
                ],
              ),
            ),

            SizedBox(
              height: 110,
              child: wardrobeAsync.maybeWhen(
                data: (items) => ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  itemCount: items.length,
                  itemBuilder: (context, i) {
                    final item = items[i];
                    return Container(
                      width: 85,
                      margin: const EdgeInsets.only(right: 10),
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceNoir,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: i < 3 ? AppTheme.gold : AppTheme.borderNoir),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(15),
                        child: Stack(
                          children: [
                            Image.network(
                              item.imageUrl,
                              width: double.infinity,
                              height: double.infinity,
                              fit: BoxFit.cover,
                            ),
                            if (i < 3)
                              Positioned(
                                top: 6,
                                right: 6,
                                child: Container(
                                  padding: const EdgeInsets.all(3),
                                  decoration: const BoxDecoration(
                                    color: AppTheme.gold,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.check, size: 10, color: AppTheme.noir),
                                ),
                              ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
                orElse: () => const SizedBox.shrink(),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  void _simulateTryOn() async {
    if (_showRenderedModel) {
      setState(() => _showRenderedModel = false);
      return;
    }

    setState(() => _isRendering = true);
    await Future.delayed(const Duration(milliseconds: 1400));
    if (mounted) {
      setState(() {
        _isRendering = false;
        _showRenderedModel = true;
      });
    }
  }
}
