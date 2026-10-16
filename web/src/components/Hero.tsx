import { useState } from 'react';
import { Sparkles, ArrowRight, Send, Bookmark, RefreshCw } from 'lucide-react';
import { useCloset } from '../context/ClosetContext';

interface HeroProps {
  onOpenProfile: () => void;
  onExploreDemo?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenProfile }) => {
  const { currentOutfit, generateOutfit, modifyOutfit, isGenerating, profile } = useCloset();
  
  // Context Form State
  const [promptText, setPromptText] = useState('Rooftop restaurant tonight for a date');
  const [venue, setVenue] = useState('Rooftop Lounge');
  const [occasion, setOccasion] = useState('Date Night');
  const [vibe, setVibe] = useState('Romantic & Alluring');
  const [weather, setWeather] = useState('Tonight · 22°C Breezy');
  
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
    <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden transition-colors duration-300">
      {/* Background radial gold glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[var(--gold-primary)]/8 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header: Context-First Focus */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-gold)] bg-[var(--pill-bg)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[var(--gold-primary)] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--gold-primary)] font-mono">
              OTD · OUTFIT OF THE DAY · CONTEXT ENGINE
            </span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-normal tracking-tight text-[var(--text-heading)] leading-[1.08]">
            Where are you going?
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-body)] font-light leading-relaxed">
            Tell OTD your destination, occasion, and desired vibe. Our AI scans your actual 
            <strong className="text-[var(--text-heading)]"> Digital Closet</strong> to curate the ideal outfit from clothes you already own.
          </p>

          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={onOpenProfile}
              className="text-xs uppercase tracking-wider text-[var(--gold-primary)] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Styled for {profile.name} ({profile.stylePersonas[0]})</span>
              <span className="text-[10px] bg-[var(--pill-bg)] px-2 py-0.5 rounded-full border border-[var(--border-gold)]">Edit Profile</span>
            </button>
          </div>
        </div>

        {/* The Context Omnibar & Guided Selectors Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[var(--border-card)] shadow-xl relative mb-12">
          <form onSubmit={handleCurate} className="space-y-6">
            
            {/* Freeform Prompt Omnibar */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-2 font-mono">
                Describe Your Destination & Plans:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={promptText}
                  onChange={e => setPromptText(e.target.value)}
                  placeholder="e.g. Dinner date tonight at a rooftop restaurant, or pitch meeting tomorrow..."
                  className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-2xl px-5 py-4 text-sm sm:text-base text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)] shadow-inner transition-colors pr-12"
                />
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-[var(--gold-primary)] text-white dark:text-black flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                  title="Curate outfit"
                >
                  {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
                </button>
              </div>
            </div>

            {/* Guided Micro-Selectors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              
              {/* Selector 1: Venue */}
              <div>
                <label className="block text-[10px] uppercase font-mono font-semibold text-[var(--text-muted)] mb-1.5">
                  Venue / Setting
                </label>
                <select
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                  className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-3 py-2.5 text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)] cursor-pointer"
                >
                  <option value="Rooftop Lounge">Rooftop Lounge / Restaurant</option>
                  <option value="Fine Dining Bistro">Fine Dining Bistro</option>
                  <option value="Executive Boardroom">Executive Boardroom</option>
                  <option value="Casual Cafe">Casual Cafe & Walk</option>
                  <option value="Art Gallery Vernissage">Art Gallery Vernissage</option>
                  <option value="Nightclub & Cocktails">Nightclub & Cocktails</option>
                </select>
              </div>

              {/* Selector 2: Occasion */}
              <div>
                <label className="block text-[10px] uppercase font-mono font-semibold text-[var(--text-muted)] mb-1.5">
                  Occasion
                </label>
                <select
                  value={occasion}
                  onChange={e => setOccasion(e.target.value)}
                  className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-3 py-2.5 text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)] cursor-pointer"
                >
                  <option value="Date Night">Date Night</option>
                  <option value="High-Stakes Business">High-Stakes Business</option>
                  <option value="Casual Social">Casual Social Outing</option>
                  <option value="Cocktail Celebration">Cocktail Celebration</option>
                  <option value="Off-Duty Weekend">Off-Duty Weekend</option>
                </select>
              </div>

              {/* Selector 3: Vibe */}
              <div>
                <label className="block text-[10px] uppercase font-mono font-semibold text-[var(--text-muted)] mb-1.5">
                  Desired Vibe / Mood
                </label>
                <select
                  value={vibe}
                  onChange={e => setVibe(e.target.value)}
                  className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-3 py-2.5 text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)] cursor-pointer"
                >
                  <option value="Romantic & Alluring">Romantic & Alluring</option>
                  <option value="Effortless Minimalist">Effortless Minimalist</option>
                  <option value="Sharp & Commanding">Sharp & Commanding</option>
                  <option value="Relaxed & Approachable">Relaxed & Approachable</option>
                </select>
              </div>

              {/* Selector 4: Weather / Time */}
              <div>
                <label className="block text-[10px] uppercase font-mono font-semibold text-[var(--text-muted)] mb-1.5">
                  Time & Weather
                </label>
                <select
                  value={weather}
                  onChange={e => setWeather(e.target.value)}
                  className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-3 py-2.5 text-[var(--text-heading)] font-medium outline-none focus:border-[var(--gold-primary)] cursor-pointer"
                >
                  <option value="Tonight · 22°C Breezy">Tonight · 22°C Breezy</option>
                  <option value="Evening · 16°C Cool">Evening · 16°C Cool</option>
                  <option value="Afternoon · 28°C Sunny">Afternoon · 28°C Sunny</option>
                  <option value="Morning · 19°C Overcast">Morning · 19°C Overcast</option>
                </select>
              </div>

            </div>

            {/* Curate Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                <span>AI will compose look strictly from 16 verified items in your Digital Closet</span>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="gold-btn whitespace-nowrap w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Styling From Your Closet...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Curate My Outfit Of The Day</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* 🌟 Result Screen: Curated Outfit Of The Day (Shows when generated) */}
        {currentOutfit && (
          <div id="curated-result-section" className="space-y-8 animate-in fade-in duration-500 pt-4">
            
            {/* Header of the Result */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-card)]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-[11px] uppercase font-mono tracking-wider text-[var(--gold-primary)] font-semibold">
                    YOUR CURATED OUTFIT OF THE DAY
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">·</span>
                  <span className="text-xs text-[var(--text-muted)] font-medium">{currentOutfit.occasion}</span>
                </div>
                <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[var(--text-heading)]">
                  {currentOutfit.title}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[var(--gold-primary)] bg-[var(--pill-bg)] px-3 py-1.5 rounded-full border border-[var(--border-gold)] font-medium">
                  Closet Match: {currentOutfit.harmonyScore}%
                </span>
                <button
                  onClick={() => setSavedLook(!savedLook)}
                  className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                    savedLook
                      ? 'border-[#10B981] bg-[#10B981]/15 text-[#10B981]'
                      : 'border-[var(--border-card)] hover:border-[var(--gold-primary)] text-[var(--text-heading)]'
                  }`}
                  title={savedLook ? 'Saved to Worn Looks' : 'Save Look'}
                >
                  <Bookmark className={`w-4 h-4 ${savedLook ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Garments Visual Composition (Directly from user's Digital Closet) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentOutfit.pieces.map((piece, idx) => (
                <div
                  key={piece.id}
                  className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--border-card)] hover:border-[var(--gold-primary)] transition-all group flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-semibold">
                        Layer 0{idx + 1}
                      </span>
                      <span className="text-2xl group-hover:scale-110 transition-transform">{piece.icon}</span>
                    </div>

                    <div className="text-[10px] uppercase font-mono tracking-wider text-[var(--gold-primary)] font-semibold mb-1">
                      {piece.subType}
                    </div>

                    <h3 className="text-xs font-semibold text-[var(--text-heading)] group-hover:text-[var(--gold-primary)] line-clamp-2 mb-2">
                      {piece.name}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-card)] space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Tone:</span>
                      <span className="text-[var(--text-heading)] font-medium">{piece.color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Source:</span>
                      <span className="text-[var(--gold-primary)] font-medium">{piece.brand}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* "Why This Outfit?" Editorial Section */}
            <div className="glass-card rounded-2xl p-6 border border-[var(--border-card)] space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--gold-primary)] font-semibold font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Why OTD Chose This Combination:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed text-[var(--text-body)]">
                <div className="bg-[var(--bg-card-inner)] p-3.5 rounded-xl border border-[var(--border-card)]">
                  <strong className="text-[var(--text-heading)] block mb-1">Venue & Ambience:</strong>
                  {currentOutfit.rationale.venueAlignment}
                </div>
                <div className="bg-[var(--bg-card-inner)] p-3.5 rounded-xl border border-[var(--border-card)]">
                  <strong className="text-[var(--text-heading)] block mb-1">Weather & Thermal Comfort:</strong>
                  {currentOutfit.rationale.weatherComfort}
                </div>
                <div className="bg-[var(--bg-card-inner)] p-3.5 rounded-xl border border-[var(--border-card)]">
                  <strong className="text-[var(--text-heading)] block mb-1">Color & Proportions:</strong>
                  {currentOutfit.rationale.paletteHarmony}
                </div>
              </div>
            </div>

            {/* 💬 Conversational Modifier Bar (Chat & Tweak Engine) */}
            <div className="glass-card rounded-2xl p-5 border border-[var(--border-gold)] space-y-4 shadow-md bg-[var(--bg-card-elevated)]">
              
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--gold-primary)] font-semibold block mb-2">
                  Want to tweak this look? Click a chip or type instructions:
                </span>
                
                {/* Quick Tweak Chips */}
                <div className="flex flex-wrap gap-2">
                  {[
                    'Make it more casual',
                    'Change the shoes',
                    "Don't use jeans",
                    'Make it more attractive',
                    'Add a lighter layer'
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      disabled={isGenerating}
                      onClick={() => handleChipTweak(chip)}
                      className="px-3.5 py-1.5 rounded-full border border-[var(--border-card)] bg-[var(--bg-card-inner)] hover:border-[var(--gold-primary)] text-xs text-[var(--text-heading)] transition-all cursor-pointer hover:scale-105 active:scale-95 font-medium"
                    >
                      "{chip}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendChat} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="e.g. 'Swap the loafers for clean white sneakers' or 'Make it warmer'..."
                    className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-card)] rounded-xl px-4 py-3 text-xs sm:text-sm text-[var(--text-heading)] outline-none focus:border-[var(--gold-primary)] font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isGenerating || !chatInput.trim()}
                  className="gold-btn px-5 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 shrink-0"
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
  );
};
