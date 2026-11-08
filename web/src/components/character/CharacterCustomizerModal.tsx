import React, { useState } from 'react';
import { X, Check, Sparkles, User, Scissors } from 'lucide-react';
import type { CharacterCustomization, BodyFrame } from './character.types';
import { SKIN_TONES, HAIRSTYLES, HAIR_COLORS } from './character.palette';
import { StylizedCharacter } from './StylizedCharacter';

interface CharacterCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCustomization: CharacterCustomization;
  onSave: (customization: CharacterCustomization) => Promise<void>;
  outfit?: any;
}

export const CharacterCustomizerModal: React.FC<CharacterCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentCustomization,
  onSave,
  outfit,
}) => {
  const [activeTab, setActiveTab] = useState<'skin' | 'body' | 'hair'>('skin');
  const [customization, setCustomization] = useState<CharacterCustomization>(currentCustomization);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave({
        ...customization,
        avatarVersion: (customization.avatarVersion || 1) + 1,
      });
      onClose();
    } catch (err) {
      console.error('Failed to save avatar customization', err);
    } finally {
      setIsSaving(false);
    }
  };

  const bodyFrames: { id: BodyFrame; name: string; desc: string }[] = [
    { id: 'runway', name: 'Runway Tall', desc: 'Elongated, slender vertical silhouette' },
    { id: 'hourglass', name: 'Hourglass', desc: 'Balanced shoulders and cinched waist' },
    { id: 'athletic', name: 'Athletic V-Taper', desc: 'Broader sculpted shoulders and trim hips' },
    { id: 'petite', name: 'Petite Proportioned', desc: 'Harmonious compact proportions' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#FCFAF6] dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Left: Live Character Preview */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-stone-100 to-stone-200 dark:from-stone-900 dark:to-stone-950 p-6 flex flex-col items-center justify-center relative min-h-[380px]">
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-white/80 dark:bg-stone-800/80 rounded-full text-xs font-serif tracking-wider text-amber-900 dark:text-amber-300 border border-amber-200/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            STYLE PREVIEW ATELIER
          </div>

          <div className="w-full h-80 flex items-center justify-center mt-6">
            <StylizedCharacter customization={customization} outfit={outfit} />
          </div>

          <p className="text-xs text-stone-500 text-center mt-2 font-mono">
            Vector illustration · Zero GPU · Smooth dynamic styling
          </p>
        </div>

        {/* Right: Customization Controls */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  Curate Your Avatar
                </h3>
                <p className="text-xs text-stone-500">Tailor your stylized digital fashion mannequin</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 my-4">
              <button
                onClick={() => setActiveTab('skin')}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'skin'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Skin Tone
              </button>
              <button
                onClick={() => setActiveTab('body')}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'body'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                Body Frame
              </button>
              <button
                onClick={() => setActiveTab('hair')}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'hair'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                Hair & Style
              </button>
            </div>

            {/* Tab: Skin Tone */}
            {activeTab === 'skin' && (
              <div className="space-y-4">
                <p className="text-xs text-stone-500">Select your natural or desired skin undertone:</p>
                <div className="grid grid-cols-4 gap-3">
                  {SKIN_TONES.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setCustomization({ ...customization, skinToneId: tone.id })}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border transition ${
                        customization.skinToneId === tone.id
                          ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm'
                          : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full shadow-inner border border-stone-300/60 flex items-center justify-center"
                        style={{ backgroundColor: tone.hex }}
                      >
                        {customization.skinToneId === tone.id && (
                          <Check className="w-4 h-4 text-stone-900 drop-shadow" />
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-stone-700 dark:text-stone-300 text-center leading-tight">
                        {tone.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Body Frame */}
            {activeTab === 'body' && (
              <div className="space-y-3">
                <p className="text-xs text-stone-500">Choose the architectural frame for outfit drape:</p>
                <div className="space-y-2">
                  {bodyFrames.map((frame) => (
                    <button
                      key={frame.id}
                      onClick={() => setCustomization({ ...customization, bodyFrame: frame.id })}
                      className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between ${
                        customization.bodyFrame === frame.id
                          ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/20'
                          : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {frame.name}
                        </div>
                        <div className="text-xs text-stone-500">{frame.desc}</div>
                      </div>
                      {customization.bodyFrame === frame.id && (
                        <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Hair Style & Color */}
            {activeTab === 'hair' && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-stone-500 mb-2">Hairstyle:</p>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                    {HAIRSTYLES.map((hair) => (
                      <button
                        key={hair.id}
                        onClick={() => setCustomization({ ...customization, hairstyleId: hair.id })}
                        className={`text-left p-2.5 rounded-xl border text-xs transition ${
                          customization.hairstyleId === hair.id
                            ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/20 font-semibold text-amber-900 dark:text-amber-200'
                            : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                        }`}
                      >
                        {hair.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-stone-500 mb-2">Hair Color Tone:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {HAIR_COLORS.map((col) => (
                      <button
                        key={col.id}
                        onClick={() => setCustomization({ ...customization, hairColorId: col.id })}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition ${
                          customization.hairColorId === col.id
                            ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/20'
                            : 'border-stone-200 dark:border-stone-800'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full border border-stone-300/40"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span className="text-[9px] text-stone-600 dark:text-stone-400 text-center truncate w-full">
                          {col.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md transition flex items-center gap-2"
            >
              {isSaving ? 'Saving...' : 'Save Avatar Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
