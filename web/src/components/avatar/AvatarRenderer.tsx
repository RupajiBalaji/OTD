import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type {
  CharacterCustomization,
  PosePreset,
  CharacterOutfitState,
} from '../character/character.types';
import { StylizedCharacter } from '../character/StylizedCharacter';
import { CharacterCustomizerModal } from '../character/CharacterCustomizerModal';

export interface TryOnRendererProps {
  customization?: Partial<CharacterCustomization>;
  outfit: CharacterOutfitState;
  pose?: PosePreset;
  onSlotClick?: (slot: 'top' | 'bottom' | 'footwear' | 'outerwear' | 'onePiece' | 'accessory') => void;
  selectedSlot?: string | null;
  mode?: 'stylized' | 'realistic'; // 'realistic' is a future stub behind feature flag
  className?: string;
  onCustomizationSave?: (newCustomization: CharacterCustomization) => Promise<void>;
  enablePoseControls?: boolean;
}

/**
 * Feature flag for future realistic neural preview.
 * Currently disabled to ensure zero GPU, zero billing, zero external API dependencies.
 */
export const ENABLE_REALISTIC_PREVIEW = false;

/**
 * Primary TryOnRenderer:
 * Fashion-illustration style, animated stylized vector character wearing user's outfit.
 * Labeled: "Style preview"
 */
export const TryOnRenderer: React.FC<TryOnRendererProps> = ({
  customization,
  outfit,
  pose: initialPose = 'stand',
  onSlotClick,
  selectedSlot,
  mode: _mode = 'stylized',
  className = '',
  onCustomizationSave,
  enablePoseControls = true,
}) => {
  const [activePose, setActivePose] = useState<PosePreset>(initialPose);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Sync initialPose if parent updates it
  React.useEffect(() => {
    if (initialPose) setActivePose(initialPose);
  }, [initialPose]);

  const poses: { id: PosePreset; label: string }[] = [
    { id: 'stand', label: 'Stand' },
    { id: 'hand_on_hip', label: 'Couture Hip' },
    { id: 'walk_step', label: 'Walk Step' },
    { id: 'wave', label: 'Editorial Wave' },
  ];

  return (
    <div className={`relative w-full flex flex-col items-center select-none ${className}`}>
      {/* Style Preview Atelier Card */}
      <div className="relative w-full h-[520px] sm:h-[580px] bg-gradient-to-b from-[#FCFAF6] via-[#F7F3EB] to-[#ECE5D8] dark:from-[#1E1C22] dark:via-[#17151B] dark:to-[#0F0E12] rounded-3xl overflow-hidden border border-amber-400/30 dark:border-amber-500/20 shadow-xl flex flex-col items-center justify-between p-4">
        {/* Top Header Badge */}
        <div className="w-full flex items-center justify-between z-20">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-full border border-amber-300/40 dark:border-amber-500/30 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-serif font-bold tracking-wider text-amber-900 dark:text-amber-200 uppercase">
              Style preview
            </span>
          </div>

          {/* Avatar Customization Trigger */}
          {onCustomizationSave && (
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-stone-900/80 hover:bg-amber-50 dark:hover:bg-amber-950/40 backdrop-blur-md rounded-full border border-stone-200 dark:border-stone-800 text-[11px] font-medium text-stone-700 dark:text-stone-300 shadow-sm transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
              <span>Customize</span>
            </button>
          )}
        </div>

        {/* Central Animated Vector Character */}
        <div className="relative w-full flex-1 flex items-center justify-center my-auto">
          <StylizedCharacter
            customization={customization}
            outfit={outfit}
            pose={activePose}
            onSlotClick={onSlotClick}
            selectedSlot={selectedSlot}
            className="w-full h-full max-h-[490px]"
          />
        </div>

        {/* Bottom Pose Switcher Controls */}
        {enablePoseControls && (
          <div className="z-20 flex items-center gap-1.5 p-1 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
            {poses.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePose(p.id)}
                className={`px-3 py-1 text-[11px] font-medium rounded-xl transition-all ${
                  activePose === p.id
                    ? 'bg-amber-600 text-white shadow-sm font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tap Hint */}
      <p className="text-[11px] text-stone-400 mt-2 font-mono flex items-center gap-1">
        <span>✦</span> Tap any garment to inspect or swap · Smooth vector animations
      </p>

      {/* Character Customization Modal */}
      {isCustomizerOpen && onCustomizationSave && (
        <CharacterCustomizerModal
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          currentCustomization={{
            skinToneId: customization?.skinToneId || 'olive',
            bodyFrame: customization?.bodyFrame || 'runway',
            hairstyleId: customization?.hairstyleId || 'short_fade',
            hairColorId: customization?.hairColorId || 'rich_black',
            avatarVersion: customization?.avatarVersion || 1,
          }}
          onSave={onCustomizationSave}
          outfit={outfit}
        />
      )}
    </div>
  );
};

/**
 * Backward compatibility alias for GeminiTryOnRenderer.
 * Seamlessly delivers the new animated stylized vector character experience.
 */
export const GeminiTryOnRenderer: React.FC<any> = ({
  avatar,
  outfit,
  lightingStyle: _lightingStyle,
  onSlotClick,
  selectedSlot,
  onCustomizationSave,
}) => {
  // Translate avatar props to CharacterCustomization
  const customization: Partial<CharacterCustomization> = {
    skinToneId: avatar?.skinTone || 'olive',
    bodyFrame:
      avatar?.bodyShape === 'athletic_tailored'
        ? 'athletic'
        : avatar?.bodyShape === 'curvy_couture'
        ? 'hourglass'
        : avatar?.bodyShape === 'petite_chic'
        ? 'petite'
        : 'runway',
    hairstyleId: avatar?.hairStyle || 'short_fade',
    hairColorId: avatar?.hairColor || 'rich_black',
    avatarVersion: avatar?.avatarVersion || 1,
  };

  const outfitState: CharacterOutfitState = {
    top: outfit?.top,
    bottom: outfit?.bottom,
    footwear: outfit?.footwear,
    outerwear: outfit?.outerwear,
    onePiece: outfit?.onePiece,
    accessory: outfit?.accessory,
  };

  return (
    <TryOnRenderer
      customization={customization}
      outfit={outfitState}
      onSlotClick={onSlotClick}
      selectedSlot={selectedSlot}
      onCustomizationSave={onCustomizationSave}
    />
  );
};

export const LayeredAvatarRenderer = GeminiTryOnRenderer;
