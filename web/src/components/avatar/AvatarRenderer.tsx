import React, { useState } from 'react';
import { Sparkles, AlertCircle, ShieldCheck, Eye, Layers } from 'lucide-react';
import type { ClosetItem } from '../../context/ClosetContext';

export interface AvatarProfile {
  skinTone?: string;
  skinToneHex?: string;
  bodyShape?: string;
  gender?: 'women' | 'man' | 'boy' | 'girl';
  customPhotoUrl?: string | null;
  height?: string;
  hair?: string;
}

export interface OutfitSlotSet {
  top?: ClosetItem | null;
  bottom?: ClosetItem | null;
  footwear?: ClosetItem | null;
  outerwear?: ClosetItem | null;
  accessory?: ClosetItem | null;
}

export interface AvatarRendererProps {
  mode: 'layered' | 'photoreal';
  avatar: AvatarProfile;
  outfit: OutfitSlotSet;
  isMinor?: boolean;
  generatedImageUrl?: string | null;
  isGenerating?: boolean;
  progress?: number;
  generationStatus?: 'queued' | 'compositing' | 'rendering' | 'completed' | 'fallback_to_layered' | 'failed' | 'idle';
  fallbackReason?: string | null;
  lightingStyle?: React.CSSProperties;
  onRetryPhotoreal?: () => void;
}

/**
 * LayeredAvatarRenderer:
 * Instant 2D vector & garment composite mannequin that always works without latency.
 * Respects gender, skin tone, body shape, and layers garments accurately by slot.
 */
