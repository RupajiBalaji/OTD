import React, { useState } from 'react';
import { Sparkles, Heart, Layers, Shirt, Compass, Tag, CheckCircle2, AlertTriangle, Zap, UserCheck } from 'lucide-react';
import { useCloset } from '../context/ClosetContext';
import { PERSONA_WARDROBES, type PersonaType, type PersonaMatchingSet, type PersonaMismatchingSet } from '../data/personaWardrobes';

const PERSONA_CONFIG: { id: PersonaType; label: string; badge: string; desc: string }[] = [
  { id: 'women', label: 'Women', badge: 'Haute Editorial', desc: 'Silk slip dresses, Saint Laurent tailoring & fluid drapery' },
  { id: 'man', label: 'Man', badge: 'Sartorial Heritage', desc: 'Savile Row suiting, undyed cashmere & Barbour outerwear' },
  { id: 'boy', label: 'Boy', badge: 'Academy Prep', desc: 'Nautical Breton knits, linen suits & British cricket sweaters' },
  { id: 'girl', label: 'Girl', badge: 'Whimsical Elegance', desc: 'Smocked gingham sundresses, floral voile & velvet partywear' },
];

const renderCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('dress') || cat.includes('gown') || cat.includes('slip') || cat.includes('top') || cat.includes('shirt') || cat.includes('knit') || cat.includes('tee')) {
    return <Shirt className="w-4 h-4 text-[var(--gold-primary)]" />;
  }
  if (cat.includes('jacket') || cat.includes('blazer') || cat.includes('coat') || cat.includes('outerwear') || cat.includes('layer') || cat.includes('cape')) {
    return <Layers className="w-4 h-4 text-[var(--gold-primary)]" />;
  }
  if (cat.includes('trouser') || cat.includes('pant') || cat.includes('bottom') || cat.includes('short') || cat.includes('skirt')) {
    return <Compass className="w-4 h-4 text-[var(--gold-primary)]" />;
  }
  if (cat.includes('shoe') || cat.includes('footwear') || cat.includes('sandal') || cat.includes('boot') || cat.includes('pump') || cat.includes('loafer')) {
    return <Compass className="w-4 h-4 text-[var(--gold-primary)]" />;
  }
  return <Tag className="w-4 h-4 text-[var(--gold-primary)]" />;
};

