import React, { useState } from 'react';
import { Download, Menu, X, Sun, Moon, ArrowRight, Sparkles, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenDownload: () => void;
  onExploreDemo: () => void;
  onOpenProfile?: () => void;
  onOpenAddPiece?: () => void;
  onOpenOnboarding?: () => void;
  onOpenAuth?: () => void;
  onLaunchStudio?: () => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDownload,
  onExploreDemo,
  onOpenProfile,
  onOpenAddPiece,
  onOpenOnboarding,
  onOpenAuth,
  onLaunchStudio,
  isAuthenticated = false,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--bg-header)] border-b border-[var(--border-card)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Mark: OTD Atelier */}
          <a href="#" className="flex items-center gap-3.5 shrink-0 group">
            <div className="h-11 w-10 sm:h-12 sm:w-11 rounded-lg overflow-hidden border border-[var(--border-gold)] shadow-sm bg-[#F7EFE0] flex items-center justify-center p-0.5 group-hover:scale-105 transition-all duration-300">
              <img
                src="/otd_logo.png"
                alt="OTD Atelier Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-lg sm:text-xl tracking-[0.25em] font-bold text-[var(--text-heading)]">
                  OTD
                </span>
                <span className="text-[10px] tracking-[0.3em] font-mono uppercase text-[var(--gold-primary)] font-semibold border-l border-[var(--border-gold)] pl-2">
                  ATELIER
                </span>
              </div>
              <span className="text-[9px] tracking-[0.22em] uppercase text-[var(--text-muted)] font-mono">
                Haute Sartorial Intelligence
              </span>
            </div>
          </a>

          {/* Desktop Editorial Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-9 text-[11px] font-medium tracking-[0.14em] uppercase text-[var(--text-body)]">
            <button
              type="button"
              onClick={onExploreDemo}
              className="hover:text-[var(--text-heading)] transition-colors py-1 relative group font-semibold cursor-pointer uppercase"
            >
              <span>The Atelier</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--gold-primary)] group-hover:w-full transition-all duration-300" />
            </button>
            <a
              href="#pillars"
              className="hover:text-[var(--text-heading)] transition-colors py-1 relative group"
            >
              <span>Architecture</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--gold-primary)] group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="#wardrobe"
              className="hover:text-[var(--text-heading)] transition-colors py-1 relative group"
            >
              <span>Wardrobe & Closet</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--gold-primary)] group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="#gap-analysis"
              className="hover:text-[var(--text-heading)] transition-colors py-1 relative group"
            >
              <span>Gap Engine</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--gold-primary)] group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="#lookbook"
              className="hover:text-[var(--text-heading)] transition-colors py-1 relative group"
            >
              <span>Lookbook</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--gold-primary)] group-hover:w-full transition-all duration-300" />
            </a>
          </nav>

          {/* Right Action Cluster: Clean, Elevated, Restrained */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            
            {/* Theme Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Ivory Light Mode' : 'Switch to Obsidian Dark Mode'}
              aria-label="Toggle theme mode"
              className="p-2.5 rounded-full border border-[var(--border-card)] bg-[var(--bg-card)] hover:border-[var(--gold-primary)] text-[var(--gold-primary)] transition-all duration-200 cursor-pointer shadow-sm"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#F7E7A9]" />
              ) : (
                <Moon className="w-4 h-4 text-[#A67C1E]" />
              )}
            </button>

            {/* Auth Actions: Sign Out (if authenticated) or Sign In */}
            {isAuthenticated ? (
              onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="text-[11px] uppercase tracking-[0.16em] font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 px-2 py-1 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Sign out of Atelier session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              )
            ) : (
              (onOpenAuth || onOpenOnboarding) && (
                <button
                  type="button"
                  onClick={onOpenAuth || onOpenOnboarding}
                  className="text-[11px] uppercase tracking-[0.18em] font-medium text-[var(--text-body)] hover:text-[var(--text-heading)] px-2 py-1 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              )
            )}

            {/* Primary Action Button: Enter Atelier Studio */}
            {onLaunchStudio ? (
              <button
                onClick={onLaunchStudio}
                className="gold-btn px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enter Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onOpenDownload}
                className="gold-btn px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download APK</span>
              </button>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-[var(--border-card)] text-[var(--gold-primary)] bg-[var(--bg-card)]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#F7E7A9]" /> : <Moon className="w-4 h-4 text-[#A67C1E]" />}
            </button>
            
            {onLaunchStudio && (
              <button
                onClick={onLaunchStudio}
                className="gold-btn px-3.5 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5"
              >
                <span>Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[var(--text-heading)] hover:bg-[var(--pill-bg)] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--bg-card-elevated)] border-b border-[var(--border-card)] px-6 py-6 space-y-4 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200">
          <a
            href="#atelier"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.18em] uppercase text-[var(--text-heading)] font-semibold py-1.5"
          >
            The Atelier
          </a>
          <a
            href="#pillars"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.18em] uppercase text-[var(--text-body)] hover:text-[var(--text-heading)] py-1.5"
          >
            Architecture
          </a>
          <a
            href="#wardrobe"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.18em] uppercase text-[var(--text-body)] hover:text-[var(--text-heading)] py-1.5"
          >
            Wardrobe & Closet
          </a>
          <a
            href="#gap-analysis"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.18em] uppercase text-[var(--text-body)] hover:text-[var(--text-heading)] py-1.5"
          >
            Gap Engine
          </a>
          <a
            href="#lookbook"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.18em] uppercase text-[var(--text-body)] hover:text-[var(--text-heading)] py-1.5"
          >
            Editorial Lookbook
          </a>

          <div className="pt-4 border-t border-[var(--border-card)] space-y-2.5">
            {onOpenProfile && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="w-full text-left text-xs uppercase tracking-wider py-1.5 text-[var(--text-body)]"
              >
                Style DNA Calibration
              </button>
            )}
            {onOpenAddPiece && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAddPiece();
                }}
                className="w-full text-left text-xs uppercase tracking-wider py-1.5 text-[var(--text-body)]"
              >
                Upload Wardrobe Piece
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDownload();
              }}
              className="w-full text-left text-xs uppercase tracking-wider py-1.5 text-[var(--gold-primary)] font-semibold"
            >
              Download Android APK (v1.0)
            </button>

            {isAuthenticated && onLogout && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full text-left text-xs uppercase tracking-wider py-1.5 text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-2 border-t border-[var(--border-card)] pt-2 mt-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Atelier</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
