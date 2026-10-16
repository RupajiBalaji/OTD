import { ArrowUpRight } from 'lucide-react';


export const Lookbook: React.FC = () => {
  const editorialLooks = [
    {
      title: 'The Milanese Nocturne',
      aesthetic: 'Evening Sartorial',
      palette: ['#0B1325', '#FAFAFA', '#D4AF37'],
      caption: 'Double-breasted barathea wool paired with silk grosgrain collar and evening velvet slippers.',
      model: 'Lookbook Edition IV · Milan',
      icon: '🍸'
    },
    {
      title: 'Alpine Cashmere Monolith',
      aesthetic: 'Quiet Luxury Leisure',
      palette: ['#8E5A3C', '#DED5C4', '#2D3A2F'],
      caption: 'Undyed 6-ply Scottish cashmere layered beneath Spanish entrefino shearling with brushed corduroy.',
      model: 'Lookbook Edition VII · St. Moritz',
      icon: '🏔️'
    },
    {
      title: 'Architectural Shadowplay',
      aesthetic: 'Contemporary Minimalist',
      palette: ['#111113', '#4A4D55', '#E6E4DD'],
      caption: 'Unstructured wool crepe draped with seamless mock-neck and fluid Japanese triacetate.',
      model: 'Lookbook Edition IX · Tokyo Aoyama',
      icon: '🏛️'
    }
  ];

  return (
    <section id="lookbook" className="py-24 relative bg-[#0C0C10] border-t border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#D4AF37] block">
              EDITORIAL CURATION
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-[#FAF8F5]">
              Maison OTD <br />
              <span className="italic font-light gold-gradient-text">Private Lookbook</span>
            </h2>
          </div>
          <p className="text-sm text-[#9C98A6] max-w-md font-light">
            A perpetual stream of bespoke sartorial compositions curated by our international fashion directors and neural networks.
          </p>
        </div>

        {/* Editorial 3-Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {editorialLooks.map((look, idx) => (
            <div
              key={idx}
              className="glass-card glass-card-interactive rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/20 flex flex-col justify-between group"
            >
              <div>
                {/* Lookbook Badge / Location */}
                <div className="flex items-center justify-between pb-4 border-b border-[#22222C] mb-6">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
                    {look.model}
                  </span>
                  <span className="text-2xl">{look.icon}</span>
                </div>

                {/* Aesthetic Tag */}
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#8E8A98] block mb-1">
                  {look.aesthetic}
                </span>

                {/* Title */}
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#FAF8F5] mb-4 group-hover:text-[#FFF8DE] transition-colors">
                  {look.title}
                </h3>

                {/* Caption */}
                <p className="text-xs text-[#A8A4B0] font-light leading-relaxed mb-6">
                  "{look.caption}"
                </p>
              </div>

              {/* Palette & Synergy */}
              <div className="pt-4 border-t border-[#1F1F28] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {look.palette.map((p, pIdx) => (
                    <div
                      key={pIdx}
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: p }}
                    />
                  ))}
                  <span className="text-[10px] text-[#767380] ml-1">Chromatic DNA</span>
                </div>

                <div className="text-[11px] font-mono text-[#D4AF37] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
