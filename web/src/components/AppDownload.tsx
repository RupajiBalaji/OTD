import { useState } from 'react';
import { Download, Smartphone, QrCode, Copy, Check } from 'lucide-react';

interface AppDownloadProps {
  onOpenModal: () => void;
}

export const AppDownload: React.FC<AppDownloadProps> = ({ onOpenModal }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = window.location.origin + '/fashion_otd_companion.apk';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="download" className="py-24 relative bg-[var(--bg-canvas)] border-t border-[var(--border-card)] overflow-hidden transition-colors duration-300">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[var(--gold-primary)]/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="glass-card rounded-3xl p-8 sm:p-14 border border-[var(--border-card)] shadow-xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[var(--border-gold)] bg-[var(--pill-bg)]">
                <Smartphone className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[var(--gold-primary)] font-mono">
                  MOBILE COMPANION APPLICATION
                </span>
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-[var(--text-heading)] leading-tight">
                Carry Your Couturier <br />
                <span className="italic font-light gold-gradient-text">Wherever You Travel</span>
              </h2>

              <p className="text-sm sm:text-base text-[var(--text-body)] font-light leading-relaxed">
                Download the official standalone Android APK package. No app store waiting lines. 
                Experience instant camera closet digitization, real-time weather synchronization, 
                and private local encryption for your wardrobe archives.
              </p>

              {/* Specs & Security Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-medium">Package</span>
                  <span className="text-xs font-semibold text-[var(--text-heading)]">Android APK (v1.0.0)</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-medium">File Size</span>
                  <span className="text-xs font-mono text-[var(--gold-primary)] font-bold">150.0 MB Clean</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-medium">Compatibility</span>
                  <span className="text-xs font-semibold text-[#10B981]">Android 8.0+ Ready</span>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <button
                  onClick={onOpenModal}
                  className="gold-btn w-full sm:w-auto px-8 py-4 rounded-full text-xs flex items-center justify-center gap-3 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download APK Now (150 MB)</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="gold-btn-outline w-full sm:w-auto px-6 py-4 rounded-full text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Direct APK Link'}</span>
                </button>
              </div>

              {/* 3 Step Installation Guide */}
              <div className="pt-6 border-t border-[var(--border-card)]">
                <div className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-3">
                  Quick 30-Second Sideload Instructions:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[var(--text-body)]">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[var(--pill-bg)] text-[var(--gold-primary)] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border border-[var(--border-gold)]">
                      1
                    </span>
                    <span>Download the APK file directly to your Android device</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[var(--pill-bg)] text-[var(--gold-primary)] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border border-[var(--border-gold)]">
                      2
                    </span>
                    <span>Tap the downloaded file; allow "Install from unknown sources"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[var(--pill-bg)] text-[var(--gold-primary)] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border border-[var(--border-gold)]">
                      3
                    </span>
                    <span>Launch Maison OTD and start digitizing your wardrobe</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Phone Mockup & QR Column */}
            <div className="lg:col-span-5 flex flex-col items-center">
              
              {/* Luxury Device Silhouette */}
              <div className="relative w-64 sm:w-72 rounded-[40px] p-3 bg-gradient-to-b from-[var(--border-gold)] via-[var(--bg-card)] to-[var(--bg-card-inner)] border border-[var(--border-gold)] shadow-xl">
                {/* Inner Screen */}
                <div className="rounded-[32px] overflow-hidden bg-[var(--bg-canvas)] border border-[var(--border-card)] p-4 text-[var(--text-body)] space-y-4">
                  
                  {/* Phone Status Bar */}
                  <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] px-2 font-mono">
                    <span>09:41</span>
                    <div className="w-16 h-3.5 bg-black/40 dark:bg-black rounded-full mx-auto" />
                    <span>5G · 100%</span>
                  </div>

                  {/* App Header with Logo */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2">
                      <img src="/otd_logo.png" alt="OTD" className="w-6 h-7 object-contain" />
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[var(--gold-primary)] block font-mono font-semibold">MAISON OTD</span>
                        <span className="text-xs font-serif-luxury font-bold text-[var(--text-heading)]">Good Morning, Curator</span>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[var(--pill-bg)] border border-[var(--border-gold)] flex items-center justify-center text-xs">
                      ✨
                    </div>
                  </div>

                  {/* Today Card in Mockup */}
                  <div className="p-3 rounded-2xl bg-[var(--bg-card-elevated)] border border-[var(--border-card)] space-y-2 shadow-sm">
                    <div className="flex justify-between text-[9px] text-[var(--text-muted)]">
                      <span>Today's Outfit</span>
                      <span className="text-[var(--gold-primary)] font-medium">Milan · 14°C</span>
                    </div>
                    <div className="text-sm font-serif-luxury font-medium text-[var(--text-heading)]">
                      The Sovereign Double-Breasted
                    </div>
                    <div className="grid grid-cols-3 gap-1 pt-1">
                      <div className="h-14 bg-[var(--bg-card-inner)] rounded-lg border border-[var(--border-card)] flex items-center justify-center text-lg">
                        🧥
                      </div>
                      <div className="h-14 bg-[var(--bg-card-inner)] rounded-lg border border-[var(--border-card)] flex items-center justify-center text-lg">
                        👔
                      </div>
                      <div className="h-14 bg-[var(--bg-card-inner)] rounded-lg border border-[var(--border-card)] flex items-center justify-center text-lg">
                        👞
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation Mock */}
                  <div className="flex justify-around text-base pt-2 text-[var(--text-muted)] border-t border-[var(--border-card)]">
                    <span className="text-[var(--gold-primary)]">✦</span>
                    <span>🧥</span>
                    <span>📷</span>
                    <span>🔍</span>
                    <span>👤</span>
                  </div>

                </div>
              </div>

              {/* Direct QR Code Hint */}
              <div className="mt-6 flex items-center gap-3 bg-[var(--bg-card-inner)] px-4 py-2.5 rounded-full border border-[var(--border-card)] text-xs text-[var(--text-body)] shadow-sm">
                <QrCode className="w-4 h-4 text-[var(--gold-primary)]" />
                <span>Scan with phone camera or download above</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
