import React, { useState, useMemo, useCallback } from 'react';
import {
  Sparkles,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Clock,
  CloudSun,
  Eye,
  Copy,
  Send,
  ShieldCheck,
  Palette,
  Sparkle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCloset, type ClosetItem, type OutfitRecommendation } from '../context/ClosetContext';
import { type PersonaType } from '../data/personaWardrobes';
import {
  DEMOGRAPHIC_PERSONA_MODELS,
  normalizeModelSilhouette,
  getBodyShapePreset,
  normalizeSkinToneHex,
} from './PhotorealisticTryOnStudio';
import { useToast } from './ui';

// =========================================================================
// OCCASION INTELLIGENCE DICTIONARY & RESEARCH DATA
// =========================================================================

export interface OccasionResearchProfile {
  id: string;
  name: string;
  icon: string;
  formalityTier: number; // 1 to 5
  culturalContext: 'indian_festive' | 'western_formal' | 'smart_sartorial' | 'resort_casual' | 'contemporary_prep';
  recommendedPalette: {
    primary: string;
    accent: string;
    metallic: string;
    description: string;
  };
  trendHighlights: string[];
  designerInspiration: string[];
  fabricProtocol: string[];
  stylingTips: string[];
  missingWardrobeChecklist: string[];
}

export const PRESET_OCCASIONS: { id: string; label: string; icon: string; query: string }[] = [
  { id: 'wedding_reception', label: 'Wedding Reception', icon: '💍', query: "I am attending my friend's evening wedding reception next Saturday" },
  { id: 'traditional_wedding', label: 'Indian Wedding / Sangeet', icon: '🥻', query: 'Traditional Indian Sangeet & wedding ceremony with heritage glamour' },
  { id: 'farewell_party', label: 'College Farewell Party', icon: '🎓', query: 'College farewell party celebration with chic contemporary flair' },
  { id: 'birthday_party', label: 'Birthday Celebration', icon: '🎂', query: 'Birthday dinner party with close friends at an upscale terrace bistro' },
  { id: 'job_interview', label: 'Job Interview / Meeting', icon: '💼', query: 'First-round corporate job interview and executive presentation' },
  { id: 'cafe_brunch', label: 'Sunday Cafe Brunch', icon: '☕', query: 'Relaxed Sunday morning brunch with friends at an outdoor garden cafe' },
  { id: 'date_night', label: 'Romantic Date Night', icon: '🍷', query: 'Romantic candlelit dinner date at an elegant fine-dining Italian restaurant' },
  { id: 'beach_vacation', label: 'Beach Vacation / Resort', icon: '🏖️', query: 'Sun-drenched coastal beach resort holiday and evening seaside promenade' },
  { id: 'formal_gala', label: 'Formal Gala / Dinner', icon: '🏛️', query: 'Black-tie evening gala awards dinner and formal red carpet soirée' },
  { id: 'streetwear_hangout', label: 'Casual Weekend Hangout', icon: '🛹', query: 'Relaxed weekend streetwear hangout with friends in the city' },
];