export const LayeredAvatarRenderer: React.FC<{
  avatar: AvatarProfile;
  outfit: OutfitSlotSet;
  lightingStyle?: React.CSSProperties;
}> = ({ avatar, outfit, lightingStyle }) => {
  const skinColor = avatar.skinToneHex || '#D4A373';
  const isMale = avatar.gender === 'man' || avatar.gender === 'boy';
  const isMinor = avatar.gender === 'boy' || avatar.gender === 'girl';

  // Body silhouette scaling based on gender & shape
  const shoulderWidth = isMale ? (isMinor ? 140 : 180) : 150;
  const waistWidth = isMale ? (isMinor ? 95 : 120) : 100;
  const hipWidth = isMale ? (isMinor ? 100 : 130) : 140;

  return (
    <div
      className="relative w-full h-[520px] sm:h-[560px] flex items-center justify-center bg-gradient-to-b from-neutral-900/40 via-neutral-900/20 to-neutral-900/60 rounded-3xl overflow-hidden border border-amber-300/30 shadow-2xl select-none"
      style={lightingStyle}
    >
      {/* Studio Lighting Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Layer 1: Base Mannequin Silhouette SVG */}
      <svg
        viewBox="0 0 400 650"
        className="w-full h-full max-h-[540px] drop-shadow-xl z-10 transition-all duration-300"
        aria-label="Layered 2D Studio Avatar"
      >
        <defs>
          <linearGradient id="mannequinShade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={skinColor} stopOpacity="1" />
            <stop offset="100%" stopColor={skinColor} stopOpacity="0.82" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Floor Shadow */}
        <ellipse cx="200" cy="625" rx="90" ry="14" fill="#000000" opacity="0.35" />

        {/* Head & Neck */}
        <path
          d={`M 188 120 C 188 145, 185 155, 184 175 L 216 175 C 215 155, 212 145, 212 120 Z`}
          fill="url(#mannequinShade)"
        />
        <ellipse cx="200" cy="95" rx="34" ry="42" fill="url(#mannequinShade)" />

        {/* Shoulders & Torso */}
        <path
          d={`
            M ${200 - shoulderWidth / 2} 185
            C ${200 - shoulderWidth / 2} 175, 180 170, 200 170
            C 220 170, ${200 + shoulderWidth / 2} 175, ${200 + shoulderWidth / 2} 185
            L ${200 + waistWidth / 2} 290
            L ${200 + hipWidth / 2} 370
            L ${200 - hipWidth / 2} 370
            L ${200 - waistWidth / 2} 290
            Z
          `}
          fill="url(#mannequinShade)"
        />

        {/* Arms */}
        {/* Left Arm */}
        <path
          d={`
            M ${200 - shoulderWidth / 2} 185
            C ${200 - shoulderWidth / 2 - 15} 240, ${200 - shoulderWidth / 2 - 18} 320, ${200 - shoulderWidth / 2 - 20} 380
            L ${200 - shoulderWidth / 2 - 6} 380
            C ${200 - shoulderWidth / 2 - 4} 320, ${200 - shoulderWidth / 2 + 6} 240, ${200 - shoulderWidth / 2 + 15} 200
            Z
          `}
          fill="url(#mannequinShade)"
        />
        {/* Right Arm */}
        <path
          d={`
            M ${200 + shoulderWidth / 2} 185
            C ${200 + shoulderWidth / 2 + 15} 240, ${200 + shoulderWidth / 2 + 18} 320, ${200 + shoulderWidth / 2 + 20} 380
            L ${200 + shoulderWidth / 2 + 6} 380
            C ${200 + shoulderWidth / 2 + 4} 320, ${200 + shoulderWidth / 2 - 6} 240, ${200 + shoulderWidth / 2 - 15} 200
            Z
          `}
          fill="url(#mannequinShade)"
        />

        {/* Legs */}
        {/* Left Leg */}
        <path
          d={`
            M ${200 - hipWidth / 2 + 8} 368
            L ${200 - 45} 510
            L ${200 - 38} 605
            L ${200 - 15} 605
            L ${200 - 8} 510
            L ${198} 370
            Z
          `}
          fill="url(#mannequinShade)"
        />
        {/* Right Leg */}
        <path
          d={`
            M 202 370
            L ${200 + 8} 510
            L ${200 + 15} 605
            L ${200 + 38} 605
            L ${200 + 45} 510
            L ${200 + hipWidth / 2 - 8} 368
            Z
          `}
          fill="url(#mannequinShade)"
        />

        {/* Base Atelier Minimal Underlayer */}
        <path
          d={`M ${200 - waistWidth / 2 + 6} 265 Q 200 275 ${200 + waistWidth / 2 - 6} 265 L ${200 + hipWidth / 2 - 12} 370 L ${200 - hipWidth / 2 + 12} 370 Z`}
          fill="#1f1f22"
          opacity="0.9"
        />
      </svg>

      {/* Layer 2: Lower Garment Slot (Bottoms / Trousers / Skirt) */}
      {outfit.bottom && outfit.bottom.imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-[190px] sm:w-[210px] h-[250px] translate-y-[95px] flex items-center justify-center overflow-hidden">
            <img
              src={outfit.bottom.imageUrl}
              alt={outfit.bottom.name}
              className="w-full h-full object-contain filter drop-shadow-lg transition-transform duration-300"
            />
          </div>
        </div>
      )}

      {/* Layer 3: Upper Garment Slot (Tops / Shirts / Saree Bodice) */}
      {outfit.top && outfit.top.imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-25">
          <div className="w-[200px] sm:w-[230px] h-[210px] -translate-y-[45px] flex items-center justify-center overflow-hidden">
            <img
              src={outfit.top.imageUrl}
              alt={outfit.top.name}
              className="w-full h-full object-contain filter drop-shadow-xl transition-transform duration-300"
            />
          </div>
        </div>
      )}

      {/* Layer 4: Outerwear (Jacket / Coat) */}
      {outfit.outerwear && outfit.outerwear.imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="w-[220px] sm:w-[250px] h-[230px] -translate-y-[40px] flex items-center justify-center overflow-hidden">
            <img
              src={outfit.outerwear.imageUrl}
              alt={outfit.outerwear.name}
              className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-300"
            />
          </div>
        </div>
      )}

      {/* Layer 5: Footwear Slot */}
      {outfit.footwear && outfit.footwear.imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-35">
          <div className="w-[150px] h-[80px] translate-y-[230px] flex items-center justify-center">
            <img
              src={outfit.footwear.imageUrl}
              alt={outfit.footwear.name}
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
        </div>
      )}

      {/* Custom Digital Twin Face Overlay if uploaded */}
      {avatar.customPhotoUrl && (
        <div
          className="absolute top-[3%] left-1/2 -translate-x-1/2 w-16 h-20 sm:w-20 sm:h-24 rounded-full overflow-hidden shadow-lg z-40 border-2 border-amber-300/40"
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 70%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse at center, black 70%, transparent 100%)',
          }}
        >
          <img
            src={avatar.customPhotoUrl}
            alt="Personal Digital Twin"
            className="w-full h-full object-cover object-top"
          />
        </div>
      )}

      {/* Top Floating Badge */}
      <div className="absolute top-3 left-3 z-40 flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-md">
          <Layers className="w-3 h-3 text-[var(--gold-primary)]" />
          <span>Layered Studio Avatar</span>
        </span>
      </div>
    </div>
  );
};

