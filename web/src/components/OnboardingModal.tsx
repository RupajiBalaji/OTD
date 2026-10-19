import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Sparkles, MapPin, Calendar, User, Scale, Ruler } from 'lucide-react';
import { useCloset } from '../context/ClosetContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const { profile, updateProfile } = useCloset();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Personal Details State
  const [fullName, setFullName] = useState<string>(profile.name === 'Curator' ? 'Mustafa Ali' : profile.name);
  const [nameError, setNameError] = useState<string | null>(null);
  const [age, setAge] = useState<number>(22);
  const [gender, setGender] = useState<string>('Male');
  const [heightValue, setHeightValue] = useState<number>(178);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weightValue, setWeightValue] = useState<number>(70);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [location, setLocation] = useState<string>('Hyderabad, India');
  const [bodyShape, setBodyShape] = useState<string>('Athletic');
  const [skinTone, setSkinTone] = useState<string>('Medium');

  // Step 2: Style Preferences State
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Minimal', 'Streetwear']);
  const [fitPreference, setFitPreference] = useState<'Slim Fit' | 'Regular Fit' | 'Loose Fit'>('Slim Fit');
  const [selectedColours, setSelectedColours] = useState<string[]>(['Black', 'Beige', 'White']);
  const [preferredOutfitPieces, setPreferredOutfitPieces] = useState<string[]>(['Tops', 'Bottoms', 'Outerwear']);
  const [formalityLevel, setFormalityLevel] = useState<string>('Smart Casual');

  // Step 3: Goals & Interests State
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Look good in everyday life',
    'Dress better for special occasions',
    'Improve my personal style'
  ]);
  const [otherInterests, setOtherInterests] = useState<string[]>(['Fashion Trends', 'Streetwear']);
  const [occasionsDressedFor, setOccasionsDressedFor] = useState<string[]>(['College', 'Dates', 'Casual Outings']);

  if (!isOpen) return null;

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const toggleColour = (col: string) => {
    if (selectedColours.includes(col)) {
      setSelectedColours(selectedColours.filter(c => c !== col));
    } else {
      setSelectedColours([...selectedColours, col]);
    }
  };

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (otherInterests.includes(interest)) {
      setOtherInterests(otherInterests.filter(i => i !== interest));
    } else {
      setOtherInterests([...otherInterests, interest]);
    }
  };

  const toggleOccasion = (occ: string) => {
    if (occasionsDressedFor.includes(occ)) {
      setOccasionsDressedFor(occasionsDressedFor.filter(o => o !== occ));
    } else {
      setOccasionsDressedFor([...occasionsDressedFor, occ]);
    }
  };

  const handleFinish = () => {
    updateProfile({
      name: fullName,
      height: `${heightValue} ${heightUnit}`,
      bodyShape: `${bodyShape} (${skinTone})`,
      stylePersonas: selectedStyles,
      preferredFit: fitPreference,
      palettePreferences: selectedColours,
    });
    if (onComplete) onComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-7xl min-h-[92vh] max-h-[96vh] rounded-3xl overflow-hidden shadow-2xl bg-[#F7EFE0] text-[#1C1612] border border-[#E5D5BC] flex flex-col lg:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-black/10 hover:bg-black/20 text-[#1C1612] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close onboarding"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Haute Editorial Brand Sidebar (Identical to Screenshots 3, 4, 5) */}
        <div className="w-full lg:w-72 xl:w-80 bg-[#EFE5D2] border-r border-[#E5D5BC] p-6 lg:p-8 flex flex-col justify-between relative shrink-0">
          
          <div>
            {/* OTD Logo Artwork */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-14 rounded-lg overflow-hidden border border-[#D4AF37]/50 bg-[#F7EFE0] p-1 flex items-center justify-center shadow-sm">
                <img
                  src="/otd_logo.png"
                  alt="OTD Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-cinzel text-xl font-bold tracking-[0.25em] text-[#1C1612] block">
                  OTD
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#A67C1E] font-semibold block">
                  Outfit Of The Day
                </span>
              </div>
            </div>

            {/* Editorial Model Image */}
            <div className="rounded-2xl overflow-hidden mb-5 border border-[#E2D3BD] shadow-md relative aspect-[4/5] max-h-72 lg:max-h-80 bg-neutral-900">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
                alt="Mustafa Style Model"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                <span className="font-script text-white text-2xl drop-shadow-md">
                  Your style. Every place.
                </span>
              </div>
            </div>

            {/* Slogan */}
            <div className="space-y-1 mb-5">
              <h2 className="font-playfair text-2xl lg:text-3xl font-bold tracking-tight text-[#1C1612] leading-tight">
                Style<br />
                Smarter.<br />
                Live Better.
              </h2>
              <p className="text-xs text-[#544A40] pt-1 font-medium">
                Your personal AI fashion companion.
              </p>
            </div>

            {/* 4 Feature Bullet Points */}
            <div className="space-y-2.5 text-xs text-[#544A40] pt-1">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#F7EFE0] border border-[#D5C2A5] flex items-center justify-center text-xs">🚪</span>
                <span className="font-semibold text-[#1C1612]">Your Closet Smarter</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#F7EFE0] border border-[#D5C2A5] flex items-center justify-center text-xs text-[#A67C1E]">✦</span>
                <span className="font-semibold text-[#1C1612]">AI Personalized</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#F7EFE0] border border-[#D5C2A5] flex items-center justify-center text-xs">📍</span>
                <span className="font-semibold text-[#1C1612]">Destination Aware</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#F7EFE0] border border-[#D5C2A5] flex items-center justify-center text-xs">👗</span>
                <span className="font-semibold text-[#1C1612]">Looks For Every Occasion</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5D5BC] text-[10px] text-[#84796C]">
            <span>OTD Engine v2.4 · Tailored to you</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Stepper + Interactive Wizard Body */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto p-6 sm:p-8 lg:p-10 bg-[#F7EFE0]">
          
          {/* Top Bar: Breadcrumb + Stepper */}
          <div className="pb-6 border-b border-[#E5D5BC]">
            
            <div className="flex items-center justify-between text-xs text-[#84796C] mb-4">
              <div className="flex items-center gap-1.5 font-medium">
                <span>Create Your Account</span>
                <span>&gt;</span>
                <span className="font-semibold text-[#1C1612]">
                  {currentStep === 1 && 'Personal Details'}
                  {currentStep === 2 && 'Style Preferences'}
                  {currentStep === 3 && 'Goals & Interests'}
                </span>
              </div>
              <span className="font-semibold text-[#1C1612]">Step {currentStep} of 4</span>
            </div>

            {/* Visual Stepper */}
            <div className="grid grid-cols-4 gap-2 items-center text-center">
              {[
                { step: 1, label: 'Personal Details' },
                { step: 2, label: 'Style Preferences' },
                { step: 3, label: 'Goals & Interests' },
                { step: 4, label: 'Finish' },
              ].map(s => {
                const isActive = currentStep === s.step;
                const isPassed = currentStep > s.step;
                return (
                  <div key={s.step} className="flex flex-col items-center">
                    <div className="flex items-center w-full mb-1">
                      <div className={`h-[2px] flex-1 ${s.step === 1 ? 'invisible' : isPassed || isActive ? 'bg-black' : 'bg-[#DCD0BE]'}`} />
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-black text-white shadow-md'
                          : isPassed
                          ? 'bg-[#1C1612] text-white'
                          : 'bg-[#EFE5D2] text-[#84796C] border border-[#DCD0BE]'
                      }`}>
                        {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.step}
                      </div>
                      <div className={`h-[2px] flex-1 ${s.step === 4 ? 'invisible' : isPassed ? 'bg-black' : 'bg-[#DCD0BE]'}`} />
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${
                      isActive ? 'text-[#1C1612]' : 'text-[#84796C]'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

          {/* STEP 1: PERSONAL DETAILS (Matches Image 3) */}
          {currentStep === 1 && (
            <div className="py-6 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              
              {/* Left Form Area (7 Cols) */}
              <div className="xl:col-span-7 space-y-5">
                <div>
                  <h3 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1C1612]">
                    Let's get to know you.
                  </h3>
                  <p className="text-xs text-[#544A40] mt-1">
                    This helps OTD create more personalized looks that match your style, body profile and lifestyle.
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#544A40] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#84796C]" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => {
                        setFullName(e.target.value);
                        if (nameError) setNameError(null);
                      }}
                      placeholder="e.g. Mustafa Ali"
                      className={`w-full bg-[#FCF8F2] border rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-[#1C1612] outline-none ${
                        nameError ? 'border-rose-500 ring-1 ring-rose-200' : 'border-[#DCD0BE] focus:border-black'
                      }`}
                    />
                  </div>
                  {nameError && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{nameError}</p>
                  )}
                </div>

                {/* Age & Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#544A40] mb-1.5">
                      Age
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#84796C]" />
                      <input
                        type="number"
                        value={age}
                        onChange={e => setAge(Number(e.target.value))}
                        className="w-full bg-[#FCF8F2] border border-[#DCD0BE] rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-[#1C1612] outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#544A40] mb-1.5">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      className="w-full bg-[#FCF8F2] border border-[#DCD0BE] rounded-xl px-3.5 py-3 text-sm font-semibold text-[#1C1612] outline-none focus:border-black"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-Binary">Non-Binary</option>
                    </select>
                  </div>
                </div>

                {/* Height & Unit Toggle */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#544A40] mb-1.5">
                    Height
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Ruler className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#84796C]" />
                      <input
                        type="number"
                        value={heightValue}
                        onChange={e => setHeightValue(Number(e.target.value))}
                        className="w-full bg-[#FCF8F2] border border-[#DCD0BE] rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-[#1C1612] outline-none focus:border-black"
                      />
                    </div>
                    <div className="flex bg-[#EFE5D2] p-1 rounded-xl border border-[#DCD0BE]">
                      <button
                        type="button"
                        onClick={() => setHeightUnit('cm')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          heightUnit === 'cm' ? 'bg-black text-white' : 'text-[#84796C]'
                        }`}
                      >
                        cm
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeightUnit('ft')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          heightUnit === 'ft' ? 'bg-black text-white' : 'text-[#84796C]'
                        }`}
                      >
                        ft
                      </button>
                    </div>
                  </div>
                </div>

                {/* Weight (Optional) & Unit Toggle */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#544A40] mb-1.5">
                    Weight (Optional)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Scale className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#84796C]" />
                      <input
                        type="number"
                        value={weightValue}
                        onChange={e => setWeightValue(Number(e.target.value))}
                        className="w-full bg-[#FCF8F2] border border-[#DCD0BE] rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-[#1C1612] outline-none focus:border-black"
                      />
                    </div>
                    <div className="flex bg-[#EFE5D2] p-1 rounded-xl border border-[#DCD0BE]">
                      <button
                        type="button"
                        onClick={() => setWeightUnit('kg')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          weightUnit === 'kg' ? 'bg-black text-white' : 'text-[#84796C]'
                        }`}
                      >
                        kg
                      </button>
                      <button
                        type="button"
                        onClick={() => setWeightUnit('lbs')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          weightUnit === 'lbs' ? 'bg-black text-white' : 'text-[#84796C]'
                        }`}
                      >
                        lbs
                      </button>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#544A40] mb-1.5">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#84796C]" />
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full bg-[#FCF8F2] border border-[#DCD0BE] rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-[#1C1612] outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* Body Shape (Matching Image 3) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#544A40] mb-1.5">
                    Body Shape
                  </label>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {['Slim', 'Athletic', 'Average', 'Curvy'].map(shape => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => setBodyShape(shape)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          bodyShape === shape
                            ? 'bg-black text-white border-black shadow-sm'
                            : 'bg-[#FCF8F2] text-[#544A40] border-[#DCD0BE] hover:border-black'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skin Tone (Matching Image 3) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#544A40] mb-1.5">
                    Skin Tone
                  </label>
                  <div className="flex gap-3">
                    {[
                      { name: 'Fair', hex: '#F3D2B8' },
                      { name: 'Medium', hex: '#C69C6D' },
                      { name: 'Olive', hex: '#9C7A54' },
                      { name: 'Tan', hex: '#7C5638' },
                      { name: 'Deep', hex: '#4F3524' },
                    ].map(tone => (
                      <button
                        key={tone.name}
                        type="button"
                        onClick={() => setSkinTone(tone.name)}
                        title={tone.name}
                        className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                          skinTone === tone.name ? 'scale-110 border-black ring-2 ring-black/20' : 'border-black/10'
                        }`}
                        style={{ backgroundColor: tone.hex }}
                      />
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Side: Your Style Avatar Card (5 Cols) (Matches Image 3) */}
              <div className="xl:col-span-5 bg-[#FCF8F2] rounded-3xl p-6 border border-[#E2D3BD] shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5D5BC]">
                  <h4 className="font-playfair text-xl font-bold text-[#1C1612]">
                    Your Style Avatar
                  </h4>
                  <span className="text-[10px] font-mono uppercase bg-[#EFE5D2] px-2.5 py-0.5 rounded-full border border-[#DCD0BE] text-[#84796C] font-semibold">
                    Preview
                  </span>
                </div>
                <p className="text-[11px] text-[#544A40] mt-2 mb-4">
                  This is a basic representation. We'll refine it based on your style preferences in the next step.
                </p>

                <div className="grid grid-cols-2 gap-4 items-center mb-4">
                  <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-neutral-900 border border-[#DCD0BE]">
                    <img
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"
                      alt="Style Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="bg-[#EFE5D2] p-2.5 rounded-xl border border-[#DCD0BE]">
                      <span className="text-[10px] uppercase font-bold text-[#84796C] block">Height</span>
                      <strong className="text-sm text-[#1C1612]">{heightValue} {heightUnit}</strong>
                    </div>
                    <div className="bg-[#EFE5D2] p-2.5 rounded-xl border border-[#DCD0BE]">
                      <span className="text-[10px] uppercase font-bold text-[#84796C] block">Body Shape</span>
                      <strong className="text-sm text-[#1C1612]">{bodyShape}</strong>
                    </div>
                    <div className="bg-[#EFE5D2] p-2.5 rounded-xl border border-[#DCD0BE] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#84796C] block">Skin Tone</span>
                        <strong className="text-sm text-[#1C1612]">{skinTone}</strong>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-[#C69C6D] border border-black/20" />
                    </div>
                    <div className="bg-[#EFE5D2] p-2.5 rounded-xl border border-[#DCD0BE]">
                      <span className="text-[10px] uppercase font-bold text-[#84796C] block">Style Tone</span>
                      <strong className="text-xs text-[#A67C1E]">Minimal (to be set)</strong>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#EFE5D2] rounded-xl text-[11px] text-[#544A40] border border-[#DCD0BE] flex items-start gap-2">
                  <span className="text-[#A67C1E] text-base leading-none">ⓘ</span>
                  <span>This will be customized further once you select your style preferences.</span>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: STYLE PREFERENCES (Matches Image 4) */}
          {currentStep === 2 && (
            <div className="py-6 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (7 Cols) */}
              <div className="xl:col-span-7 space-y-6">
                <div>
                  <h3 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1C1612]">
                    What's your style?
                  </h3>
                  <p className="text-xs text-[#544A40] mt-1">
                    Select the styles you like. You can choose multiple.
                  </p>
                </div>

                {/* 8 Style Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'Minimal', label: 'Minimal', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80' },
                    { id: 'Casual', label: 'Casual', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80' },
                    { id: 'Streetwear', label: 'Streetwear', img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&q=80' },
                    { id: 'Classic', label: 'Classic', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80' },
                    { id: 'Trendy', label: 'Trendy', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
                    { id: 'Luxury', label: 'Luxury', img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80' },
                    { id: 'Sporty', label: 'Sporty', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80' },
                    { id: 'Traditional', label: 'Traditional', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
                  ].map(style => {
                    const isSelected = selectedStyles.includes(style.id);
                    return (
                      <div
                        key={style.id}
                        onClick={() => toggleStyle(style.id)}
                        className={`rounded-2xl overflow-hidden border p-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-black bg-black text-white shadow-md'
                            : 'border-[#DCD0BE] bg-[#FCF8F2] text-[#1C1612] hover:border-black'
                        }`}
                      >
                        <div className="aspect-square rounded-xl overflow-hidden relative mb-2 bg-neutral-900">
                          <img
                            src={style.img}
                            alt={style.label}
                            className="w-full h-full object-cover"
                          />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center border border-white">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-bold block text-center truncate">
                          {style.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Fit Preference */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#544A40] mb-2">
                    Fit Preference · How do you like your clothes to fit?
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'Slim Fit', label: 'Slim Fit', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80' },
                      { id: 'Regular Fit', label: 'Regular Fit', img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=300&q=80' },
                      { id: 'Loose Fit', label: 'Loose Fit', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80' },
                    ].map(fit => (
                      <div
                        key={fit.id}
                        onClick={() => setFitPreference(fit.id as any)}
                        className={`rounded-xl border p-2 text-center cursor-pointer transition-all ${
                          fitPreference === fit.id
                            ? 'border-black bg-black text-white shadow-sm'
                            : 'border-[#DCD0BE] bg-[#FCF8F2] text-[#1C1612]'
                        }`}
                      >
                        <div className="aspect-[4/5] rounded-lg overflow-hidden mb-1.5 bg-neutral-900">
                          <img src={fit.img} alt={fit.label} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[11px] font-bold block">{fit.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferred Colours Swatches */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#544A40] mb-2">
                    Preferred Colours · Select the colours you like the most
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { name: 'Black', hex: '#1C1612' },
                      { name: 'White', hex: '#FFFFFF' },
                      { name: 'Beige', hex: '#D7C4A5' },
                      { name: 'Grey', hex: '#808080' },
                      { name: 'Navy', hex: '#1E293B' },
                      { name: 'Brown', hex: '#6E482F' },
                      { name: 'Olive', hex: '#556B2F' },
                      { name: 'Blue', hex: '#3B82F6' },
                      { name: 'Green', hex: '#15803D' },
                      { name: 'Red', hex: '#B91C1C' },
                      { name: 'Pink', hex: '#F472B6' },
                    ].map(col => {
                      const isSelected = selectedColours.includes(col.name);
                      return (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => toggleColour(col.name)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-black bg-black text-white shadow-sm'
                              : 'border-[#DCD0BE] bg-[#FCF8F2] text-[#1C1612]'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span>{col.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preferred Outfits (Matching Image 4) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#544A40] mb-2">
                    Preferred Outfits · What do you usually wear the most?
                  </label>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    {[
                      { id: 'Tops', label: 'Tops', icon: '👕' },
                      { id: 'Bottoms', label: 'Bottoms', icon: '👖' },
                      { id: 'Outerwear', label: 'Outerwear', icon: '🧥' },
                      { id: 'Shoes', label: 'Shoes', icon: '👟' },
                      { id: 'Accessories', label: 'Accessories', icon: '⌚' },
                    ].map(piece => {
                      const isSelected = preferredOutfitPieces.includes(piece.id);
                      return (
                        <button
                          key={piece.id}
                          type="button"
                          onClick={() => {
                            if (preferredOutfitPieces.includes(piece.id)) {
                              setPreferredOutfitPieces(preferredOutfitPieces.filter(p => p !== piece.id));
                            } else {
                              setPreferredOutfitPieces([...preferredOutfitPieces, piece.id]);
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isSelected
                              ? 'bg-black text-white border-black shadow-sm'
                              : 'bg-[#FCF8F2] text-[#544A40] border-[#DCD0BE] hover:border-black'
                          }`}
                        >
                          <span className="text-xl mb-1">{piece.icon}</span>
                          <span className="text-[10px]">{piece.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Level of Formality Slider */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#544A40] mb-2">
                    Level of Formality · What's your usual style?
                  </label>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {['Very Casual', 'Casual', 'Smart Casual', 'Formal'].map(lvl => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFormalityLevel(lvl)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          formalityLevel === lvl
                            ? 'bg-black text-white border-black shadow-sm'
                            : 'bg-[#FCF8F2] text-[#544A40] border-[#DCD0BE]'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Your Style Moodboard (5 Cols) (Matches Image 4) */}
              <div className="xl:col-span-5 bg-[#FCF8F2] rounded-3xl p-6 border border-[#E2D3BD] shadow-lg sticky top-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5D5BC]">
                  <h4 className="font-playfair text-xl font-bold text-[#1C1612]">
                    Your Style Moodboard
                  </h4>
                  <span className="text-[10px] font-mono uppercase bg-[#EFE5D2] px-2.5 py-0.5 rounded-full border border-[#DCD0BE] text-[#84796C] font-semibold">
                    Live Preview
                  </span>
                </div>
                <p className="text-[11px] text-[#544A40] mt-2 mb-4">
                  A quick preview based on your selections.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-neutral-900 border border-[#DCD0BE]">
                    <img
                      src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
                      alt="Moodboard Look"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Flat Lay Grid */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-[#EFE5D2] p-2 rounded-xl border border-[#DCD0BE] flex flex-col items-center justify-center">
                      <span className="text-2xl mb-1">👔</span>
                      <span className="text-[9px] font-bold text-[#1C1612]">Black Shirt</span>
                    </div>
                    <div className="bg-[#EFE5D2] p-2 rounded-xl border border-[#DCD0BE] flex flex-col items-center justify-center">
                      <span className="text-2xl mb-1">👖</span>
                      <span className="text-[9px] font-bold text-[#1C1612]">Beige Pants</span>
                    </div>
                    <div className="bg-[#EFE5D2] p-2 rounded-xl border border-[#DCD0BE] flex flex-col items-center justify-center">
                      <span className="text-2xl mb-1">👟</span>
                      <span className="text-[9px] font-bold text-[#1C1612]">Sneakers</span>
                    </div>
                    <div className="bg-[#EFE5D2] p-2 rounded-xl border border-[#DCD0BE] flex flex-col items-center justify-center">
                      <span className="text-2xl mb-1">⌚</span>
                      <span className="text-[9px] font-bold text-[#1C1612]">Leather Watch</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#EFE5D2] p-3 rounded-xl border border-[#DCD0BE] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#84796C]">Selected Styles:</span>
                    <strong className="text-[#1C1612]">{selectedStyles.join(', ')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#84796C]">Fit Profile:</span>
                    <strong className="text-[#1C1612]">{fitPreference}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#84796C]">Formality:</span>
                    <strong className="text-[#A67C1E]">{formalityLevel}</strong>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: GOALS & INTERESTS (Matches Image 5) */}
          {currentStep === 3 && (
            <div className="py-6 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (7 Cols) */}
              <div className="xl:col-span-7 space-y-6">
                <div>
                  <h3 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1C1612]">
                    What do you want from OTD?
                  </h3>
                  <p className="text-xs text-[#544A40] mt-1">
                    Select your goals so we can personalize your experience better.
                  </p>
                </div>

                {/* 8 Goals Grid with Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: 'Look good in everyday life', desc: 'Get outfit ideas for daily use (college, work, casual, etc.)', icon: '👔' },
                    { title: 'Dress better for special occasions', desc: 'Dates, parties, weddings, events, etc.', icon: '🥂' },
                    { title: 'Travel in style', desc: 'Get destination-based outfit recommendations', icon: '✈️' },
                    { title: 'Build a more versatile wardrobe', desc: 'Make better use of your existing clothes', icon: '✨' },
                    { title: 'Organize my closet', desc: 'Keep track of my clothes and outfits', icon: '🚪' },
                    { title: 'Improve my personal style', desc: 'Get personalized style guidance', icon: '📊' },
                    { title: 'Shop smarter', desc: 'Get suggestions before buying new clothes', icon: '🛍️' },
                    { title: 'Get seasonal recommendations', desc: 'Outfits based on weather and season', icon: '❄️' },
                  ].map(goal => {
                    const isSelected = selectedGoals.includes(goal.title);
                    return (
                      <div
                        key={goal.title}
                        onClick={() => toggleGoal(goal.title)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-black bg-black text-white shadow-md'
                            : 'border-[#DCD0BE] bg-[#FCF8F2] text-[#1C1612] hover:border-black'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-[#EFE5D2] border border-[#DCD0BE] flex items-center justify-center text-lg shrink-0">
                          {goal.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold mb-1 leading-snug">{goal.title}</h4>
                          <p className={`text-[11px] leading-tight ${isSelected ? 'text-neutral-300' : 'text-[#84796C]'}`}>
                            {goal.desc}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-white border-white text-black' : 'border-[#84796C]'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Other Interests & Occasions (5 Cols) (Matches Image 5) */}
              <div className="xl:col-span-5 bg-[#FCF8F2] rounded-3xl p-6 border border-[#E2D3BD] shadow-lg space-y-6">
                
                {/* Other Interests */}
                <div>
                  <h4 className="font-playfair text-lg font-bold text-[#1C1612]">
                    Other Interests (Optional)
                  </h4>
                  <p className="text-[11px] text-[#544A40] mb-3">
                    Helps us give more relevant suggestions.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Fashion Trends', label: 'Fashion Trends', icon: '📊' },
                      { id: 'Sustainable Fashion', label: 'Sustainable Fashion', icon: '🌱' },
                      { id: 'Minimalism', label: 'Minimalism', icon: '〰️' },
                      { id: 'Streetwear', label: 'Streetwear', icon: '🧢' },
                      { id: 'Luxury', label: 'Luxury', icon: '💎' },
                      { id: 'Ethnic Wear', label: 'Ethnic Wear', icon: '👘' },
                      { id: 'Accessories', label: 'Accessories', icon: '⌚' },
                      { id: 'Footwear', label: 'Footwear', icon: '👞' },
                      { id: 'Grooming', label: 'Grooming', icon: '🧴' },
                    ].map(interest => {
                      const isSelected = otherInterests.includes(interest.id);
                      return (
                        <button
                          key={interest.id}
                          type="button"
                          onClick={() => toggleInterest(interest.id)}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isSelected
                              ? 'bg-black text-white border-black'
                              : 'bg-[#EFE5D2] text-[#1C1612] border-[#DCD0BE] hover:border-black'
                          }`}
                        >
                          <span className="text-lg mb-1">{interest.icon}</span>
                          <span className="text-[10px] font-bold leading-tight line-clamp-1">{interest.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Occasions I Usually Dress For */}
                <div>
                  <h4 className="font-playfair text-lg font-bold text-[#1C1612]">
                    Occasions I Usually Dress For
                  </h4>
                  <p className="text-[11px] text-[#544A40] mb-3">
                    Select multiple options.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'College', 'Office', 'Casual Outings', 'Dates',
                      'Parties', 'Weddings', 'Travel', 'Gym'
                    ].map(occ => {
                      const isSelected = occasionsDressedFor.includes(occ);
                      return (
                        <button
                          key={occ}
                          type="button"
                          onClick={() => toggleOccasion(occ)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-black text-white border-black'
                              : 'bg-[#EFE5D2] text-[#1C1612] border-[#DCD0BE] hover:border-black'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          <span>{occ}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* BOTTOM ACTIONS (Back / Next / Finish) */}
          <div className="pt-6 border-t border-[#E5D5BC] flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-6 py-3 rounded-full border border-black/40 text-xs font-bold text-[#1C1612] hover:bg-black/5 flex items-center gap-2 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1 && !fullName.trim()) {
                    setNameError('Please enter your full name before continuing.');
                    return;
                  }
                  setNameError(null);
                  setCurrentStep(prev => prev + 1);
                }}
                className="px-8 py-3.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-9 py-3.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 flex items-center gap-2 cursor-pointer shadow-xl hover:scale-105 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#F2D98D]" />
                <span>Finish & Launch OTD</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
