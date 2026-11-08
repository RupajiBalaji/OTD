import React, { useState, useEffect } from 'react';
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
  studioModelPhotoUrl?: string | null;
  isGenerating?: boolean;
  progress?: number;
  generationStatus?: 'queued' | 'compositing' | 'rendering' | 'completed' | 'fallback_to_layered' | 'failed' | 'idle';
  fallbackReason?: string | null;
  lightingStyle?: React.CSSProperties;
  onRetryPhotoreal?: () => void;
}

/**
 * LayeredAvatarRenderer:
 * Haute Couture 2D Atelier Form that seamlessly composites garments using optical blend modes.
 * Eliminates harsh rectangular white image backgrounds, preserving natural garment fabric & contours.
 */
export const LayeredAvatarRenderer: React.FC<{
  avatar: AvatarProfile;
  outfit: OutfitSlotSet;
  lightingStyle?: React.CSSProperties;
}> = ({ avatar, outfit, lightingStyle }) => {
  const isMale = avatar.gender === 'man' || avatar.gender === 'boy';
  const isMinor = avatar.gender === 'boy' || avatar.gender === 'girl';

  // Proportions scaled to haute couture tailoring standard
  const shoulderW = isMale ? (isMinor ? 140 : 176) : 152;
  const waistW = isMale ? (isMinor ? 96 : 118) : 98;
  const hipW = isMale ? (isMinor ? 104 : 128) : 138;

  return (
    <div
      className="relative w-full h-[520px] sm:h-[560px] flex items-center justify-center bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#EAE3D6] dark:from-[#212025] dark:via-[#1A191D] dark:to-[#121114] rounded-3xl overflow-hidden border border-amber-400/30 shadow-2xl select-none"
      style={lightingStyle}
    >
      {/* Studio Lighting Radial Ambient Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-black/20 pointer-events-none" />

      {/* Layer 1: Sculpted Haute Couture Atelier Dress Form (Tailor's Dummy) */}
      <svg
        viewBox="0 0 400 650"
        className="w-full h-full max-h-[540px] drop-shadow-xl z-10 transition-all duration-300"
        aria-label="Haute Couture Atelier Form"
      >
        <defs>
          {/* Sculpted linen dress form texture */}
          <linearGradient id="atelierFormShade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ECE6DC" />
            <stop offset="50%" stopColor="#DFD8CC" />
            <stop offset="100%" stopColor="#CEC5B6" />
          </linearGradient>

          {/* Walnut / Brass Finial & Pedestal */}
          <linearGradient id="finialBrass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C5A059" />
            <stop offset="50%" stopColor="#8C6D33" />
            <stop offset="100%" stopColor="#57421C" />
          </linearGradient>
          <linearGradient id="standWood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#32261E" />
            <stop offset="100%" stopColor="#1B140F" />
          </linearGradient>
        </defs>

        {/* Floor Shadow */}
        <ellipse cx="200" cy="625" rx="85" ry="12" fill="#000000" opacity="0.3" />

        {/* Tailor's Cast Iron Tripod Base */}
        <path d="M 197 540 L 197 615 L 203 615 L 203 540 Z" fill="url(#standWood)" />
        <path d="M 170 622 L 200 615 L 230 622 L 200 618 Z" fill="url(#standWood)" />
        <ellipse cx="200" cy="616" rx="28" ry="5" fill="url(#finialBrass)" />

        {/* Neck Finial (Couture Wooden Cap) */}
        <ellipse cx="200" cy="115" rx="14" ry="7" fill="url(#finialBrass)" />
        <path d="M 193 115 L 193 140 L 207 140 L 207 115 Z" fill="url(#finialBrass)" />
        <path d="M 186 140 C 186 158, 185 168, 183 182 L 217 182 C 215 168, 214 158, 214 140 Z" fill="url(#atelierFormShade)" />

        {/* Sculpted Torso Form */}
        <path
          d={`
            M ${200 - shoulderW / 2} 188
            C ${200 - shoulderW / 2 + 10} 180, 182 176, 200 176
            C 218 176, ${200 + shoulderW / 2 - 10} 180, ${200 + shoulderW / 2} 188
            C ${200 + shoulderW / 2 - 4} 230, ${200 + waistW / 2 + 12} 265, ${200 + waistW / 2} 295
            C ${200 + waistW / 2 - 10} 330, ${200 + hipW / 2} 370, ${200 + hipW / 2} 410
            C ${200 + hipW / 2 - 10} 435, 215 442, 200 442
            C 185 442, ${200 - hipW / 2 + 10} 435, ${200 - hipW / 2} 410
            C ${200 - hipW / 2} 370, ${200 - waistW / 2 + 10} 330, ${200 - waistW / 2} 295
            C ${200 - waistW / 2 - 12} 265, ${200 - shoulderW / 2 + 4} 230, ${200 - shoulderW / 2} 188
            Z
          `}
          fill="url(#atelierFormShade)"
          stroke="#C5BEB1"
          strokeWidth="1.5"
        />

        {/* Tailoring Seam Lines */}
        <path d="M 200 182 L 200 442" stroke="#B8B0A2" strokeWidth="1" strokeDasharray="3,3" />
        <path d={`M ${200 - waistW / 2 + 4} 295 Q 200 300 ${200 + waistW / 2 - 4} 295`} stroke="#B8B0A2" strokeWidth="1" strokeDasharray="3,3" />

        {/* Lower Leg Post Supports */}
        <path d="M 180 440 L 180 540 L 188 540 L 188 440 Z" fill="url(#standWood)" opacity="0.85" />
        <path d="M 212 440 L 212 540 L 220 540 L 220 440 Z" fill="url(#standWood)" opacity="0.85" />
      </svg>

      {/* Layer 2: Lower Garment Slot (Bottoms / Trousers / Skirt) with optical multiply blending */}
      {outfit.bottom && outfit.bottom.imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-[195px] sm:w-[215px] h-[255px] translate-y-[90px] flex items-center justify-center">
            <img
              src={outfit.bottom.imageUrl}
              alt={outfit.bottom.name}
              className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-300"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
        </div>
      )}

      {/* Layer 3: Upper Garment Slot (Tops / Shirts / Saree Bodice) with optical multiply blending */}
      {outfit.top && outfit.top.imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-25">
          <div className="w-[210px] sm:w-[235px] h-[225px] -translate-y-[45px] flex items-center justify-center">
            <img
              src={outfit.top.imageUrl}
              alt={outfit.top.name}
              className="w-full h-full object-contain filter drop-shadow-lg transition-transform duration-300"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
        </div>
      )}

      {/* Layer 4: Outerwear (Jacket / Coat) with optical multiply blending */}
      {outfit.outerwear && outfit.outerwear.imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="w-[225px] sm:w-[250px] h-[240px] -translate-y-[42px] flex items-center justify-center">
            <img
              src={outfit.outerwear.imageUrl}
              alt={outfit.outerwear.name}
              className="w-full h-full object-contain filter drop-shadow-xl transition-transform duration-300"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
        </div>
      )}

      {/* Layer 5: Footwear Slot with optical multiply blending */}
      {outfit.footwear && outfit.footwear.imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-35">
          <div className="w-[145px] h-[80px] translate-y-[228px] flex items-center justify-center">
            <img
              src={outfit.footwear.imageUrl}
              alt={outfit.footwear.name}
              className="w-full h-full object-contain filter drop-shadow-md"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
        </div>
      )}

      {/* Custom Digital Twin Face Overlay if uploaded */}
      {avatar.customPhotoUrl && (
        <div
          className="absolute top-[4%] left-1/2 -translate-x-1/2 w-16 h-20 sm:w-20 sm:h-24 rounded-full overflow-hidden shadow-lg z-40 border-2 border-amber-400/50"
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 75%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse at center, black 75%, transparent 100%)',
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
          <span>Haute Atelier Form • {avatar.gender ? avatar.gender.toUpperCase() : 'MAN'}</span>
        </span>
      </div>
    </div>
  );
};

