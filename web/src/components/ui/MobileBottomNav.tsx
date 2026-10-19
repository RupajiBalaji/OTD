import React from 'react';
import { Home, Shirt, Sparkles, Bookmark, Menu } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: any) => void;
  onOpenMenu: () => void;
  closetCount?: number;
  savedCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenMenu,
  closetCount,
  savedCount,
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-header)]/95 backdrop-blur-xl border-t border-[var(--border-card)] px-3 py-2 flex items-center justify-around shadow-lg transition-colors duration-300"
    >
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeTab === 'home'
            ? 'text-[var(--text-heading)] font-bold'
            : 'text-[var(--text-muted)]'
        }`}
      >
        <Home className="w-4 h-4" />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => onSelectTab('closet')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all relative cursor-pointer ${
          activeTab === 'closet'
            ? 'text-[var(--text-heading)] font-bold'
            : 'text-[var(--text-muted)]'
        }`}
      >
        <Shirt className="w-4 h-4" />
        <span className="text-[10px]">Closet</span>
        {closetCount !== undefined && closetCount > 0 && (
          <span className="absolute -top-0.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[var(--gold-primary)] text-black text-[9px] font-bold flex items-center justify-center">
            {closetCount}
          </span>
        )}
      </button>

      <button
        onClick={() => onSelectTab('stylist')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeTab === 'stylist'
            ? 'text-[var(--gold-primary)] font-bold'
            : 'text-[var(--gold-primary)]/80'
        }`}
      >
        <div className="w-7 h-7 rounded-full bg-[var(--pill-bg)] border border-[var(--border-gold)] flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
        </div>
        <span className="text-[10px] font-semibold text-[var(--gold-primary)]">Stylist</span>
      </button>

      <button
        onClick={() => onSelectTab('saved')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all relative cursor-pointer ${
          activeTab === 'saved'
            ? 'text-[var(--text-heading)] font-bold'
            : 'text-[var(--text-muted)]'
        }`}
      >
        <Bookmark className="w-4 h-4" />
        <span className="text-[10px]">Saved</span>
        {savedCount !== undefined && savedCount > 0 && (
          <span className="absolute -top-0.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[var(--gold-primary)] text-black text-[9px] font-bold flex items-center justify-center">
            {savedCount}
          </span>
        )}
      </button>

      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-all cursor-pointer"
      >
        <Menu className="w-4 h-4" />
        <span className="text-[10px]">Menu</span>
      </button>
    </nav>
  );
};
