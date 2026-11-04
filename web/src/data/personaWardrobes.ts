import type { ClosetItem, UserProfile } from '../context/ClosetContext';

export type PersonaType = 'women' | 'man' | 'boy' | 'girl';

export interface SetPiece {
  category: string;
  name: string;
  fabric: string;
  color: string;
  hex: string;
  note: string;
}

export interface PersonaMatchingSet {
  id: string;
  title: string;
  theme: string;
  harmonyScore: number;
  formality: string;
  imageUrl: string;
  pieces: SetPiece[];
  palette: { name: string; hex: string }[];
  stylistRationale: string;
  occasions: string[];
}

export interface PersonaMismatchingSet {
  id: string;
  title: string;
  theme: string;
  tensionScore: number;
  formality: string;
  imageUrl: string;
  pieces: SetPiece[];
  palette: { name: string; hex: string }[];
  stylistRationale: string;
  contrastFactor: string;
}

export interface PersonaWardrobe {
  id: PersonaType;
  displayName: string;
  subtitle: string;
  tagline: string;
  modelFaceUrl: string;
  defaultSkinTone: { name: string; hex: string };
  defaultBodyShape: string;
  profile: UserProfile;
  closetItems: ClosetItem[];
  matchingSets: PersonaMatchingSet[];
  mismatchingSets: PersonaMismatchingSet[];
}

export interface DemoAccount {
  id: string;
  email: string;
  name: string;
  persona: PersonaType;
  title: string;
  description: string;
  highlightPieces: string[];
}

export const DEMO_CLIENT_ACCOUNTS: Record<PersonaType, DemoAccount> = {
  women: {
    id: 'demo_user_women',
    email: 'women@otd.com',
    name: 'Sophia Sharma',
    persona: 'women',
    title: 'Women (Sophia)',
    description: 'Haute Atelier: Sarees, Blouses & Celebration Dresses',
    highlightPieces: ['Rose Pink Organza Saree', 'Mauve Ombre Mirror Saree', 'White Cherry Corset Dress'],
  },
  man: {
    id: 'demo_user_man',
    email: 'man@otd.com',
    name: 'Mustafa Khan',
    persona: 'man',
    title: 'Man / Men (Mustafa)',
    description: 'Sartorial Resort & Smart Casual: Botanical Resort Shirts, Oxford Polos & Cargo Pants',
    highlightPieces: ['Light Blue Botanical Resort Shirt', 'Terracotta Daisy Linen Shirt', 'Oxford Button-Down Polo', 'Sand Khaki Utility Cargoes'],
  },
  boy: {
    id: 'demo_user_boy',
    email: 'boy@otd.com',
    name: 'Aarav Patel',
    persona: 'boy',
    title: 'Boy (Aarav)',
    description: 'Youth Prep: Resort Shirts, Oxford Polos & Utility Cargo Pants',
    highlightPieces: ['Light Blue Botanical Resort Shirt', 'Terracotta Daisy Linen Shirt', 'Sand Khaki Cargoes', 'Vintage Denim Jeans'],
  },
  girl: {
    id: 'demo_user_girl',
    email: 'girl@otd.com',
    name: 'Ananya Reddy',
    persona: 'girl',
    title: 'Girl (Ananya)',
    description: 'Festive & Pinterest Couture: Saree Sets, Cherry Corset Dresses & Y2K Heart Jeans',
    highlightPieces: ['White Cherry Corset Dress', 'Ivory Ruched Platform Heels', 'Painted Heart Jeans', 'Rose Pink Organza Saree'],
  },
};

