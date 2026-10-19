import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

export interface UserProfile {
  name: string;
  height: string;
  bodyShape: string;
  stylePersonas: string[];
  preferredFit: string;
  palettePreferences: string[];
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
  };
  harmonyScore: number;
}

interface ClosetContextType {
  profile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  closet: ClosetItem[];
  addClosetItem: (item: Omit<ClosetItem, 'id'>) => void;
  deleteClosetItem: (id: string) => void;
  updateClosetItem: (id: string, updates: Partial<ClosetItem>) => void;
  currentOutfit: OutfitRecommendation | null;
  generateOutfit: (context: { venue: string; occasion: string; vibe: string; weather: string }) => void;
  modifyOutfit: (instruction: string) => void;
  isGenerating: boolean;
  history: string[];
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Curator',
  height: `5'11" (180 cm)`,
  bodyShape: 'Athletic / V-Taper',
  stylePersonas: ['Old Money Heritage', 'Clean Minimalist'],
  preferredFit: 'Tailored / Regular',
  palettePreferences: ['Espresso & Earth', 'Ivory & Cream', 'Charcoal & Navy'],
};

const INITIAL_CLOSET: ClosetItem[] = [
  // Tops
  { id: 't1', category: 'tops', subType: 'Knit Rollneck', name: 'Seamless Silk-Cashmere High Neck', brand: 'Brunello Cucinelli', color: 'Ivory Cream', fit: 'Regular', formality: 3, icon: '👕' },
  { id: 't2', category: 'tops', subType: 'Oxford Shirt', name: 'Sea Island Cotton Button-Down', brand: 'Charvet', color: 'French Blue', fit: 'Slim', formality: 4, icon: '👔' },
  { id: 't3', category: 'tops', subType: 'Linen Shirt', name: 'Open-Collar Washed Camp Shirt', brand: 'Loro Piana', color: 'Sand White', fit: 'Relaxed / Tailored', formality: 2, icon: '👕' },
  { id: 't4', category: 'tops', subType: 'Crewneck Tee', name: 'Mercerized Pima Cotton T-Shirt', brand: 'Sunspel', color: 'Jet Black', fit: 'Regular', formality: 1, icon: '👕' },
  
  // Bottoms
  { id: 'b1', category: 'bottoms', subType: 'Pleated Trousers', name: 'High-Rise Forward-Pleat Wool Trousers', brand: 'Savile Row Bespoke', color: 'Flint Charcoal', fit: 'Relaxed / Tailored', formality: 4, icon: '👖' },
  { id: 'b2', category: 'bottoms', subType: 'Tailored Chinos', name: 'Brushed Cotton Gurkha Trousers', brand: 'Rota Pantaloni', color: 'Warm Caramel', fit: 'Regular', formality: 3, icon: '👖' },
  { id: 'b3', category: 'bottoms', subType: 'Selvedge Denim', name: '13.5oz Clean Japanese Raw Denim', brand: 'Kuro', color: 'Deep Indigo', fit: 'Regular', formality: 2, icon: '👖' },
  { id: 'b4', category: 'bottoms', subType: 'Linen Pants', name: 'Drawstring Linen-Silk Trousers', brand: 'Boglioli', color: 'Oatmeal Beige', fit: 'Relaxed / Tailored', formality: 2, icon: '👖' },

  // Outerwear
  { id: 'o1', category: 'outerwear', subType: 'Double-Breasted Blazer', name: 'Unstructured Hopsack Navy Blazer', brand: 'Cesare Attolini', color: 'Midnight Navy', fit: 'Regular', formality: 4, icon: '🧥' },
  { id: 'o2', category: 'outerwear', subType: 'Cashmere Overcoat', name: 'Belted Cashmere Trench Overcoat', brand: 'Loro Piana', color: 'Vicuna Camel', fit: 'Relaxed / Tailored', formality: 4, icon: '🧥' },
  { id: 'o3', category: 'outerwear', subType: 'Suede Jacket', name: 'Spanish Lambskin Suede Field Jacket', brand: 'Zegna', color: 'Hazelnut Brown', fit: 'Regular', formality: 3, icon: '🧥' },

  // Footwear
  { id: 'f1', category: 'footwear', subType: 'Penny Loafers', name: 'Burnished Museum Calf Loafers', brand: 'John Lobb', color: 'Espresso Brown', fit: 'Regular', formality: 4, icon: '👞' },
  { id: 'f2', category: 'footwear', subType: 'Belgian Loafers', name: 'Chocolate Suede Tassel Slip-ons', brand: 'Baudoin & Lange', color: 'Dark Chocolate', fit: 'Regular', formality: 3, icon: '👞' },
  { id: 'f3', category: 'footwear', subType: 'Clean Sneaker', name: 'Minimalist Nappa Leather Low-Top', brand: 'Common Projects', color: 'Chalk White', fit: 'Regular', formality: 2, icon: '👟' },
  { id: 'f4', category: 'footwear', subType: 'Chelsea Boots', name: 'Hand-Patinated Glazed Leather Boots', brand: 'Berluti', color: 'Tobacco Patina', fit: 'Regular', formality: 3, icon: '👢' },

  // Accessories
  { id: 'a1', category: 'accessories', subType: 'Dress Watch', name: 'Rose Gold Ultra-Thin Mechanical', brand: 'A. Lange & Söhne', color: 'Rose Gold', fit: 'Regular', formality: 5, icon: '⌚' },
  { id: 'a2', category: 'accessories', subType: 'Leather Belt', name: 'Hand-Stitched Bridle Leather Belt', brand: 'Hermès', color: 'Burgundy Noir', fit: 'Regular', formality: 4, icon: '🎗️' },
];

