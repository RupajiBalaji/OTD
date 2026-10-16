import { useState } from 'react';
import { Download, Menu, X } from 'lucide-react';


interface NavbarProps {
  onOpenDownload: () => void;
  onExploreDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDownload, onExploreDemo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0C]/90 border-b border-[#D4AF37]/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Logo / Brand Name - Clean, Unbroken, Luxury Monogram */}
          <a href="#" className="flex items-center gap-3 shrink-0 group">
            <div className="w-9 h-9 rounded-full border border-[#D4AF37]/50 bg-gradient-to-br from-[#1C1C24] to-[#0A0A0E] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:border-[#D4AF37] transition-all">
              <span className="font-serif-luxury text-base font-bold text-[#F7E7A9] tracking-wider">O</span>
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <span className="font-cinzel text-sm sm:text-base tracking-[0.22em] text-[#FAF8F5] font-bold">
                  MAISON OTD
                </span>
                <span className="text-[#D4AF37] text-xs">✦</span>
              </div>
              <span className="text-[9px] tracking-[0.28em] uppercase text-[#D4AF37]/75 font-mono">
                Haute AI Atelier
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links - Single-line, elegant, never wrapping */}
          <nav className="hidden lg:flex items-center space-x-7 text-[11px] tracking-[0.2em] uppercase font-medium text-[#C5C2B8]">
            <a
              href="#atelier"
              className="whitespace-nowrap hover:text-[#F7E7A9] transition-colors py-1 relative group"
            >
              <span>Atelier</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="#pillars"
              className="whitespace-nowrap hover:text-[#F7E7A9] transition-colors py-1 relative group"
            >
              <span>Intelligence</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="#wardrobe"
              className="whitespace-nowrap hover:text-[#F7E7A9] transition-colors py-1 relative group"
            >
              <span>Closet Matrix</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="#gap-analysis"
              className="whitespace-nowrap hover:text-[#F7E7A9] transition-colors py-1 relative group"
            >
              <span>Wardrobe Gaps</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="#lookbook"
              className="whitespace-nowrap hover:text-[#F7E7A9] transition-colors py-1 relative group"
            >
              <span>Lookbook</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] group-hover:w-full transition-all duration-300" />
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onExploreDemo}
              className="whitespace-nowrap text-[11px] uppercase tracking-[0.16em] text-[#D8C795] hover:text-[#FFF] px-4 py-2 rounded-full border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5 transition-all duration-200 cursor-pointer"
            >
              Try Live Demo
            </button>
            <button
              onClick={onOpenDownload}
              className="gold-btn whitespace-nowrap px-4 sm:px-5 py-2 rounded-full text-[11px] font-semibold flex items-center gap-2 cursor-pointer shrink-0 shadow-md"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Get Android APK</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenDownload}
              className="gold-btn px-3 py-1.5 rounded-full text-[10px] font-semibold flex items-center gap-1.5 whitespace-nowrap"
            >
              <Download className="w-3 h-3" />
              <span>APK</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#D4AF37] hover:bg-[#1A1A22] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D0D12]/98 border-b border-[#D4AF37]/20 px-6 py-6 space-y-4 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200">
          <a
            href="#atelier"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.18em] uppercase text-[#E5E1D5] hover:text-[#D4AF37] py-1"
          >
            Atelier Simulation
          </a>
          <a
            href="#pillars"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.18em] uppercase text-[#E5E1D5] hover:text-[#D4AF37] py-1"
          >
            Core Intelligence
          </a>
          <a
            href="#wardrobe"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.18em] uppercase text-[#E5E1D5] hover:text-[#D4AF37] py-1"
          >
            Smart Closet Matrix
          </a>
          <a
            href="#gap-analysis"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.18em] uppercase text-[#E5E1D5] hover:text-[#D4AF37] py-1"
          >
            Wardrobe Gaps
          </a>
          <a
            href="#lookbook"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.18em] uppercase text-[#E5E1D5] hover:text-[#D4AF37] py-1"
          >
            Haute Lookbook
          </a>
          <div className="pt-3 border-t border-[#22222D]">
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
