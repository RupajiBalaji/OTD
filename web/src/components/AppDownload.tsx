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
    <section id="download" className="py-24 relative bg-[#08080B] border-t border-[#D4AF37]/20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#D4AF37]/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="glass-card rounded-3xl p-8 sm:p-14 border border-[#D4AF37]/35 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4AF37]/30 bg-[#16161F]">
                <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#EADB9B]">
                  MOBILE COMPANION APPLICATION
                </span>
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-[#FBF9F4] leading-tight">
                Carry Your Couturier <br />
                <span className="italic font-light gold-gradient-text">Wherever You Travel</span>
              </h2>

              <p className="text-sm sm:text-base text-[#AEAAB5] font-light leading-relaxed">
                Download the official standalone Android APK package. No app store waiting lines. 
                Experience instant camera closet digitization, real-time weather synchronization, 
                and private local encryption for your wardrobe archives.
              </p>

              {/* Specs & Security Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#121217] border border-[#23232D]">
                  <span className="text-[10px] text-[#7C7885] uppercase tracking-wider block">Package</span>
                  <span className="text-xs font-semibold text-[#ECE9E3]">Android APK (v1.0.0)</span>
                </div>
                <div className="p-3 rounded-xl bg-[#121217] border border-[#23232D]">
                  <span className="text-[10px] text-[#7C7885] uppercase tracking-wider block">File Size</span>
                  <span className="text-xs font-mono text-[#EADB9B] font-semibold">150.0 MB Clean</span>
                </div>
                <div className="p-3 rounded-xl bg-[#121217] border border-[#23232D] col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[#7C7885] uppercase tracking-wider block">Compatibility</span>
                  <span className="text-xs font-semibold text-[#10B981]">Android 8.0+ Ready</span>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <button
                  onClick={onOpenModal}
                  className="gold-btn w-full sm:w-auto px-8 py-4 rounded-full text-xs flex items-center justify-center gap-3 cursor-pointer"
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
              <div className="pt-6 border-t border-[#22222D]">
                <div className="text-[11px] uppercase tracking-wider text-[#A5A1AD] font-semibold mb-3">
                  Quick 30-Second Sideload Instructions:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#9B97A4]">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#EADB9B] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Download the APK file directly to your Android device</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#EADB9B] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Tap the downloaded file; allow "Install from unknown sources"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#EADB9B] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
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
              <div className="relative w-64 sm:w-72 rounded-[40px] p-3 bg-gradient-to-b from-[#2B2B38] via-[#14141A] to-[#0A0A0C] border border-[#D4AF37]/40 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                {/* Inner Screen */}
                <div className="rounded-[32px] overflow-hidden bg-[#0D0D12] border border-[#2B2B36] p-4 text-[#F3F2EE] space-y-4">
                  
                  {/* Phone Status Bar */}
                  <div className="flex justify-between items-center text-[10px] text-[#86838F] px-2 font-mono">
                    <span>09:41</span>
                    <div className="w-16 h-3.5 bg-black rounded-full mx-auto" />
                    <span>5G · 100%</span>
                  </div>

                  {/* App Header */}
                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] block">MAISON OTD</span>
                      <span className="text-xs font-serif-luxury font-bold">Good Morning, Curator</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#1C1C26] border border-[#D4AF37]/30 flex items-center justify-center text-xs">
                      ✨
                    </div>
                  </div>

                  {/* Today Card in Mockup */}
                  <div className="p-3 rounded-2xl bg-gradient-to-b from-[#1C1C26] to-[#121217] border border-[#D4AF37]/25 space-y-2">
                    <div className="flex justify-between text-[9px] text-[#A6A2AE]">
                      <span>Today's Outfit</span>
                      <span className="text-[#D4AF37]">Milan · 14°C</span>
                    </div>
                    <div className="text-sm font-serif-luxury font-medium text-[#FAF8F5]">
                      The Sovereign Double-Breasted
                    </div>
                    <div className="grid grid-cols-3 gap-1 pt-1">
                      <div className="h-14 bg-[#181822] rounded-lg border border-[#2A2A38] flex items-center justify-center text-lg">
                        🧥
                      </div>
                      <div className="h-14 bg-[#181822] rounded-lg border border-[#2A2A38] flex items-center justify-center text-lg">
                        👔
                      </div>
                      <div className="h-14 bg-[#181822] rounded-lg border border-[#2A2A38] flex items-center justify-center text-lg">
                        👞
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation Mock */}
                  <div className="flex justify-around text-base pt-2 text-[#7C7885] border-t border-[#1C1C26]">
                    <span className="text-[#D4AF37]">✦</span>
                    <span>🧥</span>
                    <span>📷</span>
                    <span>🔍</span>
                    <span>👤</span>
                  </div>

                </div>
              </div>

              {/* Direct QR Code Hint */}
              <div className="mt-6 flex items-center gap-3 bg-[#13131A] px-4 py-2.5 rounded-full border border-[#D4AF37]/25 text-xs text-[#AEAAB5]">
                <QrCode className="w-4 h-4 text-[#D4AF37]" />
                <span>Scan with phone camera or download above</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
