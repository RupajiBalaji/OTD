import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path_provider/path_provider.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/widgets/otd_button.dart';
import '../garment_detection_service.dart';

class AddPieceScreen extends ConsumerStatefulWidget {
  const AddPieceScreen({super.key});

  @override
  ConsumerState<AddPieceScreen> createState() => _AddPieceScreenState();
}

class _AddPieceScreenState extends ConsumerState<AddPieceScreen> {
  final ImagePicker _picker = ImagePicker();
  String? _pickedImagePath;
  bool _isProcessing = false;

  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? file = await _picker.pickImage(
        source: source,
        maxWidth: 1200,
        maxHeight: 1200,
        imageQuality: 88,
      );

      if (file == null) return;

      setState(() {
        _isProcessing = true;
      });

      // Copy to persistent documents directory so images survive cache clears
      final appDir = await getApplicationDocumentsDirectory();
      final ext = file.path.contains('.') ? file.path.split('.').last : 'jpg';
      final permanentPath = '${appDir.path}/garment_${DateTime.now().millisecondsSinceEpoch}.$ext';
      await File(file.path).copy(permanentPath);

      setState(() {
        _pickedImagePath = permanentPath;
      });

      // Run Garment Detection Service on permanent path
      final detectionService = ref.read(garmentDetectionServiceProvider);
      final detected = await detectionService.detectGarment(permanentPath);

      if (mounted) {
        setState(() => _isProcessing = false);
        context.push('/closet/detected', extra: detected);
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isProcessing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Could not access image: ${e.toString()}'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        backgroundColor: colors.canvas,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 20, color: colors.textPrimary),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Add a New Piece',
          style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: OtdTokens.screenPaddingH,
            vertical: 16,
          ),
          child: Column(
            children: [
              // Camera-Style Frame with Corner Brackets
              Expanded(
                child: Center(
                  child: Container(
                    width: size.width * 0.88,
                    constraints: const BoxConstraints(maxWidth: 420, maxHeight: 460),
                    decoration: BoxDecoration(
                      color: colors.card,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: colors.border),
                      boxShadow: OtdTokens.softShadow(isDark: colors.isDark, blur: 20, offsetY: 6),
                    ),
                    child: Stack(
                      children: [
                        // Display picked image or empty viewfinder
                        if (_pickedImagePath != null)
                          ClipRRect(
                            borderRadius: BorderRadius.circular(24),
                            child: Image.file(
                              File(_pickedImagePath!),
                              width: double.infinity,
                              height: double.infinity,
                              fit: BoxFit.cover,
                            ),
                          )
                        else
                          Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Container(
                                  width: 80,
                                  height: 80,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: colors.accentTint,
                                  ),
                                  child: Icon(
                                    Iconsax.camera,
                                    size: 36,
                                    color: colors.accent,
                                  ),
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  'Position garment inside frame',
                                  style: OtdTokens.bodyMedium(
                                    color: colors.textPrimary,
                                    weight: FontWeight.w600,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 24),
                                  child: Text(
                                    'AI will identify category, color, material, and fit automatically.',
                                    textAlign: TextAlign.center,
                                    style: OtdTokens.bodySmall(color: colors.textMuted),
                                  ),
                                ),
                              ],
                            ),
                          ),

                        // Corner Brackets
                        Positioned(
                          top: 18,
                          left: 18,
                          child: _CornerBracket(isTop: true, isLeft: true, color: colors.accent),
                        ),
                        Positioned(
                          top: 18,
                          right: 18,
                          child: _CornerBracket(isTop: true, isLeft: false, color: colors.accent),
                        ),
                        Positioned(
                          bottom: 18,
                          left: 18,
                          child: _CornerBracket(isTop: false, isLeft: true, color: colors.accent),
                        ),
                        Positioned(
                          bottom: 18,
                          right: 18,
                          child: _CornerBracket(isTop: false, isLeft: false, color: colors.accent),
                        ),

                        // Processing Spinner
                        if (_isProcessing)
                          Container(
                            decoration: BoxDecoration(
                              color: Colors.black.withValues(alpha: 0.6),
                              borderRadius: BorderRadius.circular(24),
                            ),
                            child: Center(
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  CircularProgressIndicator(
                                    valueColor: AlwaysStoppedAnimation<Color>(colors.accent),
                                  ),
                                  const SizedBox(height: 16),
                                  Text(
                                    'Analyzing Garment...',
                                    style: OtdTokens.bodyMedium(
                                      color: OtdTokens.white,
                                      weight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Action Buttons Row: Take Photo / Upload
              Row(
                children: [
                  Expanded(
                    child: OtdButton(
                      text: 'Take Photo',
                      variant: OtdButtonVariant.primary,
                      icon: const Icon(Iconsax.camera, size: 20),
                      onPressed: _isProcessing ? null : () => _pickImage(ImageSource.camera),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: OtdButton(
                      text: 'Upload',
                      variant: OtdButtonVariant.outline,
                      icon: Icon(Iconsax.gallery, size: 20, color: colors.textPrimary),
                      onPressed: _isProcessing ? null : () => _pickImage(ImageSource.gallery),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }
}

class _CornerBracket extends StatelessWidget {
  final bool isTop;
  final bool isLeft;
  final Color color;

  const _CornerBracket({
    required this.isTop,
    required this.isLeft,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    const double size = 24.0;
    const double thickness = 2.5;

    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        children: [
          // Horizontal line
          Positioned(
            top: isTop ? 0 : null,
            bottom: isTop ? null : 0,
            left: 0,
            right: 0,
            child: Container(
              height: thickness,
              color: color,
            ),
          ),
          // Vertical line
          Positioned(
            left: isLeft ? 0 : null,
            right: isLeft ? null : 0,
            top: 0,
            bottom: 0,
            child: Container(
              width: thickness,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}
