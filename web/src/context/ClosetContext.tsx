/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { wardrobeApiService } from '../services/wardrobe.service';
import { outfitsApiService } from '../services/outfits.service';
import { profileApiService } from '../services/profile.service';
import { weatherApiService } from '../services/weather.service';
import { PERSONA_WARDROBES, type PersonaType } from '../data/personaWardrobes';

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
  switchPersona: (persona: PersonaType) => void;
  profile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  closet: ClosetItem[];
  addClosetItem: (item: Omit<ClosetItem, 'id'>) => void;
  deleteClosetItem: (id: string) => void;
  updateClosetItem: (id: string, updates: Partial<ClosetItem>) => void;
  currentOutfit: OutfitRecommendation | null;
  setCurrentOutfit: React.Dispatch<React.SetStateAction<OutfitRecommendation | null>>;
  savedLooks: OutfitRecommendation[];
  saveLook: (outfit: OutfitRecommendation) => void;
  removeSavedLook: (id: string) => void;
  isLookSaved: (id: string) => boolean;
  markOutfitWorn: (outfitId: string) => void;
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

const INITIAL_CLOSET: ClosetItem[] = PERSONA_WARDROBES.girl.closetItems;

const INITIAL_SAVED_LOOKS: OutfitRecommendation[] = [
  {
    id: 'saved_1',
    title: 'Coastal Resort Botanical & Utility Cargoes',
    occasion: 'Weekend Brunch',
    venue: 'Olive Bistro, Jubilee Hills',
    vibe: 'Relaxed & Breezy',
    weather: '26°C Sunny',
    pieces: [PERSONA_WARDROBES.man.closetItems[0], PERSONA_WARDROBES.man.closetItems[10]],
    rationale: {
      venueAlignment: 'Complements the sunlit Mediterranean terrace of Olive Bistro with effortless unconstructed fabrics.',
      weatherComfort: 'Slub cotton breathability keeps core body temperature regulated in warm afternoon sunlight.',
      paletteHarmony: 'Denim sky blue botanical print against warm sand khaki creates maritime quiet luxury.',
      wardrobeUtilization: 'Maximizes wear on signature resort pieces.'
    },
    harmonyScore: 99.4,
    createdAt: '2026-10-28'
  },
  {
    id: 'saved_2',
    title: 'White Cherry Corset Dress & Ruched Platform Heels',
    occasion: 'Fine Dining Date',
    venue: "L'amore, Banjara Hills",
    vibe: 'Intimate & Confident',
    weather: '28°C Mild Evening',
    pieces: [PERSONA_WARDROBES.girl.closetItems[0], PERSONA_WARDROBES.girl.closetItems[9]],
    rationale: {
      venueAlignment: 'Formulated for garden evening celebration and romantic dinner.',
      weatherComfort: 'Pure cotton poplin allows structured corset drape without thermal discomfort.',
      paletteHarmony: 'Optic white with scarlet cherry accents and pearl ivory platform block heels.',
      wardrobeUtilization: 'Leverages high-investment signature pieces.'
    },
    harmonyScore: 99.6,
    createdAt: '2026-10-30'
  }
];

const OTD_STORAGE_VERSION = 'v12_curated_footwear_men_boys';

const getInitialCloset = (persona: PersonaType): ClosetItem[] => {
  const canonical = PERSONA_WARDROBES[persona]?.closetItems || INITIAL_CLOSET;
  try {
    const currentVer = localStorage.getItem('otd_storage_version');
    if (currentVer !== OTD_STORAGE_VERSION) {
      // Purge old cached wardrobes across all personas
      localStorage.removeItem('otd_closet_items');
      localStorage.removeItem('otd_closet_items_girl');
      localStorage.removeItem('otd_closet_items_boy');
      localStorage.removeItem('otd_closet_items_man');
      localStorage.removeItem('otd_closet_items_women');
      localStorage.setItem('otd_storage_version', OTD_STORAGE_VERSION);
      return canonical;
    }

    const saved = localStorage.getItem(`otd_closet_items_${persona}`) || localStorage.getItem('otd_closet_items');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Keep canonical items + user custom-added items
        const customItems = parsed.filter((item: ClosetItem) => item.id?.startsWith('custom_'));
        return [...canonical, ...customItems];
      }
    }
  } catch (e) {
    console.warn('Error parsing closet from localStorage:', e);
  }
  return canonical;
};

const ClosetContext = createContext<ClosetContextType | undefined>(undefined);

