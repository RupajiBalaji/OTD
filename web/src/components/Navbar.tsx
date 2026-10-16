import { useState } from 'react';
import { Download, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenDownload: () => void;
  onExploreDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDownload, onExploreDemo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--bg-header)] border-b border-[var(--border-card)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with the Official OTD Artwork */}
          <a href="#" className="flex items-center gap-3 shrink-0 group">
            <div className="h-12 w-10 sm:h-13 sm:w-11 rounded-lg overflow-hidden border border-[var(--border-gold)] shadow-sm bg-[#F7EFE0] flex items-center justify-center p-0.5 group-hover:scale-105 transition-all duration-300">
              <img
                src="/otd_logo.png"
                alt="OTD - Outfit of the Day Haute Couture Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <span className="font-cinzel text-lg sm:text-xl tracking-[0.22em] font-bold text-[var(--text-heading)]">
                  OTD
                </span>
                <span className="text-[var(--gold-primary)] text-xs">✦</span>
              </div>
              <span className="text-[10px] tracking-[0.22em] uppercase text-[var(--gold-primary)] font-mono font-semibold">
                Outfit Of The Day
              </span>
            </div>

          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-[11px] tracking-[0.2em] uppercase font-semibold text-[var(--text-body)]">
            <a
              href="#atelier"
              className="whitespace-nowrap hover:text-[var(--gold-primary)] transition-colors py-1 relative group"
            >
              <span>Atelier</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--gold-primary)] group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="#pillars"
              className="whitespace-nowrap hover:text-[var(--gold-primary)] transition-colors py-1 relative group"
            >
              <span>Intelligence</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--gold-primary)] group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="#wardrobe"
              className="whitespace-nowrap hover:text-[var(--gold-primary)] transition-colors py-1 relative group"
            >
              <span>Closet Matrix</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--gold-primary)] group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="#gap-analysis"
              className="whitespace-nowrap hover:text-[var(--gold-primary)] transition-colors py-1 relative group"
            >
              <span>Wardrobe Gaps</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--gold-primary)] group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="#lookbook"
              className="whitespace-nowrap hover:text-[var(--gold-primary)] transition-colors py-1 relative group"
            >
              <span>Lookbook</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--gold-primary)] group-hover:w-full transition-all duration-300" />
            </a>
          </nav>

          {/* Right Action Buttons + Theme Toggle */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            
            {/* Elegant Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Ivory Light Mode' : 'Switch to Obsidian Dark Mode'}
              aria-label="Toggle theme mode"
              className="p-2.5 rounded-full border border-[var(--border-gold)] bg-[var(--bg-card)] hover:border-[var(--gold-primary)] text-[var(--gold-primary)] transition-all duration-300 cursor-pointer shadow-sm hover:scale-105"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 transition-transform rotate-0 hover:rotate-90 duration-300 text-[#F7E7A9]" />
              ) : (
                <Moon className="w-4 h-4 transition-transform -rotate-12 hover:rotate-0 duration-300 text-[#A67C1E]" />
              )}
            </button>

            <button
              onClick={onExploreDemo}
              className="whitespace-nowrap text-[11px] uppercase tracking-[0.16em] text-[var(--gold-primary)] hover:text-[var(--text-heading)] px-4 py-2 rounded-full border border-[var(--border-gold)] hover:bg-[var(--pill-bg)] transition-all duration-200 cursor-pointer"
            >
              Try Live Demo
            </button>

            <button
              onClick={onOpenDownload}
              className="gold-btn whitespace-nowrap px-4 sm:px-5 py-2.5 rounded-full text-[11px] font-semibold flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Get Android APK</span>
            </button>
          </div>

          {/* Mobile hamburger & Theme button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-[var(--border-gold)] text-[var(--gold-primary)] bg-[var(--bg-card)]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#F7E7A9]" /> : <Moon className="w-4 h-4 text-[#A67C1E]" />}
            </button>
            <button
              onClick={onOpenDownload}
              className="gold-btn px-3 py-1.5 rounded-full text-[10px] font-semibold flex items-center gap-1.5 whitespace-nowrap"
            >
              <Download className="w-3 h-3" />
              <span>APK</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[var(--gold-primary)] hover:bg-[var(--pill-bg)] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--bg-card-elevated)] border-b border-[var(--border-gold)] px-6 py-6 space-y-4 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200">
          <a
            href="#atelier"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.18em] uppercase text-[var(--text-body)] hover:text-[var(--gold-primary)] py-1 font-medium"
          >
            Atelier Simulation
          </a>
          <a
            href="#pillars"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.18em] uppercase text-[var(--text-body)] hover:text-[var(--gold-primary)] py-1 font-medium"
          >
            Core Intelligence
          </a>
          <a
            href="#wardrobe"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.18em] uppercase text-[var(--text-body)] hover:text-[var(--gold-primary)] py-1 font-medium"
          >
            Smart Closet Matrix
          </a>
          <a
            href="#gap-analysis"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.18em] uppercase text-[var(--text-body)] hover:text-[var(--gold-primary)] py-1 font-medium"
          >
            Wardrobe Gaps
          </a>
          <a
            href="#lookbook"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.18em] uppercase text-[var(--text-body)] hover:text-[var(--gold-primary)] py-1 font-medium"
          >
            Haute Lookbook
          </a>
          <div className="pt-3 border-t border-[var(--border-card)]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDownload();
              }}
              className="gold-btn w-full py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Android APK (150 MB)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
