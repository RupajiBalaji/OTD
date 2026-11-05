import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../src/models/User';
import { Profile } from '../src/models/Profile';
import { Avatar } from '../src/models/Avatar';
import { WardrobeItem } from '../src/models/WardrobeItem';
import { Outfit } from '../src/models/Outfit';
import { PasswordUtil } from '../src/utils/password';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_fashion_otd';

export const DEMO_PERSONAS = [
  {
    key: 'women',
    email: 'women@otd.com',
    name: 'Sophia Sharma',
    password: 'Password123!',
    profile: {
      height: "5'7\" (170 cm)",
      bodyShape: 'Hourglass / Slender Frame',
      skinTone: 'Warm Golden Caramel',
      stylingPath: 'Women' as const,
      stylePersonas: ['Festive Couture', 'Parisian Minimalist', 'Celebration Glamour'],
      preferredFit: 'Fluid Drape / Tailored Waist',
      palettePreferences: ['Rose Pink', 'Dusty Mauve', 'Ivory & Cream', 'Metallic Shimmer'],
      avoidedColors: ['Acid Neon', 'Muddy Rust', 'Loud Fluorescents'],
      dislikedElements: ['Synthetic Polyester', 'Excessive Hardware', 'Stiff Unyielding Fits'],
      goals: ['Haute Couture Styling', 'Festive Drape Precision', 'Sustainable Luxury'],
    },
    avatar: {
      height: '170 cm',
      skinTone: 'Warm Golden Caramel',
      bodyProportions: { shoulderWidth: '40 cm', chest: '88 cm', waist: '66 cm', inseam: '78 cm' },
      pose: 'three_quarter' as const,
      ambientLighting: 'Editorial Studio' as const,
    },
    items: [
      { name: 'Rose Pink Ombre Shimmer Organza Saree Set', category: 'tops' as const, subType: 'Silk Saree', brand: 'Raw Mango Atelier', color: 'Rose Pink Ombre & Silver Border', fabric: 'Pure Organza Silk with Metallic Shimmer', fit: 'Regular' as const, formality: 5 as const, icon: '🥻', imageUrl: '/wardrobe/women/women_rose_pink_saree.png', purchasePrice: 1850, season: 'All Season' },
      { name: 'Mauve & Ivory Ombre Scalloped Mirror Saree Set', category: 'tops' as const, subType: 'Mirror Work Saree', brand: 'Arpita Mehta Couture', color: 'Ivory & Dusty Mauve Ombre', fabric: 'Pure Silk Georgette & Hand-Embroidered Scalloped Mirror Border', fit: 'Regular' as const, formality: 5 as const, icon: '🥻', imageUrl: '/wardrobe/women/women_ombre_mirror_saree.png', purchasePrice: 2150, season: 'All Season' },
      { name: 'White Cherry Embroidered Corset Mini Dress', category: 'tops' as const, subType: 'Corset Dress', brand: 'Pinterest Curated / Cider', color: 'Optic White & Scarlet Cherry', fabric: '100% Breathable Cotton Poplin & Lace-Up Waist', fit: 'Regular' as const, formality: 3 as const, icon: '👗', imageUrl: '/wardrobe/girl/girl_cherry_corset_dress.png', purchasePrice: 88, season: 'Spring/Summer' },
      { name: 'Periwinkle Sky Floral Tie-Strap Sundress', category: 'tops' as const, subType: 'Floral Sundress', brand: 'Pinterest Curated / Reformation Girl', color: 'Periwinkle Powder Blue & White Floral', fabric: 'Lightweight Crepe Linen with Ribbon Ties', fit: 'Regular' as const, formality: 3 as const, icon: '👗', imageUrl: '/wardrobe/girl/girl_blue_tie_sundress.png', purchasePrice: 110, season: 'Spring/Summer' },
      { name: 'Blush Pink Watercolor Rose Bell-Sleeve Mini Dress', category: 'tops' as const, subType: 'Romantic Floral Dress', brand: 'Pinterest Curated / House of CB', color: 'Blush Rose & Pastel Watercolor Botanical', fabric: 'Mulberry Chiffon with Soft Cotton Inner Lining', fit: 'Regular' as const, formality: 3 as const, icon: '👗', imageUrl: '/wardrobe/girl/girl_pink_watercolor_rose_dress.png', purchasePrice: 125, season: 'All Season' },
      { name: 'Ivory Cream Pleated Atelier Trousers', category: 'bottoms' as const, subType: 'Pleated Trousers', brand: 'Savile Row Atelier', color: 'Warm Ivory Cream', fabric: 'Extended Tab Waistband with Double Forward Pleats', fit: 'Regular' as const, formality: 4 as const, icon: '👖', imageUrl: '/wardrobe/man/man_pleated_ivory_trousers.png', purchasePrice: 185, season: 'All Season' },
      { name: 'Minimalist Cream Ribbed Atelier Slides', category: 'footwear' as const, subType: 'Lounge Slides', brand: 'OTD Footwear', color: 'Cream Ivory', fabric: 'Ergonomic Molded Footbed & Ribbed Knit', fit: 'Regular' as const, formality: 2 as const, icon: '🩴', imageUrl: '/wardrobe/girl/girl_cream_ribbed_slides.jpg', purchasePrice: 65, season: 'All Season' },
    ],
  },
  {
    key: 'man',
    email: 'man@otd.com',
    name: 'Mustafa Khan',
    password: 'Password123!',
    profile: {
      height: "6'1\" (185 cm)",
      bodyShape: 'Athletic / V-Taper Broad Shoulders',
      skinTone: 'Olive Bronze',
      stylingPath: 'Men' as const,
      stylePersonas: ['Resort Leisure', 'Smart Oxford Prep', 'Tailored Minimalist'],
      preferredFit: 'Tailored / Structured drape',
      palettePreferences: ['Denim Sky Blue', 'Sand Khaki', 'Terracotta Rust', 'Ivory Cream', 'Forest Green'],
      avoidedColors: ['Neon Yellow', 'Fluorescent Orange', 'Hot Pink'],
      dislikedElements: ['Skinny Jeans', 'Polyester Blends', 'Heavy Branding'],
      goals: ['Executive Presence', 'Sharp Proportions', 'Effortless Curation'],
    },
    avatar: {
      height: '185 cm',
      skinTone: 'Olive Bronze',
      bodyProportions: { shoulderWidth: '48 cm', chest: '104 cm', waist: '82 cm', inseam: '86 cm' },
      pose: 'three_quarter' as const,
      ambientLighting: 'Editorial Studio' as const,
    },
    items: [
      { name: 'Light Blue Abstract Botanical Camp Collar Shirt', category: 'tops' as const, subType: 'Resort Shirt', brand: 'NEXT / Pinterest Curated', color: 'Denim Sky Blue & White', fabric: '100% Breathable Cotton Slub', fit: 'Regular' as const, formality: 2 as const, icon: '👕', imageUrl: '/wardrobe/man/man_blue_botanical_shirt.png', purchasePrice: 68, season: 'Spring/Summer' },
      { name: 'Terracotta Daisy Floral Camp Collar Linen Shirt', category: 'tops' as const, subType: 'Linen Shirt', brand: 'Pinterest Curated / Italian Riviera', color: 'Terracotta Rust & White Daisy', fabric: 'Washed Pure Linen with Wood Buttons', fit: 'Regular' as const, formality: 2 as const, icon: '👕', imageUrl: '/wardrobe/man/man_terracotta_daisy_shirt.png', purchasePrice: 85, season: 'Spring/Summer' },
      { name: 'White & Steel-Blue Oversized Floral Resort Shirt', category: 'tops' as const, subType: 'Floral Shirt', brand: 'BECHARIEL / Pinterest Curated', color: 'Optic White & Slate Blue', fabric: 'Silky Touch Poplin Cotton', fit: 'Regular' as const, formality: 2 as const, icon: '👕', imageUrl: '/wardrobe/man/man_white_blue_floral_shirt.png', purchasePrice: 89, season: 'Spring/Summer' },
      { name: 'Forest Green Japanese Crane & Wave Embroidered Shirt', category: 'tops' as const, subType: 'Jacquard Shirt', brand: 'Pinterest Curated / Eastern Heritage', color: 'Deep Forest Green & Ivory', fabric: 'Textured Jacquard with Silk-Embroidered Cranes', fit: 'Relaxed / Tailored' as const, formality: 3 as const, icon: '👕', imageUrl: '/wardrobe/man/man_crane_wave_jacquard_shirt.png', purchasePrice: 120, season: 'All Season' },
      { name: 'Classic Pure White Oxford Button-Down Polo Shirt', category: 'tops' as const, subType: 'Oxford Shirt', brand: 'Ralph Lauren Men', color: 'Pure Optical White', fabric: '100% Heavy Oxford Cotton with Navy Pony', fit: 'Regular' as const, formality: 3 as const, icon: '👔', imageUrl: '/wardrobe/man/man_oxford_white_polo.png', purchasePrice: 115, season: 'All Season' },
      { name: 'Sand Khaki Multi-Pocket Utility Cargo Pants', category: 'bottoms' as const, subType: 'Cargo Pants', brand: 'BECHARIEL / Pinterest Curated', color: 'Warm Desert Khaki', fabric: 'Heavy Cotton Twill with Bellowed Gusset Pockets', fit: 'Regular' as const, formality: 2 as const, icon: '👖', imageUrl: '/wardrobe/man/man_cargo_khaki_pants.png', purchasePrice: 95, season: 'All Season' },
      { name: 'Lightwash Denim Wide-Leg Carpenter Jeans', category: 'bottoms' as const, subType: 'Denim Jeans', brand: 'Pinterest Curated / Streetwear', color: 'Sun-Bleached Pale Indigo', fabric: '13.5oz Ring-Spun Japanese Denim', fit: 'Relaxed / Tailored' as const, formality: 2 as const, icon: '👖', imageUrl: '/wardrobe/man/man_lightwash_denim_jeans.png', purchasePrice: 110, season: 'All Season' },
      { name: 'Minimalist Cream Ribbed Atelier Slides', category: 'footwear' as const, subType: 'Lounge Slides', brand: 'OTD Footwear', color: 'Cream Ivory', fabric: 'Ergonomic Molded Footbed & Ribbed Knit', fit: 'Regular' as const, formality: 2 as const, icon: '🩴', imageUrl: '/wardrobe/girl/girl_cream_ribbed_slides.jpg', purchasePrice: 65, season: 'All Season' },
    ],
  },
  {
    key: 'boy',
    email: 'boy@otd.com',
    name: 'Aarav Patel',
    password: 'Password123!',
    profile: {
      height: "5'10\" (178 cm)",
      bodyShape: 'Athletic / Lean Youth',
      skinTone: 'Medium Warm Honey',
      stylingPath: 'Men' as const,
      stylePersonas: ['Youth Prep', 'Streetwear Utility', 'Contemporary Sport'],
      preferredFit: 'Relaxed / Tailored',
      palettePreferences: ['Denim Blue', 'Khaki', 'Olive', 'Charcoal'],
      avoidedColors: ['Fluorescent Pink', 'Glitter'],
      dislikedElements: ['Formal Ties', 'Stiff Collars'],
      goals: ['Smart Casual Everyday', 'Comfort and Movement'],
    },
    avatar: {
      height: '178 cm',
      skinTone: 'Medium Warm Honey',
      bodyProportions: { shoulderWidth: '44 cm', chest: '94 cm', waist: '76 cm', inseam: '82 cm' },
      pose: 'three_quarter' as const,
      ambientLighting: 'Natural Daylight' as const,
    },
    items: [
      { name: 'Light Blue Abstract Botanical Camp Collar Shirt', category: 'tops' as const, subType: 'Resort Shirt', brand: 'NEXT / Pinterest Curated', color: 'Denim Sky Blue & White', fabric: '100% Breathable Cotton Slub', fit: 'Regular' as const, formality: 2 as const, icon: '👕', imageUrl: '/wardrobe/boy/boy_blue_botanical_shirt.png', purchasePrice: 65, season: 'Spring/Summer' },
      { name: 'Terracotta Daisy Floral Camp Collar Linen Shirt', category: 'tops' as const, subType: 'Linen Shirt', brand: 'Pinterest Curated', color: 'Terracotta Rust & White', fabric: 'Pure Washed Linen', fit: 'Regular' as const, formality: 2 as const, icon: '👕', imageUrl: '/wardrobe/boy/boy_terracotta_daisy_shirt.png', purchasePrice: 75, season: 'Spring/Summer' },
      { name: 'Sand Khaki Multi-Pocket Cargo Pants', category: 'bottoms' as const, subType: 'Cargo Pants', brand: 'BECHARIEL', color: 'Desert Khaki', fabric: 'Cotton Twill with Utility Pockets', fit: 'Regular' as const, formality: 2 as const, icon: '👖', imageUrl: '/wardrobe/boy/boy_cargo_khaki_pants.png', purchasePrice: 85, season: 'All Season' },
      { name: 'Lightwash Denim Wide-Leg Jeans', category: 'bottoms' as const, subType: 'Denim Jeans', brand: 'Youth Streetwear', color: 'Pale Indigo', fabric: 'Ring-Spun Denim', fit: 'Relaxed / Tailored' as const, formality: 2 as const, icon: '👖', imageUrl: '/wardrobe/boy/boy_lightwash_denim_jeans.png', purchasePrice: 90, season: 'All Season' },
      { name: 'Minimalist Cream Ribbed Slides', category: 'footwear' as const, subType: 'Lounge Slides', brand: 'OTD Footwear', color: 'Cream Ivory', fabric: 'Molded Footbed', fit: 'Regular' as const, formality: 2 as const, icon: '🩴', imageUrl: '/wardrobe/girl/girl_cream_ribbed_slides.jpg', purchasePrice: 50, season: 'All Season' },
    ],
  },
  {
    key: 'girl',
    email: 'girl@otd.com',
    name: 'Ananya Reddy',
    password: 'Password123!',
    profile: {
      height: "5'6\" (168 cm)",
      bodyShape: 'Slender / Hourglass',
      skinTone: 'Warm Beige Honey',
      stylingPath: 'Women' as const,
      stylePersonas: ['Festive & Pinterest Couture', 'Y2K Prep', 'Celebration Glamour'],
      preferredFit: 'Fluid Drape / Tailored Waist',
      palettePreferences: ['Rose Pink', 'Dusty Mauve', 'Ivory Cream', 'Cherry Red'],
      avoidedColors: ['Acid Green', 'Muddy Rust'],
      dislikedElements: ['Heavy Branding', 'Stiff Unyielding Fits'],
      goals: ['Party Styling', 'Color Harmony', 'Digital Wardrobe Telemetry'],
    },
    avatar: {
      height: '168 cm',
      skinTone: 'Warm Beige Honey',
      bodyProportions: { shoulderWidth: '38 cm', chest: '84 cm', waist: '64 cm', inseam: '76 cm' },
      pose: 'three_quarter' as const,
      ambientLighting: 'Editorial Studio' as const,
    },
    items: [
      { name: 'White Cherry Embroidered Corset Mini Dress', category: 'tops' as const, subType: 'Corset Dress', brand: 'Cider Curated', color: 'Optic White & Scarlet Cherry', fabric: 'Cotton Poplin with Lace-Up Waist', fit: 'Regular' as const, formality: 3 as const, icon: '👗', imageUrl: '/wardrobe/girl/girl_cherry_corset_dress.png', purchasePrice: 88, season: 'Spring/Summer' },
      { name: 'Periwinkle Sky Floral Tie-Strap Sundress', category: 'tops' as const, subType: 'Floral Sundress', brand: 'Reformation Girl', color: 'Periwinkle Sky & Floral', fabric: 'Crepe Linen with Ribbon Ties', fit: 'Regular' as const, formality: 3 as const, icon: '👗', imageUrl: '/wardrobe/girl/girl_blue_tie_sundress.png', purchasePrice: 110, season: 'Spring/Summer' },
      { name: 'Rose Pink Ombre Shimmer Organza Saree Set', category: 'tops' as const, subType: 'Silk Saree', brand: 'Raw Mango', color: 'Rose Pink Ombre', fabric: 'Organza Silk with Metallic Shimmer', fit: 'Regular' as const, formality: 5 as const, icon: '🥻', imageUrl: '/wardrobe/girl/girl_rose_pink_saree.png', purchasePrice: 1850, season: 'All Season' },
      { name: 'Y2K Lightwash Painted Red Heart Baggy Jeans', category: 'bottoms' as const, subType: 'Graphic Denim', brand: 'Pinterest Streetwear', color: 'Sun-Bleached Pale Denim with Scarlet Red Hearts', fabric: 'Washed Cotton Denim', fit: 'Relaxed / Tailored' as const, formality: 2 as const, icon: '👖', imageUrl: '/wardrobe/girl/girl_painted_heart_jeans.png', purchasePrice: 78, season: 'All Season' },
      { name: 'Ivory Ruched Leather Platform Block Heels', category: 'footwear' as const, subType: 'Platform Heels', brand: 'Haute Footwear', color: 'Pearl Ivory White', fabric: 'Soft Ruched Napa Leather with Padded Insole', fit: 'Regular' as const, formality: 4 as const, icon: '👠', imageUrl: '/wardrobe/girl/girl_ivory_ruched_platform_heels.png', purchasePrice: 195, season: 'All Season' },
      { name: 'Minimalist Cream Ribbed Atelier Slides', category: 'footwear' as const, subType: 'Lounge Slides', brand: 'OTD Footwear', color: 'Cream Ivory', fabric: 'Ergonomic Molded Footbed & Ribbed Knit', fit: 'Regular' as const, formality: 2 as const, icon: '🩴', imageUrl: '/wardrobe/girl/girl_cream_ribbed_slides.jpg', purchasePrice: 65, season: 'All Season' },
    ],
  },
];

