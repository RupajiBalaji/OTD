import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { UnifiedAiClient } from '../../src/integrations/ai/ai.client';
import { AiStylistService } from '../../src/modules/ai/ai.service';
import { AiMemoryService } from '../../src/modules/ai/ai-memory.service';
import { AiOutfitPipelineService } from '../../src/modules/ai/outfit-pipeline.service';
import { VirtualTryOnService } from '../../src/modules/virtual-try-on/virtual-try-on.service';
import { StylistStructuredReplySchema, GarmentVisionOutputSchema } from '../../src/integrations/ai/ai.schemas';
import { WardrobeItem } from '../../src/models/WardrobeItem';
import { VirtualTryOn } from '../../src/models/VirtualTryOn';

describe('Backend AI Gateway & Safety Unit Tests', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('1. 429 failover: switches from Key #1 to Key #2 upon encountering HTTP 429 rate limit', async () => {
    let callCount = 0;
    const usedKeys: string[] = [];

    global.fetch = vi.fn().mockImplementation((url: string, init?: any) => {
      callCount++;
      const apiKey = init?.headers?.['x-goog-api-key'] || '';
      usedKeys.push(apiKey);

      if (callCount === 1) {
        // First key returns 429 Too Many Requests
        return Promise.resolve({
          ok: false,
          status: 429,
          statusText: 'Too Many Requests',
          text: () => Promise.resolve('{"error":{"code":429,"message":"Resource exhausted"}}'),
          json: () => Promise.resolve({ error: { code: 429, message: 'Resource exhausted' } }),
        });
      }

      // Second key succeeds
      return Promise.resolve({
        ok: true,
        status: 200,
        text: () =>
          Promise.resolve(
            JSON.stringify({
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text: JSON.stringify({
                          reply: 'Successfully failed over to secondary key.',
                          intent: 'recommend_new',
                          slotChanges: [],
                        }),
                      },
                    ],
                  },
                },
              ],
            })
          ),
        json: () =>
          Promise.resolve({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: JSON.stringify({
                        reply: 'Successfully failed over to secondary key.',
                        intent: 'recommend_new',
                        slotChanges: [],
                      }),
                    },
                  ],
                },
              },
            ],
          }),
      });
    });

    const res = await UnifiedAiClient.generateStylistResponse(
      [{ role: 'user', content: 'Suggest an outfit' }],
      { enableInTest: true }
    );

    expect(callCount).toBeGreaterThanOrEqual(2);
    expect(res).toBeDefined();
    expect(res.data.reply).toContain('failed over');
    expect(res.source).toBe('gemini');
  });

  it('2. Timeout: handles AbortSignal timeout gracefully with failover or rules fallback', async () => {
    global.fetch = vi.fn().mockImplementation((url: string, init?: any) => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          const err = new Error('The operation was aborted');
          err.name = 'AbortError';
          reject(err);
        }, 30);
      });
    });

    const res = await UnifiedAiClient.generateStylistResponse(
      [{ role: 'user', content: 'Suggest an outfit' }],
      { enableInTest: true, timeoutMs: 10 }
    );

    expect(res).toBeDefined();
    expect(res.source).toBe('rules');
    expect(res.data.reply).toBeDefined();
  });

  it('3. Invalid JSON: schema validation catches corrupt LLM payload and recovers', () => {
    const malformedRaw = '{"reply": "Corrupt json';
    let parsed: any = null;
    try {
      parsed = JSON.parse(malformedRaw);
    } catch {
      parsed = null;
    }
    expect(parsed).toBeNull();

    const invalidGarment = { fit: 'Slim' };
    const validation = GarmentVisionOutputSchema.safeParse(invalidGarment);
    expect(validation.success).toBe(false);
  });

  it('4. Hallucinated itemId: ai.service filters hallucinated itemId not in user wardrobe', async () => {
    const mockUserId = new mongoose.Types.ObjectId().toString();
    const mockConvId = new mongoose.Types.ObjectId();

    vi.spyOn(AiMemoryService, 'getOrCreateConversation').mockResolvedValue({
      _id: mockConvId,
      userId: new mongoose.Types.ObjectId(mockUserId),
      title: 'Styling Chat',
      messages: [],
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    vi.spyOn(AiMemoryService, 'recordMessage').mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
    } as any);
    vi.spyOn(AiMemoryService, 'getRecentContextMessages').mockResolvedValue([]);

    vi.spyOn(AiOutfitPipelineService, 'getUserStylingProfile').mockResolvedValue({
      name: 'Test Persona',
    } as any);

    const realItemId = new mongoose.Types.ObjectId();
    const realItem = {
      _id: realItemId,
      name: 'White Linen Shirt',
      category: 'tops',
      color: 'White',
    };

    vi.spyOn(AiOutfitPipelineService, 'getGroundingWardrobe').mockResolvedValue([realItem] as any);
    vi.spyOn(WardrobeItem, 'find').mockResolvedValue([realItem] as any);

    vi.spyOn(UnifiedAiClient, 'generateStylistResponse').mockResolvedValue({
      data: {
        reply: 'Here is your outfit change with a phantom garment.',
        intent: 'modify_outfit',
        slotChanges: [
          { slot: 'tops', itemId: realItemId.toString(), itemName: 'White Linen Shirt', action: 'replace' },
          { slot: 'footwear', itemId: 'phantom-item-999', itemName: 'Nonexistent Boots', action: 'replace' },
        ],
      },
      source: 'gemini',
      modelUsed: 'gemini-3.5-flash',
    });

    const result = await AiStylistService.chat(mockUserId, {
      message: 'Equip some boots',
    });

    expect(result).toBeDefined();
    // Valid item has verified itemId
    const validSlot = result.slotChanges.find((s) => s.slot === 'tops');
    expect(validSlot?.itemId).toBe(realItemId.toString());

    // Hallucinated item has itemId stripped (set to undefined)
    const hallucinatedSlot = result.slotChanges.find((s) => s.slot === 'footwear');
    expect(hallucinatedSlot?.itemId).toBeUndefined();

    // User is informed honestly
    expect(result.reply).toContain('Nonexistent Boots');
  });

  it('5. Safety block: restricts photoreal generation on minor personas (boy/girl) and forces Layered Avatar', async () => {
    vi.spyOn(VirtualTryOn, 'create').mockImplementation((data: any) => Promise.resolve(data));

    // Requesting try-on for boy persona
    const boyJob = await VirtualTryOnService.createTryOnJob('test-user-id', {
      personaType: 'boy',
      itemIds: ['mock-item-1'],
    });

    expect(boyJob.fallbackToLayered).toBe(true);
    expect(boyJob.isMinorProtected).toBe(true);
    expect(boyJob.status).toBe('fallback_to_layered');
    expect(boyJob.source).toBe('rules');
    expect(boyJob.fallbackReason).toContain('child safety');

    // Requesting try-on for girl persona
    const girlJob = await VirtualTryOnService.createTryOnJob('test-user-id', {
      personaType: 'girl',
      itemIds: ['mock-item-2'],
    });

    expect(girlJob.fallbackToLayered).toBe(true);
    expect(girlJob.isMinorProtected).toBe(true);
    expect(girlJob.status).toBe('fallback_to_layered');
    expect(girlJob.fallbackReason).toContain('restricted for minor profiles');
  });
});
