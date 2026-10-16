import { useState } from 'react';
import { Sparkles, Plus, Tag } from 'lucide-react';
import { useCloset, type ClosetItem } from '../context/ClosetContext';

interface WardrobeStudioProps {
  onOpenAddPiece?: () => void;
}

export const WardrobeStudio: React.FC<WardrobeStudioProps> = ({ onOpenAddPiece }) => {
  const { closet } = useCloset();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ClosetItem | null>(closet[0] || null);

  const filteredItems = activeTab === 'all'
    ? closet
    : closet.filter((i) => i.category === activeTab);

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

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: `All (${closet.length})` },
            { id: 'tops', label: 'Tops & Knits' },
            { id: 'bottoms', label: 'Trousers & Denim' },
            { id: 'outerwear', label: 'Jackets & Coats' },
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Items Grid (8 columns) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer group flex flex-col justify-between ${
                  selectedItem?.id === item.id
                    ? 'border-[var(--gold-primary)] bg-[var(--bg-card-elevated)] shadow-lg ring-1 ring-[var(--gold-primary)]/30'
                    : 'border-[var(--border-card)] bg-[var(--bg-card)] hover:border-[var(--gold-primary)] hover:bg-[var(--bg-card-elevated)]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-sm">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-mono text-[var(--gold-primary)] px-2.5 py-1 rounded-full bg-[var(--pill-bg)] border border-[var(--border-gold)] font-medium">
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
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-[var(--bg-card-inner)] border border-[var(--border-gold)] flex items-center justify-center text-5xl shadow-md mb-4">
                    {selectedItem.icon}
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
            ) : null}
          </div>

        </div>

      </div>
    </section>
  );
};
