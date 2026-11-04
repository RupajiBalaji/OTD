import React, { useState } from 'react';
import { Sparkles, Plus, Tag, RefreshCw, Shirt, Sparkle, Layers, Compass, UserCheck } from 'lucide-react';
import { useCloset, type ClosetItem } from '../context/ClosetContext';
import { PERSONA_WARDROBES, type PersonaType } from '../data/personaWardrobes';

interface WardrobeStudioProps {
  onOpenAddPiece?: () => void;
}

const PERSONA_CONFIG: { id: PersonaType; label: string; badge: string; desc: string }[] = [
  { id: 'women', label: 'Women', badge: 'Haute Atelier', desc: 'Banarasi Silk Sarees, Zardozi Blouses, Slip Dresses, Tuxedos & Pants' },
  { id: 'man', label: 'Man', badge: 'Sartorial Heritage', desc: 'Savile Row Tailored Suits, Poplin Shirts, Chinos, Tees & Suede Jackets' },
  { id: 'boy', label: 'Boy', badge: 'Academy Prep', desc: 'Pants, Button-Down Shirts, Jackets, Sweaters & Everyday T-Shirts' },
  { id: 'girl', label: 'Girl', badge: 'Romantic & Festive', desc: 'Anarkali Chudidar Sets, Mulmul Kurtis, Party Dresses, Pants & T-Shirts' },
];

const renderGarmentFallback = (category: string) => {
  switch (category) {
    case 'tops':
      return <Shirt className="w-5 h-5 text-[var(--gold-primary)]" />;
    case 'bottoms':
      return <Compass className="w-5 h-5 text-[var(--gold-primary)]" />;
    case 'outerwear':
      return <Layers className="w-5 h-5 text-[var(--gold-primary)]" />;
    case 'footwear':
      return <Compass className="w-5 h-5 text-[var(--gold-primary)]" />;
    case 'accessories':
    default:
      return <Tag className="w-5 h-5 text-[var(--gold-primary)]" />;
  }
};

