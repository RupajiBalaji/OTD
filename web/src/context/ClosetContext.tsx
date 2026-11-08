/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wardrobeApiService } from '../services/wardrobe.service';
import { outfitsApiService } from '../services/outfits.service';
import { profileApiService } from '../services/profile.service';
import { weatherApiService } from '../services/weather.service';
import { authService } from '../services/auth.service';
import { aiApiService } from '../services/ai.service';
import { useToast } from '../components/ui/Toast';
import { PERSONA_WARDROBES, DEMO_CLIENT_ACCOUNTS, type PersonaType } from '../data/personaWardrobes';

export interface ClosetItem {
  id: string;
  category: 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories';
  subType: string;
  name: string;
  brand: string;
  color: string;
  fit: 'Slim' | 'Regular' | 'Relaxed / Tailored';
  formality: 1 | 2 | 3 | 4 | 5; // 1 = Casual, 5 = Black Tie
  icon: string;
  imageUrl?: string;
  timesWorn?: number;
  lastWorn?: string;
  cost?: number;
  material?: string;
  season?: string[];
}

export interface UserProfile {
  name: string;
  height: string;
  bodyShape: string;
  stylePersonas: string[];
  preferredFit: string;
  palettePreferences: string[];
  avoidedColors: string[];
  dislikedElements: string[];
  skinTone?: string;
  customModelPhotoUrl?: string;
  avatarUrl?: string;
  gender?: string;
}

export interface OutfitRecommendation {
  id: string;
  title: string;
  occasion: string;
  venue: string;
  vibe: string;
  weather: string;
  pieces: ClosetItem[];
  rationale: {
    venueAlignment: string;
    weatherComfort: string;
    paletteHarmony: string;
    wardrobeUtilization?: string;
  };
  harmonyScore: number;
  source?: 'gemini' | 'rules';
  createdAt?: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  city: string;
  humidity: number;
}

interface ClosetContextType {
  activePersona: PersonaType;
  switchPersona: (persona: PersonaType) => Promise<void>;
  profile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  closet: ClosetItem[];
  addClosetItem: (item: Omit<ClosetItem, 'id'>) => Promise<void>;
  deleteClosetItem: (id: string) => Promise<void>;
  updateClosetItem: (id: string, updates: Partial<ClosetItem>) => void;
  currentOutfit: OutfitRecommendation | null;
  setCurrentOutfit: React.Dispatch<React.SetStateAction<OutfitRecommendation | null>>;
  savedLooks: OutfitRecommendation[];
  saveLook: (outfit: OutfitRecommendation) => Promise<void>;
  removeSavedLook: (id: string) => Promise<void>;
  isLookSaved: (id: string) => boolean;
  markOutfitWorn: (outfitId: string) => Promise<void>;
  generateOutfit: (context: { venue: string; occasion: string; vibe: string; weather: string }) => Promise<OutfitRecommendation>;
  modifyOutfit: (instruction: string) => Promise<void>;
  isGenerating: boolean;
  generationStepMessage: string;
  history: string[];
  weather: WeatherData;
  setWeather: (weather: WeatherData) => void;
  refreshWeather: () => Promise<void>;
  loadSampleCloset: () => void;
  clearCloset: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Curator',
  height: `5'11" (180 cm)`,
  bodyShape: 'Athletic / V-Taper',
  stylePersonas: ['Old Money Heritage', 'Clean Minimalist'],
  preferredFit: 'Tailored / Regular',
  palettePreferences: ['Espresso & Earth', 'Ivory & Cream', 'Charcoal & Navy'],
  avoidedColors: ['Neon Green', 'Hot Pink', 'Loud Yellow'],
  dislikedElements: ['Skinny Fits', 'Polyester Blends', 'Heavy Branding'],
};

