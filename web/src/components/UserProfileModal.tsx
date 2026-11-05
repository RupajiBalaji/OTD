import React, { useState, useEffect } from 'react';
import { X, User, Check, Sparkles, Activity } from 'lucide-react';
import { useCloset } from '../context/ClosetContext';
import { aiApiService, type AiGatewayStatus } from '../services/ai.service';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useCloset();
  const [name, setName] = useState(profile.name);
  const [height, setHeight] = useState(profile.height);
  const [bodyShape, setBodyShape] = useState(profile.bodyShape);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(profile.stylePersonas);
  const [fit, setFit] = useState(profile.preferredFit);
  const [avoidedColors, setAvoidedColors] = useState<string[]>(profile.avoidedColors || ['Neon Green', 'Hot Pink']);
  const [dislikedElements, setDislikedElements] = useState<string[]>(profile.dislikedElements || ['Skinny Fits', 'Polyester Blends']);
  const [saved, setSaved] = useState(false);
  const [aiStatus, setAiStatus] = useState<AiGatewayStatus | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const status = await aiApiService.getAiStatus();
        if (isMounted) setAiStatus(status);
      } catch (err) {
        console.warn('Failed to query AI Gateway status:', err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isOpen) return null;

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const toggleAvoidedColor = (col: string) => {
    if (avoidedColors.includes(col)) {
      setAvoidedColors(avoidedColors.filter(c => c !== col));
    } else {
      setAvoidedColors([...avoidedColors, col]);
    }
  };

  const toggleDislikedElement = (elem: string) => {
    if (dislikedElements.includes(elem)) {
      setDislikedElements(dislikedElements.filter(e => e !== elem));
    } else {
      setDislikedElements([...dislikedElements, elem]);
    }
  };

  const handleSave = () => {
    updateProfile({
      name,
      height,
      bodyShape,
      stylePersonas: selectedStyles,
      preferredFit: fit,
      avoidedColors,
      dislikedElements
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-[var(--border-gold)] shadow-2xl bg-[var(--bg-card-elevated)] text-[var(--text-body)] max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--pill-bg)] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[var(--pill-bg)] border border-[var(--border-gold)] flex items-center justify-center text-[var(--gold-primary)] shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[var(--text-heading)]">
              Your Style DNA & Profile
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-medium">Calibrate your personal styling rules for OTD</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-5 text-xs">
          
          {/* Biometrics */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">
                Preferred Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-3 py-2.5 text-[var(--text-heading)] focus:border-[var(--gold-primary)] outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">
                Height
              </label>
              <input
                type="text"
                value={height}
                onChange={e => setHeight(e.target.value)}
                className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-3 py-2.5 text-[var(--text-heading)] focus:border-[var(--gold-primary)] outline-none font-medium"
              />
            </div>
          </div>

          {/* Body Shape */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-2">
              Body Silhouette
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Athletic / V-Taper', 'Lean / Slim', 'Broad / Regular'].map(shape => (
                <button
                  key={shape}
                  type="button"
                  onClick={() => setBodyShape(shape)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    bodyShape === shape
                      ? 'border-[var(--gold-primary)] bg-[var(--pill-bg)] text-[var(--text-heading)] font-semibold'
                      : 'border-[var(--border-card)] bg-[var(--bg-card-inner)] text-[var(--text-muted)] hover:border-[var(--gold-primary)]'
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>

          {/* Style Personas */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-2">
              Personal Style DNA (Choose 1–3)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Old Money Heritage',
                'Clean Minimalist',
                'Smart Sartorial',
                'Relaxed Contemporary',
                'Streetwear Chic'
              ].map(style => {
                const isSelected = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => toggleStyle(style)}
                    className={`px-3 py-2 rounded-full border text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'border-[var(--gold-primary)] bg-[var(--gold-primary)] text-white dark:text-black font-semibold'
                        : 'border-[var(--border-card)] bg-[var(--bg-card-inner)] text-[var(--text-body)] hover:border-[var(--gold-primary)]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{style}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fit Preferences */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-2">
              Preferred Silhouette Fit
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Tailored / Slim', 'Regular Classic', 'Relaxed / Drape'].map(fitOption => (
                <button
                  key={fitOption}
                  type="button"
                  onClick={() => setFit(fitOption)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    fit === fitOption
                      ? 'border-[var(--gold-primary)] bg-[var(--pill-bg)] text-[var(--text-heading)] font-semibold'
                      : 'border-[var(--border-card)] bg-[var(--bg-card-inner)] text-[var(--text-muted)] hover:border-[var(--gold-primary)]'
                  }`}
                >
                  {fitOption}
                </button>
              ))}
            </div>
          </div>

          {/* Avoided Colors */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-2 flex items-center justify-between">
              <span>Avoided Colors (Blacklist)</span>
              <span className="text-[10px] text-rose-500 font-normal">Filtered by AI Stylist</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Neon Green', hex: '#39FF14' },
                { name: 'Hot Pink', hex: '#FF69B4' },
                { name: 'Loud Yellow', hex: '#FFFF00' },
                { name: 'Bright Orange', hex: '#FF5F1F' },
                { name: 'Lime Green', hex: '#32CD32' },
                { name: 'Purple', hex: '#800080' },
                { name: 'Red', hex: '#DC2626' }
              ].map(col => {
                const isAvoided = avoidedColors.includes(col.name);
                return (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => toggleAvoidedColor(col.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      isAvoided
                        ? 'border-rose-500 bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30'
                        : 'border-[var(--border-card)] bg-[var(--bg-card-inner)] text-[var(--text-muted)] hover:border-rose-400'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: col.hex }} />
                    <span className={isAvoided ? 'line-through decoration-rose-500' : ''}>{col.name}</span>
                    {isAvoided && <span className="text-xs text-rose-400 font-bold ml-0.5">✕</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Disliked Elements */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-2">
              Disliked Cuts & Fabrics
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Skinny Fits',
                'Polyester Blends',
                'Heavy Branding',
                'Deep Necklines',
                'Distressed Fabrics',
                'Synthetic Linings'
              ].map(elem => {
                const isSelected = dislikedElements.includes(elem);
                return (
                  <button
                    key={elem}
                    type="button"
                    onClick={() => toggleDislikedElement(elem)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'border-[var(--gold-primary)] bg-[var(--gold-primary)]/15 text-[var(--gold-primary)] font-semibold'
                        : 'border-[var(--border-card)] bg-[var(--bg-card-inner)] text-[var(--text-muted)] hover:border-[var(--border-gold)]'
                    }`}
                  >
                    {isSelected && <span className="text-rose-400 font-bold">⊘</span>}
                    <span>{elem}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Gateway & Model Status (Live Telemetry) */}
          <div className="p-4 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-mono tracking-wider text-[var(--gold-primary)] font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>AI Gateway & Model Engine Health</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 font-bold">
                {aiStatus ? `${aiStatus.keysConfigured} Key${aiStatus.keysConfigured !== 1 ? 's' : ''} Active` : 'Checking...'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]">
                <span className="text-[var(--text-muted)] block text-[9px]">TEXT & VISION MODEL</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${aiStatus?.textModel?.available ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="font-bold text-[var(--text-heading)] truncate">
                    {aiStatus?.textModel?.model || 'gemini-3.5-flash'}
                  </span>
                </div>
                {aiStatus?.textModel?.latencyMs && (
                  <span className="text-[9px] text-[var(--text-muted)] block mt-0.5">
                    Live latency: {aiStatus.textModel.latencyMs}ms
                  </span>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]">
                <span className="text-[var(--text-muted)] block text-[9px]">TRY-ON IMAGE MODEL</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${aiStatus?.imageModel?.available ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="font-bold text-[var(--text-heading)] truncate">
                    {aiStatus?.imageModel?.model || 'gemini-2.5-flash-image'}
                  </span>
                </div>
                <span className="text-[9px] text-[var(--text-muted)] block mt-0.5 truncate">
                  {aiStatus?.imageModel?.available ? 'Ready for rendering' : (aiStatus?.imageModel?.reason || 'Layered fallback active')}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="mt-8 pt-4 border-t border-[var(--border-card)]">
          <button
            onClick={handleSave}
            className="gold-btn w-full py-3.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                <span>Profile Calibrated & Saved!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Save Style Preferences</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
