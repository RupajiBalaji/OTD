import { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';


interface OutfitPiece {
  category: string;
  name: string;
  color: string;
  fabric: string;
  icon: string;
  vibe: string;
}

interface CuratedLook {
  title: string;
  harmonyScore: number;
  formality: string;
  pieces: OutfitPiece[];
  colorPalette: { name: string; hex: string }[];
  stylistRationale: string;
  accessoryNote: string;
}

const PRESETS: Record<string, Record<string, CuratedLook>> = {
  'boardroom': {
    'old-money': {
      title: 'The Sovereign Executive',
      harmonyScore: 99.2,
      formality: 'High Executive Sartorial',
      pieces: [
        { category: 'Outerwear / Tailoring', name: 'Savile Row Double-Breasted Wool Chalk-Stripe Suit', color: 'Charcoal Grey', fabric: 'Super 150s Merino Wool', icon: '🧥', vibe: 'Power & Structure' },
        { category: 'Shirt', name: 'Hand-Finished Sea Island Cotton Poplin Shirt', color: 'Crisp French Blue', fabric: 'Sea Island Cotton 200/2', icon: '👔', vibe: 'Breathable Crisp' },
        { category: 'Tie / Accent', name: 'Ancient Madder Hand-Rolled 7-Fold Silk Tie', color: 'Burnt Burgundy', fabric: 'Hand-Printed English Silk', icon: '🎗️', vibe: 'Textured Depth' },
        { category: 'Footwear', name: 'Oxford Cap-Toe Shoes in Antique Museum Calf', color: 'Deep Oxblood', fabric: 'Full-Grain French Calfskin', icon: '👞', vibe: 'Goodyear Welted' },
        { category: 'Horology', name: 'Ultra-Thin Mechanical Rose Gold Dress Watch', color: 'Eggshell Dial', fabric: 'Alligator Leather Strap', icon: '⌚', vibe: 'Subtle Prestige' },
      ],
      colorPalette: [
        { name: 'Charcoal', hex: '#2A2D34' },
        { name: 'French Blue', hex: '#779ECB' },
        { name: 'Burnt Burgundy', hex: '#631B26' },
        { name: 'Oxblood', hex: '#4A1521' }
      ],
      stylistRationale: 'The charcoal chalk stripe establishes commanding presence without the harshness of solid black. The French blue poplin softens facial contrast, while the Madder silk tie introduces tactile warmth under boardroom halogen and daylight alike.',
      accessoryNote: 'Pocket square in white linen with hand-rolled burgundy piping, television fold.'
    },
    'minimalist': {
      title: 'The Modernist Architect',
      harmonyScore: 98.7,
      formality: 'Contemporary Professional',
      pieces: [
        { category: 'Tailoring', name: 'Unstructured Milano-Stitch Virgin Wool Single-Breasted Jacket', color: 'Jet Black', fabric: 'High-Twist Wool Crepe', icon: '🧥', vibe: 'Clean Lines' },
        { category: 'Base Knit', name: 'Seamless 18-Gauge Silk-Cashmere Mock-Neck', color: 'Slate Heather', fabric: '70% Silk / 30% Cashmere', icon: '👕', vibe: 'Featherlight' },
        { category: 'Trousers', name: 'Relaxed Tapered Pleated Trousers with Side Tabs', color: 'Deep Charcoal', fabric: 'Worsted Tropical Wool', icon: '👖', vibe: 'Fluid Motion' },
        { category: 'Footwear', name: 'Minimalist Venetian Calfskin Slip-On Loafers', color: 'Matte Obsidian', fabric: 'Italian Box Calf', icon: '👞', vibe: 'Hardware-Free' },
      ],
      colorPalette: [
        { name: 'Jet Black', hex: '#111113' },
        { name: 'Slate', hex: '#4A4D55' },
        { name: 'Deep Charcoal', hex: '#23242A' },
        { name: 'Bone White', hex: '#E6E4DD' }
      ],
      stylistRationale: 'A hardware-free, monochromatic palette communicates razor-sharp focus and intellectual restraint. Removing the traditional tie in favor of a silk-cashmere mock neck modernizes the silhouette without sacrificing decorum.',
      accessoryNote: 'Matte titanium fountain pen & minimalist leather document folio in grain calf.'
    }
  },
  'soiree': {
    'old-money': {
      title: 'Monaco Nocturne Black-Tie',
      harmonyScore: 99.8,
      formality: 'Formal Eveningwear',
      pieces: [
        { category: 'Dinner Jacket', name: 'Midnight Blue Mohair-Barathea Tuxedo with Silk Grosgrain Lapels', color: 'Midnight Noir', fabric: '70% Wool / 30% Kid Mohair', icon: '🧥', vibe: 'Luminous Under Light' },
        { category: 'Evening Shirt', name: 'Pleated Marcella Bib Dress Shirt with Mother-of-Pearl Studs', color: 'Pure Optical White', fabric: 'Swiss Cotton Voile', icon: '👔', vibe: 'Crisp Stiff Front' },
        { category: 'Trousers', name: 'Tuxedo Trousers with Grosgrain Side Braid', color: 'Midnight Navy', fabric: 'Matching Barathea Weave', icon: '👖', vibe: 'Seamless Line' },
        { category: 'Footwear', name: 'Velvet Evening Slippers with Monogram Bullion Embroidery', color: 'Black Onyx', fabric: 'Quilted Silk Lining', icon: '👞', vibe: 'Aristocratic Ease' },
      ],
      colorPalette: [
        { name: 'Midnight', hex: '#0B1325' },
        { name: 'Silk Black', hex: '#050507' },
        { name: 'Marcella White', hex: '#FAFAFA' },
        { name: 'Champagne', hex: '#D4AF37' }
      ],
      stylistRationale: 'Under evening chandelier luminescence, true Midnight Blue reads richer and deeper than black, which can appear dull or grayish. The grosgrain trim adds refined tactile contrast against the crisp Swiss cotton Marcella bib.',
      accessoryNote: 'Cufflinks in Onyx set in 18k yellow gold with matching dress studs.'
    },
    'minimalist': {
      title: 'The Gallery Vernissage',
      harmonyScore: 97.9,
      formality: 'Creative Black Tie',
      pieces: [
        { category: 'Jacket', name: 'Asymmetrical Draped Raw Silk Evening Kimono-Coat', color: 'Smoked Obsidian', fabric: 'Handloomed Slub Silk', icon: '🧥', vibe: 'Sculptural Silhouette' },
        { category: 'Knit', name: 'Sheer Wool-Cashmere Open-Collar Polo', color: 'Caviar Black', fabric: 'Featherweight Gauze', icon: '👕', vibe: 'Effortless Drape' },
        { category: 'Trousers', name: 'Wide-Leg Fluid Japanese Triacetate Trousers', color: 'Deep Anthracite', fabric: 'Architectural Drape Fabric', icon: '👖', vibe: 'High Motion Volume' },
        { category: 'Footwear', name: 'Square-Toe Polished Chelsea Boots with Concealed Zip', color: 'Ebony Black', fabric: 'Glazed Calfskin', icon: '👢', vibe: 'Architectural Edge' },
      ],
      colorPalette: [
        { name: 'Smoked Obsidian', hex: '#161619' },
        { name: 'Caviar', hex: '#222227' },
        { name: 'Anthracite', hex: '#34363F' },
        { name: 'Palladium', hex: '#A8ABB5' }
      ],
      stylistRationale: 'Playing with silhouette volume rather than chromatic color creates an intensely magnetic, high-fashion statement. The wide-leg fluid drape creates sculptural flow when in motion.',
      accessoryNote: 'Single architectural silver ear cuff or platinum architectural pinky ring.'
    }
  },
  'weekend': {
    'old-money': {
      title: 'St. Moritz Fireside Leisure',
      harmonyScore: 98.9,
      formality: 'Alpine Luxury Casual',
      pieces: [
        { category: 'Outerwear', name: 'Shearling-Lined Suede Field Jacket in Toasted Hazelnut', color: 'Hazelnut Suede', fabric: 'Spanish Entrefino Lambskin', icon: '🧥', vibe: 'Rugged Warmth' },
        { category: 'Knitwear', name: 'Heavy Cable-Knit Fisherman Turtleneck in Undyed Cashmere', color: 'Oatmeal Heather', fabric: '6-Ply Scottish Cashmere', icon: '🧶', vibe: 'Pure Softness' },
        { category: 'Pants', name: 'Garment-Dyed Brushed Cotton Corduroy Trousers', color: 'Forest Pine', fabric: '500g Heavywale Italian Corduroy', icon: '👖', vibe: 'Tactile Comfort' },
        { category: 'Boots', name: 'Handcrafted Norwegian-Welted Mountain Hiker Boots', color: 'Cognac Waxed Leather', fabric: 'Vibram Commando Lug Sole', icon: '🥾', vibe: 'Weatherproof Grip' },
      ],
      colorPalette: [
        { name: 'Hazelnut', hex: '#8E5A3C' },
        { name: 'Oatmeal', hex: '#DED5C4' },
        { name: 'Forest Pine', hex: '#2D3A2F' },
        { name: 'Cognac', hex: '#633A18' }
      ],
      stylistRationale: 'Rich tactile juxtaposition: the velvety grain of shearling suede against chunky cable-knit cashmere and heavywale corduroy creates a masterclass in tonal warmth and alpine comfort.',
      accessoryNote: 'Cashmere-lined peccary leather gloves in caramel brown.'
    },
    'minimalist': {
      title: 'Riviera Harbor Stroll',
      harmonyScore: 98.4,
      formality: 'Resort Chic',
      pieces: [
        { category: 'Overshirt', name: 'Unlined Washed Linen-Silk Overshirt with Horn Buttons', color: 'Sand Dune', fabric: 'Irish Linen & Mulberry Silk', icon: '🧥', vibe: 'Breezy Elegance' },
        { category: 'Tee', name: 'Mercerized Pima Cotton Crewneck with French Seams', color: 'Chalk White', fabric: 'Extra-Long Staple Cotton', icon: '👕', vibe: 'Silky Sheen' },
        { category: 'Shorts/Pants', name: 'Drawstring Tailored Gurkha Trousers in Light Hemp-Tencel', color: 'Terracotta Clay', fabric: 'Breathable Eco-Weave', icon: '👖', vibe: 'Relaxed Tailoring' },
        { category: 'Footwear', name: 'Unlined Suede Belgian Loafers with Leather Piping', color: 'Taupe Nubuck', fabric: 'Handmade Soft Sole', icon: '👞', vibe: 'Barefoot Comfort' },
      ],
      colorPalette: [
        { name: 'Sand Dune', hex: '#D9C8B4' },
        { name: 'Chalk White', hex: '#F5F5F3' },
        { name: 'Terracotta', hex: '#9E5B42' },
        { name: 'Taupe', hex: '#877B73' }
      ],
      stylistRationale: 'Natural open-weave fibers allow sea breezes to circulate while retaining sartorial structure. The warm terracotta grounds the sun-bleached sand tones with Mediterranean sophistication.',
      accessoryNote: 'Handmade acetate tortoiseshell sunglasses with dark green polarized lenses.'
    }
  }
};

export const InteractiveStylist: React.FC = () => {
  const [occasion, setOccasion] = useState<string>('boardroom');
  const [aesthetic, setAesthetic] = useState<string>('old-money');
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedCount, setSavedCount] = useState(142);
  const [hasLiked, setHasLiked] = useState(false);

  const currentLook = PRESETS[occasion]?.[aesthetic] || PRESETS['boardroom']['old-money'];

  const handleOccasionChange = (key: string) => {
    setIsGenerating(true);
    setOccasion(key);
    setTimeout(() => setIsGenerating(false), 350);
  };

  const handleAestheticChange = (key: string) => {
    setIsGenerating(true);
    setAesthetic(key);
    setTimeout(() => setIsGenerating(false), 350);
  };

  return (
    <section id="atelier" className="py-20 md:py-28 relative bg-[#0C0C10] border-y border-[#D4AF37]/15">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4AF37]/25 bg-[#14141C]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#EADB9B]">
              LIVE ATELIER SIMULATOR
            </span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-[#FBF9F4]">
            Experience Real-Time <br />
            <span className="italic font-light gold-gradient-text">Algorithmic Curation</span>
          </h2>

          <p className="text-sm sm:text-base text-[#9C97A5] font-light">
            Select your scenario and aesthetic profile. Watch the OTD stylist engine cross-reference 
            chromatic harmony, silhouettes, and fabric weights in milliseconds.
          </p>
        </div>

        {/* Interactive Controls Bar */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 mb-10 max-w-4xl mx-auto border border-[#D4AF37]/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Occasion Selector */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.18em] font-medium text-[#C8C3D2] mb-2.5">
                1. Select Occasion & Setting
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'boardroom', label: 'Executive Board', icon: '🏛️' },
                  { id: 'soiree', label: 'Evening Soirée', icon: '🍸' },
                  { id: 'weekend', label: 'Leisure Retreat', icon: '🏔️' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleOccasionChange(item.id)}
                    className={`p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                      occasion === item.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#FFF8DE] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                        : 'border-[#23232C] bg-[#121217] text-[#9E9BA6] hover:border-[#D4AF37]/40 hover:text-[#E2DFD8]'
                    }`}
                  >
                    <span className="text-base block mb-1">{item.icon}</span>
                    <span className="text-xs font-medium block truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aesthetic Selector */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.18em] font-medium text-[#C8C3D2] mb-2.5">
                2. Select Style DNA
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'old-money', label: 'Old Money Heritage', desc: 'Loro Piana, Savile Row, Cashmere' },
                  { id: 'minimalist', label: 'Architectural Pure', desc: 'Monochrome, Jil Sander, Clean' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAestheticChange(item.id)}
                    className={`p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                      aesthetic === item.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#FFF8DE] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                        : 'border-[#23232C] bg-[#121217] text-[#9E9BA6] hover:border-[#D4AF37]/40 hover:text-[#E2DFD8]'
                    }`}
                  >
                    <span className="text-xs font-semibold block text-[#EADB9B]">{item.label}</span>
                    <span className="text-[10px] text-[#86838D] block mt-0.5 truncate">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Live Output Canvas */}
        <div className={`transition-opacity duration-300 ${isGenerating ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/30 max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
            
            {/* Golden Ribbon Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D4AF37]/20 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#D4AF37]">
                    SYNTHESIZED BESPOKE ENSEMBLE
                  </span>
                  <span className="text-xs text-[#52525E]">·</span>
                  <span className="text-xs font-mono text-[#8C8795]">{currentLook.formality}</span>
                </div>
                <h3 className="font-serif-luxury text-2xl sm:text-4xl font-normal text-[#FAF8F5]">
                  {currentLook.title}
                </h3>
              </div>

              {/* Score & Metrics */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-[#8A8692]">Chromatic Harmony</div>
                  <div className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#EADB9B]">
                    {currentLook.harmonyScore}%
                  </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8A6D20] p-[1px] shadow-lg">
                  <div className="w-full h-full bg-[#121217] rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#EADB9B]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Pieces Grid */}
            <div className="py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentLook.pieces.slice(0, 4).map((piece, idx) => (
                <div
                  key={idx}
                  className="bg-[#121217]/90 rounded-2xl p-5 border border-[#23232C] hover:border-[#D4AF37]/50 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#817E8A]">
                        Layer 0{idx + 1}
                      </span>
                      <span className="text-2xl group-hover:scale-110 transition-transform">{piece.icon}</span>
                    </div>

                    <div className="text-[11px] font-semibold tracking-wider text-[#D4AF37] uppercase mb-1">
                      {piece.category}
                    </div>

                    <h4 className="text-xs font-medium text-[#ECE9E2] group-hover:text-[#FFF] line-clamp-2 mb-2">
                      {piece.name}
                    </h4>
                  </div>

                  <div className="pt-3 border-t border-[#1F1F27] space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-[#767380]">Tone:</span>
                      <span className="text-[#CBC7BF] font-medium">{piece.color}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-[#767380]">Textile:</span>
                      <span className="text-[#CBC7BF] truncate max-w-[110px]">{piece.fabric}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Editorial Stylist Rationale + Palette Footer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 border-t border-[#D4AF37]/20 items-center">
              
              {/* Palette */}
              <div className="lg:col-span-4">
                <span className="text-[10px] uppercase tracking-widest text-[#86838F] block mb-2">
                  Extracted Palette
                </span>
                <div className="flex items-center gap-2">
                  {currentLook.colorPalette.map((col, idx) => (
                    <div key={idx} className="group relative">
                      <div
                        className="w-9 h-9 rounded-xl border border-white/10 shadow-md transition-transform group-hover:scale-110"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] bg-[#1B1B22] text-[#E0DDD5] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
                        {col.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rationale Quote */}
              <div className="lg:col-span-8 bg-[#16161F] p-4 rounded-2xl border border-[#262633]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 flex items-center justify-center shrink-0 border border-[#D4AF37]/30 text-[#EADB9B] text-xs font-serif-luxury font-bold">
                    OTD
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[#D8D4CC] italic leading-relaxed">
                      "{currentLook.stylistRationale}"
                    </p>
                    <p className="text-[11px] text-[#9B96A3]">
                      <strong className="text-[#D4AF37]">Accoutrement:</strong> {currentLook.accessoryNote}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Like & Interaction Bar */}
            <div className="mt-6 flex items-center justify-between text-xs text-[#8A8692] pt-4 border-t border-[#1E1E26]">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setHasLiked(!hasLiked);
                    setSavedCount(hasLiked ? savedCount - 1 : savedCount + 1);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    hasLiked
                      ? 'border-[#E11D48] bg-[#E11D48]/15 text-[#FDA4AF]'
                      : 'border-[#262633] hover:border-[#D4AF37]/50 text-[#C2BEB4]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current text-[#E11D48]' : ''}`} />
                  <span>{savedCount} Curators Saved</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-[#D4AF37]">
                AI Confidence: 99.7% · Weather Synchronized
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
