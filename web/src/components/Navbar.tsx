import { useState } from 'react';
import { Download, Menu, X } from 'lucide-react';


interface NavbarProps {
  onOpenDownload: () => void;
  onExploreDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDownload, onExploreDemo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0C]/85 border-b border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Monogram */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-[#D4AF37]/40 bg-gradient-to-br from-[#1A1A22] to-[#0D0D11] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:border-[#D4AF37] transition-all duration-300">
              <span className="font-serif-luxury text-lg font-bold text-[#EAD087]">OTD</span>
            </div>
            <div>
              <span className="font-cinzel text-lg tracking-[0.25em] text-[#F5F2EB] font-bold block">MAISON OTD</span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]/80 block">Haute AI Styling Atelier</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 text-xs tracking-[0.18em] uppercase font-medium text-[#C4C2BA]">
            <a href="#atelier" className="hover:text-[#F3E5AB] transition-colors py-1">Interactive Atelier</a>
            <a href="#pillars" className="hover:text-[#F3E5AB] transition-colors py-1">Core Intelligence</a>
            <a href="#wardrobe" className="hover:text-[#F3E5AB] transition-colors py-1">Smart Closet</a>
            <a href="#gap-analysis" className="hover:text-[#F3E5AB] transition-colors py-1">Wardrobe Gaps</a>
            <a href="#lookbook" className="hover:text-[#F3E5AB] transition-colors py-1">Lookbook</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={onExploreDemo}
              className="text-xs uppercase tracking-[0.15em] text-[#D8C795] hover:text-[#FFF] px-4 py-2.5 rounded-full border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition-all duration-300"
            >
              Try Live Demo
            </button>
            <button
              onClick={onOpenDownload}
              className="gold-btn px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get Android APK</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={onOpenDownload}
              className="gold-btn px-3 py-1.5 rounded-full text-[11px] flex items-center gap-1.5"
            >
              <Download className="w-3 h-3" />
              <span>APK</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#D4AF37] hover:bg-[#1A1A22] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D0D11]/98 border-b border-[#D4AF37]/20 px-6 py-6 space-y-4">
          <a
            href="#atelier"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm tracking-[0.15em] uppercase text-[#E5E1D5] hover:text-[#D4AF37]"
          >
            Interactive Atelier
          </a>
          <a
            href="#pillars"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm tracking-[0.15em] uppercase text-[#E5E1D5] hover:text-[#D4AF37]"
          >
            Core Intelligence
          </a>
          <a
            href="#wardrobe"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm tracking-[0.15em] uppercase text-[#E5E1D5] hover:text-[#D4AF37]"
          >
            Smart Closet
          </a>
          <a
            href="#gap-analysis"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm tracking-[0.15em] uppercase text-[#E5E1D5] hover:text-[#D4AF37]"
          >
            Wardrobe Gaps
          </a>
          <a
            href="#download"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDownload();
            }}
            className="block text-sm tracking-[0.15em] uppercase text-[#D4AF37] font-semibold"
          >
            Download Mobile App (.APK)
          </a>
        </div>
      )}
    </header>
  );
};