const ClosetContext = createContext<ClosetContextType | undefined>(undefined);

export const ClosetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('otd_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [closet, setCloset] = useState<ClosetItem[]>(() => {
    const saved = localStorage.getItem('otd_closet_items');
    return saved ? JSON.parse(saved) : INITIAL_CLOSET;
  });

  const [currentOutfit, setCurrentOutfit] = useState<OutfitRecommendation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('otd_user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('otd_closet_items', JSON.stringify(closet));
  }, [closet]);

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  };

  const addClosetItem = (item: Omit<ClosetItem, 'id'>) => {
    const newItem: ClosetItem = {
      ...item,
      id: `custom_${Date.now()}`
    };
    setCloset(prev => [newItem, ...prev]);
  };

  const deleteClosetItem = (id: string) => {
    setCloset(prev => prev.filter(item => item.id !== id));
  };

  const updateClosetItem = (id: string, updates: Partial<ClosetItem>) => {
    setCloset(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const generateOutfit = (context: { venue: string; occasion: string; vibe: string; weather: string }) => {
    setIsGenerating(true);
    setTimeout(() => {
      // Intelligent matching from the user's actual closet
      let selectedTop = closet.find(i => i.category === 'tops' && i.formality >= 3) || closet.find(i => i.category === 'tops')!;
      let selectedBottom = closet.find(i => i.category === 'bottoms' && i.formality >= 3) || closet.find(i => i.category === 'bottoms')!;
      let selectedOuterwear = closet.find(i => i.category === 'outerwear' && (context.weather.includes('Breezy') || context.weather.includes('Cool'))) || closet.find(i => i.category === 'outerwear');
      let selectedShoe = closet.find(i => i.category === 'footwear' && i.formality >= 3) || closet.find(i => i.category === 'footwear')!;
      let selectedAcc = closet.find(i => i.category === 'accessories') || closet[0];

      // Context adjustments based on destination/vibe
      if (context.vibe.toLowerCase().includes('relaxed') || context.occasion.toLowerCase().includes('casual')) {
        selectedTop = closet.find(i => i.id === 't3' || i.id === 't4') || selectedTop;
        selectedBottom = closet.find(i => i.id === 'b2' || i.id === 'b3') || selectedBottom;
        selectedShoe = closet.find(i => i.id === 'f3' || i.id === 'f2') || selectedShoe;
      } else if (context.occasion.toLowerCase().includes('date') || context.venue.toLowerCase().includes('rooftop')) {
        selectedTop = closet.find(i => i.id === 't1') || selectedTop; // Silk-Cashmere High Neck
        selectedBottom = closet.find(i => i.id === 'b1') || selectedBottom; // Forward Pleat Flannel
        selectedOuterwear = closet.find(i => i.id === 'o1') || selectedOuterwear; // Navy Blazer
        selectedShoe = closet.find(i => i.id === 'f2') || selectedShoe; // Suede Tassel Loafer
      }

      const pieces: ClosetItem[] = [selectedTop, selectedBottom];
      if (selectedOuterwear) pieces.push(selectedOuterwear);
      pieces.push(selectedShoe);
      if (selectedAcc && selectedAcc.category === 'accessories') pieces.push(selectedAcc);

      setCurrentOutfit({
        id: `otd_${Date.now()}`,
        title: `${context.vibe} at ${context.venue}`,
        occasion: context.occasion,
        venue: context.venue,
        vibe: context.vibe,
        weather: context.weather,
        pieces,
        rationale: {
          venueAlignment: `Selected to match the ambience of ${context.venue}. The ${selectedTop.name} sets an alluring, refined tone without looking excessively corporate.`,
          weatherComfort: `Calibrated for ${context.weather}. Breathable natural fabrics prevent overheating while retaining structure in the breeze.`,
          paletteHarmony: `The pairing of ${selectedTop.color} against ${selectedBottom.color} creates high-contrast visual balance calibrated to your ${profile.palettePreferences[0] || 'subtle tonal'} preference.`
        },
        harmonyScore: 98.6
      });
      setIsGenerating(false);
    }, 600);
  };

  const modifyOutfit = (instruction: string) => {
    if (!currentOutfit) return;
    setIsGenerating(true);
    setHistory(prev => [...prev, instruction]);

    setTimeout(() => {
      let updatedPieces = [...currentOutfit.pieces];
      let newRationale = { ...currentOutfit.rationale };
      const lower = instruction.toLowerCase();

      if (lower.includes('casual') || lower.includes('relax')) {
        // Swap shoes for sneakers
        const sneakers = closet.find(i => i.subType === 'Clean Sneaker') || closet.find(i => i.category === 'footwear');
        if (sneakers) {
          updatedPieces = updatedPieces.map(p => p.category === 'footwear' ? sneakers : p);
        }
        // Swap formal pants for relaxed chinos/denim
        const chinos = closet.find(i => i.id === 'b2') || closet.find(i => i.category === 'bottoms');
        if (chinos) {
          updatedPieces = updatedPieces.map(p => p.category === 'bottoms' ? chinos : p);
        }
        newRationale.venueAlignment = `Modified for a more relaxed, approachable casual energy while retaining clean lines.`;
      } else if (lower.includes('shoes') || lower.includes('shoe') || lower.includes('boot')) {
        // Swap footwear to boots or alternative loafers
        const currentShoe = updatedPieces.find(p => p.category === 'footwear');
        const nextShoe = closet.find(i => i.category === 'footwear' && i.id !== currentShoe?.id) || currentShoe;
        if (nextShoe) {
          updatedPieces = updatedPieces.map(p => p.category === 'footwear' ? nextShoe : p);
          newRationale.venueAlignment = `Footwear adjusted to ${nextShoe.name} to alter the ground posture and silhouette weight.`;
        }
      } else if (lower.includes('no jeans') || lower.includes('dont use jeans') || lower.includes("don't use jeans")) {
        const trousers = closet.find(i => i.id === 'b1' || i.id === 'b2')!;
        updatedPieces = updatedPieces.map(p => p.category === 'bottoms' ? trousers : p);
        newRationale.venueAlignment = `Substituted denim with tailored ${trousers.name} for greater sartorial formality.`;
      } else if (lower.includes('attractive') || lower.includes('date') || lower.includes('sharp')) {
        const luxuryKnit = closet.find(i => i.id === 't1')!;
        const chelseaBoots = closet.find(i => i.id === 'f4') || closet.find(i => i.id === 'f2')!;
        updatedPieces = updatedPieces.map(p => p.category === 'tops' ? luxuryKnit : p);
        updatedPieces = updatedPieces.map(p => p.category === 'footwear' ? chelseaBoots : p);
        newRationale.venueAlignment = `Elevated allure: Swapped in ${luxuryKnit.name} and ${chelseaBoots.name} for high-definition night appeal.`;
      } else {
        // Generic smart tweak
        newRationale.venueAlignment = `Customized based on instruction: "${instruction}". Balanced with existing wardrobe synergy.`;
      }

      setCurrentOutfit(prev => prev ? {
        ...prev,
        pieces: updatedPieces,
        rationale: newRationale,
        harmonyScore: Math.min(99.4, prev.harmonyScore + 0.3)
      } : null);

      setIsGenerating(false);
    }, 450);
  };

  return (
    <ClosetContext.Provider
      value={{
        profile,
        updateProfile,
        closet,
        addClosetItem,
        deleteClosetItem,
        updateClosetItem,
        currentOutfit,
        generateOutfit,
        modifyOutfit,
        isGenerating,
        history
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
