import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--bg-canvas-subtle)] border-t border-[var(--border-card)] pt-16 pb-12 text-[var(--text-body)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[var(--border-card)]">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-9 rounded-md overflow-hidden border border-[var(--border-gold)] bg-[#F7EFE0] p-0.5 shadow-sm">
                <img src="/otd_logo.png" alt="OTD" className="w-full h-full object-contain" />
              </div>
              <span className="font-cinzel text-base tracking-[0.22em] text-[var(--text-heading)] font-bold">
                MAISON OTD
              </span>
            </div>

            <p className="text-xs text-[var(--text-muted)] max-w-sm leading-relaxed">
              The premier artificial intelligence styling atelier. Precision chromatic algorithms, 
              predictive wardrobe graphs, and bespoke daily curation for the modern connoisseur.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs">
              <a
                href="https://github.com/Vasantjv-2005/Ai-fashion-companion-OTD"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[var(--text-body)] hover:text-[var(--gold-primary)] transition-colors font-medium"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span>GitHub Repository</span>
              </a>
              <span className="text-[var(--border-card)]">·</span>
              <span className="font-mono text-[var(--gold-primary)] text-[11px] font-semibold">Branch: Balaji</span>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--text-heading)]">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#atelier" className="hover:text-[var(--gold-primary)] transition-colors">Interactive Atelier</a></li>
              <li><a href="#pillars" className="hover:text-[var(--gold-primary)] transition-colors">Core Intelligence</a></li>
              <li><a href="#wardrobe" className="hover:text-[var(--gold-primary)] transition-colors">Smart Closet Matrix</a></li>
              <li><a href="#gap-analysis" className="hover:text-[var(--gold-primary)] transition-colors">Closet Gap Engine</a></li>
              <li><a href="#lookbook" className="hover:text-[var(--gold-primary)] transition-colors">Haute Lookbook</a></li>
            </ul>
          </div>

          {/* Tech Stack & Ecosystem (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--text-heading)]">
              Ecosystem & Technology
            </h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Built with Vite 6 + React 19 + TypeScript + Tailwind CSS. 
              Integrated with Node.js Express TypeScript microservices and Flutter Android mobile app.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--gold-primary)] font-semibold">Vite 6</span>
              <span className="px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--gold-primary)] font-semibold">React 19</span>
              <span className="px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--gold-primary)] font-semibold">TypeScript</span>
              <span className="px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--gold-primary)] font-semibold">Flutter Mobile</span>
              <span className="px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--gold-primary)] font-semibold">Express API</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div>
            © 2026 Maison OTD Haute Intelligence. All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[var(--text-body)] hover:text-[var(--gold-primary)] transition-colors cursor-pointer"
          >
            <span>Return to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
