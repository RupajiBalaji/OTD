import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../shared/models/fashion_models.dart';

abstract class SocialRepository {
  Future<List<SocialPost>> getFeedPosts();
  Future<void> toggleLike(String postId);
}

class MockSocialRepository implements SocialRepository {
  final List<SocialPost> _posts = [
    SocialPost(
      id: 'sp_1',
      userName: 'Camille Laurent',
      userHandle: '@camille_style',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      outfitTitle: 'Monochrome Cashmere in Mayfair',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      vibeTag: '#OldMoney',
      likes: 342,
      comments: 28,
      timeAgo: '2h ago',
    ),
    SocialPost(
      id: 'sp_2',
      userName: 'Julian Vance',
      userHandle: '@julianv',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      outfitTitle: 'Architectural Tailoring & Loafers',
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      vibeTag: '#Minimalist',
      likes: 519,
      comments: 44,
      timeAgo: '4h ago',
    ),
    SocialPost(
      id: 'sp_3',
      userName: 'Evelyn Sterling',
      userHandle: '@evelyn_noir',
      userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      outfitTitle: 'Paris Fashion Week Off-Duty',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      vibeTag: '#StreetChic',
      likes: 890,
      comments: 63,
      timeAgo: '6h ago',
    ),
  ];

  @override
  Future<List<SocialPost>> getFeedPosts() async {
    await Future.delayed(const Duration(milliseconds: 250));
    return List.from(_posts);
  }

  @override
  Future<void> toggleLike(String postId) async {
    final index = _posts.indexWhere((p) => p.id == postId);
    if (index != -1) {
      final post = _posts[index];
      final isLiked = !post.isLiked;
      _posts[index] = post.copyWith(
        isLiked: isLiked,
        likes: isLiked ? post.likes + 1 : post.likes - 1,
      );
    }
  }
}

final socialRepositoryProvider = Provider<SocialRepository>((ref) {
  return MockSocialRepository();
});

class SocialFeedNotifier extends StateNotifier<AsyncValue<List<SocialPost>>> {
  final SocialRepository _repo;

  SocialFeedNotifier(this._repo) : super(const AsyncValue.loading()) {
    loadFeed();
  }

  Future<void> loadFeed() async {
    try {
      state = const AsyncValue.loading();
      final posts = await _repo.getFeedPosts();
      state = AsyncValue.data(posts);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> toggleLike(String postId) async {
    await _repo.toggleLike(postId);
    state.whenData((posts) {
      final updated = posts.map((p) {
        if (p.id == postId) {
          final isLiked = !p.isLiked;
          return p.copyWith(
            isLiked: isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          );
        }
        return p;
      }).toList();
      state = AsyncValue.data(updated);
    });
  }
}

final socialFeedProvider = StateNotifierProvider<SocialFeedNotifier, AsyncValue<List<SocialPost>>>((ref) {
  final repo = ref.watch(socialRepositoryProvider);
  return SocialFeedNotifier(repo);
});
