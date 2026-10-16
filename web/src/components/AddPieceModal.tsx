import React, { useState } from 'react';
import { X, Camera, Upload, Sparkles, Check } from 'lucide-react';
import { useCloset, type ClosetItem } from '../context/ClosetContext';

interface AddPieceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPieceModal: React.FC<AddPieceModalProps> = ({ isOpen, onClose }) => {
  const { addClosetItem } = useCloset();
  const [stage, setStage] = useState<'upload' | 'analyzing' | 'confirm'>('upload');
  const [previewIcon, setPreviewIcon] = useState('🧥');
  
  // Detected fields
  const [name, setName] = useState('Double-Faced Camel Wool Overcoat');
  const [brand, setBrand] = useState('Loro Piana');
  const [category, setCategory] = useState<ClosetItem['category']>('outerwear');
  const [subType, setSubType] = useState('Overcoat');
  const [color, setColor] = useState('Vicuna Camel');
  const [fit, setFit] = useState<ClosetItem['fit']>('Relaxed / Tailored');
  const [formality, setFormality] = useState<ClosetItem['formality']>(4);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const simulateAiScan = (preset?: { name: string; brand: string; cat: ClosetItem['category']; sub: string; col: string; icon: string; form: ClosetItem['formality'] }) => {
    setStage('analyzing');
    if (preset) {
      setName(preset.name);
      setBrand(preset.brand);
      setCategory(preset.cat);
      setSubType(preset.sub);
      setColor(preset.col);
      setPreviewIcon(preset.icon);
      setFormality(preset.form);
    }
    setTimeout(() => {
      setStage('confirm');
    }, 900);
  };

  const handleConfirmAdd = () => {
    addClosetItem({
      category,
      subType,
      name,
      brand,
      color,
      fit,
      formality,
      icon: previewIcon
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setStage('upload');
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-[var(--border-gold)] shadow-2xl bg-[var(--bg-card-elevated)] text-[var(--text-body)]">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setStage('upload');
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--pill-bg)] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[var(--pill-bg)] border border-[var(--border-gold)] flex items-center justify-center text-[var(--gold-primary)] shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[var(--text-heading)]">
              Add Garment to Closet
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-medium">Single-photo AI garment identification & cataloging</p>
          </div>
        </div>

        {/* Stage 1: Upload / Take Photo */}
        {stage === 'upload' && (
          <div className="space-y-5">
            <div
              onClick={() => simulateAiScan()}
              className="border-2 border-dashed border-[var(--border-gold)] rounded-2xl p-8 text-center cursor-pointer hover:bg-[var(--pill-bg)] transition-all group"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-[var(--bg-card-inner)] flex items-center justify-center text-[var(--gold-primary)] group-hover:scale-110 transition-transform mb-3 border border-[var(--border-card)]">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[var(--text-heading)]">
                Take Photo or Drop Garment Image
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                OTD Computer Vision will remove backgrounds and detect fabric, color & cut.
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] block mb-2 font-semibold">
                Or Try Sample Uploads:
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { name: 'Oatmeal Wool Flannel Trousers', brand: 'Fox Brothers', cat: 'bottoms' as const, sub: 'Flannel Trousers', col: 'Oatmeal Beige', icon: '👖', form: 4 as const },
                  { name: 'Raw Silk Safari Overshirt', brand: 'Zegna', cat: 'outerwear' as const, sub: 'Overshirt', col: 'Olive Forest', icon: '🧥', form: 3 as const },
                  { name: 'Calfskin Horsebit Loafers', brand: 'Gucci 1953', cat: 'footwear' as const, sub: 'Loafers', col: 'Burgundy Noir', icon: '👞', form: 4 as const },
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => simulateAiScan(sample)}
                    className="p-2.5 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card-inner)] hover:border-[var(--gold-primary)] text-left transition-all cursor-pointer"
                  >
                    <span className="text-xl block mb-1">{sample.icon}</span>
                    <span className="text-[11px] font-semibold text-[var(--text-heading)] line-clamp-1 block">{sample.name}</span>
                    <span className="text-[10px] text-[var(--text-muted)] block">{sample.col}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stage 2: AI Analyzing Spinner */}
        {stage === 'analyzing' && (
          <div className="py-12 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full border-2 border-[var(--border-gold)] border-t-[var(--gold-primary)] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-xl">
                ✨
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-heading)]">
                OTD Vision Engine Scanning...
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Isolating garment silhouette, chromatic palette & fabric weight
              </p>
            </div>
          </div>
        )}

        {/* Stage 3: Confirm / Edit Detection */}
        {stage === 'confirm' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--pill-bg)] text-[var(--gold-primary)] font-semibold border border-[var(--border-gold)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Identification Complete. Confirm or edit below:</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-[var(--text-muted)] mb-1">
                  Garment Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-[var(--text-muted)] mb-1">
                  Brand / Maker
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-[var(--text-muted)] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ClosetItem['category'])}
                  className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)]"
                >
                  <option value="tops">Tops / Shirts / Knits</option>
                  <option value="bottoms">Bottoms / Trousers / Denim</option>
                  <option value="outerwear">Outerwear / Jackets</option>
                  <option value="footwear">Footwear / Shoes</option>
                  <option value="accessories">Accessories / Timepiece</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-[var(--text-muted)] mb-1">
                  Color Family
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-[var(--text-muted)] mb-1">
                  Fit Profile
                </label>
                <select
                  value={fit}
                  onChange={e => setFit(e.target.value as ClosetItem['fit'])}
                  className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)]"
                >
                  <option value="Slim">Slim / Tailored</option>
                  <option value="Regular">Regular Classic</option>
                  <option value="Relaxed / Tailored">Relaxed / Drape</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-[var(--text-muted)] mb-1">
                  Formality Tier (1-5)
                </label>
                <select
                  value={formality}
                  onChange={e => setFormality(Number(e.target.value) as ClosetItem['formality'])}
                  className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)]"
                >
                  <option value={1}>Tier 1: Casual Street / Lounge</option>
                  <option value={2}>Tier 2: Smart Casual</option>
                  <option value={3}>Tier 3: Elevated Social / Date</option>
                  <option value={4}>Tier 4: Business Sartorial</option>
                  <option value={5}>Tier 5: Formal Black-Tie</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setStage('upload')}
                className="gold-btn-outline py-3 px-4 rounded-xl text-xs cursor-pointer"
              >
                Retake
              </button>

              <button
                type="button"
                onClick={handleConfirmAdd}
                className="gold-btn flex-1 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    <span>Added to Digital Closet!</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm & Add to Closet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
