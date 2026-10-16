import { useState } from 'react';
import { Sparkles } from 'lucide-react';


interface WardrobeItem {
  id: string;
  category: 'outerwear' | 'tailoring' | 'knitwear' | 'footwear' | 'accessories';
  name: string;
  brand: string;
  color: string;
  material: string;
  wearCount: number;
  costPerWear: string;
  versatilityScore: number;
  unlockedCombos: number;
  icon: string;
}

const WARDROBE_DATA: WardrobeItem[] = [
  {
    id: '1',
    category: 'outerwear',
    name: 'Belted Cashmere Trench Coat',
    brand: 'Loro Piana',
    color: 'Vicuna Camel',
    material: 'Double-Faced 100% Cashmere',
    wearCount: 38,
    costPerWear: '€78.40',
    versatilityScore: 98,
    unlockedCombos: 24,
    icon: '🧥'
  },
  {
    id: '2',
    category: 'tailoring',
    name: 'Neapolitan Unstructured Wool Blazer',
    brand: 'Cesare Attolini',
    color: 'Midnight Navy',
    material: 'High-Twist Hopsack Wool',
    wearCount: 54,
    costPerWear: '€42.10',
    versatilityScore: 96,
    unlockedCombos: 32,
    icon: '👔'
  },
  {
    id: '3',
    category: 'knitwear',
    name: 'Seamless Cable Fisherman Knit',
    brand: 'Brunello Cucinelli',
    color: 'Ivory Cream',
    material: 'Mongolian Virgin Cashmere',
    wearCount: 29,
    costPerWear: '€51.70',
    versatilityScore: 94,
    unlockedCombos: 19,
    icon: '🧶'
  },
  {
    id: '4',
    category: 'tailoring',
    name: 'Single Forward-Pleat Flannel Trousers',
    brand: 'Bespoke Savile Row',
    color: 'Flint Charcoal',
    material: 'Fox Brothers 370g Flannel',
    wearCount: 62,
    costPerWear: '€21.50',
    versatilityScore: 99,
    unlockedCombos: 41,
    icon: '👖'
  },
  {
    id: '5',
    category: 'footwear',
    name: 'Burnished Penny Loafers',
    brand: 'John Lobb',
    color: 'Museum Dark Brown',
    material: 'French Full-Grain Box Calf',
    wearCount: 74,
    costPerWear: '€18.20',
    versatilityScore: 97,
    unlockedCombos: 38,
    icon: '👞'
  },
  {
    id: '6',
    category: 'accessories',
    name: 'Sub-Second Mechanical Horology',
    brand: 'A. Lange & Söhne',
    color: 'Rose Gold & Argenté',
    material: '18k Pink Gold / Crocodile',
    wearCount: 110,
    costPerWear: '€84.00',
    versatilityScore: 95,
    unlockedCombos: 55,
    icon: '⌚'
  },
  {
    id: '7',
    category: 'outerwear',
    name: 'Supple Lambskin Suede Overshirt',
    brand: 'Zegna Oasi',
    color: 'Caramel Toffee',
    material: 'Ultra-Supple French Suede',
    wearCount: 22,
    costPerWear: '€95.00',
    versatilityScore: 91,
    unlockedCombos: 16,
    icon: '🧥'
  },
  {
    id: '8',
    category: 'footwear',
    name: 'Hand-Patinated Leather Chelsea Boots',
    brand: 'Berluti',
    color: 'Tobacco Patina',
    material: 'Venezia Calf Leather',
    wearCount: 46,
    costPerWear: '€39.00',
    versatilityScore: 93,
    unlockedCombos: 28,
    icon: '👢'
  }
];