export const ClosetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePersona, setActivePersona] = useState<PersonaType>(() => {
    const saved = localStorage.getItem('otd_active_persona') as PersonaType;
    if (saved && PERSONA_WARDROBES[saved]) {
      return saved;
    }
    return 'girl';
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('otd_user_profile');
    const initialPersona = (localStorage.getItem('otd_active_persona') as PersonaType) || 'girl';
    const fallbackProfile = PERSONA_WARDROBES[initialPersona]?.profile || DEFAULT_PROFILE;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...fallbackProfile,
          ...parsed,
          avoidedColors: parsed.avoidedColors || fallbackProfile.avoidedColors,
          dislikedElements: parsed.dislikedElements || fallbackProfile.dislikedElements
        };
      } catch (e) {
        console.error('Error parsing profile from localStorage:', e);
      }
    }
    return fallbackProfile;
  });

  const [closet, setCloset] = useState<ClosetItem[]>(() => {
    const initialPersona = (localStorage.getItem('otd_active_persona') as PersonaType) || 'girl';
    return getInitialCloset(initialPersona);
  });

  const [savedLooks, setSavedLooks] = useState<OutfitRecommendation[]>(() => {
    const saved = localStorage.getItem('otd_saved_looks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved looks from localStorage:', e);
      }
    }
    return INITIAL_SAVED_LOOKS;
  });

  const [currentOutfit, setCurrentOutfit] = useState<OutfitRecommendation | null>(() => {
    const saved = localStorage.getItem('otd_current_outfit');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing current outfit from localStorage:', e);
      }
    }
    return null;
  });

  const [weather, setWeather] = useState<WeatherData>({
    temp: 28,
    condition: 'Partly Cloudy',
    city: 'Hyderabad',
    humidity: 56
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStepMessage, setGenerationStepMessage] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  // Helper to map API wardrobe item to frontend ClosetItem
  const mapApiItem = (item: any): ClosetItem => ({
    id: item._id || item.id || `item_${Date.now()}`,
    category: item.category || 'tops',
    subType: item.subType || item.name || 'Garment',
    name: item.name,
    brand: item.brand || 'Bespoke Atelier',
    color: item.color || 'Neutral',
    fit: item.fit || 'Regular',
    formality: (item.formality as 1 | 2 | 3 | 4 | 5) || 3,
    icon: item.icon || (item.category === 'tops' ? '👕' : item.category === 'bottoms' ? '👖' : item.category === 'outerwear' ? '🧥' : item.category === 'footwear' ? '👞' : '⌚'),
    imageUrl: item.imageUrl,
    timesWorn: item.timesWorn || 0,
    lastWorn: item.lastWorn,
    cost: item.purchasePrice || item.cost || 150,
    material: item.fabric || item.material || 'Natural Fiber',
    season: Array.isArray(item.season) ? item.season : [item.season || 'All'],
  });

  // Sync data from backend whenever user is authenticated
  const syncWithBackend = async () => {
    const token = localStorage.getItem('otd_access_token');
    if (!token) return;

    try {
      // 1. Fetch Profile
      const apiProfile = await profileApiService.getProfile(token);
      if (apiProfile) {
        setProfile(prev => ({
          ...prev,
          name: apiProfile.name || prev.name,
          height: apiProfile.height || prev.height,
          bodyShape: apiProfile.bodyShape || prev.bodyShape,
          stylePersonas: apiProfile.stylePersonas?.length ? apiProfile.stylePersonas : prev.stylePersonas,
          preferredFit: apiProfile.preferredFit || prev.preferredFit,
          palettePreferences: apiProfile.palettePreferences?.length ? apiProfile.palettePreferences : prev.palettePreferences,
          avoidedColors: apiProfile.avoidedColors?.length ? apiProfile.avoidedColors : prev.avoidedColors,
          dislikedElements: apiProfile.dislikedElements?.length ? apiProfile.dislikedElements : prev.dislikedElements,
        }));
      }

      // 2. Fetch Wardrobe Items
      const apiItems = await wardrobeApiService.fetchItems(token);
      if (Array.isArray(apiItems)) {
        if (apiItems.length > 0) {
          setCloset(apiItems.map(mapApiItem));
        } else {
          // Fallback to canonical persona items + any user-created custom items
          const canonical = PERSONA_WARDROBES[activePersona]?.closetItems || [];
          const localSaved = localStorage.getItem(`otd_closet_items_${activePersona}`) || localStorage.getItem('otd_closet_items');
          let customItems: ClosetItem[] = [];
          if (localSaved) {
            try {
              const parsed = JSON.parse(localSaved);
              if (Array.isArray(parsed)) {
                customItems = parsed.filter((p: ClosetItem) => p.id?.startsWith('custom_'));
              }
            } catch {}
          }
          setCloset([...canonical, ...customItems]);
        }
      }

      // 3. Fetch Saved Outfits
      const apiSaved = await outfitsApiService.getSavedOutfits(token);
      if (Array.isArray(apiSaved) && apiSaved.length > 0) {
        setSavedLooks(apiSaved.map(o => ({
          id: o._id,
          title: o.title,
          occasion: o.occasion,
          venue: o.venue || 'Curated Venue',
          vibe: o.vibe || 'Minimalist',
          weather: o.weather || 'Pleasant',
          pieces: o.items.map(mapApiItem),
          rationale: {
            venueAlignment: o.rationale?.venueAlignment || 'Matches venue perfectly.',
            weatherComfort: o.rationale?.weatherComfort || 'Optimal thermal balance.',
            paletteHarmony: o.rationale?.paletteHarmony || 'Balanced tonal palette.',
            wardrobeUtilization: o.rationale?.wardrobeUtilization || 'High cost efficiency.',
          },
          harmonyScore: o.harmonyScore || 98.2,
          createdAt: o.createdAt || new Date().toISOString(),
        })));
      }
    } catch (err) {
      console.warn('Backend sync error (falling back to local cache):', err);
    }
  };

  const refreshWeather = async () => {
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
  };

  useEffect(() => {
    let isMounted = true;
    const initialize = async () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('otd_user_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalStorage error caching profile:', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      // Strip any accidental data URLs before caching to prevent QuotaExceededError
      const safeItems = closet.map((item) => {
        if (item.imageUrl && item.imageUrl.startsWith('data:')) {
          return {
            ...item,
            imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80',
          };
        }
        return item;
      });
      localStorage.setItem('otd_closet_items', JSON.stringify(safeItems));
    } catch (e) {
      console.warn('LocalStorage quota limit reached, skipping closet cache:', e);
    }
  }, [closet]);

  useEffect(() => {
    try {
      localStorage.setItem('otd_saved_looks', JSON.stringify(savedLooks));
    } catch (e) {
      console.warn('LocalStorage error caching saved looks:', e);
    }
  }, [savedLooks]);

  useEffect(() => {
    if (currentOutfit) {
      try {
        localStorage.setItem('otd_current_outfit', JSON.stringify(currentOutfit));
      } catch (e) {
        console.warn('LocalStorage error caching current outfit:', e);
      }
    }
  }, [currentOutfit]);

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
    const token = localStorage.getItem('otd_access_token');
    if (token) {
      profileApiService.updateProfile(newProfile, token).catch(() => {});
    }
  };

  const addClosetItem = (item: Omit<ClosetItem, 'id'>) => {
    const newItem: ClosetItem = {
      ...item,
      id: `custom_${Date.now()}`,
      timesWorn: 0,
      cost: item.cost || 150,
      season: item.season || ['All']
    };
    setCloset(prev => [newItem, ...prev]);

    const token = localStorage.getItem('otd_access_token');
    if (token) {
      wardrobeApiService.createItem({
        name: item.name,
        category: item.category,
        color: item.color,
        fabric: item.material,
        purchasePrice: item.cost || 150,
        imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80',
      }, token).then(created => {
        if (created) {
          setCloset(prev => prev.map(i => i.id === newItem.id ? mapApiItem(created) : i));
        }
      }).catch(() => {});
    }
  };

  const deleteClosetItem = (id: string) => {
    setCloset(prev => prev.filter(item => item.id !== id));
    const token = localStorage.getItem('otd_access_token');
    if (token && id.length === 24) {
      wardrobeApiService.deleteItem(id, token).catch(() => {});
    }
  };

  const updateClosetItem = (id: string, updates: Partial<ClosetItem>) => {
    setCloset(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const saveLook = (outfit: OutfitRecommendation) => {
    setSavedLooks(prev => {
      if (prev.some(l => l.id === outfit.id)) return prev;
      return [outfit, ...prev];
    });

    const token = localStorage.getItem('otd_access_token');
    if (token && outfit.id && !outfit.id.startsWith('otd_') && !outfit.id.startsWith('saved_')) {
      outfitsApiService.toggleBookmark(outfit.id, token).catch(() => {});
    }
  };

  const removeSavedLook = (id: string) => {
    setSavedLooks(prev => prev.filter(l => l.id !== id));
    const token = localStorage.getItem('otd_access_token');
    if (token && id && !id.startsWith('otd_') && !id.startsWith('saved_')) {
      outfitsApiService.toggleBookmark(id, token).catch(() => {});
    }
  };

  const isLookSaved = (id: string): boolean => {
    return savedLooks.some(l => l.id === id);
  };

  const markOutfitWorn = (outfitId: string) => {
    const targetOutfit = outfitId === currentOutfit?.id ? currentOutfit : savedLooks.find(l => l.id === outfitId);
    if (!targetOutfit) return;

    const pieceIds = new Set(targetOutfit.pieces.map(p => p.id));
    const nowIso = new Date().toISOString();

    setCloset(prev => prev.map(item => {
      if (pieceIds.has(item.id)) {
        return {
          ...item,
          timesWorn: (item.timesWorn || 0) + 1,
          lastWorn: nowIso
        };
      }
      return item;
    }));

    const token = localStorage.getItem('otd_access_token');
    if (token && outfitId && !outfitId.startsWith('otd_') && !outfitId.startsWith('saved_')) {
      outfitsApiService.logAsWorn(outfitId, token).catch(() => {});
    }
  };

  const generateOutfit = async (context: { venue: string; occasion: string; vibe: string; weather: string }): Promise<OutfitRecommendation> => {
    setIsGenerating(true);
    setGenerationStepMessage('Scanning Digital Closet & Fabric Inventory...');

    const stages = [
      'Scanning Digital Closet & Fabric Inventory...',
      `Analyzing Venue Ambience for ${context.venue}...`,
      `Calibrating for ${context.weather} & Style DNA...`,
      'Synthesizing Optimal Chromatic Ensemble...',
    ];

    let stageIdx = 0;
    const ticker = setInterval(() => {
      stageIdx = (stageIdx + 1) % stages.length;
      setGenerationStepMessage(stages[stageIdx]);
    }, 250);

    try {
      // If authenticated, attempt backend dress selection engine synthesis first
      const token = localStorage.getItem('otd_access_token');
    if (token) {
      try {
        const apiOutfit = await outfitsApiService.generateOutfit(
          {
            occasion: context.occasion,
            venue: context.venue,
            vibe: context.vibe,
            weather: context.weather,
            avoidedColors: profile.avoidedColors,
            dislikedElements: profile.dislikedElements,
            preferredFit: profile.preferredFit,
          },
          token
        );

        if (apiOutfit && Array.isArray(apiOutfit.items) && apiOutfit.items.length > 0) {
          const generatedOutfit: OutfitRecommendation = {
            id: apiOutfit._id,
            title: apiOutfit.title,
            occasion: apiOutfit.occasion,
            venue: apiOutfit.venue || context.venue,
            vibe: apiOutfit.vibe || context.vibe,
            weather: apiOutfit.weather || context.weather,
            pieces: apiOutfit.items.map(mapApiItem),
            rationale: {
              venueAlignment: apiOutfit.rationale?.venueAlignment || `Curated specifically for ${context.venue}.`,
              weatherComfort: apiOutfit.rationale?.weatherComfort || `Calibrated for ${context.weather}.`,
              paletteHarmony: apiOutfit.rationale?.paletteHarmony || 'Elevated tonal contrast consistent with your style DNA.',
              wardrobeUtilization: apiOutfit.rationale?.wardrobeUtilization || 'Rotates underutilized pieces.',
            },
            harmonyScore: apiOutfit.harmonyScore || 98.4,
            createdAt: apiOutfit.createdAt || new Date().toISOString(),
          };

          setCurrentOutfit(generatedOutfit);
          return generatedOutfit;
        }
      } catch (err) {
        console.warn('Backend generation failed, utilizing local fallback:', err);
      }
    }

    // Parse weather temperature
    const tempMatch = context.weather.match(/(\d+)\s*°?C/i);
    const temp = tempMatch ? parseInt(tempMatch[1], 10) : 28;

    const occ = context.occasion.toLowerCase();
    const isFestive = occ.includes('festiv') || occ.includes('sangeet') || occ.includes('traditional') || occ.includes('wedding') || occ.includes('puja') || occ.includes('reception');
    const isBrunch = occ.includes('brunch') || occ.includes('cafe') || occ.includes('sunday') || occ.includes('afternoon');
    const isBeach = occ.includes('beach') || occ.includes('resort') || occ.includes('coastal') || occ.includes('holiday') || occ.includes('pool');
    const isStreetwear = occ.includes('street') || occ.includes('casual') || occ.includes('hangout') || occ.includes('skate');
    const isFormal = occ.includes('dinner') || occ.includes('evening') || occ.includes('formal') || occ.includes('black-tie') || occ.includes('gala') || occ.includes('soiree') || context.venue.toLowerCase().includes('amore');
    const isExecutive = occ.includes('office') || occ.includes('school') || occ.includes('presentation') || occ.includes('executive') || occ.includes('boardroom') || occ.includes('honors');
    const isEditorial = occ.includes('photo') || occ.includes('editorial') || occ.includes('vogue') || occ.includes('fashion');

    let pieces: ClosetItem[] = [];
    let title = '';
    let venueAlignment = '';
    let weatherComfort = '';
    let paletteHarmony = '';
    let harmonyScore = 99.4;

    const findById = (id: string) => closet.find((item) => item.id === id);
    const findBySubType = (sub: string) => closet.find((item) => item.subType.toLowerCase().includes(sub.toLowerCase()));
    const findByCategory = (cat: ClosetItem['category']) => closet.filter((item) => item.category === cat);

    // 1. GIRL PERSONA (Ananya)
    if (activePersona === 'girl') {
      if (isFestive) {
        const saree = findById('g17') || findBySubType('saree') || findByCategory('tops')[0];
        const heels = findById('g24') || findById('g25') || findByCategory('footwear')[0];
        if (saree) pieces.push(saree);
        if (heels) pieces.push(heels);
        title = 'Imperial Rose Pink Shimmer Organza Saree Set';
        venueAlignment = `Selected for ${context.venue}: tissue silk organza with metallic shimmer border radiates festive luminosity.`;
        weatherComfort = `At ${temp}°C, the airy organza silk drape ensures fluid ventilation and royal grace.`;
        paletteHarmony = 'Tonal Rose Pink Ombre with Silver metallic trim creates high-definition cultural poise.';
        harmonyScore = 99.7;
      } else if (isFormal || isEditorial) {
        const saree = findById('g18') || findById('g17') || findByCategory('tops')[0];
        const heels = findById('g25') || findById('g24') || findByCategory('footwear')[0];
        if (saree) pieces.push(saree);
        if (heels) pieces.push(heels);
        title = 'Ivory & Dusty Mauve Ombre Scalloped Mirror Saree Set';
        venueAlignment = `Curated for ${context.venue}: hand-embroidered mirror border reflects evening lighting with high-couture impact.`;
        weatherComfort = `Pure silk georgette offers fluid thermal regulation for ${temp}°C evening affairs.`;
        paletteHarmony = 'Ivory-to-mauve ombre paired with velvety black block heels elongates the vertical silhouette.';
        harmonyScore = 99.6;
      } else if (isBrunch) {
        const dress = findById('g19') || findById('g15') || findByCategory('tops')[0];
        const shoes = findById('g23') || findById('g24') || findByCategory('footwear')[0];
        if (dress) pieces.push(dress);
        if (shoes) pieces.push(shoes);
        title = 'Blush Pink Watercolor Rose Bell-Sleeve Dress & Slides';
        venueAlignment = `Curated for Sunday brunch at ${context.venue}: romantic watercolor rose bell-sleeve dress delivers effortless European garden charm.`;
        weatherComfort = `At ${temp}°C, breathable chiffon with soft cotton lining maintains optimal daytime cooling.`;
        paletteHarmony = 'Blush Rose and soft cream slides provide a warm, sunlit pastel harmony.';
        harmonyScore = 99.1;
      } else if (isBeach) {
        const dress = findById('g16') || findById('g19') || findByCategory('tops')[0];
        const slides = findById('g23') || findByCategory('footwear')[0];
        if (dress) pieces.push(dress);
        if (slides) pieces.push(slides);
        title = 'Periwinkle Sky Floral Tie-Strap Sundress & Ribbed Slides';
        venueAlignment = `Formulated for ${context.venue}: breezy crepe linen with ribbon tie-straps and ergonomic ribbed slides.`;
        weatherComfort = `At ${temp}°C, natural crepe linen facilitates optimal thermal ventilation in sea breezes.`;
        paletteHarmony = 'Periwinkle Powder Blue paired with Warm Ivory Slides echoes oceanic resort tones.';
        harmonyScore = 99.3;
      } else if (isStreetwear) {
        const pants = findById('g21') || findById('g20') || findByCategory('bottoms')[0];
        const top = findById('g15') || findByCategory('tops')[0];
        const shoes = findById('g23') || findById('g25') || findByCategory('footwear')[0];
        if (top) pieces.push(top);
        if (pants) pieces.push(pants);
        if (shoes) pieces.push(shoes);
        title = 'Y2K Painted Heart Denim & Cherry Corset Top';
        venueAlignment = `Aesthetic Pinterest street style for ${context.venue}: hand-painted white brushstroke hearts on wide-leg denim bring playful volume.`;
        weatherComfort = `Brushed ring-spun denim and breathable poplin provide all-day wearability at ${temp}°C.`;
        paletteHarmony = 'Light acid wash denim balanced by optic white poplin and red cherry micro-accents.';
        harmonyScore = 98.9;
      } else {
        // Default: Birthday / Celebration
        const dress = findById('g15') || findByCategory('tops')[0];
        const heels = findById('g24') || findByCategory('footwear')[0];
        if (dress) pieces.push(dress);
        if (heels) pieces.push(heels);
        title = 'White Cherry Corset Mini Dress & Satin Platform Heels';
        venueAlignment = `Curated for celebration party at ${context.venue}: cinched corset bodice with scarlet cherry embroidery and party-poised ruched heels.`;
        weatherComfort = `At ${temp}°C, pure cotton poplin keeps core body temperature comfortable through afternoon events.`;
        paletteHarmony = 'Optic white with scarlet cherry accents and pearl ivory satin platforms.';
        harmonyScore = 99.5;
      }
    }

    // 2. BOY PERSONA (Aarav - User Uploaded Pieces Only)
    else if (activePersona === 'boy') {
      if (isBeach) {
        const shirt = findById('b13') || findById('b14') || findByCategory('tops')[0];
        const cargo = findById('b23') || findByCategory('bottoms')[0];
        const footwear = findById('b28') || findById('b29') || findByCategory('footwear')[0];
        if (shirt) pieces.push(shirt);
        if (cargo) pieces.push(cargo);
        if (footwear) pieces.push(footwear);
        title = 'Light Blue Botanical Resort Shirt, Sand Cargoes & Crocs Slides';
        venueAlignment = `Engine-calibrated for ${context.venue}: open camp collar botanical slub cotton paired with utilitarian khaki cargoes and ergonomic white slides.`;
        weatherComfort = `At ${temp}°C, slub cotton weave maximizes active airflow, ideal for sunny outdoor recreation.`;
        paletteHarmony = 'Denim Sky Blue botanical print against Warm Sand Khaki and pure white slides.';
        harmonyScore = 99.2;
      } else if (isBrunch) {
        const shirt = findById('b14') || findById('b22') || findByCategory('tops')[0];
        const denim = findById('b24') || findByCategory('bottoms')[0];
        const footwear = findById('b29') || findById('b28') || findByCategory('footwear')[0];
        if (shirt) pieces.push(shirt);
        if (denim) pieces.push(denim);
        if (footwear) pieces.push(footwear);
        title = 'Terracotta Daisy Linen Shirt, Straight Denim & Adidas Slides';
        venueAlignment = `Curated for brunch at ${context.venue}: washed terracotta linen with natural wood buttons, vintage light-wash denim, and striped slides.`;
        weatherComfort = `Washed linen-cotton blend delivers exceptional thermal relief in ${temp}°C outdoor seating.`;
        paletteHarmony = 'Earth-toned terracotta daisy print against classic light wash indigo denim and monochrome slides.';
        harmonyScore = 99.0;
      } else if (isStreetwear) {
        const shirt = findById('b15') || findById('b17') || findByCategory('tops')[0];
        const pants = findById('b23') || findById('b24') || findByCategory('bottoms')[0];
        const footwear = findById('b30') || findById('b31') || findByCategory('footwear')[0];
        if (shirt) pieces.push(shirt);
        if (pants) pieces.push(pants);
        if (footwear) pieces.push(footwear);
        title = 'White & Steel-Blue Oversized Floral Shirt, Cargoes & Chunky Trainers';
        venueAlignment = `Youth street-style statement for ${context.venue}: oversized slate-blue daisy prints with reinforced khaki cargo pockets and high-traction chunky trainers.`;
        weatherComfort = `Silky touch poplin cotton keeps body temperature balanced at ${temp}°C.`;
        paletteHarmony = 'Optic white with architectural slate blue floral graphics against earthy khaki and graphic monochrome footwear.';
        harmonyScore = 98.8;
      } else if (isFestive || isFormal) {
        const shirt = findById('b16') || findById('b17') || findByCategory('tops')[0];
        const trousers = findById('b25') || findByCategory('bottoms')[0];
        const footwear = findById('b32') || findByCategory('footwear')[0];
        if (shirt) pieces.push(shirt);
        if (trousers) pieces.push(trousers);
        if (footwear) pieces.push(footwear);
        title = 'Forest Green Japanese Crane Jacquard, Tailored Trousers & Chelsea Boots';
        venueAlignment = `Synthesized for evening gala at ${context.venue}: textured jacquard with silk-embroidered cranes over sharp black trousers anchored by polished leather Chelsea boots.`;
        weatherComfort = `Textured cotton jacquard and crease-resistant dress trousers ensure breathable evening comfort at ${temp}°C.`;
        paletteHarmony = 'Deep Forest Green against Jet Black Noir and polished leather.';
        harmonyScore = 99.4;
      } else if (isExecutive) {
        const shirt = findById('b18') || findByCategory('tops')[0];
        const trousers = findById('b27') || findById('b26') || findByCategory('bottoms')[0];
        const footwear = findById('b32') || findById('b30') || findByCategory('footwear')[0];
        if (shirt) pieces.push(shirt);
        if (trousers) pieces.push(trousers);
        if (footwear) pieces.push(footwear);
        title = 'Classic White Oxford Polo, Mocha Trousers & Chelsea Boots';
        venueAlignment = `Tailored for honors presentation at ${context.venue}: crisp Oxford button-down polo over Italian mocha camel brown gabardine trousers and clean Chelsea boots.`;
        weatherComfort = `Calibrated for climate-controlled auditorium interiors at ${temp}°C.`;
        paletteHarmony = 'Optical White and Mocha Camel Brown create iconic prep academy prestige.';
        harmonyScore = 99.6;
      } else {
        // Default: Smart casual outing / Birthday
        const shirt = findById('b18') || findById('b21') || findByCategory('tops')[0];
        const trousers = findById('b26') || findById('b27') || findByCategory('bottoms')[0];
        const footwear = findById('b30') || findById('b32') || findByCategory('footwear')[0];
        if (shirt) pieces.push(shirt);
        if (trousers) pieces.push(trousers);
        if (footwear) pieces.push(footwear);
        title = 'Classic White Oxford Polo, Pleated Gurkha Trousers & Chunky Trainers';
        venueAlignment = `Elevated outing to ${context.venue}: heavy Oxford cotton polo with navy pony logo tucked into high-rise pleated Gurkha trousers and clean streetwear sneakers.`;
        weatherComfort = `High-twist 100% Oxford cotton weave ensures crisp structure and all-day comfort at ${temp}°C.`;
        paletteHarmony = 'Pure optical white framed by warm ivory cream and graphic monochrome trainers.';
        harmonyScore = 99.3;
      }
    }

    // 3. MAN PERSONA (Mustafa - User Uploaded Pieces Only)
    else if (activePersona === 'man') {
      if (isExecutive) {
        const shirt = findById('m18') || findById('m21') || findByCategory('tops')[0];
        const trousers = findById('m27') || findById('m25') || findByCategory('bottoms')[0];
        const footwear = findById('m32') || findByCategory('footwear')[0];
        if (shirt) pieces.push(shirt);
        if (trousers) pieces.push(trousers);
        if (footwear) pieces.push(footwear);
        title = 'Classic White Oxford Polo, Mocha Trousers & Chelsea Boots';
        venueAlignment = `Executive smart casual suiting at ${context.venue}: heavy Oxford cotton button-down polo tucked into Italian mocha gabardine trousers with calfskin Chelsea boots.`;
        weatherComfort = `High-twist Oxford weave engineered for climate-controlled boardroom temperature at ${temp}°C.`;
        paletteHarmony = 'Optical White with Mocha Camel Brown and polished black leather establishes quiet luxury.';
        harmonyScore = 99.8;
      } else if (isFormal || isFestive) {
        const shirt = findById('m16') || findById('m18') || findByCategory('tops')[0];
        const trousers = findById('m25') || findByCategory('bottoms')[0];
        const footwear = findById('m32') || findByCategory('footwear')[0];
        if (shirt) pieces.push(shirt);
        if (trousers) pieces.push(trousers);
        if (footwear) pieces.push(footwear);
        title = 'Forest Green Japanese Crane Jacquard, Jet Black Trousers & Chelsea Boots';
        venueAlignment = `Curated for evening celebration at ${context.venue}: silk-embroidered cranes over sharp jet-black trousers and formal leather Chelsea boots.`;
        weatherComfort = `Textured cotton jacquard provides breathable evening comfort under ${temp}°C conditions.`;
        paletteHarmony = 'Deep Forest Green against Jet Black Noir and lustrous black leather.';
        harmonyScore = 99.7;
      } else if (isBrunch) {
        const shirt = findById('m14') || findById('m22') || findByCategory('tops')[0];
        const trousers = findById('m26') || findByCategory('bottoms')[0];
        const footwear = findById('m29') || findById('m28') || findByCategory('footwear')[0];
        if (shirt) pieces.push(shirt);
        if (trousers) pieces.push(trousers);
        if (footwear) pieces.push(footwear);
        title = 'Terracotta Daisy Linen Shirt, Ivory Gurkha Trousers & Adidas Slides';
        venueAlignment = `Italian Riviera sprezzatura for ${context.venue}: open washed terracotta linen shirt with extended-tab forward-pleated Gurkha trousers and comfort slides.`;
        weatherComfort = `At ${temp}°C, pure Belgian linen releases body heat rapidly for effortless sunlit dining.`;
        paletteHarmony = 'Terracotta rust against warm ivory cream and monochrome sport slides.';
        harmonyScore = 99.2;
      } else if (isBeach) {
        const shirt = findById('m13') || findByCategory('tops')[0];
        const cargo = findById('m23') || findByCategory('bottoms')[0];
        const footwear = findById('m28') || findById('m29') || findByCategory('footwear')[0];
        if (shirt) pieces.push(shirt);
        if (cargo) pieces.push(cargo);
        if (footwear) pieces.push(footwear);
        title = 'Light Blue Abstract Botanical Shirt, Utility Cargoes & Crocs Slides';
        venueAlignment = `Luxury resort leisure at ${context.venue}: slub cotton botanical camp collar shirt paired with tailored utility cargo pants and breathable Crocs slides.`;
        weatherComfort = `Slub cotton weave provides high airflow at ${temp}°C coastal settings.`;
        paletteHarmony = 'Sky blue and sand khaki create effortless maritime harmony with crisp white slip-ons.';
        harmonyScore = 99.1;
      } else if (isStreetwear) {
        const shirt = findById('m15') || findById('m17') || findByCategory('tops')[0];
        const jeans = findById('m24') || findByCategory('bottoms')[0];
        const footwear = findById('m30') || findById('m31') || findByCategory('footwear')[0];
        if (shirt) pieces.push(shirt);
        if (jeans) pieces.push(jeans);
        if (footwear) pieces.push(footwear);
        title = 'White & Slate Floral Resort Shirt, Vintage Denim & Chunky Trainers';
        venueAlignment = `Sophisticated casual outing to ${context.venue}: oversized graphic floral poplin over relaxed vintage denim anchored by sculpted futuristic sneakers.`;
        weatherComfort = `Lightweight poplin cotton balances warmth and movement at ${temp}°C.`;
        paletteHarmony = 'White and slate blue grounded by bleached vintage indigo and tech trainers.';
        harmonyScore = 98.9;
      } else {
        // Default: Evening dinner / Smart Outing
        const shirt = findById('m18') || findById('m16') || findByCategory('tops')[0];
        const trousers = findById('m26') || findById('m25') || findByCategory('bottoms')[0];
        const footwear = findById('m32') || findById('m30') || findByCategory('footwear')[0];
        if (shirt) pieces.push(shirt);
        if (trousers) pieces.push(trousers);
        if (footwear) pieces.push(footwear);
        title = 'Classic White Oxford Polo, Ivory Gurkha Trousers & Chelsea Boots';
        venueAlignment = `Tailored outing at ${context.venue}: crisp Oxford cotton tucked into sharp Italian gabardine trousers with calfskin Chelsea boots.`;
        weatherComfort = `At ${temp}°C, breathable cotton offers elevated tactile comfort without overheating.`;
        paletteHarmony = 'Optical White against Warm Ivory Cream and lustrous black leather.';
        harmonyScore = 99.3;
      }
    }

    // 4. WOMEN PERSONA (Sophia - User Uploaded Pieces Only)
    else {
      if (isFestive) {
        const saree = findById('w11') || findByCategory('tops')[0];
        if (saree) pieces.push(saree);
        title = 'Rose Pink Ombre Shimmer Organza Saree Set';
        venueAlignment = `Curated for festive weddings at ${context.venue}: pure organza silk with metallic shimmer border.`;
        weatherComfort = `At ${temp}°C, lightweight organza drape allows fluid movement without thermal burden.`;
        paletteHarmony = 'Rose Pink Ombre and Silver Metallic create majestic royal resonance.';
        harmonyScore = 99.8;
      } else if (isFormal) {
        const saree = findById('w16') || findById('w11') || findByCategory('tops')[0];
        if (saree) pieces.push(saree);
        title = 'Mauve & Ivory Ombre Scalloped Mirror Saree Set';
        venueAlignment = `Executive gala & reception at ${context.venue}: pure silk georgette with hand-embroidered scalloped mirror border.`;
        weatherComfort = `Silk georgette provides fluid structure in climate-controlled ${temp}°C venues.`;
        paletteHarmony = 'Ivory White and Dusty Mauve Ombre.';
        harmonyScore = 99.7;
      } else if (isBrunch) {
        const dress = findById('w17') || findById('w19') || findByCategory('tops')[0];
        if (dress) pieces.push(dress);
        title = 'Periwinkle Sky Floral Tie-Strap Sundress';
        venueAlignment = `Synthesized for terrace garden brunches at ${context.venue}: lightweight crepe linen with ribbon ties.`;
        weatherComfort = `At ${temp}°C, sheer crepe linen delivers supreme cooling comfort in direct sun.`;
        paletteHarmony = 'Periwinkle Sky Blue with White Botanical.';
        harmonyScore = 99.2;
      } else {
        // Default: Fine Dining Date / Evening Soiree
        const dress = findById('w15') || findById('w11') || findByCategory('tops')[0];
        if (dress) pieces.push(dress);
        title = 'White Cherry Embroidered Corset Mini Dress';
        venueAlignment = `Intimate dining at ${context.venue}: structured corset bodice with scarlet cherry embroidery.`;
        weatherComfort = `At ${temp}°C, breathable cotton poplin regulates body temperature.`;
        paletteHarmony = 'Optic White against Scarlet Red cherry motifs.';
        harmonyScore = 99.5;
      }
    }

    if (pieces.length === 0) {
      pieces = closet.slice(0, 3);
    }

    const firstPiece = pieces[0] || closet[0];
    const secondPiece = pieces[1] || pieces[0] || firstPiece;

    const newOutfit: OutfitRecommendation = {
      id: `otd_${Date.now()}`,
      title,
      occasion: context.occasion,
      venue: context.venue,
      vibe: context.vibe,
      weather: context.weather,
      pieces,
      rationale: {
        venueAlignment,
        weatherComfort,
        paletteHarmony: paletteHarmony || `${firstPiece.color} against ${secondPiece.color} establishes elevated tonal contrast consistent with your style DNA.`,
        wardrobeUtilization: `100% selected from verified ${activePersona.toUpperCase()} wardrobe pieces. Zero hallucinated items.`
      },
      harmonyScore,
      createdAt: new Date().toISOString()
    };

    setCurrentOutfit(newOutfit);
    return newOutfit;
  } finally {
      clearInterval(ticker);
      setIsGenerating(false);
      setGenerationStepMessage('');
    }
  };

  const modifyOutfit = async (instruction: string): Promise<void> => {
    if (!currentOutfit) return;
    setIsGenerating(true);
    setGenerationStepMessage(`Interpreting: "${instruction}"...`);
    setHistory(prev => [...prev, instruction]);

    // If authenticated and currentOutfit has a backend ID, attempt backend modifier
    const token = localStorage.getItem('otd_access_token');
    if (token && currentOutfit.id && !currentOutfit.id.startsWith('otd_') && !currentOutfit.id.startsWith('saved_')) {
      try {
        const modified = await outfitsApiService.modifyOutfit(currentOutfit.id, instruction, token);
        if (modified && Array.isArray(modified.items)) {
          setCurrentOutfit(prev => {
            if (!prev) return null;
            return {
              ...prev,
              pieces: modified.items.map(mapApiItem),
              rationale: {
                venueAlignment: modified.rationale?.venueAlignment || prev.rationale.venueAlignment,
                weatherComfort: modified.rationale?.weatherComfort || prev.rationale.weatherComfort,
                paletteHarmony: modified.rationale?.paletteHarmony || prev.rationale.paletteHarmony,
                wardrobeUtilization: modified.rationale?.wardrobeUtilization || prev.rationale.wardrobeUtilization,
              },
              harmonyScore: modified.harmonyScore || prev.harmonyScore,
            };
          });
          setIsGenerating(false);
          setGenerationStepMessage('');
          return;
        }
      } catch (err) {
        console.warn('Backend modifier failed, utilizing local fallback:', err);
      }
    }

    let updatedPieces = [...currentOutfit.pieces];
    let newRationale = { ...currentOutfit.rationale };
    const lower = instruction.toLowerCase();

    if (lower.includes('casual') || lower.includes('relax') || lower.includes('sneaker')) {
      // Swap shoes to clean sneakers
      const sneakers = closet.find(i => i.subType === 'Clean Sneaker') || closet.find(i => i.category === 'footwear');
      if (sneakers) {
        updatedPieces = updatedPieces.map(p => p.category === 'footwear' ? sneakers : p);
      }
      // Swap formal pants for relaxed chinos or denim if not blacklisted
      const casualBottom = closet.find(i => i.id === 'b2' || i.id === 'b3') || closet.find(i => i.category === 'bottoms');
      if (casualBottom) {
        updatedPieces = updatedPieces.map(p => p.category === 'bottoms' ? casualBottom : p);
      }
      // Remove or soften outerwear
      if (lower.includes('no blazer') || lower.includes('no jacket')) {
        updatedPieces = updatedPieces.filter(p => p.category !== 'outerwear');
      }
      newRationale.venueAlignment = `Shifted silhouette toward effortless relaxed luxury with ${sneakers?.name || 'minimalist footwear'}.`;
    } else if (lower.includes('boot') || lower.includes('chelsea')) {
      const boots = closet.find(i => i.id === 'f4') || closet.find(i => i.category === 'footwear');
      if (boots) {
        updatedPieces = updatedPieces.map(p => p.category === 'footwear' ? boots : p);
        newRationale.venueAlignment = `Substituted footwear for ${boots.name} to anchor the lower silhouette with architectural poise.`;
      }
    } else if (lower.includes('shoe') || lower.includes('loafer')) {
      const currentShoe = updatedPieces.find(p => p.category === 'footwear');
      const alternateShoe = closet.find(i => i.category === 'footwear' && i.id !== currentShoe?.id) || currentShoe;
      if (alternateShoe) {
        updatedPieces = updatedPieces.map(p => p.category === 'footwear' ? alternateShoe : p);
        newRationale.venueAlignment = `Refreshed footwear to ${alternateShoe.name} for an alternate textural dimension.`;
      }
    } else if (lower.includes('no jeans') || lower.includes('dont use jeans') || lower.includes("don't use jeans")) {
      const trousers = closet.find(i => i.category === 'bottoms' && !i.name.toLowerCase().includes('denim') && !i.name.toLowerCase().includes('jean')) || closet.find(i => i.category === 'bottoms');
      if (trousers) {
        updatedPieces = updatedPieces.map(p => p.category === 'bottoms' ? trousers : p);
        newRationale.venueAlignment = `Substituted denim with tailored ${trousers.name} for sharper formality.`;
      }
    } else if (lower.includes('layer') || lower.includes('jacket') || lower.includes('blazer')) {
      const layer = closet.find(i => i.category === 'outerwear') || closet.find(i => i.category === 'tops');
      if (layer && !updatedPieces.some(p => p.id === layer.id)) {
        updatedPieces.push(layer);
        newRationale.weatherComfort = `Added an outer layer to provide thermal versatility and silhouette definition.`;
      }
    } else if (lower.includes('dark') || lower.includes('black')) {
      const darkTop = closet.find(i => (i.category === 'tops' || i.category === 'outerwear') && (i.color.toLowerCase().includes('black') || i.color.toLowerCase().includes('navy'))) || updatedPieces[0];
      if (darkTop) {
        updatedPieces = updatedPieces.map(p => (p.category === 'tops' || p.category === 'outerwear') ? darkTop : p);
        newRationale.paletteHarmony = `Deepened palette with ${darkTop.color} for nighttime contrast and commanding posture.`;
      }
    } else {
      newRationale.venueAlignment = `Fine-tuned to your preference: "${instruction}". Balanced against your style DNA.`;
    }

    setCurrentOutfit(prev => prev ? {
      ...prev,
      pieces: updatedPieces,
      rationale: newRationale,
      harmonyScore: Math.min(99.6, Number((prev.harmonyScore + 0.2).toFixed(1)))
    } : null);

    setIsGenerating(false);
    setGenerationStepMessage('');
  };

  const switchPersona = (persona: PersonaType) => {
    if (!PERSONA_WARDROBES[persona]) return;
    setActivePersona(persona);
    const targetPersonaData = PERSONA_WARDROBES[persona];
    setProfile(targetPersonaData.profile);

    // Retrieve custom items for this persona if any
    let customItems: ClosetItem[] = [];
    try {
      const saved = localStorage.getItem(`otd_closet_items_${persona}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          customItems = parsed.filter((i: ClosetItem) => i.id?.startsWith('custom_'));
        }
      }
    } catch {}

    const updatedCloset = [...targetPersonaData.closetItems, ...customItems];
    setCloset(updatedCloset);
    setCurrentOutfit(null);

    try {
      localStorage.setItem('otd_active_persona', persona);
      localStorage.setItem('otd_user_profile', JSON.stringify(targetPersonaData.profile));
      localStorage.setItem(`otd_closet_items_${persona}`, JSON.stringify(updatedCloset));
      localStorage.setItem('otd_closet_items', JSON.stringify(updatedCloset));
      localStorage.setItem('otd_storage_version', OTD_STORAGE_VERSION);
    } catch (e) {
      console.warn('LocalStorage error caching persona:', e);
    }
  };

  const loadSampleCloset = () => {
    setCloset(PERSONA_WARDROBES[activePersona]?.closetItems || INITIAL_CLOSET);
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
        clearCloset
      }}
    >
      {children}
    </ClosetContext.Provider>
  );
};

export const useCloset = (): ClosetContextType => {
  const context = useContext(ClosetContext);
  if (!context) {
    throw new Error('useCloset must be used within a ClosetProvider');
  }
  return context;
};
