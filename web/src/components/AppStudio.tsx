import React, { useState, useEffect } from 'react';
import {
  Home,
  Shirt,
  Sparkles,
  Compass,
  Calendar,
  Bookmark,
  User,
  Settings,
  HelpCircle,
  Search,
  Bell,
  ChevronDown,
  Sun,
  Moon,
  CloudSun,
  CloudRain,
  Wind,
  Snowflake,
  Thermometer,
  Heart,
  ArrowRight,
  Send,
  Plus,
  Check,
  X,
  MapPin,
  Clock,
  Camera,
  Eye,
  Trash2,
  Edit,
  Layers,
  Umbrella,
  Building,
  MoreHorizontal,
  Share2,
  RefreshCw,
  ExternalLink,
  ShoppingBag,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCloset, type ClosetItem } from '../context/ClosetContext';
import type { PersonaType } from '../data/personaWardrobes';
import { NotificationPopover } from './ui/NotificationPopover';
import { SettingsModal } from './ui/SettingsModal';
import { MobileBottomNav } from './ui/MobileBottomNav';
import { ItemCard, EmptyState, useToast, StudioErrorBoundary } from './ui';
import { ScheduleModal } from './ui/ScheduleModal';
import { ShareOutfitModal } from './ui/ShareOutfitModal';
import { eventsApiService, type ScheduledCalendarEvent } from '../services/events.service';
import { socialApiService, type CommunityOutfitPost } from '../services/social.service';
import { shoppingApiService, type WardrobeGapItem } from '../services/shopping.service';
import { venueApiService, type ApiVenueIntelligence } from '../services/venue.service';
import { aiApiService } from '../services/ai.service';
import { PhotorealisticTryOnStudio } from './PhotorealisticTryOnStudio';
import { AIPersonalStylist } from './AIPersonalStylist';

interface AppStudioProps {
  onOpenAddPiece: () => void;
  onOpenProfile: () => void;
  onBackToLanding?: () => void;
  onLogout?: () => void;
}

export type StudioTab =
  | 'home'
  | 'closet'
  | 'stylist'
  | 'ideas'
  | 'tryon'
  | 'destinations'
  | 'calendar'
  | 'saved';

interface Venue {
  id: string;
  name: string;
  location: string;
  category: string;
  img: string;
  ambience: string;
  vibe: string;
  crowd: string;
  dressCode: string;
  isIndoor: boolean;
  tempRange: string;
  description: string;
}

const CURATED_VENUES: Venue[] = [
  {
    id: 'lamore',
    name: "L'amore",
    location: 'Banjara Hills, Hyderabad',
    category: 'Restaurant',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    ambience: 'Fine Dining',
    vibe: 'Romantic',
    crowd: 'Upscale',
    dressCode: 'Smart Casual',
    isIndoor: true,
    tempRange: '26-30°C',
    description: "L'amore is a fine dining restaurant known for its elegant ambience, warm lighting and modern aesthetic. It's a popular spot for date nights, special occasions and upscale dinners.",
  },
  {
    id: 'olive',
    name: 'Olive Bistro',
    location: 'Jubilee Hills, Hyderabad',
    category: 'Restaurant',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    ambience: 'Mediterranean Terrace',
    vibe: 'Chic & Breezy',
    crowd: 'Sartorial Socialites',
    dressCode: 'Resort Smart Casual',
    isIndoor: false,
    tempRange: '24-28°C',
    description: 'Picturesque hilltop bistro overlooking Durgam Cheruvu lake. White-washed walls, floral bougainvillea, and candle-lit alfresco seating perfect for relaxed conversations.',
  },
  {
    id: 'aer',
    name: 'Aer Lounge',
    location: 'Worli, Mumbai',
    category: 'Bar / Club',
    img: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80',
    ambience: 'Rooftop Sky Lounge',
    vibe: 'Electrifying & Alluring',
    crowd: 'Nightlife Connoisseurs',
    dressCode: 'Cocktail Tailored',
    isIndoor: false,
    tempRange: '27-29°C',
    description: 'High-altitude open-air lounge offering panoramic Arabian Sea vistas, house beats, and dramatic city skyline night views requiring sleek tailoring.',
  },
  {
    id: 'soho',
    name: 'Soho House Lounge',
    location: 'Juhu Beach, Mumbai',
    category: 'Café',
    img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    ambience: 'Private Club & Library',
    vibe: 'Minimalist & Creative',
    crowd: 'Artists & Executives',
    dressCode: 'Casual Luxury',
    isIndoor: true,
    tempRange: '23-25°C',
    description: 'Understated beachside member enclave boasting vintage velvet armchairs, teak finishes, and art collections suitable for elevated relaxed pieces.',
  },
];

