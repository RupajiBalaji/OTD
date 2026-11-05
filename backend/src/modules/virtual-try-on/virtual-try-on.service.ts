import crypto from 'crypto';
import { VirtualTryOn, IVirtualTryOn } from '../../models/VirtualTryOn';
import { Avatar, IAvatar } from '../../models/Avatar';
import { Outfit } from '../../models/Outfit';
import { WardrobeItem, IWardrobeItem } from '../../models/WardrobeItem';
import { ApiError } from '../../utils/ApiError';
import { GenerateTryOnDto } from './virtual-try-on.types';
import { env, getGeminiApiKeys } from '../../config/env';

export class VirtualTryOnService {
  public static readonly DEFAULT_PERSONA_MODELS = {
    boy: {
      name: 'Aarav',
      faceUrl: '/wardrobe/boy/boy_blue_botanical_shirt.png',
      skinTone: 'Medium Warm Honey',
      bodyShape: 'Athletic / Lean Youth',
      height: "5'10\" (178 cm)",
      isMinor: true,
    },
    girl: {
      name: 'Ananya',
      faceUrl: '/wardrobe/girl/girl_rose_pink_saree.png',
      skinTone: 'Warm Beige Honey',
      bodyShape: 'Slender / Hourglass',
      height: "5'6\" (168 cm)",
      isMinor: true,
    },
    women: {
      name: 'Sophia',
      faceUrl: '/wardrobe/women/women_rose_pink_saree.png',
      skinTone: 'Warm Golden Caramel',
      bodyShape: 'Hourglass Haute Couture',
      height: "5'8\" (173 cm)",
      isMinor: false,
    },
    man: {
      name: 'Mustafa',
      faceUrl: '/wardrobe/man/man_blue_botanical_shirt.png',
      skinTone: 'Olive Bronze',
      bodyShape: 'Broad V-Taper Athletic',
      height: "6'1\" (185 cm)",
      isMinor: false,
    },
  };

  public static async getAvatar(userId: string): Promise<IAvatar> {
    let avatar = await Avatar.findOne({ userId });
    if (!avatar) {
      avatar = await Avatar.create({
        userId,
        height: '175 cm',
        skinTone: 'Warm Neutral',
        hair: 'Dark Espresso',
        avatarVersion: 1,
      });
    }
    return avatar;
  }

  public static async updateAvatar(userId: string, data: Partial<IAvatar>): Promise<IAvatar> {
    let avatar = await Avatar.findOne({ userId });
    if (!avatar) {
      avatar = await Avatar.create({ userId, ...data, avatarVersion: 1 });
      return avatar;
    }

    Object.assign(avatar, data);
    avatar.avatarVersion = (avatar.avatarVersion || 1) + 1;
    await avatar.save();
    return avatar;
  }

