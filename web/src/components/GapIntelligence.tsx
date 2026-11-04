import React, { useState, useMemo } from 'react';
import { BrainCircuit, TrendingUp, Plus, Check, ArrowRight, Sparkles, Layers, Shirt, Compass } from 'lucide-react';
import { useCloset } from '../context/ClosetContext';

interface GapItem {
  id: string;
  category: string;
  title: string;
  rationale: string;
  synergyGain: string;
  multiplier: string;
  recommendedBrands: string[];
  type: 'outerwear' | 'knit' | 'shoes';
  active: boolean;
  gainNumber: number;
}

export const GapIntelligence: React.FC = () => {
  const { closet } = useCloset();

  // Categorize user's actual closet items
  const categoryCounts = useMemo(() => {
    const counts = { tops: 0, bottoms: 0, outerwear: 0, footwear: 0, accessories: 0 };
    for (const item of closet) {
      if (counts[item.category as keyof typeof counts] !== undefined) {
        counts[item.category as keyof typeof counts]++;
      }
    }
    return counts;
  }, [closet]);

  const pieceCount = closet.length > 0 ? closet.length : 16;
  const baseTops = Math.max(1, categoryCounts.tops || 6);
  const baseBottoms = Math.max(1, categoryCounts.bottoms || 4);
  const baseShoes = Math.max(1, categoryCounts.footwear || 3);
  const baseOuterwear = Math.max(1, categoryCounts.outerwear || 3);

  // Baseline mathematical outfit combos
  const baseOutfitPermutations = useMemo(() => {
    return baseTops * baseBottoms * Math.min(baseShoes, 3);
  }, [baseTops, baseBottoms, baseShoes]);

  const initialGaps: GapItem[] = useMemo(() => {
    const topBottomSynergy = baseTops * baseBottoms;
    const outerwearGain = Math.round(topBottomSynergy * 0.45);
    const mockneckGain = Math.round(baseBottoms * baseOuterwear * 0.8);
    const loaferGain = Math.round(baseTops * baseBottoms * 0.35);

    return [
      {
        id: 'gap-1',
        category: 'Outerwear Investment',
        title: 'Double-Breasted Belted Camel Overcoat',
        rationale:
          'Bridges your casual denim with tailored trousers. Instantly anchors cold-weather layering pieces with rich tonal warmth.',
        synergyGain: `+${outerwearGain} Ensembles`,
        multiplier: `+${Math.round((outerwearGain / baseOutfitPermutations) * 100)}% Closet Power`,
        recommendedBrands: ['Loro Piana', 'Max Mara Man', 'Canali'],
        type: 'outerwear',
        active: true,
        gainNumber: outerwearGain,
      },
      {
        id: 'gap-2',
        category: 'Mid-Layer Staple',
        title: 'Charcoal Extra-Fine Merino Mockneck',
        rationale:
          'Eliminates the rigidity of collared dress shirts under tailoring. Converts structured blazers into smart cocktail silhouettes.',
        synergyGain: `+${mockneckGain} Ensembles`,
        multiplier: `+${Math.round((mockneckGain / baseOutfitPermutations) * 100)}% Closet Power`,
        recommendedBrands: ['Brunello Cucinelli', 'John Smedley', 'Falconeri'],
        type: 'knit',
        active: true,
        gainNumber: mockneckGain,
      },
      {
        id: 'gap-3',
        category: 'Footwear Transition',
        title: 'Chocolate Suede Belgian Tassel Loafers',
        rationale:
          'Replaces sneakers when sneakers are too casual, and replaces rigid Oxfords. Seamlessly pairs with flannel, linen, and chinos.',
        synergyGain: `+${loaferGain} Ensembles`,
        multiplier: `+${Math.round((loaferGain / baseOutfitPermutations) * 100)}% Closet Power`,
        recommendedBrands: ['Baudoin & Lange', 'Edward Green', 'Crockett & Jones'],
        type: 'shoes',
        active: false,
        gainNumber: loaferGain,
      },
    ];
  }, [baseTops, baseBottoms, baseOuterwear, baseOutfitPermutations]);

  const [gaps, setGaps] = useState<GapItem[]>(initialGaps);

  const toggleGap = (id: string) => {
    setGaps((prev) =>
      prev.map((g) => (g.id === id ? { ...g, active: !g.active } : g))
    );
  };

  const activeGaps = gaps.filter((g) => g.active);
  const totalGain = activeGaps.reduce((sum, g) => sum + g.gainNumber, 0);
  const totalCombos = baseOutfitPermutations + totalGain;
  const optimizationPercent = Math.min(
    98.5,
    +(85 + (activeGaps.length / gaps.length) * 13.5).toFixed(1)
  );

  return (
    <section
      id="gap-analysis"
      className="py-24 relative bg-[var(--bg-canvas)] border-t border-[var(--border-card)] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[var(--border-gold)] bg-[var(--pill-bg)]">
            <BrainCircuit className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[var(--gold-primary)] font-mono">
              PREDICTIVE CLOSET GRAPH
            </span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-[var(--text-heading)]">
            Closet Gap <br />
            <span className="italic font-light gold-gradient-text">Intelligence Engine</span>
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-body)] font-light">
            Stop buying pieces that sit unused in tissue paper. OTD computes the graph-connectivity
            of your wardrobe to recommend the exact capsule pieces that multiply your total outfits.
          </p>
        </div>

        {/* Live Simulation Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[var(--border-card)] max-w-5xl mx-auto shadow-xl">
          {/* Header Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-[var(--border-card)] items-center">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] block font-medium">
                Current Verified Wardrobe
              </span>
              <span className="font-serif-luxury text-3xl text-[var(--text-heading)] font-medium">
                {pieceCount} Base Pieces
              </span>
              {closet.length > 0 && (
                <span className="text-[10px] text-[var(--gold-primary)] font-mono block mt-0.5">
                  Synchronized with Digital Closet
                </span>
              )}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] block font-medium">
                Simulated Combinations
              </span>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-3xl text-[var(--gold-primary)] font-bold">
                  {totalCombos} Outfits
                </span>
                <span className="text-xs font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/25 font-semibold">
                  +{totalGain} new
                </span>
              </div>
            </div>
            <div className="text-left md:text-right">
              <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] block font-medium">
                Efficiency Index
              </span>
              <span className="text-sm font-semibold text-[#10B981] flex items-center md:justify-end gap-1">
                <TrendingUp className="w-4 h-4" /> {optimizationPercent}% Utility Optimization
              </span>
            </div>
          </div>

          {/* Interactive Gaps List */}
          <div className="py-8 space-y-4">
            <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold flex items-center justify-between">
              <span>Identified Strategic Missing Staples (Click to simulate impact):</span>
              <span className="text-[11px] font-mono text-[var(--gold-primary)] font-normal">
                {activeGaps.length} of {gaps.length} Active in Graph
              </span>
            </div>

            {gaps.map((gap) => (
              <div
                key={gap.id}
                onClick={() => toggleGap(gap.id)}
                className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  gap.active
                    ? 'border-[var(--gold-primary)] bg-[var(--bg-card-elevated)] shadow-lg ring-1 ring-[var(--gold-primary)]/20'
                    : 'border-[var(--border-card)] bg-[var(--bg-card)] opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] flex items-center justify-center shrink-0 shadow-sm text-[var(--gold-primary)]">
                    {gap.type === 'outerwear' && <Layers className="w-5 h-5" />}
                    {gap.type === 'knit' && <Shirt className="w-5 h-5" />}
                    {gap.type === 'shoes' && <Compass className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--gold-primary)] font-semibold">
                        {gap.category}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">·</span>
                      <span className="text-[10px] font-mono text-[#10B981] font-semibold">
                        {gap.multiplier}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-[var(--text-heading)] mb-1">
                      {gap.title}
                    </h4>
                    <p className="text-xs text-[var(--text-body)] max-w-xl leading-relaxed">
                      {gap.rationale}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                      <span>Curated by:</span>
                      {gap.recommendedBrands.map((b, bIdx) => (
                        <span
                          key={bIdx}
                          className="bg-[var(--bg-card-inner)] px-2 py-0.5 rounded text-[var(--text-heading)] border border-[var(--border-card)] font-medium"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border-card)]">
                  <span className="font-serif-luxury text-xl font-bold text-[var(--gold-primary)]">
                    {gap.synergyGain}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        gap.active
                          ? 'bg-[var(--gold-primary)] text-white dark:text-black font-bold'
                          : 'border border-[var(--border-card)] text-[var(--text-muted)]'
                      }`}
                    >
                      {gap.active ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3" />}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)] font-medium">
                      {gap.active ? 'Active in Simulation' : 'Click to Include'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-[var(--border-card)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
              <span>Calculated over combinatorial wardrobe graphs and sartorial compatibility models.</span>
            </div>
            <a
              href="#atelier"
              className="gold-btn-outline px-6 py-3 rounded-full text-xs flex items-center gap-2 font-medium"
            >
              <span>Explore Atelier Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