export const WardrobeStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(WARDROBE_DATA[0]);

  const filteredItems = activeTab === 'all'
    ? WARDROBE_DATA
    : WARDROBE_DATA.filter((i) => i.category === activeTab);

  return (
    <section id="wardrobe" className="py-24 relative bg-[#0C0C10] border-t border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4AF37]/25 bg-[#14141C]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#EADB9B]">
              THE DIGITAL CLOSET MATRIX
            </span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-[#FBF9F4]">
            Your Real Clothes, <br />
            <span className="italic font-light gold-gradient-text">Digitally Curated & Tracked</span>
          </h2>

          <p className="text-sm sm:text-base text-[#9C97A5] font-light">
            Every garment you photograph is indexed with fabric physics, color temperature, and wear frequency. 
            Know your true cost-per-wear and unlock untapped outfit synergies.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: 'All Garments' },
            { id: 'outerwear', label: 'Outerwear' },
            { id: 'tailoring', label: 'Tailoring' },
            { id: 'knitwear', label: 'Knitwear' },
            { id: 'footwear', label: 'Footwear' },
            { id: 'accessories', label: 'Accoutrements' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8922A] text-[#0A0A0C] font-semibold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-[#15151C] text-[#A29EA9] hover:text-[#FFF] border border-[#23232D]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Garments Grid & Active Inspection Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Items Grid (8 columns) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer group ${
                  selectedItem?.id === item.id
                    ? 'border-[#D4AF37] bg-[#1A1A24] shadow-[0_0_20px_rgba(212,175,55,0.18)]'
                    : 'border-[#22222B] bg-[#121217] hover:border-[#D4AF37]/50 hover:bg-[#15151D]'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1A1A22] border border-[#2C2C38] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                      Score: {item.versatilityScore}%
                    </span>
                    <span className="block text-[10px] text-[#787582] mt-1 font-mono">{item.costPerWear}/wear</span>
                  </div>
                </div>

                <div className="text-[10px] uppercase font-mono tracking-wider text-[#A09CA8] mb-0.5">
                  {item.brand}
                </div>
                <h4 className="text-sm font-semibold text-[#ECE9E3] mb-1 group-hover:text-[#FAF8F5]">
                  {item.name}
                </h4>
                <div className="text-[11px] text-[#86838F] mb-3">
                  {item.color} · {item.material}
                </div>

                <div className="pt-3 border-t border-[#1F1F28] flex items-center justify-between text-[11px] text-[#9E9BA6]">
                  <span>Worn {item.wearCount} times</span>
                  <span className="text-[#D4AF37] font-medium">Unlocks +{item.unlockedCombos} outfits</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Item Inspection Panel (4 columns) */}
          <div className="lg:col-span-4 sticky top-28">
            {selectedItem ? (
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 shadow-2xl relative">
                
                <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                    AI GARMENT TELEMETRY
                  </span>
                  <span className="text-[10px] font-mono text-[#787582]">ID: OTD-G-{selectedItem.id}</span>
                </div>

                <div className="my-6 text-center">
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-[#1C1C24] to-[#121217] border border-[#D4AF37]/30 flex items-center justify-center text-5xl shadow-[0_0_25px_rgba(212,175,55,0.15)] mb-4">
                    {selectedItem.icon}
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-mono block">
                    {selectedItem.brand}
                  </span>
                  <h3 className="font-serif-luxury text-2xl text-[#FAF8F5] mt-1">
                    {selectedItem.name}
                  </h3>
                  <p className="text-xs text-[#9B97A3] mt-1">
                    {selectedItem.material}
                  </p>
                </div>

                <div className="space-y-3.5 bg-[#14141B] p-4 rounded-2xl border border-[#23232C] text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#888591]">Fabric Drape Index:</span>
                    <span className="font-medium text-[#ECE9E3]">Heavy / Structured Tailored</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#888591]">Cost Per Wear (CPW):</span>
                    <span className="font-mono text-[#EADB9B] font-semibold">{selectedItem.costPerWear}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#888591]">Closet Synergy:</span>
                    <span className="text-[#10B981] font-semibold">Connects to 82% of Wardrobe</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#888591]">Optimal Season:</span>
                    <span className="font-medium text-[#ECE9E3]">Autumn / Winter / Early Spring</span>
                  </div>
                </div>

                <div className="mt-5 text-[11px] text-[#A6A2AE] bg-[#161620] p-3 rounded-xl border border-[#242431] leading-relaxed">
                  <strong className="text-[#D4AF37] block mb-1">Stylist Recommendation:</strong>
                  "Pair this with high-twist wool trousers for formal meetings, or dressed down with Japanese raw denim and an ivory cashmere crewneck for off-duty gallery visits."
                </div>

              </div>
            ) : null}
          </div>

        </div>

      </div>
    </section>
  );
};
