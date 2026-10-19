import React, { useState } from 'react';
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
  MoreHorizontal
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCloset, type ClosetItem } from '../context/ClosetContext';
import { NotificationPopover } from './ui/NotificationPopover';
import { SettingsModal } from './ui/SettingsModal';
import { MobileBottomNav } from './ui/MobileBottomNav';

interface AppStudioProps {
  onOpenAddPiece: () => void;
  onOpenProfile: () => void;
  onBackToLanding?: () => void;
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
}) => {
  const { theme, toggleTheme } = useTheme();
  const { closet, profile, deleteClosetItem } = useCloset();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<StudioTab>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedClosetItem, setSelectedClosetItem] = useState<ClosetItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ClosetItem | null>(null);

  // Home search bar
  const [homeSearchQuery, setHomeSearchQuery] = useState('');

  // Favorites / Saved Looks state
  const [likedLooks, setLikedLooks] = useState<string[]>(['smart-casual-1', 'date-night-1']);
  const [savedLooksList, setSavedLooksList] = useState([
    {
      id: 'smart-casual-1',
      title: 'Smart Casual',
      subtitle: "For Today's Weather",
      occasion: 'Casual Evening',
      venue: 'Olive Bistro',
      weather: '28°C Breezy',
      img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80',
      piecesSummary: 'Linen Camp Shirt, Gurkha Chinos, Belgian Loafers',
      date: 'Saved Oct 16',
    },
    {
      id: 'date-night-1',
      title: 'Date Night',
      subtitle: 'Classy & Effortless',
      occasion: 'Date Night',
      venue: "L'amore, Banjara Hills",
      weather: '27°C Partly Cloudy',
      img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=500&q=80',
      piecesSummary: 'Silk-Cashmere Knit, Flannel Pleated Trousers, Suede Loafers',
      date: 'Saved Oct 17',
    },
    {
      id: 'office-ready-1',
      title: 'Office Ready',
      subtitle: 'Clean & Polished',
      occasion: 'Executive Presentation',
      venue: 'Executive Boardroom',
      weather: '24°C Climate Controlled',
      img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=500&q=80',
      piecesSummary: 'Sea Island Cotton Shirt, Navy Hopsack Blazer, Oxford Shoes',
      date: 'Saved Oct 18',
    },
  ]);

  // Plan Your Look Wizard State (Screenshots 1 & 2)
  const [plannerStep, setPlannerStep] = useState<1 | 2 | 3>(1);
  const [selectedOccasion, setSelectedOccasion] = useState('Date');
  const [selectedVenue, setSelectedVenue] = useState<Venue>(CURATED_VENUES[0]);
  const [destinationSearch, setDestinationSearch] = useState("L'amore, Banjara Hills, Hyderabad");
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
  const [currentOutfitMatch] = useState(98);
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

  // Toggle favorite
  const toggleLike = (id: string) => {
    setLikedLooks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSendChat = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg = { sender: 'user' as const, text, time: 'Just now' };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput('');

    // Responsive intelligent reply
    setTimeout(() => {
      let reply = "I've recalibrated your silhouette. Swapped in lighter layers and adjusted footwear to balance comfort with the restaurant's dress code.";
      const lower = text.toLowerCase();
      if (lower.includes('casual')) {
        reply = "Adapted for elevated casual ease: Swapped formal leather shoes for clean minimalist sneakers and rolled back blazer structure.";
      } else if (lower.includes('shoes') || lower.includes('boot')) {
        reply = "Substituted footwear for glazed Chelsea boots to anchor the lower silhouette with confident posture.";
      } else if (lower.includes('jeans')) {
        reply = "Replaced denim with charcoal forward-pleat trousers for sharpened sartorial harmony.";
      }
      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: reply, time: 'Just now' },
      ]);
    }, 600);
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
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-body)] flex flex-col font-sans transition-colors duration-300">
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
                { id: 'tryon', label: 'Virtual Try-On', icon: Camera },
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

              {/* User Avatar & Name Dropdown */}
              <div
                onClick={onOpenProfile}
                className="flex items-center gap-2.5 pl-2 border-l border-[var(--border-card)] cursor-pointer group"
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt={profile.name || 'Mustafa Ali'}
                  className="w-8 h-8 rounded-full object-cover border border-[var(--border-gold)] group-hover:scale-105 transition-transform"
                />
                <span className="text-xs font-semibold hidden sm:inline text-[var(--text-heading)]">
                  {profile.name === 'Curator' ? 'Mustafa Ali' : profile.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-heading)] transition-colors" />
              </div>
            </div>
          </header>

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
                          Hey {profile.name === 'Curator' ? 'Mustafa' : profile.name},
                        </h2>
                        <p className="text-sm sm:text-base text-neutral-300 font-light mt-0.5">
                          What should we style today?
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
                          title: 'Virtual Try-On',
                          subtitle: 'See it on your avatar',
                          icon: Camera,
                          img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
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
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                      <MapPin className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                      <span className="font-medium">Hyderabad, India</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3">
                        <Sun className="w-8 h-8 text-amber-500 shrink-0" />
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-playfair text-2xl font-bold text-[var(--text-heading)]">
                              32°C
                            </span>
                            <span className="text-xs text-[var(--text-muted)]">Sunny</span>
                          </div>
                          <span className="text-[11px] text-[var(--text-muted)]">
                            Feels like 34°C
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
                      <span>Perfect weather for a light, breathable outfit.</span>
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
                            onClick={() => setDestinationSearch('')}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                          >
                            <X className="w-4 h-4" />
                          </button>
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
                        <h4 className="font-playfair text-sm font-bold text-[var(--text-heading)]">
                          4. Weather <span className="text-[10px] text-[var(--gold-primary)] font-mono font-bold uppercase">(Auto-detected)</span>
                        </h4>
                        <div className="flex items-center gap-3">
                          <CloudSun className="w-8 h-8 text-amber-500 shrink-0" />
                          <div className="text-xs">
                            <span className="font-bold text-sm text-[var(--text-heading)]">28°C Partly Cloudy</span>
                            <p className="text-[11px] text-[var(--text-muted)]">Hyderabad, India • Feels like 29°C</p>
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
                              onClick={() => setSelectedWeatherCond(w.name)}
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
                        onClick={() => setPlannerStep(3)}
                        className="px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>Next: Get Outfit Suggestions</span>
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
                          <span className="font-bold text-sm text-[var(--text-heading)]">28°C Partly Cloudy</span>
                          <p className="text-[10px] text-[var(--text-muted)]">Hyderabad, India • Humidity 56%</p>
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
                            Curated Ensemble • {selectedOccasion}
                          </span>
                          <h3 className="font-playfair text-2xl font-bold text-[var(--text-heading)]">
                            {currentOutfitTitle}
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-emerald-600 block">
                            {currentOutfitMatch}% Harmony Score
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)]">
                            Calibrated to your Style DNA
                          </span>
                        </div>
                      </div>

                      {/* Garments Visual Composition */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {closet.slice(0, 4).map((piece) => (
                          <div
                            key={piece.id}
                            className="rounded-2xl border border-[var(--border-card)] bg-[var(--pill-bg)]/50 p-2.5 flex flex-col justify-between"
                          >
                            <div className="h-28 rounded-xl bg-neutral-900 overflow-hidden mb-2 flex items-center justify-center text-3xl">
                              {piece.imageUrl ? (
                                <img src={piece.imageUrl} alt={piece.name} className="w-full h-full object-cover" />
                              ) : (
                                <span>{piece.icon}</span>
                              )}
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-mono font-bold text-[var(--gold-primary)] block">
                                {piece.category}
                              </span>
                              <h5 className="font-semibold text-xs text-[var(--text-heading)] truncate">
                                {piece.name}
                              </h5>
                              <p className="text-[10px] text-[var(--text-muted)] truncate">
                                {piece.brand} • {piece.color}
                              </p>
                            </div>
                          </div>
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
                            <span><strong>Venue Alignment:</strong> Styled for {selectedVenue.name}'s {selectedVenue.ambience} setting and {selectedVenue.dressCode} dress code.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span><strong>Climate Comfort:</strong> Optimized for {selectedWeatherCond} weather ({selectedPreferences.join(', ')}).</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span><strong>Chromatic Harmony:</strong> High-contrast neutral pairing complementing your calibrated skin undertone and fit.</span>
                          </li>
                        </ul>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        <button
                          onClick={() => {
                            if (!likedLooks.includes('active-current')) {
                              setLikedLooks([...likedLooks, 'active-current']);
                            }
                          }}
                          className="px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                          <span>Save to Favorites</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('calendar');
                          }}
                          className="px-5 py-2.5 rounded-full border border-[var(--border-card)] text-xs font-semibold hover:bg-[var(--pill-bg)] transition-colors cursor-pointer flex items-center gap-1.5"
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
                    { id: 'tops', label: `Tops (${closet.filter((i) => i.category === 'tops').length})` },
                    { id: 'bottoms', label: `Bottoms (${closet.filter((i) => i.category === 'bottoms').length})` },
                    { id: 'outerwear', label: `Outerwear (${closet.filter((i) => i.category === 'outerwear').length})` },
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
                <div className="py-16 text-center rounded-3xl border border-dashed border-[var(--border-card)] p-8 space-y-3 bg-[var(--pill-bg)]/30">
                  <Shirt className="w-10 h-10 mx-auto text-[var(--text-muted)]" />
                  <h4 className="font-playfair text-lg font-bold text-[var(--text-heading)]">
                    No garments found
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                    No clothing items match your search or category filters. Try resetting filters or upload a new garment.
                  </p>
                  <button
                    onClick={onOpenAddPiece}
                    className="px-5 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold cursor-pointer"
                  >
                    + Upload New Piece
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredClosetItems.map((piece) => (
                    <div
                      key={piece.id}
                      onClick={() => setSelectedClosetItem(piece)}
                      className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] overflow-hidden flex flex-col group shadow-xs hover:shadow-md hover:border-[var(--gold-primary)] transition-all cursor-pointer"
                    >
                      <div className="h-44 bg-neutral-900 relative overflow-hidden flex items-center justify-center p-2">
                        {piece.imageUrl ? (
                          <img
                            src={piece.imageUrl}
                            alt={piece.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full rounded-xl bg-neutral-800 flex flex-col items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300">
                            <span>{piece.icon}</span>
                          </div>
                        )}
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-mono backdrop-blur-md uppercase">
                          {piece.category}
                        </span>
                      </div>
                      <div className="p-3 space-y-1">
                        <h5 className="text-xs font-bold text-[var(--text-heading)] truncate">
                          {piece.name}
                        </h5>
                        <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                          <span>{piece.color}</span>
                          <span>{piece.fit}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-[var(--gold-primary)] font-mono font-semibold truncate">
                            {piece.brand}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[var(--pill-bg)] text-[var(--text-muted)] border border-[var(--border-card)]">
                            Tier {piece.formality}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[var(--text-heading)]">
                    Outfit Calendar & Planner
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Pre-plan ensembles for upcoming events and track worn looks to avoid social duplicates
                  </p>
                </div>
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

              {/* Weekly Schedule Row */}
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
          )}

          {/* ========================================================================= */}
          {/* TAB 6: OUTFIT IDEAS / LOOKBOOK GALLERY (Eliminating Dead Screen) */}
          {/* ========================================================================= */}
          {activeTab === 'ideas' && (
            <div className="p-5 lg:p-7 max-w-7xl mx-auto w-full space-y-6">
              <div>
                <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[var(--text-heading)]">
                  Haute Lookbook & Outfit Ideas
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Curated editorial looks crafted for international destinations and quiet-luxury styling
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
          )}

          {/* ========================================================================= */}
          {/* TAB 7: SAVED LOOKS & FAVORITES (Eliminating Dead Screen) */}
          {/* ========================================================================= */}
          {activeTab === 'saved' && (
            <div className="p-5 lg:p-7 max-w-7xl mx-auto w-full space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[var(--text-heading)]">
                    Saved Looks & Favorites
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {savedLooksList.length} curated ensembles bookmarked for fast instant reuse
                  </p>
                </div>
              </div>

              {savedLooksList.length === 0 ? (
                <div className="py-16 text-center rounded-3xl border border-dashed border-[var(--border-card)] p-8 space-y-3 bg-[var(--pill-bg)]/30">
                  <Bookmark className="w-10 h-10 mx-auto text-[var(--text-muted)]" />
                  <h4 className="font-playfair text-lg font-bold text-[var(--text-heading)]">
                    No saved looks yet
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                    When you find an outfit you love in the AI Stylist or Lookbook, tap the heart icon to save it here.
                  </p>
                  <button
                    onClick={() => setActiveTab('stylist')}
                    className="px-5 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold cursor-pointer"
                  >
                    Go to AI Stylist
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {savedLooksList.map((look) => (
                    <div
                      key={look.id}
                      className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-52 bg-neutral-900 relative">
                          <img src={look.img} alt={look.title} className="w-full h-full object-cover" />
                          <button
                            onClick={() => {
                              setSavedLooksList(savedLooksList.filter((l) => l.id !== look.id));
                            }}
                            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Remove from saved"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-mono text-[var(--gold-primary)] font-bold">
                              {look.occasion}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)]">{look.date}</span>
                          </div>
                          <h4 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                            {look.title}
                          </h4>
                          <p className="text-xs text-[var(--text-body)] line-clamp-2">
                            {look.piecesSummary}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <button
                          onClick={() => {
                            setActiveTab('stylist');
                            setPlannerStep(3);
                            setCurrentOutfitTitle(look.title);
                          }}
                          className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Wear / View Look</span>
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
          {activeTab === 'tryon' && (
            <div className="p-5 lg:p-7 max-w-4xl mx-auto w-full text-center space-y-6">
              <div>
                <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[var(--text-heading)]">
                  Virtual Try-On Studio
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Drape your active digital wardrobe onto your calibrated 3D Style Avatar
                </p>
              </div>

              <div className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-xl max-w-md mx-auto space-y-4">
                <div className="h-96 rounded-2xl overflow-hidden relative border border-[var(--border-card)] shadow-inner bg-neutral-900">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                    alt="Avatar Try-On"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-4 text-white text-left">
                    <p className="font-playfair text-base sm:text-lg font-bold">
                      {profile.name === 'Curator' ? 'Mustafa Ali' : profile.name} ({profile.height || '178 cm'} • {profile.bodyShape || 'Athletic'})
                    </p>
                    <p className="text-xs text-amber-300 font-mono">Draped: {currentOutfitTitle} (Size M)</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[var(--pill-bg)] text-xs text-[var(--text-muted)] leading-relaxed">
                  <strong>Notice:</strong> High-latency 3D mesh rendering is scheduled for Phase 2. Your Style Avatar biometrics are calibrated and ready.
                </div>

                <button
                  onClick={onOpenProfile}
                  className="px-6 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-2 cursor-pointer mx-auto shadow-md"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Calibrate Style Avatar Biometrics</span>
                </button>
              </div>
            </div>
          )}

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
                <span>Virtual Try-On</span>
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

            <div className="h-48 rounded-2xl bg-neutral-900 overflow-hidden flex items-center justify-center text-4xl">
              {selectedClosetItem.imageUrl ? (
                <img src={selectedClosetItem.imageUrl} alt={selectedClosetItem.name} className="w-full h-full object-cover" />
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
          if (onBackToLanding) onBackToLanding();
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

    </div>
  );
};
