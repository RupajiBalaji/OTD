import { Camera, Calendar, Shirt, BrainCircuit, CheckCircle2 } from 'lucide-react';


export const Pillars: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: 'Bespoke Daily OTD Curation',
      subtitle: 'Hyper-Personalized Daily Ensembles',
      icon: Calendar,
      desc: 'Seamlessly links your daily calendar schedule with high-resolution meteorology forecasts and personal aesthetic DNA to generate instant, context-perfect outfits.',
      features: [
        'Forecast & temperature-aware layer balancing',
        'Meeting formality matching (Pitch vs Executive vs Casual)',
        'Wear-cycle rotation to prevent outfit repetition'
      ],
      tag: 'Morning Ritual Redefined'
    },
    {
      num: '02',
      title: 'Computer Vision Wardrobe Digitize',
      subtitle: 'Single-Snap Luxury Cataloging',
      icon: Camera,
      desc: 'Instantly isolate clothing items with AI edge-detection, remove clutter backgrounds, detect fabric weave (cashmere, silk, linen), and catalog chromatic attributes.',
      features: [
        'Automatic 4K silhouette extraction',
        'Fabric & drape classification (Heavier/Draped/Structured)',
        'Zero manual tag typing required'
      ],
      tag: 'Effortless Digitization'
    },
    {
      num: '03',
      title: 'Virtual Fitting Studio',
      subtitle: 'Photorealistic Silhouette Drape',
      icon: Shirt,
      desc: 'Preview how garments interact before stepping into them. Test proportions, hem lengths, and color balances on digital silhouettes with accurate fabric physics.',
      features: [
        'Drape & layer interaction physics',
        'Silhouette ratio balancing (1/3 vs 2/3 golden ratio)',
        'Instant accessory pairing preview'
      ],
      tag: 'Zero-Friction Try-On'
    },
    {
      num: '04',
      title: 'Closet Gap & Intelligence Matrix',
      subtitle: 'Mathematical Wardrobe Expansion',
      icon: BrainCircuit,
      desc: 'Identifies missing key capsule pieces that act as modular connectors, unlocking dozens of brand-new combinations from your existing wardrobe with surgical precision.',
      features: [
        'Algorithmic outfit multiplier analytics',
        'Cost-per-wear minimization projections',
        'Curated high-luxury investment recommendations'
      ],
      tag: 'Smarter Investments'
    }
  ];

  return (
    <section id="pillars" className="py-24 relative bg-[#09090C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#D4AF37] block">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-[#FAF8F5]">
              The Four Pillars of <br />
              <span className="italic font-light gold-gradient-text">Wardrobe Intelligence</span>
            </h2>
          </div>
          <p className="text-sm text-[#9C98A6] max-w-md font-light">
            Every feature in Maison OTD is engineered to transform a disorganized closet into an intelligent, high-utility personal fashion house.
          </p>
        </div>

        {/* Pillars 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="glass-card glass-card-interactive rounded-3xl p-8 sm:p-10 border border-[#D4AF37]/20 relative overflow-hidden flex flex-col justify-between group"
              >
                {/* Background Number Accent */}
                <span className="absolute -top-4 -right-2 font-serif-luxury text-8xl sm:text-9xl font-bold text-[#D4AF37]/5 select-none pointer-events-none group-hover:text-[#D4AF37]/10 transition-colors">
                  {pillar.num}
                </span>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#171720] border border-[#D4AF37]/30 flex items-center justify-center text-[#EADB9B] shadow-inner group-hover:border-[#D4AF37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] px-3 py-1 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5">
                      {pillar.tag}
                    </span>
                  </div>

                  <div className="text-xs uppercase tracking-[0.18em] text-[#A6A2AE] font-medium mb-1">
                    {pillar.subtitle}
                  </div>

                  <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#FAF8F5] mb-4 group-hover:text-[#FFF8DE] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-[#8E8A98] font-light leading-relaxed mb-6">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#23232D] space-y-2.5">
                  {pillar.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5 text-xs text-[#CBC7BF]">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
