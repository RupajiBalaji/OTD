import type { ClosetItem } from '../../context/ClosetContext';
import type { GarmentVisualProps, GarmentTemplateType, GarmentPattern } from './character.types';
import { resolveColorToHex } from './character.palette';

/**
 * Infers the best parametric template type for a given closet item.
 */
export function inferGarmentTemplate(item: ClosetItem): { templateType: GarmentTemplateType; isFallback: boolean } {
  const text = `${item.name || ''} ${item.category || ''} ${((item as any).tags || []).join(' ')} ${(item as any).subCategory || ''}`.toLowerCase();

  // 1. Saree (traditional draped luxury)
  if (text.includes('saree') || text.includes('sari')) {
    return { templateType: 'saree', isFallback: false };
  }

  // 2. Kurta / Sherwani
  if (text.includes('kurta') || text.includes('kurti') || text.includes('sherwani') || text.includes('tunic')) {
    return { templateType: 'kurta', isFallback: false };
  }

  // 3. Hoodie / Sweater / Knitwear
  if (text.includes('hoodie') || text.includes('sweater') || text.includes('sweatshirt') || text.includes('cardigan') || text.includes('pullover')) {
    return { templateType: 'hoodie_sweater', isFallback: false };
  }

  // 4. Blazer / Jacket / Outerwear
  if (text.includes('blazer') || text.includes('suit jacket') || text.includes('tuxedo') || text.includes('jacket') || text.includes('coat') || item.category === 'outerwear') {
    return { templateType: 'jacket_blazer', isFallback: false };
  }

  // 5. Dress / One-piece
  if (text.includes('dress') || text.includes('gown') || text.includes('frock') || text.includes('jumpsuit') || text.includes('romper') || (item.category as string) === 'onePiece') {
    return { templateType: 'dress', isFallback: false };
  }

  // 6. Skirt
  if (text.includes('skirt') || text.includes('lehenga')) {
    return { templateType: 'skirt', isFallback: false };
  }

  // 7. Shorts
  if (text.includes('short') || text.includes('bermuda') || text.includes('swim trunk')) {
    return { templateType: 'shorts', isFallback: false };
  }

  // 8. Jeans & Trousers
  if (
    item.category === 'bottoms' ||
    text.includes('jean') ||
    text.includes('trouser') ||
    text.includes('pant') ||
    text.includes('chino') ||
    text.includes('cargo') ||
    text.includes('jogger') ||
    text.includes('slack')
  ) {
    return { templateType: 'jeans_trousers', isFallback: false };
  }

  // 9. Footwear types
  if (item.category === 'footwear' || (item.category as string) === 'shoes') {
    if (text.includes('sneaker') || text.includes('trainer') || text.includes('running') || text.includes('sport') || text.includes('tennis') || text.includes('air max')) {
      return { templateType: 'sneakers', isFallback: false };
    }
    if (text.includes('sandal') || text.includes('slipper') || text.includes('slide') || text.includes('flip') || text.includes('mule') || text.includes('chappal')) {
      return { templateType: 'sandals_slippers', isFallback: false };
    }
    return { templateType: 'formal_shoes', isFallback: false };
  }

  // 10. Accessories
  if (item.category === 'accessories' || text.includes('watch') || text.includes('bag') || text.includes('glass') || text.includes('tote')) {
    return { templateType: 'accessories', isFallback: false };
  }

  // 11. Tee vs Button-down Shirt
  if (text.includes('tee') || text.includes('t-shirt') || text.includes('tshirt') || text.includes('polo') || text.includes('tank')) {
    return { templateType: 'tee', isFallback: false };
  }

  if (text.includes('shirt') || text.includes('oxford') || text.includes('blouse') || text.includes('button')) {
    return { templateType: 'shirt', isFallback: false };
  }

  // Fallback defaults based on category
  if (item.category === 'tops') {
    return { templateType: 'tee', isFallback: false };
  }

  return { templateType: 'generic', isFallback: true };
}

/**
 * Infers the pattern (solid, stripe, check, floral, print)
 */
export function inferGarmentPattern(item: ClosetItem): GarmentPattern {
  const text = `${item.name || ''} ${((item as any).tags || []).join(' ')} ${(item as any).pattern || ''}`.toLowerCase();

  if (text.includes('stripe') || text.includes('striped') || text.includes('lining')) {
    return 'stripe';
  }
  if (text.includes('check') || text.includes('plaid') || text.includes('tartan') || text.includes('gingham') || text.includes('houndstooth')) {
    return 'check';
  }
  if (text.includes('floral') || text.includes('flower') || text.includes('botanical') || text.includes('paisley')) {
    return 'floral';
  }
  if (text.includes('print') || text.includes('graphic') || text.includes('pattern') || text.includes('abstract')) {
    return 'print';
  }

  return 'solid';
}

/**
 * Converts a ClosetItem into complete GarmentVisualProps for rendering.
 */
export function mapClosetItemToVisualProps(item?: ClosetItem | null): GarmentVisualProps | null {
  if (!item) return null;

  const { templateType, isFallback } = inferGarmentTemplate(item);
  const pattern = inferGarmentPattern(item);
  const primaryColor = resolveColorToHex(item.color || item.name || '#D4AF37');

  let secondaryColor = '#FFFFFF';
  const colorsArray = (item as any).colors;
  if (colorsArray && colorsArray.length > 1) {
    secondaryColor = resolveColorToHex(colorsArray[1]);
  } else if (pattern === 'check' || pattern === 'stripe') {
    secondaryColor = '#1F2937';
  }

  const sleeve = (item.name || '').toLowerCase().includes('short') ? 'short' : 'long';
  const neckline = (item.name || '').toLowerCase().includes('v-neck') ? 'v' : 'crew';

  return {
    itemId: item.id || (item as any)._id,
    name: item.name || 'Garment Piece',
    category: item.category || 'tops',
    templateType,
    primaryColor,
    secondaryColor,
    pattern,
    sleeve,
    neckline,
    printTextureUrl: item.imageUrl,
    isFallback,
  };
}
