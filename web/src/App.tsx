import { useState, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ClosetProvider } from './context/ClosetContext';
import { ToastProvider } from './components/ui/Toast';
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
import { QualityGateShowcase } from './components/character/QualityGateShowcase';

const AppStudio = lazy(() =>
  import('./components/AppStudio').then((m) => ({ default: m.AppStudio }))
);

function AppContent() {
  const isQualityGate =
    typeof window !== 'undefined' &&
    (window.location.search.includes('quality-gate') || window.location.hash.includes('quality-gate'));

  if (isQualityGate) {
    return <QualityGateShowcase />;
  }

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('otd_access_token');
  });
  const [viewMode, setViewMode] = useState<'landing' | 'studio'>(() => {
    return localStorage.getItem('otd_access_token') ? 'studio' : 'landing';
  });
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddPieceModalOpen, setIsAddPieceModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleAuthError = () => {
      setIsAuthModalOpen(true);
    };
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem('otd_access_token'));
    };

    window.addEventListener('otd_auth_error', handleAuthError);
    window.addEventListener('otd_auth_change', handleAuthChange);
    return () => {
      window.removeEventListener('otd_auth_error', handleAuthError);
      window.removeEventListener('otd_auth_change', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('otd_access_token');
    localStorage.removeItem('otd_refresh_token');
    localStorage.removeItem('otd_user');
    setIsAuthenticated(false);
    setViewMode('landing');
    window.dispatchEvent(new Event('otd_auth_change'));
  };

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

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F7EFE0] dark:bg-[#09090C] text-[#1C1612] dark:text-[#F7EFE0] flex flex-col items-center justify-center p-6 transition-colors duration-500 animate-in fade-in">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="w-16 h-20 rounded-2xl bg-[#FAF5ED] p-2 border border-[#D5C29D] shadow-lg flex items-center justify-center animate-pulse">
            <img src="/otd_logo.png" alt="OTD" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase font-bold text-[#A67C1E] dark:text-[#F2D98D] block">
              OUTFIT OF THE DAY
            </span>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-heading)] mt-1">
              Your style. Every place.
            </h1>
          </div>
          <div className="w-14 h-1 bg-[#D4AF37]/30 rounded-full overflow-hidden mt-2">
            <div className="w-full h-full bg-[#D4AF37] animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'studio') {
    return (
      <Suspense
        fallback={
          <div className="fixed inset-0 z-50 bg-[#F7EFE0] dark:bg-[#09090C] text-[#1C1612] dark:text-[#F7EFE0] flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 border-2 border-[var(--gold-primary)] border-t-transparent rounded-full animate-spin mb-4" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--gold-primary)]">
              Entering Couture Studio...
            </span>
          </div>
        }
      >
        <AppStudio
          onOpenAddPiece={() => setIsAddPieceModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onBackToLanding={() => setViewMode('landing')}
          onLogout={handleLogout}
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
          onSuccess={() => {
            setIsAuthenticated(true);
            setViewMode('studio');
          }}
        />
      </Suspense>
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
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
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
        onSuccess={() => {
          setIsAuthenticated(true);
          setViewMode('studio');
        }}
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
      <ToastProvider>
        <ClosetProvider>
          <AppContent />
        </ClosetProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
