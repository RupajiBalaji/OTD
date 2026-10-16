import { Sparkles, Download, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onOpenDownload: () => void;
  onExploreDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDownload, onExploreDemo }) => {
  return (
    <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden transition-colors duration-300">
      {/* Background radial gold glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[var(--gold-primary)]/8 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[var(--border-gold)] bg-[var(--pill-bg)] backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[var(--gold-primary)] animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--gold-primary)] font-mono">
                OTD · OUTFIT OF THE DAY · AI STYLING
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[var(--text-heading)] leading-[1.08]">
              Your Perfect Outfit, <br />
              <span className="italic font-light gold-gradient-text">
                Every Single Day.
              </span>
            </h1>


            {/* Description */}
            <p className="text-base sm:text-lg text-[var(--text-body)] font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Digitize your real-world wardrobe in minutes. Receive daily, climate-aware, calendar-synchronized 
              ensembles with bespoke styling rationale—engineered to maximize versatility and eliminate outfit fatigue.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenDownload}
                className="gold-btn whitespace-nowrap w-full sm:w-auto px-7 py-3.5 rounded-full text-xs flex items-center justify-center gap-2.5 group cursor-pointer shadow-lg"
              >
                <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                <span>Download Android APK</span>
                <span className="bg-black/20 text-[10px] px-2 py-0.5 rounded font-mono">v1.0.0</span>
              </button>

              <button
                onClick={onExploreDemo}
                className="gold-btn-outline whitespace-nowrap w-full sm:w-auto px-6 py-3.5 rounded-full text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Interactive Atelier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-[var(--border-card)] grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[var(--gold-primary)]">99.4%</p>
                <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mt-0.5 font-medium">Style Cohesion</p>
              </div>
              <div>
                <p className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[var(--gold-primary)]">3.4x</p>
                <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mt-0.5 font-medium">Closet Utilization</p>
              </div>
              <div>
                <p className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[var(--gold-primary)]">0 Sec</p>
                <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mt-0.5 font-medium">Morning Hesitation</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Centerpiece — Interactive Luxury Outfit Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Golden Aura */}
              <div className="absolute -inset-1 rounded-3xl bg-[var(--gold-primary)]/15 blur-xl opacity-75" />

              {/* Main Card */}
              <div className="relative glass-card rounded-3xl p-6 sm:p-7 border border-[var(--border-card)] animate-float-slow">
                
                {/* Top Card Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border-card)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                    <span className="text-[11px] uppercase tracking-widest text-[var(--text-heading)] font-semibold">
                      TODAY'S CURATED ENSEMBLE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--gold-primary)] px-2 py-0.5 rounded border border-[var(--border-gold)] bg-[var(--pill-bg)] font-semibold">
                    OTD #0849
                  </span>
                </div>

                {/* Event Context Header */}
                <div className="mt-4 flex items-center justify-between bg-[var(--bg-card-inner)] p-3 rounded-xl border border-[var(--border-card)]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] block font-medium">Occasion</span>
                    <span className="text-xs font-semibold text-[var(--text-heading)]">Private Gallerist Vernissage</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] block font-medium">Weather Synced</span>
                    <span className="text-xs font-mono text-[var(--text-heading)]">Paris · 15°C Overcast</span>
                  </div>
                </div>

                {/* Outfit Visual Grid */}
                <div className="mt-5 space-y-3">
                  {/* Item 1 */}
                  <div className="flex items-center gap-3.5 p-2.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] hover:border-[var(--gold-primary)] transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-[var(--bg-card-elevated)] flex items-center justify-center text-xl shadow-sm border border-[var(--border-card)]">
                      🧥
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-[var(--text-heading)] truncate">Double-Breasted Cashmere Coat</span>
                        <span className="text-[10px] font-mono text-[var(--gold-primary)] ml-2 font-medium">Midnight Noir</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] block">Loro Piana Weave · Layer 01</span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center gap-3.5 p-2.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] hover:border-[var(--gold-primary)] transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-[var(--bg-card-elevated)] flex items-center justify-center text-xl shadow-sm border border-[var(--border-card)]">
                      👔
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-[var(--text-heading)] truncate">Silk-Merino High Collar Knit</span>
                        <span className="text-[10px] font-mono text-[var(--gold-primary)] ml-2 font-medium">Ivory Silk</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] block">Thermal Regulating · Layer 02</span>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center gap-3.5 p-2.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] hover:border-[var(--gold-primary)] transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-[var(--bg-card-elevated)] flex items-center justify-center text-xl shadow-sm border border-[var(--border-card)]">
                      👖
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-[var(--text-heading)] truncate">Tailored Forward-Pleat Trousers</span>
                        <span className="text-[10px] font-mono text-[var(--gold-primary)] ml-2 font-medium">Deep Charcoal</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] block">High-Rise English Drape</span>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="flex items-center gap-3.5 p-2.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] hover:border-[var(--gold-primary)] transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-[var(--bg-card-elevated)] flex items-center justify-center text-xl shadow-sm border border-[var(--border-card)]">
                      👞
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-[var(--text-heading)] truncate">Wholecut Burnished Calf Loafers</span>
                        <span className="text-[10px] font-mono text-[var(--gold-primary)] ml-2 font-medium">Espresso Patina</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] block">Goodyear Welted · Finishing Base</span>
                    </div>
                  </div>
                </div>

                {/* Stylist Rationale Box */}
                <div className="mt-4 p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-[11px] leading-relaxed text-[var(--text-body)]">
                  <span className="font-semibold text-[var(--gold-primary)] flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3 h-3 text-[var(--gold-primary)]" /> Stylist Intelligence Note:
                  </span>
                  "The deep midnight hue of the coat grounds the luminous ivory knit, creating high-contrast elegance ideal for gallery lighting without feeling overly stiff."
                </div>

                {/* Quick Interactive Tags */}
                <div className="mt-4 flex items-center justify-between text-[10px] text-[var(--text-muted)] border-t border-[var(--border-card)] pt-3">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> 100% Wardrobe In-Stock
                  </span>
                  <span className="text-[var(--gold-primary)] font-semibold tracking-wide">
                    Cohesion Rating: 98.8 / 100
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
