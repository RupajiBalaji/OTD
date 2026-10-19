import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ClosetProvider } from './context/ClosetContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveStylist } from './components/InteractiveStylist';
import { Pillars } from './components/Pillars';
import { WardrobeStudio } from './components/WardrobeStudio';
import { GapIntelligence } from './components/GapIntelligence';
import { Lookbook } from './components/Lookbook';
import { AppDownload } from './components/AppDownload';
import { Footer } from './components/Footer';
import { ApkModal } from './components/ApkModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AddPieceModal } from './components/AddPieceModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { AppStudio } from './components/AppStudio';

function AppContent() {
  const [viewMode, setViewMode] = useState<'landing' | 'studio'>('landing');
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddPieceModalOpen, setIsAddPieceModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleOpenDownload = () => {
    setIsApkModalOpen(true);
  };

  const handleCloseDownload = () => {
    setIsApkModalOpen(false);
  };

  const handleExploreDemo = () => {
    const el = document.getElementById('atelier');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (viewMode === 'studio') {
    return (
      <>
        <AppStudio
          onOpenAddPiece={() => setIsAddPieceModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onBackToLanding={() => setViewMode('landing')}
        />

        {/* Global Modals in Studio */}
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
        <AddPieceModal
          isOpen={isAddPieceModalOpen}
          onClose={() => setIsAddPieceModalOpen(false)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-body)] flex flex-col selection:bg-[var(--gold-primary)]/30 selection:text-[var(--text-heading)] transition-colors duration-300">
      {/* Navigation Header matching Screenshot 1 */}
      <Navbar
        onOpenDownload={handleOpenDownload}
        onExploreDemo={handleExploreDemo}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAddPiece={() => setIsAddPieceModalOpen(true)}
        onOpenOnboarding={() => setIsOnboardingModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLaunchStudio={() => setViewMode('studio')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section matching Screenshot 1 + Context Engine matching Screenshot 2 */}
        <Hero
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenOnboarding={() => setIsOnboardingModalOpen(true)}
          onExploreDemo={handleExploreDemo}
        />

        {/* Live Interactive Atelier Simulator */}
        <InteractiveStylist />

        {/* 4 Pillars of Wardrobe Intelligence */}
        <Pillars />

        {/* Smart Closet Digital Matrix (Screenshot 2: Screen 11) */}
        <WardrobeStudio
          onOpenAddPiece={() => setIsAddPieceModalOpen(true)}
        />

        {/* Closet Gap Intelligence Graph */}
        <GapIntelligence />

        {/* Haute Editorial Lookbook */}
        <Lookbook />

        {/* Mobile APK Download Section */}
        <AppDownload onOpenModal={handleOpenDownload} />
      </main>

      {/* Luxury Footer */}
      <Footer />

      {/* Dedicated Authentication Modal (Matching Reference Screenshot) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Direct APK Download Modal */}
      <ApkModal
        isOpen={isApkModalOpen}
        onClose={handleCloseDownload}
      />

      {/* Complete 4-Step Onboarding Modal (Screenshots 3, 4, 5) */}
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        onComplete={() => {
          setViewMode('studio');
        }}
      />

      {/* Quick User Profile & Style DNA Calibration Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Add Garment / Photo Upload & AI Scan Modal (Screenshot 2: Screen 12) */}
      <AddPieceModal
        isOpen={isAddPieceModalOpen}
        onClose={() => setIsAddPieceModalOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <ClosetProvider>
        <AppContent />
      </ClosetProvider>
    </ThemeProvider>
  );
}

export default App;
