import React, { useState } from 'react';
import { Sparkles, ArrowRight, Send, Bookmark, RefreshCw, Play, Sun } from 'lucide-react';
import { useCloset } from '../context/ClosetContext';

interface HeroProps {
  onOpenProfile: () => void;
  onOpenOnboarding: () => void;
  onExploreDemo?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenProfile, onOpenOnboarding, onExploreDemo }) => {
  const { currentOutfit, generateOutfit, modifyOutfit, isGenerating, profile } = useCloset();
  
  // Context Form State (Matching Screenshots 2, 6, 7, 8)
  const [promptText, setPromptText] = useState('Rooftop restaurant tonight for a date');
  const [venue, setVenue] = useState('Rooftop Cafe, Hyderabad');
  const [occasion, setOccasion] = useState('Date Night');
  const [vibe, setVibe] = useState('Romantic & Alluring');
  const [weather, setWeather] = useState('Tonight · 21°C Mild Autumn');
  
  // Chat Modification Input
  const [chatInput, setChatInput] = useState('');
  const [savedLook, setSavedLook] = useState(false);

  const handleCurate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    generateOutfit({
      venue,
      occasion,
      vibe,
      weather
    });

    // Smooth scroll down to result card
    setTimeout(() => {
      const el = document.getElementById('curated-result-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 400);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    modifyOutfit(chatInput);
    setChatInput('');
  };

  const handleChipTweak = (instruction: string) => {
    modifyOutfit(instruction);
  };

  return (
    <div className="relative overflow-hidden transition-colors duration-300">
      
      {/* 🌟 HERO SECTION (EXACT MATCH TO SCREENSHOT 1) */}
      <section className="pt-8 pb-16 md:pt-12 md:pb-20 border-b border-[var(--border-card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* LEFT COLUMN: Headlines, Slogan, Feature Pills & CTAs (Image 1) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Top micro-tag with rule line */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono tracking-[0.22em] uppercase font-bold text-[#A67C1E] dark:text-[#F2D98D]">
                  AI-POWERED PERSONAL FASHION COMPANION
                </span>
                <span className="h-[1px] w-12 bg-[#A67C1E]/40" />
              </div>

              {/* Huge Serif Headline: Your Wardrobe. Your World. Your Look. */}
              <h1 className="font-playfair text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-[var(--text-heading)] leading-[1.05]">
                Your Wardrobe.<br />
                Your World.<br />
                Your Look.
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[var(--text-body)] font-normal leading-relaxed max-w-xl">
                An AI-powered personal fashion companion that helps you create the perfect outfit for every place, every mood, every you.
              </p>

              {/* 4 Feature Badges with Icons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-[var(--text-heading)]">
                  <span className="w-7 h-7 rounded-lg bg-[var(--pill-bg)] border border-[var(--border-gold)] flex items-center justify-center text-sm shrink-0">🚪</span>
                  <span className="font-semibold text-[11px] leading-tight">Your Closet Smarter</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-heading)]">
                  <span className="w-7 h-7 rounded-lg bg-[var(--pill-bg)] border border-[var(--border-gold)] flex items-center justify-center text-sm text-[var(--gold-primary)] shrink-0">✦</span>
                  <span className="font-semibold text-[11px] leading-tight">AI Personalized</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-heading)]">
                  <span className="w-7 h-7 rounded-lg bg-[var(--pill-bg)] border border-[var(--border-gold)] flex items-center justify-center text-sm shrink-0">📍</span>
                  <span className="font-semibold text-[11px] leading-tight">Destination Aware</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-heading)]">
                  <span className="w-7 h-7 rounded-lg bg-[var(--pill-bg)] border border-[var(--border-gold)] flex items-center justify-center text-sm shrink-0">👗</span>
                  <span className="font-semibold text-[11px] leading-tight">Looks For Every Occasion</span>
                </div>
              </div>

              {/* CTAs: Get Started -> & Watch Video */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  type="button"
                  onClick={onOpenOnboarding}
                  className="px-8 py-4 rounded-full bg-black text-white text-xs sm:text-sm font-bold hover:bg-neutral-800 flex items-center gap-2.5 cursor-pointer shadow-xl hover:scale-105 transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={onExploreDemo}
                  className="px-6 py-4 rounded-full border border-[var(--border-card)] bg-[var(--bg-card)] hover:border-black text-[var(--text-heading)] text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[var(--gold-primary)]" />
                  <span>Watch Video</span>
                </button>
              </div>

              {/* Social Proof Stats Row */}
              <div className="pt-6 border-t border-[var(--border-card)] flex flex-wrap items-center gap-6 text-xs text-[var(--text-body)]">
                <div>
                  <strong className="text-base font-bold text-[var(--text-heading)] block">10K+</strong>
                  <span className="text-[11px] text-[var(--text-muted)]">Happy Users</span>
                </div>
                <div className="h-7 w-[1px] bg-[var(--border-card)]" />
                <div>
                  <strong className="text-base font-bold text-[var(--text-heading)] flex items-center gap-1">
                    4.8 <span className="text-amber-500">★</span>
                  </strong>
                  <span className="text-[11px] text-[var(--text-muted)]">App Rating</span>
                </div>
                <div className="h-7 w-[1px] bg-[var(--border-card)]" />
                <div>
                  <strong className="text-base font-bold text-[var(--text-heading)] block">Smarter Outfits</strong>
                  <span className="text-[11px] text-[var(--text-muted)]">Everyday</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Haute Editorial Model Photo + Floating "Tonight's Look" Card (Image 1) */}
            <div className="lg:col-span-6 relative">
              
              {/* Main Editorial Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-card)] bg-neutral-900 aspect-[4/5] max-h-[580px] w-full">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
                  alt="OTD Haute Editorial Pair"
                  className="w-full h-full object-cover object-top"
                />
                
                {/* Handwritten Cursive Script Overlay */}
                <div className="absolute top-8 right-8 z-10">
                  <span className="font-script text-white text-3xl sm:text-4xl drop-shadow-lg -rotate-6 block">
                    Your style. Every place.
                  </span>
                </div>

                {/* Dark Gradient Overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Card: Tonight's Look (Matches Image 1 directly) */}
              <div className="absolute top-10 right-4 sm:-right-4 w-56 sm:w-64 glass-card rounded-2xl p-4 border border-white/40 dark:border-white/10 shadow-2xl bg-white/95 dark:bg-[#141418]/95 backdrop-blur-xl animate-in fade-in duration-700">
                <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[var(--text-heading)]">
                    Tonight's Look
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-500">
                    <Sun className="w-3 h-3" />
                    <span>21°C</span>
                  </span>
                </div>

                {/* Garments Mini Flat Lay */}
                <div className="grid grid-cols-3 gap-2 my-3 text-center">
                  <div className="bg-[#F7EFE0] dark:bg-[#1F1F26] p-1.5 rounded-lg border border-black/5 dark:border-white/5 flex flex-col items-center justify-center">
                    <span className="text-xl">👔</span>
                    <span className="text-[8px] font-bold truncate w-full text-[var(--text-heading)]">Black Shirt</span>
                  </div>
                  <div className="bg-[#F7EFE0] dark:bg-[#1F1F26] p-1.5 rounded-lg border border-black/5 dark:border-white/5 flex flex-col items-center justify-center">
                    <span className="text-xl">👕</span>
                    <span className="text-[8px] font-bold truncate w-full text-[var(--text-heading)]">White Top</span>
                  </div>
                  <div className="bg-[#F7EFE0] dark:bg-[#1F1F26] p-1.5 rounded-lg border border-black/5 dark:border-white/5 flex flex-col items-center justify-center">
                    <span className="text-xl">👖</span>
                    <span className="text-[8px] font-bold truncate w-full text-[var(--text-heading)]">Beige Pants</span>
                  </div>
                  <div className="bg-[#F7EFE0] dark:bg-[#1F1F26] p-1.5 rounded-lg border border-black/5 dark:border-white/5 flex flex-col items-center justify-center">
                    <span className="text-xl">⌚</span>
                    <span className="text-[8px] font-bold truncate w-full text-[var(--text-heading)]">Gold Watch</span>
                  </div>
                  <div className="bg-[#F7EFE0] dark:bg-[#1F1F26] p-1.5 rounded-lg border border-black/5 dark:border-white/5 flex flex-col items-center justify-center">
                    <span className="text-xl">👟</span>
                    <span className="text-[8px] font-bold truncate w-full text-[var(--text-heading)]">Sneakers</span>
                  </div>
                  <div className="bg-[#F7EFE0] dark:bg-[#1F1F26] p-1.5 rounded-lg border border-black/5 dark:border-white/5 flex flex-col items-center justify-center">
                    <span className="text-xl">🕶️</span>
                    <span className="text-[8px] font-bold truncate w-full text-[var(--text-heading)]">Glasses</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCurate}
                  className="w-full py-2 rounded-xl bg-black text-white text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-neutral-800 transition-colors"
                >
                  <span>View Look</span>
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>

              {/* Floating Mini Destination Cards (Bottom Row of Image 1) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                {[
                  { name: 'Date Night', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80' },
                  { name: 'Office', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80' },
                  { name: 'Travel', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=300&q=80' },
                  { name: 'Party', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=300&q=80' },
                ].map(dest => (
                  <div
                    key={dest.name}
                    onClick={() => {
                      setVenue(dest.name);
                      handleCurate();
                    }}
                    className="group relative rounded-xl overflow-hidden aspect-[4/3] border border-[var(--border-card)] shadow-md cursor-pointer"
                  >
                    <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-2">
                      <span className="text-[10px] font-bold text-white drop-shadow-sm">
                        {dest.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* 4 HORIZONTAL NUMBERED PROCESS STEPS (01 to 04 from Image 1) */}
          <div className="mt-16 pt-12 border-t border-[var(--border-card)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-[var(--gold-primary)] block">01</span>
                  <h4 className="font-playfair text-base font-bold text-[var(--text-heading)]">Upload Your Closet</h4>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--border-card)] bg-neutral-900 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=500&q=80"
                  alt="Upload Closet"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-[var(--gold-primary)] block">02</span>
                  <h4 className="font-playfair text-base font-bold text-[var(--text-heading)]">Tell OTD Where You're Going</h4>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--border-card)] bg-neutral-900 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=500&q=80"
                  alt="Where are you going"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-[var(--gold-primary)] block">03</span>
                  <h4 className="font-playfair text-base font-bold text-[var(--text-heading)]">Get Personalized Outfits</h4>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--border-card)] bg-neutral-900 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=80"
                  alt="Personalized Outfits"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-[var(--gold-primary)] block">04</span>
                  <h4 className="font-playfair text-base font-bold text-[var(--text-heading)]">Feel Confident Everywhere</h4>
                </div>
                <Sparkles className="w-4 h-4 text-[var(--gold-primary)]" />
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--border-card)] bg-neutral-900 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80"
                  alt="Feel Confident"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 🌟 CONTEXT ENGINE & OUTFIT STUDIO (MATCHING SCREENSHOT 2: SCREENS 6, 7, 8, 9, 10) */}
      <section id="context-studio" className="py-16 md:py-24 bg-[var(--bg-canvas-subtle)] border-b border-[var(--border-card)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header (Screen 6: "Good evening, Mustafa 👋") */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-gold)] bg-[var(--pill-bg)]">
              <span className="w-2 h-2 rounded-full bg-[var(--gold-primary)] animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--gold-primary)] font-mono">
                OTD CONTEXT ENGINE · HYDERABAD
              </span>
            </div>

            <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-[var(--text-heading)]">
              Good evening, {profile.name} 👋
            </h2>

            <p className="text-sm sm:text-base text-[var(--text-body)]">
              What are you dressing for today?
            </p>

            <button
              type="button"
              onClick={onOpenProfile}
              className="text-xs uppercase tracking-wider text-[var(--gold-primary)] hover:underline inline-flex items-center gap-1 font-semibold"
            >
              <span>Style DNA: {profile.stylePersonas[0]} ({profile.preferredFit})</span>
              <span className="text-[10px] bg-[var(--pill-bg)] px-2 py-0.5 rounded-full border border-[var(--border-gold)]">Calibrate</span>
            </button>
          </div>

          {/* Omnibar & Selectors (Screens 7, 8) */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[var(--border-card)] shadow-xl relative mb-12">
            <form onSubmit={handleCurate} className="space-y-6">
              
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-2 font-mono">
                  Tell OTD Your Destination & Event:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={promptText}
                    onChange={e => setPromptText(e.target.value)}
                    placeholder="e.g. Rooftop cafe tonight for a date, or boardroom pitch..."
                    className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-2xl px-5 py-4 text-sm sm:text-base text-[var(--text-heading)] font-semibold outline-none focus:border-black shadow-inner pr-14"
                  />
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center cursor-pointer hover:bg-neutral-800 transition-colors"
                  >
                    {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
                  </button>
                </div>
              </div>

              {/* Guided Micro-Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-mono font-semibold text-[var(--text-muted)] mb-1.5">
                    Destination / Venue
                  </label>
                  <select
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-3 py-2.5 text-[var(--text-heading)] font-semibold outline-none focus:border-black cursor-pointer"
                  >
                    <option value="Rooftop Cafe, Hyderabad">Rooftop Cafe, Hyderabad</option>
                    <option value="Fine Dining Bistro">Fine Dining Bistro</option>
                    <option value="Executive Boardroom">Executive Boardroom</option>
                    <option value="Casual Cafe & Walk">Casual Cafe & Walk</option>
                    <option value="Art Gallery Vernissage">Art Gallery Vernissage</option>
                    <option value="Cocktails & Social">Cocktails & Social</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono font-semibold text-[var(--text-muted)] mb-1.5">
                    Occasion
                  </label>
                  <select
                    value={occasion}
                    onChange={e => setOccasion(e.target.value)}
                    className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-3 py-2.5 text-[var(--text-heading)] font-semibold outline-none focus:border-black cursor-pointer"
                  >
                    <option value="Date Night">Date Night</option>
                    <option value="Casual Day">Casual Day</option>
                    <option value="Office / Work">Office / Work</option>
                    <option value="Party / Celebration">Party / Celebration</option>
                    <option value="Travel / Weekend">Travel / Weekend</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono font-semibold text-[var(--text-muted)] mb-1.5">
                    Desired Vibe
                  </label>
                  <select
                    value={vibe}
                    onChange={e => setVibe(e.target.value)}
                    className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-3 py-2.5 text-[var(--text-heading)] font-semibold outline-none focus:border-black cursor-pointer"
                  >
                    <option value="Elegant + Attractive">Elegant + Attractive</option>
                    <option value="The Parisian Minimalist">The Parisian Minimalist</option>
                    <option value="Sharp & Commanding">Sharp & Commanding</option>
                    <option value="Relaxed & Comfortable">Relaxed & Comfortable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono font-semibold text-[var(--text-muted)] mb-1.5">
                    Weather (Auto-Detected)
                  </label>
                  <select
                    value={weather}
                    onChange={e => setWeather(e.target.value)}
                    className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-3 py-2.5 text-[var(--text-heading)] font-semibold outline-none focus:border-black cursor-pointer"
                  >
                    <option value="Tonight · 21°C Mild Autumn">Tonight · 21°C Mild Autumn</option>
                    <option value="Evening · 16°C Cool">Evening · 16°C Cool</option>
                    <option value="Afternoon · 28°C Sunny">Afternoon · 28°C Sunny</option>
                    <option value="Morning · 19°C Overcast">Morning · 19°C Overcast</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[var(--text-muted)]">
                  Matches your owned clothes in your Digital Closet.
                </span>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Look...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#F2D98D]" />
                      <span>Curate My Outfit Of The Day</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* 🌟 RESULT SCREEN: Curated Outfit (Matches Screens 9, 10) */}
          {currentOutfit && (
            <div id="curated-result-section" className="space-y-8 animate-in fade-in duration-500">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-card)]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono tracking-wider uppercase bg-black text-white px-2.5 py-0.5 rounded-full font-bold">
                      {currentOutfit.harmonyScore}% AI MATCH
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">·</span>
                    <span className="text-xs text-[var(--text-muted)] font-medium">📍 {currentOutfit.venue}</span>
                  </div>
                  <h3 className="font-playfair text-3xl sm:text-4xl font-bold text-[var(--text-heading)]">
                    {currentOutfit.title}
                  </h3>
                  <p className="text-xs text-[var(--text-body)] mt-1">
                    Understated elegance balancing structured tailoring with soft fluid silk. Perfect for your {currentOutfit.venue}.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSavedLook(!savedLook)}
                    className={`px-4 py-2.5 rounded-full border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      savedLook
                        ? 'bg-[#10B981] text-white border-[#10B981]'
                        : 'border-[var(--border-card)] text-[var(--text-heading)] hover:border-black'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{savedLook ? 'Saved to Worn History' : 'Save Look'}</span>
                  </button>
                </div>
              </div>

              {/* Garments Visual Composition */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {currentOutfit.pieces.map((piece, idx) => (
                  <div
                    key={piece.id}
                    className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--border-card)] shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] uppercase font-mono font-bold text-[var(--gold-primary)]">
                          Layer 0{idx + 1}
                        </span>
                        <span className="text-2xl">{piece.icon}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">
                        {piece.brand}
                      </span>
                      <h4 className="text-xs font-bold text-[var(--text-heading)] line-clamp-2 mt-0.5">
                        {piece.name}
                      </h4>
                    </div>

                    <div className="pt-2 mt-2 border-t border-[var(--border-card)] flex justify-between text-[10px] text-[var(--text-muted)]">
                      <span>{piece.color}</span>
                      <strong className="text-[var(--text-heading)]">{piece.fit}</strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* "Why This Outfit Works For You" (Matches Screen 10) */}
              <div className="glass-card rounded-2xl p-6 border border-[var(--border-card)] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-[var(--text-heading)]">
                    OTD AI Stylist · Why this outfit works for you:
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-[var(--text-body)] list-disc pl-5 leading-relaxed">
                  <li>{currentOutfit.rationale.venueAlignment}</li>
                  <li>{currentOutfit.rationale.weatherComfort}</li>
                  <li>{currentOutfit.rationale.paletteHarmony}</li>
                  <li>The minimalist footwear and accessories elevate the silhouette without overdoing it.</li>
                </ul>
              </div>

              {/* 💬 Conversational Modifier Bar (Screen 10) */}
              <div className="glass-card rounded-2xl p-5 border border-black/20 dark:border-white/20 space-y-4 shadow-lg bg-[var(--bg-card-elevated)]">
                <div>
                  <span className="text-[11px] uppercase font-mono tracking-wider font-bold text-[var(--text-heading)] block mb-2">
                    Want to tweak this look? Click a chip or type instructions:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Make it more casual',
                      'Change the shoes',
                      "Don't use jeans",
                      'Make it more attractive',
                      'Add a lighter layer'
                    ].map(chip => (
                      <button
                        key={chip}
                        type="button"
                        disabled={isGenerating}
                        onClick={() => handleChipTweak(chip)}
                        className="px-3.5 py-1.5 rounded-full border border-[var(--border-card)] bg-[var(--bg-card-inner)] hover:border-black text-xs text-[var(--text-heading)] font-semibold transition-all cursor-pointer hover:scale-105 active:scale-95"
                      >
                        "{chip}"
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="e.g. 'Make it more casual' or 'Change the shoes'..."
                    className="flex-1 bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-4 py-3 text-xs sm:text-sm text-[var(--text-heading)] outline-none focus:border-black font-semibold"
                  />
                  <button
                    type="submit"
                    disabled={isGenerating || !chatInput.trim()}
                    className="px-5 py-3 rounded-xl bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Modify</span>
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>
      </section>

    </div>
  );
};
