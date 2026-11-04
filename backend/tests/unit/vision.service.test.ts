import { describe, it, expect } from 'vitest';
import { VisionRecognitionService } from '../../src/modules/ai/vision-recognition.service';

describe('Vision Garment Recognition Unit Tests', () => {
  it('should auto-classify footwear from imagery metadata', async () => {
    const shoe = await VisionRecognitionService.analyzeGarment({
      fileName: 'white_minimalist_sneakers.png',
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
    });

    expect(shoe.category).toBe('footwear');
    expect(shoe.subType).toBe('Clean Sneaker');
    expect(shoe.formality).toBe(2);
    expect(shoe.confidence).toBeGreaterThan(0.9);
  });

  it('should auto-classify tailored trousers from imagery metadata', async () => {
    const trousers = await VisionRecognitionService.analyzeGarment({
      fileName: 'forward_pleat_charcoal_trousers.jpg',
    });

    expect(trousers.category).toBe('bottoms');
    expect(trousers.subType).toBe('Pleated Trousers');
    expect(trousers.fabric).toContain('Wool');
    expect(trousers.formality).toBe(4);
  });

  it('should auto-classify luxury knitwear from imagery metadata', async () => {
    const knit = await VisionRecognitionService.analyzeGarment({
      fileName: 'silk_cashmere_high_neck_cream.webp',
    });

    expect(knit.category).toBe('tops');
    expect(knit.fabric).toContain('Cashmere');
    expect(knit.color).toContain('Cream');
  });
});
