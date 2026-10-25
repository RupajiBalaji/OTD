import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/models/fashion_models.dart';
import '../../../shared/widgets/luxury_image.dart';
import '../social_repository.dart';

class CommunityFeedScreen extends ConsumerWidget {
  const CommunityFeedScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = OtdColors.of(context);
    final feedAsync = ref.watch(socialFeedProvider);

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        backgroundColor: colors.canvas,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 20, color: colors.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'COMMUNITY LOOKBOOK',
              style: OtdTokens.caption(
                color: colors.accent,
                weight: FontWeight.w700,
              ).copyWith(letterSpacing: 2.0),
            ),
            Text(
              'Style Inspiration',
              style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: feedAsync.when(
          loading: () => const Center(
            child: CircularProgressIndicator(color: AppTheme.gold),
          ),
          error: (err, _) => Center(
            child: Text('Error: $err', style: const TextStyle(color: Colors.red)),
          ),
          data: (posts) {
            return ListView.separated(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(
                horizontal: OtdTokens.screenPaddingH,
                vertical: 16,
              ),
              itemCount: posts.length,
              separatorBuilder: (_, __) => const SizedBox(height: 20),
              itemBuilder: (context, index) {
                final post = posts[index];
                return _buildSocialPostCard(context, ref, post, colors);
              },
            );
          },
        ),
      ),
    );
  }

  Widget _buildSocialPostCard(BuildContext context, WidgetRef ref, SocialPost post, OtdColors colors) {
    return Container(
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: colors.border),
        boxShadow: OtdTokens.softShadow(isDark: colors.isDark, blur: 14, offsetY: 4),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Author Header
          Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundImage: NetworkImage(post.userAvatar),
                  backgroundColor: colors.canvas,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        post.userName,
                        style: OtdTokens.label(color: colors.textPrimary, weight: FontWeight.w700),
                      ),
                      Text(
                        '${post.userHandle} · ${post.timeAgo}',
                        style: OtdTokens.caption(color: colors.textMuted),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: colors.accent.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: colors.accent.withValues(alpha: 0.3)),
                  ),
                  child: Text(
                    post.vibeTag,
                    style: OtdTokens.caption(
                      color: colors.accent,
                      weight: FontWeight.w700,
                    ).copyWith(letterSpacing: 0.6),
                  ),
                ),
              ],
            ),
          ),

          // Outfit Photography
          SizedBox(
            height: 340,
            width: double.infinity,
            child: LuxuryImage(
              imageUrl: post.imageUrl,
              fit: BoxFit.cover,
            ),
          ),

          // Post details & interactions
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  post.outfitTitle,
                  style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700).copyWith(fontSize: 18),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    GestureDetector(
                      onTap: () {
                        ref.read(socialFeedProvider.notifier).toggleLike(post.id);
                      },
                      child: Row(
                        children: [
                          Icon(
                            post.isLiked ? Icons.favorite : Icons.favorite_border,
                            size: 20,
                            color: post.isLiked ? const Color(0xFFF43F5E) : colors.textMuted,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            '${post.likes}',
                            style: OtdTokens.label(
                              color: post.isLiked ? const Color(0xFFF43F5E) : colors.textPrimary,
                              weight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 20),
                    Row(
                      children: [
                        Icon(Iconsax.message, size: 18, color: colors.textMuted),
                        const SizedBox(width: 6),
                        Text(
                          '${post.comments}',
                          style: OtdTokens.label(color: colors.textPrimary, weight: FontWeight.w600),
                        ),
                      ],
                    ),
                    const Spacer(),
                    Icon(Iconsax.share, size: 18, color: colors.textMuted),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