  /**
   * Dispatches a photorealistic Try-On job, returning HTTP 202 immediately
   */
  public static async createTryOnJob(userId: string, dto: GenerateTryOnDto): Promise<IVirtualTryOn> {
    const persona = dto.personaType || 'women';
    const personaMeta = this.DEFAULT_PERSONA_MODELS[persona] || this.DEFAULT_PERSONA_MODELS.women;

    // Check Child / Minor Protection Policy
    if (personaMeta.isMinor || persona === 'boy' || persona === 'girl') {
      const minorJob = await VirtualTryOn.create({
        jobId: `vto_minor_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        userId,
        personaType: persona,
        status: 'fallback_to_layered',
        progress: 100,
        fallbackToLayered: true,
        isMinorProtected: true,
        fallbackReason: 'Photorealistic generation is strictly restricted for minor profiles to ensure child safety. Displaying instant Layered Avatar.',
        silhouetteFidelity: 96.0,
        source: 'rules',
      });
      return minorJob;
    }

    // Resolve garment item IDs
    let pieceIds: any[] = [];
    if (dto.outfitId) {
      const outfit = await Outfit.findOne({ _id: dto.outfitId, userId });
      if (!outfit) throw new ApiError(404, 'Outfit not found');
      pieceIds = outfit.items;
    } else if (dto.itemIds && dto.itemIds.length > 0) {
      pieceIds = dto.itemIds;
    } else {
      const sample = await WardrobeItem.find({ userId }).limit(3);
      pieceIds = sample.map((s) => s._id);
    }

    const items = await WardrobeItem.find({ _id: { $in: pieceIds } });
    const avatar = await this.getAvatar(userId);

    // Compute Cache Key
    const cacheKey = crypto
      .createHash('sha256')
      .update(`${avatar.avatarVersion}_${pieceIds.map(String).sort().join('_')}_${env.GEMINI_IMAGE_MODEL}`)
      .digest('hex');

    const cached = await VirtualTryOn.findOne({ cacheKey, status: 'completed' });
    if (cached) {
      return cached;
    }

    const jobId = `vto_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const isCustomPhoto = Boolean(dto.customPhotoUrl && dto.customPhotoUrl.trim().length > 0);

    const newJob = await VirtualTryOn.create({
      jobId,
      userId,
      outfitId: dto.outfitId,
      itemIds: pieceIds,
      status: 'queued',
      progress: 10,
      personaType: persona,
      lightingPreset: dto.lightingPreset || 'Editorial Studio',
      skinTone: dto.skinTone || personaMeta.skinTone,
      bodyShape: dto.bodyShape || personaMeta.bodyShape,
      height: dto.height || personaMeta.height,
      modelFaceUrl: isCustomPhoto ? dto.customPhotoUrl : personaMeta.faceUrl,
      customPhotoUrl: isCustomPhoto ? dto.customPhotoUrl : undefined,
      cacheKey,
      fallbackToLayered: false,
      isMinorProtected: false,
      source: 'gemini',
    });

    // Execute background worker asynchronously
    void this.processTryOnJob(newJob._id.toString(), items);

    return newJob;
  }

  /**
   * Retrieves status for polling
   */
  public static async getTryOnJob(userId: string, jobId: string): Promise<IVirtualTryOn> {
    const job = await VirtualTryOn.findOne({ userId, jobId }).populate('itemIds');
    if (!job) {
      throw new ApiError(404, `Try-On job ${jobId} not found`);
    }
    return job;
  }

  /**
   * Internal Background Job Processor
   */
  private static async processTryOnJob(recordId: string, items: IWardrobeItem[]) {
    try {
      const job = await VirtualTryOn.findById(recordId);
      if (!job) return;

      // Stage 1: Compositing Garments Flat-Lay
      job.status = 'compositing';
      job.progress = 35;
      await job.save();

      // Stage 2: Calling Photorealistic Image Model with Timeout
      job.status = 'rendering';
      job.progress = 65;
      await job.save();

      const keys = getGeminiApiKeys();
      if (keys.length === 0 || env.AI_PROVIDER === 'rules' || env.AI_PROVIDER === 'algorithmic') {
        job.status = 'fallback_to_layered';
        job.progress = 100;
        job.fallbackToLayered = true;
        job.fallbackReason = 'No AI image generation keys configured. Displaying high-precision Layered Avatar.';
        job.source = 'rules';
        await job.save();
        return;
      }

      const activeKey = keys[0];
      const imageModel = env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
      const prompt = `
Full-body fashion photograph of a statuesque ${job.personaType === 'man' ? 'man' : 'woman'} (${job.skinTone} skin tone, ${job.bodyShape} silhouette, height ${job.height}).
Wearing strictly the following garments: ${items.map((i) => `${i.name} (${i.category}: ${i.fabric || 'Textured weave'}, color ${i.color})`).join(', ')}.
Standing poised in a luxury minimalist atelier with polished marble floor and ${job.lightingPreset} ambient lighting.
Full length portrait 3:4 aspect ratio, natural fabric physics drape, sharp garment seams, floor shadow grounding.
`.trim();

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${imageModel}:generateContent`;
      const res = await fetch(url, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': activeKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }).finally(() => clearTimeout(timeout));

      if (!res.ok) {
        const status = res.status;
        const errText = await res.text();
        console.warn(`[VirtualTryOn] Image model returned HTTP ${status}: ${errText.slice(0, 150)}`);

        // Graceful fallback to LayeredAvatar with honest explanation
        job.status = 'fallback_to_layered';
        job.progress = 100;
        job.fallbackToLayered = true;
        job.fallbackReason =
          status === 429
            ? 'AI image model quota reached for current tier. Displaying instant zero-latency Layered Avatar.'
            : `AI Image model unavailable (${status}). Displaying instant Layered Avatar.`;
        job.source = 'rules';
        await job.save();
        return;
      }

      const data: any = await res.json();
      const candidatePart = data?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData || p.text);

      if (candidatePart?.inlineData?.data) {
        job.renderResultUrl = `data:${candidatePart.inlineData.mimeType || 'image/jpeg'};base64,${candidatePart.inlineData.data}`;
        job.status = 'completed';
        job.progress = 100;
        job.source = 'gemini';
        await job.save();
      } else {
        // Model generated text or no image part
        job.status = 'fallback_to_layered';
        job.progress = 100;
        job.fallbackToLayered = true;
        job.fallbackReason = 'Photorealistic image synthesis deferred; active Layered Avatar reflects exact selected pieces.';
        job.source = 'rules';
        await job.save();
      }
    } catch (err: any) {
      console.warn(`[VirtualTryOn] Error processing job ${recordId}: ${err.message}`);
      await VirtualTryOn.findByIdAndUpdate(recordId, {
        status: 'fallback_to_layered',
        progress: 100,
        fallbackToLayered: true,
        fallbackReason: `Try-on request timed out or was refused. Active Layered Avatar is displayed.`,
        source: 'rules',
      });
    }
  }

  public static async getTryOnHistory(userId: string): Promise<IVirtualTryOn[]> {
    return VirtualTryOn.find({ userId }).populate('itemIds').sort({ createdAt: -1 }).limit(10);
  }
}