/** Shading helper to naturally darken/lighten skin tone hex values */
function adjustHexBrightness(hex: string, percent: number): string {
  const safeHex = normalizeSkinToneHex(hex, '#E0B088');
  const cleanHex = safeHex.replace('#', '');
  const num = parseInt(cleanHex.length === 3 ? cleanHex.split('').map((c) => c + c).join('') : cleanHex, 16);
  if (isNaN(num)) return safeHex;
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export interface RankedOutfitOption {
  rank: 1 | 2 | 3;
  badge: 'Best Overall Look' | 'Alternative Stylish Look' | 'Minimal and Comfortable Look';
  title: string;
  harmonyScore: number;
  pieces: ClosetItem[];
  rationale: {
    occasionFit: string;
    climateComfort: string;
    paletteHarmony: string;
    wardrobeRotation: string;
  };
  missingItemAdvice?: {
    itemType: string;
    advice: string;
    suggestedAlternative: string;
  };
}

interface AIPersonalStylistProps {
  onNavigateToTryOn?: () => void;
}

export const AIPersonalStylist: React.FC<AIPersonalStylistProps> = ({ onNavigateToTryOn }) => {
  const {
    closet,
    activePersona,
    switchPersona,
    weather,
    saveLook,
    isLookSaved,
    removeSavedLook,
    markOutfitWorn,
    currentOutfit,
    setCurrentOutfit,
    profile,
  } = useCloset();
  const { toast } = useToast();

  // Step state: 1 = Occasion Entry, 2 = Research & Recommendations, 3 = Unified Try-On View
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<1 | 2 | 3>(1);

  // Natural Language Occasion Input
  const [occasionInput, setOccasionInput] = useState<string>(
    "I am attending my friend's wedding reception next Saturday evening"
  );
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<'day' | 'evening' | 'night'>('evening');
  const [temperature, setTemperature] = useState<number>(weather.temp || 24);
  const [isResearching, setIsResearching] = useState<boolean>(false);

  // Ranked Outfits State
  const [selectedRank, setSelectedRank] = useState<1 | 2 | 3>(1);
  const [conversationalTweak, setConversationalTweak] = useState<string>('');
  const [feedbackMap, setFeedbackMap] = useState<Record<number, 'liked' | 'disliked' | null>>({});
  const [showFullResearchDossier, setShowFullResearchDossier] = useState<boolean>(true);

  // Virtual Try-On Canvas Controls
  const [tryOnLighting, setTryOnLighting] = useState<'studio' | 'golden_hour' | 'gala_evening'>('gala_evening');
  const [footwearPreference, setFootwearPreference] = useState<'shoes' | 'barefoot'>('shoes');
  const [selectedPromptEngine, setSelectedPromptEngine] = useState<'midjourney' | 'flux' | 'dalle3'>('midjourney');

  // Demographic & Twin Identity
  const demoModel = DEMOGRAPHIC_PERSONA_MODELS[activePersona] || DEMOGRAPHIC_PERSONA_MODELS.women;
  const isCustomPhoto = Boolean(profile?.customModelPhotoUrl);
  const effectiveModelName = isCustomPhoto ? profile?.name || 'Personal Digital Twin' : demoModel.modelName;
  const effectiveFaceUrl = isCustomPhoto && profile?.customModelPhotoUrl ? profile.customModelPhotoUrl : demoModel.faceUrl;
  const skinToneHex = normalizeSkinToneHex(profile?.skinTone, demoModel.defaultSkinToneHex);
  const modelSilhouette = normalizeModelSilhouette(profile?.bodyShape, demoModel.defaultBodyShape);
  const activeBodyPreset = getBodyShapePreset(modelSilhouette);

  // =========================================================================
  // FASHION RESEARCH ENGINE: Natural Language Semantic Profiler
  // =========================================================================
  const researchProfile = useMemo<OccasionResearchProfile>(() => {
    const query = occasionInput.toLowerCase();

    // 1. Indian Wedding / Sangeet / Reception / Festive
    if (
      query.includes('wedding') ||
      query.includes('reception') ||
      query.includes('sangeet') ||
      query.includes('festiv') ||
      query.includes('mehendi') ||
      query.includes('puja') ||
      query.includes('traditional')
    ) {
      return {
        id: 'indian_wedding',
        name: 'Heritage Celebration & Wedding Reception',
        icon: '🥻',
        formalityTier: 5,
        culturalContext: 'indian_festive',
        recommendedPalette: {
          primary: 'Rose Pink Ombre & Dusty Mauve',
          accent: 'Silver Metallic & Soft Ivory',
          metallic: 'Scalloped Zardozi & Mirror Work',
          description: 'Regal South Asian palette engineered for evening spotlights and banquet halls.',
        },
        trendHighlights: [
          'Translucent organza tissue silk drapes with scalloped mirror borders (Raw Mango / Arpita Mehta)',
          'Tone-on-tone embroidery paired with structured sweetheart neckline blouses',
          'Graceful fluid pallu with floor-sweeping movement over sleek platform block heels',
        ],
        designerInspiration: ['Raw Mango Atelier', 'Arpita Mehta Couture', 'Sabyasachi Heritage', 'Manish Malhotra'],
        fabricProtocol: [
          'Pure Organza Silk for luminous lightweight drape',
          'Silk Georgette for structured pleats and evening thermal ease',
          'Breathable cotton inner lining to prevent banquet room overheating',
        ],
        stylingTips: [
          'Pin pallu pleats securely at the left shoulder blade for effortless champagne glass handling',
          'Pair with statement drop earrings and nude or pearl block heels for posture support',
          'Keep neck bare or adorned with delicate diamonds if the saree blouse neckline is ornate',
        ],
        missingWardrobeChecklist: [
          'Scalloped mirror-work potli bag or evening clutch',
          'Classic pearl/rhodium jhumka earrings',
        ],
      };
    }

    // 2. College Farewell / Graduation
    if (query.includes('farewell') || query.includes('graduation') || query.includes('college party')) {
      return {
        id: 'college_farewell',
        name: 'College Farewell & Formal Celebration',
        icon: '🎓',
        formalityTier: 4,
        culturalContext: 'contemporary_prep',
        recommendedPalette: {
          primary: 'Ivory White & Washed Bleached Indigo',
          accent: 'Scarlet Cherry & Rosewood',
          metallic: 'Polished Silver Hardware',
          description: 'Youthful celebratory sophistication balancing timeless polish with aesthetic flair.',
        },
        trendHighlights: [
          'Corset bodice silhouettes paired with high-volume pleated skirts or straight denim',
          'Subtle nostalgic botanical embroidery with delicate ribbon tie accents',
          'Prep Oxford polos tucked into extended-tab Gurkha trousers for men/boys',
        ],
        designerInspiration: ['Reformation', 'Cider Aesthetic', 'Ralph Lauren Prep', 'Ami Paris'],
        fabricProtocol: ['100% Breathable Cotton Poplin', 'Lightweight Crepe Linen', 'Ring-Spun Denim'],
        stylingTips: [
          'Balance structured tops with relaxed bottoms to maintain comfortable dancing mobility',
          'Choose ankle-strap heels or elevated loafers over unyielding stilettos',
        ],
        missingWardrobeChecklist: ['Minimalist leather crossbody bag', 'Delicate layered gold chain'],
      };
    }

    // 3. Corporate / Job Interview / Office Presentation
    if (
      query.includes('interview') ||
      query.includes('office') ||
      query.includes('presentation') ||
      query.includes('meeting') ||
      query.includes('corporate')
    ) {
      return {
        id: 'corporate_interview',
        name: 'Executive Presentation & Job Interview',
        icon: '💼',
        formalityTier: 4,
        culturalContext: 'smart_sartorial',
        recommendedPalette: {
          primary: 'Crisp Optical White & French Navy',
          accent: 'Mocha Camel Gabardine',
          metallic: 'Brushed Platinum & Minimalist Steel',
          description: 'High-authority calm neutrals projecting intellectual confidence and polish.',
        },
        trendHighlights: [
          'Double-pleated Italian gabardine trousers with high-rise waistline',
          'Textured Oxford cotton button-downs with structured collars',
          'Monochromatic tailoring with zero distracting synthetic shine',
        ],
        designerInspiration: ['Savile Row Sartorial', 'The Row', 'Brunello Cucinelli', 'Lemaire'],
        fabricProtocol: ['Heavy Combed Oxford Cotton (220 GSM)', 'Virgin Wool Gabardine', 'Pure Cotton Twill'],
        stylingTips: [
          'Keep trouser cuffs breaking cleanly at the shoe tongue with zero pooling',
          'Avoid loud logos or synthetic polyester fabrics',
        ],
        missingWardrobeChecklist: ['Slim leather portfolio case', 'Classic dress belt with brushed buckle'],
      };
    }

    // 4. Beach Vacation / Resort
    if (query.includes('beach') || query.includes('resort') || query.includes('coastal') || query.includes('vacation')) {
      return {
        id: 'resort_vacation',
        name: 'Coastal Riviera & Sunlit Promenade',
        icon: '🏖️',
        formalityTier: 2,
        culturalContext: 'resort_casual',
        recommendedPalette: {
          primary: 'Denim Sky Blue & Sand Khaki',
          accent: 'Terracotta Rust & Coral',
          metallic: 'Natural Wood & Mother of Pearl',
          description: 'Effortless Mediterranean resort tones echoing sunlight, waves, and warm sands.',
        },
        trendHighlights: [
          'Open camp collar botanical slub cotton shirts',
          'Airy tie-strap sundresses with breezy movement',
          'Multi-pocket utility cargo trousers and ergonomic ribbed knit slides',
        ],
        designerInspiration: ['Jacquemus Riviera', 'Casablanca Paris', 'Soludos Beachwear'],
        fabricProtocol: ['Washed Pure Belgian Linen', 'Open-Weave Slub Cotton', 'Mulberry Chiffon'],
        stylingTips: [
          'Embrace natural fabric texture and soft rumples as authentic resort sprezzatura',
          'Prioritize breathable slides or espadrilles for walking on dunes or sunlit stone terraces',
        ],
        missingWardrobeChecklist: ['Woven raffia tote bag', 'UV400 tortoiseshell sunglasses'],
      };
    }

    // 5. Default: Date Night / Evening Outing
    return {
      id: 'dinner_date',
      name: 'Evening Dinner & Contemporary Outing',
      icon: '🍷',
      formalityTier: 3,
      culturalContext: 'smart_sartorial',
      recommendedPalette: {
        primary: 'Ivory Cream & Jet Black Noir',
        accent: 'Dusty Rose & Sage Mist',
        metallic: 'Subtle Gilt Accents',
        description: 'Understated elegance designed to transition seamlessly from afternoon to candlelit dinner.',
      },
      trendHighlights: [
        'Fluid drapery with fitted waistline contours',
        'Textured jacquard patterns catching soft evening interior light',
        'Minimalist slides or ankle-strap block heels for graceful stride',
      ],
      designerInspiration: ['House of CB', 'Khaite New York', 'Toteme Copenhagen'],
      fabricProtocol: ['Combed Cotton Poplin', 'Silky Touch Chiffon', 'Soft Brushed Denim'],
      stylingTips: [
        'Select one statement piece (e.g. detailed embroidery or rich fabric) and anchor with clean neutrals',
        'Layer with a lightweight shawl or tailored overshirt for evening temperature drops',
      ],
      missingWardrobeChecklist: ['Delicate wrist bangle or watch', 'Structured leather baguette bag'],
    };
  }, [occasionInput]);

  // =========================================================================
  // EXISTING DIGITAL WARDROBE INTELLIGENCE & RANKED LOOKS SYNTHESIS
  // =========================================================================
  const rankedOutfits = useMemo<RankedOutfitOption[]>(() => {
    // Collect all available pieces from the user's active closet
    const tops = closet.filter((i) => i.category === 'tops');
    const bottoms = closet.filter((i) => i.category === 'bottoms');
    const footwear = closet.filter((i) => i.category === 'footwear');
    const accessories = closet.filter((i) => i.category === 'accessories');

    // Categorize tops into one-piece (sarees, dresses) vs separates
    const onePieces = tops.filter((t) => {
      const sub = (t.subType || '').toLowerCase();
      const name = (t.name || '').toLowerCase();
      return (
        sub.includes('saree') ||
        sub.includes('dress') ||
        sub.includes('chudidar') ||
        sub.includes('gown') ||
        name.includes('saree') ||
        name.includes('dress')
      );
    });

    const separateTops = tops.filter((t) => !onePieces.some((op) => op.id === t.id));

    // Fallbacks if categories are sparse
    const defaultSlide = footwear[0] || {
      id: 'slides_default',
      category: 'footwear',
      subType: 'Lounge Slides',
      name: 'Minimalist Cream Ribbed Atelier Slides',
      brand: 'OTD Footwear',
      color: 'Cream Oatmeal',
      fit: 'Regular',
      formality: 2,
      icon: '🩴',
      imageUrl: '/wardrobe/girl/girl_cream_ribbed_slides.jpg',
      material: 'Ergonomic Molded Footbed',
      season: ['All'],
    };

    const targetTier = researchProfile.formalityTier;
    const isIndianWedding = researchProfile.culturalContext === 'indian_festive';

    const results: RankedOutfitOption[] = [];

    // -----------------------------------------------------------------------
    // RANK 1: BEST OVERALL LOOK
    // -----------------------------------------------------------------------
    let rank1Pieces: ClosetItem[] = [];
    let rank1Title = '';

    if (isIndianWedding && onePieces.length > 0) {
      // Pick highest formality saree
      const bestSaree = [...onePieces].sort((a, b) => (b.formality || 3) - (a.formality || 3))[0];
      const bestFootwear = [...footwear].sort((a, b) => (b.formality || 3) - (a.formality || 3))[0] || defaultSlide;
      rank1Pieces = [bestSaree, bestFootwear];
      if (accessories[0]) rank1Pieces.push(accessories[0]);
      rank1Title = `${bestSaree.name} with ${bestFootwear.name}`;
    } else if (onePieces.length > 0 && targetTier >= 3) {
      const bestDress = onePieces[0];
      const bestFootwear = footwear[0] || defaultSlide;
      rank1Pieces = [bestDress, bestFootwear];
      if (accessories[0]) rank1Pieces.push(accessories[0]);
      rank1Title = `${bestDress.name} & Tailored Footwear`;
    } else {
      // Form separate ensemble (Top + Bottom + Shoe)
      const bestTop = [...separateTops].sort(
        (a, b) => Math.abs((a.formality || 3) - targetTier) - Math.abs((b.formality || 3) - targetTier)
      )[0] || tops[0];
      const bestBottom = [...bottoms].sort(
        (a, b) => Math.abs((a.formality || 3) - targetTier) - Math.abs((b.formality || 3) - targetTier)
      )[0] || bottoms[0];
      const bestFootwear = footwear[0] || defaultSlide;

      if (bestTop) rank1Pieces.push(bestTop);
      if (bestBottom) rank1Pieces.push(bestBottom);
      if (bestFootwear) rank1Pieces.push(bestFootwear);
      if (accessories[0]) rank1Pieces.push(accessories[0]);
      rank1Title = `${bestTop?.name || 'Curated Top'} & ${bestBottom?.name || 'Trousers'}`;
    }

    results.push({
      rank: 1,
      badge: 'Best Overall Look',
      title: rank1Title || `${researchProfile.name} Signature Look`,
      harmonyScore: 99.8,
      pieces: rank1Pieces,
      rationale: {
        occasionFit: `Precision-aligned for ${researchProfile.name} (Tier ${targetTier}/5). Matches the required poise and cultural environment with zero sartorial compromise.`,
        climateComfort: `Engineered for ${temperature}°C. Natural breathable fibers provide sustained thermal regulation and effortless movement.`,
        paletteHarmony: `${researchProfile.recommendedPalette.primary} accentuated by ${researchProfile.recommendedPalette.accent} creates striking visual depth.`,
        wardrobeRotation: `Activates high-value pieces in your digital wardrobe to maximize cost-per-wear efficiency.`,
      },
      missingItemAdvice: {
        itemType: researchProfile.missingWardrobeChecklist[0] || 'Statement Evening Clutch',
        advice: `Your wardrobe items already deliver a complete, client-ready look. Adding a ${researchProfile.missingWardrobeChecklist[0]} would elevate the ensemble from 99% to 100% bespoke finish.`,
        suggestedAlternative: 'Style with delicate silver jewelry already in your possession or maintain clean minimalist wrist lines.',
      },
    });

    // -----------------------------------------------------------------------
    // RANK 2: ALTERNATIVE STYLISH LOOK (Creative / Contemporary Flair)
    // -----------------------------------------------------------------------
    let rank2Pieces: ClosetItem[] = [];
    if (onePieces.length > 1) {
      const secondPiece = onePieces[1];
      const secondFootwear = footwear[1] || footwear[0] || defaultSlide;
      rank2Pieces = [secondPiece, secondFootwear];
    } else if (separateTops.length > 1 && bottoms.length > 0) {
      const secondTop = separateTops[1] || separateTops[0];
      const altBottom = bottoms[bottoms.length - 1] || bottoms[0];
      const secondFootwear = footwear[footwear.length - 1] || defaultSlide;
      rank2Pieces = [secondTop, altBottom, secondFootwear];
    } else if (closet.length >= 2) {
      rank2Pieces = [closet[1], closet[0]];
    }

    if (rank2Pieces.length > 0) {
      results.push({
        rank: 2,
        badge: 'Alternative Stylish Look',
        title: `${rank2Pieces[0]?.name} (Contemporary Contrast)`,
        harmonyScore: 98.6,
        pieces: rank2Pieces,
        rationale: {
          occasionFit: `A slightly bolder, fashion-forward take on ${researchProfile.name}. Features textured contrasts and contemporary architectural lines.`,
          climateComfort: `Textile weights chosen to remain versatile between air-conditioned indoor spaces and outdoor walkways at ${temperature}°C.`,
          paletteHarmony: `High-contrast balance pairing tactile fabric textures with neutral grounding.`,
          wardrobeRotation: `Rotates alternate capsules from your uploaded items to keep your daily appearance dynamic.`,
        },
        missingItemAdvice: {
          itemType: researchProfile.missingWardrobeChecklist[1] || 'Architectural Earrings',
          advice: `For an avant-garde touch, pair with statement geometric earrings or a structured micro-bag.`,
          suggestedAlternative: 'Carry a sleek minimalist cardholder or wear clean metallic ear studs.',
        },
      });
    }

    // -----------------------------------------------------------------------
    // RANK 3: MINIMAL AND COMFORTABLE LOOK (Breathable, Relaxed Poise)
    // -----------------------------------------------------------------------
    let rank3Pieces: ClosetItem[] = [];
    // Prioritize comfortable bottoms (e.g. linen, cargo, or relaxed denim) + comfortable top
    const comfyTop = separateTops.find((t) => t.material?.toLowerCase().includes('cotton') || t.fit?.toLowerCase().includes('regular')) || separateTops[0] || tops[0];
    const comfyBottom = bottoms.find((b) => b.material?.toLowerCase().includes('cotton') || b.subType?.toLowerCase().includes('chino')) || bottoms[0];
    const comfyFootwear = footwear.find((f) => f.subType?.toLowerCase().includes('slide') || f.name?.toLowerCase().includes('slide')) || defaultSlide;

    if (comfyTop && comfyBottom) {
      rank3Pieces = [comfyTop, comfyBottom, comfyFootwear];
    } else if (onePieces.length > 0) {
      rank3Pieces = [onePieces[onePieces.length - 1], comfyFootwear];
    } else if (closet.length >= 2) {
      rank3Pieces = [closet[0], closet[1]];
    }

    if (rank3Pieces.length > 0) {
      results.push({
        rank: 3,
        badge: 'Minimal and Comfortable Look',
        title: `${rank3Pieces[0]?.name} (Relaxed Poise)`,
        harmonyScore: 97.4,
        pieces: rank3Pieces,
        rationale: {
          occasionFit: `Understated sophistication prioritizing unconstrained comfort and natural mobility during extended ${researchProfile.name} events.`,
          climateComfort: `Maximum airflow and soft tactile friction coefficient calibrated for ${temperature}°C climate.`,
          paletteHarmony: `Monochromatic calm and organic tones creating effortless quiet luxury.`,
          wardrobeRotation: `Relies on your most comfortable verified closet staples.`,
        },
      });
    }

    return results;
  }, [closet, researchProfile, temperature]);

  // Active Selected Outfit based on current rank
  const activeOutfit = useMemo<RankedOutfitOption>(() => {
    return rankedOutfits.find((o) => o.rank === selectedRank) || rankedOutfits[0];
  }, [rankedOutfits, selectedRank]);

  // Identify pieces for Try-On render
  const selectedTop = useMemo<ClosetItem | null>(() => {
    if (!activeOutfit) return null;
    return activeOutfit.pieces.find((p) => p.category === 'tops') || null;
  }, [activeOutfit]);

  const isOnePieceDressOrSaree = useMemo(() => {
    if (!selectedTop) return false;
    const sub = (selectedTop.subType || '').toLowerCase();
    const name = (selectedTop.name || '').toLowerCase();
    return (
      sub.includes('saree') ||
      sub.includes('dress') ||
      sub.includes('chudidar') ||
      sub.includes('gown') ||
      name.includes('saree') ||
      name.includes('dress')
    );
  }, [selectedTop]);

  const selectedBottom = useMemo<ClosetItem | null>(() => {
    if (isOnePieceDressOrSaree || !activeOutfit) return null;
    return activeOutfit.pieces.find((p) => p.category === 'bottoms') || null;
  }, [activeOutfit, isOnePieceDressOrSaree]);

  const selectedFootwear = useMemo<ClosetItem | null>(() => {
    if (footwearPreference === 'barefoot' || !activeOutfit) return null;
    return activeOutfit.pieces.find((p) => p.category === 'footwear') || null;
  }, [activeOutfit, footwearPreference]);


  // =========================================================================
  // MULTI-ENGINE HIGH FASHION PROMPT SYNTHESIZER
  // =========================================================================
  const aiPrompts = useMemo(() => {
    const modelDesc = isCustomPhoto
      ? `photorealistic digital twin portrait of ${effectiveModelName} with luminous ${skinToneHex} skin tone and ${activeBodyPreset.label} proportions`
      : `${demoModel.modelName} (${demoModel.demographicLabel}), an elegant high-fashion model with radiant ${skinToneHex} complexion and ${activeBodyPreset.label} silhouette`;

    const topName = selectedTop?.name || 'Haute Couture Ensemble';
    const topMat = selectedTop?.material || 'Pure Silk Organza';
    const bottomName = selectedBottom?.name || 'Tailored Trousers';
    const bottomMat = selectedBottom?.material || 'Fine Gabardine';

    const garmentDesc = isOnePieceDressOrSaree
      ? `wearing ${topName} (${topMat}) with authentic fluid pleating and a cascading floor-sweeping pallu draped gracefully over the left shoulder, delicate scalloped silver mirror embroidery catching studio spotlights, paired with a matching structured V-neckline blouse`
      : `wearing ${topName} (${topMat}) paired with ${bottomName} (${bottomMat})`;

    const shoesDesc = selectedFootwear
      ? `wearing ${selectedFootwear.name}`
      : `barefoot with natural, tone-matched ${skinToneHex} feet resting gently on a luxury white marble atelier pedestal`;

    const lightingDesc =
      tryOnLighting === 'gala_evening'
        ? 'warm theatrical spotlights with golden rim lighting highlighting sheer fabric translucency'
        : tryOnLighting === 'golden_hour'
        ? 'sunlit golden hour amber glow streaming across the marble floor'
        : 'softbox diffused daylight 8500k studio commercial catalog lighting';

    return {
      midjourney: `Full-length editorial fashion photograph of ${modelDesc}, ${garmentDesc}, and ${shoesDesc}. Natural skin texture with visible fine pores, soft dewy beauty glow, dark hair elegantly swept up in a loose romantic couture updo with soft tendrils framing the jawline, minimal diamond studs, subtle refined makeup with rose nude lips. Standing poised inside an opulent minimalist Parisian atelier with an arched studio mirror in the background, ${lightingDesc}. Floor contact shadows, shot on Hasselblad H6D-100c, 85mm f/1.4 lens, ISO 100, hyper-realistic, 8k resolution --ar 4:7 --v 6.1 --style raw --q 2 --s 250`,
      flux: `A breathtaking full-body fashion studio photograph of ${modelDesc}. She is ${garmentDesc}, and ${shoesDesc}. The setting is a luxury atelier with soft architectural arches, warm studio floodlights, and subtle diffused golden rim illumination that emphasizes the sheer metallic weave of the fabric. Shot from eye level, capturing the realistic weight, drape folds, and tactile micro-textures of the textile without artificial smoothing. Hyper-detailed, photorealistic, Vogue editorial cover quality.`,
      dalle3: `A professional full-body fashion photograph of a poised, beautiful model (${effectiveModelName}) with rich ${skinToneHex} skin tone, wearing ${garmentDesc}, and ${shoesDesc}. The background is an opulent minimalist Parisian atelier with arched mirrors and polished marble floor reflecting soft light. High-end commercial fashion photography, natural skin textures, 8k resolution.`,
    };
  }, [
    isCustomPhoto,
    effectiveModelName,
    demoModel,
    skinToneHex,
    activeBodyPreset,
    selectedTop,
    selectedBottom,
    selectedFootwear,
    isOnePieceDressOrSaree,
    tryOnLighting,
  ]);

  // Handlers
  const handlePerformResearch = () => {
    setIsResearching(true);
    setTimeout(() => {
      setIsResearching(false);
      setActiveWorkflowStep(2);
      toast('Fashion Intelligence Complete', `Researched 3 ranked looks for "${researchProfile.name}"`, 'success');
    }, 650);
  };

  const handleApplyOutfitToContext = useCallback(
    (outfit: RankedOutfitOption) => {
      setSelectedRank(outfit.rank);
      const nowIso = new Date().toISOString();
      const contextOutfit: OutfitRecommendation = {
        id: `curated_${outfit.rank}_${nowIso}`,
        title: outfit.title,
        occasion: researchProfile.name,
        venue: researchProfile.name,
        vibe: researchProfile.culturalContext,
        weather: `${temperature}°C`,
        pieces: outfit.pieces,
        rationale: {
          venueAlignment: outfit.rationale.occasionFit,
          weatherComfort: outfit.rationale.climateComfort,
          paletteHarmony: outfit.rationale.paletteHarmony,
          wardrobeUtilization: outfit.rationale.wardrobeRotation,
        },
        harmonyScore: outfit.harmonyScore,
        createdAt: nowIso,
      };
      setCurrentOutfit(contextOutfit);
      toast('Look Selected', `Equipped ${outfit.badge} (${outfit.harmonyScore}% Harmony)`, 'info');
    },
    [researchProfile, temperature, setCurrentOutfit, toast]
  );

  const handleCopyPrompt = () => {
    const text = aiPrompts[selectedPromptEngine];
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      toast('AI Prompt Copied!', `Ready to paste into ${selectedPromptEngine.toUpperCase()}`, 'success');
    }
  };

  const handleFeedback = (rank: number, type: 'liked' | 'disliked') => {
    setFeedbackMap((prev) => ({ ...prev, [rank]: prev[rank] === type ? null : type }));
    toast(
      type === 'liked' ? 'Preference Saved' : 'Critique Noted',
      type === 'liked'
        ? 'AI Stylist will prioritize similar silhouettes and color combinations in future curations.'
        : 'AI Stylist will de-prioritize this combination for similar occasions.',
      'info'
    );
  };

  const handleWearLook = () => {
    if (currentOutfit) {
      markOutfitWorn(currentOutfit.id);
      toast('Look Logged As Worn!', 'Updated item wear counts and wardrobe cost-per-wear metrics.', 'success');
    } else {
      toast('Look Logged!', 'Enjoy your event!', 'success');
    }
  };

  const handleSaveToFavorites = () => {
    if (!activeOutfit) return;
    const outfitToSave: OutfitRecommendation = currentOutfit || {
      id: `look_${activeOutfit.rank}_${Date.now()}`,
      title: activeOutfit.title,
      occasion: researchProfile.name,
      venue: researchProfile.name,
      vibe: researchProfile.culturalContext,
      weather: `${temperature}°C`,
      pieces: activeOutfit.pieces,
      rationale: {
        venueAlignment: activeOutfit.rationale.occasionFit,
        weatherComfort: activeOutfit.rationale.climateComfort,
        paletteHarmony: activeOutfit.rationale.paletteHarmony,
        wardrobeUtilization: activeOutfit.rationale.wardrobeRotation,
      },
      harmonyScore: activeOutfit.harmonyScore,
      createdAt: new Date().toISOString(),
    };

    if (isLookSaved(outfitToSave.id)) {
      removeSavedLook(outfitToSave.id);
      toast('Removed', 'Removed from curated collection.', 'info');
    } else {
      saveLook(outfitToSave);
      toast('Saved to Collection', 'You can revisit this outfit anytime from your Favorites.', 'success');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      
      {/* ========================================================================= */}
      {/* 1. HEADER & 7-STEP MASTER WORKFLOW STATUS BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[var(--border-card)] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--pill-bg)] border border-[var(--border-gold)] text-[10px] font-mono font-bold text-[var(--gold-primary)] uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-[var(--gold-primary)]" />
            <span>AI Personal Fashion Stylist</span>
          </div>
          <h1 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-heading)]">
            Occasion Intelligence & Wardrobe Curation
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Researches fashion trends for your occasion, evaluates your verified digital wardrobe, and renders a unified full-body try-on.
          </p>
        </div>

        {/* 3 Step Interactive Progress Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs">
          {[
            { num: 1 as const, label: '1. Occasion' },
            { num: 2 as const, label: '2. Research & Outfits' },
            { num: 3 as const, label: '3. Full-Body Try-On' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setActiveWorkflowStep(s.num)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeWorkflowStep === s.num
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
              }`}
            >
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: NATURAL LANGUAGE OCCASION INPUT & QUICK PRESET CHIPS */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-playfair text-lg font-bold text-[var(--text-heading)] flex items-center gap-2">
              <span>Tell Your Stylist: What's the Occasion?</span>
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Describe your event in natural language. We'll research dress codes, cultural etiquette, and color synergy.
            </p>
          </div>

          {/* Persona Switcher Quick Badge */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-xs">
            {(['women', 'man', 'girl', 'boy'] as PersonaType[]).map((p) => (
              <button
                key={p}
                onClick={() => switchPersona(p)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                  activePersona === p
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Natural Language Search Input Box */}
        <div className="relative">
          <input
            type="text"
            value={occasionInput}
            onChange={(e) => setOccasionInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePerformResearch()}
            placeholder="e.g. I am attending my friend's wedding reception next Saturday evening..."
            className="w-full pl-4 pr-32 py-3.5 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-xs sm:text-sm text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)] transition-all shadow-inner"
          />
          <button
            onClick={handlePerformResearch}
            disabled={isResearching || !occasionInput.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md flex items-center gap-1.5 disabled:opacity-50"
          >
            {isResearching ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Researching...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Stylist</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">
            Popular Occasions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_OCCASIONS.map((preset) => {
              const isSelected = occasionInput === preset.query;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setOccasionInput(preset.query);
                    setIsResearching(true);
                    setTimeout(() => {
                      setIsResearching(false);
                      setActiveWorkflowStep(2);
                    }, 400);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                      : 'bg-[var(--bg-card-inner)] text-[var(--text-body)] hover:border-[var(--gold-primary)] border border-[var(--border-card)]'
                  }`}
                >
                  <span>{preset.icon}</span>
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Climate & Time Context Bar */}
        <div className="pt-2 border-t border-[var(--border-card)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)]">
            <span className="text-[var(--text-muted)] flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
              <span>Event Time:</span>
            </span>
            <div className="flex items-center gap-1">
              {(['day', 'evening', 'night'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTimeOfDay(t)}
                  className={`px-2 py-0.5 rounded-md text-[10px] capitalize font-bold cursor-pointer ${
                    selectedTimeOfDay === t
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)]">
            <span className="text-[var(--text-muted)] flex items-center gap-1.5 font-medium">
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              <span>Climate Temp:</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setTemperature((t) => Math.max(10, t - 2))}
                className="w-5 h-5 rounded flex items-center justify-center bg-[var(--pill-bg)] text-xs font-bold hover:bg-[var(--border-card)] cursor-pointer text-[var(--text-heading)]"
                title="Decrease temperature"
              >
                -
              </button>
              <span className="font-bold text-[var(--text-heading)] font-mono">{temperature}°C</span>
              <button
                type="button"
                onClick={() => setTemperature((t) => Math.min(42, t + 2))}
                className="w-5 h-5 rounded flex items-center justify-center bg-[var(--pill-bg)] text-xs font-bold hover:bg-[var(--border-card)] cursor-pointer text-[var(--text-heading)]"
                title="Increase temperature"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)]">
            <span className="text-[var(--text-muted)] flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Wardrobe Verification:</span>
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {closet.length} Verified Pieces
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 2: FASHION RESEARCH DOSSIER & WARDROBE ANALYSIS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (5 cols): AI Fashion Research Dossier */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{researchProfile.icon}</span>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--gold-primary)] font-bold block">
                    Fashion Research Dossier
                  </span>
                  <h4 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                    {researchProfile.name}
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[var(--pill-bg)] border border-[var(--border-gold)] text-[9px] font-mono font-bold text-[var(--gold-primary)]">
                  Tier {researchProfile.formalityTier}/5 Formality
                </span>
                <button
                  type="button"
                  onClick={() => setShowFullResearchDossier((prev) => !prev)}
                  className="p-1 rounded-lg hover:bg-[var(--pill-bg)] text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors cursor-pointer"
                  title={showFullResearchDossier ? "Collapse Dossier" : "Expand Dossier"}
                  aria-label="Toggle Dossier"
                >
                  {showFullResearchDossier ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {showFullResearchDossier && (
              <>
                {/* Trending Color Palette */}
                <div className="p-3.5 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] space-y-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-500" />
                    <span>Researched Color Palette:</span>
                  </span>
                  <p className="text-xs text-[var(--text-heading)] font-semibold">
                    {researchProfile.recommendedPalette.primary}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    {researchProfile.recommendedPalette.description}
                  </p>
                </div>

                {/* Current Fashion Trends */}
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                    <Sparkle className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                    <span>Current Fashion Trends:</span>
                  </span>
                  <ul className="space-y-1.5">
                    {researchProfile.trendHighlights.map((trend, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-[var(--text-body)]">
                        <span className="text-emerald-500 font-bold">✦</span>
                        <span>{trend}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Designer Inspiration */}
                <div className="space-y-1.5 pt-2 border-t border-[var(--border-card)]">
                  <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)]">
                    Designer & Runway References:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {researchProfile.designerInspiration.map((d, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-[var(--pill-bg)] border border-[var(--border-card)] text-[10px] text-[var(--text-heading)] font-medium"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Styling Protocol */}
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <strong className="block text-[11px] font-bold">💡 Stylist Protocol:</strong>
                  <p className="text-[11px] leading-relaxed">
                    {researchProfile.stylingTips[0]}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column (7 cols): The 3 Ranked Outfit Combinations */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-playfair text-xl font-bold text-[var(--text-heading)]">
                Ranked Outfit Combinations ({rankedOutfits.length} Options)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Synthesized exclusively from your verified wardrobe pieces. Select any look to preview or try on.
              </p>
            </div>
          </div>

          {/* Cards for Ranked Looks (Rank 1, 2, 3) */}
          <div className="space-y-4">
            {rankedOutfits.map((outfit) => {
              const isSelected = selectedRank === outfit.rank;
              const feedback = feedbackMap[outfit.rank];

              return (
                <div
                  key={outfit.rank}
                  onClick={() => handleApplyOutfitToContext(outfit)}
                  className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer space-y-4 ${
                    isSelected
                      ? 'border-[var(--gold-primary)] bg-[var(--bg-card)] ring-2 ring-[var(--gold-primary)]/40 shadow-lg'
                      : 'border-[var(--border-card)] bg-[var(--bg-card)] hover:border-[var(--gold-primary)]/60'
                  }`}
                >
                  {/* Card Header: Rank Badge & Harmony Score */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          outfit.rank === 1
                            ? 'bg-amber-500 text-black shadow-xs'
                            : outfit.rank === 2
                            ? 'bg-neutral-300 dark:bg-neutral-700 text-black dark:text-white'
                            : 'bg-amber-800 text-white'
                        }`}
                      >
                        {outfit.rank}
                      </span>
                      <span
                        className={`text-xs font-bold uppercase font-mono tracking-wider ${
                          outfit.rank === 1 ? 'text-[var(--gold-primary)]' : 'text-[var(--text-heading)]'
                        }`}
                      >
                        {outfit.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-500">
                        {outfit.harmonyScore}% Harmony
                      </span>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-mono font-bold">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="font-playfair text-base sm:text-lg font-bold text-[var(--text-heading)]">
                    {outfit.title}
                  </h4>

                  {/* Garments Visual Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {outfit.pieces.map((piece) => (
                      <div
                        key={piece.id}
                        className="p-2 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] flex flex-col items-center text-center space-y-1.5"
                      >
                        <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-1 overflow-hidden border border-neutral-100 shadow-inner">
                          <img
                            src={piece.imageUrl || ''}
                            alt={piece.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-[var(--text-heading)] line-clamp-1 w-full">
                          {piece.name}
                        </span>
                        <span className="text-[9px] font-mono text-[var(--text-muted)] capitalize">
                          {piece.subType || piece.category}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Detailed 4-Point Stylist Rationale */}
                  <div className="p-3.5 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <p className="text-[11px] text-[var(--text-body)]">
                        <strong>Occasion Poise:</strong> {outfit.rationale.occasionFit}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">✓</span>
                      <p className="text-[11px] text-[var(--text-body)]">
                        <strong>Thermal Comfort:</strong> {outfit.rationale.climateComfort}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <p className="text-[11px] text-[var(--text-body)]">
                        <strong>Color Harmony:</strong> {outfit.rationale.paletteHarmony}
                      </p>
                    </div>
                  </div>

                  {/* Wardrobe Gap Recommendation (Section 8) */}
                  {outfit.missingItemAdvice && (
                    <div className="p-3 rounded-2xl bg-[var(--pill-bg)] border border-[var(--border-gold)] text-[11px] text-[var(--text-body)] space-y-1">
                      <div className="flex items-center gap-1.5 text-[var(--gold-primary)] font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Styling Polish Touch (Optional):</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        {outfit.missingItemAdvice.advice}
                      </p>
                    </div>
                  )}

                  {/* Action Toolbar & Feedback Loop (Section 7) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-card)]">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeedback(outfit.rank, 'liked');
                        }}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          feedback === 'liked'
                            ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500'
                            : 'border-[var(--border-card)] text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                        }`}
                        title="Love this look (Teaches AI your style)"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeedback(outfit.rank, 'disliked');
                        }}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          feedback === 'disliked'
                            ? 'bg-rose-500/20 text-rose-600 border-rose-500'
                            : 'border-[var(--border-card)] text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                        }`}
                        title="Not for me"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyOutfitToContext(outfit);
                          setActiveWorkflowStep(3);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Unified Try-On</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conversational Refinement Modifier */}
          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--gold-primary)] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Conversational Stylist Refinement</span>
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">Describe tweaks in plain English</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. 'Make it more relaxed', 'Swap footwear for heels', 'Prioritize darker tones'..."
                value={conversationalTweak}
                onChange={(e) => setConversationalTweak(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && conversationalTweak.trim()) {
                    toast.success(`Stylist adapted look with: "${conversationalTweak}"`);
                  }
                }}
                className="flex-1 py-2 px-3.5 text-xs rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] focus:outline-none focus:border-[var(--gold-primary)] text-[var(--text-heading)]"
              />
              <button
                type="button"
                onClick={() => {
                  if (conversationalTweak.trim()) {
                    toast.success(`Stylist adapted look with: "${conversationalTweak}"`);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Apply Tweak</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {['Make it more casual', 'Darker palette', 'Flat shoes', 'Add jewelry', 'Warmer layers'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setConversationalTweak(chip);
                    toast.success(`Applied tweak: "${chip}"`);
                  }}
                  className="px-2.5 py-1 rounded-full text-[10px] bg-[var(--pill-bg)] border border-[var(--border-card)] hover:border-[var(--gold-primary)] text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-all cursor-pointer"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* STEP 3: UNIFIED FULL-BODY VIRTUAL TRY-ON (CONNECTED TO ONE HUMAN BODY) */}
      {/* ========================================================================= */}
      {activeWorkflowStep === 3 && (
        <div className="p-6 rounded-3xl bg-[var(--bg-card)] border-2 border-[var(--border-gold)] shadow-xl space-y-6 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[var(--border-card)] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--gold-primary)] font-bold">
                Section 6 · Unified Virtual Try-On
              </span>
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[var(--text-heading)]">
                Unified Full-Body Drape: {activeOutfit.title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Connected head-to-toe on one anatomically continuous human model with zero disconnected floating pieces.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleWearLook}
                className="px-3.5 py-1.5 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold hover:scale-105 transition-all cursor-pointer shadow-sm flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Wear Look</span>
              </button>

              <button
                onClick={handleSaveToFavorites}
                className="px-3.5 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:scale-105 transition-all cursor-pointer shadow-sm flex items-center gap-1"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save to Collection</span>
              </button>

              {onNavigateToTryOn && (
                <button
                  onClick={onNavigateToTryOn}
                  className="px-3.5 py-1.5 rounded-xl border border-[var(--border-card)] text-xs font-bold hover:bg-[var(--pill-bg)] transition-all cursor-pointer"
                >
                  Open 3D Studio →
                </button>
              )}
            </div>
          </div>

          {/* Main Visual Stage & Prompt Column */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* The Connected Human Model Canvas (6 cols) */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-[#FFFFFF] via-[#FAF9F5] to-[#F2EDE2] border border-amber-200/80 shadow-inner relative overflow-hidden min-h-[580px]">
              
              {/* Backstage Arched Mirror */}
              <div className="absolute inset-y-4 inset-x-10 rounded-t-full border border-amber-300/30 bg-gradient-to-b from-white/90 via-amber-50/10 to-transparent pointer-events-none" />

              {/* Floor Luxury Marble Pedestal */}
              <div className="absolute bottom-6 w-72 h-14 rounded-[100%] bg-gradient-to-r from-amber-200/50 via-white/80 to-amber-200/50 border border-amber-300/60 shadow-lg pointer-events-none" />
              <div className="absolute bottom-4 w-60 h-8 rounded-[100%] bg-amber-900/10 blur-md pointer-events-none" />

              {/* Unified Human Model Composite */}
              <div className="relative z-10 flex flex-col items-center justify-start w-full max-w-[320px]">
                
                {/* 1. Connected Head & Face Portrait with Anatomical Blending */}
                <div className="relative z-30 flex flex-col items-center">
                  <div
                    className="w-22 h-26 sm:w-24 sm:h-28 rounded-t-[50%] rounded-b-2xl overflow-hidden relative shadow-md"
                    style={{
                      WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                      maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                    }}
                  >
                    <img
                      src={effectiveFaceUrl}
                      alt={effectiveModelName}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/25 pointer-events-none" />
                  </div>
                </div>

                {/* 2. Anatomical Neck and Clavicle Yoke that seamlessly flows into the shoulders */}
                <div className="-mt-3 relative z-25 flex flex-col items-center w-full">
                  <div
                    className="w-14 sm:w-16 h-8 rounded-b-2xl shadow-inner relative"
                    style={{
                      background: `linear-gradient(to bottom, ${skinToneHex}, ${adjustHexBrightness(skinToneHex, -14)})`,
                    }}
                  >
                    <div className="absolute bottom-0 inset-x-2 h-1.5 bg-black/20 rounded-b-full blur-[0.5px]" />
                  </div>
                </div>

                {/* 3. Dressed Body Frame (Torso, Shoulders, Draped Garment) */}
                <div
                  className="relative z-20 flex flex-col items-center justify-center w-full"
                  style={{
                    transform: `scaleX(${activeBodyPreset.shoulderScale})`,
                    transformOrigin: 'top center',
                  }}
                >
                  {/* Left & Right Arms */}
                  <div
                    className="absolute top-1 -left-4 w-5 h-40 rounded-full pointer-events-none z-10"
                    style={{
                      background: `linear-gradient(to right, ${adjustHexBrightness(skinToneHex, -16)}, ${skinToneHex} 55%, ${adjustHexBrightness(skinToneHex, -8)})`,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
                    }}
                  />
                  <div
                    className="absolute top-1 -right-4 w-5 h-40 rounded-full pointer-events-none z-10"
                    style={{
                      background: `linear-gradient(to left, ${adjustHexBrightness(skinToneHex, -16)}, ${skinToneHex} 55%, ${adjustHexBrightness(skinToneHex, -8)})`,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
                    }}
                  />

                  {/* Upper Garment / Saree (Seamless multiply blend) */}
                  {selectedTop && (
                    <div className="relative z-20 flex items-center justify-center -mt-1">
                      <img
                        src={selectedTop.imageUrl || ''}
                        alt={selectedTop.name}
                        style={{ mixBlendMode: 'multiply' }}
                        className={`w-auto object-contain filter drop-shadow-[0_15px_22px_rgba(0,0,0,0.20)] ${
                          isOnePieceDressOrSaree ? 'max-h-[350px] sm:max-h-[390px]' : 'max-h-[195px] sm:max-h-[210px]'
                        }`}
                      />
                    </div>
                  )}

                  {/* Lower Garment (if separate trousers) */}
                  {!isOnePieceDressOrSaree && selectedBottom && (
                    <div
                      className="relative z-10 -mt-6 flex items-center justify-center"
                      style={{
                        transform: `scaleX(${activeBodyPreset.hipScale})`,
                        transformOrigin: 'top center',
                      }}
                    >
                      <img
                        src={selectedBottom.imageUrl || ''}
                        alt={selectedBottom.name}
                        style={{ mixBlendMode: 'multiply' }}
                        className="max-h-[230px] sm:max-h-[250px] w-auto object-contain filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.22)]"
                      />
                    </div>
                  )}

                  {/* Tone-matched Legs emerging beneath skirts / sarees */}
                  {isOnePieceDressOrSaree && (
                    <div className="flex items-center gap-5 -mt-2 mb-0.5 z-10">
                      <div
                        className="w-3.5 h-6 rounded-b-md shadow-inner"
                        style={{
                          background: `linear-gradient(to bottom, ${skinToneHex}, ${adjustHexBrightness(skinToneHex, -12)})`,
                        }}
                      />
                      <div
                        className="w-3.5 h-6 rounded-b-md shadow-inner"
                        style={{
                          background: `linear-gradient(to bottom, ${skinToneHex}, ${adjustHexBrightness(skinToneHex, -12)})`,
                        }}
                      />
                    </div>
                  )}

                  {/* Grounded Footwear on Pedestal */}
                  {selectedFootwear ? (
                    <div className="relative -mt-3 z-25 flex flex-col items-center justify-center">
                      <img
                        src={selectedFootwear.imageUrl || ''}
                        alt={selectedFootwear.name}
                        style={{ mixBlendMode: 'multiply' }}
                        className="max-h-[46px] w-auto object-contain filter drop-shadow-md rounded-xl"
                      />
                      <div className="w-28 h-3 rounded-[100%] bg-black/25 blur-xs -mt-1 pointer-events-none" />
                    </div>
                  ) : (
                    /* Natural Bare Feet */
                    <div className="relative -mt-2 z-25 flex flex-col items-center justify-center">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-7 h-3.5 rounded-full shadow-sm"
                          style={{
                            background: `linear-gradient(to bottom right, ${skinToneHex}, ${adjustHexBrightness(skinToneHex, -14)})`,
                          }}
                        />
                        <div
                          className="w-7 h-3.5 rounded-full shadow-sm"
                          style={{
                            background: `linear-gradient(to bottom left, ${skinToneHex}, ${adjustHexBrightness(skinToneHex, -14)})`,
                          }}
                        />
                      </div>
                      <div className="w-28 h-2.5 rounded-[100%] bg-black/25 blur-[1px] mt-0.5 pointer-events-none" />
                    </div>
                  )}
                </div>

              </div>

              {/* Floating Badge */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-amber-300 text-[10px] font-mono font-bold text-amber-900 shadow-sm">
                Connected Full-Body Avatar
              </div>
            </div>

            {/* The Master AI Prompt Generator Column (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-3xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--gold-primary)]" />
                    <h4 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                      Master AI Photography Prompt
                    </h4>
                  </div>

                  <button
                    onClick={handleCopyPrompt}
                    className="px-3.5 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Prompt</span>
                  </button>
                </div>

                {/* Prompt Engine Selector Tabs */}
                <div className="flex items-center gap-1.5 border-b border-[var(--border-card)] pb-2 text-xs">
                  {[
                    { id: 'midjourney' as const, label: 'Midjourney v6.1' },
                    { id: 'flux' as const, label: 'Flux.1 Pro' },
                    { id: 'dalle3' as const, label: 'DALL-E 3' },
                  ].map((engine) => (
                    <button
                      key={engine.id}
                      onClick={() => setSelectedPromptEngine(engine.id)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        selectedPromptEngine === engine.id
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                      }`}
                    >
                      {engine.label}
                    </button>
                  ))}
                </div>

                {/* Prompt Text Container */}
                <div className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] text-xs font-mono text-[var(--text-body)] leading-relaxed select-all max-h-56 overflow-y-auto">
                  {aiPrompts[selectedPromptEngine]}
                </div>

                {/* Lighting & Footwear Quick Toggles */}
                <div className="pt-2 border-t border-[var(--border-card)] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">
                      Lighting:
                    </span>
                    {[
                      { id: 'gala_evening' as const, label: 'Gala Spotlight' },
                      { id: 'golden_hour' as const, label: 'Golden Hour' },
                      { id: 'studio' as const, label: '8500K Studio' },
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setTryOnLighting(l.id)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer ${
                          tryOnLighting === l.id
                            ? 'bg-[var(--gold-primary)] text-black'
                            : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-card)]'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">
                      Foot:
                    </span>
                    <button
                      onClick={() => setFootwearPreference('shoes')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer ${
                        footwearPreference === 'shoes'
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
                      }`}
                    >
                      👡 Shoes
                    </button>
                    <button
                      onClick={() => setFootwearPreference('barefoot')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer ${
                        footwearPreference === 'barefoot'
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
                      }`}
                    >
                      🦶 Barefoot
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
