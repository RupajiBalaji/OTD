import { useState } from 'react';
import { BrainCircuit, TrendingUp, Plus, Check, ArrowRight } from 'lucide-react';


interface GapItem {
  id: string;
  category: string;
  title: string;
  rationale: string;
  synergyGain: string;
  multiplier: string;
  recommendedBrands: string[];
  icon: string;
  active: boolean;
}

export const GapIntelligence: React.FC = () => {
  const [gaps, setGaps] = useState<GapItem[]>([
    {
      id: 'gap-1',
      category: 'Outerwear Investment',
      title: 'Double-Breasted Belted Camel Overcoat',
      rationale: 'Bridges your casual denim with your formal tailoring. Instantly anchors 18 dormant winter pieces that lack warm-toned outerwear.',
      synergyGain: '+18 Ensembles',
      multiplier: '+38% Closet Power',
      recommendedBrands: ['Loro Piana', 'Max Mara Man', 'Canali'],
      icon: '🧥',
      active: true
    },
    {
      id: 'gap-2',
      category: 'Mid-Layer Staple',
      title: 'Charcoal Extra-Fine Merino Mockneck',
      rationale: 'Eliminates the stiffness of collared dress shirts under blazers. Converts 12 boardroom blazers into smart-evening cocktails.',
      synergyGain: '+14 Ensembles',
      multiplier: '+24% Closet Power',
      recommendedBrands: ['Brunello Cucinelli', 'John Smedley', 'Falconeri'],
      icon: '👕',
      active: true
    },
    {
      id: 'gap-3',
      category: 'Footwear Transition',
      title: 'Chocolate Suede Belgian Tassel Loafers',
      rationale: 'Replaces sneakers when sneakers are too casual, and replaces Oxfords when Oxfords are too rigid. Seamlessly pairs with flannel & chinos.',
      synergyGain: '+11 Ensembles',
      multiplier: '+19% Closet Power',
      recommendedBrands: ['Baudoin & Lange', 'Edward Green', 'Crockett & Jones'],
      icon: '👞',
      active: false
    }
  ]);

  const toggleGap = (id: string) => {
    setGaps(gaps.map(g => g.id === id ? { ...g, active: !g.active } : g));
  };

  const activeCount = gaps.filter(g => g.active).length;
  const totalCombos = 32 + (activeCount * 14);

  return (
    <section id="gap-analysis" className="py-24 relative bg-[#09090C] border-t border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4AF37]/25 bg-[#14141C]">
            <BrainCircuit className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#EADB9B]">
              PREDICTIVE CLOSET GRAPH
            </span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-[#FBF9F4]">
            Closet Gap <br />
            <span className="italic font-light gold-gradient-text">Intelligence Engine</span>
          </h2>

          <p className="text-sm sm:text-base text-[#9C97A5] font-light">
            Stop buying pieces that sit unused in tissue paper. OTD computes the graph-connectivity 
            of your wardrobe to recommend the exact capsule pieces that multiply your total outfits.
          </p>
        </div>

        {/* Live Simulation Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/30 max-w-5xl mx-auto shadow-2xl">
          
          {/* Header Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-[#D4AF37]/20 items-center">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#8A8693] block">Current Verified Wardrobe</span>
              <span className="font-serif-luxury text-3xl text-[#FAF8F5] font-medium">32 Base Pieces</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#8A8693] block">Simulated Combinations</span>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-3xl text-[#EADB9B] font-bold">{totalCombos} Outfits</span>
                <span className="text-xs font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/25">
                  +{activeCount * 14} new
                </span>
              </div>
            </div>
            <div className="text-left md:text-right">
              <span className="text-[10px] uppercase tracking-widest text-[#8A8693] block">Efficiency Index</span>
              <span className="text-sm font-semibold text-[#10B981] flex items-center md:justify-end gap-1">
                <TrendingUp className="w-4 h-4" /> 94.6% Utility Optimization
              </span>
            </div>
          </div>

          {/* Interactive Gaps List */}
          <div className="py-8 space-y-4">
            <div className="text-xs uppercase tracking-wider text-[#A5A1AD] font-medium">
              Identified Strategic Missing Staples (Click to simulate impact):
            </div>

            {gaps.map((gap) => (
              <div
                key={gap.id}
                onClick={() => toggleGap(gap.id)}
                className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  gap.active
                    ? 'border-[#D4AF37] bg-[#191924] shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                    : 'border-[#22222D] bg-[#121217] opacity-60 hover:opacity-90'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1C1C26] border border-[#2B2B38] flex items-center justify-center text-2xl shrink-0">
                    {gap.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#D4AF37]">
                        {gap.category}
                      </span>
                      <span className="text-xs text-[#52525E]">·</span>
                      <span className="text-[10px] font-mono text-[#10B981]">{gap.multiplier}</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-[#FBF9F4] mb-1">
                      {gap.title}
                    </h4>
                    <p className="text-xs text-[#9B97A3] max-w-xl leading-relaxed">
                      {gap.rationale}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-[#7C7886]">
                      <span>Curated by:</span>
                      {gap.recommendedBrands.map((b, bIdx) => (
                        <span key={bIdx} className="bg-[#1F1F2A] px-2 py-0.5 rounded text-[#D2CEE0] border border-[#2B2B38]">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#22222D]">
                  <span className="font-serif-luxury text-xl font-bold text-[#EADB9B]">
                    {gap.synergyGain}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      gap.active ? 'bg-[#D4AF37] text-[#0A0A0C]' : 'border border-[#444] text-[#444]'
                    }`}>
                      {gap.active ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3" />}
                    </span>
                    <span className="text-[11px] text-[#A29FA9]">
                      {gap.active ? 'Active in Simulation' : 'Click to Include'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#9E9BA6]">
              * Calculations powered by OTD Graph Neural Network over 400,000 sartorial rules.
            </div>
            <a
              href="#download"
              className="gold-btn-outline px-6 py-3 rounded-full text-xs flex items-center gap-2"
            >
              <span>Scan Your Wardrobe Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