export const PERSONA_WARDROBES: Record<PersonaType, PersonaWardrobe> = {
  // =========================================================================
  // 1. WOMEN: COUTURE SAREES & CELEBRATION DRESSES (USER UPLOADED ONLY)
  // =========================================================================
  women: {
    id: 'women',
    displayName: 'Women',
    subtitle: 'Haute Editorial & Festive Couture',
    tagline: 'Pure organza silks, scalloped mirror borders, and fluid silhouettes.',
    modelFaceUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=85',
    defaultSkinTone: { name: 'Warm Golden Caramel', hex: '#D29C72' },
    defaultBodyShape: 'Hourglass / Couture',
    profile: {
      name: 'Sophia Sharma',
      height: `5'7" (170 cm)`,
      bodyShape: 'Hourglass / Slender Frame',
      stylePersonas: ['Festive Couture', 'Parisian Minimalist', 'Celebration Glamour'],
      preferredFit: 'Fluid Drape / Tailored Waist',
      palettePreferences: ['Rose Pink', 'Dusty Mauve', 'Ivory & Cream', 'Metallic Shimmer'],
      avoidedColors: ['Acid Neon', 'Muddy Rust', 'Loud Fluorescents'],
      dislikedElements: ['Synthetic Polyester', 'Excessive Hardware', 'Stiff Unyielding Fits'],
    },
    closetItems: [
      { id: 'w11', category: 'tops', subType: 'Silk Saree', name: 'Rose Pink Ombre Shimmer Organza Saree Set', brand: 'Raw Mango Atelier', color: 'Rose Pink Ombre & Silver Border', fit: 'Regular', formality: 5, icon: '🥻', imageUrl: '/wardrobe/women/women_rose_pink_saree.png', timesWorn: 3, cost: 1850, material: 'Pure Organza Silk with Metallic Shimmer', season: ['All'] },
      { id: 'w16', category: 'tops', subType: 'Mirror Work Saree', name: 'Mauve & Ivory Ombre Scalloped Mirror Saree Set', brand: 'Arpita Mehta Couture', color: 'Ivory & Dusty Mauve Ombre', fit: 'Regular', formality: 5, icon: '🥻', imageUrl: '/wardrobe/women/women_ombre_mirror_saree.png', timesWorn: 2, cost: 2150, material: 'Pure Silk Georgette & Hand-Embroidered Scalloped Mirror Border', season: ['All'] },
      { id: 'w15', category: 'tops', subType: 'Corset Dress', name: 'White Cherry Embroidered Corset Mini Dress', brand: 'Pinterest Curated / Cider', color: 'Optic White & Scarlet Cherry', fit: 'Regular', formality: 3, icon: '👗', imageUrl: '/wardrobe/girl/girl_cherry_corset_dress.png', timesWorn: 4, cost: 88, material: '100% Breathable Cotton Poplin & Lace-Up Waist', season: ['Spring', 'Summer'] },
      { id: 'w17', category: 'tops', subType: 'Floral Sundress', name: 'Periwinkle Sky Floral Tie-Strap Sundress', brand: 'Pinterest Curated / Reformation Girl', color: 'Periwinkle Powder Blue & White Floral', fit: 'Regular', formality: 3, icon: '👗', imageUrl: '/wardrobe/girl/girl_blue_tie_sundress.png', timesWorn: 6, cost: 110, material: 'Lightweight Crepe Linen with Ribbon Ties', season: ['Spring', 'Summer'] },
      { id: 'w19', category: 'tops', subType: 'Romantic Floral Dress', name: 'Blush Pink Watercolor Rose Bell-Sleeve Mini Dress', brand: 'Pinterest Curated / House of CB', color: 'Blush Rose & Pastel Watercolor Botanical', fit: 'Regular', formality: 3, icon: '👗', imageUrl: '/wardrobe/girl/girl_pink_watercolor_rose_dress.png', timesWorn: 5, cost: 125, material: 'Mulberry Chiffon with Soft Cotton Inner Lining', season: ['Spring', 'Summer', 'Autumn'] },
    ],
    matchingSets: [
      {
        id: 'w_match_1',
        title: 'The Imperial Rose Pink Organza Saree Set',
        theme: 'Heritage Festive Couture',
        harmonyScore: 99.8,
        formality: 'Royal Wedding & Gala',
        imageUrl: '/wardrobe/women/women_rose_pink_saree.png',
        pieces: [
          { category: 'Saree', name: 'Rose Pink Ombre Shimmer Organza Saree', fabric: 'Pure Organza Silk', color: 'Rose Pink Ombre', hex: '#E29578', note: 'Metallic shimmer catches festive chandeliers' }
        ],
        palette: [
          { name: 'Rose Pink', hex: '#E29578' },
          { name: 'Silver Gilt', hex: '#D8D8D8' }
        ],
        stylistRationale: 'Tissue silk organza with metallic shimmer drape creates regal presence.',
        occasions: ['Festive Wedding', 'Sangeet Gala', 'Reception']
      },
      {
        id: 'w_match_2',
        title: 'Mauve & Ivory Ombre Scalloped Mirror Saree Set',
        theme: 'High Couture Evening Gala',
        harmonyScore: 99.6,
        formality: 'Black-Tie Reception',
        imageUrl: '/wardrobe/women/women_ombre_mirror_saree.png',
        pieces: [
          { category: 'Saree', name: 'Mauve & Ivory Ombre Mirror Saree', fabric: 'Pure Silk Georgette', color: 'Ivory & Dusty Mauve', hex: '#936873', note: 'Hand-sewn scalloped mirror work' }
        ],
        palette: [
          { name: 'Ivory White', hex: '#FAF9F6' },
          { name: 'Dusty Mauve', hex: '#936873' }
        ],
        stylistRationale: 'The ombre gradient from ivory to dusty mauve elongates the frame with candlelit reflection.',
        occasions: ['Diwali Gala', 'High-Society Reception', 'Celebration Dinner']
      }
    ],
    mismatchingSets: []
  },

  // =========================================================================
  // 2. MAN: RESORT SHIRTS & SMART TAILORING (USER UPLOADED ONLY - 15 PIECES)
  // =========================================================================
  man: {
    id: 'man',
    displayName: 'Man',
    subtitle: 'Sartorial Resort & Smart Casual Heritage',
    tagline: 'Slub cotton botanical shirts, linen camp collars, heavy Oxford polos, and tailored utility trousers.',
    modelFaceUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85',
    defaultSkinTone: { name: 'Olive Bronze', hex: '#C28854' },
    defaultBodyShape: 'Athletic / V-Taper Broad Shoulders',
    profile: {
      name: 'Mustafa Khan',
      height: `6'1" (185 cm)`,
      bodyShape: 'Athletic / V-Taper Broad Shoulders',
      stylePersonas: ['Resort Leisure', 'Smart Oxford Prep', 'Tailored Minimalist'],
      preferredFit: 'Tailored / Structured drape',
      palettePreferences: ['Denim Sky Blue', 'Sand Khaki', 'Terracotta Rust', 'Ivory Cream', 'Forest Green'],
      avoidedColors: ['Neon Yellow', 'Fluorescent Orange', 'Hot Pink'],
      dislikedElements: ['Skinny Jeans', 'Polyester Blends', 'Heavy Branding'],
    },
    closetItems: [
      { id: 'm13', category: 'tops', subType: 'Resort Shirt', name: 'Light Blue Abstract Botanical Camp Collar Shirt', brand: 'NEXT / Pinterest Curated', color: 'Denim Sky Blue & White', fit: 'Regular', formality: 2, icon: '👕', imageUrl: '/wardrobe/man/man_blue_botanical_shirt.png', timesWorn: 4, cost: 68, material: '100% Breathable Cotton Slub', season: ['Spring', 'Summer'] },
      { id: 'm14', category: 'tops', subType: 'Linen Shirt', name: 'Terracotta Daisy Floral Camp Collar Linen Shirt', brand: 'Pinterest Curated / Italian Riviera', color: 'Terracotta Rust & White Daisy', fit: 'Regular', formality: 2, icon: '👕', imageUrl: '/wardrobe/man/man_terracotta_daisy_shirt.png', timesWorn: 6, cost: 85, material: 'Washed Pure Linen with Wood Buttons', season: ['Spring', 'Summer'] },
      { id: 'm15', category: 'tops', subType: 'Floral Shirt', name: 'White & Steel-Blue Oversized Floral Resort Shirt', brand: 'BECHARIEL / Pinterest Curated', color: 'Optic White & Slate Blue', fit: 'Regular', formality: 2, icon: '👕', imageUrl: '/wardrobe/man/man_white_blue_floral_shirt.png', timesWorn: 3, cost: 89, material: 'Silky Touch Poplin Cotton', season: ['Spring', 'Summer'] },
      { id: 'm16', category: 'tops', subType: 'Jacquard Shirt', name: 'Forest Green Japanese Crane & Wave Embroidered Shirt', brand: 'Pinterest Curated / Eastern Heritage', color: 'Deep Forest Green & Ivory', fit: 'Relaxed / Tailored', formality: 3, icon: '👕', imageUrl: '/wardrobe/man/man_crane_wave_jacquard_shirt.png', timesWorn: 2, cost: 120, material: 'Textured Jacquard with Silk-Embroidered Cranes', season: ['All'] },
      { id: 'm17', category: 'tops', subType: 'Graphic Shirt', name: 'Navy Blue Calligraphy Swirl Graphic Button-Down Shirt', brand: 'Nautilus / Pinterest Curated', color: 'Deep Regatta Navy & Cream Swirl', fit: 'Regular', formality: 2, icon: '👕', imageUrl: '/wardrobe/man/man_navy_swirl_shirt.png', timesWorn: 5, cost: 75, material: '100% Smooth Cotton Poplin', season: ['All'] },
      { id: 'm18', category: 'tops', subType: 'Oxford Shirt', name: 'Classic Pure White Oxford Button-Down Polo Shirt', brand: 'Ralph Lauren Men', color: 'Pure Optical White', fit: 'Regular', formality: 3, icon: '👔', imageUrl: '/wardrobe/man/man_oxford_white_polo.png', timesWorn: 14, cost: 115, material: '100% Heavy Oxford Cotton with Navy Pony', season: ['All'] },
      { id: 'm19', category: 'tops', subType: 'Oxford Shirt', name: 'Olive Sage Green Oxford Button-Down Polo Shirt', brand: 'Ralph Lauren Men', color: 'Olive Sage Green', fit: 'Regular', formality: 3, icon: '👔', imageUrl: '/wardrobe/man/man_oxford_olive_polo.png', timesWorn: 8, cost: 115, material: '100% Heavy Oxford Cotton with White Pony', season: ['All'] },
      { id: 'm20', category: 'tops', subType: 'Oxford Shirt', name: 'Jet Black Oxford Button-Down Polo Shirt', brand: 'Ralph Lauren Men', color: 'Jet Black Noir', fit: 'Regular', formality: 3, icon: '👔', imageUrl: '/wardrobe/man/man_oxford_black_polo.png', timesWorn: 11, cost: 115, material: '100% Heavy Oxford Cotton with White Pony', season: ['All'] },
      { id: 'm21', category: 'tops', subType: 'Oxford Shirt', name: 'Sky Blue Oxford Button-Down Polo Shirt', brand: 'Ralph Lauren Men', color: 'Classic Oxford Sky Blue', fit: 'Regular', formality: 3, icon: '👔', imageUrl: '/wardrobe/man/man_oxford_skyblue_polo.png', timesWorn: 16, cost: 115, material: '100% Heavy Oxford Cotton with Navy Pony', season: ['All'] },
      { id: 'm22', category: 'tops', subType: 'Linen Shirt', name: 'Dusty Lavender Lilac Linen-Cotton Button-Down Shirt', brand: 'VASTRADO / Pinterest Curated', color: 'Dusty Lavender Lilac', fit: 'Regular', formality: 2, icon: '👕', imageUrl: '/wardrobe/man/man_linen_lavender_shirt.png', timesWorn: 7, cost: 95, material: 'Washed Linen-Cotton Slub with Chest Pocket', season: ['Spring', 'Summer'] },
      { id: 'm23', category: 'bottoms', subType: 'Cargo Pants', name: 'Sand Khaki Multi-Pocket Utility Cargo Pants', brand: 'Pinterest Curated / Workwear Luxury', color: 'Sand Khaki & Tortoise Buttons', fit: 'Regular', formality: 2, icon: '👖', imageUrl: '/wardrobe/man/man_cargo_khaki_pants.png', timesWorn: 9, cost: 110, material: 'Reinforced Cotton Twill with Flap Cargo Pockets', season: ['All'] },
      { id: 'm24', category: 'bottoms', subType: 'Denim Pants', name: 'Light Wash Straight-Leg Denim Jeans', brand: 'Pinterest Curated / Levi Vintage', color: 'Light Bleached Sky Blue', fit: 'Regular', formality: 1, icon: '👖', imageUrl: '/wardrobe/man/man_lightwash_denim_jeans.png', timesWorn: 20, cost: 98, material: '100% Pure Cotton Ring-Spun Denim', season: ['All'] },
      { id: 'm25', category: 'bottoms', subType: 'Dress Trousers', name: 'Jet Black Tailored Dress Trousers', brand: 'Pinterest Curated / Savile Row Bespoke', color: 'Jet Black Noir', fit: 'Regular', formality: 4, icon: '👖', imageUrl: '/wardrobe/man/man_tailored_black_trousers.png', timesWorn: 12, cost: 160, material: 'Crease-Resistant Poly-Viscose Wool Blend', season: ['All'] },
      { id: 'm26', category: 'bottoms', subType: 'Pleated Trousers', name: 'Ivory Cream Pleated Gurkha Dress Trousers', brand: 'Pinterest Curated / Savile Row Sartorial', color: 'Warm Ivory Cream', fit: 'Relaxed / Tailored', formality: 4, icon: '👖', imageUrl: '/wardrobe/man/man_pleated_ivory_trousers.png', timesWorn: 6, cost: 185, material: 'Extended Tab Waistband with Double Forward Pleats', season: ['Spring', 'Summer', 'Autumn'] },
      { id: 'm27', category: 'bottoms', subType: 'Dress Trousers', name: 'Mocha Camel Brown Tailored Dress Trousers', brand: 'Pinterest Curated / Milan Tailoring', color: 'Mocha Camel Brown', fit: 'Regular', formality: 3, icon: '👖', imageUrl: '/wardrobe/man/man_mocha_brown_trousers.png', timesWorn: 10, cost: 155, material: 'Fine Italian Gabardine with Sharp Center Crease', season: ['All'] },
      { id: 'm28', category: 'footwear', subType: 'Slides', name: 'White Classic Crocs Slides / Slip-Ons', brand: 'Crocs', color: 'Optic White & Black', fit: 'Relaxed / Tailored', formality: 1, icon: '🩴', imageUrl: '/wardrobe/man/man_white_crocs_slides.png', timesWorn: 8, cost: 45, material: 'Croslite Foam with Ventilation Ports & Dual Density Footbed', season: ['Spring', 'Summer', 'All'] },
      { id: 'm29', category: 'footwear', subType: 'Slides', name: 'Black & White Adidas Adilette Stripe Slides', brand: 'Adidas Originals', color: 'Core Black & Cloud White', fit: 'Regular', formality: 1, icon: '🩴', imageUrl: '/wardrobe/man/man_adidas_stripe_slides.png', timesWorn: 12, cost: 50, material: 'Contoured Cloudfoam Footbed with Synthetic Bandage Upper', season: ['Spring', 'Summer', 'All'] },
      { id: 'm30', category: 'footwear', subType: 'Sneakers', name: 'Futuristic White & Black Chunky Trainers', brand: 'Fashion Tech / Streetwear Lab', color: 'Pure White & Graphic Black', fit: 'Regular', formality: 2, icon: '👟', imageUrl: '/wardrobe/man/man_white_chunky_sneakers.png', timesWorn: 15, cost: 120, material: 'Breathable Mesh, TPU Overlays & Sculpted Shock-Absorbing Midsole', season: ['All'] },
      { id: 'm31', category: 'footwear', subType: 'Sneakers', name: 'All-Black Cyber Tech Chunky Sneakers', brand: 'Fashion Tech / Cyber Street', color: 'Triple Black with Metallic Gold Accents', fit: 'Regular', formality: 2, icon: '👟', imageUrl: '/wardrobe/man/man_black_cyber_sneakers.png', timesWorn: 10, cost: 135, material: 'Matte Synthetic Armor, Bubble Air Cushion & Rugged Grip Lug Sole', season: ['All'] },
      { id: 'm32', category: 'footwear', subType: 'Boots', name: 'Polished Black Leather Chelsea Boots', brand: 'Heritage Atelier / Savile Row', color: 'Lustrous Jet Black', fit: 'Relaxed / Tailored', formality: 4, icon: '👞', imageUrl: '/wardrobe/man/man_black_chelsea_boots.png', timesWorn: 6, cost: 195, material: 'Full-Grain Calfskin Leather with Elastic Side Gussets & Stacked Heel', season: ['All'] },
    ],
    matchingSets: [
      {
        id: 'm_match_1',
        title: 'Coastal Resort Botanical & Utility Cargoes',
        theme: 'Coastal Resort Leisure',
        harmonyScore: 99.4,
        formality: 'Smart Casual / Beach Holiday',
        imageUrl: '/wardrobe/man/man_blue_botanical_shirt.png',
        pieces: [
          { category: 'Shirt', name: 'Light Blue Botanical Camp Collar Shirt', fabric: 'Slub Cotton', color: 'Denim Sky Blue & White', hex: '#6BA4B8', note: 'Breathable slub cotton with camp collar' },
          { category: 'Pants', name: 'Sand Khaki Utility Cargo Pants', fabric: 'Cotton Twill', color: 'Sand Khaki', hex: '#D2B48C', note: 'Reinforced utility flap pockets' }
        ],
        palette: [
          { name: 'Sky Blue', hex: '#6BA4B8' },
          { name: 'Sand Khaki', hex: '#D2B48C' },
          { name: 'Pure White', hex: '#FFFFFF' }
        ],
        stylistRationale: 'Sky blue botanical print balances effortlessly with sand khaki utility cargo trousers.',
        occasions: ['Beach Resort', 'Weekend Brunch', 'Summer Promenade']
      },
      {
        id: 'm_match_2',
        title: 'Classic White Oxford Polo & Ivory Gurkha Tailoring',
        theme: 'Heritage Smart Casual',
        harmonyScore: 99.2,
        formality: 'Smart Casual / Outing',
        imageUrl: '/wardrobe/man/man_oxford_white_polo.png',
        pieces: [
          { category: 'Shirt', name: 'Classic Pure White Oxford Button-Down Polo', fabric: 'Heavy Oxford Cotton', color: 'Pure White', hex: '#FFFFFF', note: 'Navy pony logo accent' },
          { category: 'Trousers', name: 'Ivory Cream Pleated Gurkha Dress Trousers', fabric: 'Tailored Twill', color: 'Ivory Cream', hex: '#FDFBF7', note: 'Forward pleats with extended tab waistband' }
        ],
        palette: [
          { name: 'Pure White', hex: '#FFFFFF' },
          { name: 'Ivory Cream', hex: '#FDFBF7' }
        ],
        stylistRationale: 'Monochromatic white and ivory pairing creates clean, confident quiet luxury.',
        occasions: ['Birthday Celebration', 'Daytime Outing', 'High Tea']
      }
    ],
    mismatchingSets: []
  },

  // =========================================================================
  // 3. BOY: RESORT SHIRTS & SMART CASUAL (USER UPLOADED ONLY - 15 PIECES)
  // =========================================================================
  boy: {
    id: 'boy',
    displayName: 'Boy',
    subtitle: 'Classic Prep & Coastal Resort',
    tagline: 'Resort camp collar shirts, Oxford polo button-downs, utility cargoes, and vintage denim.',
    modelFaceUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=85',
    defaultSkinTone: { name: 'Medium Warm Honey', hex: '#D4A373' },
    defaultBodyShape: 'Athletic / Lean Youth',
    profile: {
      name: 'Aarav Patel',
      height: `4'8" (142 cm)`,
      bodyShape: 'Youthful / Athletic',
      stylePersonas: ['Resort Casual', 'Prep Academy', 'Smart Outing'],
      preferredFit: 'Regular Comfort / Tailored',
      palettePreferences: ['Sky Blue', 'Sand Khaki', 'Terracotta Rust', 'Classic White'],
      avoidedColors: ['Muddy Grey', 'Loud Neons', 'Drab Olive'],
      dislikedElements: ['Scratchy Synthetics', 'Skinny Fits', 'Overly Tight Collars'],
    },
    closetItems: [
      { id: 'b13', category: 'tops', subType: 'Resort Shirt', name: 'Light Blue Abstract Botanical Camp Collar Shirt', brand: 'NEXT / Pinterest Curated', color: 'Denim Sky Blue & White', fit: 'Regular', formality: 2, icon: '👕', imageUrl: '/wardrobe/boy/boy_blue_botanical_shirt.png', timesWorn: 4, cost: 48, material: '100% Breathable Cotton Slub', season: ['Spring', 'Summer'] },
      { id: 'b14', category: 'tops', subType: 'Linen Shirt', name: 'Terracotta Daisy Floral Camp Collar Linen Shirt', brand: 'Pinterest Curated / Zara Kids', color: 'Terracotta Rust & White Daisy', fit: 'Regular', formality: 2, icon: '👕', imageUrl: '/wardrobe/boy/boy_terracotta_daisy_shirt.png', timesWorn: 6, cost: 52, material: 'Washed Linen-Cotton Blend with Wood Buttons', season: ['Spring', 'Summer'] },
      { id: 'b15', category: 'tops', subType: 'Floral Shirt', name: 'White & Steel-Blue Oversized Floral Resort Shirt', brand: 'BECHARIEL / Pinterest Curated', color: 'Optic White & Slate Blue', fit: 'Regular', formality: 2, icon: '👕', imageUrl: '/wardrobe/boy/boy_white_blue_floral_shirt.png', timesWorn: 3, cost: 55, material: 'Silky Touch Poplin Cotton', season: ['Spring', 'Summer'] },
      { id: 'b16', category: 'tops', subType: 'Jacquard Shirt', name: 'Forest Green Japanese Crane & Wave Embroidered Shirt', brand: 'Pinterest Curated / Eastern Heritage', color: 'Deep Forest Green & Ivory', fit: 'Relaxed / Tailored', formality: 3, icon: '👕', imageUrl: '/wardrobe/boy/boy_crane_wave_jacquard_shirt.png', timesWorn: 2, cost: 78, material: 'Textured Jacquard with Silk-Embroidered Cranes', season: ['All'] },
      { id: 'b17', category: 'tops', subType: 'Graphic Shirt', name: 'Navy Blue Calligraphy Swirl Graphic Button-Down Shirt', brand: 'Nautilus / Pinterest Curated', color: 'Deep Regatta Navy & Cream Swirl', fit: 'Regular', formality: 2, icon: '👕', imageUrl: '/wardrobe/boy/boy_navy_swirl_shirt.png', timesWorn: 5, cost: 46, material: '100% Smooth Cotton Poplin', season: ['All'] },
      { id: 'b18', category: 'tops', subType: 'Oxford Shirt', name: 'Classic Pure White Oxford Button-Down Polo Shirt', brand: 'Ralph Lauren Boys', color: 'Pure Optical White', fit: 'Regular', formality: 3, icon: '👔', imageUrl: '/wardrobe/boy/boy_oxford_white_polo.png', timesWorn: 8, cost: 65, material: '100% Heavy Oxford Cotton with Navy Pony', season: ['All'] },
      { id: 'b19', category: 'tops', subType: 'Oxford Shirt', name: 'Olive Sage Green Oxford Button-Down Polo Shirt', brand: 'Ralph Lauren Boys', color: 'Olive Sage Green', fit: 'Regular', formality: 3, icon: '👔', imageUrl: '/wardrobe/boy/boy_oxford_olive_polo.png', timesWorn: 5, cost: 65, material: '100% Heavy Oxford Cotton with White Pony', season: ['All'] },
      { id: 'b20', category: 'tops', subType: 'Oxford Shirt', name: 'Jet Black Oxford Button-Down Polo Shirt', brand: 'Ralph Lauren Boys', color: 'Jet Black Noir', fit: 'Regular', formality: 3, icon: '👔', imageUrl: '/wardrobe/boy/boy_oxford_black_polo.png', timesWorn: 7, cost: 65, material: '100% Heavy Oxford Cotton with White Pony', season: ['All'] },
      { id: 'b21', category: 'tops', subType: 'Oxford Shirt', name: 'Sky Blue Oxford Button-Down Polo Shirt', brand: 'Ralph Lauren Boys', color: 'Classic Oxford Sky Blue', fit: 'Regular', formality: 3, icon: '👔', imageUrl: '/wardrobe/boy/boy_oxford_skyblue_polo.png', timesWorn: 9, cost: 65, material: '100% Heavy Oxford Cotton with Navy Pony', season: ['All'] },
      { id: 'b22', category: 'tops', subType: 'Linen Shirt', name: 'Dusty Lavender Lilac Linen-Cotton Button-Down Shirt', brand: 'VASTRADO / Pinterest Curated', color: 'Dusty Lavender Lilac', fit: 'Regular', formality: 2, icon: '👕', imageUrl: '/wardrobe/boy/boy_linen_lavender_shirt.png', timesWorn: 4, cost: 58, material: 'Washed Linen-Cotton Slub with Chest Pocket', season: ['Spring', 'Summer'] },
      { id: 'b23', category: 'bottoms', subType: 'Cargo Pants', name: 'Sand Khaki Multi-Pocket Utility Cargo Pants', brand: 'Pinterest Curated / Workwear Kids', color: 'Sand Khaki & Tortoise Buttons', fit: 'Regular', formality: 2, icon: '👖', imageUrl: '/wardrobe/boy/boy_cargo_khaki_pants.png', timesWorn: 8, cost: 54, material: 'Reinforced Cotton Twill with Flap Cargo Pockets', season: ['All'] },
      { id: 'b24', category: 'bottoms', subType: 'Denim Pants', name: 'Light Wash Straight-Leg Denim Jeans', brand: 'Pinterest Curated / Levi Heritage', color: 'Light Bleached Sky Blue', fit: 'Regular', formality: 1, icon: '👖', imageUrl: '/wardrobe/boy/boy_lightwash_denim_jeans.png', timesWorn: 14, cost: 58, material: '100% Pure Cotton Ring-Spun Denim', season: ['All'] },
      { id: 'b25', category: 'bottoms', subType: 'Dress Trousers', name: 'Jet Black Tailored Dress Trousers', brand: 'Pinterest Curated / Sartorial Kids', color: 'Jet Black Noir', fit: 'Regular', formality: 4, icon: '👖', imageUrl: '/wardrobe/boy/boy_tailored_black_trousers.png', timesWorn: 5, cost: 62, material: 'Crease-Resistant Poly-Viscose Wool Blend', season: ['All'] },
      { id: 'b26', category: 'bottoms', subType: 'Pleated Trousers', name: 'Ivory Cream Pleated Gurkha Dress Trousers', brand: 'Pinterest Curated / Savile Row Junior', color: 'Warm Ivory Cream', fit: 'Relaxed / Tailored', formality: 4, icon: '👖', imageUrl: '/wardrobe/boy/boy_pleated_ivory_trousers.png', timesWorn: 3, cost: 68, material: 'Extended Tab Waistband with Double Forward Pleats', season: ['Spring', 'Summer', 'Autumn'] },
      { id: 'b27', category: 'bottoms', subType: 'Dress Trousers', name: 'Mocha Camel Brown Tailored Dress Trousers', brand: 'Pinterest Curated / Tailored Prep', color: 'Mocha Camel Brown', fit: 'Regular', formality: 3, icon: '👖', imageUrl: '/wardrobe/boy/boy_mocha_brown_trousers.png', timesWorn: 6, cost: 64, material: 'Fine Italian Gabardine with Sharp Center Crease', season: ['All'] },
      { id: 'b28', category: 'footwear', subType: 'Slides', name: 'White Classic Crocs Slides / Slip-Ons', brand: 'Crocs Kids', color: 'Optic White & Black', fit: 'Relaxed / Tailored', formality: 1, icon: '🩴', imageUrl: '/wardrobe/boy/boy_white_crocs_slides.png', timesWorn: 8, cost: 35, material: 'Croslite Foam with Ventilation Ports & Dual Density Footbed', season: ['Spring', 'Summer', 'All'] },
      { id: 'b29', category: 'footwear', subType: 'Slides', name: 'Black & White Adidas Adilette Stripe Slides', brand: 'Adidas Originals Junior', color: 'Core Black & Cloud White', fit: 'Regular', formality: 1, icon: '🩴', imageUrl: '/wardrobe/boy/boy_adidas_stripe_slides.png', timesWorn: 12, cost: 40, material: 'Contoured Cloudfoam Footbed with Synthetic Bandage Upper', season: ['Spring', 'Summer', 'All'] },
      { id: 'b30', category: 'footwear', subType: 'Sneakers', name: 'Futuristic White & Black Chunky Trainers', brand: 'Fashion Tech / Youth Streetwear', color: 'Pure White & Graphic Black', fit: 'Regular', formality: 2, icon: '👟', imageUrl: '/wardrobe/boy/boy_white_chunky_sneakers.png', timesWorn: 15, cost: 85, material: 'Breathable Mesh, TPU Overlays & Sculpted Shock-Absorbing Midsole', season: ['All'] },
      { id: 'b31', category: 'footwear', subType: 'Sneakers', name: 'All-Black Cyber Tech Chunky Sneakers', brand: 'Fashion Tech / Cyber Youth', color: 'Triple Black with Metallic Gold Accents', fit: 'Regular', formality: 2, icon: '👟', imageUrl: '/wardrobe/boy/boy_black_cyber_sneakers.png', timesWorn: 10, cost: 95, material: 'Matte Synthetic Armor, Bubble Air Cushion & Rugged Grip Lug Sole', season: ['All'] },
      { id: 'b32', category: 'footwear', subType: 'Boots', name: 'Polished Black Leather Chelsea Boots', brand: 'Heritage Atelier / Savile Row Junior', color: 'Lustrous Jet Black', fit: 'Relaxed / Tailored', formality: 4, icon: '👞', imageUrl: '/wardrobe/boy/boy_black_chelsea_boots.png', timesWorn: 6, cost: 110, material: 'Full-Grain Calfskin Leather with Elastic Side Gussets & Stacked Heel', season: ['All'] },
    ],
    matchingSets: [
      {
        id: 'b_match_1',
        title: 'Seaside Resort Botanical & Khaki Cargoes',
        theme: 'Coastal Resort Youth',
        harmonyScore: 99.2,
        formality: 'Smart Casual / Holiday',
        imageUrl: '/wardrobe/boy/boy_blue_botanical_shirt.png',
        pieces: [
          { category: 'Shirt', name: 'Light Blue Botanical Camp Collar Shirt', fabric: 'Slub Cotton', color: 'Denim Sky Blue & White', hex: '#6BA4B8', note: 'Breathable slub cotton with camp collar' },
          { category: 'Pants', name: 'Sand Khaki Utility Cargo Pants', fabric: 'Cotton Twill', color: 'Sand Khaki', hex: '#D2B48C', note: 'Reinforced utility flap pockets' }
        ],
        palette: [
          { name: 'Sky Blue', hex: '#6BA4B8' },
          { name: 'Sand Khaki', hex: '#D2B48C' }
        ],
        stylistRationale: 'Relaxed slub cotton resort shirt paired with durable khaki utility cargo trousers.',
        occasions: ['Beach Resort', 'Weekend Outing', 'Summer Picnic']
      },
      {
        id: 'b_match_2',
        title: 'Classic White Oxford Polo & Vintage Denim',
        theme: 'Clean Youth Prep',
        harmonyScore: 98.8,
        formality: 'Smart Casual',
        imageUrl: '/wardrobe/boy/boy_oxford_white_polo.png',
        pieces: [
          { category: 'Shirt', name: 'Pure White Oxford Button-Down Polo', fabric: 'Heavy Oxford Cotton', color: 'Pure White', hex: '#FFFFFF', note: 'Navy pony logo' },
          { category: 'Jeans', name: 'Light Wash Straight-Leg Denim Jeans', fabric: 'Pure Cotton Denim', color: 'Bleached Indigo', hex: '#779ECB', note: 'Relaxed straight leg' }
        ],
        palette: [
          { name: 'Pure White', hex: '#FFFFFF' },
          { name: 'Bleached Indigo', hex: '#779ECB' }
        ],
        stylistRationale: 'Crisp white Oxford cotton with casual vintage wash denim.',
        occasions: ['Birthday Party', 'Casual Outing', 'School Holiday']
      }
    ],
    mismatchingSets: []
  },

  // =========================================================================
  // 4. GIRL: DRESSES, SAREES, JEANS & HEELS (USER UPLOADED ONLY - 11 PIECES)
  // =========================================================================
  girl: {
    id: 'girl',
    displayName: 'Girl',
    subtitle: 'Pinterest Romantic & Festive Couture',
    tagline: 'Cherry corset dresses, organza sarees, watercolor florals, heart denim, and ruched platform heels.',
    modelFaceUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85',
    defaultSkinTone: { name: 'Warm Beige Honey', hex: '#E0B088' },
    defaultBodyShape: 'Slender / Hourglass',
    profile: {
      name: 'Ananya Reddy',
      height: `4'6" (138 cm)`,
      bodyShape: 'Youthful / Slender',
      stylePersonas: ['Pinterest Romantic', 'Festive Celebration', 'Y2K Denim Chic'],
      preferredFit: 'A-Line / Smocked Tiered Fit',
      palettePreferences: ['Optic White & Scarlet', 'Rose Pink Ombre', 'Dusty Mauve', 'Powder Blue'],
      avoidedColors: ['Muddy Brown', 'Acid Green', 'Drab Grey'],
      dislikedElements: ['Scratchy Tulle', 'Heavy Stiff Denim', 'Bulky Hardware'],
    },
    closetItems: [
      { id: 'g15', category: 'tops', subType: 'Corset Dress', name: 'White Cherry Embroidered Corset Mini Dress', brand: 'Pinterest Curated / Cider', color: 'Optic White & Scarlet Cherry', fit: 'Regular', formality: 3, icon: '👗', imageUrl: '/wardrobe/girl/girl_cherry_corset_dress.png', timesWorn: 4, cost: 88, material: '100% Breathable Cotton Poplin & Lace-Up Waist', season: ['Spring', 'Summer'] },
      { id: 'g16', category: 'tops', subType: 'Floral Sundress', name: 'Periwinkle Sky Floral Tie-Strap Sundress', brand: 'Pinterest Curated / Reformation Girl', color: 'Periwinkle Powder Blue & White Floral', fit: 'Regular', formality: 3, icon: '👗', imageUrl: '/wardrobe/girl/girl_blue_tie_sundress.png', timesWorn: 6, cost: 110, material: 'Lightweight Crepe Linen with Ribbon Ties', season: ['Spring', 'Summer'] },
      { id: 'g17', category: 'tops', subType: 'Organza Saree', name: 'Rose Pink Ombre Shimmer Organza Saree Set', brand: 'Pinterest Curated / Manish Malhotra Teen', color: 'Rose Pink Ombre & Silver Shimmer Border', fit: 'Relaxed / Tailored', formality: 5, icon: '🥻', imageUrl: '/wardrobe/girl/girl_rose_pink_saree.png', timesWorn: 2, cost: 240, material: 'Tissue Silk Organza with Shimmer Border & Blouse', season: ['All'] },
      { id: 'g18', category: 'tops', subType: 'Mirror Work Saree', name: 'Ivory & Dusty Mauve Ombre Mirror-Work Saree', brand: 'Pinterest Curated / Arpita Mehta Kids', color: 'Ivory & Mauve Ombre with Scalloped Border', fit: 'Relaxed / Tailored', formality: 5, icon: '🥻', imageUrl: '/wardrobe/girl/girl_ombre_mirror_saree.png', timesWorn: 3, cost: 280, material: 'Pure Silk Georgette with Scalloped Mirror Embroidery', season: ['All'] },
      { id: 'g19', category: 'tops', subType: 'Romantic Floral Dress', name: 'Blush Pink Watercolor Rose Bell-Sleeve Mini Dress', brand: 'Pinterest Curated / House of CB', color: 'Blush Rose & Pastel Watercolor Botanical', fit: 'Regular', formality: 3, icon: '👗', imageUrl: '/wardrobe/girl/girl_pink_watercolor_rose_dress.png', timesWorn: 5, cost: 125, material: 'Mulberry Chiffon with Soft Cotton Inner Lining', season: ['Spring', 'Summer', 'Autumn'] },
      { id: 'g20', category: 'bottoms', subType: 'Cargo Jeans', name: 'Y2K Chain & Bow Cut-Out Wide-Leg Cargo Jeans', brand: 'Pinterest Curated / Harajuku Denim', color: 'Washed Sky Blue Denim', fit: 'Relaxed / Tailored', formality: 1, icon: '👖', imageUrl: '/wardrobe/girl/girl_chain_bow_cargo_jeans.png', timesWorn: 8, cost: 78, material: '100% Cotton Denim with Silver Chains & Tie-Bow Accents', season: ['All'] },
      { id: 'g21', category: 'bottoms', subType: 'Denim Pants', name: 'Painted White Heart Motif Wide-Leg Jeans', brand: 'Pinterest Curated / Cider Aesthetic', color: 'Light Acid Wash Blue', fit: 'Relaxed / Tailored', formality: 1, icon: '👖', imageUrl: '/wardrobe/girl/girl_painted_heart_jeans.png', timesWorn: 12, cost: 65, material: 'Soft Brushed Cotton Denim with Hand-Painted Heart Prints', season: ['All'] },
      { id: 'g22', category: 'bottoms', subType: 'Denim Pants', name: 'White Butterfly Print Relaxed Black Jeans', brand: 'Pinterest Curated / Urban Outfitter Kids', color: 'Jet Black & Crisp White', fit: 'Relaxed / Tailored', formality: 1, icon: '👖', imageUrl: '/wardrobe/girl/girl_butterfly_black_jeans.png', timesWorn: 9, cost: 72, material: '100% Heavy Twill Cotton Denim with Butterfly Stencils', season: ['All'] },
      { id: 'g23', category: 'footwear', subType: 'Slide Sandals', name: 'Cream Ribbed Strappy Criss-Cross Slide Sandals', brand: 'Pinterest Curated / Soludos Beachwear', color: 'Warm Cream & Ivory', fit: 'Regular', formality: 1, icon: '👡', imageUrl: '/wardrobe/girl/girl_cream_ribbed_slides.jpg', timesWorn: 14, cost: 68, material: 'Textured Ribbed Knit Straps & Cushioned Ergonomic Footbed', season: ['Spring', 'Summer'] },
      { id: 'g24', category: 'footwear', subType: 'Platform Sandals', name: 'Ivory Ruched Satin Ankle-Strap Platform Block Heels', brand: 'Pinterest Curated / Delsyyou Atelier', color: 'Pearl Ivory & Gilt Buckle', fit: 'Regular', formality: 3, icon: '👠', imageUrl: '/wardrobe/girl/girl_ivory_ruched_platform_heels.png', timesWorn: 5, cost: 95, material: 'Ruched Duchesse Satin Toe Band & Vegan Nappa Leather Ankle Straps with Sturdy Block Heel', season: ['Spring', 'Summer', 'Autumn'] },
      { id: 'g25', category: 'footwear', subType: 'Block Heel Sandals', name: 'Classic Black Suede Ankle-Strap Block Heel Sandals', brand: 'Pinterest Curated / Steve Madden Girl', color: 'Velvety Matte Black & Nude Insole', fit: 'Regular', formality: 4, icon: '👠', imageUrl: '/wardrobe/girl/girl_black_suede_block_heels.png', timesWorn: 7, cost: 110, material: 'Plush Micro-Suede Straps, Cushioned Nude Insoles & Architectural Block Heel', season: ['All'] },
    ],
    matchingSets: [
      {
        id: 'g_match_1',
        title: 'White Cherry Corset Dress & Ruched Platform Heels',
        theme: 'Pinterest Cottagecore Celebration',
        harmonyScore: 99.6,
        formality: 'Party Celebration',
        imageUrl: '/wardrobe/girl/girl_cherry_corset_dress.png',
        pieces: [
          { category: 'Dress', name: 'White Cherry Embroidered Corset Mini Dress', fabric: 'Cotton Poplin', color: 'Optic White & Scarlet Cherry', hex: '#FAF9F6', note: 'Embroidered red cherries' },
          { category: 'Footwear', name: 'Ivory Ruched Satin Ankle-Strap Platform Block Heels', fabric: 'Duchesse Satin', color: 'Pearl Ivory', hex: '#F8F6F0', note: 'Ruched satin toe band' }
        ],
        palette: [
          { name: 'Optic White', hex: '#FAF9F6' },
          { name: 'Scarlet Cherry', hex: '#C41E3A' },
          { name: 'Pearl Ivory', hex: '#F8F6F0' }
        ],
        stylistRationale: 'Structured corset bodice with cherry embroidery paired with ruched satin platform heels.',
        occasions: ['Birthday Party', 'High Tea', 'Garden Party']
      },
      {
        id: 'g_match_2',
        title: 'Painted Heart Denim & Periwinkle Floral Sundress',
        theme: 'Y2K Aesthetic Streetwear',
        harmonyScore: 99.1,
        formality: 'Casual Weekend',
        imageUrl: '/wardrobe/girl/girl_painted_heart_jeans.png',
        pieces: [
          { category: 'Jeans', name: 'Painted White Heart Motif Wide-Leg Jeans', fabric: 'Cotton Denim', color: 'Acid Wash Blue', hex: '#87CEEB', note: 'White brushstroke hearts' }
        ],
        palette: [
          { name: 'Acid Wash', hex: '#87CEEB' },
          { name: 'Heart White', hex: '#FFFFFF' }
        ],
        stylistRationale: 'Viral aesthetic street style with hand-painted heart motifs and relaxed wide-leg drape.',
        occasions: ['Weekend Hangout', 'Creative Workshop', 'Casual Outing']
      },
      {
        id: 'g_match_3',
        title: 'Rose Pink Ombre Shimmer Organza Saree Set',
        theme: 'Heritage Festive Couture',
        harmonyScore: 99.8,
        formality: 'Festive Sangeet & Gala',
        imageUrl: '/wardrobe/girl/girl_rose_pink_saree.png',
        pieces: [
          { category: 'Saree', name: 'Rose Pink Ombre Shimmer Organza Saree', fabric: 'Tissue Silk Organza', color: 'Rose Pink Ombre', hex: '#E29578', note: 'Silver shimmer border' }
        ],
        palette: [
          { name: 'Rose Pink', hex: '#E29578' },
          { name: 'Silver Gilt', hex: '#D8D8D8' }
        ],
        stylistRationale: 'Tissue silk organza saree with silver shimmer border captures festive ambient lighting.',
        occasions: ['Wedding Sangeet', 'Festive Gala', 'Reception']
      }
    ],
    mismatchingSets: []
  }
};
