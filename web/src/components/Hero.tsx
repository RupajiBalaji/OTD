import React from 'react';
import { ArrowRight, Compass, ShieldCheck, Sun, Sparkles } from 'lucide-react';
import { useCloset } from '../context/ClosetContext';

interface HeroProps {
  onOpenProfile: () => void;
  onOpenOnboarding: () => void;
  onExploreDemo?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenProfile, onOpenOnboarding: _onOpenOnboarding, onExploreDemo }) => {
  const { profile } = useCloset();

  const handleExplore = () => {
    if (onExploreDemo) {
      onExploreDemo();
    } else {
      const el = document.getElementById('atelier');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative overflow-hidden transition-colors duration-300">
      
      {/* 🌟 EDITORIAL HAUTE COUTURE HERO SECTION */}
      <section className="pt-10 pb-20 md:pt-14 md:pb-24 border-b border-[var(--border-card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* LEFT COLUMN: Editorial Narrative & Architectural Telemetry */}
            <div className="lg:col-span-6 space-y-7">
              
              {/* Micro-Eyebrow */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase font-semibold text-[var(--gold-primary)]">
                  AUTONOMOUS SARTORIAL INTELLIGENCE
                </span>
                <span className="h-[1px] w-12 bg-[var(--border-gold)]" />
              </div>

              {/* Editorial Luxury Headline */}
              <h1 className="font-serif-luxury text-4xl sm:text-6xl xl:text-7xl font-normal tracking-tight text-[var(--text-heading)] leading-[1.08]">
                The Art of Dressing, <br />
                <span className="italic font-light gold-gradient-text">Digitally Curated.</span>
              </h1>

              {/* Haute Subtitle */}
              <p className="text-sm sm:text-base text-[var(--text-body)] font-light leading-relaxed max-w-xl">
                Transform your physical wardrobe into an intelligent sartorial atelier. 
                OTD synchronizes your genuine closet inventory with hyper-local meteorology, 
                venue formality codes, and chromatic harmony for every destination.
              </p>

              {/* 3-Pillar Architectural Telemetry (Replaces Cheesy Emoji Pills) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-sm space-y-1.5">
                  <div className="flex items-center gap-2 text-[var(--gold-primary)]">
                    <Sun className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">01 / Climate</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-body)] leading-snug font-normal">
                    Thermal layer balance & fabric drape physics.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-sm space-y-1.5">
                  <div className="flex items-center gap-2 text-[var(--gold-primary)]">
                    <Compass className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">02 / Context</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-body)] leading-snug font-normal">
                    Formality tier alignment from terrace to black-tie.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-sm space-y-1.5">
                  <div className="flex items-center gap-2 text-[var(--gold-primary)]">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">03 / Grounded</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-body)] leading-snug font-normal">
                    100% verified closet pieces. Zero hallucinated items.
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleExplore}
                  className="px-8 py-4 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs sm:text-sm font-semibold tracking-wider hover:opacity-90 flex items-center gap-2.5 cursor-pointer shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Explore The Atelier</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </button>

                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="px-6 py-4 rounded-full border border-[var(--border-card)] bg-[var(--bg-card)] hover:border-[var(--gold-primary)] text-[var(--text-heading)] text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                  <span>Calibrate Style DNA ({profile.name})</span>
                </button>
              </div>

              {/* Sartorial Specifications Row (Replaces Fake 10K / 4.8 Rating) */}
              <div className="pt-6 border-t border-[var(--border-card)] grid grid-cols-3 gap-4 text-xs text-[var(--text-body)]">
                <div>
                  <strong className="text-base font-semibold font-mono text-[var(--text-heading)] block">0.02s</strong>
                  <span className="text-[11px] text-[var(--text-muted)]">Chromatic Matrix</span>
                </div>
                <div>
                  <strong className="text-base font-semibold font-mono text-[var(--text-heading)] block">100%</strong>
                  <span className="text-[11px] text-[var(--text-muted)]">Owned Inventory Match</span>
                </div>
                <div>
                  <strong className="text-base font-semibold font-mono text-[var(--text-heading)] block">ΔE &lt; 2.0</strong>
                  <span className="text-[11px] text-[var(--text-muted)]">Perceptual Harmony</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Quiet Luxury Photography & Curated Flat-Lay Card */}
            <div className="lg:col-span-6 relative">
              
              {/* High-Fashion Editorial Photography */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-card)] bg-neutral-900 aspect-[4/5] max-h-[600px] w-full group">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"
                  alt="High-End Editorial Styling Composition"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Handwritten Cursive Script Overlay in Open Negative Space */}
                <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10 pointer-events-none select-none">
                  <span className="font-script text-white text-3xl sm:text-5xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] -rotate-6 block">
                    Your style. Every place.
                  </span>
                </div>

                {/* Subtle vignette gradient for card contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 pointer-events-none" />
              </div>

              {/* Floating Haute Specification Card (Clean, Bespoke Luxury) */}
              <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-6 w-64 sm:w-72 glass-card rounded-2xl p-4 sm:p-5 border border-[var(--border-card)] shadow-2xl bg-[var(--bg-card)]/95 backdrop-blur-xl animate-in fade-in duration-700 z-20">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-card)]">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[var(--gold-primary)] font-bold block">
                      TONIGHT'S ENSEMBLE
                    </span>
                    <span className="text-xs font-semibold text-[var(--text-heading)]">
                      Rooftop Terrace · 21°C
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--pill-bg)] text-[var(--gold-primary)] border border-[var(--border-gold)] font-bold">
                    99.4% Harmony
                  </span>
                </div>

                {/* Tailored Pieces Specification List */}
                <div className="space-y-2.5 my-3.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20" style={{ backgroundColor: '#2A2D34' }} />
                      <span className="font-medium text-[var(--text-heading)] truncate">Wool Chalk-Stripe Blazer</span>
                    </div>
                    <span className="text-[9px] font-mono text-[var(--text-muted)] shrink-0 ml-1">Super 150s</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20" style={{ backgroundColor: '#F8F1E4' }} />
                      <span className="font-medium text-[var(--text-heading)] truncate">Silk-Cashmere Mock-Neck</span>
                    </div>
                    <span className="text-[9px] font-mono text-[var(--text-muted)] shrink-0 ml-1">18-Gauge</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20" style={{ backgroundColor: '#3B3A36' }} />
                      <span className="font-medium text-[var(--text-heading)] truncate">Pleated Crepe Trousers</span>
                    </div>
                    <span className="text-[9px] font-mono text-[var(--text-muted)] shrink-0 ml-1">Fluid Tab</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20" style={{ backgroundColor: '#544A40' }} />
                      <span className="font-medium text-[var(--text-heading)] truncate">Belgian Suede Loafers</span>
                    </div>
                    <span className="text-[9px] font-mono text-[var(--text-muted)] shrink-0 ml-1">Chocolate</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExplore}
                  className="gold-btn w-full py-2.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-[1.01] transition-all"
                >
                  <span>Inspect in Atelier</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                </button>
              </div>

              {/* Destination Aesthetic Vignettes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                {[
                  { name: 'Date Night', location: 'Rooftop Bistro', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=350&q=80' },
                  { name: 'Boardroom', location: 'Executive Suite', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=350&q=80' },
                  { name: 'Alpine Leisure', location: 'St. Moritz Fireside', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=350&q=80' },
                  { name: 'Soirée', location: 'Gallery Vernissage', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=350&q=80' },
                ].map(dest => (
                  <div
                    key={dest.name}
                    onClick={handleExplore}
                    className="group relative rounded-xl overflow-hidden aspect-[4/3] border border-[var(--border-card)] shadow-sm cursor-pointer"
                  >
                    <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/45 group-hover:bg-black/25 transition-colors flex flex-col justify-end p-2.5">
                      <span className="text-[10px] font-bold text-white drop-shadow-sm leading-tight">
                        {dest.name}
                      </span>
                      <span className="text-[8px] font-mono text-neutral-300 drop-shadow-sm uppercase">
                        {dest.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* 4 HORIZONTAL NUMBERED ARCHITECTURAL PHASES */}
          <div className="mt-16 pt-12 border-t border-[var(--border-card)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div
              onClick={() => {
                const el = document.getElementById('wardrobe');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="space-y-3 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[var(--gold-primary)] block">PHASE 01</span>
                  <h4 className="font-serif-luxury text-lg font-normal text-[var(--text-heading)] group-hover:text-[var(--gold-primary)] transition-colors">
                    Catalog Your Wardrobe
                  </h4>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:translate-x-1 group-hover:text-[var(--gold-primary)] transition-all" />
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--border-card)] bg-neutral-900 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=500&q=80"
                  alt="Digitize Wardrobe"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[var(--gold-primary)] block">PHASE 02</span>
                  <h4 className="font-serif-luxury text-lg font-normal text-[var(--text-heading)]">Telemetry Synchronization</h4>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--border-card)] bg-neutral-900 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=500&q=80"
                  alt="Location and Venue Synchronization"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[var(--gold-primary)] block">PHASE 03</span>
                  <h4 className="font-serif-luxury text-lg font-normal text-[var(--text-heading)]">Algorithmic Curation</h4>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--border-card)] bg-neutral-900 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=80"
                  alt="Algorithmic Outfit Curation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[var(--gold-primary)] block">PHASE 04</span>
                  <h4 className="font-serif-luxury text-lg font-normal text-[var(--text-heading)]">Sartorial Poise</h4>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--border-card)] bg-neutral-900 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80"
                  alt="Effortless Poise"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
