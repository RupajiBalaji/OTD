import type {
  SkinToneDefinition,
  HairstyleDefinition,
  HairColorDefinition,
} from './character.types';

export const SKIN_TONES: SkinToneDefinition[] = [
  {
    id: 'porcelain',
    name: 'Fair Porcelain',
    hex: '#FDF0E6',
    shadowHex: '#ECD3C2',
    highlightHex: '#FFFFFF',
  },
  {
    id: 'sand',
    name: 'Warm Sand',
    hex: '#F4E0CE',
    shadowHex: '#DFC4AE',
    highlightHex: '#FFF8F2',
  },
  {
    id: 'peach',
    name: 'Honey Peach',
    hex: '#EBC4A7',
    shadowHex: '#D2A584',
    highlightHex: '#FAEDE3',
  },
  {
    id: 'olive',
    name: 'Golden Olive',
    hex: '#DEB384',
    shadowHex: '#C59562',
    highlightHex: '#F3DEC7',
  },
  {
    id: 'amber',
    name: 'Warm Amber',
    hex: '#C68752',
    shadowHex: '#A96B36',
    highlightHex: '#E2AB7E',
  },
  {
    id: 'caramel',
    name: 'Rich Caramel',
    hex: '#A5653E',
    shadowHex: '#884D28',
    highlightHex: '#C38259',
  },
  {
    id: 'espresso',
    name: 'Deep Espresso',
    hex: '#744633',
    shadowHex: '#583020',
    highlightHex: '#935F48',
  },
  {
    id: 'obsidian',
    name: 'Ebony Obsidian',
    hex: '#472B20',
    shadowHex: '#301A12',
    highlightHex: '#643F31',
  },
];

export const HAIRSTYLES: HairstyleDefinition[] = [
  {
    id: 'short_fade',
    name: 'Textured Fade & Taper',
    category: 'short',
    description: 'Clean modern side fade with soft textured volume on top',
  },
  {
    id: 'short_pixie',
    name: 'Atelier French Pixie',
    category: 'short',
    description: 'Chic cropped avant-garde pixie with delicate side locks',
  },
  {
    id: 'curly_bob',
    name: 'Sculpted Curly Bob',
    category: 'medium',
    description: 'Springy natural curls with architectural jawline framing',
  },
  {
    id: 'curly_afro',
    name: 'Regal Sculpted Afro',
    category: 'medium',
    description: 'High-density rounded silhouette with micro-curl texture',
  },
  {
    id: 'long_straight',
    name: 'Sleek Silk Tresses',
    category: 'long',
    description: 'Ultra-smooth center-parted hair cascading past shoulders',
  },
  {
    id: 'long_waves',
    name: 'Editorial Studio Waves',
    category: 'long',
    description: 'Glossy Hollywood waves falling gracefully over the collarbones',
  },
  {
    id: 'sleek_bun',
    name: 'Ballerina Topknot',
    category: 'updo',
    description: 'Polished high-fashion top bun showing off cheekbones & jawline',
  },
  {
    id: 'braided_locks',
    name: 'Artisan Micro-Braids',
    category: 'long',
    description: 'Fine dimensional micro-braids draped down the torso',
  },
];

export const HAIR_COLORS: HairColorDefinition[] = [
  {
    id: 'espresso_black',
    name: 'Jet Espresso',
    hex: '#1E1B18',
    highlightHex: '#38322D',
  },
  {
    id: 'dark_chocolate',
    name: 'Dark Chocolate',
    hex: '#38251B',
    highlightHex: '#573D30',
  },
  {
    id: 'chestnut_auburn',
    name: 'Chestnut Auburn',
    hex: '#5E2B1A',
    highlightHex: '#844430',
  },
  {
    id: 'honey_blonde',
    name: 'Honey Caramel Blonde',
    hex: '#C59A5A',
    highlightHex: '#DFC086',
  },
  {
    id: 'platinum_silver',
    name: 'Platinum Silver',
    hex: '#D7D6D2',
    highlightHex: '#F0EFEA',
  },
  {
    id: 'copper_red',
    name: 'Venetian Copper',
    hex: '#98432A',
    highlightHex: '#BC6146',
  },
  {
    id: 'rose_gold',
    name: 'Rose Gold Shimmer',
    hex: '#B87278',
    highlightHex: '#D6949A',
  },
  {
    id: 'midnight_navy',
    name: 'Midnight Indigo',
    hex: '#1E2533',
    highlightHex: '#39465E',
  },
];

/**
 * Resolves color names or hex codes to clean, luxurious sartorial hex values
 */
