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
  Heart,
  ArrowRight,
  Send,
  Plus,
  Sliders,
  Check,
  X,
  MapPin,
  Clock,
  ArrowLeft,
  Camera,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCloset, type ClosetItem } from '../context/ClosetContext';

interface AppStudioProps {
  onOpenAddPiece: () => void;
  onOpenProfile: () => void;
  onBackToLanding?: () => void;
}

export const AppStudio: React.FC<AppStudioProps> = ({
  onOpenAddPiece,
  onOpenProfile,
  onBackToLanding,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { closet } = useCloset();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    'home' | 'closet' | 'stylist' | 'ideas' | 'tryon' | 'destinations' | 'calendar' | 'saved'
  >('home');

  // Plan Your Look Wizard State
  const [plannerStep, setPlannerStep] = useState<1 | 2 | 3>(1);
  const [selectedOccasion, setSelectedOccasion] = useState('Date');
  const [destinationSearch, setDestinationSearch] = useState("L'amore, Banjara Hills, Hyderabad");
  const [selectedVenueCategory, setSelectedVenueCategory] = useState('Restaurant');
  const [selectedDate] = useState('Mon, 14 Oct 2024');
  const [selectedTime] = useState('8:00 PM');
  const [venueInfoTab, setVenueInfoTab] = useState<'about' | 'ambience' | 'dress_code' | 'photos'>('about');

  // Step 2 State
  const [selectedMood, setSelectedMood] = useState('Confident');
  const [selectedWeatherCond, setSelectedWeatherCond] = useState('Partly Cloudy');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(['Light & Breezy']);

  // Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'user',
      text: "I'm going to L'amore tonight for a date. Suggest an outfit from my wardrobe.",
      time: '8:02 PM',
    },
    {
      sender: 'ai',
      text: "Here are some outfit options for L'amore based on the ambience, weather (28°C Partly Cloudy) and your style. Would you like to see more options or try a different vibe?",
      time: '8:03 PM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [likedLooks, setLikedLooks] = useState<string[]>(['look-1']);

  // Selected Active Recommendation for Step 3
  const [currentOutfitTitle, setCurrentOutfitTitle] = useState('The Parisian Minimalist');
  const [currentOutfitMatch, setCurrentOutfitMatch] = useState(98);
  const [activeTweak, setActiveTweak] = useState<string | null>(null);

  // Toggle favorite look
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

    // Generate intelligent stylist response
    setTimeout(() => {
      let aiResponse = "I've refreshed your look with those adjustments!";
      const lower = text.toLowerCase();
      if (lower.includes('casual')) {
        aiResponse = "Swapped the formal trousers for slim-tapered selvedge denim and unbuttoned the camp collar shirt for a relaxed, effortless date night vibe.";
        setCurrentOutfitTitle('Relaxed Parisian Smart Casual');
        setCurrentOutfitMatch(99);
        setActiveTweak('More Casual');
      } else if (lower.includes('shoes')) {
        aiResponse = "Replaced minimalist leather sneakers with handcrafted Italian Chelsea boots in suede mocha to elevate the sophistication.";
        setCurrentOutfitTitle('Contemporary Chic with Suede Boots');
        setActiveTweak('Shoes Updated');
      } else if (lower.includes('jeans')) {
        aiResponse = "Removed denim completely and paired with Italian pleated linen-blend trousers in warm sand.";
        setActiveTweak('Pleated Trousers (No Jeans)');
      } else if (lower.includes('attractive')) {
        aiResponse = "Added subtle layering with an open silk-knit overshirt, rolled cuffs, and minimalist silver accessory accent.";
        setCurrentOutfitTitle('Haute Romantic Night Edition');
        setActiveTweak('High Attraction Silhouette');
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai' as const,
          text: aiResponse,
          time: 'Just now',
        },
      ]);
    }, 600);
  };

  // Vibe Options (Screenshot 1)
  const vibes = [
    {
      id: 'daily',
      name: 'Daily Wear',
      img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'office',
      name: 'Office',
      img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'date',
      name: 'Date Night',
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'travel',
      name: 'Travel',
      img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'party',
      name: 'Party',
      img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'custom',
      name: 'Custom',
      isCustom: true,
    },
  ];

  // AI Outfit Suggestions (Screenshot 1 & 2)
  const suggestions = [
    {
      id: 'look-1',
      title: 'Smart Casual',
      description: 'Perfect for a relaxed dinner. Stylish yet comfortable.',
      match: 98,
      items: [
        { name: 'Black Camp Collar Shirt', cat: 'Tops', color: '#111111' },
        { name: 'Pleated Cream Trousers', cat: 'Bottoms', color: '#E8E1D5' },
        { name: 'Clean Minimalist Sneakers', cat: 'Shoes', color: '#FFFFFF' },
        { name: 'Minimalist Chrono Watch', cat: 'Accessories', color: '#2B2B2B' },
        { name: 'Leather Crossbody Bag', cat: 'Accessories', color: '#1A1A1A' },
      ],
      img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'look-2',
      title: 'Modern Minimal',
      description: 'Clean, versatile and always in style.',
      match: 95,
      items: [
        { name: 'Earthy Suede Overshirt', cat: 'Outerwear', color: '#8B5A2B' },
        { name: 'Heavyweight Pima Tee', cat: 'Tops', color: '#FFFFFF' },
        { name: 'Tailored Jet Black Slacks', cat: 'Bottoms', color: '#151515' },
        { name: 'Low Top Calfskin Sneakers', cat: 'Shoes', color: '#FAFAFA' },
      ],
      img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'look-3',
      title: 'Classic Elegance',
      description: 'Timeless look for upscale venues.',
      match: 92,
      items: [
        { name: 'Unstructured Wool Blazer', cat: 'Outerwear', color: '#1A1A1A' },
        { name: 'Crisp Poplin White Shirt', cat: 'Tops', color: '#FFFFFF' },
        { name: 'Midnight Slim Trousers', cat: 'Bottoms', color: '#181818' },
        { name: 'Derby Leather Shoes', cat: 'Shoes', color: '#0A0A0A' },
      ],
      img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'look-4',
      title: 'Effortless Daily',
      description: 'Comfortable and stylish for everyday.',
      match: 90,
      items: [
        { name: 'Sand Washed Crewneck', cat: 'Tops', color: '#D6C7B2' },
        { name: 'Tapered Selvedge Denim', cat: 'Bottoms', color: '#202022' },
        { name: 'Canvas Vintage Trainers', cat: 'Shoes', color: '#FFFFFF' },
        { name: 'Acetate Sunglasses', cat: 'Accessories', color: '#111111' },
      ],
      img: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-body)] flex flex-col antialiased transition-colors duration-300">
      
      {/* Top Banner Notice to return to Landing Page */}
      {onBackToLanding && (
        <div className="bg-black text-[#F7EFE0] px-4 py-2 text-xs flex items-center justify-between font-mono tracking-wider border-b border-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OTD ATELIER STUDIO • LIVE CLOSET ENGINE & AI STYLIST ACTIVE</span>
          </div>
          <button
            onClick={onBackToLanding}
            className="hover:text-amber-300 underline transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Landing Page</span>
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR NAVIGATION (Matching Screenshots 1, 2, 3) */}
        {/* ========================================================================= */}
        <aside className="w-64 border-r border-[var(--border-card)] bg-[var(--bg-card)] shrink-0 hidden md:flex flex-col justify-between py-6 px-4">
          <div className="space-y-6">
            
            {/* Brand Logo matching Official Artwork */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-12 rounded-lg bg-[#F7EFE0] p-1 border border-[#D5C29D] shadow-sm flex items-center justify-center">
                <img
                  src="/otd_logo.png"
                  alt="OTD Logo"
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

            {/* Navigation Menu */}
            <nav className="space-y-1">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'closet', label: 'My Closet', icon: Shirt, badge: closet.length },
                { id: 'stylist', label: 'AI Stylist', icon: Sparkles, highlight: true },
                { id: 'ideas', label: 'Outfit Ideas', icon: Shirt },
                { id: 'tryon', label: 'Virtual Try-On', icon: Camera },
                { id: 'destinations', label: 'Destinations', icon: Compass },
                { id: 'calendar', label: 'Calendar', icon: Calendar },
                { id: 'saved', label: 'Saved Looks', icon: Bookmark, badge: likedLooks.length },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      if (item.id === 'stylist') setPlannerStep(1);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[var(--pill-bg)] text-[var(--text-heading)] font-semibold shadow-sm border border-[var(--border-gold)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--pill-bg)]/50'
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
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] font-mono font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar Utility Links */}
          <div className="space-y-1 pt-6 border-t border-[var(--border-card)]">
            <button
              onClick={onOpenProfile}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--pill-bg)]/50 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>
            <button
              onClick={() => alert('Settings calibrated: notifications on, metric units (cm/kg).')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--pill-bg)]/50 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => alert('OTD Support: Concierge style assistance available 24/7.')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--pill-bg)]/50 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help & Support</span>
            </button>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* MAIN STUDIO VIEWPORT */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* Top Header Bar matching Screenshot 1 */}
          <header className="h-18 px-6 border-b border-[var(--border-card)] bg-[var(--bg-header)] backdrop-blur-md flex items-center justify-between gap-4 sticky top-0 z-30">
            {/* Global Query / Stylist Search Bar */}
            <div className="flex-1 max-w-2xl relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder='Ask OTD anything... (e.g. "What should I wear to a dinner date tonight?")'
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendChat();
                    setActiveTab('stylist');
                    setPlannerStep(3);
                  }
                }}
                className="w-full pl-10 pr-12 py-2.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] text-xs placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold-primary)] transition-colors"
              />
              <button
                onClick={() => {
                  handleSendChat();
                  setActiveTab('stylist');
                  setPlannerStep(3);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right Tools: Theme Switcher, Notifications & User Avatar */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                title="Toggle Theme"
                className="p-2 rounded-full border border-[var(--border-card)] hover:border-[var(--gold-primary)] bg-[var(--bg-card)] transition-colors cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#F7E7A9]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#A67C1E]" />
                )}
              </button>

              <button
                onClick={() => alert('No new notifications. Your Hyderabad date night weather is updated.')}
                className="p-2 rounded-full border border-[var(--border-card)] hover:border-[var(--gold-primary)] bg-[var(--bg-card)] relative transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="w-2 h-2 rounded-full bg-[var(--gold-primary)] absolute top-1.5 right-1.5" />
              </button>

              <div
                onClick={onOpenProfile}
                className="flex items-center gap-2 pl-2 border-l border-[var(--border-card)] cursor-pointer hover:opacity-85 transition-opacity"
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Mustafa Ali"
                  className="w-8 h-8 rounded-full object-cover border border-[var(--border-gold)]"
                />
                <span className="text-xs font-semibold hidden sm:inline text-[var(--text-heading)]">
                  Mustafa Ali
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </div>
            </div>
          </header>

          {/* ========================================================================= */}
          {/* TAB 1: DASHBOARD HOME (Matching Screenshot 1 & 2) */}
          {/* ========================================================================= */}
          {activeTab === 'home' && (
            <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
              
              {/* Top Row: Greeting & Editorial Hero Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left 7 Cols: Greeting & Vibe Carousel */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
                  <div>
                    <h2 className="font-playfair text-3xl sm:text-4xl text-[var(--text-heading)] font-bold tracking-tight">
                      Hi Mustafa,
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      What's your vibe today?
                    </p>
                  </div>

                  {/* Vibe Selection Cards (Exact Screenshot 1) */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                    {vibes.map((vibe) => (
                      <button
                        key={vibe.id}
                        onClick={() => {
                          if (vibe.id === 'date') {
                            setActiveTab('stylist');
                            setPlannerStep(1);
                          } else {
                            handleSendChat(`Show me ${vibe.name} outfits.`);
                            setActiveTab('stylist');
                            setPlannerStep(3);
                          }
                        }}
                        className="group flex flex-col items-center rounded-xl overflow-hidden border border-[var(--border-card)] bg-[var(--bg-card)] hover:border-[var(--gold-primary)] transition-all cursor-pointer shadow-sm hover:scale-[1.03]"
                      >
                        <div className="w-full h-16 sm:h-20 bg-neutral-900 relative overflow-hidden flex items-center justify-center">
                          {vibe.isCustom ? (
                            <Sliders className="w-6 h-6 text-[var(--gold-primary)] group-hover:rotate-45 transition-transform" />
                          ) : (
                            <img
                              src={vibe.img}
                              alt={vibe.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          )}
                        </div>
                        <span className="py-2 text-[11px] font-semibold text-[var(--text-heading)]">
                          {vibe.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Quick Pill Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--gold-primary)]">
                      Suggested Prompts:
                    </span>
                    {['Date night outfit', 'Office look', 'Outfit for this restaurant', 'Use my new shoes'].map(
                      (prompt) => (
                        <button
                          key={prompt}
                          onClick={() => {
                            handleSendChat(prompt);
                            setActiveTab('stylist');
                            setPlannerStep(3);
                          }}
                          className="px-3 py-1 rounded-full text-xs border border-[var(--border-card)] bg-[var(--bg-card)] hover:border-[var(--gold-primary)] text-[var(--text-body)] hover:text-[var(--gold-primary)] transition-all cursor-pointer"
                        >
                          {prompt}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Right 5 Cols: Editorial Banner Card matching Screenshot 1 */}
                <div className="lg:col-span-5 rounded-2xl overflow-hidden relative border border-[var(--border-card)] shadow-md group min-h-[220px]">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"
                    alt="Your Wardrobe Your World Your Look"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end text-white">
                    <p className="font-playfair text-2xl font-bold leading-tight">
                      Your Wardrobe.<br />Your World.<br />Your Look.
                    </p>
                    <p className="font-script text-lg text-amber-200 mt-1">
                      Your style. Every place.
                    </p>
                  </div>
                </div>

              </div>

              {/* Middle Section: AI Outfit Suggestions & Right Side Panel (Next Plan + AI Chat) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Center 8 Cols: AI Outfit Suggestions (Screenshot 1) */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-playfair text-xl font-bold text-[var(--text-heading)]">
                        AI Outfit Suggestions
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">
                        Curated for your style, wardrobe and today's plans.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('stylist');
                        setPlannerStep(3);
                      }}
                      className="text-xs font-semibold text-[var(--gold-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>See All</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 4 Outfit Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {suggestions.map((look) => {
                      const isLiked = likedLooks.includes(look.id);
                      return (
                        <div
                          key={look.id}
                          className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all group"
                        >
                          {/* Flat lay image preview */}
                          <div className="h-56 bg-neutral-100 dark:bg-neutral-900 relative overflow-hidden flex items-center justify-center p-3">
                            <img
                              src={look.img}
                              alt={look.title}
                              className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3 flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-mono font-bold backdrop-blur-md">
                                {look.match}% Match
                              </span>
                              <button
                                onClick={() => toggleLike(look.id)}
                                className="w-8 h-8 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform"
                              >
                                <Heart
                                  className={`w-4 h-4 ${
                                    isLiked ? 'text-rose-500 fill-rose-500' : 'text-neutral-500'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                              <h4 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                                {look.title}
                              </h4>
                              <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1">
                                {look.description}
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                setCurrentOutfitTitle(look.title);
                                setCurrentOutfitMatch(look.match);
                                setActiveTab('stylist');
                                setPlannerStep(3);
                              }}
                              className="w-full py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                            >
                              <span>Try This Look</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right 4 Cols: Live Hyderabad Weather + Next Plan + Live AI Stylist Chat (Screenshot 1) */}
                <div className="lg:col-span-4 space-y-4">
                  
                  {/* Weather Widget */}
                  <div className="p-4 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] flex items-center justify-between shadow-sm">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                        <MapPin className="w-3 h-3 text-[var(--gold-primary)]" />
                        <span>Hyderabad, India</span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-playfair text-3xl font-bold text-[var(--text-heading)]">
                          28°C
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                          Partly Cloudy
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <CloudSun className="w-9 h-9 text-amber-500" />
                      <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1">
                        Mon, 14 Oct
                      </span>
                    </div>
                  </div>

                  {/* Your Next Plan Card matching Screenshot 1 */}
                  <div className="p-4 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-playfair text-sm font-bold text-[var(--text-heading)]">
                        Your Next Plan
                      </span>
                      <button
                        onClick={() => {
                          setActiveTab('stylist');
                          setPlannerStep(1);
                        }}
                        className="text-[11px] text-[var(--gold-primary)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80"
                        alt="Dinner at L'amore"
                        className="w-16 h-16 rounded-xl object-cover border border-[var(--border-card)]"
                      />
                      <div className="space-y-0.5">
                        <h5 className="text-xs font-bold text-[var(--text-heading)]">
                          Dinner at L'amore
                        </h5>
                        <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>8:00 PM • Today</span>
                        </p>
                        <p className="text-[10px] text-[var(--gold-primary)] font-medium">
                          Date Night • Banjara Hills, Hyd
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('stylist');
                        setPlannerStep(1);
                      }}
                      className="w-full py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Get Outfit Suggestion</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Chat with Your AI Stylist Widget (Screenshot 1) */}
                  <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] overflow-hidden shadow-sm flex flex-col">
                    <div className="p-3.5 border-b border-[var(--border-card)] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[var(--gold-primary)]" />
                      <span className="font-playfair text-sm font-bold text-[var(--text-heading)]">
                        Chat with Your AI Stylist
                      </span>
                    </div>

                    {/* Chat Bubble Stream */}
                    <div className="p-3.5 space-y-3 max-h-64 overflow-y-auto text-xs">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex gap-2 ${
                            msg.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {msg.sender === 'ai' && (
                            <div className="w-6 h-6 rounded-full bg-[#F7EFE0] p-0.5 border border-[#D5C29D] shrink-0 flex items-center justify-center">
                              <img
                                src="/otd_logo.png"
                                alt="OTD"
                                className="w-full h-full object-contain"
                              />
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

                    {/* Chat Input */}
                    <div className="p-3 border-t border-[var(--border-card)] flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ask me anything..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                        className="flex-1 py-2 px-3 text-xs rounded-full bg-[var(--bg-canvas)] border border-[var(--border-card)] focus:outline-none focus:border-[var(--gold-primary)]"
                      />
                      <button
                        onClick={() => handleSendChat()}
                        className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center hover:scale-105 transition-all cursor-pointer shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Row: Your Closet + Style Avatar + Plan Your Outfits (Screenshot 1) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                
                {/* Closet Rack Preview */}
                <div className="p-4 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-playfair text-sm font-bold text-[var(--text-heading)]">
                      Your Closet
                    </span>
                    <button
                      onClick={() => setActiveTab('closet')}
                      className="text-[11px] text-[var(--gold-primary)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="h-32 rounded-xl overflow-hidden border border-[var(--border-card)] relative group cursor-pointer" onClick={() => setActiveTab('closet')}>
                    <img
                      src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=500&q=80"
                      alt="Wardrobe Rack"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs font-semibold">
                      <span>{closet.length} Curated Garments</span>
                    </div>
                  </div>
                </div>

                {/* Style Avatar Preview */}
                <div className="p-4 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-playfair text-sm font-bold text-[var(--text-heading)]">
                      Style Avatar
                    </span>
                    <button
                      onClick={onOpenProfile}
                      className="text-[11px] text-[var(--gold-primary)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Edit</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                      alt="Mustafa Style Avatar"
                      className="w-16 h-20 rounded-xl object-cover border border-[var(--border-card)]"
                    />
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--text-muted)]">Height:</span>
                        <span className="font-semibold text-[var(--text-heading)]">178 cm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--text-muted)]">Body Shape:</span>
                        <span className="font-semibold text-[var(--text-heading)]">Athletic</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--text-muted)]">Skin Tone:</span>
                        <span className="w-3.5 h-3.5 rounded-full bg-[#D4A373] inline-block border border-black/20" />
                        <span className="font-semibold text-[var(--text-heading)]">Medium Warm</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan Your Outfits Calendar Preview */}
                <div className="p-4 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-playfair text-sm font-bold text-[var(--text-heading)]">
                      Plan Your Outfits
                    </span>
                    <button
                      onClick={() => setActiveTab('calendar')}
                      className="text-[11px] text-[var(--gold-primary)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Calendar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { day: '14', name: 'Mon', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=150&q=80' },
                      { day: '15', name: 'Tue', img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=150&q=80' },
                      { day: '16', name: 'Wed', img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=150&q=80' },
                      { day: '17', name: 'Thu', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&q=80' },
                    ].map((d) => (
                      <div key={d.day} className="flex flex-col items-center border border-[var(--border-card)] rounded-xl p-1 bg-[var(--bg-canvas)]">
                        <span className="text-[11px] font-bold text-[var(--text-heading)]">{d.day}</span>
                        <span className="text-[9px] text-[var(--text-muted)] uppercase">{d.name}</span>
                        <img src={d.img} alt={d.name} className="w-8 h-10 object-cover rounded mt-1" />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: AI STYLIST WIZARD (Matching Screenshots 3, 4, and Recommendation) */}
          {/* ========================================================================= */}
          {activeTab === 'stylist' && (
            <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
              
              {/* Wizard Progress Stepper matching Screenshots 3 & 4 */}
              <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-4">
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
                      ? "Help us understand your vibe and the conditions so we can create the perfect look."
                      : "Engineered from your digital closet with custom rationale and conversational tweaking."}
                  </p>
                </div>

                {/* 3 Step Indicator */}
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

              {/* STEP 1: OCCASION & DESTINATION (Exact Screenshot 3) */}
              {plannerStep === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left 8 Cols: Form */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Section 1: Occasion */}
                    <div className="space-y-3">
                      <h3 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                        1. What's the occasion?
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">Select one or choose multiple.</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { name: 'Date', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=250&q=80' },
                          { name: 'Casual Outing', img: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=250&q=80' },
                          { name: 'Party', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=250&q=80' },
                          { name: 'Wedding', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=250&q=80' },
                          { name: 'Office', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=250&q=80' },
                          { name: 'College', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=250&q=80' },
                          { name: 'Travel', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=250&q=80' },
                          { name: 'More', isMore: true },
                        ].map((occ) => {
                          const isSelected = selectedOccasion === occ.name;
                          return (
                            <button
                              key={occ.name}
                              onClick={() => setSelectedOccasion(occ.name)}
                              className={`rounded-xl border overflow-hidden transition-all relative group cursor-pointer ${
                                isSelected
                                  ? 'border-black dark:border-white ring-2 ring-black/10 dark:ring-white/10'
                                  : 'border-[var(--border-card)] bg-[var(--bg-card)]'
                              }`}
                            >
                              <div className="h-18 bg-neutral-900 relative overflow-hidden flex items-center justify-center">
                                {occ.isMore ? (
                                  <span className="text-xl text-[var(--gold-primary)] font-bold">•••</span>
                                ) : (
                                  <img
                                    src={occ.img}
                                    alt={occ.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                )}
                                {isSelected && (
                                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow">
                                    <Check className="w-3 h-3" />
                                  </div>
                                )}
                              </div>
                              <div className="py-2 px-1 text-center text-xs font-semibold text-[var(--text-heading)]">
                                {occ.name}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 2: Where are you going? */}
                    <div className="space-y-3">
                      <h3 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                        2. Where are you going?
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">Search for a specific place or choose a category.</p>

                      {/* Search box with clear button */}
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--gold-primary)]" />
                        <input
                          type="text"
                          value={destinationSearch}
                          onChange={(e) => setDestinationSearch(e.target.value)}
                          className="w-full pl-10 pr-10 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] text-xs text-[var(--text-heading)] font-medium focus:outline-none focus:border-[var(--gold-primary)]"
                        />
                        {destinationSearch && (
                          <button
                            onClick={() => setDestinationSearch('')}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-black dark:hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Venue Categories */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { name: 'Restaurant', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80' },
                          { name: 'Café', img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=200&q=80' },
                          { name: 'Bar / Club', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=200&q=80' },
                          { name: 'Mall', img: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=200&q=80' },
                          { name: 'Movie / Theater', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=200&q=80' },
                          { name: 'Resort', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=200&q=80' },
                          { name: 'Outdoor', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=200&q=80' },
                          { name: 'More', isMore: true },
                        ].map((cat) => {
                          const isCatSelected = selectedVenueCategory === cat.name;
                          return (
                            <button
                              key={cat.name}
                              onClick={() => setSelectedVenueCategory(cat.name)}
                              className={`rounded-xl border overflow-hidden transition-all relative cursor-pointer ${
                                isCatSelected
                                  ? 'border-black dark:border-white ring-2 ring-black/10 dark:ring-white/10'
                                  : 'border-[var(--border-card)] bg-[var(--bg-card)]'
                              }`}
                            >
                              <div className="h-16 bg-neutral-900 relative flex items-center justify-center">
                                {cat.isMore ? (
                                  <span className="text-xl text-[var(--gold-primary)] font-bold">•••</span>
                                ) : (
                                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                                )}
                                {isCatSelected && (
                                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5" />
                                  </div>
                                )}
                              </div>
                              <div className="py-1.5 text-center text-xs font-semibold text-[var(--text-heading)]">
                                {cat.name}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 3 & 4: Date/Time + Weather */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Date & Time */}
                      <div className="space-y-2 p-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)]">
                        <span className="text-xs font-bold text-[var(--text-heading)]">
                          3. When are you going? <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
                        </span>
                        <div className="flex gap-2">
                          <div className="flex-1 flex items-center justify-between p-2 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-card)] text-xs">
                            <span>{selectedDate}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                          </div>
                          <div className="w-28 flex items-center justify-between p-2 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-card)] text-xs">
                            <span>{selectedTime}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                          </div>
                        </div>
                      </div>

                      {/* Auto-detected Weather */}
                      <div className="space-y-2 p-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)]">
                        <span className="text-xs font-bold text-[var(--text-heading)]">
                          4. Weather <span className="text-emerald-500 font-semibold">(Auto-detected)</span>
                        </span>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CloudSun className="w-7 h-7 text-amber-500" />
                            <div>
                              <span className="font-playfair text-xl font-bold text-[var(--text-heading)]">
                                28°C
                              </span>
                              <p className="text-[10px] text-[var(--text-muted)]">Partly Cloudy</p>
                            </div>
                          </div>
                          <div className="text-right text-[10px] text-[var(--text-muted)]">
                            <p>Hyderabad, India</p>
                            <p>Feels like 29°C</p>
                            <p className="text-emerald-600 font-medium">Low chance of rain</p>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Wizard Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border-card)]">
                      <button
                        onClick={() => setActiveTab('home')}
                        className="px-5 py-2.5 rounded-full border border-[var(--border-card)] text-xs font-semibold hover:bg-[var(--pill-bg)] transition-all cursor-pointer"
                      >
                        ← Back to Home
                      </button>

                      <button
                        onClick={() => setPlannerStep(2)}
                        className="px-8 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                      >
                        <span>Next: Set Mood & Weather</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Right 4 Cols: L'amore Venue Card matching Screenshot 3 */}
                  <div className="lg:col-span-4 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] overflow-hidden shadow-sm space-y-4">
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                        alt="L'amore Venue"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-4 text-white">
                        <h4 className="font-playfair text-xl font-bold">L'amore</h4>
                        <p className="text-xs text-neutral-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-300" />
                          <span>Banjara Hills, Hyderabad</span>
                        </p>
                      </div>
                    </div>

                    <div className="px-5 space-y-3">
                      {/* Venue Tabs */}
                      <div className="flex items-center gap-4 text-xs font-semibold border-b border-[var(--border-card)] pb-2">
                        {['about', 'ambience', 'dress_code', 'photos'].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setVenueInfoTab(tab as any)}
                            className={`capitalize cursor-pointer ${
                              venueInfoTab === tab
                                ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-1'
                                : 'text-[var(--text-muted)]'
                            }`}
                          >
                            {tab.replace('_', ' ')}
                          </button>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                        L'amore is a fine dining restaurant known for its elegant ambience, warm lighting and modern aesthetic. It's a popular spot for date nights, special occasions and upscale dinners.
                      </p>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-card)] text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-[var(--text-muted)]">Ambience</span>
                          <p className="font-semibold text-[var(--text-heading)]">Fine Dining</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-[var(--text-muted)]">Vibe</span>
                          <p className="font-semibold text-[var(--text-heading)]">Romantic</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-[var(--text-muted)]">Crowd</span>
                          <p className="font-semibold text-[var(--text-heading)]">Upscale</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-[var(--text-muted)]">Dress Code</span>
                          <p className="font-semibold text-[var(--text-heading)]">Smart Casual</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-[var(--text-muted)]">Indoor</span>
                          <p className="font-semibold text-[var(--text-heading)]">Yes</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-[var(--text-muted)]">Avg. Temp</span>
                          <p className="font-semibold text-[var(--text-heading)]">26-30°C</p>
                        </div>
                      </div>

                      {/* AI Stylist Note Callout */}
                      <div className="p-3.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--border-gold)] flex items-start gap-2.5 text-xs">
                        <Sparkles className="w-4 h-4 text-[var(--gold-primary)] shrink-0 mt-0.5" />
                        <p className="text-[var(--text-body)] leading-relaxed">
                          Based on the venue, time and weather, we'll suggest outfits that match the ambience and your style.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 2: MOOD & WEATHER (Exact Screenshot 4) */}
              {plannerStep === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left 8 Cols: Mood & Preferences */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Section 1: Mood */}
                    <div className="space-y-3">
                      <h3 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                        1. What's your mood today?
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">Select your current vibe or choose multiple.</p>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {[
                          { name: 'Confident', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
                          { name: 'Chill', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
                          { name: 'Romantic', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80' },
                          { name: 'Energetic', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=200&q=80' },
                          { name: 'Classy', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&q=80' },
                          { name: 'Minimal', img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=200&q=80' },
                          { name: 'Trendy', img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=200&q=80' },
                          { name: 'Bold', img: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=200&q=80' },
                          { name: 'Comfortable', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=200&q=80' },
                          { name: 'Other', isOther: true },
                        ].map((m) => {
                          const isSelected = selectedMood === m.name;
                          return (
                            <button
                              key={m.name}
                              onClick={() => setSelectedMood(m.name)}
                              className={`rounded-xl border overflow-hidden transition-all relative cursor-pointer ${
                                isSelected
                                  ? 'border-black dark:border-white ring-2 ring-black/10 dark:ring-white/10'
                                  : 'border-[var(--border-card)] bg-[var(--bg-card)]'
                              }`}
                            >
                              <div className="h-20 bg-neutral-900 relative flex items-center justify-center">
                                {m.isOther ? (
                                  <Plus className="w-6 h-6 text-[var(--gold-primary)]" />
                                ) : (
                                  <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                                )}
                                {isSelected && (
                                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5" />
                                  </div>
                                )}
                              </div>
                              <div className="py-1.5 text-center text-xs font-semibold text-[var(--text-heading)]">
                                {m.name}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 2: What's the weather like? */}
                    <div className="space-y-3">
                      <h3 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                        2. What's the weather like?
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">
                        We'll adjust the outfit to keep you comfortable and stylish.
                      </p>

                      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                        {['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Windy', 'Cold', 'Hot'].map((cond) => {
                          const isCondSelected = selectedWeatherCond === cond;
                          return (
                            <button
                              key={cond}
                              onClick={() => setSelectedWeatherCond(cond)}
                              className={`py-3 px-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                                isCondSelected
                                  ? 'border-black dark:border-white bg-black/5 dark:bg-white/5 font-bold ring-1 ring-black/20'
                                  : 'border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-muted)]'
                              }`}
                            >
                              <CloudSun className={`w-5 h-5 ${isCondSelected ? 'text-amber-500' : 'text-neutral-400'}`} />
                              <span className="text-[11px] text-[var(--text-heading)]">{cond}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 3: Any additional preferences? */}
                    <div className="space-y-3">
                      <h3 className="font-playfair text-base font-bold text-[var(--text-heading)]">
                        3. Any additional preferences? <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {[
                          'Layering',
                          'Light & Breezy',
                          'Warm & Cozy',
                          'Rain Friendly',
                          'Breathable',
                          'Indoor-to-Outdoor',
                          'All Day Comfort',
                        ].map((pref) => {
                          const isPrefSelected = selectedPreferences.includes(pref);
                          return (
                            <button
                              key={pref}
                              onClick={() =>
                                setSelectedPreferences((prev) =>
                                  isPrefSelected ? prev.filter((p) => p !== pref) : [...prev, pref]
                                )
                              }
                              className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                                isPrefSelected
                                  ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                                  : 'bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-body)] hover:border-[var(--gold-primary)]'
                              }`}
                            >
                              {isPrefSelected && <Check className="w-3 h-3" />}
                              <span>{pref}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border-card)]">
                      <button
                        onClick={() => setPlannerStep(1)}
                        className="px-5 py-2.5 rounded-full border border-[var(--border-card)] text-xs font-semibold hover:bg-[var(--pill-bg)] transition-all cursor-pointer"
                      >
                        ← Back to Destination
                      </button>

                      <button
                        onClick={() => setPlannerStep(3)}
                        className="px-8 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                      >
                        <span>Next: Get Outfit Suggestions</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Right 4 Cols: Current Plan & Pro Tip Card (Exact Screenshot 4) */}
                  <div className="lg:col-span-4 space-y-4">
                    
                    {/* Your Current Plan Card */}
                    <div className="p-5 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-playfair text-sm font-bold text-[var(--text-heading)]">
                          Your Current Plan
                        </span>
                        <button
                          onClick={() => setPlannerStep(1)}
                          className="text-[11px] text-[var(--gold-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Edit</span>
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="rounded-xl overflow-hidden h-36 border border-[var(--border-card)] relative">
                        <img
                          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80"
                          alt="L'amore"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <h5 className="font-bold text-[var(--text-heading)]">Dinner at L'amore</h5>
                        <p className="text-[var(--text-muted)] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Mon, 14 Oct 2024 • 8:00 PM</span>
                        </p>
                        <p className="text-[var(--text-muted)] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                          <span>Banjara Hills, Hyderabad</span>
                        </p>
                      </div>
                    </div>

                    {/* Live Weather Card */}
                    <div className="p-4 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                          <MapPin className="w-3 h-3 text-[var(--gold-primary)]" />
                          <span>Hyderabad, India</span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-playfair text-2xl font-bold text-[var(--text-heading)]">28°C</span>
                          <span className="text-xs text-[var(--text-muted)]">Partly Cloudy</span>
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] mt-1">Feels like 29°C • Humidity 56%</p>
                      </div>
                      <CloudSun className="w-8 h-8 text-amber-500" />
                    </div>

                    {/* Pro Tip Card */}
                    <div className="p-4 rounded-2xl bg-[var(--pill-bg)] border border-[var(--border-gold)] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--gold-primary)]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Pro Tip</span>
                      </div>
                      <p className="text-xs text-[var(--text-body)] leading-relaxed">
                        We'll combine your mood, weather and destination vibe to suggest outfits that look great and feel right.
                      </p>
                    </div>

                  </div>

                </div>
              )}

              {/* STEP 3: OUTFIT RECOMMENDATION & LIVE AI STYLIST CHAT */}
              {plannerStep === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left 7 Cols: The Generated Recommendation & Digital Closet Breakdown */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Recommendation Card */}
                    <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] overflow-hidden shadow-lg p-6 space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
                              {currentOutfitMatch}% AI Compatibility Match
                            </span>
                            {activeTweak && (
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 font-mono text-xs font-semibold">
                                {activeTweak}
                              </span>
                            )}
                          </div>
                          <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[var(--text-heading)] mt-2">
                            {currentOutfitTitle}
                          </h3>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">
                            Tailored for Dinner at L'amore (Banjara Hills) • 28°C Partly Cloudy
                          </p>
                        </div>

                        <button
                          onClick={() => toggleLike('curated-look')}
                          className="w-10 h-10 rounded-full border border-[var(--border-card)] flex items-center justify-center hover:scale-105 transition-transform"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              likedLooks.includes('curated-look')
                                ? 'text-rose-500 fill-rose-500'
                                : 'text-neutral-400'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Editorial Flat Lay Image */}
                      <div className="h-72 rounded-2xl overflow-hidden relative border border-[var(--border-card)] bg-neutral-900">
                        <img
                          src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80"
                          alt="Curated Outfit Flatlay"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[11px] font-mono flex items-center gap-2">
                          <Shirt className="w-3.5 h-3.5 text-amber-300" />
                          <span>5 Pieces from your Digital Closet</span>
                        </div>
                      </div>

                      {/* Garments Breakdown from Digital Closet */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold-primary)] font-mono">
                          Garment Composition from Your Closet
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {[
                            { name: 'Camp Collar Linen-Blend Shirt', brand: 'Zara Man', color: 'Jet Black', cat: 'Tops' },
                            { name: 'Relaxed Pleated Chino Trousers', brand: 'Massimo Dutti', color: 'Ivory Sand', cat: 'Bottoms' },
                            { name: 'Minimalist Clean Calfskin Low-Tops', brand: 'Common Projects', color: 'Chalk White', cat: 'Shoes' },
                            { name: 'Chronograph Leather Strap Watch', brand: 'Tissot', color: 'Espresso', cat: 'Accessories' },
                          ].map((piece, i) => (
                            <div
                              key={i}
                              className="p-3 rounded-xl border border-[var(--border-card)] bg-[var(--bg-canvas)] flex items-center justify-between"
                            >
                              <div>
                                <p className="font-semibold text-[var(--text-heading)]">{piece.name}</p>
                                <p className="text-[10px] text-[var(--text-muted)]">
                                  {piece.brand} • {piece.color}
                                </p>
                              </div>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--pill-bg)] text-[var(--gold-primary)] font-mono">
                                {piece.cat}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3 Pillar Rationale: Why This Outfit? */}
                      <div className="p-4 rounded-xl bg-[var(--pill-bg)] border border-[var(--border-gold)] space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[var(--gold-primary)]">
                          <Sparkles className="w-4 h-4" />
                          <span>Why OTD Chose This Look:</span>
                        </div>
                        <ul className="text-xs space-y-1.5 text-[var(--text-body)]">
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span><strong>Venue Ambience:</strong> Matches L'amore's upscale candlelit fine dining aesthetic without appearing over-stiff.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span><strong>Hyderabad Weather:</strong> 28°C evening requires breathable, light linen with structured draping.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span><strong>Style DNA:</strong> Incorporates your preferred Slim/Athletic silhouette and neutral palette.</span>
                          </li>
                        </ul>
                      </div>

                    </div>

                  </div>

                  {/* Right 5 Cols: Live Conversational Modifier */}
                  <div className="lg:col-span-5 space-y-4">
                    
                    <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] overflow-hidden shadow-sm flex flex-col h-[560px]">
                      
                      {/* Stylist Header */}
                      <div className="p-4 border-b border-[var(--border-card)] flex items-center justify-between bg-[var(--bg-header)]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#F7EFE0] p-1 border border-[#D5C29D] flex items-center justify-center">
                            <img src="/otd_logo.png" alt="OTD" className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <h4 className="font-playfair text-sm font-bold text-[var(--text-heading)]">
                              OTD AI Stylist Concierge
                            </h4>
                            <p className="text-[10px] text-emerald-500 font-medium">Ready to tweak look</p>
                          </div>
                        </div>

                        <button
                          onClick={() => setPlannerStep(1)}
                          className="text-[11px] text-[var(--text-muted)] hover:text-black dark:hover:text-white"
                        >
                          New Plan
                        </button>
                      </div>

                      {/* Chat Messages */}
                      <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
                        {chatMessages.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            {msg.sender === 'ai' && (
                              <div className="w-6 h-6 rounded-full bg-[#F7EFE0] p-0.5 border border-[#D5C29D] shrink-0 flex items-center justify-center">
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

                      {/* Quick Modification Chips requested by User */}
                      <div className="p-3 border-t border-[var(--border-card)] bg-[var(--bg-canvas)]">
                        <p className="text-[10px] uppercase font-mono tracking-wider text-[var(--gold-primary)] mb-2">
                          Quick Instructions:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Make it more casual.',
                            'Change the shoes.',
                            "Don't use jeans.",
                            'Make it more attractive.',
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
                          placeholder="e.g. 'Can we add a leather jacket?'"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                          className="flex-1 py-2 px-3 text-xs rounded-full bg-[var(--bg-canvas)] border border-[var(--border-card)] focus:outline-none focus:border-[var(--gold-primary)]"
                        />
                        <button
                          onClick={() => handleSendChat()}
                          className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center hover:scale-105 transition-all cursor-pointer shrink-0"
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
          {/* TAB 3: DIGITAL CLOSET (Screenshot 2: Screen 11) */}
          {/* ========================================================================= */}
          {activeTab === 'closet' && (
            <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-playfair text-3xl font-bold text-[var(--text-heading)]">
                    Digital Closet
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {closet.length} items digitized • Ready for AI curation & weather adaptation
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

              {/* Garment Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {closet.map((piece: ClosetItem) => (
                  <div
                    key={piece.id}
                    className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="h-44 bg-neutral-900 relative overflow-hidden flex items-center justify-center p-2">
                      <div className="w-full h-full rounded-xl bg-neutral-800 flex flex-col items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300">
                        <span>{piece.icon}</span>
                      </div>
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
                      <p className="text-[10px] text-[var(--gold-primary)] font-mono">
                        {piece.brand}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: VIRTUAL TRY-ON STUDIO */}
          {/* ========================================================================= */}
          {activeTab === 'tryon' && (
            <div className="p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full text-center">
              <h2 className="font-playfair text-3xl font-bold text-[var(--text-heading)]">
                Virtual Try-On Studio
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Hyper-realistic 3D cloth simulation powered by your personalized Style Avatar.
              </p>

              <div className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-8 shadow-xl max-w-md mx-auto space-y-4">
                <div className="h-96 rounded-2xl overflow-hidden relative border border-[var(--border-card)] shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                    alt="Avatar Try-On"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white text-left">
                    <p className="font-playfair text-lg font-bold">Mustafa Ali (178 cm • Athletic)</p>
                    <p className="text-xs text-amber-300 font-mono">Draped: The Parisian Minimalist (Size M)</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => alert('3D Rendering refreshed from latest closet items.')}
                    className="px-6 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-render Simulation</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
