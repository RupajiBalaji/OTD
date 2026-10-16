import React, { useState } from 'react';
import { X, User, Check, Sparkles } from 'lucide-react';
import { useCloset } from '../context/ClosetContext';

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
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleSave = () => {
    updateProfile({
      name,
      height,
      bodyShape,
      stylePersonas: selectedStyles,
      preferredFit: fit
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