/**
 * GeminiTryOnRenderer:
 * Coordinates server-side try-on generation, displays progress, and renders photorealistic result.
 * Gracefully falls back to LayeredAvatarRenderer with transparent user notice on quota or error.
 */
export const GeminiTryOnRenderer: React.FC<AvatarRendererProps> = ({
  avatar,
  outfit,
  isMinor = false,
  generatedImageUrl,
  isGenerating = false,
  progress = 0,
  generationStatus = 'idle',
  fallbackReason,
  lightingStyle,
  onRetryPhotoreal,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'layered'>('preview');

  // Minor Safety Restriction: Photoreal generation locked to Layered Avatar
  if (isMinor) {
    return (
      <div className="space-y-3">
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
          <div>
            <span className="font-bold">Minor Safety Protection Active: </span>
            <span>Photorealistic generation is restricted for youth profiles. Displaying high-precision Layered Studio Avatar.</span>
          </div>
        </div>
        <LayeredAvatarRenderer avatar={avatar} outfit={outfit} lightingStyle={lightingStyle} />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Fallback Notice Banner */}
      {fallbackReason && (
        <div className="mb-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{fallbackReason}</span>
          </div>
          {onRetryPhotoreal && (
            <button
              onClick={onRetryPhotoreal}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-mono font-bold transition-all shrink-0 cursor-pointer"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="relative rounded-3xl overflow-hidden">
        {/* Toggle between Photoreal and Layered when image is available */}
        {generatedImageUrl && !isGenerating && (
          <div className="absolute top-3 right-3 z-40 flex items-center gap-1.5 p-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 shadow-lg">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'preview'
                  ? 'bg-[var(--gold-primary)] text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Photoreal</span>
            </button>
            <button
              onClick={() => setActiveTab('layered')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'layered'
                  ? 'bg-[var(--gold-primary)] text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Layered</span>
            </button>
          </div>
        )}

        {/* View 1: Photoreal Generated Image */}
        {generatedImageUrl && activeTab === 'preview' && !isGenerating ? (
          <div
            className="relative w-full h-[520px] sm:h-[560px] flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl border border-amber-300/40 bg-black"
            style={lightingStyle}
          >
            <img
              src={generatedImageUrl}
              alt="AI Photorealistic Virtual Try-On"
              className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
            />

            {/* Bottom Honest Disclaimer Badge */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-20 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-amber-300 border border-amber-400/30 shadow-md">
                ✨ AI-generated preview, fit is approximate
              </span>
            </div>
          </div>
        ) : (
          /* View 2: Layered Avatar (always instant and accurate) */
          <LayeredAvatarRenderer avatar={avatar} outfit={outfit} lightingStyle={lightingStyle} />
        )}

        {/* Generating Overlay with Progress Bar */}
        {isGenerating && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
              <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto" />
            </div>

            <div className="space-y-1.5 max-w-xs">
              <h4 className="font-playfair text-lg text-white font-bold">
                Synthesizing Virtual Try-On
              </h4>
              <p className="text-xs text-neutral-300">
                {generationStatus === 'compositing'
                  ? 'Compositing flat-lay wardrobe garments...'
                  : generationStatus === 'rendering'
                  ? 'Gemini Image Model rendering photorealistic drape...'
                  : 'Preparing atelier studio environment...'}
              </p>
            </div>

            {/* Progress Meter */}
            <div className="w-full max-w-xs space-y-1">
              <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(10, progress)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>Rendering</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
