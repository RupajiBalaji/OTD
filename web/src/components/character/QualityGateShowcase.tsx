import React, { useState } from 'react';
import { StylizedCharacter } from './StylizedCharacter';
import type { CharacterOutfitState, CharacterCustomization, PosePreset } from './character.types';
import { Sun, Moon, Sparkles } from 'lucide-react';

interface QualityGateOutfit {
  id: string;
  title: string;
  description: string;
  customization: CharacterCustomization;
  outfit: CharacterOutfitState;
  pose: PosePreset;
}

export const QUALITY_GATE_OUTFITS: QualityGateOutfit[] = [
  // 1. Jeans + Tee + Sneakers
  {
    id: 'outfit-1-jeans-tee',
    title: '1. Jeans + Tee + Sneakers',
    description: 'Crisp Atelier Ivory Crew Tee, Vintage Indigo Selvedge Jeans, and Clean Minimalist White Court Sneakers.',
    customization: {
      skinToneId: 'sand',
      bodyFrame: 'athletic',
      hairstyleId: 'short_fade',
      hairColorId: 'rich_black',
      avatarVersion: 1,
    },
    pose: 'stand',
    outfit: {
      top: {
        id: 'tee-01',
        name: 'Crisp Atelier Crew Tee',
        category: 'tops',
        color: '#FFFFFF',
        brand: 'Atelier OTD',
        material: 'Pima Cotton',
      } as any,
      bottom: {
        id: 'jeans-01',
        name: 'Vintage Indigo Selvedge Jeans',
        category: 'bottoms',
        color: '#2B4C7E',
        brand: 'Kuroki Mill',
        material: 'Selvedge Denim',
      } as any,
      footwear: {
        id: 'sneakers-01',
        name: 'Classic White Leather Court Sneakers',
        category: 'footwear',
        color: '#FAFAFA',
        brand: 'Common Ground',
        material: 'Nappa Leather',
      } as any,
      accessory: {
        id: 'acc-01',
        name: 'Heritage Gold Chronometer Watch',
        category: 'accessories',
        color: '#D4AF37',
      } as any,
    },
  },

  // 2. Formal Suit
  {
    id: 'outfit-2-formal-suit',
    title: '2. Formal Sartorial Suit',
    description: 'Midnight Navy Tailored Blazer, Crisp Oxford Shirt, Matching Wool Crease Trousers, and Burnished Oxford Shoes.',
    customization: {
      skinToneId: 'amber',
      bodyFrame: 'runway',
      hairstyleId: 'slicked_back',
      hairColorId: 'espresso_brown',
      avatarVersion: 1,
    },
    pose: 'hand_on_hip',
    outfit: {
      outerwear: {
        id: 'blazer-01',
        name: 'Midnight Navy Savile Row Blazer',
        category: 'outerwear',
        color: '#1A2436',
        brand: 'Gieves & Hawkes',
        material: 'Super 130s Wool',
      } as any,
      top: {
        id: 'shirt-01',
        name: 'Egyptian Poplin Spread Collar Shirt',
        category: 'tops',
        color: '#F4F7FB',
        brand: 'Turnbull & Asser',
      } as any,
      bottom: {
        id: 'trouser-01',
        name: 'Midnight Navy Tailored Wool Trousers',
        category: 'bottoms',
        color: '#1A2436',
        material: 'Fine Worsted Wool',
      } as any,
      footwear: {
        id: 'shoes-01',
        name: 'Burnished Espresso Cap-Toe Oxfords',
        category: 'footwear',
        color: '#2E1A11',
        material: 'Calfskin Leather',
      } as any,
    },
  },

  // 3. Kurta
  {
    id: 'outfit-3-kurta',
    title: '3. Royal Heritage Kurta',
    description: 'Emerald Raw Silk Kurta with Gold Mandarin Placket, Ivory Silk Pajama Trousers, and Tan Kolhapuri Sandals.',
    customization: {
      skinToneId: 'olive',
      bodyFrame: 'runway',
      hairstyleId: 'short_fade',
      hairColorId: 'rich_black',
      avatarVersion: 1,
    },
    pose: 'stand',
    outfit: {
      top: {
        id: 'kurta-01',
        name: 'Emerald Raw Silk Kurta with Zari Detail',
        category: 'tops',
        color: '#0D472B',
        brand: 'Sabyasachi Heritage',
        material: 'Raw Mulberry Silk',
      } as any,
      bottom: {
        id: 'pajama-01',
        name: 'Ivory Raw Silk Straight Pajama Trousers',
        category: 'bottoms',
        color: '#FBF9F3',
        material: 'Linen Silk',
      } as any,
      footwear: {
        id: 'sandals-01',
        name: 'Handcrafted Tan Kolhapuri Leather Sandals',
        category: 'footwear',
        color: '#8C552D',
        material: 'Vegetable-Tanned Leather',
      } as any,
    },
  },

  // 4. Saree
  {
    id: 'outfit-4-saree',
    title: '4. Kanjivaram Silk Saree',
    description: 'Regal Crimson Kanjivaram Saree with Handwoven Gold Zari Pallu, Brocade Blouse, and Champagne Strappy Slides.',
    customization: {
      skinToneId: 'peach',
      bodyFrame: 'hourglass',
      hairstyleId: 'top_knot',
      hairColorId: 'rich_black',
      avatarVersion: 1,
    },
    pose: 'walk_step',
    outfit: {
      onePiece: {
        id: 'saree-01',
        name: 'Crimson & Zari Gold Kanjivaram Silk Saree',
        category: 'onePiece',
        color: '#8B0000',
        brand: 'Nalli Silks',
        material: 'Kanchipuram Silk & Pure Zari',
      } as any,
      footwear: {
        id: 'sandals-02',
        name: 'Champagne Metallic Strappy Sandals',
        category: 'footwear',
        color: '#D4AF37',
      } as any,
      accessory: {
        id: 'acc-02',
        name: 'Temple Gold Embellished Clutch Bag',
        category: 'accessories',
        color: '#D4AF37',
      } as any,
    },
  },

  // 5. Printed Shirt
  {
    id: 'outfit-5-printed-shirt',
    title: '5. Resort Botanical Printed Shirt',
    description: 'Camp-collar Botanical Floral Pattern Shirt in Warm Terracotta, Sand Dune Chinos, and Casual White Court Sneakers.',
    customization: {
      skinToneId: 'caramel',
      bodyFrame: 'athletic',
      hairstyleId: 'curly_bob',
      hairColorId: 'warm_chestnut',
      avatarVersion: 1,
    },
    pose: 'wave',
    outfit: {
      top: {
        id: 'shirt-print-01',
        name: 'Botanical Floral Camp-Collar Resort Shirt',
        category: 'tops',
        color: '#A0522D',
        brand: 'Casablanca Atelier',
        material: 'Crepe Silk',
      } as any,
      bottom: {
        id: 'chinos-01',
        name: 'Sand Dune Tailored Chino Trousers',
        category: 'bottoms',
        color: '#D2B48C',
        material: 'Cotton Gabardine',
      } as any,
      footwear: {
        id: 'sneakers-02',
        name: 'Off-White Minimalist Sneakers',
        category: 'footwear',
        color: '#F5F5F0',
      } as any,
      accessory: {
        id: 'acc-03',
        name: 'Tortoiseshell Sunglasses & Canvas Tote',
        category: 'accessories',
        color: '#3B2314',
      } as any,
    },
  },

  // 6. Hoodie with Slippers
  {
    id: 'outfit-6-hoodie-slippers',
    title: '6. Heavyweight Hoodie with Slippers',
    description: 'Heather Oatmeal French Terry Hoodie with Drawstring, Charcoal Relaxed Lounge Trousers, and Taupe Luxury Slides.',
    customization: {
      skinToneId: 'espresso',
      bodyFrame: 'runway',
      hairstyleId: 'curly_afro',
      hairColorId: 'rich_black',
      avatarVersion: 1,
    },
    pose: 'stand',
    outfit: {
      top: {
        id: 'hoodie-01',
        name: 'Heather Oatmeal Oversized Hoodie',
        category: 'tops',
        color: '#D9D2C9',
        brand: 'Fear of God Essentials',
        material: '480 GSM French Terry',
      } as any,
      bottom: {
        id: 'trousers-relaxed-01',
        name: 'Charcoal Relaxed Pleated Lounge Trousers',
        category: 'bottoms',
        color: '#374151',
        material: 'Brushed Cotton Flannel',
      } as any,
      footwear: {
        id: 'slippers-01',
        name: 'Taupe Cashmere Luxury Comfort Slippers',
        category: 'footwear',
        color: '#A69279',
        material: 'Suede Shearling',
      } as any,
    },
  },
];