export const AppStudio: React.FC<AppStudioProps> = ({
  onOpenAddPiece,
  onOpenProfile,
  onBackToLanding,
  onLogout,
}) => {
  const { theme, toggleTheme } = useTheme();
  const {
    closet,
    activePersona,
    switchPersona,
    profile,
    deleteClosetItem,
    currentOutfit,
    savedLooks,
    saveLook,
    removeSavedLook,
    isLookSaved,
    markOutfitWorn,
    generateOutfit,
    modifyOutfit,
    isGenerating,
    generationStepMessage,
    weather,
    setWeather,
    refreshWeather,
  } = useCloset();
  const { toast } = useToast();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<StudioTab>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Modals state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedClosetItem, setSelectedClosetItem] = useState<ClosetItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ClosetItem | null>(null);

  // Home search bar
  const [homeSearchQuery, setHomeSearchQuery] = useState('');

  // Perfect Choice State (Weather & Persona Calibrated)
  const [perfectChoiceOccasion, setPerfectChoiceOccasion] = useState<string>('Family Festive & Traditional');
  const [isGeneratingPerfectChoice, setIsGeneratingPerfectChoice] = useState<boolean>(false);

  const handleGeneratePerfectChoice = async (occ?: string) => {
    setIsGeneratingPerfectChoice(true);
    const targetOcc = occ || perfectChoiceOccasion;
    try {
      await generateOutfit({
        venue: targetOcc.includes('Festive') ? 'Grand Reception Ballroom' : targetOcc.includes('Dinner') ? "L'amore Fine Dining" : 'Urban City Center',
        occasion: targetOcc,
        vibe: targetOcc.includes('Festive') ? 'Regal & Celebratory' : targetOcc.includes('Dinner') ? 'Intimate & Refined' : 'Effortless & Relaxed',
        weather: `${weather.condition}, ${weather.temp}°C`,
      });
      toast('Perfect Choice Formulated', `Curated from ${activePersona.toUpperCase()}'s verified wardrobe for ${weather.temp}°C`, 'success');
    } catch {
      toast('Style Synthesis Complete', `Generated from active closet inventory`, 'info');
    } finally {
      setIsGeneratingPerfectChoice(false);
    }
  };

  // Closet Outing & Destination Engine Protocols
  const CLOSET_OCCASION_PROTOCOLS = [
    { id: 'birthday', icon: '🎂', label: 'Birthday / Celebration', vibe: 'Celebration Glamour & Statement Poise', venue: 'Party Terrace & Lounge' },
    { id: 'sangeet', icon: '🪔', label: 'Festive & Sangeet', vibe: 'Traditional Couture & Shimmer', venue: 'Grand Reception Ballroom' },
    { id: 'brunch', icon: '☕', label: 'Sunday Cafe Brunch', vibe: 'Effortless Daytime Linen', venue: 'Olive Bistro Garden Terrace' },
    { id: 'beach', icon: '🏖️', label: 'Beach & Coastal Resort', vibe: 'Coastal Azure & Relaxed Slub', venue: 'Coastal Seaside Resort' },
    { id: 'streetwear', icon: '🛹', label: 'Weekend Streetwear', vibe: 'Y2K Denim & Volume', venue: 'Urban City Center & Cafe' },
    { id: 'dinner', icon: '🍷', label: 'Intimate Dinner / Gala', vibe: 'High Sartorial Refinement', venue: "L'amore Fine Dining & Lounge" },
    { id: 'school', icon: '💼', label: 'Office / Presentation', vibe: 'Tailored Authority & Academic Poise', venue: 'Executive Auditorium' },
    { id: 'photoshoot', icon: '📸', label: 'Editorial / Photoshoot', vibe: 'Avant-Garde Runway Lines', venue: 'High-Fashion Studio Cyclorama' },
  ];

  const [activeClosetOccasion, setActiveClosetOccasion] = useState<string>('birthday');
  const [isOutingEngineRunning, setIsOutingEngineRunning] = useState<boolean>(false);

  const handleCurateClosetOuting = async (occId: string) => {
    setActiveClosetOccasion(occId);
    setIsOutingEngineRunning(true);
    const occ = CLOSET_OCCASION_PROTOCOLS.find(o => o.id === occId) || CLOSET_OCCASION_PROTOCOLS[0];
    try {
      await generateOutfit({
        venue: occ.venue,
        occasion: occ.label,
        vibe: occ.vibe,
        weather: `${weather.condition}, ${weather.temp}°C`,
      });
      toast('✨ AI Engine Formulated Your Outing!', `${occ.label} ensemble calibrated for ${weather.temp}°C`, 'success');
    } catch {
      toast('Outing Formulated', `Curated from verified ${activePersona.toUpperCase()} wardrobe`, 'info');
    } finally {
      setIsOutingEngineRunning(false);
    }
  };

  // Favorites / Saved Looks state
  const [likedLooks, setLikedLooks] = useState<string[]>(['smart-casual-1', 'date-night-1']);

  // Plan Your Look Wizard State (Screenshots 1 & 2)
  const [stylistSubView, setStylistSubView] = useState<'intelligent_stylist' | 'venue_planner'>('intelligent_stylist');
  const [plannerStep, setPlannerStep] = useState<1 | 2 | 3>(1);
  const [selectedOccasion, setSelectedOccasion] = useState('Date');
  const [selectedVenue, setSelectedVenue] = useState<Venue>(CURATED_VENUES[0]);
  const [destinationSearch, setDestinationSearch] = useState("L'amore, Banjara Hills, Hyderabad");
  const [liveVenueSuggestions, setLiveVenueSuggestions] = useState<ApiVenueIntelligence[]>([]);
  const [isSearchingVenues, setIsSearchingVenues] = useState(false);
  const [selectedVenueCategory, setSelectedVenueCategory] = useState('Restaurant');
  const [selectedDate] = useState('Mon, 14 Oct 2024');
  const [selectedTime] = useState('8:00 PM');
  const [venueInfoTab, setVenueInfoTab] = useState<'about' | 'ambience' | 'dress_code' | 'photos'>('about');

  // Step 2 State (Screenshot 1)
  const [selectedMood, setSelectedMood] = useState('Confident');
  const [selectedWeatherCond, setSelectedWeatherCond] = useState('Partly Cloudy');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(['Light & Breezy']);

  // Recommendation & Chat State (Step 3)
  const [currentOutfitTitle, setCurrentOutfitTitle] = useState('The Parisian Minimalist');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'user',
      text: "I'm going to L'amore tonight for a date. Suggest an outfit from my wardrobe.",
      time: '8:02 PM',
    },
    {
      sender: 'ai',
      text: "Here are some outfit options for L'amore based on the fine dining ambience, 28°C mild evening conditions and your minimalist style. How does this look feel to you?",
      time: '8:03 PM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Digital closet filter state
  const [closetSearch, setClosetSearch] = useState('');
  const [closetCategoryFilter, setClosetCategoryFilter] = useState<'all' | ClosetItem['category']>('all');
  const [closetFormalityFilter, setClosetFormalityFilter] = useState<number | 'all'>('all');

  // Modal states for Calendar & Social
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Default Luxury Seeds for P1/P2 Features
  const DEFAULT_CALENDAR_EVENTS: ScheduledCalendarEvent[] = [
    {
      _id: 'evt_demo_1',
      title: "Dinner Date at L'amore",
      venue: "L'amore Ristorante, Banjara Hills",
      occasion: 'Fine Dining Date',
      vibe: 'Sophisticated Evening',
      scheduledDate: '2026-11-03T20:00:00.000Z',
      time: '8:00 PM',
      outfitId: {
        id: 'demo_outfit_1',
        title: 'The Parisian Minimalist',
        pieces: [
          { id: 'dp1', name: 'Charcoal Cashmere Knit', category: 'tops', imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=300&q=80' },
          { id: 'dp2', name: 'Tailored Wool Trousers', category: 'bottoms', imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=300&q=80' }
        ]
      },
      weatherForecast: '26°C Clear Sky',
      status: 'scheduled',
      notes: 'Reserved courtyard table 4.'
    },
    {
      _id: 'evt_demo_2',
      title: 'Executive Client Presentation',
      venue: 'St. Regis Conference Suite',
      occasion: 'Executive Presentation',
      vibe: 'Power Sartorial',
      scheduledDate: '2026-11-04T10:30:00.000Z',
      time: '10:30 AM',
      outfitId: {
        id: 'demo_outfit_2',
        title: 'Savile Row Power Suiting',
        pieces: [
          { id: 'dp3', name: 'Navy Wool Twill Blazer', category: 'outerwear', imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80' }
        ]
      },
      weatherForecast: '28°C Mild',
      status: 'scheduled'
    }
  ];

  const DEFAULT_COMMUNITY_POSTS: CommunityOutfitPost[] = [
    {
      _id: 'post_1',
      userId: { _id: 'u_1', name: 'Julian Vance' },
      outfitId: {
        id: 'look_julian_1',
        title: 'Milanese Linen & Double-Breasted Tailoring',
        venue: 'Langosteria, Milan',
        occasion: 'Summer Aperitivo',
        vibe: 'Refined Mediterranean',
        pieces: [
          { id: 'p1', name: 'Linen Double-Breasted Jacket', category: 'outerwear', color: 'Sand Oatmeal', brand: 'Boglioli', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80' },
          { id: 'p2', name: 'Pleated Cotton Trousers', category: 'bottoms', color: 'Ivory', brand: 'Rubinacci', imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&q=80' },
          { id: 'p3', name: 'Belgian Loafers', category: 'footwear', color: 'Espresso Suede', brand: 'Baudoin & Lange', imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=500&q=80' }
        ]
      },
      caption: 'Soft twilight tones for dinner along Via Savona. Crisp linen texture pairs effortlessly with unstructured shoulder drape.',
      venue: 'Langosteria, Milan',
      occasion: 'Fine Dining & Aperitivo',
      likesCount: 142,
      commentsCount: 18,
      tags: ['Quiet Luxury', 'Milanese', 'Linen Tailoring'],
      isLiked: false,
      createdAt: '2 hours ago'
    },
    {
      _id: 'post_2',
      userId: { _id: 'u_2', name: 'Sophia Sterling' },
      outfitId: {
        id: 'look_sophia_1',
        title: 'The Parisian Monochrome Trench',
        venue: 'Le Gabriel, Paris',
        occasion: 'Autumn Gallery Opening',
        vibe: 'Architectural Minimalist',
        pieces: [
          { id: 'p4', name: 'Technical Gabardine Trench', category: 'outerwear', color: 'Obsidian Noir', brand: 'The Row', imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80' },
          { id: 'p5', name: 'Cashmere Ribbed Knit', category: 'tops', color: 'Charcoal', brand: 'Toteme', imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=500&q=80' }
        ]
      },
      caption: 'Subtle proportions with an oversized collar stance. Keeps you protected from the Seine wind while preserving sartorial discipline.',
      venue: 'Le Gabriel, Paris',
      occasion: 'Art Exhibition',
      likesCount: 289,
      commentsCount: 34,
      tags: ['Minimalism', 'Parisian', 'Monochrome'],
      isLiked: true,
      createdAt: '5 hours ago'
    }
  ];

  const DEFAULT_WARDROBE_GAPS: WardrobeGapItem[] = [
    {
      id: 'gap_outerwear_1',
      category: 'outerwear',
      name: 'Unstructured Wool Hopsack Blazer',
      brand: 'Cesare Attolini',
      reason: 'Your closet lacks a versatile mid-tier tailoring layer for cool evenings and smart occasions.',
      urgency: 'High',
      estimatedPrice: 890,
      imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80',
      affiliateUrl: 'https://www.mrporter.com',
    },
    {
      id: 'gap_footwear_1',
      category: 'footwear',
      name: 'Belgian Chocolate Suede Loafers',
      brand: 'Baudoin & Lange',
      reason: 'Essential quiet luxury anchor for transitioning effortlessly between relaxed dining and smart social venues.',
      urgency: 'High',
      estimatedPrice: 460,
      imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=500&q=80',
      affiliateUrl: 'https://baudoinlange.com',
    },
    {
      id: 'gap_tops_1',
      category: 'tops',
      name: 'Seamless Silk-Cashmere High Neck',
      brand: 'Brunello Cucinelli',
      reason: 'Provides textural warmth and understated elegance beneath casual outerwear.',
      urgency: 'Medium',
      estimatedPrice: 720,
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=500&q=80',
      affiliateUrl: 'https://brunellocucinelli.com',
    },
  ];

  // Calendar events state
  const [calendarEvents, setCalendarEvents] = useState<ScheduledCalendarEvent[]>(DEFAULT_CALENDAR_EVENTS);

  // Community Lookbook Feed state
  const [communityPosts, setCommunityPosts] = useState<CommunityOutfitPost[]>(DEFAULT_COMMUNITY_POSTS);

  // Wardrobe Gaps state
  const [wardrobeGaps, setWardrobeGaps] = useState<WardrobeGapItem[]>(DEFAULT_WARDROBE_GAPS);

  useEffect(() => {
    const token = localStorage.getItem('otd_access_token');
    eventsApiService.fetchEvents(token || undefined).then(events => {
      if (events && events.length > 0) setCalendarEvents(events);
    }).catch(() => {});

    socialApiService.fetchFeed(token || undefined).then(posts => {
      if (posts && posts.length > 0) setCommunityPosts(posts);
    }).catch(() => {});

    shoppingApiService.fetchWardrobeGaps(token || undefined).then(gaps => {
      if (gaps && gaps.length > 0) setWardrobeGaps(gaps);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!destinationSearch || destinationSearch.length < 2) {
        setLiveVenueSuggestions((prev) => (prev.length > 0 ? [] : prev));
        return;
      }
      setIsSearchingVenues(true);
      try {
        const results = await venueApiService.searchVenues(destinationSearch);
        setLiveVenueSuggestions(results);
      } catch {
        setLiveVenueSuggestions([]);
      } finally {
        setIsSearchingVenues(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [destinationSearch]);

  const handleSelectLiveVenue = (apiVenue: ApiVenueIntelligence) => {
    const matchedCurated = CURATED_VENUES.find((v) => v.id === apiVenue.id);
    const newVenue: Venue = matchedCurated || {
      id: apiVenue.id,
      name: apiVenue.name,
      location: apiVenue.address,
      category: apiVenue.category,
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      ambience: apiVenue.tags?.[0] || 'Refined Setting',
      vibe: apiVenue.recommendedVibe,
      crowd: 'Fashion Connoisseurs',
      dressCode: apiVenue.dressCodeAdvice,
      isIndoor: true,
      tempRange: '24-28°C',
      description: `${apiVenue.name} in ${apiVenue.address}. Formality tier ${apiVenue.formality}/5. ${apiVenue.dressCodeAdvice}`,
    };
    setSelectedVenue(newVenue);
    setDestinationSearch(`${newVenue.name}, ${newVenue.location}`);
    setSelectedVenueCategory(newVenue.category);
    setLiveVenueSuggestions([]);
    toast.info(`Aligned context to ${newVenue.name}`);
  };

  const handleToggleCommunityLike = async (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p._id === postId) {
          const nextIsLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextIsLiked,
            likesCount: nextIsLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );

    try {
      const token = localStorage.getItem('otd_access_token');
      await socialApiService.toggleLike(postId, token || undefined);
    } catch {
      // Optimistic update handled
    }
  };

  const handleDeleteCalendarEvent = async (eventId: string) => {
    setCalendarEvents((prev) => prev.filter((e) => e._id !== eventId));
    try {
      const token = localStorage.getItem('otd_access_token');
      await eventsApiService.deleteEvent(eventId, token || undefined);
      toast.success('Calendar event removed.');
    } catch {
      toast.error('Failed to remove event from server.');
    }
  };

  const handleMarkEventWorn = (eventId: string) => {
    setCalendarEvents((prev) =>
      prev.map((e) => (e._id === eventId ? { ...e, status: 'worn' as const } : e))
    );
    toast.success('Look marked as worn! Updated wardrobe wear history.');
  };

  // Toggle favorite
  const toggleLike = (id: string) => {
    setLikedLooks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleGenerateRecommendation = async () => {
    try {
      const rec = await generateOutfit({
        venue: `${selectedVenue.name}, ${selectedVenue.location}`,
        occasion: selectedOccasion,
        vibe: selectedMood,
        weather: `${selectedWeatherCond}, ${weather.temp}°C`
      });
      setCurrentOutfitTitle(rec.title);
      setPlannerStep(3);
      toast.success("Curated look synthesized for your destination!");
    } catch {
      toast.error("Failed to generate ensemble. Please try again.");
    }
  };

  const handleSendChat = async (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg = { sender: 'user' as const, text, time: 'Just now' };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput('');

    try {
      await modifyOutfit(text);

      let reply: string | null = null;
      try {
        const token = localStorage.getItem('otd_access_token') || undefined;
        const aiRes = await aiApiService.chatWithStylist(
          {
            message: text,
            occasion: selectedOccasion,
            venue: selectedVenue?.name,
            weather: `${weather.temp}°C ${weather.condition}`,
          },
          token
        );
        if (aiRes?.reply) {
          reply = aiRes.reply;
        }
      } catch {
        // Fall back to client heuristic if offline or unauthenticated
      }

      if (!reply) {
        reply = "I've recalibrated your silhouette and updated the pieces on your canvas.";
        const lower = text.toLowerCase();
        if (lower.includes('casual') || lower.includes('sneaker')) {
          reply = "Adapted for elevated casual ease: Swapped in clean minimalist sneakers and relaxed trousers.";
        } else if (lower.includes('boot') || lower.includes('chelsea')) {
          reply = "Substituted footwear for glazed Chelsea boots to anchor your silhouette with architectural poise.";
        } else if (lower.includes('shoes') || lower.includes('loafer')) {
          reply = "Refreshed footwear to alternate luxury loafers to alter your silhouette stance.";
        } else if (lower.includes('jeans')) {
          reply = "Removed denim and substituted tailored high-rise trousers for elevated evening elegance.";
        } else if (lower.includes('layer') || lower.includes('blazer') || lower.includes('jacket')) {
          reply = "Added an unstructured luxury layer for thermal regulation and tailored shoulder structure.";
        } else if (lower.includes('dark') || lower.includes('black')) {
          reply = "Swapped to a deeper monochromatic hue for nighttime sophistication.";
        } else if (lower.includes('warm') || lower.includes('cold') || lower.includes('coat')) {
          reply = "Adapted for cool weather: Introduced an unstructured cashmere-wool overcoat layer.";
        } else if (lower.includes('formal') || lower.includes('suit') || lower.includes('tie')) {
          reply = "Elevated formality tier: Structured sartorial shoulder line paired with forward-pleat trousers.";
        } else if (lower.includes('attractive') || lower.includes('date') || lower.includes('romantic')) {
          reply = "Calibrated for evening allure: High-contrast rich charcoal palette with an open unbuttoned collar stance.";
        }
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: reply!, time: 'Just now' },
      ]);
    } catch {
      toast.error("Unable to update outfit.");
    }
  };

  // Switch to venue and launch wizard
  const handleSelectVenueForStyling = (venue: Venue) => {
    setSelectedVenue(venue);
    setDestinationSearch(`${venue.name}, ${venue.location}`);
    setSelectedVenueCategory(venue.category);
    setActiveTab('stylist');
    setPlannerStep(1);
  };

  const filteredClosetItems = closet.filter((item) => {
    const matchesSearch =
      closetSearch === '' ||
      item.name.toLowerCase().includes(closetSearch.toLowerCase()) ||
      item.brand.toLowerCase().includes(closetSearch.toLowerCase()) ||
      item.color.toLowerCase().includes(closetSearch.toLowerCase()) ||
      item.subType.toLowerCase().includes(closetSearch.toLowerCase());
    const matchesCategory =
      closetCategoryFilter === 'all' || item.category === closetCategoryFilter;
    const matchesFormality =
      closetFormalityFilter === 'all' || item.formality === closetFormalityFilter;
    return matchesSearch && matchesCategory && matchesFormality;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-body)] flex flex-col font-sans transition-colors duration-300 relative">
      {/* AI Thinking State (Section 4.I) */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="rounded-3xl border border-[var(--border-gold)] bg-[var(--bg-card)] p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-[var(--gold-primary)]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[var(--gold-primary)]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[var(--gold-primary)]/20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-2 border-t-[var(--gold-primary)] border-r-[var(--gold-primary)]/40 border-b-transparent border-l-transparent animate-spin" />
              <div className="w-12 h-12 rounded-full bg-[var(--pill-bg)] border border-[var(--border-gold)] flex items-center justify-center shadow-inner">
                <Sparkles className="w-6 h-6 text-[var(--gold-primary)] animate-pulse" />
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[var(--gold-primary)] block mb-1">
                OTD SARTORIAL INTELLIGENCE
              </span>
              <h3 className="font-playfair text-2xl font-bold text-[var(--text-heading)]">
                Synthesizing Ensemble
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-2 font-mono transition-all duration-300 min-h-[1.5rem]">
                {generationStepMessage || 'Analyzing wardrobe synergy & palette harmony...'}
              </p>
            </div>

            <div className="w-full bg-[var(--pill-bg)] h-1.5 rounded-full overflow-hidden border border-[var(--border-card)]">
              <div className="h-full bg-gradient-to-r from-[var(--gold-primary)] to-amber-200 animate-pulse rounded-full w-3/4" />
            </div>

            <p className="text-[11px] text-[var(--text-muted)]">
              Cross-referencing {closet.length} pieces with destination dress code & climate.
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        
        {/* ========================================================================= */}
        {/* LEFT NAVIGATION SIDEBAR (Matching Screenshot 3) */}
        {/* ========================================================================= */}
        <aside className="w-64 border-r border-[var(--border-card)] bg-[var(--bg-card)] shrink-0 hidden md:flex flex-col justify-between py-6 px-4">
          <div className="space-y-6">
            
            {/* OTD Official Logo & Subtitle */}
            <div
              onClick={onBackToLanding}
              className="flex items-center gap-3 px-2 cursor-pointer group"
              title="Return to Home Landing"
            >
              <div className="w-10 h-12 rounded-lg bg-[#FAF5ED] p-1 border border-[#D5C29D] shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                <img
                  src="/otd_logo.png"
                  alt="OTD - Outfit of the Day"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="font-cinzel text-lg font-bold tracking-[0.2em] text-[var(--text-heading)] leading-none">
                  OTD
                </h1>
                <p className="text-[9px] tracking-[0.22em] text-[var(--gold-primary)] font-mono font-bold mt-1">
                  OUTFIT OF THE DAY
                </p>
              </div>
            </div>

            {/* Navigation Menu (Matching Screenshot 3) */}
            <nav className="space-y-1">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'closet', label: 'My Closet', icon: Shirt, badge: closet.length },
                { id: 'stylist', label: 'AI Stylist', icon: Sparkles },
                { id: 'ideas', label: 'Create Look', icon: Shirt },
                { id: 'destinations', label: 'Destination Mode', icon: Compass },
                { id: 'tryon', label: 'AI Virtual Try-On (VTON)', icon: Camera, badge: 'Neural Drape' },
                { id: 'calendar', label: 'Calendar', icon: Calendar },
                { id: 'saved', label: 'Favorites', icon: Bookmark, badge: likedLooks.length },
                { id: 'profile', label: 'Profile', icon: User },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'profile') {
                        onOpenProfile();
                      } else {
                        setActiveTab(item.id as StudioTab);
                        if (item.id === 'stylist') setPlannerStep(1);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--pill-bg)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive
                            ? 'text-[var(--gold-primary)]'
                            : 'text-[var(--text-muted)]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                          isActive
                            ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                            : 'bg-[var(--gold-primary)]/15 text-[var(--gold-primary)]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar Utility Links & Promotional Card (Screenshot 3) */}
          <div className="space-y-4 pt-4 border-t border-[var(--border-card)]">
            <div className="space-y-0.5">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--pill-bg)] transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => setIsHelpOpen(true)}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--pill-bg)] transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Help & Support</span>
              </button>
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                  else if (onBackToLanding) onBackToLanding();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Bottom Promotional Card: "Build a Smarter Wardrobe." (Exact match to Screenshot 3) */}
            <div
              onClick={() => {
                setActiveTab('closet');
                onOpenAddPiece();
              }}
              className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-[var(--border-gold)]/60 cursor-pointer group shadow-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80"
                alt="Build a Smarter Wardrobe"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3.5 flex flex-col justify-end text-white">
                <p className="font-playfair text-xs sm:text-sm font-bold leading-tight">
                  Build a Smarter Wardrobe.
                </p>
                <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold mt-1">
                  <span>Digitize closet</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* MAIN VIEWPORT (Top Navigation + Active Tab) */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* Top Bar (Matching Screenshot 3) */}
          <header className="h-16 px-6 border-b border-[var(--border-card)] bg-[var(--bg-header)] backdrop-blur-md flex items-center justify-between gap-4 sticky top-0 z-30">
            {/* Search Omnibar */}
            <div className="flex-1 max-w-xl relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search for outfits, occasions, or ask anything..."
                value={homeSearchQuery}
                onChange={(e) => setHomeSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && homeSearchQuery.trim()) {
                    handleSendChat(homeSearchQuery);
                    setActiveTab('stylist');
                    setPlannerStep(3);
                  }
                }}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] text-xs placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold-primary)] transition-colors"
              />
            </div>

            {/* Client Presentation Account Switcher (Instant Demo Switcher) */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shrink-0">
              <span className="text-[10px] font-mono text-[var(--gold-primary)] font-bold px-2 uppercase">
                Account:
              </span>
              {[
                { id: 'women' as PersonaType, label: 'Women', icon: '👩' },
                { id: 'man' as PersonaType, label: 'Man', icon: '👨' },
                { id: 'boy' as PersonaType, label: 'Boy', icon: '👦' },
                { id: 'girl' as PersonaType, label: 'Girl', icon: '👧' },
              ].map((acc) => {
                const isActive = activePersona === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => {
                      switchPersona(acc.id);
                      toast('Account Switched', `Logged into ${acc.label}'s verified wardrobe`, 'success');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--pill-bg)]'
                    }`}
                  >
                    <span>{acc.icon}</span>
                    <span>{acc.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Header Actions: Theme Toggle, Notifications, User Profile (Screenshot 3) */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-[var(--pill-bg)] text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors cursor-pointer"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-neutral-600" />
                )}
              </button>

              {/* Notification Bell with Badge */}
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="relative p-2 rounded-full hover:bg-[var(--pill-bg)] text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[var(--bg-header)]" />
              </button>

              {/* User Avatar & Name Dropdown Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 pl-2 border-l border-[var(--border-card)] cursor-pointer group"
                  aria-label="User account menu"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                    alt={profile.name || 'Mustafa Ali'}
                    className="w-8 h-8 rounded-full object-cover border border-[var(--border-gold)] group-hover:scale-105 transition-transform"
                  />
                  <span className="text-xs font-semibold hidden sm:inline text-[var(--text-heading)]">
                    {profile.name === 'Curator' ? 'Mustafa Ali' : profile.name}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-heading)] transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-2xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-[var(--border-card)]">
                        <p className="font-semibold text-[var(--text-heading)] truncate">
                          {profile.name === 'Curator' ? 'Mustafa Ali' : profile.name}
                        </p>
                        <p className="text-[10px] text-[var(--gold-primary)] font-mono">
                          Active Atelier Session
                        </p>
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenProfile();
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-[var(--pill-bg)] text-[var(--text-body)] hover:text-[var(--text-heading)] flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                          <span>My Style Profile</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsSettingsOpen(true);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-[var(--pill-bg)] text-[var(--text-body)] hover:text-[var(--text-heading)] flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                          <span>Studio Settings</span>
                        </button>

                        {onBackToLanding && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              onBackToLanding();
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-[var(--pill-bg)] text-[var(--text-body)] hover:text-[var(--text-heading)] flex items-center gap-2.5 transition-colors cursor-pointer"
                          >
                            <Home className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                            <span>Return to Showcase</span>
                          </button>
                        )}
                      </div>

                      <div className="pt-1 border-t border-[var(--border-card)]">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            if (onLogout) onLogout();
                            else if (onBackToLanding) onBackToLanding();
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          <StudioErrorBoundary key={activeTab} tabName={activeTab.toUpperCase()} onResetToHome={() => setActiveTab('home')}>
          {/* ========================================================================= */}
          {/* TAB 1: HOME DASHBOARD (Exact Match to Screenshot 3) */}
          {/* ========================================================================= */}
          {activeTab === 'home' && (
            <div className="p-5 lg:p-7 max-w-[1600px] mx-auto w-full space-y-6">
              
              {/* Desktop 3-Column Layout: Center Content (8 cols) + Right Information (4 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* CENTER COLUMN (8 cols): Hero Banner + Quick Actions + Suggestions */}
                <div className="lg:col-span-8 space-y-5">
                  
                  {/* MAIN HERO BANNER (Matching Screenshot 3) */}
                  <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-[var(--border-card)] shadow-lg min-h-[220px] sm:min-h-[240px] flex flex-col justify-between p-6 sm:p-7 text-white">
                    {/* Background Editorial Image with Overlay */}
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80"
                      alt="Editorial Menswear"
                      className="absolute inset-0 w-full h-full object-cover opacity-65 object-[75%_25%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

                    {/* Top Hero Text & Tagline */}
                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-playfair text-2xl sm:text-3xl lg:text-[32px] font-bold text-white tracking-tight">
                          Hey {profile.name},
                        </h2>
                        <p className="text-sm sm:text-base text-neutral-300 font-light mt-0.5">
                          Styling from {activePersona.toUpperCase()}'s verified personal wardrobe.
                        </p>
                      </div>

                      <div className="hidden sm:block text-right">
                        <span className="font-serif italic text-sm text-neutral-300 font-light tracking-wide block">
                          Your style.
                        </span>
                        <span className="font-serif italic text-sm text-amber-200/90 font-light tracking-wide block">
                          Every place.
                        </span>
                      </div>
                    </div>

                    {/* Omnibar & Suggestion Chips */}
                    <div className="relative z-10 space-y-3 mt-4">
                      {/* AI Stylist Omnibar Input */}
                      <div className="relative max-w-xl">
                        <div className="w-full flex items-center bg-[#FAF5ED] text-[#1C1612] rounded-full px-4 py-2.5 shadow-md border border-[#E5D5BC]">
                          <Sparkles className="w-4 h-4 text-[#A67C1E] mr-2 shrink-0" />
                          <input
                            type="text"
                            placeholder="Ask OTD anything..."
                            value={homeSearchQuery}
                            onChange={(e) => setHomeSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && homeSearchQuery.trim()) {
                                handleSendChat(homeSearchQuery);
                                setActiveTab('stylist');
                                setPlannerStep(3);
                              }
                            }}
                            className="w-full bg-transparent text-xs sm:text-[13px] placeholder:text-[#84796C] text-[#1C1612] outline-none"
                          />
                          <button
                            onClick={() => {
                              if (homeSearchQuery.trim()) {
                                handleSendChat(homeSearchQuery);
                                setActiveTab('stylist');
                                setPlannerStep(3);
                              }
                            }}
                            className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shrink-0 ml-2"
                            aria-label="Submit query"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Suggestion Chips (Screenshot 3) */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {[
                          'Date night outfit',
                          'Office look',
                          'Outfit for this restaurant',
                          'Use my new shoes',
                        ].map((chip) => (
                          <button
                            key={chip}
                            onClick={() => {
                              handleSendChat(chip);
                              setActiveTab('stylist');
                              setPlannerStep(3);
                            }}
                            className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[11px] font-medium transition-colors cursor-pointer border border-white/20"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ========================================================================= */}
                  {/* TODAY'S AI PERFECT CHOICE (Live Weather & Personal Wardrobe Calibrated) */}
                  {/* ========================================================================= */}
                  <div className="rounded-3xl border border-[var(--border-gold)]/60 bg-[var(--bg-card)] p-6 sm:p-7 shadow-lg space-y-5">
                    
                    {/* Header: Title + Weather Telemetry + Persona Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-card)] gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-[var(--gold-primary)] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            TODAY'S AI PERFECT CHOICE
                          </span>
                          <span className="text-xs text-[var(--border-card)]">·</span>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[var(--pill-bg)] text-[var(--gold-primary)] font-bold">
                            {activePersona.toUpperCase()}'S OWN WARDROBE
                          </span>
                        </div>
                        <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[var(--text-heading)]">
                          {currentOutfit?.title || `Bespoke Look for ${profile.name}`}
                        </h3>
                      </div>

                      {/* Live Weather Badge & Harmony Score */}
                      <div className="flex items-center gap-3 self-start sm:self-center">
                        <div className="px-3 py-1.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-right">
                          <div className="text-[9px] font-mono uppercase text-[var(--text-muted)]">Live Climate</div>
                          <div className="text-xs font-semibold text-[var(--text-heading)] flex items-center gap-1">
                            <Sun className="w-3.5 h-3.5 text-amber-500" />
                            <span>{weather.city}: {weather.temp}°C {weather.condition}</span>
                          </div>
                        </div>

                        <div className="px-3 py-1.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--border-gold)] text-right">
                          <div className="text-[9px] font-mono uppercase text-[var(--gold-primary)]">Harmony</div>
                          <div className="text-xs font-bold text-[var(--gold-primary)] font-mono">
                            {currentOutfit?.harmonyScore || 99.2}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Occasion / Protocol Quick Selector */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                        Select Destination Protocol:
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { id: 'Family Festive & Traditional', icon: '🪔', label: 'Festive & Traditional' },
                          { id: 'Intimate Candlelit Dinner', icon: '🍷', label: 'Dinner / Evening' },
                          { id: 'Executive Professional / School', icon: '💼', label: 'Office / School' },
                          { id: 'Relaxed Weekend & Casual Day Out', icon: '☕', label: 'Casual Day Out' },
                        ].map((occ) => {
                          const isSelected = perfectChoiceOccasion === occ.id;
                          return (
                            <button
                              key={occ.id}
                              onClick={() => {
                                setPerfectChoiceOccasion(occ.id);
                                handleGeneratePerfectChoice(occ.id);
                              }}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-[var(--gold-primary)] text-black shadow-sm font-bold'
                                  : 'bg-[var(--bg-card-inner)] text-[var(--text-body)] border border-[var(--border-card)] hover:border-[var(--gold-primary)]'
                              }`}
                            >
                              <span>{occ.icon}</span>
                              <span>{occ.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Outfit Pieces Grid (Exact pieces from their wardrobe) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(currentOutfit?.pieces && currentOutfit.pieces.length > 0 ? currentOutfit.pieces.slice(0, 4) : closet.slice(0, 4)).map((piece, idx) => (
                        <div
                          key={piece.id || idx}
                          className="p-3 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] flex flex-col justify-between hover:border-[var(--gold-primary)] transition-all group"
                        >
                          <div>
                            <div className="aspect-square w-full rounded-xl overflow-hidden bg-neutral-900 mb-2 relative">
                              {piece.imageUrl ? (
                                <img
                                  src={piece.imageUrl}
                                  alt={piece.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                  {piece.icon || '👗'}
                                </div>
                              )}
                              <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[8px] font-mono text-white">
                                {piece.subType || piece.category}
                              </span>
                            </div>

                            <span className="text-[9px] font-mono uppercase text-[var(--gold-primary)] font-bold block truncate">
                              {piece.brand || 'Bespoke'}
                            </span>
                            <h5 className="text-xs font-semibold text-[var(--text-heading)] line-clamp-1 leading-snug">
                              {piece.name}
                            </h5>
                          </div>

                          <div className="mt-2 pt-2 border-t border-[var(--border-card)] text-[10px] text-[var(--text-muted)] flex items-center justify-between">
                            <span className="truncate">{piece.color}</span>
                            <span className="font-mono text-[var(--text-body)] truncate max-w-[70px]">{piece.material || 'Pure Fabric'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI Weather Rationale & Venue Alignment Box */}
                    <div className="p-4 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] space-y-2 text-xs">
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-[var(--pill-bg)] text-[var(--gold-primary)] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border border-[var(--border-gold)]">
                          AI
                        </div>
                        <div className="space-y-1">
                          <p className="text-[11px] text-[var(--text-body)] leading-relaxed italic">
                            "{currentOutfit?.rationale?.weatherComfort || `At ${weather.temp}°C in ${weather.city}, the breathable natural weave prevents thermal trapping while ensuring optimum ventilation for ${profile.name}.`}"
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)] font-mono">
                            <strong className="text-[var(--gold-primary)] font-semibold uppercase">Venue Fit:</strong> {currentOutfit?.rationale?.venueAlignment || 'Formulated specifically for your occasion and verified personal wardrobe pieces.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between pt-1 gap-2">
                      <div className="flex items-center gap-2">
                        {currentOutfit && (
                          <button
                            onClick={() => {
                              saveLook(currentOutfit);
                              toast('Saved to Favorites', `Added to your curated looks`, 'success');
                            }}
                            className="px-4 py-2 rounded-full border border-[var(--border-card)] hover:border-[var(--gold-primary)] text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-[var(--bg-card)]"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLookSaved(currentOutfit.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span>{isLookSaved(currentOutfit.id) ? 'Saved' : 'Save Look'}</span>
                          </button>
                        )}
                        {currentOutfit && (
                          <button
                            onClick={() => {
                              markOutfitWorn(currentOutfit.id);
                              toast('Marked as Worn', `Updated wear statistics`, 'success');
                            }}
                            className="px-4 py-2 rounded-full border border-[var(--border-card)] hover:border-[var(--gold-primary)] text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-[var(--bg-card)]"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Log Worn Today</span>
                          </button>
                        )}
                        {currentOutfit && (
                          <button
                            onClick={() => setActiveTab('tryon')}
                            className="px-4 py-2 rounded-full border border-[var(--border-gold)] bg-[var(--pill-bg)] text-[var(--gold-primary)] hover:bg-[var(--gold-primary)] hover:text-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>✨ Launch Photorealistic Try-On</span>
                          </button>
                        )}
                      </div>

                      <button
                        disabled={isGeneratingPerfectChoice}
                        onClick={() => handleGeneratePerfectChoice()}
                        className="gold-btn px-6 py-2 rounded-full text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md hover:scale-105 transition-all"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingPerfectChoice ? 'animate-spin' : ''}`} />
                        <span>Re-Synthesize for {profile.name}</span>
                      </button>
                    </div>

                  </div>

                  {/* QUICK ACTIONS ROW (Exact match to Screenshot 3: 5 Cards) */}
                  <div className="space-y-2.5">
                    <h3 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        {
                          title: 'Upload New Item',
                          subtitle: 'Add to your closet',
                          icon: Plus,
                          img: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80',
                          action: () => onOpenAddPiece(),
                        },
                        {
                          title: 'Get Outfit Ideas',
                          subtitle: 'AI powered styling',
                          icon: Sparkles,
                          img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=300&q=80',
                          action: () => {
                            setActiveTab('ideas');
                          },
                        },
                        {
                          title: 'Outfit for a Place',
                          subtitle: 'Destination mode',
                          icon: Compass,
                          img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80',
                          action: () => {
                            setActiveTab('destinations');
                          },
                        },
                        {
                          title: 'Plan My Outfits',
                          subtitle: 'Calendar view',
                          icon: Calendar,
                          img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=300&q=80',
                          action: () => {
                            setActiveTab('calendar');
                          },
                        },
                        {
                          title: 'Photorealistic AI Try-On',
                          subtitle: 'Haute couture runway fitting engine',
                          icon: Camera,
                          img: '/wardrobe/girl/girl_rose_pink_saree.png',
                          action: () => {
                            setActiveTab('tryon');
                          },
                        },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={i}
                            onClick={item.action}
                            className="group rounded-2xl overflow-hidden border border-[var(--border-card)] bg-[var(--bg-card)] p-2.5 flex flex-col justify-between hover:border-[var(--gold-primary)] transition-all cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02]"
                          >
                            <div className="h-20 w-full rounded-xl overflow-hidden relative mb-2 bg-neutral-900">
                              <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <Icon className="w-3.5 h-3.5 text-[var(--gold-primary)] shrink-0" />
                                <h4 className="font-semibold text-xs text-[var(--text-heading)] truncate">
                                  {item.title}
                                </h4>
                              </div>
                              <p className="text-[10px] text-[var(--text-muted)] truncate">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* OUTFIT SUGGESTIONS FOR YOU (Screenshot 3: 4 Cards with Carousel / Grid) */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                        Outfit Suggestions For You
                      </h3>
                      <button
                        onClick={() => setActiveTab('ideas')}
                        className="text-xs font-semibold text-[var(--gold-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>See All</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      {[
                        {
                          id: 'sug-1',
                          title: 'Smart Casual',
                          subtitle: "For Today's Weather",
                          img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80',
                        },
                        {
                          id: 'sug-2',
                          title: 'Date Night',
                          subtitle: 'Classy & Effortless',
                          img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80',
                        },
                        {
                          id: 'sug-3',
                          title: 'Office Ready',
                          subtitle: 'Clean & Polished',
                          img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&q=80',
                        },
                        {
                          id: 'sug-4',
                          title: 'Travel Look',
                          subtitle: 'Comfort Meets Style',
                          img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
                        },
                      ].map((look) => (
                        <div
                          key={look.id}
                          onClick={() => {
                            setActiveTab('stylist');
                            setPlannerStep(3);
                            setCurrentOutfitTitle(look.title);
                          }}
                          className="group rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] overflow-hidden flex flex-col justify-between hover:border-[var(--gold-primary)] transition-all cursor-pointer shadow-xs hover:shadow-md"
                        >
                          <div className="h-44 bg-neutral-900 relative overflow-hidden">
                            <img
                              src={look.img}
                              alt={look.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Favorite Heart Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(look.id);
                              }}
                              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${
                                  likedLooks.includes(look.id)
                                    ? 'fill-rose-500 text-rose-500'
                                    : 'text-white'
                                }`}
                              />
                            </button>
                          </div>
                          <div className="p-3">
                            <h4 className="font-semibold text-xs sm:text-[13px] text-[var(--text-heading)]">
                              {look.title}
                            </h4>
                            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                              {look.subtitle}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN (4 cols): Weather + Style Profile + Closet + Upcoming Occasions (Screenshot 3) */}
                <div className="lg:col-span-4 space-y-4">
                  
                  {/* 1. WEATHER & LOCATION CARD (Screenshot 3) */}
                  <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                        <span className="font-medium">{weather.city || 'Live Location'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await refreshWeather();
                          toast('Weather Updated', `Live telemetry synced: ${weather.temp}°C ${weather.condition}`, 'success');
                        }}
                        className="text-[10px] text-[var(--gold-primary)] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <RefreshCw className="w-3 h-3" /> Auto Sync
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3">
                        <Sun className="w-8 h-8 text-amber-500 shrink-0" />
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-playfair text-2xl font-bold text-[var(--text-heading)]">
                              {weather.temp}°C
                            </span>
                            <span className="text-xs text-[var(--text-muted)]">{weather.condition}</span>
                          </div>
                          <span className="text-[11px] text-[var(--text-muted)]">
                            Humidity {weather.humidity}% · Live Telemetry
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        setActiveTab('stylist');
                        setPlannerStep(2);
                      }}
                      className="pt-2 border-t border-[var(--border-card)] flex items-center justify-between text-[11px] text-[var(--text-body)] hover:text-[var(--gold-primary)] cursor-pointer"
                    >
                      <span>Calibrated for today's {weather.condition.toLowerCase()} atmosphere.</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </div>
                  </div>

                  {/* 2. YOUR STYLE PROFILE CARD (Screenshot 3) */}
                  <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-playfair text-sm font-bold text-[var(--text-heading)]">
                        Your Style Profile
                      </h4>
                      <button
                        onClick={onOpenProfile}
                        className="text-[11px] font-semibold text-[var(--gold-primary)] hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-muted)] text-[11px]">Style:</span>
                        <span className="font-semibold text-[var(--text-heading)] text-[11px]">
                          {profile.stylePersonas.join(', ') || 'Minimal, Classy, Smart Casual'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-muted)] text-[11px]">Preferred Fit:</span>
                        <span className="font-semibold text-[var(--text-heading)] text-[11px]">
                          {profile.preferredFit || 'Slim Fit'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-muted)] text-[11px]">Preferred Colours:</span>
                        <div className="flex items-center gap-1.5">
                          {['#1C1612', '#FFFFFF', '#D7C4A5', '#708090', '#1E293B'].map((hex, i) => (
                            <span
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-black/20"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-muted)] text-[11px]">Style Mood:</span>
                        <span className="font-semibold text-[var(--text-heading)] text-[11px]">
                          Modern • Versatile • Comfortable
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3. YOUR CLOSET SUMMARY (Screenshot 3) */}
                  <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-playfair text-sm font-bold text-[var(--text-heading)]">
                        Your Closet
                      </h4>
                      <button
                        onClick={() => setActiveTab('closet')}
                        className="text-[11px] font-semibold text-[var(--gold-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>See All</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {[
                        {
                          category: 'Tops',
                          count: closet.filter((i) => i.category === 'tops').length,
                          img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80',
                        },
                        {
                          category: 'Bottoms',
                          count: closet.filter((i) => i.category === 'bottoms').length,
                          img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=200&q=80',
                        },
                        {
                          category: 'Outerwear',
                          count: closet.filter((i) => i.category === 'outerwear').length,
                          img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=200&q=80',
                        },
                        {
                          category: 'Shoes',
                          count: closet.filter((i) => i.category === 'footwear').length,
                          img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=200&q=80',
                        },
                      ].map((cat, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setActiveTab('closet');
                            setClosetCategoryFilter(
                              cat.category === 'Shoes' ? 'footwear' : (cat.category.toLowerCase() as any)
                            );
                          }}
                          className="p-1.5 rounded-xl border border-[var(--border-card)] bg-[var(--pill-bg)]/40 hover:border-[var(--gold-primary)] transition-all cursor-pointer group"
                        >
                          <div className="h-12 w-full rounded-lg overflow-hidden bg-neutral-900 mb-1">
                            <img
                              src={cat.img}
                              alt={cat.category}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <span className="font-bold text-[11px] text-[var(--text-heading)] block leading-tight">
                            {cat.category}
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)]">
                            {cat.count} items
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. UPCOMING OCCASIONS CARD (Screenshot 3) */}
                  <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-playfair text-sm font-bold text-[var(--text-heading)]">
                        Upcoming Occasions
                      </h4>
                      <button
                        onClick={() => setActiveTab('calendar')}
                        className="text-[11px] font-semibold text-[var(--gold-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>See All</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-[var(--border-card)] bg-[var(--pill-bg)]/50 p-2.5 flex gap-3 items-center">
                      <img
                        src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80"
                        alt="Dinner at Olive Bistro"
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <h5 className="font-bold text-[var(--text-heading)] truncate">
                          Dinner at Olive Bistro
                        </h5>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                          Tomorrow • 8:00 PM
                        </p>
                        <p className="text-[10px] text-[var(--gold-primary)] flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>Jubilee Hills, Hyderabad</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const olive = CURATED_VENUES.find((v) => v.id === 'olive');
                        if (olive) handleSelectVenueForStyling(olive);
                      }}
                      className="w-full py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--pill-bg)] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                      <Shirt className="w-3.5 h-3.5" />
                      <span>Get Outfit for this Place</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: AI STYLIST WIZARD (Matching Screenshots 1 & 2) */}
          {/* ========================================================================= */}
          {activeTab === 'stylist' && (
            <div className="space-y-4">
              {/* Stylist Mode Switcher Bar */}
              <div className="px-5 lg:px-7 pt-2 max-w-7xl mx-auto w-full flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] text-xs shadow-xs">
                  <button
                    onClick={() => setStylistSubView('intelligent_stylist')}
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stylistSubView === 'intelligent_stylist'
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                    <span>AI Stylist (Occasion Research & Unified Try-On)</span>
                  </button>

                  <button
                    onClick={() => setStylistSubView('venue_planner')}
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stylistSubView === 'venue_planner'
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span>Custom Venue & Vibe Planner</span>
                  </button>
                </div>
              </div>

              {stylistSubView === 'intelligent_stylist' ? (
                <AIPersonalStylist onNavigateToTryOn={() => setActiveTab('tryon')} />
              ) : (
                <div className="p-5 lg:p-7 max-w-7xl mx-auto w-full space-y-6">
                  {/* Stepper Header (Screenshots 1 & 2) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-card)] pb-4">
                    <div>
                      <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[var(--text-heading)]">
                        {plannerStep === 1
                          ? 'Plan Your Perfect Look'
                          : plannerStep === 2
                          ? 'Set Your Mood & Weather'
                          : 'Your Curated Outfit Recommendation'}
                      </h2>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {plannerStep === 1
                          ? "Tell us where you're going and we'll create the perfect outfit for you."
                          : plannerStep === 2
                          ? 'Help us understand your vibe and the conditions so we can create the perfect look.'
                          : 'Engineered from your digital closet with custom rationale and conversational tweaking.'}
                      </p>
                    </div>

                {/* 3 Step Indicator (Screenshots 1 & 2) */}
                <div className="flex items-center gap-3">
                  {[
                    { num: 1, label: 'Occasion & Destination' },
                    { num: 2, label: 'Mood & Weather' },
                    { num: 3, label: 'Outfit Suggestions' },
                  ].map((s) => (
                    <div key={s.num} className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          plannerStep === s.num
                            ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                            : plannerStep > s.num
                            ? 'bg-emerald-500 text-white'
                            : 'bg-[var(--pill-bg)] text-[var(--text-muted)] border border-[var(--border-card)]'
                        }`}
                      >
                        {plannerStep > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                      </div>
                      <span className="text-xs font-medium hidden md:inline text-[var(--text-heading)]">
                        {s.label}
                      </span>
                      {s.num < 3 && <div className="w-6 h-[1px] bg-[var(--border-card)] hidden md:block" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 1: OCCASION & DESTINATION (Exact match to Screenshot 2) */}
              {plannerStep === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column (8 cols): Form Questions */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Question 1: What's the occasion? */}
                    <div className="space-y-3">
                      <h3 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                        1. What's the occasion?
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">Select one or choose multiple.</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { name: 'Date', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80' },
                          { name: 'Casual Outing', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80' },
                          { name: 'Party', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=300&q=80' },
                          { name: 'Wedding', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80' },
                          { name: 'Office', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80' },
                          { name: 'College', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=300&q=80' },
                          { name: 'Travel', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=300&q=80' },
                          { name: 'More', isMore: true },
                        ].map((occ) => {
                          const isSelected = selectedOccasion === occ.name;
                          return (
                            <div
                              key={occ.name}
                              onClick={() => {
                                if (!occ.isMore) setSelectedOccasion(occ.name);
                              }}
                              className={`rounded-2xl overflow-hidden border p-2 cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-black bg-black text-white dark:bg-white dark:text-black shadow-md'
                                  : 'border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-heading)] hover:border-[var(--gold-primary)]'
                              }`}
                            >
                              <div className="h-18 rounded-xl overflow-hidden relative mb-2 bg-neutral-900 flex items-center justify-center">
                                {occ.img ? (
                                  <img src={occ.img} alt={occ.name} className="w-full h-full object-cover" />
                                ) : (
                                  <MoreHorizontal className="w-6 h-6 text-neutral-400" />
                                )}
                                {isSelected && (
                                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center border border-white">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                )}
                              </div>
                              <span className="text-xs font-bold block text-center truncate">
                                {occ.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Question 2: Where are you going? */}
                    <div className="space-y-3">
                      <h3 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                        2. Where are you going?
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">Search for a specific place or choose a category.</p>

                      {/* Destination search bar */}
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--gold-primary)]" />
                        <input
                          type="text"
                          value={destinationSearch}
                          onChange={(e) => setDestinationSearch(e.target.value)}
                          placeholder="e.g. L'amore, Banjara Hills, Hyderabad"
                          className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] text-xs text-[var(--text-heading)] font-semibold outline-none focus:border-[var(--gold-primary)]"
                        />
                        {destinationSearch && (
                          <button
                            type="button"
                            onClick={() => {
                              setDestinationSearch('');
                              setLiveVenueSuggestions([]);
                            }}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}

                        {/* Live Venue Suggestions Dropdown */}
                        {liveVenueSuggestions.length > 0 && (
                          <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-gold)] shadow-2xl p-2 z-30 max-h-60 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-150">
                            <div className="px-3 py-1 flex items-center justify-between text-[10px] font-mono uppercase text-[var(--gold-primary)] font-bold border-b border-[var(--border-card)]">
                              <span>Verified Venues & Ambience</span>
                              {isSearchingVenues && <RefreshCw className="w-3 h-3 animate-spin" />}
                            </div>
                            {liveVenueSuggestions.map((venue) => (
                              <div
                                key={venue.id}
                                onClick={() => handleSelectLiveVenue(venue)}
                                className="p-2.5 rounded-xl hover:bg-[var(--pill-bg)] cursor-pointer flex items-center justify-between transition-colors group"
                              >
                                <div>
                                  <p className="text-xs font-bold text-[var(--text-heading)] group-hover:text-[var(--gold-primary)]">
                                    {venue.name}
                                  </p>
                                  <p className="text-[10px] text-[var(--text-muted)] truncate max-w-xs">
                                    {venue.address} • Tier {venue.formality}
                                  </p>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-[var(--pill-bg)] border border-[var(--border-card)] text-[9px] font-mono text-[var(--gold-primary)]">
                                  {venue.recommendedVibe}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Venue Categories */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { name: 'Restaurant', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80' },
                          { name: 'Café', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80' },
                          { name: 'Bar / Club', img: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=300&q=80' },
                          { name: 'Mall', img: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=300&q=80' },
                          { name: 'Movie / Theater', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=300&q=80' },
                          { name: 'Resort', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=80' },
                          { name: 'Outdoor', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80' },
                          { name: 'More', isMore: true },
                        ].map((cat) => {
                          const isSelected = selectedVenueCategory === cat.name;
                          return (
                            <div
                              key={cat.name}
                              onClick={() => {
                                if (!cat.isMore) setSelectedVenueCategory(cat.name);
                              }}
                              className={`rounded-2xl overflow-hidden border p-2 cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-black bg-black text-white dark:bg-white dark:text-black shadow-md'
                                  : 'border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-heading)] hover:border-[var(--gold-primary)]'
                              }`}
                            >
                              <div className="h-16 rounded-xl overflow-hidden relative mb-2 bg-neutral-900 flex items-center justify-center">
                                {cat.img ? (
                                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                                ) : (
                                  <MoreHorizontal className="w-6 h-6 text-neutral-400" />
                                )}
                                {isSelected && (
                                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center border border-white">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                )}
                              </div>
                              <span className="text-xs font-bold block text-center truncate">
                                {cat.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Question 3 & 4: Date, Time & Weather */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Date & Time */}
                      <div className="p-4 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] space-y-3">
                        <h4 className="font-playfair text-sm font-bold text-[var(--text-heading)]">
                          3. When are you going? <span className="text-[11px] text-[var(--text-muted)] font-normal">(Optional)</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-card)] bg-[var(--pill-bg)]">
                            <Calendar className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                            <span className="font-semibold">{selectedDate}</span>
                          </div>
                          <div className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-card)] bg-[var(--pill-bg)]">
                            <Clock className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                            <span className="font-semibold">{selectedTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Auto-detected Weather */}
                      <div className="p-4 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-playfair text-sm font-bold text-[var(--text-heading)]">
                            4. Weather <span className="text-[10px] text-[var(--gold-primary)] font-mono font-bold uppercase">(Auto-detected)</span>
                          </h4>
                          <span className="text-[10px] text-emerald-500 font-mono font-bold">● Live Telemetry</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CloudSun className="w-8 h-8 text-amber-500 shrink-0" />
                          <div className="text-xs">
                            <span className="font-bold text-sm text-[var(--text-heading)]">{weather.temp}°C {weather.condition}</span>
                            <p className="text-[11px] text-[var(--text-muted)]">{weather.city} • Humidity {weather.humidity}%</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => setActiveTab('home')}
                        className="px-5 py-2.5 rounded-full border border-[var(--border-card)] text-xs font-semibold hover:bg-[var(--pill-bg)] cursor-pointer transition-colors"
                      >
                        ← Back to Dashboard
                      </button>

                      <button
                        onClick={() => setPlannerStep(2)}
                        className="px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>Next: Set Mood & Weather</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Right Column (4 cols): Venue Preview Card (Screenshot 2) */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] overflow-hidden shadow-lg">
                      <div className="h-44 bg-neutral-900 relative">
                        <img
                          src={selectedVenue.img}
                          alt={selectedVenue.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-5 space-y-4">
                        <div>
                          <h4 className="font-playfair text-xl font-bold text-[var(--text-heading)]">
                            {selectedVenue.name}
                          </h4>
                          <p className="text-xs text-[var(--gold-primary)] flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{selectedVenue.location}</span>
                          </p>
                        </div>

                        {/* Venue Tabs */}
                        <div className="flex border-b border-[var(--border-card)] text-xs">
                          {(['about', 'ambience', 'dress_code', 'photos'] as const).map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setVenueInfoTab(tab)}
                              className={`pb-2 px-2 capitalize font-semibold transition-colors cursor-pointer ${
                                venueInfoTab === tab
                                  ? 'border-b-2 border-black dark:border-white text-[var(--text-heading)]'
                                  : 'text-[var(--text-muted)]'
                              }`}
                            >
                              {tab.replace('_', ' ')}
                            </button>
                          ))}
                        </div>

                        <p className="text-xs text-[var(--text-body)] leading-relaxed">
                          {selectedVenue.description}
                        </p>

                        {/* Venue Metadata Badges */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className="p-2 rounded-xl bg-[var(--pill-bg)]">
                            <span className="text-[var(--text-muted)] block text-[10px]">Ambience</span>
                            <strong className="text-[var(--text-heading)]">{selectedVenue.ambience}</strong>
                          </div>
                          <div className="p-2 rounded-xl bg-[var(--pill-bg)]">
                            <span className="text-[var(--text-muted)] block text-[10px]">Vibe</span>
                            <strong className="text-[var(--text-heading)]">{selectedVenue.vibe}</strong>
                          </div>
                          <div className="p-2 rounded-xl bg-[var(--pill-bg)]">
                            <span className="text-[var(--text-muted)] block text-[10px]">Dress Code</span>
                            <strong className="text-[var(--text-heading)]">{selectedVenue.dressCode}</strong>
                          </div>
                          <div className="p-2 rounded-xl bg-[var(--pill-bg)]">
                            <span className="text-[var(--text-muted)] block text-[10px]">Temperature</span>
                            <strong className="text-[var(--text-heading)]">{selectedVenue.tempRange}</strong>
                          </div>
                        </div>

                        {/* Pro Tip Card */}
                        <div className="p-3 rounded-2xl bg-[var(--pill-bg)] border border-[var(--border-gold)] text-xs text-[var(--text-body)] space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-[var(--gold-primary)]">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Pro Tip</span>
                          </div>
                          <p className="text-[11px] leading-snug">
                            Based on the venue, time and weather, we'll suggest outfits that match the ambience and your personal style.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 2: SET YOUR MOOD & WEATHER (Exact match to Screenshot 1) */}
              {plannerStep === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column (8 cols): Mood, Weather & Preferences */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* 1. What's your mood today? (10 Cards from Screenshot 1) */}
                    <div className="space-y-3">
                      <h3 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                        1. What's your mood today?
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">Select your current vibe or choose multiple.</p>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {[
                          { id: 'Confident', label: 'Confident', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
                          { id: 'Chill', label: 'Chill', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80' },
                          { id: 'Romantic', label: 'Romantic', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80' },
                          { id: 'Energetic', label: 'Energetic', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80' },
                          { id: 'Classy', label: 'Classy', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80' },
                          { id: 'Minimal', label: 'Minimal', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80' },
                          { id: 'Trendy', label: 'Trendy', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80' },
                          { id: 'Bold', label: 'Bold', img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=300&q=80' },
                          { id: 'Comfortable', label: 'Comfortable', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80' },
                          { id: 'Other', label: 'Other', isPlus: true },
                        ].map((m) => {
                          const isSelected = selectedMood === m.id;
                          return (
                            <div
                              key={m.id}
                              onClick={() => {
                                if (!m.isPlus) setSelectedMood(m.id);
                              }}
                              className={`rounded-2xl overflow-hidden border p-2 cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-black bg-black text-white dark:bg-white dark:text-black shadow-md'
                                  : 'border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-heading)] hover:border-[var(--gold-primary)]'
                              }`}
                            >
                              <div className="h-18 rounded-xl overflow-hidden relative mb-2 bg-neutral-900 flex items-center justify-center">
                                {m.img ? (
                                  <img src={m.img} alt={m.label} className="w-full h-full object-cover" />
                                ) : (
                                  <Plus className="w-6 h-6 text-neutral-400" />
                                )}
                                {isSelected && (
                                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center border border-white">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                )}
                              </div>
                              <span className="text-xs font-bold block text-center truncate">
                                {m.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. What's the weather like? (7 Buttons from Screenshot 1) */}
                    <div className="space-y-3">
                      <h3 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                        2. What's the weather like?
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">We'll adjust the outfit to keep you comfortable and stylish.</p>

                      <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5">
                        {[
                          { name: 'Sunny', icon: Sun, color: 'text-amber-500' },
                          { name: 'Partly Cloudy', icon: CloudSun, color: 'text-amber-400' },
                          { name: 'Cloudy', icon: CloudRain, color: 'text-neutral-400' },
                          { name: 'Rainy', icon: CloudRain, color: 'text-sky-500' },
                          { name: 'Windy', icon: Wind, color: 'text-teal-500' },
                          { name: 'Cold', icon: Snowflake, color: 'text-blue-400' },
                          { name: 'Hot', icon: Thermometer, color: 'text-rose-500' },
                        ].map((w) => {
                          const Icon = w.icon;
                          const isSelected = selectedWeatherCond === w.name;
                          return (
                            <button
                              key={w.name}
                              type="button"
                              onClick={() => {
                                setSelectedWeatherCond(w.name);
                                setWeather({ ...weather, condition: w.name });
                              }}
                              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-black bg-black text-white dark:bg-white dark:text-black shadow-md'
                                  : 'border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-heading)] hover:border-[var(--gold-primary)]'
                              }`}
                            >
                              <Icon className={`w-5 h-5 ${isSelected ? 'text-[var(--gold-primary)]' : w.color}`} />
                              <span className="text-[11px] font-bold truncate">{w.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Any additional preferences? (Screenshot 1) */}
                    <div className="space-y-3">
                      <h3 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                        3. Any additional preferences? <span className="text-[11px] text-[var(--text-muted)] font-normal">(Optional)</span>
                      </h3>

                      <div className="flex flex-wrap gap-2 text-xs">
                        {[
                          { name: 'Layering', icon: Layers },
                          { name: 'Light & Breezy', icon: Wind },
                          { name: 'Warm & Cozy', icon: Sparkles },
                          { name: 'Rain Friendly', icon: Umbrella },
                          { name: 'Breathable', icon: Sun },
                          { name: 'Indoor-to-Outdoor', icon: Building },
                          { name: 'All Day Comfort', icon: Clock },
                        ].map((pref) => {
                          const Icon = pref.icon;
                          const isSelected = selectedPreferences.includes(pref.name);
                          return (
                            <button
                              key={pref.name}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedPreferences(selectedPreferences.filter((p) => p !== pref.name));
                                } else {
                                  setSelectedPreferences([...selectedPreferences, pref.name]);
                                }
                              }}
                              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-black bg-black text-white dark:bg-white dark:text-black shadow-sm font-semibold'
                                  : 'border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-body)] hover:border-[var(--gold-primary)]'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                              <span className="text-xs">{pref.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => setPlannerStep(1)}
                        className="px-5 py-2.5 rounded-full border border-[var(--border-card)] text-xs font-semibold hover:bg-[var(--pill-bg)] cursor-pointer transition-colors"
                      >
                        ← Back
                      </button>

                      <button
                        onClick={handleGenerateRecommendation}
                        disabled={isGenerating}
                        className="px-6 py-3 rounded-full bg-[var(--gold-primary)] text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        <Sparkles className="w-4 h-4 text-black" />
                        <span>{isGenerating ? 'Synthesizing...' : 'Generate AI Outfit Recommendation'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Right Column (4 cols): Your Current Plan & Weather (Screenshot 1) */}
                  <div className="lg:col-span-4 space-y-4">
                    {/* Your Current Plan */}
                    <div className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-card)]">
                        <h4 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                          Your Current Plan
                        </h4>
                        <button
                          onClick={() => setPlannerStep(1)}
                          className="text-[11px] font-semibold text-[var(--gold-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div className="h-32 rounded-2xl overflow-hidden bg-neutral-900">
                          <img
                            src={selectedVenue.img}
                            alt={selectedVenue.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-[var(--text-heading)]">
                            Dinner at {selectedVenue.name}
                          </h5>
                          <div className="space-y-1 text-xs text-[var(--text-muted)] mt-1.5">
                            <p className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                              <span>{selectedDate}</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                              <span>{selectedTime}</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                              <span>{selectedVenue.location}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Weather telemetric summary */}
                      <div className="p-3 rounded-2xl bg-[var(--pill-bg)] border border-[var(--border-card)] flex items-center gap-3">
                        <CloudSun className="w-7 h-7 text-amber-500 shrink-0" />
                        <div className="text-xs">
                          <span className="font-bold text-sm text-[var(--text-heading)]">{weather.temp}°C {weather.condition}</span>
                          <p className="text-[10px] text-[var(--text-muted)]">{weather.city} • Humidity {weather.humidity}%</p>
                        </div>
                      </div>

                      {/* Pro Tip Card */}
                      <div className="p-3 rounded-2xl bg-[var(--pill-bg)] border border-[var(--border-gold)] text-xs text-[var(--text-body)] space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-[var(--gold-primary)]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Pro Tip</span>
                        </div>
                        <p className="text-[11px] leading-snug">
                          We'll combine your mood, weather and destination vibe to suggest outfits that look great and feel right.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 3: RECOMMENDATION & CONVERSATIONAL MODIFIER */}
              {plannerStep === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column (7 cols): Curated Look Canvas & Editorial Rationale */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 space-y-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-mono font-bold text-[var(--gold-primary)] tracking-wider">
                            Curated Ensemble • {currentOutfit?.occasion || selectedOccasion}
                          </span>
                          <h3 className="font-playfair text-2xl font-bold text-[var(--text-heading)]">
                            {currentOutfit?.title || currentOutfitTitle}
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-emerald-500 block">
                            {currentOutfit?.harmonyScore ? `${currentOutfit.harmonyScore}%` : '98.4%'} Harmony Score
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)]">
                            Calibrated to your Style DNA
                          </span>
                        </div>
                      </div>

                      {/* Garments Visual Composition */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {(currentOutfit?.pieces || closet.slice(0, 4)).map((piece) => (
                          <ItemCard
                            key={piece.id}
                            item={piece}
                            onClick={() => setSelectedClosetItem(piece)}
                            className="h-full"
                          />
                        ))}
                      </div>

                      {/* Editorial Rationale: Why This Look? */}
                      <div className="p-4 rounded-2xl bg-[var(--pill-bg)] border border-[var(--border-card)] space-y-2.5">
                        <h4 className="font-playfair text-sm font-bold text-[var(--text-heading)] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                          <span>Why This Look Works</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-[var(--text-body)]">
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span><strong>Venue Alignment:</strong> {currentOutfit?.rationale.venueAlignment || `Styled for ${selectedVenue.name}'s ${selectedVenue.ambience} setting and ${selectedVenue.dressCode} dress code.`}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span><strong>Climate Comfort:</strong> {currentOutfit?.rationale.weatherComfort || `Optimized for ${selectedWeatherCond} weather.`}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span><strong>Chromatic Harmony:</strong> {currentOutfit?.rationale.paletteHarmony || `High-contrast neutral pairing complementing your calibrated skin undertone and fit.`}</span>
                          </li>
                          {currentOutfit?.rationale.wardrobeUtilization && (
                            <li className="flex items-start gap-2">
                              <span className="text-[var(--gold-primary)] font-bold">✦</span>
                              <span><strong>Wardrobe Utilization:</strong> {currentOutfit.rationale.wardrobeUtilization}</span>
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        <button
                          onClick={() => {
                            if (currentOutfit) {
                              markOutfitWorn(currentOutfit.id);
                              toast.success("Look logged as worn! Item wear counts and cost-per-wear updated.");
                            } else {
                              toast.info("Look logged!");
                            }
                          }}
                          className="px-5 py-2.5 rounded-full bg-[var(--gold-primary)] text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Wear This Look</span>
                        </button>

                        <button
                          onClick={() => {
                            if (currentOutfit) {
                              if (isLookSaved(currentOutfit.id)) {
                                removeSavedLook(currentOutfit.id);
                                toast.info("Removed from saved looks");
                              } else {
                                saveLook(currentOutfit);
                                toast.success("Saved to your curated looks!");
                              }
                            } else {
                              toast.success("Saved to your favorites!");
                            }
                          }}
                          className="px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${currentOutfit && isLookSaved(currentOutfit.id) ? 'fill-[var(--gold-primary)] text-[var(--gold-primary)]' : ''}`} />
                          <span>{currentOutfit && isLookSaved(currentOutfit.id) ? 'Saved' : 'Save to Favorites'}</span>
                        </button>

                        <button
                          onClick={() => setIsShareModalOpen(true)}
                          className="px-4 py-2.5 rounded-full border border-[var(--border-card)] text-xs font-semibold hover:bg-[var(--pill-bg)] transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Publish to Lookbook</span>
                        </button>

                        <button
                          onClick={() => {
                            handleGenerateRecommendation();
                            toast.info("Regenerating an alternate ensemble...");
                          }}
                          disabled={isGenerating}
                          className="px-4 py-2.5 rounded-full border border-[var(--border-card)] text-xs font-semibold hover:bg-[var(--pill-bg)] transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                          <span>Regenerate</span>
                        </button>

                        <button
                          onClick={() => setIsScheduleModalOpen(true)}
                          className="px-4 py-2.5 rounded-full border border-[var(--border-card)] text-xs font-semibold hover:bg-[var(--pill-bg)] transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Schedule on Calendar</span>
                        </button>

                        <button
                          onClick={() => setPlannerStep(1)}
                          className="px-4 py-2.5 rounded-full border border-[var(--border-card)] text-xs font-semibold hover:bg-[var(--pill-bg)] transition-colors cursor-pointer text-[var(--text-muted)]"
                        >
                          New Plan
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (5 cols): AI Stylist Chat & Conversational Modifier */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] overflow-hidden shadow-lg flex flex-col h-[580px]">
                      
                      {/* Stylist Concierge Header */}
                      <div className="p-4 border-b border-[var(--border-card)] flex items-center justify-between bg-[var(--bg-header)]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#FAF5ED] p-1 border border-[#D5C29D] flex items-center justify-center">
                            <img src="/otd_logo.png" alt="OTD" className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <h4 className="font-playfair text-sm font-bold text-[var(--text-heading)]">
                              OTD AI Stylist Concierge
                            </h4>
                            <p className="text-[10px] text-emerald-500 font-medium">Ready to tweak look</p>
                          </div>
                        </div>
                      </div>

                      {/* Messages Stream */}
                      <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
                        {chatMessages.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            {msg.sender === 'ai' && (
                              <div className="w-6 h-6 rounded-full bg-[#FAF5ED] p-0.5 border border-[#D5C29D] shrink-0 flex items-center justify-center">
                                <img src="/otd_logo.png" alt="OTD" className="w-full h-full object-contain" />
                              </div>
                            )}
                            <div
                              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                                msg.sender === 'user'
                                  ? 'bg-amber-100/70 dark:bg-amber-950/40 text-[var(--text-heading)] rounded-tr-none'
                                  : 'bg-[var(--pill-bg)] text-[var(--text-body)] rounded-tl-none border border-[var(--border-card)]'
                              }`}
                            >
                              <p>{msg.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quick Modification Chips */}
                      <div className="p-3 border-t border-[var(--border-card)] bg-[var(--pill-bg)]/40">
                        <p className="text-[10px] uppercase font-mono tracking-wider text-[var(--gold-primary)] mb-2 font-semibold">
                          Quick Tweak Chips:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Make it more casual.',
                            'Change the shoes.',
                            "Don't use jeans.",
                            'Make it more date-ready.',
                          ].map((instruction) => (
                            <button
                              key={instruction}
                              onClick={() => handleSendChat(instruction)}
                              className="px-2.5 py-1 rounded-full text-[11px] bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)] transition-all cursor-pointer"
                            >
                              "{instruction}"
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Input Box */}
                      <div className="p-3 border-t border-[var(--border-card)] flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="e.g. 'Swap in something darker or more relaxed'..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                          className="flex-1 py-2 px-3.5 text-xs rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] focus:outline-none focus:border-[var(--gold-primary)]"
                        />
                        <button
                          onClick={() => handleSendChat()}
                          className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center hover:scale-105 transition-all cursor-pointer shrink-0"
                          aria-label="Send message"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      )}

          {/* ========================================================================= */}
          {/* TAB 3: DIGITAL CLOSET MATRIX (Full Features, Search, Filters & CRUD) */}
          {/* ========================================================================= */}
          {activeTab === 'closet' && (
            <div className="p-5 lg:p-7 max-w-7xl mx-auto w-full space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[var(--text-heading)]">
                    Digital Closet Matrix
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {closet.length} items cataloged • Ready for AI styling & destination adaptation
                  </p>
                </div>
                <button
                  onClick={onOpenAddPiece}
                  className="px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Piece</span>
                </button>
              </div>

              {/* Persona Selector Tabs with Detailed Garments description */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)]">
                {[
                  { id: 'women' as PersonaType, label: 'Women', desc: 'Sarees, Blouses, Slip Dresses, Tuxedos & Pants', icon: '👩' },
                  { id: 'man' as PersonaType, label: 'Man', desc: 'Savile Row Suits, Shirts, Chinos & Tees', icon: '👨' },
                  { id: 'boy' as PersonaType, label: 'Boy', desc: 'Pants, Shirts, Jackets & T-Shirts', icon: '👦' },
                  { id: 'girl' as PersonaType, label: 'Girl', desc: 'Pinterest Dresses, Chudidars, Kurtis, Sarees & Pants', icon: '👧' },
                ].map((p) => {
                  const isSelected = activePersona === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => switchPersona(p.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[var(--pill-bg)] border-[var(--gold-primary)] shadow-sm ring-1 ring-[var(--gold-primary)]/30'
                          : 'border-[var(--border-card)] bg-[var(--bg-card-inner)] hover:border-[var(--gold-primary)]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[var(--text-heading)] flex items-center gap-1.5">
                          <span>{p.icon}</span>
                          <span>{p.label}'s Closet</span>
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--gold-primary)] text-black font-bold uppercase">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] line-clamp-1">
                        {p.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* ========================================================================= */}
              {/* AI OUTING & DESTINATION STYLIST ENGINE CONSOLE */}
              {/* ========================================================================= */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-gold)]/40 shadow-sm space-y-5 relative overflow-hidden">
                {/* Background luxury gradient glow */}
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-[var(--gold-primary)]/5 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[var(--pill-bg)] border border-[var(--border-gold)] text-[var(--gold-primary)] flex items-center justify-center font-bold text-xs shadow-xs">
                        <Sparkles className="w-4 h-4" />
                      </span>
                      <h3 className="font-playfair text-lg sm:text-xl font-bold text-[var(--text-heading)]">
                        AI Outing & Destination Stylist Engine
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-mono font-bold uppercase">
                        Active · 1-Click
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      Click an outing below — the AI engine immediately scans your {activePersona.toUpperCase()} wardrobe, evaluates {weather.temp}°C {weather.condition} in {weather.city}, and formulates the proper choice for your outing.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <div className="px-3 py-1.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-right">
                      <div className="text-[9px] font-mono uppercase text-[var(--text-muted)]">Climate Calibrated</div>
                      <div className="text-xs font-semibold text-[var(--text-heading)] flex items-center gap-1">
                        <Sun className="w-3 h-3 text-amber-500" />
                        <span>{weather.city}: {weather.temp}°C</span>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--border-gold)] text-right">
                      <div className="text-[9px] font-mono uppercase text-[var(--gold-primary)] font-bold">Harmony Target</div>
                      <div className="text-xs font-bold text-[var(--gold-primary)] font-mono">
                        {currentOutfit?.harmonyScore || 99.4}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Occasion Protocol Selection Grid */}
                <div className="space-y-2 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[var(--gold-primary)]" />
                      <span>Select Outing Protocol:</span>
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] italic">
                      AI automatically equips proper pieces & runway twin
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                    {CLOSET_OCCASION_PROTOCOLS.map((occ) => {
                      const isSelected = activeClosetOccasion === occ.id;
                      return (
                        <button
                          key={occ.id}
                          onClick={() => handleCurateClosetOuting(occ.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                            isSelected
                              ? 'bg-[var(--gold-primary)] text-black border-[var(--gold-primary)] shadow-md font-bold scale-[1.02]'
                              : 'bg-[var(--bg-card-inner)] text-[var(--text-body)] border border-[var(--border-card)] hover:border-[var(--gold-primary)]/70 hover:bg-[var(--pill-bg)]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-base">{occ.icon}</span>
                            {isSelected && (
                              <span className="text-[8px] font-mono px-1 py-0.2 rounded-full bg-black text-white font-bold uppercase">
                                Chosen
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-semibold truncate leading-tight">
                            {occ.label}
                          </div>
                          <div className={`text-[9px] truncate mt-0.5 ${isSelected ? 'text-black/80' : 'text-[var(--text-muted)]'}`}>
                            {occ.vibe.split('&')[0]}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Engine Synthesis Banner / State Indicator */}
                {isOutingEngineRunning && (
                  <div className="p-3 rounded-xl bg-[var(--pill-bg)] border border-[var(--border-gold)] text-center text-xs text-[var(--gold-primary)] font-mono animate-pulse flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Optimal Outing Formulation for {activeClosetOccasion.toUpperCase()} from {activePersona.toUpperCase()} Wardrobe...</span>
                  </div>
                )}

                {/* Curated Outing Recommendation Showcase Card */}
                {currentOutfit && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card-inner)] border border-[var(--border-gold)]/60 shadow-sm space-y-4 relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[var(--border-card)] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-[var(--gold-primary)] text-black font-bold">
                            ✨ Formulated for {currentOutfit.occasion}
                          </span>
                          <span className="text-[9px] font-mono text-[var(--text-muted)]">
                            {currentOutfit.venue}
                          </span>
                        </div>
                        <h4 className="font-playfair text-base sm:text-lg font-bold text-[var(--text-heading)] mt-1">
                          {currentOutfit.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveTab('tryon');
                            toast('✨ Launching Virtual Try-On', `Loaded ${currentOutfit.title} on runway model`, 'info');
                          }}
                          className="px-4 py-2 rounded-full bg-[var(--gold-primary)] text-black hover:scale-105 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>✨ Try-On This Outing</span>
                        </button>
                        <button
                          onClick={() => {
                            saveLook(currentOutfit);
                            toast('Saved to Favorites', `Added to your curated looks`, 'success');
                          }}
                          className="p-2 rounded-full border border-[var(--border-card)] hover:border-[var(--gold-primary)] text-[var(--text-heading)] cursor-pointer bg-[var(--bg-card)]"
                          title="Save to Favorites"
                        >
                          <Heart className={`w-4 h-4 ${isLookSaved(currentOutfit.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                        <button
                          onClick={() => {
                            markOutfitWorn(currentOutfit.id);
                            toast('Marked as Worn', `Logged for today`, 'success');
                          }}
                          className="p-2 rounded-full border border-[var(--border-card)] hover:border-[var(--gold-primary)] text-[var(--text-heading)] cursor-pointer bg-[var(--bg-card)]"
                          title="Log Worn Today"
                        >
                          <Check className="w-4 h-4 text-emerald-500" />
                        </button>
                      </div>
                    </div>

                    {/* Selected Pieces 4-Column Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {currentOutfit.pieces.map((piece, idx) => (
                        <div
                          key={piece.id || idx}
                          onClick={() => setSelectedClosetItem(piece)}
                          className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-gold)]/50 hover:border-[var(--gold-primary)] transition-all cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between"
                        >
                          <div>
                            <div className="aspect-square w-full rounded-lg overflow-hidden bg-neutral-900 mb-2 relative">
                              {piece.imageUrl ? (
                                <img
                                  src={piece.imageUrl}
                                  alt={piece.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl">
                                  {piece.icon || '👕'}
                                </div>
                              )}
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[8px] font-mono text-[var(--gold-primary)] font-bold uppercase">
                                {piece.category}
                              </span>
                            </div>

                            <span className="text-[9px] font-mono uppercase text-[var(--gold-primary)] font-semibold block truncate">
                              {piece.brand}
                            </span>
                            <h5 className="text-xs font-bold text-[var(--text-heading)] line-clamp-1 leading-snug">
                              {piece.name}
                            </h5>
                          </div>

                          <div className="mt-2 pt-1.5 border-t border-[var(--border-card)] text-[9px] text-[var(--text-muted)] flex items-center justify-between">
                            <span className="truncate">{piece.color}</span>
                            <span className="font-mono text-[var(--text-body)] truncate max-w-[70px]">{piece.material || 'Pure Fabric'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI Stylist Rationale Box */}
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] text-xs space-y-1.5">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[var(--pill-bg)] text-[var(--gold-primary)] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border border-[var(--border-gold)]">
                          AI
                        </span>
                        <div className="space-y-1">
                          <p className="text-[11px] text-[var(--text-body)] leading-relaxed italic">
                            "{currentOutfit.rationale.venueAlignment}"
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[10px] font-mono text-[var(--text-muted)]">
                            <span>
                              <strong className="text-[var(--gold-primary)]">Climate Comfort:</strong> {currentOutfit.rationale.weatherComfort}
                            </span>
                            <span>
                              <strong className="text-[var(--gold-primary)]">Color Theory:</strong> {currentOutfit.rationale.paletteHarmony}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Search & Category Filter Bar */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      placeholder="Search garments by name, brand, color, or fabric..."
                      value={closetSearch}
                      onChange={(e) => setClosetSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] text-xs text-[var(--text-heading)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--gold-primary)]"
                    />
                  </div>

                  {/* Formality Filter */}
                  <select
                    value={closetFormalityFilter}
                    onChange={(e) =>
                      setClosetFormalityFilter(
                        e.target.value === 'all' ? 'all' : Number(e.target.value)
                      )
                    }
                    className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] text-xs text-[var(--text-heading)] outline-none focus:border-[var(--gold-primary)]"
                  >
                    <option value="all">All Formality Tiers</option>
                    <option value={1}>Tier 1: Casual / Street</option>
                    <option value={2}>Tier 2: Smart Casual</option>
                    <option value={3}>Tier 3: Elevated Social</option>
                    <option value={4}>Tier 4: Sartorial Tailored</option>
                    <option value={5}>Tier 5: Black-Tie Formal</option>
                  </select>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'all', label: `All (${closet.length})` },
                    {
                      id: 'tops',
                      label:
                        activePersona === 'girl'
                          ? `Dresses & Tops (${closet.filter((i) => i.category === 'tops').length})`
                          : activePersona === 'women'
                          ? `Sarees, Dresses & Tops (${closet.filter((i) => i.category === 'tops').length})`
                          : activePersona === 'man'
                          ? `Suits & Shirts (${closet.filter((i) => i.category === 'tops').length})`
                          : `Shirts & Tees (${closet.filter((i) => i.category === 'tops').length})`,
                    },
                    {
                      id: 'bottoms',
                      label:
                        activePersona === 'girl' || activePersona === 'women'
                          ? `Pants & Chudidars (${closet.filter((i) => i.category === 'bottoms').length})`
                          : `Pants & Chinos (${closet.filter((i) => i.category === 'bottoms').length})`,
                    },
                    { id: 'outerwear', label: `Jackets & Outerwear (${closet.filter((i) => i.category === 'outerwear').length})` },
                    { id: 'footwear', label: `Footwear (${closet.filter((i) => i.category === 'footwear').length})` },
                    { id: 'accessories', label: `Accessories (${closet.filter((i) => i.category === 'accessories').length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setClosetCategoryFilter(tab.id as any)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        closetCategoryFilter === tab.id
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                          : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-heading)] border border-[var(--border-card)]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Garment Grid */}
              {filteredClosetItems.length === 0 ? (
                <EmptyState
                  icon={<Shirt className="w-8 h-8 text-[var(--gold-primary)]" />}
                  title="No garments found"
                  description="No clothing items match your search or category filters. Try resetting filters or upload a new garment."
                  actionLabel="+ Upload New Piece"
                  onAction={onOpenAddPiece}
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredClosetItems.map((piece) => {
                    const isChosenInOuting = currentOutfit?.pieces?.some((p) => p.id === piece.id);
                    return (
                      <div key={piece.id} className="relative group">
                        {isChosenInOuting && (
                          <div className="absolute -top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-[var(--gold-primary)] text-black font-bold font-mono text-[8px] shadow-sm uppercase flex items-center gap-1 border border-black/20">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>AI Outing Pick</span>
                          </div>
                        )}
                        <ItemCard
                          item={piece}
                          selected={isChosenInOuting}
                          onClick={() => setSelectedClosetItem(piece)}
                          onDelete={(e) => {
                            e.stopPropagation();
                            setItemToDelete(piece);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Wardrobe Investment Gaps & Capsule Suggestions */}
              <div className="pt-8 border-t border-[var(--border-card)] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[var(--text-heading)] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[var(--gold-primary)]" />
                      <span>Curated Investment Gaps & Capsule Suggestions</span>
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      AI-analyzed wardrobe voids to unlock 10+ high-tier combinations with minimal acquisitions
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[var(--pill-bg)] border border-[var(--border-gold)] text-[10px] font-mono font-bold text-[var(--gold-primary)] uppercase flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{wardrobeGaps.length} Targeted Gaps</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wardrobeGaps.map((gap) => (
                    <div
                      key={gap.id}
                      className="p-4 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] hover:border-[var(--gold-primary)] transition-all flex flex-col justify-between space-y-3 group shadow-xs hover:shadow-md"
                    >
                      <div className="flex gap-3">
                        <div className="w-20 h-24 rounded-xl overflow-hidden bg-neutral-900 border border-[var(--border-card)] shrink-0">
                          <img
                            src={gap.imageUrl}
                            alt={gap.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] uppercase font-mono font-bold text-[var(--gold-primary)]">
                              {gap.brand}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                gap.urgency === 'High'
                                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                  : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              }`}
                            >
                              {gap.urgency} Urgency
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-[var(--text-heading)] line-clamp-1">
                            {gap.name}
                          </h4>
                          <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                            {gap.reason}
                          </p>
                          <p className="text-xs font-mono font-bold text-[var(--text-heading)]">
                            ${gap.estimatedPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <a
                        href={gap.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--pill-bg)] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                        <span>Acquire Piece via Luxury Retailer</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: DESTINATIONS MODE (Eliminating Dead Screen) */}
          {/* ========================================================================= */}
          {activeTab === 'destinations' && (
            <div className="p-5 lg:p-7 max-w-7xl mx-auto w-full space-y-6">
              <div>
                <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[var(--text-heading)]">
                  Destination Mode & Venues
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Browse curated nightlife, fine dining, and cultural enclaves with automated ambience & dress-code matching
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {CURATED_VENUES.map((venue) => (
                  <div
                    key={venue.id}
                    className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] overflow-hidden flex flex-col justify-between group shadow-xs hover:shadow-md transition-all hover:border-[var(--gold-primary)]"
                  >
                    <div>
                      <div className="h-44 bg-neutral-900 relative overflow-hidden">
                        <img
                          src={venue.img}
                          alt={venue.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-mono backdrop-blur-md uppercase">
                          {venue.category}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="font-playfair text-lg font-bold text-[var(--text-heading)]">
                          {venue.name}
                        </h4>
                        <p className="text-xs text-[var(--gold-primary)] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{venue.location}</span>
                        </p>
                        <p className="text-xs text-[var(--text-body)] line-clamp-2 leading-relaxed">
                          {venue.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-2 text-[10px]">
                          <span className="px-2 py-0.5 rounded-full bg-[var(--pill-bg)] text-[var(--text-muted)] border border-[var(--border-card)]">
                            {venue.ambience}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[var(--pill-bg)] text-[var(--text-muted)] border border-[var(--border-card)]">
                            {venue.dressCode}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        onClick={() => handleSelectVenueForStyling(venue)}
                        className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-all cursor-pointer shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                        <span>Style Me for this Place</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: CALENDAR & UPCOMING PLANS (Eliminating Dead Screen) */}
          {/* ========================================================================= */}
          {activeTab === 'calendar' && (
            <div className="p-5 lg:p-7 max-w-7xl mx-auto w-full space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[var(--text-heading)]">
                    Outfit Calendar & Event Scheduler
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Pre-plan ensembles for upcoming events and track worn looks to avoid social duplicates
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="px-4 py-2.5 rounded-full border border-[var(--border-gold)] bg-[var(--pill-bg)] text-xs font-semibold hover:border-[var(--gold-primary)] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Calendar className="w-4 h-4 text-[var(--gold-primary)]" />
                    <span>+ Schedule Active Look</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('stylist');
                      setPlannerStep(1);
                    }}
                    className="px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Plan Outfit for Day</span>
                  </button>
                </div>
              </div>

              {/* Scheduled Events Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-playfair text-lg font-bold text-[var(--text-heading)]">
                    Upcoming Booked Occasions ({calendarEvents.length})
                  </h3>
                  <span className="text-[10px] uppercase font-mono font-bold text-[var(--gold-primary)]">
                    Synchronized with Wardrobe History
                  </span>
                </div>

                {calendarEvents.length === 0 ? (
                  <EmptyState
                    icon={<Calendar className="w-8 h-8 text-[var(--gold-primary)]" />}
                    title="No upcoming events scheduled"
                    description="Schedule an ensemble from your Stylist canvas to prepare ahead of time for upcoming dinners, flights, or presentations."
                    actionLabel="+ Schedule an Ensemble"
                    onAction={() => setIsScheduleModalOpen(true)}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {calendarEvents.map((event) => {
                      const displayDate = new Date(event.scheduledDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      });
                      const pieces = event.outfitId?.pieces || [];
                      return (
                        <div
                          key={event._id}
                          className="p-5 rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] hover:border-[var(--gold-primary)] transition-all flex flex-col justify-between space-y-4 shadow-xs"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 rounded-full bg-[var(--pill-bg)] border border-[var(--border-card)] text-[10px] font-mono font-bold text-[var(--gold-primary)]">
                                  {displayDate} • {event.time}
                                </span>
                                {event.weatherForecast && (
                                  <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                                    <CloudSun className="w-3 h-3 text-[var(--gold-primary)]" />
                                    <span>{event.weatherForecast}</span>
                                  </span>
                                )}
                              </div>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                                  event.status === 'worn'
                                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                    : 'bg-[var(--pill-bg)] text-[var(--gold-primary)] border border-[var(--border-gold)]'
                                }`}
                              >
                                {event.status === 'worn' ? 'Worn' : 'Scheduled'}
                              </span>
                            </div>

                            <div>
                              <h4 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                                {event.title}
                              </h4>
                              <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-[var(--gold-primary)]" />
                                <span>{event.venue}</span>
                                <span className="mx-1">•</span>
                                <span>{event.occasion}</span>
                              </p>
                            </div>

                            {/* Outfit summary */}
                            <div className="p-3 rounded-2xl bg-[var(--pill-bg)] border border-[var(--border-card)] space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-[var(--text-heading)]">
                                  {event.outfitId?.title || 'Bespoke Curated Ensemble'}
                                </span>
                                <span className="text-[9px] text-[var(--gold-primary)] font-mono font-bold">
                                  {event.vibe}
                                </span>
                              </div>
                              {pieces.length > 0 && (
                                <div className="flex items-center gap-2 overflow-x-auto py-1">
                                  {pieces.map((p: any, idx: number) => (
                                    <div
                                      key={p.id || idx}
                                      className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-900 border border-[var(--border-card)] shrink-0 flex items-center justify-center"
                                      title={p.name}
                                    >
                                      {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-sm">{p.icon || '👔'}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {event.notes && (
                              <p className="text-[11px] text-[var(--text-muted)] italic">
                                "{event.notes}"
                              </p>
                            )}
                          </div>

                          {/* Footer Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-[var(--border-card)]">
                            {event.status !== 'worn' ? (
                              <button
                                onClick={() => handleMarkEventWorn(event._id)}
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Mark as Worn</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>Recorded in Closet History</span>
                              </span>
                            )}

                            <button
                              onClick={() => handleDeleteCalendarEvent(event._id)}
                              className="text-xs text-[var(--text-muted)] hover:text-rose-500 transition-colors p-1 cursor-pointer"
                              title="Delete Event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Weekly Schedule Overview Row */}
              <div className="space-y-3 pt-4 border-t border-[var(--border-card)]">
                <div className="flex items-center justify-between">
                  <h3 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                    Rolling 7-Day Agenda
                  </h3>
                  <span className="text-[10px] text-[var(--text-muted)]">October 2024 Schedule</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {[
                    { day: '14', name: 'Mon', occasion: "Dinner at L'amore", planned: true, img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80' },
                    { day: '15', name: 'Tue', occasion: 'Office Presentation', planned: true, img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=300&q=80' },
                    { day: '16', name: 'Wed', occasion: 'Client Lunch', planned: false },
                    { day: '17', name: 'Thu', occasion: 'Art Gallery Opening', planned: true, img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=300&q=80' },
                    { day: '18', name: 'Fri', occasion: 'Casual Friday & Drinks', planned: false },
                    { day: '19', name: 'Sat', occasion: 'Rooftop Lounge Party', planned: true, img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80' },
                    { day: '20', name: 'Sun', occasion: 'Weekend Brunch', planned: false },
                  ].map((item) => (
                    <div
                      key={item.day}
                      className="p-3 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] flex flex-col justify-between space-y-2 hover:border-[var(--gold-primary)] transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase font-bold text-[var(--gold-primary)]">{item.name}</span>
                        <span className="font-playfair text-sm font-bold text-[var(--text-heading)]">{item.day} Oct</span>
                      </div>

                      {item.planned ? (
                        <div className="space-y-1.5">
                          <div className="h-28 rounded-xl overflow-hidden bg-neutral-900">
                            <img src={item.img} alt={item.occasion} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[11px] font-bold text-[var(--text-heading)] block line-clamp-1">
                            {item.occasion}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold block">✓ Outfit Planned</span>
                        </div>
                      ) : (
                        <div className="py-8 text-center space-y-1">
                          <span className="text-xs text-[var(--text-muted)] block">No plan yet</span>
                          <button
                            onClick={() => {
                              setActiveTab('stylist');
                              setPlannerStep(1);
                            }}
                            className="text-[10px] text-[var(--gold-primary)] font-bold hover:underline cursor-pointer"
                          >
                            + Add Look
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: OUTFIT IDEAS / LOOKBOOK GALLERY & COMMUNITY FEED */}
          {/* ========================================================================= */}
          {activeTab === 'ideas' && (
            <div className="p-5 lg:p-7 max-w-7xl mx-auto w-full space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[var(--text-heading)]">
                    Haute Lookbook & Community Inspiration
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Curated editorial looks and community-published ensembles for quiet-luxury styling
                  </p>
                </div>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  <span>+ Publish Look to Lookbook</span>
                </button>
              </div>

              {/* Community Ensembles Stream */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-playfair text-lg font-bold text-[var(--text-heading)] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--gold-primary)]" />
                    <span>Curator Community Feed ({communityPosts.length})</span>
                  </h3>
                  <span className="text-[10px] uppercase font-mono font-bold text-[var(--gold-primary)]">
                    Live Community Stream
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {communityPosts.map((post) => {
                    const outfit = post.outfitId;
                    const heroImage =
                      outfit?.pieces?.[0]?.imageUrl ||
                      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80';
                    return (
                      <div
                        key={post._id}
                        className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] overflow-hidden shadow-xs hover:border-[var(--gold-primary)] transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Post Header */}
                          <div className="p-4 flex items-center justify-between border-b border-[var(--border-card)]">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[var(--pill-bg)] border border-[var(--border-gold)] flex items-center justify-center font-bold text-xs text-[var(--gold-primary)]">
                                {post.userId.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-[var(--text-heading)]">
                                  {post.userId.name}
                                </p>
                                <p className="text-[10px] text-[var(--text-muted)]">
                                  {post.createdAt} • {post.venue}
                                </p>
                              </div>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-[var(--pill-bg)] border border-[var(--border-card)] text-[9px] font-mono font-bold text-[var(--gold-primary)] uppercase">
                              {post.occasion}
                            </span>
                          </div>

                          {/* Image Preview */}
                          <div className="h-64 bg-neutral-900 relative overflow-hidden group">
                            <img
                              src={heroImage}
                              alt={post.caption}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {outfit?.title && (
                              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white">
                                <p className="font-playfair text-base font-bold">
                                  {outfit.title}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Post Content */}
                          <div className="p-4 space-y-3">
                            <p className="text-xs text-[var(--text-heading)] leading-relaxed italic">
                              "{post.caption}"
                            </p>

                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {post.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded-md bg-[var(--pill-bg)] text-[10px] font-medium text-[var(--text-muted)]"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Post Footer Actions */}
                        <div className="p-4 pt-2 border-t border-[var(--border-card)] flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleToggleCommunityLike(post._id)}
                              className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer group"
                            >
                              <Heart
                                className={`w-4 h-4 transition-colors ${
                                  post.isLiked
                                    ? 'fill-rose-500 text-rose-500'
                                    : 'text-[var(--text-muted)] group-hover:text-rose-500'
                                }`}
                              />
                              <span className={post.isLiked ? 'text-rose-500 font-bold' : 'text-[var(--text-muted)]'}>
                                {post.likesCount}
                              </span>
                            </button>

                            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                              <MessageSquare className="w-4 h-4" />
                              <span>{post.commentsCount}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setActiveTab('stylist');
                              setPlannerStep(3);
                              if (outfit?.title) setCurrentOutfitTitle(outfit.title);
                              toast.success("Ensemble loaded into Stylist canvas!");
                            }}
                            className="px-3.5 py-1.5 rounded-full border border-[var(--border-gold)] bg-[var(--pill-bg)] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                            <span>Recreate Look</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* House Editorial Archives */}
              <div className="space-y-4 pt-6 border-t border-[var(--border-card)]">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-[var(--text-heading)]">
                    House Editorial Archives
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Signature seasonal lookbook compositions crafted for world capital destinations
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'The Milanese Tailored Linen',
                      tag: 'Summer Sartorial',
                      img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
                      desc: 'Breathable oatmeal linen trousers paired with open camp collar shirt and hand-finished loafers.',
                    },
                    {
                      title: 'The Parisian Monochrome',
                      tag: 'Minimalist Date',
                      img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
                      desc: 'All-black high-neck cashmere sweater with sharp wool trousers and understated Chelsea boots.',
                    },
                    {
                      title: 'The Riviera Seaside Resort',
                      tag: 'Effortless Vacation',
                      img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80',
                      desc: 'Crisp sand linen overshirt with white Gurkha shorts, tortoise sunglasses, and clean canvas low-tops.',
                    },
                  ].map((idea, i) => (
                    <div
                      key={i}
                      className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] overflow-hidden shadow-xs hover:shadow-md transition-all group"
                    >
                      <div className="h-64 bg-neutral-900 relative overflow-hidden">
                        <img
                          src={idea.img}
                          alt={idea.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 text-white text-[10px] font-mono uppercase backdrop-blur-md">
                          {idea.tag}
                        </span>
                      </div>
                      <div className="p-5 space-y-3">
                        <h4 className="font-playfair text-lg font-bold text-[var(--text-heading)]">
                          {idea.title}
                        </h4>
                        <p className="text-xs text-[var(--text-body)] leading-relaxed">
                          {idea.desc}
                        </p>
                        <button
                          onClick={() => {
                            setActiveTab('stylist');
                            setPlannerStep(3);
                            setCurrentOutfitTitle(idea.title);
                            toast.success("Loaded editorial template into canvas!");
                          }}
                          className="w-full py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--pill-bg)] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                          <span>Recreate with My Closet</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: SAVED LOOKS & FAVORITES */}
          {/* ========================================================================= */}
          {activeTab === 'saved' && (
            <div className="p-5 lg:p-7 max-w-7xl mx-auto w-full space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[var(--text-heading)]">
                    Saved Looks & Favorites
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {savedLooks.length} curated ensembles bookmarked for fast instant reuse
                  </p>
                </div>
              </div>

              {savedLooks.length === 0 ? (
                <EmptyState
                  icon={<Bookmark className="w-8 h-8 text-[var(--gold-primary)]" />}
                  title="No saved looks yet"
                  description="When you synthesize or customize an ensemble in the AI Stylist, tap 'Save to Favorites' to bookmark it here for fast instant reuse."
                  actionLabel="Synthesize an Outfit"
                  onAction={() => {
                    setActiveTab('stylist');
                    setPlannerStep(1);
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {savedLooks.map((look) => (
                    <div
                      key={look.id}
                      className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Piece preview banner */}
                        <div className="h-48 bg-neutral-900 relative grid grid-cols-2 gap-0.5 p-0.5 overflow-hidden">
                          {look.pieces.slice(0, 4).map((p, idx) => (
                            <div key={idx} className="h-full bg-neutral-800 flex items-center justify-center overflow-hidden">
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-2xl">{p.icon}</span>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              removeSavedLook(look.id);
                              toast.info("Look removed from favorites");
                            }}
                            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Remove from saved"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-mono font-bold text-[var(--gold-primary)]">
                            {look.harmonyScore}% Harmony
                          </span>
                        </div>

                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-mono text-[var(--gold-primary)] font-bold">
                              {look.occasion}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)]">
                              {look.createdAt ? new Date(look.createdAt).toLocaleDateString() : 'Curated Look'}
                            </span>
                          </div>
                          <h4 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                            {look.title}
                          </h4>
                          <p className="text-xs text-[var(--text-body)] line-clamp-2">
                            {look.pieces.map(p => p.name).join(' • ')}
                          </p>
                          <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5 pt-1">
                            <MapPin className="w-3 h-3 text-[var(--gold-primary)] shrink-0" />
                            <span className="truncate">{look.venue}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0 space-y-2">
                        <button
                          onClick={() => {
                            markOutfitWorn(look.id);
                            toast.success("Look recorded as worn! Item wear counts updated.");
                          }}
                          className="w-full py-2 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:scale-[1.02] transition-transform"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Wear This Look</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('stylist');
                            setPlannerStep(3);
                            setCurrentOutfitTitle(look.title);
                          }}
                          className="w-full py-2 rounded-xl border border-[var(--border-card)] bg-[var(--pill-bg)] text-[var(--text-heading)] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[var(--border-card)] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect in Stylist</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: VIRTUAL TRY-ON STUDIO (Polished & Honest) */}
          {/* ========================================================================= */}
          {/* TAB 8: HAUTE COUTURE PHOTOREALISTIC VIRTUAL TRY-ON STUDIO */}
          {/* ========================================================================= */}
          {activeTab === 'tryon' && (
            <PhotorealisticTryOnStudio />
          )}

          </StudioErrorBoundary>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MOBILE PERSISTENT NAVIGATION (<768px) */}
      {/* ========================================================================= */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        closetCount={closet.length}
        savedCount={likedLooks.length}
      />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-[var(--bg-card)] rounded-t-3xl border-t border-[var(--border-card)] p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-card)]">
              <span className="font-playfair text-base font-bold text-[var(--text-heading)]">More Navigation</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1">
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setActiveTab('destinations');
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl border border-[var(--border-card)] text-left flex items-center gap-2 font-semibold"
              >
                <Compass className="w-4 h-4 text-[var(--gold-primary)]" />
                <span>Destinations</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('calendar');
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl border border-[var(--border-card)] text-left flex items-center gap-2 font-semibold"
              >
                <Calendar className="w-4 h-4 text-[var(--gold-primary)]" />
                <span>Calendar</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('ideas');
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl border border-[var(--border-card)] text-left flex items-center gap-2 font-semibold"
              >
                <Shirt className="w-4 h-4 text-[var(--gold-primary)]" />
                <span>Outfit Ideas</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('tryon');
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl border border-[var(--border-card)] text-left flex items-center gap-2 font-semibold"
              >
                <Camera className="w-4 h-4 text-[var(--gold-primary)]" />
                <span>AI Virtual Try-On (VTON)</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="p-3 rounded-xl border border-[var(--border-card)] text-left flex items-center gap-2 font-semibold"
              >
                <Settings className="w-4 h-4 text-[var(--gold-primary)]" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="p-3 rounded-xl border border-[var(--border-card)] text-left flex items-center gap-2 font-semibold"
              >
                <User className="w-4 h-4 text-[var(--gold-primary)]" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onLogout) onLogout();
                  else if (onBackToLanding) onBackToLanding();
                }}
                className="p-3 rounded-xl border border-rose-300 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-left flex items-center gap-2 font-semibold col-span-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Atelier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Details Inspection Modal */}
      {selectedClosetItem && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedClosetItem(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-[var(--bg-card)] border border-[var(--border-gold)] p-6 space-y-4 shadow-2xl text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold text-[var(--gold-primary)]">
                Garment Inspection
              </span>
              <button onClick={() => setSelectedClosetItem(null)} className="p-1">
                <X className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="h-64 rounded-2xl bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex items-center justify-center text-4xl p-2 border border-[var(--border-card)]">
              {selectedClosetItem.imageUrl ? (
                <img src={selectedClosetItem.imageUrl} alt={selectedClosetItem.name} className="w-full h-full object-contain" />
              ) : (
                <span>{selectedClosetItem.icon}</span>
              )}
            </div>

            <div>
              <h4 className="font-playfair text-lg font-bold text-[var(--text-heading)]">
                {selectedClosetItem.name}
              </h4>
              <p className="text-[11px] text-[var(--gold-primary)] font-mono font-semibold">
                {selectedClosetItem.brand} • {selectedClosetItem.subType}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-[var(--pill-bg)]">
                <span className="text-[var(--text-muted)] block text-[10px]">Color</span>
                <strong className="text-[var(--text-heading)]">{selectedClosetItem.color}</strong>
              </div>
              <div className="p-2 rounded-xl bg-[var(--pill-bg)]">
                <span className="text-[var(--text-muted)] block text-[10px]">Fit</span>
                <strong className="text-[var(--text-heading)]">{selectedClosetItem.fit}</strong>
              </div>
              <div className="p-2 rounded-xl bg-[var(--pill-bg)]">
                <span className="text-[var(--text-muted)] block text-[10px]">Category</span>
                <strong className="text-[var(--text-heading)] capitalize">{selectedClosetItem.category}</strong>
              </div>
              <div className="p-2 rounded-xl bg-[var(--pill-bg)]">
                <span className="text-[var(--text-muted)] block text-[10px]">Formality</span>
                <strong className="text-[var(--text-heading)]">Tier {selectedClosetItem.formality} / 5</strong>
              </div>
              <div className="p-2 rounded-xl bg-[var(--pill-bg)]">
                <span className="text-[var(--text-muted)] block text-[10px]">Times Worn</span>
                <strong className="text-[var(--text-heading)]">{selectedClosetItem.timesWorn || 0} times</strong>
              </div>
              <div className="p-2 rounded-xl bg-[var(--pill-bg)]">
                <span className="text-[var(--text-muted)] block text-[10px]">Cost Per Wear</span>
                <strong className="text-[var(--gold-primary)] font-mono">
                  ${(
                    (selectedClosetItem.cost || 150) /
                    Math.max(1, selectedClosetItem.timesWorn || 1)
                  ).toFixed(2)}
                </strong>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setItemToDelete(selectedClosetItem);
                  setSelectedClosetItem(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-rose-300 text-rose-600 dark:text-rose-400 font-semibold flex items-center justify-center gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Piece</span>
              </button>

              <button
                onClick={() => setSelectedClosetItem(null)}
                className="px-4 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Dialog */}
      {itemToDelete && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
          onClick={() => setItemToDelete(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-[var(--bg-card)] border border-rose-200 p-6 space-y-4 shadow-2xl text-xs text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-playfair text-lg font-bold text-[var(--text-heading)]">
                Remove from Closet?
              </h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Are you sure you want to remove <strong>"{itemToDelete.name}"</strong>? It will no longer be considered during outfit generation.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--border-card)] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteClosetItem(itemToDelete.id);
                  setItemToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 cursor-pointer shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Notifications Popover */}
      <NotificationPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Global Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSignOut={() => {
          setIsSettingsOpen(false);
          if (onLogout) onLogout();
          else if (onBackToLanding) onBackToLanding();
        }}
      />

      {/* Global Help & Support Modal */}
      {isHelpOpen && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsHelpOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] p-6 space-y-4 shadow-2xl text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-card)]">
              <h4 className="font-playfair text-base font-bold text-[var(--text-heading)] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[var(--gold-primary)]" />
                <span>OTD Concierge & Help</span>
              </h4>
              <button onClick={() => setIsHelpOpen(false)} className="p-1">
                <X className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
            </div>
            <p className="text-[11px] text-[var(--text-body)] leading-relaxed">
              OTD (Outfit of the Day) is your intelligent personal fashion companion. Need styling advice, wardrobe digitization assistance, or want to report an issue?
            </p>
            <div className="p-3 rounded-2xl bg-[var(--pill-bg)] space-y-1.5">
              <p className="font-bold text-[var(--text-heading)]">VIP Styling Concierge</p>
              <p className="text-[11px] text-[var(--text-muted)]">concierge@outfitoftheday.ai</p>
              <p className="text-[10px] text-emerald-600 font-medium">Response within 2 hours • 24/7 coverage</p>
            </div>
            <button
              onClick={() => setIsHelpOpen(false)}
              className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Schedule Look on Calendar Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onScheduled={(event) => {
          setCalendarEvents((prev) => [event, ...prev]);
          toast.success("Look successfully scheduled on your calendar!");
        }}
      />

      {/* Publish Outfit to Community Lookbook Modal */}
      <ShareOutfitModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShared={(post) => {
          setCommunityPosts((prev) => [post, ...prev]);
          toast.success("Ensemble published to Community Lookbook!");
        }}
      />

    </div>
  );
};