export function resolveFabricColor(colorStr?: string, defaultHex = '#2C2A29'): string {
  if (!colorStr) return defaultHex;
  const c = colorStr.trim().toLowerCase();

  // If already a valid hex, return it
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c)) return colorStr;

  const colorMap: Record<string, string> = {
    // Whites & Creams
    white: '#FDFCFA',
    ivory: '#FAF6EE',
    cream: '#F4ECE1',
    oatmeal: '#E9E2D5',
    vanilla: '#F7F0E3',
    eggshell: '#F5EFE6',

    // Neutrals & Beiges
    beige: '#D9C8B4',
    sand: '#D5C4AC',
    khaki: '#C4B293',
    tan: '#BA9C76',
    camel: '#B28758',
    taupe: '#96887B',
    nude: '#E3CAB3',

    // Blues
    blue: '#2B4C7E',
    'french blue': '#4672A8',
    'sky blue': '#8EB4D7',
    'baby blue': '#B3D0E8',
    navy: '#1A2942',
    'midnight blue': '#121A2B',
    indigo: '#2E3856',
    denim: '#3D5E85',
    'light blue': '#9EC0DE',
    cyan: '#3EA8B8',
    cobalt: '#1F51A3',

    // Browns & Earth
    brown: '#523B2E',
    espresso: '#34251D',
    chocolate: '#422B1E',
    terracotta: '#A6563F',
    rust: '#99442C',
    cognac: '#8E4823',
    copper: '#A35E38',

    // Greens
    green: '#37573E',
    olive: '#5A6347',
    'sage green': '#8CA086',
    sage: '#93A48C',
    emerald: '#1C5B3E',
    forest: '#1F3C28',
    mint: '#A0D2BB',

    // Blacks & Grays
    black: '#1D1C1B',
    charcoal: '#2D2E30',
    gray: '#6B6C6F',
    grey: '#6B6C6F',
    'slate gray': '#545B66',
    silver: '#C4C6CA',
    monochrome: '#201F1E',

    // Reds, Pinks & Purples
    red: '#8E2825',
    burgundy: '#561E26',
    maroon: '#4A151E',
    wine: '#5C1D2C',
    pink: '#DDAAB4',
    'rose pink': '#D78FA0',
    blush: '#EBC7CD',
    lavender: '#B8A8C8',
    plum: '#4B263D',
    magenta: '#9C276A',
    coral: '#D96E5D',

    // Yellows & Golds
    yellow: '#D8AB44',
    gold: '#C5A059',
    champagne: '#E3CCA2',
    mustard: '#B88628',
    amber: '#C5832B',
  };

  for (const [name, hex] of Object.entries(colorMap)) {
    if (c.includes(name)) return hex;
  }

  return defaultHex;
}

/**
 * Returns a darkened shadow tone for folds and shadows in garments
 */
export function getSkinTone(id?: string): SkinToneDefinition {
  return SKIN_TONES.find((s) => s.id === id) || SKIN_TONES[3]; // default olive
}

export function getHairstyle(id?: string): HairstyleDefinition {
  return HAIRSTYLES.find((h) => h.id === id) || HAIRSTYLES[0]; // default fade
}

export function getHairColor(id?: string): HairColorDefinition {
  return HAIR_COLORS.find((c) => c.id === id) || HAIR_COLORS[0]; // default rich black
}

export function getShadowColor(hex: string, factor = 0.22): string {
  // Simple darkening
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 40;
  const g = parseInt(clean.substring(2, 4), 16) || 40;
  const b = parseInt(clean.substring(4, 6), 16) || 40;

  const dr = Math.max(0, Math.floor(r * (1 - factor)));
  const dg = Math.max(0, Math.floor(g * (1 - factor)));
  const db = Math.max(0, Math.floor(b * (1 - factor)));

  return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
}

export const getShade = getShadowColor;
export const getHighlight = getHighlightColor;
export const resolveColorToHex = resolveFabricColor;

/**
 * Returns a subtle highlight tint for silks, metallics, and satin
 */
export function getHighlightColor(hex: string, factor = 0.25): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 40;
  const g = parseInt(clean.substring(2, 4), 16) || 40;
  const b = parseInt(clean.substring(4, 6), 16) || 40;

  const hr = Math.min(255, Math.floor(r + (255 - r) * factor));
  const hg = Math.min(255, Math.floor(g + (255 - g) * factor));
  const hb = Math.min(255, Math.floor(b + (255 - b) * factor));

  return `#${hr.toString(16).padStart(2, '0')}${hg.toString(16).padStart(2, '0')}${hb.toString(16).padStart(2, '0')}`;
}