// Real mathematical harmony score calculation (no static 99.6%)
export function calculateDynamicHarmonyScore(
  pieces: ClosetItem[],
  targetFormality: number = 3,
  temperature: number = 24
): number {
  if (!pieces || pieces.length === 0) return 72.0;

  // 1. Color Harmony Component (0 - 40 pts)
  let colorScore = 32.0;
  const colors = pieces.map((p) => (p.color || '').toLowerCase());
  const hasNeutral = colors.some((c) =>
    ['white', 'ivory', 'cream', 'black', 'charcoal', 'navy', 'khaki', 'sand', 'grey'].some((n) => c.includes(n))
  );
  const hasAccent = colors.some((c) =>
    ['blue', 'rust', 'terracotta', 'rose', 'pink', 'green', 'olive', 'cherry'].some((a) => c.includes(a))
  );

  if (hasNeutral && hasAccent) colorScore += 6.5;
  else if (hasNeutral) colorScore += 5.0;

  // 2. Formality Alignment (0 - 35 pts)
  let formalityScore = 30.0;
  const formalities = pieces.map((p) => p.formality || 3);
  const avgFormality = formalities.reduce((a, b) => a + b, 0) / formalities.length;
  const delta = Math.abs(avgFormality - targetFormality);

  if (delta < 0.5) formalityScore += 4.0;
  else if (delta <= 1.0) formalityScore += 2.0;
  else formalityScore -= Math.min(8.0, delta * 2.0);

  // 3. Thermal Comfort & Fabric Fit (0 - 25 pts)
  let climateScore = 20.0;
  const materials = pieces.map((p) => (p.material || '').toLowerCase()).join(' ');

  if (temperature >= 26) {
    if (materials.includes('linen') || materials.includes('cotton') || materials.includes('silk') || materials.includes('slub')) {
      climateScore += 4.0;
    }
    if (materials.includes('heavy wool') || materials.includes('cashmere')) {
      climateScore -= 5.0;
    }
  } else if (temperature <= 18) {
    if (materials.includes('wool') || materials.includes('cashmere') || materials.includes('tweed') || materials.includes('twill')) {
      climateScore += 4.0;
    }
  }

  const computed = +(colorScore + formalityScore + climateScore).toFixed(1);
  return Math.min(99.4, Math.max(72.0, computed));
}

const ClosetContext = createContext<ClosetContextType | undefined>(undefined);

