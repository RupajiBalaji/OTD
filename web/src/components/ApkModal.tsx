import { useState } from 'react';
import { X, Download, Copy, Check, ShieldCheck } from 'lucide-react';


interface ApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkModal: React.FC<ApkModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const downloadUrl = window.location.origin + '/fashion_otd_companion.apk';

  const handleCopy = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-[var(--border-gold)] shadow-2xl bg-[var(--bg-card-elevated)] text-[var(--text-body)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--pill-bg)] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-10 rounded-lg overflow-hidden border border-[var(--border-gold)] bg-[#F7EFE0] p-0.5 shadow-sm shrink-0">
            <img src="/otd_logo.png" alt="OTD" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[var(--text-heading)]">
              Download OTD
            </h3>
            <p className="text-xs text-[var(--gold-primary)] font-semibold font-mono">Outfit Of The Day (Android APK v1.0.0)</p>
          </div>

        </div>

        {/* Specs Table */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-[var(--bg-card-inner)] p-3.5 rounded-2xl border border-[var(--border-card)] text-xs">
          <div>
            <span className="text-[var(--text-muted)] block text-[10px] uppercase font-medium">File Name</span>
            <span className="font-mono text-[var(--gold-primary)] truncate block font-bold">fashion_otd_companion.apk</span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block text-[10px] uppercase font-medium">Size</span>
            <span className="font-mono text-[var(--text-heading)] font-semibold">150.0 MB</span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block text-[10px] uppercase font-medium">Operating System</span>
            <span className="text-[var(--text-heading)] font-semibold">Android 8.0 or Newer</span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block text-[10px] uppercase font-medium">Security</span>
            <span className="text-[#10B981] flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Build
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href="/fashion_otd_companion.apk"
            download="fashion_otd_companion.apk"
            onClick={onClose}
            className="gold-btn w-full py-4 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer text-center block shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download APK Directly (150 MB)</span>
          </a>

          <button
            onClick={handleCopy}
            className="gold-btn-outline w-full py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Shareable Link for Friends'}</span>
          </button>
        </div>

        {/* Sideload hint */}
        <div className="mt-5 p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-card)] text-[11px] text-[var(--text-body)] leading-relaxed">
          <strong className="text-[var(--gold-primary)]">Android Sideload Note:</strong> If prompted with "File might be harmful", select <strong>Download anyway</strong> and grant permission to install from your browser.
        </div>

      </div>
    </div>
  );
};
