import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/models/fashion_models.dart';
import '../../../shared/widgets/luxury_image.dart';
import '../../../shared/widgets/otd_chip.dart';
import '../../wardrobe/wardrobe_repository.dart';
import '../outfits_repository.dart';
import '../stylist_repository.dart';

class InteractiveStylistStudioScreen extends ConsumerStatefulWidget {
  const InteractiveStylistStudioScreen({super.key});

  @override
  ConsumerState<InteractiveStylistStudioScreen> createState() => _InteractiveStylistStudioScreenState();
}

class _InteractiveStylistStudioScreenState extends ConsumerState<InteractiveStylistStudioScreen> {
  final TextEditingController _inputController = TextEditingController();
  final ScrollController _scrollController = TextEditingController() as ScrollController? ?? ScrollController();

  @override
  void dispose() {
    _inputController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _sendMessage([String? presetText]) {
    final text = presetText ?? _inputController.text.trim();
    if (text.isEmpty) return;

    _inputController.clear();
    ref.read(stylistChatProvider.notifier).sendMessage(text);
    _scrollToBottom();
  }

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);
    final chatState = ref.watch(stylistChatProvider);
    final wardrobeAsync = ref.watch(wardrobeProvider);

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        backgroundColor: colors.canvas,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 20, color: colors.textPrimary),
          onPressed: () {
            if (Navigator.of(context).canPop()) {
              Navigator.of(context).pop();
            } else {
              context.go('/home');
            }
          },
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'EDITORIAL ENGINE',
              style: OtdTokens.caption(
                color: colors.accent,
                weight: FontWeight.w700,
              ).copyWith(letterSpacing: 2.0),
            ),
            Text(
              'Interactive Stylist',
              style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
            ),
          ],
        ),
        actions: [
          TextButton.icon(
            onPressed: () {
              ref.read(stylistChatProvider.notifier).clearChat();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Started a fresh styling session.')),
              );
            },
            icon: Icon(Icons.refresh, size: 16, color: colors.accent),
            label: Text(
              'New Chat',
              style: OtdTokens.label(color: colors.accent, weight: FontWeight.w600),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Wardrobe check warning if empty
            wardrobeAsync.maybeWhen(
              data: (items) {
                if (items.isEmpty) {
                  return Container(
                    margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: colors.accent.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: colors.accent.withValues(alpha: 0.4)),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.info_outline, size: 18, color: colors.accent),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            'Your closet is empty. Add a few pieces so the stylist can create looks.',
                            style: OtdTokens.caption(color: colors.textPrimary),
                          ),
                        ),
                        TextButton(
                          onPressed: () => context.push('/closet/add'),
                          child: Text('Add Piece', style: OtdTokens.label(color: colors.accent, weight: FontWeight.w700)),
                        ),
                      ],
                    ),
                  );
                }
                return const SizedBox.shrink();
              },
              orElse: () => const SizedBox.shrink(),
            ),

            // Chat Messages List
            Expanded(
              child: ListView.builder(
                controller: _scrollController,
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(
                  horizontal: OtdTokens.screenPaddingH,
                  vertical: 12,
                ),
                itemCount: chatState.messages.length + (chatState.isThinking ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index == chatState.messages.length && chatState.isThinking) {
                    return _buildTypingIndicator(colors);
                  }

                  final message = chatState.messages[index];
                  return _buildMessageItem(context, message, colors);
                },
              ),
            ),

            // Suggestion Quick Chips
            if (chatState.messages.isNotEmpty && chatState.messages.last.suggestions.isNotEmpty)
              Container(
                height: 40,
                margin: const EdgeInsets.only(bottom: 8),
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: OtdTokens.screenPaddingH),
                  itemCount: chatState.messages.last.suggestions.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, idx) {
                    final suggestion = chatState.messages.last.suggestions[idx];
                    return OtdChip(
                      label: suggestion,
                      isSelected: false,
                      onTap: () => _sendMessage(suggestion),
                    );
                  },
                ),
              ),

            // Input Bar
            Container(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
              decoration: BoxDecoration(
                color: colors.card,
                border: Border(top: BorderSide(color: colors.border)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _inputController,
                      style: OtdTokens.bodyMedium(color: colors.textPrimary),
                      decoration: InputDecoration(
                        hintText: 'Ask stylist: "Make it more formal", "Swap shoes"...',
                        hintStyle: OtdTokens.bodySmall(color: colors.textMuted),
                        filled: true,
                        fillColor: colors.canvas,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide(color: colors.border),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide(color: colors.border),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide(color: colors.accent),
                        ),
                      ),
                      onSubmitted: (_) => _sendMessage(),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Container(
                    width: 46,
                    height: 46,
                    decoration: BoxDecoration(
                      color: colors.accent,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.arrow_upward, size: 22, color: AppTheme.noir),
                      onPressed: () => _sendMessage(),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMessageItem(BuildContext context, StylistMessage message, OtdColors colors) {
    final isUser = message.isUser;

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (!isUser) ...[
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: colors.accent.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                    border: Border.all(color: colors.accent),
                  ),
                  alignment: Alignment.center,
                  child: Icon(Iconsax.magic_star, size: 16, color: colors.accent),
                ),
                const SizedBox(width: 8),
              ],
              Flexible(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: isUser ? colors.accent : colors.card,
                    borderRadius: BorderRadius.circular(18).copyWith(
                      bottomRight: isUser ? const Radius.circular(4) : null,
                      bottomLeft: !isUser ? const Radius.circular(4) : null,
                    ),
                    border: Border.all(
                      color: isUser ? colors.accent : colors.border,
                    ),
                    boxShadow: OtdTokens.softShadow(isDark: colors.isDark, blur: 8, offsetY: 2),
                  ),
                  child: Text(
                    message.text,
                    style: OtdTokens.bodyMedium(
                      color: isUser ? AppTheme.noir : colors.textPrimary,
                    ),
                  ),
                ),
              ),
            ],
          ),

          // Embedded Outfit Preview Card inside assistant message (Screen 22)
          if (!isUser && message.outfit != null) ...[
            const SizedBox(height: 10),
            Padding(
              padding: const EdgeInsets.only(left: 40),
              child: _buildEmbeddedOutfitCard(context, message.outfit!, colors),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildEmbeddedOutfitCard(BuildContext context, OutfitRecommendation outfit, OtdColors colors) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: colors.accent.withValues(alpha: 0.5)),
        boxShadow: OtdTokens.softShadow(isDark: colors.isDark, blur: 12, offsetY: 3),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'UPDATED CURATION',
                style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700).copyWith(letterSpacing: 1.2),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: colors.accent.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '${(outfit.aiMatchScore > 1 ? outfit.aiMatchScore : (outfit.aiMatchScore * 100)).toInt()}% Match',
                  style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            outfit.title,
            style: OtdTokens.label(color: colors.textPrimary, weight: FontWeight.w700).copyWith(fontSize: 13),
          ),
          const SizedBox(height: 10),

          // Horizontal row of garment thumbnails
          SizedBox(
            height: 64,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              itemCount: outfit.items.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (ctx, idx) {
                final item = outfit.items[idx];
                return Container(
                  width: 58,
                  decoration: BoxDecoration(
                    color: colors.canvas,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: colors.border),
                  ),
                  clipBehavior: Clip.antiAlias,
                  child: LuxuryImage(
                    imageUrl: item.imageUrl,
                    fit: BoxFit.cover,
                    fallbackIcon: item.icon,
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 10),

          // Actions: View In Result & Try On
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    side: BorderSide(color: colors.border),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    ref.read(curatedOutfitProvider.notifier).setOutfit(outfit);
                    context.push('/plan/result');
                  },
                  child: Text('Inspect Look', style: OtdTokens.label(color: colors.textPrimary)),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    backgroundColor: colors.accent,
                    foregroundColor: AppTheme.noir,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    ref.read(curatedOutfitProvider.notifier).setOutfit(outfit);
                    context.push('/try-on');
                  },
                  child: Text('Try On', style: OtdTokens.label(color: AppTheme.noir, weight: FontWeight.w700)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTypingIndicator(OtdColors colors) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: colors.accent.withValues(alpha: 0.2),
              shape: BoxShape.circle,
              border: Border.all(color: colors.accent),
            ),
            alignment: Alignment.center,
            child: Icon(Iconsax.magic_star, size: 16, color: colors.accent),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: colors.card,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: colors.border),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                SizedBox(
                  width: 14,
                  height: 14,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(colors.accent),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  'Stylist is curating...',
                  style: OtdTokens.caption(color: colors.textMuted),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
