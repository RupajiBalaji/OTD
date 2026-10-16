import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/fashion_models.dart';
import '../social_repository.dart';

class CommunityFeedScreen extends ConsumerWidget {
  const CommunityFeedScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final feedAsync = ref.watch(socialFeedProvider);

    return Scaffold(
      backgroundColor: AppTheme.noir,
      body: SafeArea(
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // Header
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'COMMUNITY LOOKBOOK',
                      style: GoogleFonts.outfit(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 2.0,
                        color: AppTheme.gold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Style Inspiration',
                      style: Theme.of(context).textTheme.displayMedium,
                    ),
                  ],
                ),
              ),
            ),

            feedAsync.when(
              loading: () => const SliverFillRemaining(
                child: Center(child: CircularProgressIndicator(color: AppTheme.gold)),
              ),
              error: (err, _) => SliverFillRemaining(
                child: Center(child: Text('Error: $err', style: const TextStyle(color: Colors.red))),
              ),
              data: (posts) {
                return SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final post = posts[index];
                        return _SocialPostCard(post: post);
                      },
                      childCount: posts.length,
                    ),
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

class _SocialPostCard extends ConsumerWidget {
  final SocialPost post;

  const _SocialPostCard({required this.post});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      decoration: BoxDecoration(
        color: AppTheme.surfaceNoir,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.borderNoir),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Author Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundImage: NetworkImage(post.userAvatar),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        post.userName,
                        style: GoogleFonts.outfit(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.silkWhite,
                        ),
                      ),
                      Text(
                        '${post.userHandle} • ${post.timeAgo}',
                        style: GoogleFonts.outfit(fontSize: 11, color: AppTheme.mutedSilver),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.elevatedNoir,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.borderNoir),
                  ),
                  child: Text(
                    post.vibeTag,
                    style: GoogleFonts.outfit(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.gold,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Outfit Photography
          ClipRRect(
            child: Image.network(
              post.imageUrl,
              width: double.infinity,
              height: 340,
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
                  style: GoogleFonts.cormorantGaramond(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.silkWhite,
                  ),
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
                            color: post.isLiked ? AppTheme.roseGold : AppTheme.mutedSilver,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            '${post.likes}',
                            style: GoogleFonts.outfit(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.silkWhite,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 24),
                    Row(
                      children: [
                        const Icon(Icons.chat_bubble_outline, size: 18, color: AppTheme.mutedSilver),
                        const SizedBox(width: 6),
                        Text(
                          '${post.comments}',
                          style: GoogleFonts.outfit(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.silkWhite,
                          ),
                        ),
                      ],
                    ),
                    const Spacer(),
                    const Icon(Icons.share_outlined, size: 18, color: AppTheme.mutedSilver),
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