export const WardrobeStudio: React.FC<WardrobeStudioProps> = ({ onOpenAddPiece }) => {
  const { closet, loadSampleCloset, activePersona, switchPersona } = useCloset();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const currentPersonaData = PERSONA_WARDROBES[activePersona] || PERSONA_WARDROBES.women;

  const filteredItems = activeTab === 'all'
    ? closet
    : closet.filter((i) => i.category === activeTab);

  const selectedItem: ClosetItem | null =
    (selectedItemId ? closet.find((i) => i.id === selectedItemId) : null) ||
    filteredItems[0] ||
    closet[0] ||
    null;

  const getFormalityLabel = (tier: number) => {
    switch (tier) {
      case 1: return 'Casual / Street';
      case 2: return 'Smart Casual';
      case 3: return 'Elevated Date';
      case 4: return 'Sartorial Tailored';
      case 5: return 'Black-Tie Formal';
      default: return 'Versatile';
    }
  };

  return (
    <section id="wardrobe" className="py-24 relative bg-[var(--bg-canvas-subtle)] border-t border-[var(--border-card)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[var(--border-gold)] bg-[var(--pill-bg)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[var(--gold-primary)] font-mono">
              THE DIGITAL CLOSET MATRIX
            </span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-[var(--text-heading)]">
            Your Real Clothes, <br />
            <span className="italic font-light gold-gradient-text">Digitally Cataloged for AI Styling</span>
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-body)] font-light">
            Every garment in your closet is indexed by category, color tone, silhouette fit, and formality tier. 
            OTD uses this exact inventory to craft tailored outfits for any destination.
          </p>

          {/* Quick Action: Add Garment */}
          {onOpenAddPiece && (
            <div className="pt-2">
              <button
                onClick={onOpenAddPiece}
                className="gold-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer shadow-md hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Garment (Photo & AI Scan)</span>
              </button>
            </div>
          )}
        </div>

        {/* Persona Selection Header */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-[var(--gold-primary)] flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              SELECT WARDROBE PERSONA
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Women · Man · Boy · Girl
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PERSONA_CONFIG.map((p) => {
              const isSelected = activePersona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    switchPersona(p.id);
                    setActiveTab('all');
                    setSelectedItemId(null);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[var(--gold-primary)] bg-[var(--pill-bg)] shadow-md ring-1 ring-[var(--gold-primary)]/30'
                      : 'border-[var(--border-card)] bg-[var(--bg-card)] hover:border-[var(--gold-primary)]/60 text-[var(--text-body)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
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

          {/* Active Persona Banner */}
          <div className="mt-4 p-4 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-serif-luxury text-base font-semibold text-[var(--text-heading)]">
                {currentPersonaData.displayName}: {currentPersonaData.subtitle}
              </span>
              <p className="text-[11px] text-[var(--text-body)] italic">
                "{currentPersonaData.tagline}"
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-[var(--pill-bg)] border border-[var(--border-gold)] text-[var(--gold-primary)] font-semibold">
                {closet.length} Garments Cataloged
              </span>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: `All (${closet.length})` },
            {
              id: 'tops',
              label:
                activePersona === 'girl'
                  ? 'Dresses, Kurtis & Tops'
                  : activePersona === 'women'
                  ? 'Sarees, Dresses & Tops'
                  : activePersona === 'man'
                  ? 'Suits & Shirts'
                  : 'Shirts & T-Shirts',
            },
            {
              id: 'bottoms',
              label:
                activePersona === 'girl' || activePersona === 'women'
                  ? 'Pants & Chudidar Bottoms'
                  : 'Pants, Chinos & Jeans',
            },
            { id: 'outerwear', label: 'Jackets & Outerwear' },
            { id: 'footwear', label: 'Footwear' },
            { id: 'accessories', label: 'Accessories' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? 'gold-btn shadow-md'
                  : 'bg-[var(--bg-card)] text-[var(--text-body)] hover:text-[var(--gold-primary)] border border-[var(--border-card)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Garments Grid & Active Inspection Card */}
        {closet.length === 0 ? (
          <div className="glass-card rounded-3xl p-10 sm:p-16 border border-[var(--border-card)] text-center max-w-2xl mx-auto shadow-2xl">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[var(--bg-card-inner)] border border-[var(--border-gold)] flex items-center justify-center text-4xl shadow-md mb-6 text-[var(--gold-primary)]">
              <Shirt className="w-10 h-10 stroke-[1.5]" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-[var(--gold-primary)] font-semibold block mb-2">
              CURATION ATELIER INITIALIZATION
            </span>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[var(--text-heading)] mb-3">
              Your Wardrobe is Waiting for Its First Garment
            </h3>
            <p className="text-sm text-[var(--text-body)] max-w-lg mx-auto mb-8 font-light leading-relaxed">
              OTD synthesizes daily outfits directly from your verified digital wardrobe. You can upload photos of your real garments, or load our curated luxury starter capsule to explore the styling engine immediately.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {onOpenAddPiece && (
                <button
                  onClick={onOpenAddPiece}
                  className="gold-btn w-full sm:w-auto px-7 py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Garment Photo</span>
                </button>
              )}
              <button
                onClick={loadSampleCloset}
                className="gold-btn-outline w-full sm:w-auto px-7 py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[var(--gold-primary)]/10 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-[var(--gold-primary)]" />
                <span>Load Curated Luxury Capsule (16 Pieces)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Items Grid (8 columns) */}
            <div className="lg:col-span-8">
              {filteredItems.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center border border-[var(--border-card)]">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] flex items-center justify-center text-[var(--gold-primary)] mb-4">
                    <Sparkle className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h4 className="text-base font-semibold text-[var(--text-heading)] mb-1">
                    No pieces in "{activeTab}" category
                  </h4>
                  <p className="text-xs text-[var(--text-body)] mb-6 max-w-sm mx-auto">
                    You haven't cataloged any garments under this filter yet. You can upload a new piece or reset your view.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setActiveTab('all')}
                      className="px-5 py-2 rounded-full border border-[var(--border-card)] text-xs text-[var(--text-body)] hover:text-[var(--text-heading)] hover:border-[var(--gold-primary)] transition-all cursor-pointer"
                    >
                      Show All Garments ({closet.length})
                    </button>
                    {onOpenAddPiece && (
                      <button
                        onClick={onOpenAddPiece}
                        className="gold-btn px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add {activeTab.slice(0, -1)}</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer group flex flex-col justify-between ${
                        selectedItem?.id === item.id
                          ? 'border-[var(--gold-primary)] bg-[var(--bg-card-elevated)] shadow-lg ring-1 ring-[var(--gold-primary)]/30'
                          : 'border-[var(--border-card)] bg-[var(--bg-card)] hover:border-[var(--gold-primary)] hover:bg-[var(--bg-card-elevated)]'
                      }`}
                    >
                      <div>
                        <div className="h-44 w-full rounded-xl bg-neutral-100 dark:bg-neutral-900/80 border border-[var(--border-card)] flex items-center justify-center group-hover:scale-[1.02] transition-transform shadow-xs overflow-hidden mb-3 p-1.5 relative">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                          ) : (
                            renderGarmentFallback(item.category)
                          )}
                          <span className="absolute top-2 right-2 text-[9px] font-mono text-[var(--gold-primary)] px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-[var(--border-gold)] font-medium">
                            Tier {item.formality} · {getFormalityLabel(item.formality)}
                          </span>
                        </div>

                        <div className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] mb-0.5 font-medium">
                          {item.brand}
                        </div>
                        <h4 className="text-sm font-semibold text-[var(--text-heading)] mb-1 group-hover:text-[var(--gold-primary)]">
                          {item.name}
                        </h4>
                        <div className="text-[11px] text-[var(--text-body)] mb-3">
                          {item.color} · {item.subType}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[var(--border-card)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                        <span>Fit: <strong className="text-[var(--text-heading)]">{item.fit}</strong></span>
                        <span className="text-[var(--gold-primary)] font-semibold uppercase text-[10px] tracking-wider">
                          Ready to Style
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Detailed Item Inspection Panel (4 columns) */}
            <div className="lg:col-span-4 sticky top-28">
              {selectedItem ? (
                <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[var(--border-card)] shadow-xl relative">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-[var(--border-card)]">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--gold-primary)] font-semibold flex items-center gap-1.5">
                      <Tag className="w-3 h-3" />
                      AI CLOTHING ATTRIBUTES
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">OTD-ID: {selectedItem.id}</span>
                  </div>

                  <div className="my-6 text-center">
                    <div className="w-full h-64 sm:h-72 mx-auto rounded-2xl bg-neutral-100 dark:bg-neutral-900/80 border border-[var(--border-gold)]/40 flex items-center justify-center shadow-md mb-4 overflow-hidden relative p-2">
                      {selectedItem.imageUrl ? (
                        <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] flex items-center justify-center">
                          {renderGarmentFallback(selectedItem.category)}
                        </div>
                      )}
                      {selectedItem.material && (
                        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-mono text-white tracking-wider">
                          {selectedItem.material}
                        </div>
                      )}
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-primary)] font-mono font-medium block">
                      {selectedItem.brand}
                    </span>
                    <h3 className="font-serif-luxury text-2xl text-[var(--text-heading)] mt-1">
                      {selectedItem.name}
                    </h3>
                    <p className="text-xs text-[var(--text-body)] mt-1">
                      {selectedItem.subType} · {selectedItem.color}
                    </p>
                  </div>

                  {/* Practical Styling Attributes for AI */}
                  <div className="space-y-3 bg-[var(--bg-card-inner)] p-4 rounded-2xl border border-[var(--border-card)] text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--text-muted)]">Category:</span>
                      <span className="font-medium text-[var(--text-heading)] capitalize">{selectedItem.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--text-muted)]">Silhouette Cut:</span>
                      <span className="font-medium text-[var(--text-heading)]">{selectedItem.fit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--text-muted)]">Formality Tier:</span>
                      <span className="font-mono text-[var(--gold-primary)] font-bold">
                        Tier {selectedItem.formality} ({getFormalityLabel(selectedItem.formality)})
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--text-muted)]">Color Tone:</span>
                      <span className="font-medium text-[var(--text-heading)]">{selectedItem.color}</span>
                    </div>
                  </div>

                  <div className="mt-5 text-[11px] text-[var(--text-body)] bg-[var(--bg-card-inner)] p-3 rounded-xl border border-[var(--border-card)] leading-relaxed">
                    <strong className="text-[var(--gold-primary)] block mb-1">AI Pairing Logic:</strong>
                    "Eligible for instant pairing in {getFormalityLabel(selectedItem.formality)} contexts. Matches with your color preferences in ivory, charcoal, and warm earth tones."
                  </div>

                  {onOpenAddPiece && (
                    <button
                      onClick={onOpenAddPiece}
                      className="gold-btn-outline w-full mt-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload Another Garment</span>
                    </button>
                  )}

                </div>
              ) : (
                <div className="glass-card rounded-3xl p-8 border border-[var(--border-card)] text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] flex items-center justify-center text-[var(--gold-primary)] mb-4">
                    <Tag className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--text-heading)] mb-1">
                    Select a Garment
                  </h4>
                  <p className="text-xs text-[var(--text-body)]">
                    Click any item in your catalog to view detailed AI attributes, formality tier, and color harmony pairing logic.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