export const InteractiveStylist: React.FC = () => {
  const { activePersona, switchPersona } = useCloset();
  const [mode, setMode] = useState<'matching' | 'mismatching'>('matching');
  const [selectedSetIndex, setSelectedSetIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedCount, setSavedCount] = useState(184);
  const [hasLiked, setHasLiked] = useState(false);

  const personaData = PERSONA_WARDROBES[activePersona] || PERSONA_WARDROBES.women;
  const currentSets = mode === 'matching' ? personaData.matchingSets : personaData.mismatchingSets;
  const activeSet = currentSets[selectedSetIndex] || currentSets[0];

  const handlePersonaSelect = (persona: PersonaType) => {
    setIsGenerating(true);
    switchPersona(persona);
    setSelectedSetIndex(0);
    setTimeout(() => setIsGenerating(false), 220);
  };

  const handleModeChange = (newMode: 'matching' | 'mismatching') => {
    setIsGenerating(true);
    setMode(newMode);
    setSelectedSetIndex(0);
    setTimeout(() => setIsGenerating(false), 220);
  };

  const handleSetChange = (idx: number) => {
    setIsGenerating(true);
    setSelectedSetIndex(idx);
    setTimeout(() => setIsGenerating(false), 180);
  };

  const isMatching = mode === 'matching';
  const matchingSet = isMatching ? (activeSet as PersonaMatchingSet) : null;
  const mismatchingSet = !isMatching ? (activeSet as PersonaMismatchingSet) : null;

  return (
    <section id="atelier" className="py-20 md:py-28 relative bg-[var(--bg-canvas-subtle)] border-y border-[var(--border-card)] transition-colors duration-300">
      {/* Background fine grid */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--gold-primary)_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[var(--border-gold)] bg-[var(--pill-bg)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[var(--gold-primary)] font-mono">
              CURATED ENSEMBLE ATELIER
            </span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-[var(--text-heading)]">
            Explore 4 Wardrobes: <br />
            <span className="italic font-light gold-gradient-text">Matching Harmony vs. High-Tension Clash</span>
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-body)] font-light">
            Toggle between Women, Man, Boy, and Girl capsules. Experience 4 perfectly harmonized matching sets 
            alongside 4 high-contrast mismatching ensembles with professional editorial sartorial critique.
          </p>
        </div>

        {/* 1. Persona Selector Bar */}
        <div className="mb-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-[var(--text-muted)] flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
              01 / Select Character Wardrobe
            </span>
            <span className="text-xs font-mono text-[var(--gold-primary)]">
              4 Distinct Capsules
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PERSONA_CONFIG.map((p) => {
              const isSelected = activePersona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePersonaSelect(p.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[var(--gold-primary)] bg-[var(--pill-bg)] shadow-md ring-1 ring-[var(--gold-primary)]/30'
                      : 'border-[var(--border-card)] bg-[var(--bg-card)] hover:border-[var(--gold-primary)]/60 text-[var(--text-body)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-[var(--text-heading)]">
                      {p.label}
                    </span>
                    <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                      isSelected
                        ? 'bg-[var(--gold-primary)] text-black'
                        : 'bg-[var(--bg-card-inner)] text-[var(--gold-primary)] border border-[var(--border-gold)]/40'
                    }`}>
                      {isSelected ? 'Active' : p.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] leading-snug line-clamp-2">
                    {p.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Mode Selector: Harmonious Matching vs. High-Contrast Mismatching */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="glass-card rounded-2xl p-2 border border-[var(--border-card)] grid grid-cols-1 sm:grid-cols-2 gap-2 shadow-md">
            
            {/* Matching Mode Button */}
            <button
              onClick={() => handleModeChange('matching')}
              className={`p-3.5 rounded-xl text-left transition-all duration-300 cursor-pointer flex items-center gap-3.5 ${
                isMatching
                  ? 'bg-gradient-to-r from-[var(--gold-primary)]/20 via-[var(--gold-primary)]/10 to-transparent border border-[var(--gold-primary)] text-[var(--text-heading)] shadow-sm'
                  : 'text-[var(--text-body)] hover:bg-[var(--bg-card-inner)] border border-transparent'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isMatching ? 'bg-[var(--gold-primary)] text-black shadow-md' : 'bg-[var(--bg-card-inner)] text-[var(--gold-primary)]'
              }`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  <span>✦ Curated Matching Sets</span>
                  <span className="text-[10px] font-mono text-[var(--gold-primary)] font-bold">98%+ Harmony</span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Chromatic balance, synchronized textiles & tonal symmetry
                </div>
              </div>
            </button>

            {/* Mismatching Mode Button */}
            <button
              onClick={() => handleModeChange('mismatching')}
              className={`p-3.5 rounded-xl text-left transition-all duration-300 cursor-pointer flex items-center gap-3.5 ${
                !isMatching
                  ? 'bg-gradient-to-r from-rose-500/20 via-amber-500/10 to-transparent border border-rose-400 text-[var(--text-heading)] shadow-sm'
                  : 'text-[var(--text-body)] hover:bg-[var(--bg-card-inner)] border border-transparent'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                !isMatching ? 'bg-rose-500 text-white shadow-md' : 'bg-[var(--bg-card-inner)] text-rose-400'
              }`}>
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  <span>⚡ High-Contrast Mismatching Sets</span>
                  <span className="text-[10px] font-mono text-rose-400 font-bold">Tension & Clash</span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Textural friction, clashing formalities & sartorial critique
                </div>
              </div>
            </button>

          </div>
        </div>

        {/* 3. Ensemble Set Picker Tabs */}
        <div className="max-w-5xl mx-auto mb-8 flex flex-wrap items-center justify-center gap-2">
          {currentSets.map((set, idx) => {
            const isCurrent = selectedSetIndex === idx;
            return (
              <button
                key={set.id}
                onClick={() => handleSetChange(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isCurrent
                    ? isMatching
                      ? 'gold-btn shadow-md ring-1 ring-[var(--gold-primary)]/40'
                      : 'bg-rose-500 text-white shadow-md ring-1 ring-rose-400'
                    : 'bg-[var(--bg-card)] text-[var(--text-body)] hover:border-[var(--gold-primary)] border border-[var(--border-card)]'
                }`}
              >
                <span className="font-mono text-[10px] opacity-75">0{idx + 1}</span>
                <span className="truncate max-w-[200px]">{set.title}</span>
              </button>
            );
          })}
        </div>

        {/* 4. Live Output Showcase */}
        <div className={`transition-opacity duration-300 ${isGenerating ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[var(--border-card)] max-w-6xl mx-auto shadow-2xl relative overflow-hidden">
            
            {/* Top Spec Sheet Banner */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-[var(--border-card)] gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-[10px] font-mono tracking-[0.25em] uppercase font-bold px-2.5 py-0.5 rounded-md ${
                    isMatching
                      ? 'bg-[var(--gold-primary)]/15 text-[var(--gold-primary)] border border-[var(--border-gold)]'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-400/40'
                  }`}>
                    {isMatching ? '✦ HARMONIOUS CHROMATIC ENSEMBLE' : '⚡ HIGH-TENSION SARTORIAL CLASH'}
                  </span>
                  <span className="text-xs text-[var(--border-card)]">·</span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    {personaData.displayName} Wardrobe · {activeSet.formality}
                  </span>
                </div>
                <h3 className="font-serif-luxury text-2xl sm:text-4xl font-normal text-[var(--text-heading)]">
                  {activeSet.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-body)] mt-1 font-light italic">
                  Theme: {activeSet.theme}
                </p>
              </div>

              {/* Score Metric Badge */}
              <div className="flex items-center gap-4 self-start lg:self-center">
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    {isMatching ? 'Chromatic Harmony' : 'Sartorial Friction Index'}
                  </div>
                  <div className={`text-2xl sm:text-3xl font-serif-luxury font-bold ${
                    isMatching ? 'gold-gradient-text' : 'text-rose-400'
                  }`}>
                    {isMatching ? `${matchingSet?.harmonyScore}%` : `${mismatchingSet?.tensionScore}%`}
                  </div>
                </div>

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border ${
                  isMatching
                    ? 'bg-[var(--bg-card-inner)] border-[var(--border-gold)] text-[var(--gold-primary)]'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}>
                  {isMatching ? <Sparkles className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
              </div>
            </div>

            {/* Main Content Layout: High-Res Editorial Photography (Left) + Pieces Breakdown (Right) */}
            <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: High-Res Fashion Photography Card (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card-inner)] overflow-hidden shadow-xl relative group">
                  <div className="aspect-[3/4] w-full overflow-hidden bg-black/5 relative">
                    <img
                      src={activeSet.imageUrl}
                      alt={activeSet.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                    
                    {/* Floating Overlay Info */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full font-bold backdrop-blur-md mb-2 inline-block ${
                        isMatching ? 'bg-black/60 text-[var(--gold-primary)] border border-[var(--gold-primary)]/40' : 'bg-rose-950/80 text-rose-300 border border-rose-400/50'
                      }`}>
                        {isMatching ? 'Verified Harmony' : 'Editorial Friction'}
                      </span>
                      <h4 className="text-base font-serif-luxury font-semibold text-white drop-shadow-md">
                        {activeSet.title}
                      </h4>
                      <p className="text-xs text-stone-300 line-clamp-1 mt-0.5">
                        {personaData.displayName} · {activeSet.formality}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Harmonized / Clashing Color Spectrum Palette */}
                <div className="p-4 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-card)]">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-muted)] block mb-3 font-semibold">
                    {isMatching ? 'Synchronized Palette Spectrum' : 'Dissonant Color Intersections'}
                  </span>
                  <div className="flex items-center gap-3">
                    {activeSet.palette.map((col, idx) => (
                      <div key={idx} className="group relative">
                        <div
                          className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/15 shadow-sm transition-transform group-hover:scale-110 cursor-pointer"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] bg-[var(--bg-card-elevated)] text-[var(--text-heading)] px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-[var(--border-card)] shadow-md font-mono z-30">
                          {col.name} ({col.hex})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Piece-by-Piece Analysis & Stylist Rationale (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Pieces Specification Grid */}
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-muted)] mb-3 font-semibold flex items-center justify-between">
                    <span>Ensemble Composition & Layering</span>
                    <span>{activeSet.pieces.length} Tailored Elements</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {activeSet.pieces.map((piece, idx) => (
                      <div
                        key={idx}
                        className="bg-[var(--bg-card-inner)] rounded-2xl p-4 border border-[var(--border-card)] hover:border-[var(--gold-primary)] transition-all duration-300 group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] uppercase font-mono tracking-widest text-[var(--text-muted)]">
                              Layer 0{idx + 1} · {piece.category}
                            </span>
                            <div className="w-6 h-6 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] flex items-center justify-center">
                              {renderCategoryIcon(piece.category)}
                            </div>
                          </div>

                          <h4 className="text-xs font-semibold text-[var(--text-heading)] group-hover:text-[var(--gold-primary)] line-clamp-2 mb-1.5 leading-snug">
                            {piece.name}
                          </h4>

                          <p className="text-[11px] text-[var(--text-body)] italic line-clamp-2 mb-2 font-light">
                            "{piece.note}"
                          </p>
                        </div>

                        <div className="pt-2.5 border-t border-[var(--border-card)] space-y-1 text-[10px]">
                          <div className="flex items-center justify-between">
                            <span className="text-[var(--text-muted)]">Color:</span>
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/20"
                                style={{ backgroundColor: piece.hex }}
                              />
                              <span className="text-[var(--text-heading)] font-medium font-mono">{piece.color}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[var(--text-muted)]">Textile:</span>
                            <span className="text-[var(--text-body)] truncate max-w-[130px] font-mono">{piece.fabric}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stylist Rationale & Contrast Factor Section */}
                <div className="space-y-3.5">
                  {/* Stylist Rationale Box */}
                  <div className={`p-5 rounded-2xl border ${
                    isMatching
                      ? 'bg-[var(--bg-card-inner)] border-[var(--border-card)]'
                      : 'bg-rose-500/5 border-rose-500/20'
                  }`}>
                    <div className="flex items-start gap-3.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-serif-luxury font-bold border ${
                        isMatching
                          ? 'bg-[var(--pill-bg)] border-[var(--border-gold)] text-[var(--gold-primary)]'
                          : 'bg-rose-500/20 border-rose-400 text-rose-400'
                      }`}>
                        OTD
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                          {isMatching ? 'Editorial Stylist Rationale' : 'Sartorial Collision Critique'}
                        </div>
                        <p className="text-xs text-[var(--text-body)] italic leading-relaxed">
                          "{activeSet.stylistRationale}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contrast & Clash Factor (Mismatching Only) */}
                  {!isMatching && mismatchingSet?.contrastFactor && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs">
                      <div className="flex items-center gap-2 mb-1 text-amber-500 font-mono font-bold text-[10px] uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Architectural Conflict Factor</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-body)] leading-relaxed">
                        {mismatchingSet.contrastFactor}
                      </p>
                    </div>
                  )}

                  {/* Matching Occasions (Matching Only) */}
                  {isMatching && matchingSet?.occasions && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] mr-1">
                        Recommended Venues:
                      </span>
                      {matchingSet.occasions.map((occ, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[var(--pill-bg)] border border-[var(--border-gold)]/40 text-[var(--gold-primary)]"
                        >
                          {occ}
                        </span>
                      ))}
                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* Bottom Interaction & Verification Bar */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[var(--text-muted)] pt-4 border-t border-[var(--border-card)] gap-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setHasLiked(!hasLiked);
                    setSavedCount(hasLiked ? savedCount - 1 : savedCount + 1);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                    hasLiked
                      ? 'border-[#E11D48] bg-[#E11D48]/15 text-[#E11D48]'
                      : 'border-[var(--border-card)] hover:border-[var(--gold-primary)] text-[var(--text-heading)]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current text-[#E11D48]' : ''}`} />
                  <span className="text-[11px] font-medium">{savedCount} Curators Saved</span>
                </button>
              </div>

              <div className="text-[10px] font-mono text-[var(--gold-primary)] font-semibold tracking-wider uppercase">
                Grounded Fashion Intelligence · Pinterest & Runway Curated
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