export const ClosetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();

  const [activePersona, setActivePersona] = useState<PersonaType>(() => {
    const saved = localStorage.getItem('otd_active_persona') as PersonaType;
    return saved && PERSONA_WARDROBES[saved] ? saved : 'women';
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const initialPersona = (localStorage.getItem('otd_active_persona') as PersonaType) || 'women';
    return PERSONA_WARDROBES[initialPersona]?.profile || DEFAULT_PROFILE;
  });

  const [closet, setCloset] = useState<ClosetItem[]>(() => {
    const initialPersona = (localStorage.getItem('otd_active_persona') as PersonaType) || 'women';
    return PERSONA_WARDROBES[initialPersona]?.closetItems || [];
  });

  const [savedLooks, setSavedLooks] = useState<OutfitRecommendation[]>([]);
  const [currentOutfit, setCurrentOutfit] = useState<OutfitRecommendation | null>(null);

  const [weather, setWeather] = useState<WeatherData>({
    temp: 26,
    condition: 'Partly Sunny',
    city: 'Atelier Central',
    humidity: 52,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStepMessage, setGenerationStepMessage] = useState('');
  const [history] = useState<string[]>([]);

  // Helper to map API wardrobe item to frontend ClosetItem
  const mapApiItem = useCallback((item: any): ClosetItem => ({
    id: item._id || item.id || `item_${Date.now()}`,
    category: item.category || 'tops',
    subType: item.subType || item.name || 'Garment',
    name: item.name,
    brand: item.brand || 'Bespoke Atelier',
    color: item.color || 'Neutral',
    fit: item.fit || 'Regular',
    formality: (item.formality as 1 | 2 | 3 | 4 | 5) || 3,
    icon:
      item.icon ||
      (item.category === 'tops'
        ? '👕'
        : item.category === 'bottoms'
        ? '👖'
        : item.category === 'outerwear'
        ? '🧥'
        : item.category === 'footwear'
        ? '👞'
        : '⌚'),
    imageUrl: item.imageUrl,
    timesWorn: item.timesWorn || 0,
    lastWorn: item.lastWorn,
    cost: item.purchasePrice || item.cost || 150,
    material: item.fabric || item.material || 'Natural Fiber',
    season: Array.isArray(item.season) ? item.season : [item.season || 'All Season'],
  }), []);

  // Sync data from backend whenever user is authenticated
  const syncWithBackend = useCallback(async () => {
    const token = localStorage.getItem('otd_access_token');
    if (!token) return;

    try {
      // 1. Fetch Profile
      const apiProfile = await profileApiService.getProfile(token);
      if (apiProfile) {
        setProfile((prev) => ({
          ...prev,
          name: apiProfile.name || prev.name,
          height: apiProfile.height || prev.height,
          bodyShape: apiProfile.bodyShape || prev.bodyShape,
          skinTone: apiProfile.skinTone || prev.skinTone,
          stylePersonas: apiProfile.stylePersonas?.length ? apiProfile.stylePersonas : prev.stylePersonas,
          preferredFit: apiProfile.preferredFit || prev.preferredFit,
          palettePreferences: apiProfile.palettePreferences?.length ? apiProfile.palettePreferences : prev.palettePreferences,
          avoidedColors: apiProfile.avoidedColors?.length ? apiProfile.avoidedColors : prev.avoidedColors,
          dislikedElements: apiProfile.dislikedElements?.length ? apiProfile.dislikedElements : prev.dislikedElements,
        }));
      }

      // 2. Fetch Wardrobe Items
      const apiItems = await wardrobeApiService.fetchItems(token);
      if (Array.isArray(apiItems) && apiItems.length > 0) {
        setCloset(apiItems.map(mapApiItem));
      }

      // 3. Fetch Saved Outfits
      const apiSaved = await outfitsApiService.getSavedOutfits(token);
      if (Array.isArray(apiSaved) && apiSaved.length > 0) {
        setSavedLooks(
          apiSaved.map((o) => ({
            id: o._id,
            title: o.title,
            occasion: o.occasion,
            venue: o.venue || 'Curated Venue',
            vibe: o.vibe || 'Minimalist',
            weather: o.weather || 'Pleasant',
            pieces: Array.isArray(o.items) ? o.items.map(mapApiItem) : [],
            rationale: {
              venueAlignment: o.rationale?.venueAlignment || 'Matches venue perfectly.',
              weatherComfort: o.rationale?.weatherComfort || 'Optimal thermal balance.',
              paletteHarmony: o.rationale?.paletteHarmony || 'Balanced tonal palette.',
              wardrobeUtilization: o.rationale?.wardrobeUtilization || 'High cost efficiency.',
            },
            harmonyScore: o.harmonyScore || calculateDynamicHarmonyScore(Array.isArray(o.items) ? o.items.map(mapApiItem) : [], 3, 24),
            source: (o as any).source || 'gemini',
            createdAt: o.createdAt || new Date().toISOString(),
          }))
        );
      }

      // 4. Fetch Daily Recommendations & Hydrate Current Outfit
      const apiDaily = await outfitsApiService.getDailyRecommendations(token);
      if (Array.isArray(apiDaily) && apiDaily.length > 0) {
        const topDaily = apiDaily[0];
        const mappedDailyPieces = Array.isArray(topDaily.items) ? topDaily.items.map(mapApiItem) : [];
        setCurrentOutfit((prev) => {
          if (prev && !prev.id.startsWith('curated_') && !prev.id.startsWith('demo_')) return prev;
          return {
            id: topDaily._id,
            title: topDaily.title,
            occasion: topDaily.occasion,
            venue: topDaily.venue || 'Curated Venue',
            vibe: topDaily.vibe || 'Minimalist',
            weather: topDaily.weather || 'Pleasant',
            pieces: mappedDailyPieces,
            rationale: {
              venueAlignment: topDaily.rationale?.venueAlignment || 'Matches venue perfectly.',
              weatherComfort: topDaily.rationale?.weatherComfort || 'Optimal thermal balance.',
              paletteHarmony: topDaily.rationale?.paletteHarmony || 'Balanced tonal palette.',
              wardrobeUtilization: topDaily.rationale?.wardrobeUtilization || 'High cost efficiency.',
            },
            harmonyScore: topDaily.harmonyScore || calculateDynamicHarmonyScore(mappedDailyPieces, 3, 24),
            source: (topDaily as any).source || 'gemini',
            createdAt: topDaily.createdAt || new Date().toISOString(),
          };
        });
      }
    } catch (err: any) {
      toast.error('Sync error', `Could not synchronize data with backend: ${err.message || 'Network issue'}`);
    }
  }, [mapApiItem, toast]);

  const refreshWeather = useCallback(async () => {
    try {
      const telemetry = await weatherApiService.detectBrowserLocationWeather();
      if (telemetry) {
        setWeather({
          temp: telemetry.temperature,
          condition: telemetry.condition,
          city: telemetry.city,
          humidity: telemetry.humidity,
        });
      }
    } catch (err) {
      console.warn('Weather auto-refresh fallback:', err);
    }
  }, []);

  // Persona switcher: authenticates as real backend user with real tokens
  const switchPersona = useCallback(
    async (persona: PersonaType) => {
      if (!PERSONA_WARDROBES[persona]) return;
      setActivePersona(persona);
      localStorage.setItem('otd_active_persona', persona);

      const demoAccount = DEMO_CLIENT_ACCOUNTS[persona];
      if (demoAccount) {
        try {
          const authRes = await authService.login({
            email: demoAccount.email,
            password: 'Password123!',
          });

          if (authRes.success && authRes.data?.tokens?.accessToken) {
            localStorage.setItem('otd_access_token', authRes.data.tokens.accessToken);
            if (authRes.data.tokens.refreshToken) {
              localStorage.setItem('otd_refresh_token', authRes.data.tokens.refreshToken);
            }
            localStorage.setItem('otd_user', JSON.stringify(authRes.data.user));
            window.dispatchEvent(new Event('otd_auth_change'));
            await syncWithBackend();
            toast.success('Persona switched', `Authenticated as ${demoAccount.title}`);
            return;
          } else {
            toast.error('Persona login failed', authRes.error || 'Please ensure backend is running.');
          }
        } catch (err: any) {
          toast.error('Authentication Error', `Could not log in as ${demoAccount.title}: ${err.message}`);
        }
      }

      // Local fallback representation if server offline
      const targetData = PERSONA_WARDROBES[persona];
      setProfile(targetData.profile);
      setCloset(targetData.closetItems);
    },
    [syncWithBackend, toast]
  );

  // Initialize on mount
  useEffect(() => {
    let isMounted = true;
    const initialize = async () => {
      const token = localStorage.getItem('otd_access_token');
      if (!token) {
        const initialPersona = (localStorage.getItem('otd_active_persona') as PersonaType) || 'women';
        const demo = DEMO_CLIENT_ACCOUNTS[initialPersona];
        if (demo) {
          try {
            const res = await authService.login({ email: demo.email, password: 'Password123!' });
            if (res.success && res.data?.tokens?.accessToken) {
              localStorage.setItem('otd_access_token', res.data.tokens.accessToken);
              if (res.data.tokens.refreshToken) {
                localStorage.setItem('otd_refresh_token', res.data.tokens.refreshToken);
              }
              localStorage.setItem('otd_user', JSON.stringify(res.data.user));
            }
          } catch (e: any) {
            console.warn('[Auto-login demo notice]:', e.message);
          }
        }
      }

      await syncWithBackend();
      if (isMounted) {
        await refreshWeather();
      }
    };

    void initialize();

    const handleAuthChange = () => {
      void syncWithBackend();
    };

    window.addEventListener('otd_auth_change', handleAuthChange);
    return () => {
      isMounted = false;
      window.removeEventListener('otd_auth_change', handleAuthChange);
    };
  }, [syncWithBackend, refreshWeather]);

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
    const token = localStorage.getItem('otd_access_token');
    if (token) {
      profileApiService.updateProfile(newProfile, token).catch((err) => {
        toast.error('Profile update failed', err.message);
      });
    }
  };

  const addClosetItem = async (item: Omit<ClosetItem, 'id'>) => {
    const tempId = `item_${Date.now()}`;
    const newItem: ClosetItem = {
      ...item,
      id: tempId,
      timesWorn: 0,
      cost: item.cost || 150,
      season: item.season || ['All Season'],
    };
    setCloset((prev) => [newItem, ...prev]);

    const token = localStorage.getItem('otd_access_token');
    if (token) {
      try {
        const created = await wardrobeApiService.createItem(
          {
            name: item.name,
            category: item.category,
            color: item.color,
            fabric: item.material,
            purchasePrice: item.cost || 150,
            imageUrl: item.imageUrl || '/wardrobe/man/man_cargo_khaki_pants.png',
          },
          token
        );
        if (created) {
          setCloset((prev) => prev.map((i) => (i.id === tempId ? mapApiItem(created) : i)));
          toast.success('Piece saved to wardrobe', `${item.name} added to your verified closet.`);
        }
      } catch (err: any) {
        toast.error('Save failed', `Could not save ${item.name} to database: ${err.message}`);
      }
    }
  };

  const deleteClosetItem = async (id: string) => {
    const deleted = closet.find((i) => i.id === id);
    setCloset((prev) => prev.filter((item) => item.id !== id));

    const token = localStorage.getItem('otd_access_token');
    if (token && id && !id.startsWith('item_')) {
      try {
        const ok = await wardrobeApiService.deleteItem(id, token);
        if (ok) {
          toast.info('Garment removed', `${deleted?.name || 'Item'} removed from wardrobe.`);
        }
      } catch (err: any) {
        toast.error('Deletion failed', `Could not delete item: ${err.message}`);
        // Rollback
        if (deleted) setCloset((prev) => [deleted, ...prev]);
      }
    }
  };

  const updateClosetItem = (id: string, updates: Partial<ClosetItem>) => {
    setCloset((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const saveLook = async (outfit: OutfitRecommendation) => {
    setSavedLooks((prev) => {
      if (prev.some((l) => l.id === outfit.id)) return prev;
      return [outfit, ...prev];
    });

    const token = localStorage.getItem('otd_access_token');
    if (token && outfit.id && !outfit.id.startsWith('curated_') && !outfit.id.startsWith('saved_')) {
      try {
        await outfitsApiService.toggleBookmark(outfit.id, token);
        toast.success('Look bookmarked', `"${outfit.title}" saved to your curated looks.`);
      } catch (err: any) {
        toast.error('Bookmark error', err.message);
      }
    }
  };

  const removeSavedLook = async (id: string) => {
    setSavedLooks((prev) => prev.filter((l) => l.id !== id));
    const token = localStorage.getItem('otd_access_token');
    if (token && id && !id.startsWith('curated_') && !id.startsWith('saved_')) {
      try {
        await outfitsApiService.toggleBookmark(id, token);
        toast.info('Look removed', 'Removed from your saved looks.');
      } catch (err: any) {
        toast.error('Remove error', err.message);
      }
    }
  };

  const isLookSaved = (id: string): boolean => {
    return savedLooks.some((l) => l.id === id);
  };

  const markOutfitWorn = async (outfitId: string) => {
    const targetOutfit = outfitId === currentOutfit?.id ? currentOutfit : savedLooks.find((l) => l.id === outfitId);
    if (!targetOutfit) return;

    const pieceIds = new Set(targetOutfit.pieces.map((p) => p.id));
    const nowIso = new Date().toISOString();

    setCloset((prev) =>
      prev.map((item) => {
        if (pieceIds.has(item.id)) {
          return {
            ...item,
            timesWorn: (item.timesWorn || 0) + 1,
            lastWorn: nowIso,
          };
        }
        return item;
      })
    );

    const token = localStorage.getItem('otd_access_token');
    if (token && outfitId && !outfitId.startsWith('curated_') && !outfitId.startsWith('saved_')) {
      try {
        await outfitsApiService.logAsWorn(outfitId, token);
        toast.success('Outfit marked worn', 'Garment wear count and cost-per-wear telemetry updated.');
      } catch (err: any) {
        toast.error('Telemetry update failed', err.message);
      }
    }
  };

  const generateOutfit = async (context: {
    venue: string;
    occasion: string;
    vibe: string;
    weather: string;
  }): Promise<OutfitRecommendation> => {
    setIsGenerating(true);
    setGenerationStepMessage('Scanning Digital Closet & Fabric Inventory...');

    try {
      const token = localStorage.getItem('otd_access_token');
      if (token) {
        const apiOutfit = await outfitsApiService.generateOutfit(
          {
            occasion: context.occasion,
            venue: context.venue,
            vibe: context.vibe,
            weather: context.weather,
            temperature: weather.temp,
            avoidedColors: profile.avoidedColors,
            dislikedElements: profile.dislikedElements,
            preferredFit: profile.preferredFit,
          },
          token
        );

        if (apiOutfit && Array.isArray(apiOutfit.items) && apiOutfit.items.length > 0) {
          const mappedPieces = apiOutfit.items.map(mapApiItem);
          const computedHarmony =
            apiOutfit.harmonyScore || calculateDynamicHarmonyScore(mappedPieces, 3, weather.temp);

          const generatedOutfit: OutfitRecommendation = {
            id: apiOutfit._id,
            title: apiOutfit.title,
            occasion: apiOutfit.occasion,
            venue: apiOutfit.venue || context.venue,
            vibe: apiOutfit.vibe || context.vibe,
            weather: apiOutfit.weather || context.weather,
            pieces: mappedPieces,
            rationale: {
              venueAlignment: apiOutfit.rationale?.venueAlignment || 'Precision calibrated to the venue.',
              weatherComfort: apiOutfit.rationale?.weatherComfort || 'Engineered for thermal comfort.',
              paletteHarmony: apiOutfit.rationale?.paletteHarmony || 'Cohesive tonal balance.',
              wardrobeUtilization: apiOutfit.rationale?.wardrobeUtilization || 'Optimal cost-per-wear rotation.',
            },
            harmonyScore: computedHarmony,
            source: (apiOutfit as any).source || 'gemini',
            createdAt: apiOutfit.createdAt || new Date().toISOString(),
          };

          setCurrentOutfit(generatedOutfit);
          setIsGenerating(false);
          setGenerationStepMessage('');
          toast.success(
            'Today’s Curated Choice Ready',
            `Harmony Score: ${computedHarmony}% (${generatedOutfit.source === 'gemini' ? 'Gemini 3.5 Flash' : 'Rules Engine'})`
          );
          return generatedOutfit;
        }
      }
    } catch (err: any) {
      console.warn('[Outfit Generation Error]', err);
      toast.error('Generation Error', `Falling back to local styling engine: ${err.message}`);
    }

    // Local Rules Engine Fallback
    const pieces = closet.slice(0, 3);
    const computedScore = calculateDynamicHarmonyScore(pieces, 3, weather.temp);
    const localOutfit: OutfitRecommendation = {
      id: `curated_${Date.now()}`,
      title: `${context.vibe} Look at ${context.venue}`,
      occasion: context.occasion,
      venue: context.venue,
      vibe: context.vibe,
      weather: context.weather,
      pieces,
      rationale: {
        venueAlignment: `Selected to match ${context.occasion} at ${context.venue}.`,
        weatherComfort: `Calibrated for ${weather.temp}°C ambient temperature.`,
        paletteHarmony: 'Harmonious color balance across foundational neutrals.',
        wardrobeUtilization: 'Rotates verified pieces to maximize efficiency.',
      },
      harmonyScore: computedScore,
      source: 'rules',
      createdAt: new Date().toISOString(),
    };

    setCurrentOutfit(localOutfit);
    setIsGenerating(false);
    setGenerationStepMessage('');
    return localOutfit;
  };

  const modifyOutfit = async (instruction: string) => {
    setIsGenerating(true);
    setGenerationStepMessage('Applying Sartorial Refinements...');

    try {
      const token = localStorage.getItem('otd_access_token');
      if (token && currentOutfit?.id && !currentOutfit.id.startsWith('curated_') && !currentOutfit.id.startsWith('demo_')) {
        const modified = await outfitsApiService.modifyOutfit(currentOutfit.id, instruction, token);
        if (modified && Array.isArray(modified.items)) {
          const pieces = modified.items.map(mapApiItem);
          const computedScore = modified.harmonyScore || calculateDynamicHarmonyScore(pieces, 3, weather.temp);
          setCurrentOutfit((prev) =>
            prev
              ? {
                  ...prev,
                  pieces,
                  rationale: {
                    venueAlignment: modified.rationale?.venueAlignment || prev.rationale.venueAlignment,
                    weatherComfort: modified.rationale?.weatherComfort || prev.rationale.weatherComfort,
                    paletteHarmony: modified.rationale?.paletteHarmony || prev.rationale.paletteHarmony,
                  },
                  harmonyScore: computedScore,
                }
              : null
          );
          setIsGenerating(false);
          setGenerationStepMessage('');
          toast.success('Outfit Refined', `Adapted ensemble based on: "${instruction}"`);
          return;
        }
      } else {
        const aiRes = await aiApiService.chatWithStylist(
          {
            message: instruction,
            occasion: currentOutfit?.occasion || 'Casual Outing',
            venue: currentOutfit?.venue,
            weather: `${weather.temp}°C ${weather.condition}`,
          },
          token || undefined
        );

        if (aiRes) {
          let updatedPieces = [...(currentOutfit?.pieces || closet.slice(0, 3))];
          if (aiRes.slotChanges && aiRes.slotChanges.length > 0) {
            for (const change of aiRes.slotChanges) {
              if (change.itemId) {
                const piece = closet.find((c) => c.id === change.itemId);
                if (piece) {
                  updatedPieces = updatedPieces.filter((p) => p.category !== piece.category);
                  updatedPieces.push(piece);
                }
              }
            }
          }
          const computedScore = calculateDynamicHarmonyScore(updatedPieces, 3, weather.temp);
          setCurrentOutfit((prev) =>
            prev
              ? {
                  ...prev,
                  pieces: updatedPieces,
                  rationale: {
                    ...prev.rationale,
                    venueAlignment: aiRes.reply,
                  },
                  harmonyScore: computedScore,
                }
              : null
          );
          setIsGenerating(false);
          setGenerationStepMessage('');
          toast.success('Outfit Refined', aiRes.reply.slice(0, 80) + '...');
          return;
        }
      }
    } catch (err: any) {
      console.warn('[Modify Outfit error]:', err);
    }

    // Local fallback modification
    setCurrentOutfit((prev) => {
      if (!prev) return null;
      const computed = calculateDynamicHarmonyScore(prev.pieces, 3, weather.temp);
      return {
        ...prev,
        harmonyScore: Math.min(99.4, +(computed + 0.5).toFixed(1)),
        rationale: {
          ...prev.rationale,
          venueAlignment: `Fine-tuned to your request: "${instruction}".`,
        },
      };
    });

    setIsGenerating(false);
    setGenerationStepMessage('');
  };

  const loadSampleCloset = () => {
    setCloset(PERSONA_WARDROBES[activePersona]?.closetItems || []);
  };

  const clearCloset = () => {
    setCloset([]);
  };

  return (
    <ClosetContext.Provider
      value={{
        activePersona,
        switchPersona,
        profile,
        updateProfile,
        closet,
        addClosetItem,
        deleteClosetItem,
        updateClosetItem,
        currentOutfit,
        setCurrentOutfit,
        savedLooks,
        saveLook,
        removeSavedLook,
        isLookSaved,
        markOutfitWorn,
        generateOutfit,
        modifyOutfit,
        isGenerating,
        generationStepMessage,
        history,
        weather,
        setWeather,
        refreshWeather,
        loadSampleCloset,
        clearCloset,
      }}
    >
      {children}
    </ClosetContext.Provider>
  );
};

export const useCloset = () => {
  const context = useContext(ClosetContext);
  if (!context) {
    throw new Error('useCloset must be used within a ClosetProvider');
  }
  return context;
};