export const QualityGateShowcase: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState(0);

  const activeOutfit = QUALITY_GATE_OUTFITS[selectedOutfitIndex];

  return (
    <div
      id="quality-gate-container"
      className={`min-h-screen w-full transition-colors duration-300 p-6 md:p-10 ${
        isDarkMode ? 'dark bg-[#121115] text-[#ECE6DC]' : 'bg-[#FAF8F5] text-[#1E1B18]'
      }`}
    >
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-stone-200 dark:border-stone-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              QUALITY GATE · ANIMATED STYLIZED CHARACTER
            </span>
            <span className="text-xs text-stone-400">·</span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              Zero GPU · Vector Art
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Haute Couture Vector Fashion Mannequin
          </h1>
          <p className="text-xs md:text-sm text-stone-500 max-w-2xl mt-1">
            Parametric SVG apparel rendering with isolated layer swap physics, alive motion breathing,
            and anatomical silhouette fit across diverse skin undertones and body frames.
          </p>
        </div>

        {/* Theme Toggle & Selector */}
        <div className="flex items-center gap-3">
          <button
            id="toggle-dark-mode"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm text-xs font-medium cursor-pointer hover:border-amber-500 transition"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
            <span>{isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}</span>
          </button>
        </div>
      </div>

      {/* Outfit Selector Pills */}
      <div className="max-w-7xl mx-auto my-6 flex flex-wrap gap-2">
        {QUALITY_GATE_OUTFITS.map((item, idx) => (
          <button
            key={item.id}
            id={`select-outfit-${idx}`}
            onClick={() => setSelectedOutfitIndex(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedOutfitIndex === idx
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-amber-400'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Main Single Showcase Card */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left: Interactive Character Canvas */}
        <div
          id="character-stage-card"
          className="lg:col-span-6 bg-gradient-to-b from-[#FCFAF6] via-[#F6F1E7] to-[#EAE2D3] dark:from-[#1E1C22] dark:via-[#17151B] dark:to-[#0F0E12] rounded-3xl p-6 border border-amber-300/40 dark:border-amber-500/20 shadow-2xl flex flex-col items-center justify-between min-h-[560px] relative overflow-hidden"
        >
          {/* Subtle Ambient Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-black/25 pointer-events-none" />

          {/* Top Label */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="px-3.5 py-1 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-amber-300/50 text-[11px] font-serif font-bold text-amber-900 dark:text-amber-200 uppercase tracking-widest">
              Style preview · {activeOutfit.pose.replace('_', ' ')}
            </span>
            <span className="text-[10px] font-mono text-stone-500">
              Frame: {activeOutfit.customization.bodyFrame}
            </span>
          </div>

          {/* Character Stage */}
          <div className="relative w-full h-[470px] flex items-center justify-center my-auto z-10">
            <StylizedCharacter
              customization={activeOutfit.customization}
              outfit={activeOutfit.outfit}
              pose={activeOutfit.pose}
              className="w-full h-full max-h-[460px]"
            />
          </div>

          <div className="z-10 text-[11px] font-mono text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <span>✦</span> Animated idle sway & breathing · Layered SVG vector
          </div>
        </div>

        {/* Right: Architectural Garment Specifications */}
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 uppercase font-bold tracking-wider">
                LOOK CONFIGURATION SPECIFICATION
              </span>
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                {activeOutfit.title}
              </h2>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {activeOutfit.description}
              </p>
            </div>

            {/* Garment Piece Slots */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block">
                COMPOSITE GARMENT PIECES:
              </span>

              {Object.entries(activeOutfit.outfit).map(([slotKey, item]) => {
                if (!item) return null;
                return (
                  <div
                    key={slotKey}
                    className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold">
                        {slotKey}
                      </span>
                      <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200 mt-1">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-stone-500">
                        {item.brand ? `${item.brand} · ` : ''}{item.material || 'Bespoke Fabric'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border border-stone-300 shadow-sm"
                        style={{ backgroundColor: item.color }}
                        title={item.color}
                      />
                      <span className="text-[10px] font-mono text-stone-400">
                        {item.color}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Anatomical Calibration Details */}
          <div className="p-5 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              AVATAR ANCHOR CALIBRATION
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-white/70 dark:bg-stone-900/70 border border-amber-200/50">
                <span className="text-[9px] text-stone-400 block">SKIN UNDERTONE</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200 uppercase">
                  {activeOutfit.customization.skinToneId}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/70 dark:bg-stone-900/70 border border-amber-200/50">
                <span className="text-[9px] text-stone-400 block">BODY FRAME</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200 uppercase">
                  {activeOutfit.customization.bodyFrame}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/70 dark:bg-stone-900/70 border border-amber-200/50">
                <span className="text-[9px] text-stone-400 block">HAIRSTYLE</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200 uppercase truncate block">
                  {activeOutfit.customization.hairstyleId}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/70 dark:bg-stone-900/70 border border-amber-200/50">
                <span className="text-[9px] text-stone-400 block">HAIR COLOR</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200 uppercase truncate block">
                  {activeOutfit.customization.hairColorId}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of All 6 Outfits Side-by-Side (For Comprehensive Review & Screenshotting) */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-stone-200 dark:border-stone-800">
        <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
          <span>All 6 Ensembles Side-by-Side Comparison</span>
          <span className="text-xs font-mono text-stone-400 font-normal">
            (Jeans+Tee, Formal Suit, Kurta, Saree, Printed Shirt, Hoodie+Slippers)
          </span>
        </h3>

        <div id="all-six-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {QUALITY_GATE_OUTFITS.map((item, idx) => (
            <div
              key={item.id}
              id={`ensemble-card-${idx}`}
              className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col items-center justify-between"
            >
              <span className="text-[10px] font-serif font-bold text-stone-800 dark:text-stone-200 text-center mb-1 line-clamp-1">
                {item.title}
              </span>

              <div className="w-full h-64 flex items-center justify-center my-1 bg-stone-50 dark:bg-stone-950/60 rounded-xl overflow-hidden p-1">
                <StylizedCharacter
                  customization={item.customization}
                  outfit={item.outfit}
                  pose={item.pose}
                  height="100%"
                />
              </div>

              <div className="w-full pt-1 border-t border-stone-100 dark:border-stone-800 text-[9px] font-mono text-stone-400 text-center truncate">
                {item.customization.bodyFrame} · {item.customization.skinToneId}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