export async function seedDatabase() {
  console.log('[Seed] Connecting to MongoDB at', MONGO_URI);
  await mongoose.connect(MONGO_URI);

  for (const p of DEMO_PERSONAS) {
    console.log(`[Seed] Provisioning demo persona: ${p.name} (${p.email})...`);

    let user = await User.findOne({ email: p.email });
    const hashedPassword = await PasswordUtil.hash(p.password);

    if (!user) {
      user = await User.create({
        name: p.name,
        email: p.email,
        password: hashedPassword,
        role: 'user',
        isEmailVerified: true,
      });
    } else {
      user.name = p.name;
      user.password = hashedPassword;
      await user.save();
    }

    const userId = user._id;

    // Profile
    await Profile.findOneAndUpdate(
      { userId },
      {
        userId,
        name: p.name,
        ...p.profile,
      },
      { upsert: true, new: true }
    );

    // Avatar
    await Avatar.findOneAndUpdate(
      { userId },
      {
        userId,
        ...p.avatar,
      },
      { upsert: true, new: true }
    );

    // Wardrobe Items (idempotent: remove old demo items, insert fresh)
    await WardrobeItem.deleteMany({ userId });
    const createdItems = await WardrobeItem.insertMany(
      p.items.map((item) => ({
        ...item,
        userId,
        tags: [p.key, item.category, item.subType || 'garment'],
      }))
    );

    // Initial Saved Outfits (top + bottom + footwear if available)
    await Outfit.deleteMany({ userId });
    const top = createdItems.find((i) => i.category === 'tops');
    const bottom = createdItems.find((i) => i.category === 'bottoms') || createdItems[1];
    const shoe = createdItems.find((i) => i.category === 'footwear') || createdItems[createdItems.length - 1];

    if (top && bottom) {
      const outfitPieces = [top._id, bottom._id];
      if (shoe && shoe._id.toString() !== bottom._id.toString()) outfitPieces.push(shoe._id);

      await Outfit.create({
        userId,
        title: `${p.name} Signature Curation`,
        occasion: 'Evening Curation',
        venue: 'The Grand Atelier',
        vibe: 'Clean Minimalist Luxury',
        weather: '24°C Pleasant',
        items: outfitPieces,
        isBookmarked: true,
        isArchived: false,
        harmonyScore: 94.5,
        rationale: {
          colorTheory: 'Balanced tonal harmonies anchoring neutral bases with refined textures.',
          silhouette: 'Proportional balance maintaining natural shoulder stance and fluid movement.',
          fabricPhysics: 'Breathable natural weave optimized for ambient thermal regulation.',
          layeringStrategy: 'Unstructured tailoring allowing ease of transition.',
          styleIdentityAlignment: 'Immaculately calibrated to personal style DNA.',
          venueAlignment: 'Perfect elegance for evening atelier gatherings.',
          weatherComfort: 'Optimal thermal comfort in 24°C pleasant weather.',
          paletteHarmony: 'Cohesive palette with natural depth.',
          wardrobeUtilization: 'Highlights foundational wardrobe investments.',
        },
      });
    }

    console.log(`[Seed] ✅ ${p.name} seeded with ${createdItems.length} wardrobe pieces and avatar.`);
  }

  console.log('[Seed] Database successfully seeded with all 4 demo personas!');
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed Error]:', err);
      process.exit(1);
    });
}
