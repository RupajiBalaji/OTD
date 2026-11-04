import { OutfitShare, IOutfitShare } from '../../models/OutfitShare';
import { SocialLike } from '../../models/SocialLike';
import { SocialComment, ISocialComment } from '../../models/SocialComment';
import { Outfit } from '../../models/Outfit';
import { ApiError } from '../../utils/ApiError';
import { CreateShareDto } from './social.types';

export class SocialService {
  public static async getFeed(userId?: string): Promise<any[]> {
    const shares = await OutfitShare.find()
      .populate('userId', 'name avatarUrl')
      .populate({
        path: 'outfitId',
        populate: { path: 'items' },
      })
      .sort({ createdAt: -1 })
      .limit(25);

    if (!userId) {
      return shares.map((s) => ({ ...s.toObject(), isLiked: false }));
    }

    const shareIds = shares.map((s) => s._id);
    const userLikes = await SocialLike.find({
      userId,
      shareId: { $in: shareIds },
    });
    const likedSet = new Set(userLikes.map((l) => l.shareId.toString()));

    return shares.map((s) => ({
      ...s.toObject(),
      isLiked: likedSet.has(s._id.toString()),
    }));
  }

  public static async shareOutfit(userId: string, data: CreateShareDto): Promise<IOutfitShare> {
    let validatedOutfitId: any = undefined;
    let fallbackVenue = data.venue || 'Curated Destination';
    let fallbackOccasion = data.occasion || 'Evening Social';

    if (data.outfitId) {
      try {
        const outfit = await Outfit.findOne({ _id: data.outfitId, userId });
        if (outfit) {
          validatedOutfitId = outfit._id;
          fallbackVenue = data.venue || outfit.venue;
          fallbackOccasion = data.occasion || outfit.occasion;
        }
      } catch {
        // Not a standard ObjectId or ephemeral outfit id, proceed gracefully
      }
    }

    const share = await OutfitShare.create({
      userId,
      outfitId: validatedOutfitId,
      caption: data.caption,
      venue: fallbackVenue,
      occasion: fallbackOccasion,
      tags: data.tags || ['Quiet Luxury', 'Editorial'],
    });

    const populateOpts: any[] = [{ path: 'userId', select: 'name avatarUrl' }];
    if (validatedOutfitId) {
      populateOpts.push({ path: 'outfitId', populate: { path: 'items' } });
    }

    return share.populate(populateOpts);
  }

  public static async toggleLike(userId: string, shareId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    const share = await OutfitShare.findById(shareId);
    if (!share) {
      throw new ApiError(404, 'Shared outfit not found');
    }

    const existing = await SocialLike.findOne({ userId, shareId });
    if (existing) {
      await SocialLike.deleteOne({ _id: existing._id });
      share.likesCount = Math.max(0, share.likesCount - 1);
      await share.save();
      return { isLiked: false, likesCount: share.likesCount };
    }

    await SocialLike.create({ userId, shareId });
    share.likesCount += 1;
    await share.save();
    return { isLiked: true, likesCount: share.likesCount };
  }

  public static async addComment(userId: string, shareId: string, text: string): Promise<ISocialComment> {
    const share = await OutfitShare.findById(shareId);
    if (!share) {
      throw new ApiError(404, 'Shared outfit not found');
    }

    const comment = await SocialComment.create({
      userId,
      shareId,
      text,
    });

    share.commentsCount += 1;
    await share.save();

    return comment.populate('userId', 'name avatarUrl');
  }

  public static async getComments(shareId: string): Promise<ISocialComment[]> {
    return SocialComment.find({ shareId })
      .populate('userId', 'name avatarUrl')
      .sort({ createdAt: -1 });
  }
}