/**
 * GeminiTryOnRenderer:
 * Coordinates server-side try-on generation, displays progress, and renders photorealistic result.
 * Seamlessly provides both high-fashion Runway Studio Twin view and Layered Atelier view.
 */
export const GeminiTryOnRenderer: React.FC<AvatarRendererProps> = ({
  avatar,
  outfit,
  isMinor = false,
  generatedImageUrl,
  studioModelPhotoUrl,
  isGenerating = false,
  progress = 0,
  generationStatus = 'idle',
  fallbackReason,
  lightingStyle,
  onRetryPhotoreal,
}) => {
  // Defaults to preview (Runway Studio Model or AI Generated try-on)
  const [activeTab, setActiveTab] = useState<'preview' | 'layered'>('preview');

  // When a generated image arrives, ensure preview is active
  useEffect(() => {
    if (generatedImageUrl) {
      setActiveTab('preview');
    }
  }, [generatedImageUrl]);

  // Minor Safety Restriction: Photoreal generation locked to Layered Atelier Avatar
  if (isMinor) {
    return (
      <div className="space-y-3">
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
          <div>
            <span className="font-bold">Minor Safety Protection Active: </span>
            <span>Photorealistic generation is restricted for youth profiles. Displaying high-precision Haute Atelier Form.</span>
          </div>
        </div>
        <LayeredAvatarRenderer avatar={avatar} outfit={outfit} lightingStyle={lightingStyle} />
      </div>
    );
  }

  const activePhoto = generatedImageUrl || avatar.customPhotoUrl || studioModelPhotoUrl;

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
        {/* Toggle between Runway Studio and Layered Atelier */}
        {activePhoto && !isGenerating && (
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
              <span>{generatedImageUrl ? 'Photoreal AI' : 'Runway Model'}</span>
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
              <span>Layered Atelier</span>
            </button>
          </div>
        )}

        {/* View 1: Photoreal Generated Image or Curated Runway Studio Model */}
        {activeTab === 'preview' && activePhoto && !isGenerating ? (
          <div
            className="relative w-full h-[520px] sm:h-[560px] flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl border border-amber-300/40 bg-neutral-900"
            style={lightingStyle}
          >
            <img
              src={activePhoto}
              alt="Haute Couture Runway Twin"
              className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
            />

            {/* Bottom Honest Disclaimer / Title Badge */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-20 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-amber-300 border border-amber-400/30 shadow-md">
                {generatedImageUrl
                  ? '✨ AI-generated preview, fit is approximate'
                  : '✨ Haute Couture Runway Studio Twin'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-mono uppercase text-neutral-300 border border-white/10">
                {(avatar.gender || 'couture').toUpperCase()} FIT
              </span>
            </div>
          </div>
        ) : (
          /* View 2: Layered Atelier Form (Clean optical multiply drape) */
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
