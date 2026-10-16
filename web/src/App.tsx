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

function AppContent() {
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddPieceModalOpen, setIsAddPieceModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-body)] flex flex-col selection:bg-[var(--gold-primary)]/30 selection:text-[var(--text-heading)] transition-colors duration-300">
      {/* Navigation Header with Logo, Light/Dark Switcher, Profile & Garment Add */}
      <Navbar
        onOpenDownload={handleOpenDownload}
        onExploreDemo={handleExploreDemo}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAddPiece={() => setIsAddPieceModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Context-First Hero: "Where are you going?" + Result Screen & Conversational Modifier */}
        <Hero
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onExploreDemo={handleExploreDemo}
        />

        {/* Live Interactive Atelier Simulator */}
        <InteractiveStylist />

        {/* 4 Pillars of Wardrobe Intelligence */}
        <Pillars />

        {/* Smart Closet Digital Matrix with Practical AI Styling Attributes */}
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

      {/* Direct APK Download Modal */}
      <ApkModal
        isOpen={isApkModalOpen}
        onClose={handleCloseDownload}
      />

      {/* User Profile & Style DNA Calibration Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Add Garment / Photo Upload & AI Scan Modal */}
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
